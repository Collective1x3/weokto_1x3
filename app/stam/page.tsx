import { redirect } from "next/navigation";
import { StamLanding } from "./landing";
import { getSessionForTenant } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function StamLandingPage() {
  const session = await getSessionForTenant("stam");
  if (session) {
    redirect("/home");
  }
  return <StamLanding />;
}
