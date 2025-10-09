const FALLBACK_SCHEME = "https://";

function normalizeHost(value?: string | null) {
  if (!value) {
    return undefined;
  }

  let host = value.trim();
  if (!host) {
    return undefined;
  }

  if (!host.startsWith("http://") && !host.startsWith("https://")) {
    host = `${FALLBACK_SCHEME}${host}`;
  }

  try {
    host = new URL(host).host;
  } catch {
    host = host.replace(/^https?:\/\//, "");
  }

  host = host.replace(/^\./, "");
  host = host.replace(/^www\./, "");
  host = host.replace(/:\d+$/, "");

  return host.toLowerCase();
}

export const STAM_HOST =
  normalizeHost(
    process.env.NEXT_PUBLIC_STAM_APP_URL ?? process.env.STAM_COOKIE_DOMAIN
  ) ?? "be-stam.com";

export const WEOKTO_HOST =
  normalizeHost(
    process.env.NEXT_PUBLIC_APP_URL ?? process.env.WEOKTO_COOKIE_DOMAIN
  ) ?? "weokto.com";

function hostEquals(target: string | undefined, host?: string | null) {
  if (!target || !host) {
    return false;
  }
  const normalized = normalizeHost(host);
  if (!normalized) {
    return false;
  }
  return (
    normalized === target ||
    normalized.endsWith(`.${target}`) ||
    target.endsWith(`.${normalized}`)
  );
}

export function isStamHost(host?: string | null) {
  return hostEquals(STAM_HOST, host);
}

export function isWeoktoHost(host?: string | null) {
  return hostEquals(WEOKTO_HOST, host);
}

export function getCookieDomain(site: "weokto" | "stam") {
  const value =
    site === "weokto"
      ? process.env.WEOKTO_COOKIE_DOMAIN
      : process.env.STAM_COOKIE_DOMAIN;
  const normalized = normalizeHost(value);
  return normalized ? `.${normalized}` : undefined;
}
