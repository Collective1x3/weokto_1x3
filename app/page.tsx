import { WeoktoLanding } from "./weokto/landing";
import { StamLanding } from "./stam/landing";
import { getRequestTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const tenant = await getRequestTenant();
  if (tenant === "stam") {
    return <StamLanding />;
  }
  return <WeoktoLanding />;
}
