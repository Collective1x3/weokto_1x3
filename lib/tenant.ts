import { headers } from "next/headers";

export type TenantKey = "weokto" | "stam";

function getEnv(name: string) {
  if (typeof process !== "undefined" && process.env) {
    const value = process.env[name as keyof typeof process.env];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return undefined;
}

function parseHostList(value: string | undefined) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

const FALLBACK_STAM_HOSTS = parseHostList(
  getEnv("NEXT_PUBLIC_STAM_HOSTS") ?? getEnv("NEXT_PUBLIC_STAM_APP_URL")
) ?? [];
const FALLBACK_WEOKTO_HOSTS = parseHostList(
  getEnv("NEXT_PUBLIC_WEOKTO_HOSTS") ?? getEnv("NEXT_PUBLIC_APP_URL")
) ?? [];

const DEFAULT_TENANT: TenantKey =
  (getEnv("NEXT_PUBLIC_DEFAULT_TENANT") as TenantKey | undefined) ?? "weokto";

function normalizeHost(host?: string | null) {
  if (!host) {
    return undefined;
  }
  const value = host.split(":")[0]?.toLowerCase();
  if (!value) {
    return undefined;
  }
  return value.startsWith("www.") ? value.slice(4) : value;
}

function hostMatches(host: string | undefined, candidates: string[]) {
  if (!host) {
    return false;
  }
  return candidates.some((candidate) => {
    const normalized = candidate.toLowerCase();
    return host === normalized || host.endsWith(`.${normalized}`);
  });
}

export function resolveTenantFromHost(host?: string | null): TenantKey {
  const normalized = normalizeHost(host);
  if (hostMatches(normalized, FALLBACK_STAM_HOSTS)) {
    return "stam";
  }
  if (hostMatches(normalized, FALLBACK_WEOKTO_HOSTS)) {
    return "weokto";
  }
  return DEFAULT_TENANT;
}

export async function getRequestTenant(): Promise<TenantKey> {
  const headerList = await headers();
  const headerHost = headerList.get("host");
  return resolveTenantFromHost(headerHost);
}
