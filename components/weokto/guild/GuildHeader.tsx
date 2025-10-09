'use client'

import Image from 'next/image'
import { Buildings, Users, Calendar } from 'phosphor-react'
import { GuildInfo } from '@/types/guild'

interface GuildHeaderProps {
  guild: GuildInfo | null
  isLoading?: boolean
}

export default function GuildHeader({ guild, isLoading }: GuildHeaderProps) {
  if (isLoading) {
    return (
      <div className="border-b border-[#B794F4] bg-[#1e1e1e] p-6 font-mono">
        <div className="animate-pulse">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-purple-400/20 border border-purple-400 rounded-lg"></div>
            <div className="flex-1">
              <div className="h-8 bg-purple-400/20 rounded w-48 mb-2"></div>
              <div className="h-4 bg-purple-400/10 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!guild) {
    return (
      <div className="border-b border-[#EF4444] bg-[#1e1e1e] p-6 font-mono">
        <div className="text-[#EF4444]">
          <p className="text-lg font-bold">ERREUR: Aucune guilde trouvée</p>
          <p className="text-sm text-gray-400">Veuillez contacter le support</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-b border-[#B794F4] bg-[#1e1e1e] relative overflow-hidden font-mono">
      {/* Scanlines effect */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 z-0"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
          animation: 'scanlines 8s linear infinite'
        }}
      />

      <div className="relative z-10 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Guild Logo/Icon */}
          <div className="flex-shrink-0">
            {guild.imageUrl ? (
              <div className="w-20 h-20 border border-[#B794F4] rounded-lg overflow-hidden">
                <Image
                  src={guild.imageUrl}
                  alt={guild.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-20 h-20 border border-[#B794F4] bg-purple-400/10 rounded-lg flex items-center justify-center">
                <Buildings size={40} className="text-purple-400" />
              </div>
            )}
          </div>

          {/* Guild Info */}
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                {guild.name}
              </h1>
              {guild.status === 'APPROVED' && (
                <span className="inline-block px-3 py-1 bg-[#10B981]/10 border border-[#10B981] text-[#10B981] text-xs font-bold">
                  ACTIVE
                </span>
              )}
            </div>

            <p className="text-gray-500 text-sm mb-3">
              /{guild.slug}
            </p>

            {guild.description && (
              <p className="text-gray-400 text-sm mb-4 max-w-2xl">
                {guild.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <Users size={18} className="text-purple-400" />
                <span className="text-white text-sm">
                  <span className="font-bold">{guild.memberCount}</span>
                  <span className="text-gray-500 ml-1">MEMBRES</span>
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-purple-400" />
                <span className="text-white text-sm">
                  <span className="text-gray-500">CRÉÉE LE</span>
                  <span className="font-bold ml-1">
                    {new Date(guild.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}