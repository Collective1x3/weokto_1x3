import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../prisma";
import { prismaDelegates } from "./delegates";
import {
  OTP_MAX_ATTEMPTS,
  OTP_TTL_MS,
  generateOtp,
  hashOtp,
} from "./otp";
import { SITE_CONFIGS, type SiteKey } from "./site-config";
import { sendAuthEmail } from "../email/send-auth-email";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function resolveSiteSecret(site: SiteKey) {
  const envKey = SITE_CONFIGS[site].authSecretEnvVar;
  const value =
    process.env[envKey as keyof NodeJS.ProcessEnv] ?? process.env.AUTH_SECRET;
  if (!value) {
    throw new Error(
      `Secret NextAuth manquant pour ${site}. Renseignez ${envKey} ou AUTH_SECRET.`
    );
  }
  return value;
}

export function createSiteAuthConfig(site: SiteKey): NextAuthOptions {
  const config = SITE_CONFIGS[site];
  const delegates = prismaDelegates[site];

  return {
    secret: resolveSiteSecret(site),
    adapter: PrismaAdapter(prisma, {
      modelMapping: {
        User: delegates.user,
        Account: delegates.account,
        Session: delegates.session,
        VerificationToken: delegates.verificationToken,
      },
    }),
    session: {
      strategy: "database",
      maxAge: 14 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    providers: [
      EmailProvider({
        id: `${site}-email`,
        name: `${config.name} Magic Link`,
        maxAge: 15 * 60,
        from:
          process.env[config.fromEnvVar as keyof NodeJS.ProcessEnv] ??
          process.env.RESEND_DEFAULT_FROM,
        async sendVerificationRequest({ identifier, url }) {
          const email = normalizeEmail(identifier);
          const otp = generateOtp(site);
          const hash = hashOtp(site, otp);
          const expires = new Date(Date.now() + OTP_TTL_MS);

          await delegates.otp.deleteMany({
            where: { email },
          });

          await delegates.otp.create({
            data: {
              email,
              codeHash: hash,
              expires,
            },
          });

          const existingUser = await delegates.user.findFirst({
            where: { email },
          });

          await sendAuthEmail({
            site,
            kind: existingUser ? "login" : "signup",
            to: identifier,
            magicLink: url,
            otpCode: otp,
          });
        },
      }),
      CredentialsProvider({
        id: `${site}-otp`,
        name: `${config.name} OTP`,
        credentials: {
          email: { label: "E-mail", type: "email" },
          code: { label: "Code", type: "text" },
        },
        async authorize(credentials) {
          const email = credentials?.email
            ? normalizeEmail(credentials.email)
            : null;
          const code = credentials?.code?.replace(/\s+/g, "");

          if (!email || !code || code.length !== config.otpLength) {
            throw new Error("Email ou code OTP invalide.");
          }

          const record = await delegates.otp.findFirst({
            where: { email },
            orderBy: { createdAt: "desc" },
          });

          if (!record) {
            throw new Error("OTP expiré ou inexistant.");
          }

          const now = new Date();

          if (record.consumedAt) {
            throw new Error("OTP déjà utilisé.");
          }

          if (record.expires.getTime() < now.getTime()) {
            await delegates.otp.update({
              where: { id: record.id },
              data: { consumedAt: now, lastAttempt: now },
            });
            throw new Error("OTP expiré. Demandez un nouveau code.");
          }

          if (record.attempts >= OTP_MAX_ATTEMPTS) {
            throw new Error(
              "Trop de tentatives. Demandez un nouveau code OTP."
            );
          }

          const hashed = hashOtp(site, code);
          if (hashed !== record.codeHash) {
            await delegates.otp.update({
              where: { id: record.id },
              data: {
                attempts: { increment: 1 },
                lastAttempt: now,
              },
            });
            throw new Error("Code OTP incorrect.");
          }

          await delegates.otp.update({
            where: { id: record.id },
            data: {
              consumedAt: now,
              lastAttempt: now,
              attempts: { increment: 1 },
            },
          });

          await delegates.otp.deleteMany({
            where: {
              email,
              id: { not: record.id },
            },
          });

          const existingUser = await delegates.user.findFirst({
            where: { email },
          });

          const user =
            existingUser ??
            (await delegates.user.create({
              data: {
                email,
                createdAt: now,
              },
            }));

          return {
            id: user.id,
            email: user.email ?? undefined,
            name: user.pseudo ?? undefined,
          };
        },
      }),
    ],
    callbacks: {
      async session({ session, user }) {
        if (session.user) {
          session.user.id = user.id;
          session.user.email = user.email ?? undefined;
          session.user.site = site;
          session.user.pseudo =
            user.pseudo ??
            (user as unknown as { pseudo?: string | null }).pseudo ??
            null;
        }
        return session;
      },
    },
    events: {
      async signIn({ user, isNewUser }) {
        if (isNewUser && user.email) {
          await delegates.otp.deleteMany({
            where: { email: normalizeEmail(user.email) },
          });
        }
      },
    },
    pages: {
      signIn: config.signinPath,
      verifyRequest: config.signinPath,
    },
  };
}
