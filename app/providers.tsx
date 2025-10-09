"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <SessionProvider basePath="/api/auth/weokto">{children}</SessionProvider>;
}
