'use client'

import { use, useState, useCallback, useEffect, useMemo } from 'react'
import useSWR from 'swr'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import * as Icons from 'phosphor-react'
import { FormationTree, type FormationTreeCategory } from '@/components/weokto/formations/FormationTree'
import { VideoPlayer } from '@/components/weokto/user/formations/VideoPlayer'
import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import { useCurrentGuild } from '@/hooks/useCurrentGuild'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

interface ChapterPlaybackResponse {
  chapter: {
    id: string
    title: string
    description: string | null
    formationId: string
    sectionId: string | null
    resources: Array<{
      id: string
      type: 'VIDEO' | 'PDF' | 'AUDIO' | 'LINK'
      title: string
      description: string | null
      playbackUrl?: string
      embedUrl?: string | null
      downloadUrl?: string
      bunnyStatus?: string | null
      duration?: number | null
      expiresIn?: number
      thumbnailUrl?: string | null
    }>
  }
  navigation: {
    previous: { id: string; title: string } | null
    next: { id: string; title: string } | null
  }
  formation: {
    id: string
    title: string
    slug: string | null
  }
  section: {
    id: string
    title: string | null
  } | null
}

interface FormationDetailResponse {
  formation: {
    id: string
    title: string
    description: string | null
    sections: Array<{
      id: string
      title: string
      chapters: Array<{
        id: string
        title: string
        resources: Array<{
          id: string
          type: 'VIDEO' | 'PDF' | 'AUDIO' | 'LINK'
          title: string
          bunnyStatus: string | null
        }>
      }>
    }>
  }
}

interface ProgressResponse {
  progress: Array<{
    chapterId: string
    watchedSeconds: number | null
    completed: boolean
  }>
}

export default function ChapterPlaybackPage({ params }: { params: Promise<{ chapterId: string }> }) {
  const { chapterId } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const moduleParam = searchParams?.get('module')

  const { data, error, isLoading, mutate } = useSWR<ChapterPlaybackResponse>(
    `/api/user/guild/chapters/${chapterId}/play`,
    fetcher,
    { refreshInterval: 60_000 }
  )
  const { data: progressData } = useSWR<ProgressResponse>('/api/user/guild/formations/progress', fetcher)

  const formationId = data?.formation.id
  const { data: formationDetail } = useSWR<FormationDetailResponse>(
    formationId ? `/api/user/guild/formations/${formationId}` : null,
    fetcher
  )
  const { guild, isLoading: guildLoading } = useCurrentGuild()

  const chapterProgress = progressData?.progress.find((entry) => entry.chapterId === chapterId)
  const [completed, setCompleted] = useState(chapterProgress?.completed ?? false)
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(moduleParam ?? null)

  useEffect(() => {
    if (chapterProgress) {
      setCompleted(chapterProgress.completed)
    }
  }, [chapterProgress])

  const chapter = data?.chapter

  useEffect(() => {
    if (!chapter) return
    const fallbackModule =
      moduleParam || chapter.resources.find((resource) => resource.type === 'VIDEO')?.id || chapter.resources[0]?.id || null
    setSelectedModuleId(fallbackModule)
  }, [chapter?.id])

  const selectedModule = useMemo(() => {
    if (!chapter?.resources) return null
    return chapter.resources.find((resource) => resource.id === selectedModuleId) ?? null
  }, [chapter?.resources, selectedModuleId])

  const otherResources = useMemo(() => {
    if (!chapter?.resources) return []
    return chapter.resources.filter((resource) => resource.id !== selectedModule?.id)
  }, [chapter?.resources, selectedModule?.id])

  const treeCategories: FormationTreeCategory[] = useMemo(() => {
    if (!formationDetail?.formation) return []
    return formationDetail.formation.sections.flatMap((section) =>
      section.chapters.map((chapterItem) => ({
        id: chapterItem.id,
        title: chapterItem.title || section.title,
        modules: chapterItem.resources.map((resource) => ({
          id: resource.id,
          title: resource.title,
          type: resource.type,
          status: resource.bunnyStatus,
          chapterId: chapterItem.id
        }))
      }))
    )
  }, [formationDetail?.formation])

  const handleComplete = useCallback(async () => {
    if (completed) return
    try {
      await fetch(`/api/user/guild/chapters/${chapterId}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: true })
      })
      setCompleted(true)
      mutate()
    } catch (err) {
      console.error('Failed to mark chapter complete', err)
    }
  }, [chapterId, completed, mutate])

  if (isLoading || guildLoading) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={guild?.name ?? 'Chargement...'} />
        <div className="mx-auto mt-8 flex w-full max-w-6xl flex-col items-center gap-4 text-center text-gray-500">
          <Icons.CircleNotch size={48} className="animate-spin text-purple-400" />
          <p className="text-sm">Chargement du chapitre...</p>
        </div>
      </div>
    )
  }

  if (error || !chapter || !guild) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={guild?.name ?? 'Formation'} />
        <div className="mx-auto mt-4 w-full max-w-6xl">
          <div className="border border-[#EF4444] bg-[#EF4444]/10 rounded-lg p-6 font-mono text-center">
            <Icons.Warning size={32} className="text-[#EF4444] mx-auto mb-3" />
            <p className="text-[#EF4444] font-bold">Chapitre introuvable</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 font-mono">
      <GuildNavigationHeader guildName={guild.name} />
      <div className="mx-auto mt-4 flex w-full max-w-6xl flex-col gap-6 lg:flex-row lg:items-start">
        <main className="flex-1 space-y-6">
          <Link
            href={`/guild/formation/${chapter.formationId}`}
            className="inline-flex items-center gap-2 text-[#B794F4] hover:text-white transition-all duration-200 text-sm"
          >
            <Icons.CaretLeft size={16} /> Retour à la formation
          </Link>

          <header className="space-y-2">
            <p className="text-xs text-gray-500 uppercase tracking-wide">
              {data?.section?.title ? data.section.title : 'Catégorie'}
            </p>
            <h1 className="text-2xl text-white font-bold uppercase">{chapter.title}</h1>
            {chapter.description && <p className="text-gray-400 text-sm">{chapter.description}</p>}
          </header>

          {selectedModule ? (
            <VideoPlayer
              embedUrl={selectedModule.embedUrl ?? selectedModule.playbackUrl ?? null}
              onComplete={completed ? undefined : handleComplete}
            />
          ) : (
            <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-6 text-center">
              <Icons.VideoCameraSlash size={32} className="text-gray-500 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Aucun module sélectionné.</p>
            </div>
          )}

          {selectedModule?.description && (
            <div className="border border-[#B794F4]/30 bg-[#1e1e1e] rounded-lg p-4">
              <h3 className="text-purple-400 text-xs uppercase tracking-wide mb-2">Description</h3>
              <p className="text-sm text-gray-400 whitespace-pre-wrap">{selectedModule.description}</p>
            </div>
          )}

          <div className="flex items-center gap-3 text-xs text-gray-500">
            {completed && <span className="text-[#10B981]">Chapitre terminé</span>}
          </div>

          {otherResources.length > 0 && (
            <div className="border border-[#B794F4]/30 bg-[#1e1e1e] rounded-lg p-4 space-y-3">
              <h2 className="text-white font-bold text-sm flex items-center gap-2">
                <Icons.Paperclip size={16} className="text-purple-400" /> Ressources complémentaires
              </h2>
              <div className="space-y-3">
                {otherResources.map((resource) => (
                  <ResourceAttachment key={resource.id} resource={resource} />
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            {data.navigation.previous && (
              <Link
                href={`/guild/formation/chapters/${data.navigation.previous.id}`}
                className="px-4 py-2 rounded border border-[#B794F4] text-[#B794F4] hover:bg-purple-400/10 transition-all duration-200 text-xs"
              >
                <Icons.CaretLeft size={14} className="inline mr-1" /> {data.navigation.previous.title}
              </Link>
            )}
            {data.navigation.next && (
              <Link
                href={`/guild/formation/chapters/${data.navigation.next.id}`}
                className="px-4 py-2 rounded bg-purple-400 text-black font-bold hover:bg-purple-400/80 transition-all duration-200 text-xs"
              >
                {data.navigation.next.title} <Icons.CaretRight size={14} className="inline ml-1" />
              </Link>
            )}
          </div>
        </main>

        <div className="w-full lg:w-[320px]">
          <FormationTree
            categories={treeCategories}
            selectedModuleId={selectedModuleId}
            onSelectModule={(moduleId, targetChapterId) => {
              if (targetChapterId !== chapter.id) {
                router.push(`/guild/formation/chapters/${targetChapterId}?module=${moduleId}`)
                return
              }
              setSelectedModuleId(moduleId)
            }}
          />
        </div>
      </div>
    </div>
  )
}

function ResourceAttachment({
  resource
}: {
  resource: ChapterPlaybackResponse['chapter']['resources'][number]
}) {
  const icon = getResourceIcon(resource.type)
  const label = getResourceLabel(resource.type)
  const preview = renderResourcePreview(resource)
  const externalUrl = resource.downloadUrl ?? resource.embedUrl ?? resource.playbackUrl ?? undefined

  return (
    <div className="border border-[#B794F4]/20 bg-[#1e1e1e] rounded p-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-sm text-white">
          {icon}
          <span className="font-bold">{resource.title}</span>
        </div>
        <span className="text-[11px] text-gray-500 uppercase tracking-wide">{label}</span>
      </div>
      {resource.description && <p className="text-gray-400 text-xs">{resource.description}</p>}
      {preview}
      <div className="flex flex-wrap gap-2 text-xs text-gray-400">
        {resource.type !== 'LINK' && externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded border border-[#B794F4]/30 hover:border-[#B794F4] transition-all duration-200"
          >
            <Icons.DownloadSimple size={12} /> Télécharger
          </a>
        )}
        {resource.type === 'LINK' && externalUrl && (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1 rounded border border-[#B794F4]/30 hover:border-[#B794F4] transition-all duration-200"
          >
            Ouvrir le lien <Icons.ArrowSquareOut size={12} />
          </a>
        )}
      </div>
    </div>
  )
}

function getResourceIcon(type: ChapterPlaybackResponse['chapter']['resources'][number]['type']) {
  switch (type) {
    case 'PDF':
      return <Icons.FilePdf size={16} className="text-purple-400" />
    case 'AUDIO':
      return <Icons.Headphones size={16} className="text-purple-400" />
    case 'LINK':
      return <Icons.LinkSimple size={16} className="text-purple-400" />
    default:
      return <Icons.Paperclip size={16} className="text-purple-400" />
  }
}

function getResourceLabel(type: ChapterPlaybackResponse['chapter']['resources'][number]['type']) {
  switch (type) {
    case 'PDF':
      return 'Document'
    case 'AUDIO':
      return 'Audio'
    case 'LINK':
      return 'Lien externe'
    default:
      return 'Ressource'
  }
}

function renderResourcePreview(resource: ChapterPlaybackResponse['chapter']['resources'][number]) {
  if (resource.type === 'PDF') {
    if (!resource.downloadUrl) {
      return <p className="text-gray-500 text-xs">Lien PDF non disponible.</p>
    }
    return <iframe src={resource.downloadUrl} className="w-full h-64 border border-[#B794F4]/20 rounded" title={resource.title} />
  }

  if (resource.type === 'AUDIO') {
    const src = resource.downloadUrl ?? resource.playbackUrl
    if (!src) {
      return <p className="text-gray-500 text-xs">Lecture audio indisponible.</p>
    }
    return <audio controls src={src} className="w-full" />
  }

  if (resource.type === 'LINK') {
    const href = resource.downloadUrl ?? resource.playbackUrl
    if (!href) {
      return <p className="text-gray-500 text-xs">Lien indisponible.</p>
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-purple-400 hover:text-white transition-colors text-sm"
      >
        {href}
        <Icons.ArrowSquareOut size={14} />
      </a>
    )
  }

  return null
}
