'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useUserSession } from '@/contexts/UserSessionContext'
import {
  House,
  ShoppingBag,
  ChartLine,
  Sparkle,
  Shield,
  Trophy,
  CaretDown,
  GridFour,
  ChatCircle,
  GraduationCap,
  Lifebuoy,
  Sword,
  Gear,
  SignOut,
  MagicWand,
  User,
  Fire,
  PaintBrush,
  Bell,
  CaretRight,
  List
} from 'phosphor-react'

export default function WeoktoSidebar() {
  const { user } = useUserSession()
  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User'

  const [isGuildExpanded, setIsGuildExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

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

  return (
    <>
      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed top-4 right-4 p-3 bg-[#1e1e1e] border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black rounded-xl shadow-lg transition-all duration-200"
          style={{ zIndex: 9999 }}
          aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
        >
          <List size={24} weight="bold" />
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          style={{ zIndex: 9998 }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          bg-[#1e1e1e] rounded-2xl border border-[#B794F4] flex flex-col
          transition-all duration-300 ease-in-out
          ${isMobile
            ? `fixed top-0 left-0 h-full ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-[280px]`
            : 'relative w-[290px] h-full'
          }
        `}
        style={{ zIndex: isMobile ? 9998 : 'auto' }}
      >
      {/* Logo WEOKTO */}
      <div className="overflow-hidden p-3 flex justify-center">
        <pre className="text-[#B794F4] text-[8px] block text-left whitespace-pre" style={{display: 'block', lineHeight: '1.3', margin: 0}}>
{`██╗    ██╗███████╗ ██████╗ ██╗  ██╗████████╗ ██████╗
██║    ██║██╔════╝██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗
██║ █╗ ██║█████╗  ██║   ██║█████╔╝    ██║   ██║   ██║
██║███╗██║██╔══╝  ██║   ██║██╔═██╗    ██║   ██║   ██║
╚███╔███╔╝███████╗╚██████╔╝██║  ██╗   ██║   ╚██████╔╝
 ╚══╝╚══╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝`}
        </pre>
      </div>

      {/* Separator */}
      <div className="border-t border-[#B794F4]"></div>

      {/* Navigation */}
      <nav className="flex-1 p-3 overflow-y-auto space-y-6">
        {/* Business Category */}
        <div>
          <div className="px-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Business</h3>
          </div>
          <div className="space-y-1">
            <Link href="/home" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <House size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Dashboard</span>
            </Link>
            <Link href="/products" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ShoppingBag size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Marketplace</span>
            </Link>
            <Link href="/analytics" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ChartLine size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Analytics</span>
            </Link>
            <Link href="/oktoai" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <MagicWand size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">OktoAI</span>
            </Link>
          </div>
        </div>

        {/* Communauté Category */}
        <div>
          <div className="px-3 mb-2">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Communauté</h3>
          </div>
          <div className="space-y-1">
            {/* Guilde Dropdown */}
            <div>
              <button
                onClick={() => setIsGuildExpanded(!isGuildExpanded)}
                className="group relative w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <Shield size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
                  <span className="font-medium text-sm">Guilde</span>
                </div>
                <CaretDown
                  size={14}
                  className={`transition-transform duration-200 ${isGuildExpanded ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Guild Submenu */}
              <div className={`mt-1 ml-6 space-y-1 overflow-hidden transition-all duration-200 ease-out ${isGuildExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
                <Link href="/guild/home" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <GridFour size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Home</span>
                </Link>
                <Link href="/guild/chat" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <ChatCircle size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Chat</span>
                </Link>
                <Link href="/guild/formation" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <GraduationCap size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Formation</span>
                </Link>
                <Link href="/guild/wins" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <Trophy size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Victoires</span>
                </Link>
                <Link href="/guild/support" className="group relative w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-orange-500/10 text-gray-500 hover:text-orange-400">
                  <Lifebuoy size={16} weight="regular" className="flex-shrink-0" />
                  <span className="text-sm">Support</span>
                </Link>
              </div>
            </div>

            {/* Messages */}
            <Link href="/messages" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <ChatCircle size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Messages</span>
            </Link>

            {/* Compétition */}
            <Link href="/competition" className="group relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 hover:bg-purple-400/10 text-gray-400 hover:text-white">
              <Sword size={20} weight="regular" className="flex-shrink-0 text-gray-500 group-hover:text-purple-400 transition-colors" />
              <span className="font-medium text-sm">Compétition</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* User Profile Section */}
      <div className="border-t border-purple-400/10 p-3">
        <div className="px-3 space-y-3">
          <Link href="/profile" className="w-full flex items-center gap-4 p-2 rounded-lg hover:bg-purple-400/10 transition-all group">
            <div className="relative">
              <div className="w-14 h-14 rounded-lg bg-purple-400/20 flex items-center justify-center">
                <User size={24} className="text-purple-400" />
              </div>
              {/* Level Badge */}
              <div className="absolute -bottom-1 -right-1 bg-orange-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded">
                12
              </div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-0.5 text-left">
              <span className="text-white text-base font-semibold leading-tight">{displayName}</span>
              <div className="flex items-center gap-1.5">
                <Fire size={14} weight="fill" className="text-orange-500" />
                <span className="text-orange-400 text-sm font-mono leading-none">7</span>
              </div>
            </div>

            <CaretRight size={18} className="text-gray-500 group-hover:text-purple-400 transition-colors" />
          </Link>

          <div className="flex items-center gap-2 justify-center px-2">
            <Link href="/myokto" className="flex-1 h-12 rounded-lg border border-purple-400/20 hover:bg-purple-400/10 hover:border-purple-400/40 text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center text-sm font-medium" title="MyOkto">
              MyOkto
            </Link>
            <Link href="/notifications" className="w-12 h-12 rounded-lg border border-purple-400/20 hover:bg-purple-400/10 hover:border-purple-400/40 text-gray-400 hover:text-purple-400 transition-all flex items-center justify-center" title="Notifications">
              <Bell size={22} weight="regular" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-purple-400/10 p-3 space-y-1">
        <Link href="/settings" className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-all duration-200">
          <Gear size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          <span className="text-sm">Réglages</span>
        </Link>

        <button className="group w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200">
          <SignOut size={20} />
          <span className="text-sm">Déconnexion</span>
        </button>
      </div>
      </div>
    </>
  )
}
