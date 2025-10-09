import Link from "next/link";

export function StamLanding() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 px-6 text-center">
      <div className="max-w-xl space-y-4">
        <h1 className="text-5xl font-bold tracking-tight text-white">STAM</h1>
        <p className="text-lg text-stone-300">
          Expériences créatives et immersives.
        </p>
      </div>
      <Link
        href="/stam/signin"
        className="rounded-full bg-white/10 px-8 py-3 text-base font-semibold uppercase tracking-wide text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
      >
        Commencer
      </Link>
    </main>
  );
}
