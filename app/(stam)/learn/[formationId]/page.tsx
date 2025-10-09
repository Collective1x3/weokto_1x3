import Link from 'next/link'
import Image from 'next/image'
import { notFound, redirect } from 'next/navigation'
import { getFormationById, listProgress } from '@/services/stam/formations'
import { getStamSession } from '@/lib/auth/stam/session'
import { ModuleList } from '@/components/weokto/stam/learn/ModuleList'
import { ArrowRight, BookmarkSimple, CheckCircle } from '@phosphor-icons/react/dist/ssr'

interface FormationPageProps {
  params: Promise<{ formationId: string }>
}

export const dynamic = 'force-dynamic'

export default async function FormationPage({ params }: FormationPageProps) {
  const { formationId } = await params
  try {
    const [formation, session] = await Promise.all([
      getFormationById(formationId, { includeModules: true }),
      getStamSession().catch(() => null)
    ])

    if (!formation.isPublished && (!session || !['WEOWNER', 'ADMIN', 'SUPPLIER'].includes(session.userType))) {
      redirect('/stam/learn')
    }

    const progressRecords = session
      ? await listProgress({
          stamUserId: session.id,
          formationId,
          includeModule: true
        })
      : []

    const completedIndexes = new Set(
      progressRecords
        .filter((record) => record.status === 'COMPLETED')
        .map((record) => record.moduleIndex ?? 0)
    )

    const totalModules = formation.modules.length
    const completedCount = completedIndexes.size
    const completionPercent =
      totalModules > 0 ? Math.round((completedCount / totalModules) * 100) : 0

    const nextModule =
      formation.modules.find((module) => !completedIndexes.has(module.moduleIndex)) ??
      formation.modules[0]

    const estimatedMinutes = formation.estimatedMinutes ?? formation.modules.reduce((acc, module) => {
      const minutes = module.durationSeconds ? module.durationSeconds / 60 : 0
      return acc + minutes
    }, 0)

    return (
      <main className="space-y-12 bg-[#F5F1E8] pb-20 pt-14 md:space-y-16 md:pb-24 md:pt-20">
        <section className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-[48px] border border-stone-200 bg-white p-6 shadow-[0_40px_90px_-40px_rgba(28,25,23,0.45)] md:flex-row md:p-12">
            <div className="flex-1 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-emerald-700">
                {formation.level ?? 'Parcours'}
              </div>

              <header className="space-y-4">
                <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{formation.title}</h1>
                {formation.subtitle && <p className="text-lg text-stone-600">{formation.subtitle}</p>}
              </header>

              {formation.description && (
                <p className="text-base text-stone-600 md:text-lg">{formation.description}</p>
              )}

              <div className="flex flex-wrap items-center gap-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-sm font-semibold text-emerald-700">
                  {completionPercent}% complété
                </div>
                {estimatedMinutes > 0 && (
                  <div className="rounded-2xl border border-stone-200 bg-stone-100 px-4 py-2 text-sm font-semibold text-stone-600">
                    ~{Math.round(estimatedMinutes)} minutes d’apprentissage
                  </div>
                )}
              </div>

              {session ? (
                nextModule ? (
                  <Link
                    href={`/stam/learn/${formation.id}/module/${nextModule.moduleIndex}`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-stone-900 px-5 py-3 text-sm font-semibold text-[#FEFDFB] shadow-lg shadow-stone-900/30 transition hover:bg-stone-800"
                  >
                    {completedCount > 0 ? 'Continuer au prochain chapitre' : 'Commencer la formation'}
                    <ArrowRight weight="bold" size={18} />
                  </Link>
                ) : null
              ) : (
                <Link
                  href="/stam/login"
                  className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
                >
                  <BookmarkSimple weight="bold" size={18} />
                  Se connecter pour sauvegarder ma progression
                </Link>
              )}
            </div>

            {formation.coverImageUrl ? (
              <div className="relative h-72 w-full overflow-hidden rounded-3xl border border-stone-200 bg-emerald-100 md:w-72">
                <Image
                  src={formation.coverImageUrl}
                  alt={`Illustration de la formation ${formation.title}`}
                  fill
                  sizes="288px"
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-72 w-full items-center justify-center rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/70 text-sm font-semibold text-emerald-700 md:w-72">
                Visuel prochainement
              </div>
            )}
          </div>
        </section>

        <section className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[2fr_1fr]">
            <div className="space-y-6 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_35px_80px_-45px_rgba(28,25,23,0.45)] md:p-8">
              <header className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                    Parcours
                  </p>
                  <h2 className="text-xl font-semibold text-stone-900 md:text-2xl">
                    Chapitres de la formation
                  </h2>
                </div>
                <div className="rounded-full border border-emerald-200 bg-emerald-50/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-700">
                  {totalModules} modules
                </div>
              </header>

              <ModuleList
                formationId={formation.id}
                modules={formation.modules.map((module) => ({
                  id: module.id,
                  moduleIndex: module.moduleIndex,
                  title: module.title,
                  synopsis: module.synopsis ?? undefined,
                  durationSeconds: module.durationSeconds ?? undefined
                }))}
                activeModuleIndex={nextModule?.moduleIndex}
                completedModuleIndexes={completedIndexes}
              />
            </div>

            <aside className="space-y-6">
              {formation.resources.length > 0 && (
                <div className="rounded-[32px] border border-emerald-200 bg-emerald-50/70 p-6">
                  <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                    Ressources globales
                  </h3>
                  <ul className="mt-4 space-y-2 text-sm text-emerald-900/80">
                    {formation.resources.map((resource) => (
                      <li key={resource.id}>
                        {resource.url ? (
                          <a
                            href={resource.url}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-2xl px-3 py-2 transition hover:bg-white/70"
                          >
                            {resource.title ?? resource.type}
                          </a>
                        ) : (
                          <span className="rounded-2xl px-3 py-2">{resource.title ?? resource.type}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {completedCount === totalModules && totalModules > 0 && (
                <div className="rounded-[32px] border border-emerald-200 bg-white p-6 text-sm text-emerald-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle weight="bold" size={18} />
                    Bravo ! Tu as terminé cette formation.
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-emerald-900/70">
                    Profite des ressources pour revoir les points clés ou explore une nouvelle formation STAM pour
                    continuer à progresser.
                  </p>
                </div>
              )}
            </aside>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('Unable to load formation', error)
    notFound()
  }
}
