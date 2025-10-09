'use client'

import { useCurrentGuild } from '@/hooks/useCurrentGuild'
import GuildNavigationHeader from '@/components/weokto/guild/GuildNavigationHeader'
import WinsPlaceholder from '@/components/weokto/placeholders/WinsPlaceholder'
import { CircleNotch } from 'phosphor-react'

export default function GuildWinsPage() {
  const { guild, isLoading } = useCurrentGuild()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-400 font-mono">Chargement des wins...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-4 font-mono">
      <GuildNavigationHeader guildName={guild?.name || ''} />
      <div className="min-h-[600px]">
        <WinsPlaceholder />
      </div>
    </div>
  )
}