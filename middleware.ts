import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  STAM_HOST,
  WEOKTO_HOST,
  isStamHost,
  isWeoktoHost,
} from "./lib/config/hosts";

const PUBLIC_FILE = /\.[^/]+$/;

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
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host") ?? "";
  const pathname = url.pathname;

  if (shouldBypass(pathname)) {
    return NextResponse.next();
  }

  if (isStamHost(hostname)) {
    if (!pathname.startsWith("/stam")) {
      url.pathname =
        pathname === "/" ? "/stam" : `/stam${pathname.startsWith("/") ? "" : "/"}${pathname.replace(/^\//, "")}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  if (isWeoktoHost(hostname)) {
    if (!pathname.startsWith("/weokto")) {
      url.pathname =
        pathname === "/" ? "/weokto" : `/weokto${pathname.startsWith("/") ? "" : "/"}${pathname.replace(/^\//, "")}`;
      return NextResponse.rewrite(url);
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
