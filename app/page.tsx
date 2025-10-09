import { WeoktoLanding } from "./weokto/landing";
import StamLandingPage from "./stam/page";
import { getRequestTenant } from "@/lib/tenant";

export default async function HomePage() {
  const tenant = await getRequestTenant();
  if (tenant === "stam") {
    return <StamLandingPage />;
  }
  return <WeoktoLanding />;
}
