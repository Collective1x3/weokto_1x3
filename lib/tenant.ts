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

function extractHost(value: string) {
  let entry = value.trim();
  if (!entry) {
    return undefined;
  }
  if (!entry.includes("://")) {
    entry = `https://${entry}`;
  }
  try {
    const url = new URL(entry);
    return url.host;
  } catch {
    return entry;
  }
}

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

function parseHostList(value: string | undefined) {
  if (!value) {
    return [];
  }
  return value
    .split(",")
    .map((entry) => extractHost(entry))
    .filter(Boolean)
    .map((entry) => normalizeHost(entry)!)
    .filter(Boolean);
}

const DEFAULT_STAM_HOSTS = ["be-stam.com", "be-stam.vercel.app"];
const DEFAULT_WEOKTO_HOSTS = ["weokto.com", "weokto.vercel.app", "weokto-1x3.vercel.app"];

const STAM_HOSTS = [
  ...DEFAULT_STAM_HOSTS,
  ...parseHostList(getEnv("NEXT_PUBLIC_STAM_APP_URL")),
  ...parseHostList(getEnv("NEXT_PUBLIC_STAM_HOSTS")),
];

const WEOKTO_HOSTS = [
  ...DEFAULT_WEOKTO_HOSTS,
  ...parseHostList(getEnv("NEXT_PUBLIC_APP_URL")),
  ...parseHostList(getEnv("NEXT_PUBLIC_WEOKTO_HOSTS")),
];

const DEFAULT_TENANT: TenantKey =
  (getEnv("NEXT_PUBLIC_DEFAULT_TENANT") as TenantKey | undefined) ?? "weokto";

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
  if (normalized?.includes("stam")) {
    return "stam";
  }
  if (normalized?.includes("weokto")) {
    return "weokto";
  }
  if (hostMatches(normalized, STAM_HOSTS)) {
    return "stam";
  }
  if (hostMatches(normalized, WEOKTO_HOSTS)) {
    return "weokto";
  }
  return DEFAULT_TENANT;
}

export async function getRequestTenant(): Promise<TenantKey> {
  const headerList = await headers();
  const headerHost = headerList.get("host");
  return resolveTenantFromHost(headerHost);
}
