import NextAuth from "next-auth";
import { createSiteAuthConfig } from "@/lib/auth/create-site-auth";

const handler = NextAuth(createSiteAuthConfig("weokto"));

export { handler as GET, handler as POST };
