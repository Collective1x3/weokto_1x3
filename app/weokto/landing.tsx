import Link from "next/link";

export function WeoktoLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 px-6 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white">
          WEOKTO
        </h1>
        <p className="text-lg text-slate-300">
          Plateforme sécurisée pour vos expériences digitales.
        </p>
      </div>
      <Link
        href="/signin"
        className="rounded-full bg-white/10 px-8 py-3 text-base font-semibold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      >
        Commencer
      </Link>
    </main>
  );
}
