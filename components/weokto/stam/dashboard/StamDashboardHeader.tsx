'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import {
  ChatCircleDots,
  GraduationCap,
  Trophy,
  Question,
  User,
  Gear,
  SignOut
} from '@phosphor-icons/react/dist/ssr'

const navItems = [
  { href: '/stam/dashboard/chat', label: 'Chat', icon: ChatCircleDots, mobileLabel: 'Chat' },
  { href: '/stam/dashboard/formations', label: 'Formations', icon: GraduationCap, mobileLabel: 'Formations' },
  { href: '/stam/dashboard/wins', label: 'Wins', icon: Trophy, mobileLabel: 'Wins' },
  { href: '/stam/dashboard/support', label: 'Support', icon: Question, mobileLabel: 'Support' }
]

const profileMenuItems = [
  { href: '/stam/dashboard/profile', label: 'Profil', icon: User },
  { href: '/stam/dashboard/support', label: 'Support', icon: Question },
  { href: '/stam/dashboard/settings', label: 'Réglages', icon: Gear },
  { label: 'Déconnexion', icon: SignOut, action: 'logout' }
]

function NavItem({ href, label, icon: Icon }: { href: string; label: string; icon: any }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 })
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 })

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  const handleMouseMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = event.clientX - rect.left
    const mouseY = event.clientY - rect.top
    const xPct = mouseX / width - 0.5
    const yPct = mouseY / height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <Link
        href={href}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700 transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900 hover:shadow-lg hover:shadow-emerald-500/20"
      >
        <Icon size={20} weight="bold" className="transition-transform duration-300 group-hover:scale-110" />
        <span>{label}</span>
      </Link>
    </motion.div>
  )
}

export default function StamDashboardHeader() {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    try {
      await fetch('/stam/api/auth/logout', { method: 'POST' })
      router.push('/stam/login')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleMenuItemClick = (item: typeof profileMenuItems[0]) => {
    if (item.action === 'logout') {
      handleLogout()
    } else if (item.href) {
      router.push(item.href)
    }
    setIsProfileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Header */}
      <header className="fixed left-0 right-0 top-0 z-50 hidden px-4 pt-4 md:block md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-7xl rounded-2xl border border-gray-200 bg-white/90 shadow-2xl shadow-black/10 backdrop-blur-2xl"
        >
          <div className="flex items-center justify-between px-6 py-4">
            {/* Logo */}
            <Link href="/stam/dashboard" className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tight text-gray-900">STAM</span>
            </Link>

            {/* Navigation */}
            <nav className="flex items-center gap-2">
              {navItems.map((item) => (
                <NavItem key={item.href} {...item} />
              ))}
            </nav>

            {/* Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-lg font-bold text-white shadow-lg shadow-emerald-500/30 transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
              >
                U
              </button>

              {/* Dropdown Menu */}
              {isProfileMenuOpen && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileMenuOpen(false)}
                  />

                  {/* Menu */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/10 z-50"
                  >
                    <div className="p-2">
                      {profileMenuItems.map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleMenuItemClick(item)}
                          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900"
                        >
                          <item.icon size={20} weight="bold" />
                          <span>{item.label}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </header>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl shadow-black/10 md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700'
                    : 'text-gray-600 active:bg-gray-50'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <Icon
                  size={24}
                  weight={isActive ? 'fill' : 'regular'}
                  className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}
                />
                <span className={`text-xs font-bold ${isActive ? 'text-emerald-900' : 'text-gray-700'}`}>
                  {item.mobileLabel}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-emerald-500 to-teal-500" />
                )}
              </Link>
            )
          })}

          {/* Profile Button */}
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all duration-300 active:scale-95 ${
              isProfileMenuOpen
                ? 'bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-700'
                : 'text-gray-600 active:bg-gray-50'
            }`}
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <div className={`flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-emerald-700 text-xs font-bold text-white transition-transform duration-300 ${isProfileMenuOpen ? 'scale-110' : ''}`}>
              U
            </div>
            <span className={`text-xs font-bold ${isProfileMenuOpen ? 'text-emerald-900' : 'text-gray-700'}`}>
              Profil
            </span>
            {isProfileMenuOpen && (
              <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-emerald-500 to-teal-500" />
            )}
          </button>
        </div>

        {/* Mobile Profile Menu Overlay */}
        {isProfileMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsProfileMenuOpen(false)}
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="fixed bottom-20 left-4 right-4 z-50 rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-black/20"
            >
              <div className="p-2">
                {profileMenuItems.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => handleMenuItemClick(item)}
                    className="flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:bg-gradient-to-br hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-900 active:scale-95"
                  >
                    <item.icon size={22} weight="bold" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </nav>
    </>
  )
}
