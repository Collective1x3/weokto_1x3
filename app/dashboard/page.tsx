import { redirect } from "next/navigation";
import { getSessionForTenant } from "@/lib/auth/session";
import { getRequestTenant } from "@/lib/tenant";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const tenant = await getRequestTenant();
  if (tenant !== "weokto") {
    redirect("/home");
  }

  const session = await getSessionForTenant("weokto");
  if (!session) {
    redirect("/signin");
  }

  return (
    <main className="flex min-h-screen flex-col gap-6 bg-slate-950 px-6 py-10 text-white">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.35em] text-white/60">
            Weokto
          </p>
          <h1 className="text-4xl font-semibold">Tableau de bord</h1>
          <p className="text-base text-white/60">
            Bienvenue {session.user?.pseudo ?? session.user?.email}. Cette zone est prévue pour
            accueillir les statistiques et actions clés de la plateforme Weokto.
          </p>
        </div>
      </section>
    </main>
  );
}
