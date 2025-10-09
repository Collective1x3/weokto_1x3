import { prisma } from "../prisma";
import type { SiteKey } from "./site-config";

export const prismaDelegates = {
  weokto: {
    user: prisma.weoktoUser,
    account: prisma.weoktoAccount,
    session: prisma.weoktoSession,
    verificationToken: prisma.weoktoVerificationToken,
    otp: prisma.weoktoOtpCode,
  },
  stam: {
    user: prisma.stamUser,
    account: prisma.stamAccount,
    session: prisma.stamSession,
    verificationToken: prisma.stamVerificationToken,
    otp: prisma.stamOtpCode,
  },
} satisfies Record<
  SiteKey,
  {
    user: typeof prisma.weoktoUser;
    account: typeof prisma.weoktoAccount;
    session: typeof prisma.weoktoSession;
    verificationToken: typeof prisma.weoktoVerificationToken;
    otp: typeof prisma.weoktoOtpCode;
  }
>;
