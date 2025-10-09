import Link from 'next/link'
import { CheckCircle, PlayCircle } from '@phosphor-icons/react/dist/ssr'

export interface ModuleListItem {
  id: string
  moduleIndex: number
  title: string
  durationSeconds?: number | null
  synopsis?: string | null
}

interface ModuleListProps {
  formationId: string
  modules: ModuleListItem[]
  activeModuleIndex?: number
  completedModuleIndexes?: Set<number>
  baseHref?: string
}

function formatDuration(seconds?: number | null) {
  if (!seconds || seconds <= 0) return null
  const minutes = Math.round(seconds / 60)
  if (minutes < 1) return '<1 min'
  return `${minutes} min`
}

export function ModuleList({
  formationId,
  modules,
  activeModuleIndex,
  completedModuleIndexes,
  baseHref = `/stam/learn/${formationId}/module`
}: ModuleListProps) {
  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const isActive = module.moduleIndex === activeModuleIndex
        const isCompleted = completedModuleIndexes?.has(module.moduleIndex)
        const durationLabel = formatDuration(module.durationSeconds)

        return (
          <Link
            key={module.id}
            href={`${baseHref}/${module.moduleIndex}`}
            className={`group flex items-start gap-3 rounded-2xl border px-4 py-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
              isActive
                ? 'border-emerald-400 bg-emerald-50/70'
                : isCompleted
                ? 'border-emerald-100 bg-emerald-50/40 hover:border-emerald-200'
                : 'border-stone-200 bg-white hover:border-emerald-200 hover:bg-emerald-50/40'
            }`}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 group-hover:bg-emerald-500/20">
              {isCompleted ? <CheckCircle size={22} weight="bold" /> : <PlayCircle size={22} weight="bold" />}
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
                  Chapitre {module.moduleIndex}
                </span>
                {durationLabel && (
                  <span className="rounded-full bg-white/80 px-2 py-0.5 text-xs font-semibold text-stone-500 shadow-sm">
                    {durationLabel}
                  </span>
                )}
              </div>

              <h3
                className={`text-sm font-semibold transition-colors duration-300 ${
                  isActive ? 'text-emerald-700' : 'text-stone-900 group-hover:text-emerald-700'
                }`}
              >
                {module.title}
              </h3>

              {module.synopsis && (
                <p className="text-sm text-stone-600 line-clamp-2">{module.synopsis}</p>
              )}
            </div>

            {isCompleted && (
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                Terminé
              </span>
            )}
          </Link>
        )
      })}
    </div>
  )
}
