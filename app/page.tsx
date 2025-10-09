import { redirect } from "next/navigation";
import { WeoktoLanding } from "./weokto/landing";
import { StamLanding } from "./stam/landing";
import { getRequestTenant } from "@/lib/tenant";
import { getSessionForTenant } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const DASHBOARD_BY_TENANT = {
  weokto: "/dashboard",
  stam: "/home",
} as const;

export default async function HomePage() {
  const tenant = await getRequestTenant();
  const session = await getSessionForTenant(tenant);
  if (session) {
    redirect(DASHBOARD_BY_TENANT[tenant]);
  }

  if (tenant === "stam") {
    return <StamLanding />;
  }
  return <WeoktoLanding />;
}
