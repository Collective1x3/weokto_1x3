import { getServerSession } from "next-auth";
import { createSiteAuthConfig } from "./create-site-auth";
import type { TenantKey } from "@/lib/tenant";

export async function getSessionForTenant(tenant: TenantKey) {
  return getServerSession(createSiteAuthConfig(tenant));
}
