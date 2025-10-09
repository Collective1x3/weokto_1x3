import { createHash, randomInt } from "node:crypto";
import { SITE_CONFIGS, type SiteKey } from "./site-config";

export function generateOtp(site: SiteKey) {
  const { otpLength } = SITE_CONFIGS[site];
  const min = 10 ** (otpLength - 1);
  const max = 10 ** otpLength - 1;
  const numeric = randomInt(min, max + 1);
  return numeric.toString();
}

export function hashOtp(site: SiteKey, code: string) {
  const secret =
    process.env[[SITE_CONFIGS[site].authSecretEnvVar] as keyof NodeJS.ProcessEnv] ??
    process.env.AUTH_SECRET ??
    "";

  return createHash("sha256")
    .update(`${site}:${code}:${secret}`)
    .digest("hex");
}

export const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
export const OTP_MAX_ATTEMPTS = 5;
