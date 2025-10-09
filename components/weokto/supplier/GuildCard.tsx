'use client'

import Link from 'next/link'
import * as Icons from 'phosphor-react'

interface GuildCardProps {
  guild: {
    id: string
    name: string
    slug: string
    status: string
    domain?: string | null
    imageUrl?: string | null
    description?: string | null
    createdAt: string
    _count?: {
      guildUsers: number
      guildPlans: number
    }
  }
}

export function GuildCard({ guild }: GuildCardProps) {
  const statusColors = {
    PENDING: 'border-[#FFB000] bg-[#FFB000]/10 text-[#FFB000]',
    APPROVED: 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]',
    SUSPENDED: 'border-[#EF4444] bg-[#EF4444]/10 text-[#EF4444]',
    BANNED: 'border-[#DC2626] bg-[#DC2626]/10 text-[#DC2626]',
  }

  const statusIcons = {
    PENDING: Icons.Clock,
    APPROVED: Icons.CheckCircle,
    SUSPENDED: Icons.PauseCircle,
    BANNED: Icons.XCircle,
  }

  const StatusIcon = statusIcons[guild.status as keyof typeof statusIcons] || Icons.Circle

  return (
    <Link href={`/supplier/guilds/${guild.slug}`}>
      <div className="rounded-2xl border border-[#B794F4] bg-[#1e1e1e] hover:bg-purple-400/5 transition-all duration-200 p-4 sm:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {guild.imageUrl ? (
              <img
                src={guild.imageUrl}
                alt={guild.name}
                className="w-12 h-12 rounded-lg border border-[#B794F4]"
              />
            ) : (
              <div className="w-12 h-12 rounded-lg border border-[#B794F4] bg-purple-400/20 flex items-center justify-center">
                <Icons.Buildings size={24} className="text-purple-400" />
              </div>
            )}
            <div>
              <h3 className="text-lg font-bold text-white">{guild.name}</h3>
              <p className="text-xs text-gray-500">/{guild.slug}</p>
            </div>
          </div>

          <div
            className={`px-3 py-1 rounded border text-xs font-bold flex items-center gap-1 ${
              statusColors[guild.status as keyof typeof statusColors] ||
              'border-[#B794F4] bg-[#B794F4]/10 text-[#B794F4]'
            }`}
          >
            <StatusIcon size={12} weight="fill" />
            {guild.status}
          </div>
        </div>

        {guild.description && (
          <p className="text-sm text-gray-400 mb-4 line-clamp-2">{guild.description}</p>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#B794F4]/20">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icons.Users size={16} className="text-purple-400" />
              <span className="text-xs text-gray-500">MEMBRES</span>
            </div>
            <p className="text-xl font-bold text-white">{guild._count?.guildUsers || 0}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <Icons.CreditCard size={16} className="text-purple-400" />
              <span className="text-xs text-gray-500">PLANS</span>
            </div>
            <p className="text-xl font-bold text-white">{guild._count?.guildPlans || 0}</p>
          </div>
        </div>

        {guild.domain && (
          <div className="mt-4 pt-4 border-t border-[#B794F4]/20">
            <div className="flex items-center gap-2">
              <Icons.Globe size={14} className="text-gray-500" />
              <span className="text-xs text-gray-400 truncate">{guild.domain}</span>
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}
