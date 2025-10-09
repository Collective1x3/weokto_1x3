'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect, type ReactNode } from 'react'
import Image from 'next/image'
import {
  House,
  Sparkle,
  Trophy,
  ShoppingBag,
  ChartLine,
  Gear,
  SignOut,
  CaretLeft,
  CaretRight,
  Shield,
  Sword,
  CaretDown,
  List,
  ChatCircle,
  GraduationCap,
  Lifebuoy,
  GridFour,
  User
} from 'phosphor-react'

const businessNavigation = [
  { name: 'Dashboard', href: '/home', icon: House },
  { name: 'Pearls', href: '/pearls', icon: Sparkle },
  { name: 'Products', href: '/products', icon: ShoppingBag },
  { name: 'Analytics', href: '/analytics', icon: ChartLine },
  { name: 'Messages', href: '/messages', icon: ChatCircle },
]

const communityNavigation = [
  { name: 'Guild', href: '/guild', icon: Shield },
  { name: 'Clan', href: '/clan', icon: Sword },
  { name: 'Leaderboards', href: '/leaderboards', icon: Trophy },
]

const guildNavigation = [
  { name: 'Home', href: '/guild/home', icon: GridFour },
  { name: 'Chat', href: '/guild/chat', icon: ChatCircle },
  { name: 'Formation', href: '/guild/formation', icon: GraduationCap },
  { name: 'Wins', href: '/guild/wins', icon: Trophy },
  { name: 'Support', href: '/guild/support', icon: Lifebuoy },
]

interface DashboardSidebarProps {
  userName?: string
  userLevel?: number
  userXP?: number
  maxXP?: number
}

export default function DashboardSidebarRedesigned({
  userName = 'User',
  userLevel = 12,
  userXP = 1250,
  maxXP = 1800
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const isGuildRoute = pathname.startsWith('/guild')
  const [isGuildExpanded, setIsGuildExpanded] = useState(() => isGuildRoute)

  const xpPercentage = Math.round((userXP / maxXP) * 100)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (isSidebarOpen && isMobile) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isSidebarOpen, isMobile])

  useEffect(() => {
    if (isMobile) {
      setIsSidebarOpen(false)
    }
    if (isGuildRoute) {
      setIsGuildExpanded(true)
    }
  }, [pathname, isMobile, isGuildRoute])

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => {
    const Icon = item.icon

    return (
      <Link
        href={item.href}
        title={isCollapsed ? item.name : undefined}
        className={`
          group relative flex items-center gap-3 px-3 py-2.5
          rounded-lg transition-all duration-200
          hover:bg-purple-400/10
          focus:outline-none focus:ring-2 focus:ring-purple-400/50
          ${isActive
            ? 'bg-purple-400/20 text-white'
            : 'text-gray-400 hover:text-white'
          }
          ${isCollapsed && !isMobile ? 'justify-center' : ''}
        `}
      >
        <Icon
          size={20}
          weight={isActive ? 'fill' : 'regular'}
          className={`flex-shrink-0 transition-colors ${
            isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'
          }`}
        />
        {!isCollapsed && (
          <span className="font-medium text-sm">{item.name}</span>
        )}
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full transition-all duration-200" />
        )}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 z-50 p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-xl shadow-lg transition-all duration-200"
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <List size={24} weight="bold" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        flex flex-col bg-[#0A0A0F] border-r border-purple-400/10
        transition-all duration-300 ease-in-out
        ${isMobile
          ? `fixed top-0 left-0 h-full z-40 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
          : `relative ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`
        }
      `}>

        {/* Header */}
        <div className={`p-4 border-b border-purple-400/10 ${isCollapsed && !isMobile ? 'px-3' : ''}`}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Image
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto"
                width={40}
                height={40}
                priority
                className="flex-shrink-0"
              />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="text-white font-bold text-lg">Weokto</span>
                <span className="text-purple-400/60 text-xs uppercase tracking-wider">Platform</span>
              </div>
            )}
          </div>
        </div>

        {/* Collapse Toggle - Desktop only */}
        {!isMobile && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute top-7 -right-3 z-10 p-1.5 bg-[#12121A] border border-purple-400/20 rounded-lg hover:bg-purple-400/10 hover:border-purple-400/40 transition-all duration-200"
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <CaretRight size={14} weight="bold" className="text-purple-400" />
            ) : (
              <CaretLeft size={14} weight="bold" className="text-purple-400" />
            )}
          </button>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto space-y-6">

          {/* Business Section */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</h3>
              </div>
            )}
            <div className="space-y-1">
              {businessNavigation.map((item) => (
                <NavItem key={item.name} item={item} isActive={pathname === item.href} />
              ))}
            </div>
          </div>

          {/* Community Section */}
          <div>
            {!isCollapsed && (
              <div className="px-3 mb-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Community</h3>
              </div>
            )}
            <div className="space-y-1">
              {communityNavigation.map((item) => {
                const isGuildItem = item.name === 'Guild'
                const isActive = pathname === item.href || (isGuildItem && isGuildRoute)

                if (isGuildItem) {
                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setIsGuildExpanded(!isGuildExpanded)}
                        className={`
                          group relative w-full flex items-center justify-between gap-3 px-3 py-2.5
                          rounded-lg transition-all duration-200
                          hover:bg-purple-400/10
                          focus:outline-none focus:ring-2 focus:ring-purple-400/50
                          ${isActive
                            ? 'bg-purple-400/20 text-white'
                            : 'text-gray-400 hover:text-white'
                          }
                        `}
                      >
                        <div className="flex items-center gap-3">
                          <Shield
                            size={20}
                            weight={isActive ? 'fill' : 'regular'}
                            className={`flex-shrink-0 transition-colors ${
                              isActive ? 'text-purple-400' : 'text-gray-500 group-hover:text-purple-400'
                            }`}
                          />
                          {!isCollapsed && (
                            <span className="font-medium text-sm">Guild</span>
                          )}
                        </div>
                        {!isCollapsed && (
                          <CaretDown
                            size={14}
                            className={`transition-transform duration-200 ${
                              isGuildExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-purple-400 rounded-r-full transition-all duration-200" />
                        )}
                      </button>

                      {/* Guild Submenu */}
                      {!isCollapsed && (
                        <div className={`
                          mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ease-out
                          ${isGuildExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}
                        `}>
                          {guildNavigation.map((subItem) => {
                            const isSubActive = pathname === subItem.href ||
                                              (pathname === '/guild' && subItem.href === '/guild/home')
                            const SubIcon = subItem.icon

                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={`
                                  group relative flex items-center gap-2 px-3 py-2
                                  rounded-lg transition-all duration-200
                                  hover:bg-orange-500/10
                                  ${isSubActive
                                    ? 'bg-orange-500/20 text-orange-400'
                                    : 'text-gray-500 hover:text-orange-400'
                                  }
                                `}
                              >
                                <SubIcon
                                  size={16}
                                  weight={isSubActive ? 'fill' : 'regular'}
                                  className="flex-shrink-0"
                                />
                                <span className="text-sm">{subItem.name}</span>
                              </Link>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                }

                return <NavItem key={item.name} item={item} isActive={pathname === item.href} />
              })}
            </div>
          </div>
        </nav>

        {/* User Profile Section */}
        <div className={`border-t border-purple-400/10 p-3`}>
          <Link
            href="/profile"
            className={`
              flex items-center gap-3 p-3 rounded-lg
              bg-gradient-to-r from-purple-500/10 to-orange-500/10
              hover:from-purple-500/20 hover:to-orange-500/20
              border border-purple-400/10 hover:border-purple-400/20
              transition-all duration-200
              ${isCollapsed && !isMobile ? 'justify-center' : ''}
            `}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-orange-500 p-[1px]">
                <div className="w-full h-full bg-[#0A0A0F] rounded-[7px] flex items-center justify-center">
                  <User size={20} className="text-purple-400" />
                </div>
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                {userLevel}
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-white text-sm font-semibold">{userName}</span>
                  <span className="text-orange-400 text-xs font-mono">LVL {userLevel}</span>
                </div>

                {/* XP Progress Bar */}
                <div className="mt-1">
                  <div className="flex items-center justify-between text-[10px] text-gray-500 mb-0.5">
                    <span>{userXP} XP</span>
                    <span>{xpPercentage}%</span>
                  </div>
                  <div className="h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-orange-500 rounded-full transition-all duration-500"
                      style={{ width: `${xpPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </Link>
        </div>

        {/* Bottom Actions */}
        <div className="border-t border-purple-400/10 p-3 space-y-1">
          <Link
            href="/settings"
            className={`
              group flex items-center gap-3 px-3 py-2 rounded-lg
              text-gray-400 hover:text-white hover:bg-white/5
              transition-all duration-200
              ${isCollapsed && !isMobile ? 'justify-center' : ''}
            `}
          >
            <Gear size={20} className="group-hover:rotate-90 transition-transform duration-300" />
            {!isCollapsed && <span className="text-sm">Settings</span>}
          </Link>

          <button
            onClick={async () => {
              try {
                await fetch('/api/auth/logout', { method: 'POST' })
                window.location.href = '/'
              } catch (error) {
                console.error('Logout error:', error)
              }
            }}
            className={`
              group w-full flex items-center gap-3 px-3 py-2 rounded-lg
              text-gray-400 hover:text-red-400 hover:bg-red-500/10
              transition-all duration-200
              ${isCollapsed && !isMobile ? 'justify-center' : ''}
            `}
          >
            <SignOut size={20} />
            {!isCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </div>
    </>
  )
}