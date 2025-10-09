"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SITE_CONFIGS } from "@/lib/auth/site-config";
import { isStamHost } from "@/lib/config/hosts";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname() ?? "/";
  const host =
    typeof window !== "undefined" ? window.location.hostname : undefined;
  const isStam = host ? isStamHost(host) : pathname.startsWith("/stam");
  const basePath = isStam
    ? SITE_CONFIGS.stam.basePath
    : SITE_CONFIGS.weokto.basePath;

  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
}
