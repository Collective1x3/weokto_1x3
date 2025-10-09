import { notFound, redirect } from 'next/navigation'
import { getFormationById } from '@/services/stam/formations'
import { prisma } from '@/lib/prisma'
import { getStamSession } from '@/lib/auth/stam/session'
import { ModulePlayer } from '@/components/weokto/stam/learn/ModulePlayer'
import { ModuleList } from '@/components/weokto/stam/learn/ModuleList'
import Link from 'next/link'
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr'

interface ModulePageProps {
  params: Promise<{ formationId: string; moduleIndex: string }>
}

export const dynamic = 'force-dynamic'

export default async function ModulePage({ params }: ModulePageProps) {
  const { formationId, moduleIndex } = await params
  const numericModuleIndex = Number(moduleIndex)

  if (Number.isNaN(numericModuleIndex) || numericModuleIndex <= 0) {
    redirect(`/stam/learn/${formationId}`)
  }

  try {
    const [formation, session] = await Promise.all([
      getFormationById(formationId, { includeModules: true }),
      getStamSession().catch(() => null)
    ])

    const module = formation.modules.find((item) => item.moduleIndex === numericModuleIndex)

    if (!module) {
      if (formation.modules.length > 0) {
        redirect(`/stam/learn/${formationId}/module/${formation.modules[0].moduleIndex}`)
      }
      notFound()
    }

    if (!formation.isPublished && (!session || !['WEOWNER', 'ADMIN', 'SUPPLIER'].includes(session.userType))) {
      redirect('/stam/learn')
    }

    const completedIndexes = session
      ? new Set(
          (
            await prisma.stamProgress.findMany({
              where: {
                stamUserId: session.id,
                formationId
              },
              select: { moduleIndex: true, status: true }
            })
          )
            .filter((item) => item.status === 'COMPLETED')
            .map((item) => item.moduleIndex ?? 0)
        )
      : new Set<number>()

    const initialProgress = session
      ? await prisma.stamProgress.findUnique({
          where: {
            stamUserId_formationId_moduleIndex: {
              stamUserId: session.id,
              formationId,
              moduleIndex: numericModuleIndex
            }
          }
        })
      : null

    const moduleResources = module.resources ?? []
    const globalResources = formation.resources ?? []

    const nextModule =
      formation.modules.find((item) => item.moduleIndex === numericModuleIndex + 1) ?? null

    return (
      <main className="space-y-10 bg-[#F5F1E8] pb-20 pt-14 md:space-y-16 md:pb-24 md:pt-20">
        <div className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <Link
                href={`/stam/learn/${formation.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                <ArrowLeft weight="bold" size={16} />
                Retour à la formation
              </Link>
              <h1 className="text-3xl font-bold text-stone-900 md:text-4xl">{module.title}</h1>
              {module.synopsis && <p className="text-sm text-stone-600 md:text-base">{module.synopsis}</p>}
            </div>

            {nextModule && (
              <Link
                href={`/stam/learn/${formation.id}/module/${nextModule.moduleIndex}`}
                className="inline-flex items-center gap-2 rounded-2xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-emerald-300 hover:text-emerald-700"
              >
                Chapitre suivant
                <ArrowLeft weight="bold" size={16} className="rotate-180" />
              </Link>
            )}
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-8">
          <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-[2fr_1fr]">
            <ModulePlayer
              formationId={formation.id}
              moduleIndex={module.moduleIndex}
              moduleTitle={module.title}
              videoUrl={module.videoUrl ?? undefined}
              synopsis={module.synopsis ?? undefined}
              content={module.content as Record<string, unknown> | null}
              resources={moduleResources.map((resource) => ({
                id: resource.id,
                type: resource.type,
                title: resource.title,
                url: resource.url,
                metadata: resource.metadata as Record<string, unknown> | null
              }))}
              globalResources={globalResources.map((resource) => ({
                id: resource.id,
                type: resource.type,
                title: resource.title,
                url: resource.url,
                metadata: resource.metadata as Record<string, unknown> | null
              }))}
              initialStatus={initialProgress?.status ?? 'NOT_STARTED'}
              isAuthenticated={Boolean(session)}
            />

            <aside className="space-y-6 rounded-[36px] border border-stone-200 bg-white p-6 shadow-[0_35px_80px_-45px_rgba(28,25,23,0.45)] md:p-8">
              <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                  Navigation
                </p>
                <h2 className="text-lg font-semibold text-stone-900">Chapitres du parcours</h2>
              </header>

              <ModuleList
                formationId={formation.id}
                modules={formation.modules.map((item) => ({
                  id: item.id,
                  moduleIndex: item.moduleIndex,
                  title: item.title,
                  synopsis: item.synopsis ?? undefined,
                  durationSeconds: item.durationSeconds ?? undefined
                }))}
                activeModuleIndex={module.moduleIndex}
                completedModuleIndexes={completedIndexes}
              />
            </aside>
          </div>
        </div>
      </main>
    )
  } catch (error) {
    console.error('Unable to load module', error)
    notFound()
  }
}
