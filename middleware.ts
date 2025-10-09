import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

const STAM_HOSTS = ["be-stam.com", "www.be-stam.com"];
const WEOKTO_HOSTS = ["weokto.com", "www.weokto.com"];

function normalizeHost(host?: string | null) {
  if (!host) {
    return undefined;
  }
  const value = host.split(":")[0]?.toLowerCase();
  return value?.startsWith("www.") ? value.slice(4) : value;
}

function matchHost(host: string | undefined, candidates: string[]) {
  if (!host) {
    return false;
  }
  return candidates.some((candidate) => {
    const normalized = candidate.toLowerCase();
    return host === normalized || host.endsWith(`.${normalized}`);
  });
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

function rewriteWithPrefix(url: URL, prefix: string) {
  if (url.pathname === "/") {
    url.pathname = prefix;
  } else if (!url.pathname.startsWith(prefix)) {
    const trimmed = url.pathname.replace(/^\//, "");
    url.pathname = `${prefix}/${trimmed}`;
  }
  return NextResponse.rewrite(url);
}

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = normalizeHost(request.headers.get("host"));
  const pathname = url.pathname;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  if (matchHost(host, STAM_HOSTS)) {
    return rewriteWithPrefix(url, "/stam");
  }

  if (matchHost(host, WEOKTO_HOSTS)) {
    return rewriteWithPrefix(url, "/weokto");
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
