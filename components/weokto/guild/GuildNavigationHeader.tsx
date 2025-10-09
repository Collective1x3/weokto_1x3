'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import {
  Crown,
  GridFour,
  ChatCircle,
  GraduationCap,
  Trophy,
  Lifebuoy,
  Lightning
} from 'phosphor-react'
import { type ReactNode, useMemo } from 'react'

interface HeaderTab {
  key: string
  label: string
  href: string
  icon?: ReactNode
  match?: (pathname: string, params: ReturnType<typeof useSearchParams>) => boolean
}

interface GuildNavigationHeaderProps {
  guildName: string
  subtitle?: string
  icon?: ReactNode
  className?: string
  /**
   * Personnalise les onglets affichés dans le header.
   * Si non fourni, on retombe sur la navigation membre par défaut.
   */
  tabs?: HeaderTab[]
  /**
   * Affiche ou masque le bouton [UPGRADE].
   */
  showUpgrade?: boolean
  /**
   * Zone additionnelle affichée à droite des onglets (ex : bouton d’action).
   */
  rightSlot?: ReactNode
}

export default function GuildNavigationHeader({
  guildName,
  subtitle,
  icon,
  className,
  tabs,
  showUpgrade = true,
  rightSlot
}: GuildNavigationHeaderProps) {
  const pathname = usePathname()

  const defaultTabs = useMemo<HeaderTab[]>(
    () => [
      {
        key: 'home',
        label: '[HOME]',
        href: '/guild/home',
        icon: <GridFour size={18} weight={pathname === '/guild/home' ? 'bold' : 'regular'} />
      },
      {
        key: 'chat',
        label: '[CHAT]',
        href: '/guild/chat',
        icon: <ChatCircle size={18} weight={pathname?.startsWith('/guild/chat') ? 'bold' : 'regular'} />
      },
      {
        key: 'formation',
        label: '[FORMATION]',
        href: '/guild/formation',
        icon: <GraduationCap size={18} weight={pathname?.startsWith('/guild/formation') ? 'bold' : 'regular'} />
      },
      {
        key: 'wins',
        label: '[WINS]',
        href: '/guild/wins',
        icon: <Trophy size={18} weight={pathname?.startsWith('/guild/wins') ? 'bold' : 'regular'} />
      },
      {
        key: 'support',
        label: '[SUPPORT]',
        href: '/guild/support',
        icon: <Lifebuoy size={18} weight={pathname?.startsWith('/guild/support') ? 'bold' : 'regular'} />
      }
    ],
    [pathname]
  )

  const navTabs = tabs ?? defaultTabs

  const searchParams = useSearchParams()

  const isActive = (href: string) => {
    if (!pathname) return false
    if (pathname === href) return true
    // autorise les sous-routes
    return pathname.startsWith(`${href}/`)
  }

  return (
    <div className={`mb-4 rounded-2xl border border-[#B794F4] bg-[#1e1e1e] p-4 font-mono ${className ?? ''}`}>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-[#B794F4] bg-purple-400/10">
            {icon ?? <Crown size={24} className="text-purple-400" />}
          </div>
          <div>
            <h1 className="whitespace-nowrap text-xl font-bold text-white">{guildName}</h1>
            {subtitle && <p className="mt-1 max-w-3xl text-xs text-gray-500">{subtitle}</p>}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          {navTabs.map((tab) => {
            const active = tab.match ? tab.match(pathname ?? '', searchParams) : isActive(tab.href)
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold uppercase transition-all duration-200 ${
                  active
                    ? 'bg-purple-400/20 text-[#B794F4] border-[#B794F4]'
                    : 'bg-transparent text-gray-400 border-[#B794F4]/30 hover:text-white hover:border-[#B794F4] hover:bg-purple-400/10'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </Link>
            )
          })}

          {showUpgrade && (
            <button className="group inline-flex items-center gap-2 rounded-lg border border-[#FFB000]/50 bg-transparent px-4 py-2 text-xs font-bold uppercase text-[#FFB000] transition-all duration-200 hover:border-[#FFB000] hover:bg-[#FFB000]/10">
              <Lightning size={18} className="group-hover:animate-pulse" />
              <span>[UPGRADE]</span>
            </button>
          )}

          {rightSlot}
        </div>
      </div>
    </div>
  )
}
