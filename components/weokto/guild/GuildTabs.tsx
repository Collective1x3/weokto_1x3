'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChatCircle, GraduationCap, Trophy, Lifebuoy } from 'phosphor-react'

const tabs = [
  {
    name: '[CHAT]',
    href: '/guild/chat',
    icon: ChatCircle,
    description: 'Discussions et channels'
  },
  {
    name: '[FORMATION]',
    href: '/guild/formation',
    icon: GraduationCap,
    description: 'Cours et apprentissage'
  },
  {
    name: '[WINS]',
    href: '/guild/wins',
    icon: Trophy,
    description: 'Succès de la communauté'
  },
  {
    name: '[SUPPORT]',
    href: '/guild/support',
    icon: Lifebuoy,
    description: 'Aide et coaching'
  }
]

export default function GuildTabs() {
  const pathname = usePathname()

  return (
    <div className="border-b border-[#B794F4]/20 bg-[#1e1e1e] font-mono">
      <div className="flex flex-col sm:flex-row">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = pathname === tab.href ||
                          (pathname === '/guild' && tab.href === '/guild/chat')

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`
                flex items-center gap-3 px-6 py-4 text-sm transition-all duration-200
                border-b border-[#B794F4]/20 sm:border-b-0 sm:border-r sm:border-r-[#B794F4]/20 last:border-r-0
                ${isActive
                  ? 'bg-purple-400/20 text-white border-l-2 border-l-[#B794F4] sm:border-l-0 sm:border-b-2 sm:border-b-[#B794F4]'
                  : 'text-gray-400 hover:text-white hover:bg-purple-400/10'
                }
              `}
            >
              <Icon
                size={20}
                weight={isActive ? 'fill' : 'regular'}
                className={`flex-shrink-0 ${isActive ? 'text-purple-400' : ''}`}
              />
              <div className="flex-1">
                <div className="font-bold">{tab.name}</div>
                <div className={`text-xs ${isActive ? 'text-gray-400' : 'text-gray-500'} hidden sm:block`}>
                  {tab.description}
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}