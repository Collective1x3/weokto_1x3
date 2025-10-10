import type { NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { prismaDelegates } from "./delegates";
import { createSiteAdapter } from "./site-adapter";
import { SITE_CONFIGS, type SiteKey } from "./site-config";
import { sendAuthEmail } from "../email/send-auth-email";
import { getCookieDomain } from "@/lib/config/hosts";

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
  const cookieDomain = getCookieDomain(site);
  const secureCookies = process.env.NODE_ENV === "production";

  return {
    secret: resolveSiteSecret(site),
    adapter: createSiteAdapter(site),
    session: {
      strategy: "database",
      maxAge: 14 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    cookies: {
      sessionToken: {
        name: `__Secure-${site}.session-token`,
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: secureCookies,
          domain: cookieDomain,
        },
      },
      callbackUrl: {
        name: `${site}.callback-url`,
        options: {
          sameSite: "lax",
          path: "/",
          secure: secureCookies,
          domain: cookieDomain,
        },
      },
      csrfToken: {
        name: `${site}.csrf-token`,
        options: {
          sameSite: "lax",
          path: "/",
          secure: secureCookies,
          domain: cookieDomain,
        },
      },
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
            const existingUser = await userDelegate.findFirst({
              where: { email },
            });

            await sendAuthEmail({
              site,
              kind: existingUser ? "login" : "signup",
              to: identifier,
              magicLink: url,
            });
          },
        });
        return provider;
      })(),
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
    pages: {
      signIn: config.signinPath,
      verifyRequest: config.signinPath,
      newUser: config.dashboardPath,
    },
  };
}
