'use client'

import { use } from 'react'
import Link from 'next/link'
import useSWR from 'swr'
import * as Icons from 'phosphor-react'
import { ProgressBar } from '@/components/weokto/user/formations/ProgressBar'
import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import { useCurrentGuild } from '@/hooks/useCurrentGuild'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface FormationDetailResponse {
  formation: {
    id: string
    title: string
    description: string | null
    sections: Array<{
      id: string
      title: string
      description: string | null
      chapters: Array<{
        id: string
        title: string
        description: string | null
        resources: Array<{
          id: string
          type: string
          title: string
        }>
      }>
    }>
  }
}

interface ProgressResponse {
  progress: Array<{
    chapterId: string
    percent: number
    completed: boolean
    lastWatchedAt: string
  }>
}

export default function FormationDetailPage({ params }: { params: Promise<{ formationId: string }> }) {
  const { formationId } = use(params)
  const { data, error, isLoading } = useSWR<FormationDetailResponse>(
    `/api/user/guild/formations/${formationId}`,
    fetcher
  )
  const { data: progressData } = useSWR<ProgressResponse>('/api/user/guild/formations/progress', fetcher)
  const { guild, isLoading: guildLoading } = useCurrentGuild()

  if (isLoading || guildLoading) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={guild?.name ?? 'Chargement...'} />
        <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col items-center gap-4 text-center text-gray-500">
          <Icons.CircleNotch size={48} className="animate-spin text-purple-400" />
          <p className="text-sm">Chargement de la formation...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.formation || !guild) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={guild?.name ?? 'Formation'} />
        <div className="mx-auto mt-4 w-full max-w-5xl">
          <div className="border border-[#EF4444] bg-[#EF4444]/10 rounded-lg p-6 font-mono text-center">
            <Icons.Warning size={32} className="text-[#EF4444] mx-auto mb-3" />
            <p className="text-[#EF4444] font-bold">Formation introuvable</p>
          </div>
        </div>
      </div>
    )
  }

  const formation = data.formation
  const progressEntries = progressData?.progress ?? []

  const chapters = formation.sections.flatMap((section) =>
    section.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      description: chapter.description,
      sectionTitle: section.title,
      resources: chapter.resources ?? []
    }))
  )
  const completedChapters = progressEntries.filter((item) => chapters.some((chapter) => chapter.id === item.chapterId) && item.completed).length
  const totalChapters = chapters.length
  const completion = totalChapters === 0 ? 0 : Math.round((completedChapters / totalChapters) * 100)
  const completedSet = new Set(progressEntries.filter((entry) => entry.completed).map((entry) => entry.chapterId))
  const nextChapter = chapters.find((chapter) => !completedSet.has(chapter.id)) ?? null
  const nextVideoTitle = nextChapter?.resources.find((resource) => resource.type === 'VIDEO')?.title ?? null
  const lastActivity = progressEntries.reduce<string | null>((latest, entry) => {
    if (!entry.lastWatchedAt) return latest
    if (!chapters.some((chapter) => chapter.id === entry.chapterId)) return latest
    if (!latest) return entry.lastWatchedAt
    return new Date(entry.lastWatchedAt) > new Date(latest) ? entry.lastWatchedAt : latest
  }, null)
  const isCompleted = completion === 100 && totalChapters > 0

  return (
    <div className="min-h-screen p-4 font-mono">
      <GuildNavigationHeader guildName={guild.name} />
      <div className="mx-auto mt-4 w-full max-w-5xl space-y-6">
        <Link
          href="/guild/formation"
          className="inline-flex items-center gap-2 text-[#B794F4] hover:text-white transition-all duration-200 text-sm"
        >
          <Icons.CaretLeft size={16} /> Retour aux formations
        </Link>

        <header className="space-y-3">
          <h1 className="text-3xl text-white font-bold uppercase">{formation.title}</h1>
          {formation.description && <p className="text-gray-400 text-sm">{formation.description}</p>}
          <div className="border border-[#B794F4]/30 bg-[#1e1e1e] rounded-lg p-4 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:gap-4">
              <Icons.Trophy size={24} className="text-purple-400" />
              <div className="flex-1">
                <ProgressBar percentage={completion} />
                <p className="text-xs text-gray-500 mt-1">
                  {completedChapters} / {totalChapters} chapitres complétés
                </p>
              </div>
              <div className="flex gap-2 mt-3 md:mt-0">
                <Link
                  href={`/guild/formation/${formation.id}`}
                  className="px-4 py-2 rounded border border-[#B794F4] text-[#B794F4] hover:bg-purple-400/10 transition-all duration-200 text-xs uppercase tracking-wide"
                >
                  Vue d'ensemble
                </Link>
                <Link
                  href={nextChapter ? `/guild/formation/chapters/${nextChapter.id}` : `/guild/formation/${formation.id}`}
                  className="px-4 py-2 rounded bg-purple-400 text-black font-bold hover:bg-purple-400/80 transition-all duration-200 text-xs uppercase tracking-wide"
                >
                  {isCompleted ? 'Revoir la formation' : nextChapter ? 'Reprendre' : 'Commencer'}
                </Link>
              </div>
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>
                {isCompleted
                  ? 'Formation complétée — félicitations !'
                  : nextChapter
                    ? `À suivre : ${nextChapter.sectionTitle} • ${nextVideoTitle ?? nextChapter.title}`
                    : 'Aucun contenu publié pour le moment.'}
              </p>
              {lastActivity && (
                <p>
                  Dernière activité :{' '}
                  {new Intl.DateTimeFormat('fr-FR', {
                    dateStyle: 'medium',
                    timeStyle: 'short'
                  }).format(new Date(lastActivity))}
                </p>
              )}
            </div>
          </div>
        </header>

        <div className="space-y-5">
          {formation.sections.map((section) => (
            <div key={section.id} className="border border-[#B794F4]/30 bg-[#1e1e1e] rounded-lg">
              <div className="border-b border-[#B794F4]/20 p-4 flex items-start justify-between">
                <div>
                  <h2 className="text-white font-bold text-lg">{section.title}</h2>
                  {section.description && <p className="text-gray-400 text-sm mt-1">{section.description}</p>}
                </div>
              </div>

              <div className="p-4 space-y-3">
                {section.chapters.length === 0 && (
                  <p className="text-xs text-gray-500">Aucun contenu dans cette partie pour le moment.</p>
                )}
                {section.chapters.map((chapter) => {
                  const chapterProgress = progressEntries.find((entry) => entry.chapterId === chapter.id)
                  const isCompleted = chapterProgress?.completed ?? false
                  const percent = chapterProgress?.percent ?? 0
                  const videoResourceTitle = chapter.resources?.find((resource) => resource.type === 'VIDEO')?.title ?? null

                  return (
                    <Link
                      key={chapter.id}
                      href={`/guild/formation/chapters/${chapter.id}`}
                      className="block border border-[#B794F4]/30 bg-[#1e1e1e] rounded hover:border-[#B794F4] hover:bg-purple-400/5 transition-all duration-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="text-white font-bold text-sm md:text-base flex items-center gap-2">
                            {isCompleted && <Icons.CheckCircle size={16} className="text-[#10B981]" />}
                            {videoResourceTitle ?? chapter.title}
                          </h3>
                          {chapter.description && (
                            <p className="text-gray-400 text-xs mt-1">{chapter.description}</p>
                          )}
                          {videoResourceTitle && videoResourceTitle !== chapter.title && (
                            <p className="text-gray-500 text-[11px] mt-1 italic">Vidéo : {videoResourceTitle}</p>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 font-bold">
                          {isCompleted ? 'Terminé' : `${percent}%`}
                        </div>
                      </div>
                      {percent > 0 && !isCompleted && (
                        <div className="mt-2">
                          <ProgressBar percentage={percent} />
                        </div>
                      )}
                    </Link>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
