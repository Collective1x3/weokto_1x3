import { redirect } from "next/navigation";
import { WeoktoLanding } from "./landing";
import { getSessionForTenant } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function WeoktoLandingPage() {
  const session = await getSessionForTenant("weokto");
  if (session) {
    redirect("/dashboard");
  }
  return <WeoktoLanding />;
}
