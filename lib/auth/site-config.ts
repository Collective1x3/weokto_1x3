export type SiteKey = "weokto" | "stam";

type SiteConfig = {
  key: SiteKey;
  name: "WEOKTO" | "STAM";
  basePath: `/api/auth/${SiteKey}`;
  signinPath: `/${SiteKey}/signin` | "/signin";
  originEnvVar: string;
  fromEnvVar: string;
  authSecretEnvVar: string;
  dashboardPath: string;
  cookieDomainEnvVar: string;
  otpLength: number;
};

export const SITE_CONFIGS: Record<SiteKey, SiteConfig> = {
  weokto: {
    key: "weokto",
    name: "WEOKTO",
    basePath: "/api/auth/weokto",
    signinPath: "/weokto/signin",
    originEnvVar: "WEOKTO_APP_URL",
    fromEnvVar: "WEOKTO_EMAIL_FROM",
    authSecretEnvVar: "WEOKTO_AUTH_SECRET",
    dashboardPath: "/dashboard",
    cookieDomainEnvVar: "WEOKTO_COOKIE_DOMAIN",
    otpLength: 6,
  },
  stam: {
    key: "stam",
    name: "STAM",
    basePath: "/api/auth/stam",
    signinPath: "/stam/signin",
    originEnvVar: "STAM_APP_URL",
    fromEnvVar: "STAM_EMAIL_FROM",
    authSecretEnvVar: "STAM_AUTH_SECRET",
    dashboardPath: "/home",
    cookieDomainEnvVar: "STAM_COOKIE_DOMAIN",
    otpLength: 6,
  },
};
