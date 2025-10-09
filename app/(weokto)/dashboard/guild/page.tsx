'use client'

import { useCurrentGuild } from '@/hooks/useCurrentGuild'
import GuildHeader from '@/components/weokto/guild/GuildHeader'
import GuildTabs from '@/components/weokto/guild/GuildTabs'
import ChatPlaceholder from '@/components/weokto/placeholders/ChatPlaceholder'
import { CircleNotch } from 'phosphor-react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function GuildPage() {
  const { guild, isLoading, error } = useCurrentGuild()
  const router = useRouter()

  useEffect(() => {
    // Si pas de guilde, rediriger vers choose-guild
    if (!isLoading && !guild && !error) {
      router.push('/choose-guild')
    }
  }, [guild, isLoading, error, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CircleNotch size={48} className="animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-purple-400 font-mono">Chargement de la guilde...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-[#EF4444] bg-[#1e1e1e] rounded-lg p-6 font-mono">
          <p className="text-[#EF4444] text-lg font-bold mb-2">Erreur de chargement</p>
          <p className="text-gray-400 text-sm">{error ?? 'Une erreur est survenue'}</p>
        </div>
      </div>
    )
  }

  if (!guild) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full border border-purple-400 bg-[#1e1e1e] rounded-lg p-6 font-mono text-center">
          <p className="text-purple-400 text-lg font-bold mb-2">Aucune guilde</p>
          <p className="text-gray-400 text-sm mb-4">Vous n'êtes membre d'aucune guilde</p>
          <button
            onClick={() => router.push('/choose-guild')}
            className="px-6 py-3 rounded-lg bg-purple-400/10 text-[#B794F4] hover:bg-purple-400/20 transition-all duration-200 font-bold text-sm border border-[#B794F4]/40 hover:border-[#B794F4]"
          >
            [REJOINDRE UNE GUILDE]
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <GuildHeader guild={guild} isLoading={isLoading} />
      <GuildTabs />
      <div className="min-h-[600px]">
        {/* Par défaut, afficher le chat placeholder */}
        <ChatPlaceholder />
      </div>
    </div>
  )
}
