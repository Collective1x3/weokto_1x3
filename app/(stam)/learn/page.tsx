import Link from 'next/link'
import { getStamSession } from '@/lib/auth/stam/session'
import { listFormations, listProgress } from '@/services/stam/formations'
import { FormationCard } from '@/components/weokto/stam/learn/FormationCard'
import { ArrowRight, Compass, PlayCircle, Sparkle } from '@phosphor-icons/react/dist/ssr'

export const dynamic = 'force-dynamic'

export default async function StamLearnLanding() {
  const session = await getStamSession().catch(() => null)
  const [formations, learnerProgress] = await Promise.all([
    listFormations({
      onlyPublished: true,
      includeModules: true,
      take: 24
    }),
    session
      ? listProgress({
          stamUserId: session.id,
          includeFormation: true
        })
      : Promise.resolve([])
  ])

  const progressMap = learnerProgress.reduce<Record<string, number>>((acc, record) => {
    if (!record.formationId) return acc
    const current = acc[record.formationId] ?? 0
    const nextLevel =
      record.status === 'COMPLETED'
        ? current + 1
        : current
    acc[record.formationId] = nextLevel
    return acc
  }, {})

  return (
    <main className="space-y-12 bg-[#F5F1E8] pb-20 pt-12 md:space-y-16 md:pb-24 md:pt-20">
      {/* Hero */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 rounded-[48px] border border-amber-100 bg-white p-6 shadow-[0_40px_100px_-50px_rgba(28,25,23,0.4)] md:grid-cols-[2fr_1fr] md:p-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-amber-700">
              <Sparkle weight="bold" size={16} />
              parcours
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-stone-900 md:text-4xl lg:text-5xl">
              Construis ton apprentissage, chapitre après chapitre.
            </h1>
            <p className="max-w-2xl text-base text-stone-600 md:text-lg">
              Les formations STAM sont pensées comme des voyages immersifs : modules courts, actions concrètes, communauté
              engagée. Choisis ta destination et retrouve ton avancée à tout moment.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href={session ? '/stam/dashboard/user' : '/stam/login'}
                className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-6 py-3 text-sm font-semibold text-[#FEFDFB] shadow-lg shadow-stone-900/30 transition hover:bg-stone-800"
              >
                {session ? 'Accéder à mon espace' : 'Se connecter pour suivre ma progression'}
                <ArrowRight weight="bold" size={18} />
              </Link>

              <span className="text-sm font-medium text-stone-600">
                {formations.length} parcours disponibles • contenus exclusifs &amp; ressources téléchargeables
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-3xl border border-stone-200 bg-amber-50/60 p-6">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
              Ton prochain chapitre
            </p>
            <p className="text-sm text-stone-600">
              {session
                ? 'Reprends la formation que tu as laissée en pause et garde ton rythme.'
                : 'Crée ton compte STAM pour suivre ta progression et débloquer des ressources exclusives.'}
            </p>

            <div className="rounded-2xl border border-stone-200 bg-white p-4 text-sm text-stone-600">
              <p className="font-semibold text-stone-900">Conseil</p>
              <p className="mt-1">
                Tu peux marquer un module comme “Terminé” depuis la page du chapitre. Nous sauvegardons automatiquement ta
                progression.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Formations list */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl space-y-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-stone-900 md:text-3xl">
                Explore les parcours STAM
              </h2>
              <p className="text-sm text-stone-600 md:text-base">
                Du mindset à l’exécution, chaque formation est découpée en micro-chapitres activables rapidement.
              </p>
            </div>

            <Link
              href={session ? '/stam/dashboard/user' : '/stam/login'}
              className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
            >
              <Compass size={18} weight="bold" />
              {session ? 'Retrouver ma progression' : 'Créer un compte apprenant'}
            </Link>
          </header>

          {formations.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-white/70 p-8 text-center text-sm text-stone-600">
              Les formations seront dévoilées très bientôt. Reste connecté pour être averti du lancement.
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {formations.map((formation) => {
                const completedCount = progressMap[formation.id] ?? 0
                const totalModules = formation.modules?.length ?? undefined
                const progressPercentage =
                  totalModules && totalModules > 0
                    ? Math.min(100, Math.round((completedCount / totalModules) * 100))
                    : completedCount > 0
                    ? 100
                    : undefined

                return (
                  <FormationCard
                    key={formation.id}
                    href={`/stam/learn/${formation.id}`}
                    title={formation.title}
                    subtitle={formation.subtitle}
                    coverImageUrl={formation.coverImageUrl ?? undefined}
                    estimatedMinutes={formation.estimatedMinutes}
                    progressPercentage={progressPercentage}
                    statusLabel={
                      progressPercentage === undefined
                        ? undefined
                        : progressPercentage === 100
                        ? 'Formation complétée'
                        : `Chapitre ${completedCount + 1} sur ${totalModules ?? '…'}`
                    }
                    tagLabel={formation.level ?? undefined}
                  />
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-[42px] border border-stone-200 bg-white p-6 shadow-[0_40px_80px_-40px_rgba(28,25,23,0.4)] md:p-10">
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-stone-500">
                Méthode STAM
              </p>
              <h3 className="text-2xl font-semibold text-stone-900 md:text-3xl">
                Un apprentissage conçu pour être vécu, pas juste regardé.
              </h3>
              <p className="text-sm text-stone-600 md:text-base">
                Chaque formation STAM mixe vidéo, ressources téléchargeables et actions concrètes. Tu progresses module
                après module, à ton rythme, tout en gardant un fil rouge clair.
              </p>
            </div>

            <div className="rounded-3xl border border-emerald-200 bg-emerald-50/70 p-6 md:w-72">
              <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-600">
                <PlayCircle weight="bold" size={16} />
                3 piliers
              </div>
              <ul className="mt-4 space-y-3 text-sm text-emerald-900/80">
                <li className="flex gap-2">
                  <span className="text-emerald-400">▹</span>
                  Micro-modules digestes (15 min max)
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">▹</span>
                  Ressources actionnables prêtes à l’emploi
                </li>
                <li className="flex gap-2">
                  <span className="text-emerald-400">▹</span>
                  Feedback communautaire & accountability
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
