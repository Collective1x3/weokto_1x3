import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/adapters";
import { prismaDelegates } from "./delegates";
import type { SiteKey } from "./site-config";

function sanitizeUserInput(user: Partial<AdapterUser>) {
  const { emailVerified: _emailVerified, ...rest } = user;
  return stripUndefined(rest);
}

function mapUser(user: {
  id: string;
  email: string | null;
  pseudo?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}): AdapterUser {
  const fallbackName = [user.firstName, user.lastName]
    .filter((value): value is string => Boolean(value))
    .join(" ");
  return {
    id: user.id,
    name: user.pseudo ?? (fallbackName.length > 0 ? fallbackName : null),
    email: user.email ?? "",
    emailVerified: null,
  };
}

function mapSession(session: {
  sessionToken: string;
  userId: string;
  expires: Date;
}): AdapterSession {
  return {
    sessionToken: session.sessionToken,
    userId: session.userId,
    expires: session.expires,
  };
}

function stripUndefined<T extends Record<string, unknown>>(obj: T) {
  const data: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      data[key] = value;
    }
  }
  return data;
}

export function createSiteAdapter(site: SiteKey): Adapter {
  const delegates = prismaDelegates[site];
  const userDelegate = delegates.user as any;
  const accountDelegate = delegates.account as any;
  const sessionDelegate = delegates.session as any;
  const verificationDelegate = delegates.verificationToken as any;

  return {
    async createUser(user: Omit<AdapterUser, "id">) {
      const payload = sanitizeUserInput(user);
      const created = await userDelegate.create({
        data: payload,
      });
      return mapUser(created);
    },

    async getUser(id: string) {
      const user = await userDelegate.findUnique({ where: { id } });
      return user ? mapUser(user) : null;
    },

    async getUserByEmail(email: string) {
      const user = await userDelegate.findUnique({ where: { email } });
      return user ? mapUser(user) : null;
    },

    async getUserByAccount({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      const account = await accountDelegate.findUnique({
        where: { provider_providerAccountId: { provider, providerAccountId } },
        include: { user: true },
      });
      return account?.user ? mapUser(account.user) : null;
    },

    async updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">) {
      const { id, ...rest } = user;
      const payload = sanitizeUserInput(rest);
      const updated = await userDelegate.update({
        where: { id },
        data: payload,
      });
      return mapUser(updated);
    },

    async deleteUser(id: string) {
      await userDelegate.delete({ where: { id } });
      return null;
    },

    async linkAccount(account: AdapterAccount) {
      await accountDelegate.create({ data: account });
      return account;
    },

    async unlinkAccount({
      provider,
      providerAccountId,
    }: Pick<AdapterAccount, "provider" | "providerAccountId">) {
      await accountDelegate.delete({
        where: { provider_providerAccountId: { provider, providerAccountId } },
      });
      return undefined;
    },

    async createSession(session: AdapterSession) {
      const created = await sessionDelegate.create({
        data: session,
      });
      return mapSession(created);
    },

    async getSessionAndUser(sessionToken: string) {
      const entry = await sessionDelegate.findUnique({
        where: { sessionToken },
        include: { user: true },
      });
      if (!entry) {
        return null;
      }
      const { user, ...session } = entry;
      return {
        session: mapSession(session),
        user: mapUser(user),
      };
    },

    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ) {
      const { sessionToken, ...rest } = session;
      const payload = stripUndefined(rest);
      const updated = await sessionDelegate.update({
        where: { sessionToken },
        data: payload,
      });
      return mapSession(updated);
    },

    async deleteSession(sessionToken: string) {
      await sessionDelegate.delete({ where: { sessionToken } });
      return null;
    },

    async createVerificationToken(token: VerificationToken) {
      const created = await verificationDelegate.create({
        data: token,
      });
      return created as VerificationToken;
    },

    async useVerificationToken({
      identifier,
      token,
    }: Pick<VerificationToken, "identifier" | "token">) {
      try {
        const deleted = await verificationDelegate.delete({
          where: { identifier_token: { identifier, token } },
        });
        return deleted as VerificationToken;
      } catch (error) {
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) {
          return null;
        }
        throw error;
      }
    },
  };
}
