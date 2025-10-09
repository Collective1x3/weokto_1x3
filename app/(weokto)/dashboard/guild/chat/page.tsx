import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import GuildChat, { type GuildChatProps } from '@/components/weokto/guild/GuildChat'
import { getSession } from '@/lib/auth/session'
import { loadGuildOverviewForUser } from '@/lib/guild/overview'
import { redirect } from 'next/navigation'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export default async function GuildChatPage() {
  const session = await getSession()

  if (!session) {
    redirect('/login')
  }

  const overview = await loadGuildOverviewForUser(session)

  if (overview.needsSetup || !overview.guild || !overview.membership) {
    return (
      <div className="min-h-screen p-4 font-mono">
        <GuildNavigationHeader guildName={overview.guild?.name ?? 'Guilde'} />
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-4 text-center text-gray-400">
          <p className="text-sm">Aucune guilde sélectionnée.</p>
        </div>
      </div>
    )
  }

  const viewerRole: NonNullable<GuildChatProps['viewerRole']> = (['MEMBER', 'SUPPORT', 'COACH', 'MODERATOR', 'ADMIN'] as const).includes(
    overview.membership.role as NonNullable<GuildChatProps['viewerRole']>
  )
    ? (overview.membership.role as NonNullable<GuildChatProps['viewerRole']>)
    : 'MEMBER'

  return (
    <div className="min-h-screen p-4 font-mono">
      <GuildNavigationHeader guildName={overview.guild.name} />
      <div className="mt-4">
        <GuildChat
          guildId={overview.guild.id}
          guildName={overview.guild.name}
          viewerRole={viewerRole}
        />
      </div>
    </div>
  )
}
