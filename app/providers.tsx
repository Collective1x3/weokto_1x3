"use client";

import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { SITE_CONFIGS } from "@/lib/auth/site-config";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const pathname = usePathname() ?? "/";
  const basePath = pathname.startsWith("/stam")
    ? SITE_CONFIGS.stam.basePath
    : SITE_CONFIGS.weokto.basePath;

  return <SessionProvider basePath={basePath}>{children}</SessionProvider>;
}
