import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { prismaDelegates } from "./delegates";
import { createSiteAdapter } from "./site-adapter";
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
  const explicit = process.env[envKey as keyof NodeJS.ProcessEnv];
  if (explicit && explicit.length > 0) {
    return explicit;
  }

  const shared =
    process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? process.env.SECRET;
  if (shared && shared.length > 0) {
    return shared;
  }

  if (process.env.NODE_ENV !== "production") {
    console.warn(
      `[auth] Secret manquant pour ${site}. Utilisation d'un secret de développement.`
    );
  } else {
    console.error(
      `[auth] Secret manquant pour ${site}. Définissez ${envKey} ou AUTH_SECRET.`
    );
  }

  return `fallback-secret-${site}`;
}

export function createSiteAuthConfig(site: SiteKey): NextAuthOptions {
  const config = SITE_CONFIGS[site];
  const delegates = prismaDelegates[site];
  const userDelegate = delegates.user as any;
  const accountDelegate = delegates.account as any;
  const sessionDelegate = delegates.session as any;
  const verificationDelegate = delegates.verificationToken as any;
  const otpDelegate = delegates.otp as any;

  return {
    secret: resolveSiteSecret(site),
    adapter: createSiteAdapter(site),
    session: {
      strategy: "database",
      maxAge: 14 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    providers: [
      (() => {
        const provider = EmailProvider({
          maxAge: 15 * 60,
          from:
            process.env[config.fromEnvVar as keyof NodeJS.ProcessEnv] ??
            process.env.RESEND_DEFAULT_FROM,
          async sendVerificationRequest({ identifier, url }) {
            const email = normalizeEmail(identifier);
            const otp = generateOtp(site);
            const hash = hashOtp(site, otp);
            const expires = new Date(Date.now() + OTP_TTL_MS);

            await otpDelegate.deleteMany({
              where: { email },
            });

            await otpDelegate.create({
              data: {
                email,
                codeHash: hash,
                expires,
              },
            });

            const existingUser = await userDelegate.findFirst({
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
        });
        return provider;
      })(),
      CredentialsProvider({
        id: "otp",
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

          const record = await otpDelegate.findFirst({
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
            await otpDelegate.update({
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
            await otpDelegate.update({
              where: { id: record.id },
              data: {
                attempts: { increment: 1 },
                lastAttempt: now,
              },
            });
            throw new Error("Code OTP incorrect.");
          }

          await otpDelegate.update({
            where: { id: record.id },
            data: {
              consumedAt: now,
              lastAttempt: now,
              attempts: { increment: 1 },
            },
          });

          await otpDelegate.deleteMany({
            where: {
              email,
              id: { not: record.id },
            },
          });

          const existingUser = await userDelegate.findFirst({
            where: { email },
          });

          const user =
            existingUser ??
            (await userDelegate.create({
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
          await otpDelegate.deleteMany({
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
