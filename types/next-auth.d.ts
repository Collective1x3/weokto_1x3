import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      site: "weokto" | "stam";
      pseudo?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    site?: "weokto" | "stam";
    pseudo?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    site?: "weokto" | "stam";
    sessionToken?: string;
    userAgent?: string;
    ipAddress?: string;
  }
}
