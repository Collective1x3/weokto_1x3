import { prisma } from "../prisma";
import type { SiteKey } from "./site-config";

export const prismaDelegates = {
  weokto: {
    user: prisma.weoktoUser,
    account: prisma.weoktoAccount,
    session: prisma.weoktoSession,
    verificationToken: prisma.weoktoVerificationToken,
  },
  stam: {
    user: prisma.stamUser,
    account: prisma.stamAccount,
    session: prisma.stamSession,
    verificationToken: prisma.stamVerificationToken,
  },
} as const satisfies Record<SiteKey, Record<string, unknown>>;
