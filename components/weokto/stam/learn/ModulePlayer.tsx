'use client'

import { useEffect, useState, useTransition } from 'react'
import { CheckCircle, ClockCounterClockwise, DownloadSimple } from '@phosphor-icons/react/dist/ssr'

interface ModulePlayerProps {
  formationId: string
  moduleIndex: number
  moduleTitle: string
  videoUrl?: string | null
  synopsis?: string | null
  content?: Record<string, unknown> | null
  resources: Array<{
    id: string
    type: string
    title?: string | null
    url?: string | null
    metadata?: Record<string, unknown> | null
  }>
  globalResources: Array<{
    id: string
    type: string
    title?: string | null
    url?: string | null
    metadata?: Record<string, unknown> | null
  }>
  initialStatus: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  isAuthenticated: boolean
}

interface ToastState {
  message: string
  tone: 'success' | 'warning' | 'error'
}

function VideoFrame({ url }: { url?: string | null }) {
  if (!url) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-3xl border border-stone-200 bg-gradient-to-br from-stone-100 via-emerald-50 to-amber-50 text-sm font-medium text-stone-500">
        Vidéo disponible prochainement
      </div>
    )
  }

  return (
    <iframe
      src={url}
      className="h-full w-full rounded-3xl border border-stone-200"
      allow="autoplay; fullscreen; picture-in-picture"
      allowFullScreen
      title="Lecteur STAM"
    />
  )
}

export function ModulePlayer({
  formationId,
  moduleIndex,
  moduleTitle,
  videoUrl,
  synopsis,
  content,
  resources,
  globalResources,
  initialStatus,
  isAuthenticated
}: ModulePlayerProps) {
  const [status, setStatus] = useState(initialStatus)
  const [isPending, startTransition] = useTransition()
  const [toast, setToast] = useState<ToastState | null>(null)

  useEffect(() => {
    if (!isAuthenticated || initialStatus !== 'NOT_STARTED') return

    startTransition(async () => {
      try {
        await fetch('/api/stam/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formationId,
            moduleIndex,
            status: 'IN_PROGRESS'
          })
        })
        setStatus('IN_PROGRESS')
      } catch (error) {
        console.error('Unable to initialize progress', error)
      }
    })
  }, [formationId, moduleIndex, initialStatus, isAuthenticated])

  const handleMarkComplete = () => {
    startTransition(async () => {
      try {
        const response = await fetch('/api/stam/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formationId,
            moduleIndex,
            status: status === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'
          })
        })

        if (!response.ok) {
          const message = await response.json().catch(() => ({ error: 'Action impossible' }))
          throw new Error(message.error ?? 'Action impossible')
        }

        setStatus((prev) => (prev === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED'))
        setToast({
          message:
            status === 'COMPLETED'
              ? 'Chapitre remis en cours.'
              : 'Bravo, chapitre complété !',
          tone: 'success'
        })
      } catch (error) {
        console.error('Unable to update progress', error)
        setToast({
          message: error instanceof Error ? error.message : 'Impossible de mettre à jour la progression.',
          tone: 'error'
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_30px_60px_-30px_rgba(28,25,23,0.25)]">
        <div className="relative h-[320px] w-full bg-stone-100 md:h-[420px]">
          <VideoFrame url={videoUrl ?? undefined} />
        </div>

        <div className="flex flex-col gap-6 border-t border-stone-200 p-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-stone-500">
              Chapitre {moduleIndex}
            </p>
            <h2 className="text-xl font-semibold text-stone-900 md:text-2xl">{moduleTitle}</h2>
            {synopsis && <p className="text-sm text-stone-600 md:text-base">{synopsis}</p>}
          </div>

          <div className="flex flex-col gap-3 md:w-64">
            <button
              type="button"
              disabled={!isAuthenticated || isPending}
              onClick={handleMarkComplete}
              className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                status === 'COMPLETED'
                  ? 'border border-emerald-500 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 disabled:opacity-70'
                  : 'border border-emerald-500 bg-emerald-500 text-white hover:bg-emerald-600 disabled:opacity-70'
              }`}
            >
              <CheckCircle weight="bold" size={18} />
              {status === 'COMPLETED' ? 'Chapitre terminé' : 'Marquer comme terminé'}
            </button>

            {!isAuthenticated && (
              <p className="text-xs font-medium text-amber-700 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                <ClockCounterClockwise weight="bold" size={16} />
                Connecte-toi pour sauvegarder ta progression.
              </p>
            )}
          </div>
        </div>
      </section>

      {content && (
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_30px_60px_-30px_rgba(28,25,23,0.18)]">
          <h3 className="text-lg font-semibold text-stone-900">Notes & contenu</h3>
          <pre className="mt-4 whitespace-pre-wrap rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
            {JSON.stringify(content, null, 2)}
          </pre>
        </section>
      )}

      {(resources.length > 0 || globalResources.length > 0) && (
        <section className="space-y-4">
          {resources.length > 0 && (
            <div className="rounded-3xl border border-emerald-100 bg-emerald-50/60 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
                Ressources du chapitre
              </h3>
              <ul className="mt-4 space-y-2">
                {resources.map((resource) => (
                  <li key={resource.id}>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-white/50"
                      >
                        <DownloadSimple weight="bold" size={16} />
                        <span>{resource.title ?? resource.type}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-emerald-900/80">
                        <DownloadSimple weight="bold" size={16} />
                        <span>{resource.title ?? resource.type}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {globalResources.length > 0 && (
            <div className="rounded-3xl border border-stone-200 bg-white p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-500">
                Ressources complémentaires
              </h3>
              <ul className="mt-4 space-y-2">
                {globalResources.map((resource) => (
                  <li key={resource.id}>
                    {resource.url ? (
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
                      >
                        <DownloadSimple weight="bold" size={16} />
                        <span>{resource.title ?? resource.type}</span>
                      </a>
                    ) : (
                      <div className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-stone-600">
                        <DownloadSimple weight="bold" size={16} />
                        <span>{resource.title ?? resource.type}</span>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
      )}

      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 rounded-2xl px-4 py-3 text-sm font-semibold shadow-lg ${
            toast.tone === 'success'
              ? 'border border-emerald-200 bg-emerald-50 text-emerald-700'
              : toast.tone === 'warning'
              ? 'border border-amber-200 bg-amber-50 text-amber-700'
              : 'border border-rose-200 bg-rose-50 text-rose-700'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  )
}
