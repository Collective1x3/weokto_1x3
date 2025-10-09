import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowRight, FireSimple } from '@phosphor-icons/react/dist/ssr'

import { getStamSession } from '@/lib/auth/stam/session'
import { listProgress, listFormations, getFormationById } from '@/services/stam/formations'
import { FormationCard } from '@/components/weokto/stam/learn/FormationCard'
import { ModuleList } from '@/components/weokto/stam/learn/ModuleList'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

function computeSummary({
  modules,
  progressRecords
}: {
  modules: Array<{ id: string; moduleIndex: number; title: string; durationSeconds?: number | null }>
  progressRecords: Awaited<ReturnType<typeof listProgress>>
}) {
  const completedIndexes = new Set(
    progressRecords
      .filter((record) => record.status === 'COMPLETED')
      .map((record) => record.moduleIndex ?? 0)
  )

  const totalModules = modules.length
  const completedCount = completedIndexes.size
  const completionPercentage = totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0
  const nextModule =
    modules.find((module) => !completedIndexes.has(module.moduleIndex)) ?? modules[modules.length - 1] ?? null

  return {
    completedIndexes,
    completedCount,
    totalModules,
    completionPercentage,
    nextModule
  }
}

export default async function StamUserDashboard() {
  const session = await getStamSession()
  if (!session) {
    redirect('/stam/login')
  }

  if (!['CLIENT', 'AFFILIATE'].includes(session.user.userType || '')) {
    redirect('/stam/dashboard')
  }

  const [progressRecords, publishedFormations] = await Promise.all([
    listProgress({
      stamUserId: session.user.id,
      includeFormation: true,
      includeModule: true
    }),
    listFormations({
      onlyPublished: true,
      includeModules: true,
      take: 30
    })
  ])

  const progressFormationIds = Array.from(
    new Set(progressRecords.map((record) => record.formationId).filter(Boolean) as string[])
  )

  const publishedMap = new Map(publishedFormations.map((formation) => [formation.id, formation]))
  const missingIds = progressFormationIds.filter((id) => !publishedMap.has(id))

  const missingFormations = missingIds.length
    ? await Promise.all(missingIds.map((id) => getFormationById(id, { includeModules: true })))
    : []

  const allFormations = [...publishedFormations, ...missingFormations]
  const allFormationsMap = new Map(allFormations.map((formation) => [formation.id, formation]))

  const activeFormations = progressFormationIds
    .map((id) => {
      const formation = allFormationsMap.get(id)
      if (!formation) return null
      const modules = formation.modules
        .slice()
        .sort((a, b) => a.moduleIndex - b.moduleIndex)
        .map((module) => ({
          id: module.id,
          moduleIndex: module.moduleIndex,
          title: module.title,
          synopsis: module.synopsis ?? undefined,
          durationSeconds: module.durationSeconds ?? undefined
        }))
      const records = progressRecords.filter((record) => record.formationId === id)
      const summary = computeSummary({ modules, progressRecords: records })
      return {
        formation,
        modules,
        summary
      }
    })
    .filter(Boolean) as Array<{
      formation: (typeof allFormations)[number]
      modules: Array<{ id: string; moduleIndex: number; title: string; synopsis?: string; durationSeconds?: number }>
      summary: ReturnType<typeof computeSummary>
    }>

  const continueLearning = activeFormations
    .filter((item) => item.summary.nextModule)
    .sort((a, b) => b.summary.completionPercentage - a.summary.completionPercentage)
    .slice(0, 3)

  const recommendedFormations = publishedFormations
    .filter((formation) => !progressFormationIds.includes(formation.id))
    .slice(0, 3)

  const totalMinutesWatched = await prisma.stamProgress.aggregate({
    where: {
      stamUserId: session.user.id,
      status: 'COMPLETED'
    },
    _sum: {
      timeSpent: true
    }
  })

  const minutesWatched = Math.round((totalMinutesWatched._sum.timeSpent ?? 0) / 60)

  return (
    <div className="space-y-10 px-4 pb-20 pt-10 md:space-y-14 md:px-8 md:pb-24 md:pt-16">
      <header className="rounded-[36px] border border-emerald-200 bg-gradient-to-br from-emerald-50/80 via-white to-emerald-100 p-6 shadow-[0_30px_80px_-40px_rgba(16,94,88,0.45)] md:p-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-700">
              Tableau de bord
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-emerald-900 md:text-4xl">
                Salut {session.user.displayName ?? session.user.email},
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-emerald-900/80 md:text-base">
                Voici un récapitulatif de tes formations STAM. Reprends où tu t&apos;es arrêté ou explore de nouveaux
                parcours pour continuer à faire progresser ta communauté.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-3xl border border-emerald-200 bg-white/90 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-lg md:w-64 md:px-6 md:py-5">
            <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
              <FireSimple weight="bold" size={16} />
              Statistiques
            </span>
            <div className="flex items-baseline gap-2 text-4xl font-semibold text-emerald-700">
              {minutesWatched}
              <span className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-500">
                min vécues
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-700/80">
              Continue sur ta lancée : chaque chapitre validé rapproche ta communauté de la réussite.
            </p>
          </div>
        </div>
      </header>

      {continueLearning.length > 0 && (
        <section className="space-y-6">
          <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-emerald-900 md:text-2xl">Reprendre ton apprentissage</h2>
              <p className="text-sm text-emerald-900/70 md:text-base">
                Continue les chapitres entamés pour débloquer les ressources premium et obtenir des feedbacks ciblés.
              </p>
            </div>
            <Link
              href="/stam/learn"
              className="inline-flex items-center gap-2 rounded-2xl border border-emerald-200 bg-white px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:border-emerald-300 hover:text-emerald-800"
            >
              Voir le catalogue
              <ArrowRight weight="bold" size={16} />
            </Link>
          </header>

          <div className="grid gap-6 md:grid-cols-2">
            {continueLearning.map(({ formation, summary }) => (
              <FormationCard
                key={formation.id}
                href={`/stam/learn/${formation.id}/module/${summary.nextModule?.moduleIndex ?? 1}`}
                title={formation.title}
                subtitle={formation.subtitle}
                coverImageUrl={formation.coverImageUrl ?? undefined}
                estimatedMinutes={formation.estimatedMinutes}
                progressPercentage={summary.completionPercentage}
                statusLabel={`Chapitre ${summary.completedCount + 1} sur ${summary.totalModules} • ${summary.completionPercentage}% réalisé`}
                tagLabel={formation.level ?? undefined}
              />
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_30px_80px_-40px_rgba(28,25,23,0.35)] md:p-8">
          <header className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              Parcours en détail
            </p>
            <h2 className="text-lg font-semibold text-stone-900 md:text-xl">
              Modules en cours &amp; terminés
            </h2>
          </header>

          {activeFormations.length === 0 ? (
            <div className="rounded-3xl border border-stone-200 bg-stone-50/80 px-4 py-6 text-sm text-stone-600">
              Tu n&apos;as pas encore commencé de formation. Choisis ton premier parcours dans le catalogue STAM.
            </div>
          ) : (
            <div className="space-y-8">
              {activeFormations.map(({ formation, modules, summary }) => (
                <div key={formation.id} className="space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h3 className="text-base font-semibold text-stone-900">{formation.title}</h3>
                      <p className="text-xs uppercase tracking-[0.3em] text-stone-500">
                        {summary.completionPercentage}% complété
                      </p>
                    </div>
                    <Link
                      href={`/stam/learn/${formation.id}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
                    >
                      Voir la formation
                    </Link>
                  </div>

                  <ModuleList
                    formationId={formation.id}
                    modules={modules}
                    activeModuleIndex={summary.nextModule?.moduleIndex ?? undefined}
                    completedModuleIndexes={summary.completedIndexes}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="space-y-6">
          <div className="rounded-[32px] border border-emerald-200 bg-emerald-50/80 p-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
              Progression globale
            </h3>
            <div className="mt-4 space-y-3 text-sm text-emerald-900/80">
              <p>Formations suivies : {activeFormations.length}</p>
              <p>
                Modules terminés :{' '}
                {progressRecords.filter((record) => record.status === 'COMPLETED').length}
              </p>
              <p>
                Dernière activité :{' '}
                {progressRecords.length > 0
                  ? new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit'
                    }).format(new Date(progressRecords[0].updatedAt))
                  : '—'}
              </p>
            </div>
          </div>

          {recommendedFormations.length > 0 && (
            <div className="space-y-4 rounded-[32px] border border-stone-200 bg-white p-6 shadow-[0_25px_70px_-40px_rgba(28,25,23,0.35)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
                À découvrir ensuite
              </h3>
              <div className="space-y-4">
                {recommendedFormations.map((formation) => (
                  <FormationCard
                    key={formation.id}
                    href={`/stam/learn/${formation.id}`}
                    title={formation.title}
                    subtitle={formation.subtitle}
                    coverImageUrl={formation.coverImageUrl ?? undefined}
                    estimatedMinutes={formation.estimatedMinutes}
                    tagLabel={formation.level ?? undefined}
                  />
                ))}
              </div>
            </div>
          )}
        </aside>
      </section>
    </div>
  )
}
