"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname() ?? "/";
  const host =
    typeof window !== "undefined" ? window.location.hostname.toLowerCase() : "";
  const isStam =
    host.includes("stam") || (!host && pathname.startsWith("/stam"));
  const basePath = isStam ? "/api/auth/stam" : "/api/auth/weokto";

  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
}
