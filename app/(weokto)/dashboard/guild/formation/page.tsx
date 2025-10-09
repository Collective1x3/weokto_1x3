import { unstable_cache } from 'next/cache'
import { redirect } from 'next/navigation'

import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import { FormationModuleCard } from '@/components/weokto/user/formations/FormationModuleCard'
import { getSession } from '@/lib/auth/session'
import { loadGuildOverviewForUser } from '@/lib/guild/overview'
import { listPublishedFormationsForGuild, listUserProgress } from '@/lib/formations/service'
import type { FormationDTO, ChapterProgressDTO } from '@/lib/formations/serializers'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const getPublishedFormationsCached = unstable_cache(
  async (guildId: string) => listPublishedFormationsForGuild(guildId),
  ['guild-published-formations'],
  { revalidate: 60 }
)

interface FormationCardData {
  id: string
  title: string
  description: string | null
  sectionsCount: number
  chaptersCount: number
  progressPercent: number
  completedChapters: number
  nextChapterId: string | null
  firstChapterId: string | null
  previewThumbnail: string | null
  isCompleted: boolean
  lastActivity: string | null
}

function buildFormationCards(formations: FormationDTO[], progressEntries: ChapterProgressDTO[]): FormationCardData[] {
  return formations.map((formation) => {
    const sections = formation.sections ?? []

    const chapters = sections.flatMap((section) =>
      section.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        sectionTitle: section.title,
        resources: chapter.resources ?? []
      }))
    )

    const chapterIds = chapters.map((chapter) => chapter.id)
    const chapterProgress = progressEntries.filter((entry) => chapterIds.includes(entry.chapterId))
    const completedChapters = chapterProgress.filter((entry) => entry.completed).length
    const chaptersCount = chapters.length
    const progressPercent = chaptersCount === 0 ? 0 : Math.round((completedChapters / chaptersCount) * 100)

    const completedSet = new Set(chapterProgress.filter((entry) => entry.completed).map((entry) => entry.chapterId))
    const nextChapter = chapters.find((chapter) => !completedSet.has(chapter.id)) ?? null
    const allResources = chapters.flatMap((chapter) => chapter.resources)
    const previewResourceWithThumbnail = allResources.find((resource) => resource.thumbnailUrl) ?? null
    const fallbackVideo = allResources.find((resource) => resource.type === 'VIDEO' && resource.thumbnailUrl) ?? null
    const firstChapterId = chapters[0]?.id ?? null
    const continueChapterId = nextChapter?.id ?? firstChapterId

    const lastActivity = chapterProgress.reduce<string | null>((latest, entry) => {
      if (!entry.lastWatchedAt) return latest
      if (!latest) return entry.lastWatchedAt
      return new Date(entry.lastWatchedAt) > new Date(latest) ? entry.lastWatchedAt : latest
    }, null)

    return {
      id: formation.id,
      title: formation.title,
      description: formation.description,
      sectionsCount: sections.length,
      chaptersCount,
      progressPercent,
      completedChapters,
      nextChapterId: continueChapterId,
      firstChapterId,
      previewThumbnail: previewResourceWithThumbnail?.thumbnailUrl ?? fallbackVideo?.thumbnailUrl ?? null,
      isCompleted: progressPercent === 100,
      lastActivity
    }
  })
}

export default async function GuildFormationsPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const overview = await loadGuildOverviewForUser(session)

  if (overview.needsSetup || !overview.guild || !overview.membership) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={overview.guild?.name ?? 'Guilde'} />
        <div className="mx-auto mt-8 flex w-full max-w-5xl flex-col items-center gap-4 text-center text-gray-400">
          <div className="h-12 w-12 rounded-full border border-dashed border-purple-400/40" />
          <p className="text-sm">Aucune formation disponible pour le moment.</p>
        </div>
      </div>
    )
  }

  const guildId = overview.guild.id
  const [formations, progressEntries] = await Promise.all([
    getPublishedFormationsCached(guildId),
    listUserProgress(session.user.id, guildId)
  ])

  const cards = buildFormationCards(formations, progressEntries)

  return (
    <div className="min-h-screen p-4 font-mono">
      <GuildNavigationHeader guildName={overview.guild.name} />
      <div className="mx-auto mt-4 w-full max-w-6xl space-y-6">
        <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 text-sm text-gray-400">
          <span>Explore les formations de ta guilde.</span>
        </div>

        {cards.length === 0 ? (
          <div className="border border-dashed border-purple-400/40 bg-[#1e1e1e] rounded-lg p-12 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full border border-dashed border-purple-400/40" />
            <p className="text-gray-400 font-bold uppercase">Aucune formation disponible</p>
            <p className="text-gray-500 text-sm">Reviens plus tard, de nouveaux contenus arrivent bientôt.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cards.map((formation) => (
              <FormationModuleCard key={formation.id} formation={formation} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
