import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
const PUBLIC_FILE = /\.[^/]+$/;

function normalizeHost(value?: string | null) {
  if (!value) {
    return undefined;
  }

  let host = value.trim();
  if (!host) {
    return undefined;
  }

  if (!host.startsWith("http://") && !host.startsWith("https://")) {
    host = `https://${host}`;
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

const env =
  typeof process !== "undefined" && typeof process.env !== "undefined"
    ? (process.env as Record<string, string | undefined>)
    : {};

const RAW_STAM_HOST =
  env.NEXT_PUBLIC_STAM_APP_URL ?? env.STAM_COOKIE_DOMAIN ?? "be-stam.com";
const RAW_WEOKTO_HOST =
  env.NEXT_PUBLIC_APP_URL ?? env.WEOKTO_COOKIE_DOMAIN ?? "weokto.com";

const STAM_HOST = normalizeHost(RAW_STAM_HOST) ?? "be-stam.com";
const WEOKTO_HOST = normalizeHost(RAW_WEOKTO_HOST) ?? "weokto.com";

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

function isStamHost(host?: string | null) {
  return hostEquals(STAM_HOST, host);
}

function isWeoktoHost(host?: string | null) {
  return hostEquals(WEOKTO_HOST, host);
}

function shouldBypass(pathname: string) {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    PUBLIC_FILE.test(pathname)
  );
}

export function middleware(request: NextRequest) {
  try {
    const url = request.nextUrl.clone();
    const hostname = request.headers.get("host") ?? "";
    const pathname = url.pathname;

    if (shouldBypass(pathname)) {
      return NextResponse.next();
    }

    if (isStamHost(hostname)) {
      if (!pathname.startsWith("/stam")) {
        url.pathname =
          pathname === "/"
            ? "/stam"
            : `/stam${pathname.startsWith("/") ? "" : "/"}${pathname.replace(
                /^\//,
                ""
              )}`;
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    if (isWeoktoHost(hostname)) {
      if (!pathname.startsWith("/weokto")) {
        url.pathname =
          pathname === "/"
            ? "/weokto"
            : `/weokto${pathname.startsWith("/") ? "" : "/"}${pathname.replace(
                /^\//,
                ""
              )}`;
        return NextResponse.rewrite(url);
      }
      return NextResponse.next();
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[middleware] Error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
