import { redirect } from "next/navigation";
import { getSessionForTenant } from "@/lib/auth/session";
import { getRequestTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function StamHomePage() {
  const tenant = await getRequestTenant();
  if (tenant !== "stam") {
    redirect("/dashboard");
  }

  const session = await getSessionForTenant("stam");
  if (!session) {
    redirect("/stam/signin");
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-stone-950 px-6 py-10 text-white">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Stam
          </p>
          <h1 className="text-4xl font-semibold">Accueil</h1>
          <p className="text-base text-white/60">
            Bonjour {session.user?.pseudo ?? session.user?.email}. Préparez vos projets créatifs et
            immersifs depuis cet espace dédié à Stam.
          </p>
        </div>
      </section>
    </main>
  );
}
