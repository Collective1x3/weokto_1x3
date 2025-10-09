'use client'

import { ChatCircle, Hash, Lock, Megaphone, Users } from 'phosphor-react'
import ComingSoonCard from '@/components/weokto/guild/ComingSoonCard'

export default function ChatPlaceholder() {
  return (
    <div className="p-6">
      {/* Mock channel list preview */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="border-2 border-[#B794F4]/30 bg-black/50 p-4 font-mono">
          <h3 className="text-[#FFB000] text-xs font-bold mb-4">{'> APERÇU DES FUTURS CHANNELS'}</h3>

          <div className="space-y-2">
            <div className="flex items-center gap-3 p-2 text-[#B794F4]/50">
              <Hash size={16} />
              <span className="text-sm">général</span>
              <Users size={14} className="ml-auto" />
              <span className="text-xs">234</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-[#B794F4]/50">
              <Megaphone size={16} />
              <span className="text-sm">annonces</span>
              <Lock size={14} className="ml-auto" />
            </div>

            <div className="flex items-center gap-3 p-2 text-[#B794F4]/50">
              <Hash size={16} />
              <span className="text-sm">questions</span>
              <Users size={14} className="ml-auto" />
              <span className="text-xs">45</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-[#B794F4]/50">
              <Hash size={16} />
              <span className="text-sm">wins</span>
              <Users size={14} className="ml-auto" />
              <span className="text-xs">12</span>
            </div>

            <div className="flex items-center gap-3 p-2 text-[#B794F4]/50">
              <Lock size={16} />
              <span className="text-sm">vip-lounge</span>
              <span className="text-xs text-[#FFB000] ml-auto">[PREMIUM]</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Module Chat"
        description="Système de discussion en temps réel avec channels, mentions et réactions. Bientôt disponible!"
        icon={<ChatCircle size={64} weight="duotone" className="text-[#FFB000]" />}
        variant="default"
      />
    </div>
  )
}