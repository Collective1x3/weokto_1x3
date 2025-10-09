'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  ArrowRight, List, X, CaretDown,
  Trophy, Sparkle, Robot, TrendUp, House, Users
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface HeaderProps {
  currentPage?: 'home' | 'guilde' | 'competitions' | 'pearls' | 'outils' | 'revenus' | 'fournisseurs' | 'infofournisseurs'
  onAuthClick?: (mode: 'login' | 'signup') => void
  accentColor?: 'violet' | 'blue' | 'red'
}

export default function Header({ currentPage = 'home', onAuthClick, accentColor = 'violet' }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showResourcesDropdown, setShowResourcesDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  
  // Get color classes based on accentColor prop
  const getColorClasses = () => {
    switch (accentColor) {
      case 'blue':
        return {
          gradient: 'from-blue-600 to-blue-500',
          gradientHover: 'from-blue-600 to-blue-400',
          text: 'text-blue-400',
          bg: 'bg-blue-500/10',
          shadow: 'shadow-blue-500/25'
        }
      case 'red':
        return {
          gradient: 'from-red-600 to-red-500',
          gradientHover: 'from-red-600 to-red-400',
          text: 'text-red-400',
          bg: 'bg-red-500/10',
          shadow: 'shadow-red-500/25'
        }
      default:
        return {
          gradient: 'from-violet-600 to-violet-500',
          gradientHover: 'from-violet-600 to-violet-400',
          text: 'text-violet-400',
          bg: 'bg-violet-500/10',
          shadow: 'shadow-violet-500/25'
        }
    }
  }
  
  const colors = getColorClasses()
  const menuBgClass = (() => {
    switch (accentColor) {
      case 'blue':
        return 'bg-gradient-to-b from-black via-blue-950/30 to-black'
      case 'red':
        return 'bg-gradient-to-b from-black via-red-950/30 to-black'
      default:
        return 'bg-gradient-to-b from-black via-violet-950/30 to-black'
    }
  })()

  // Detect current page from pathname if not provided
  useEffect(() => {
    if (!currentPage) {
      const path = pathname.replace('/', '')
      if (path === 'guilde') currentPage = 'guilde'
      else if (path === 'competitions') currentPage = 'competitions'
      else if (path === 'pearls') currentPage = 'pearls'
      else if (path === 'outils') currentPage = 'outils'
      else if (path === 'revenus') currentPage = 'revenus'
      else if (path === 'fournisseurs') currentPage = 'fournisseurs'
      else if (path === 'infofournisseurs') currentPage = 'infofournisseurs'
    }
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowResourcesDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleAuth = (mode: 'login' | 'signup') => {
    if (onAuthClick) {
      onAuthClick(mode)
    } else {
      // Default behavior if no handler provided
      console.log(`Auth ${mode} clicked`)
    }
  }

  const resourcesItems = [
    {
      name: 'Accueil',
      href: '/',
      icon: House,
      description: 'Page d\'accueil',
      active: currentPage === 'home'
    },
    {
      name: 'Guildes',
      href: '/infoguilde',
      icon: Users,
      description: 'Système de formation',
      active: currentPage === 'guilde'
    },
    {
      name: 'Compétitions',
      href: '/infocompetition',
      icon: Trophy,
      description: 'Défis et classements',
      active: currentPage === 'competitions'
    },
    {
      name: 'Pearls',
      href: '/infopearls',
      icon: Sparkle,
      description: 'Récompenses et niveaux',
      active: currentPage === 'pearls'
    },
    {
      name: 'Outils',
      href: '/info-outils',
      icon: Robot,
      description: 'Assistant intelligent',
      active: currentPage === 'outils'
    },
    {
      name: 'Revenus',
      href: '/info-revenus',
      icon: TrendUp,
      description: 'Système de commissions',
      active: currentPage === 'revenus'
    }
  ]

  const isResourceActive = resourcesItems.some(item => item.active)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav 
          className="transition-all duration-300 relative"
          style={{ 
            borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
            background: isScrolled 
              ? 'rgba(9, 9, 11, 0.75)' 
              : 'rgba(9, 9, 11, 0.25)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow: '0 4px 30px rgba(139, 92, 246, 0.15)'
          }}
        >
          {/* Violet glow effect at bottom */}
          <div 
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
              filter: 'blur(2px)'
            }}
          />
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              {/* Logo and Main Nav */}
              <div className="flex items-center gap-12">
                <Link href="/" className="flex items-center gap-2">
                  <Image 
                    src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                    alt="Weokto Logo"
                    width={64}
                    height={64}
                    className="w-14 h-auto sm:w-16 lg:w-16 -mt-1"
                    priority
                  />
                  <span className="text-xl font-bold text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>
                    Weokto
                  </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1">
                  <Link 
                    href="/#how-it-works" 
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-all rounded-lg hover:bg-white/[0.02]"
                  >
                    Fonctionnement
                  </Link>
                  
                  <Link 
                    href="/guilde" 
                    className={`px-4 py-2 text-sm transition-all rounded-lg ${
                      currentPage === 'guilde'
                        ? `${colors.text} font-medium ${colors.bg}`
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.02]'
                    }`}
                  >
                    Guildes
                  </Link>
                  
                  <Link 
                    href="/#tarifs" 
                    className="px-4 py-2 text-sm text-gray-300 hover:text-white transition-all rounded-lg hover:bg-white/[0.02]"
                  >
                    Tarifs
                  </Link>

                  {/* Resources Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
                      onMouseEnter={() => setShowResourcesDropdown(true)}
                      className={`px-4 py-2 text-sm transition-all rounded-lg flex items-center gap-2 ${
                        isResourceActive
                          ? `${colors.text} font-medium ${colors.bg}`
                          : 'text-gray-300 hover:text-white hover:bg-white/[0.02]'
                      }`}
                    >
                      Ressources
                      <CaretDown 
                        size={12} 
                        weight="bold" 
                        className={`transition-transform ${showResourcesDropdown ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {showResourcesDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          onMouseLeave={() => setShowResourcesDropdown(false)}
                          className="absolute top-full left-0 mt-2 w-72 rounded-xl overflow-hidden"
                          style={{
                            background: 'rgba(18, 18, 20, 0.95)',
                            backdropFilter: 'blur(20px) saturate(180%)',
                            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
                            border: '1px solid rgba(139, 92, 246, 0.15)',
                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2), 0 0 40px rgba(139, 92, 246, 0.1)'
                          }}
                        >
                          {resourcesItems.map((item, index) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className={`relative flex items-start gap-3 px-4 py-3 transition-all ${
                                item.active 
                                  ? 'bg-gradient-to-r from-violet-500/15 to-violet-500/5' 
                                  : 'hover:bg-gradient-to-r hover:from-white/[0.08] hover:to-white/[0.02]'
                              }`}
                              onClick={() => setShowResourcesDropdown(false)}
                            >
                              {item.active && (
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-400 to-violet-600" />
                              )}
                              <div className={`mt-0.5 ${item.active ? 'text-violet-400' : 'text-gray-400 group-hover:text-gray-300'}`}>
                                <item.icon size={18} weight="duotone" />
                              </div>
                              <div className="flex-1">
                                <div className={`text-sm font-medium ${
                                  item.active ? 'text-violet-400' : 'text-gray-200'
                                }`}>
                                  {item.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-0.5">
                                  {item.description}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </nav>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAuth('login')}
                  className="hidden sm:block px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-all"
                >
                  Connexion
                </button>
                
                <button
                  onClick={() => handleAuth('signup')}
                  className="relative group"
                >
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${colors.gradientHover} rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200`}></div>
                  <span className={`relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${colors.gradient} rounded-lg text-sm font-semibold text-white shadow-lg transition-all group-hover:${colors.shadow}`}>
                    Commencer
                    <ArrowRight size={16} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

                {/* Mobile Menu Button */}
                <button 
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                >
                  {showMobileMenu ? (
                    <X size={20} weight="bold" className="text-white" />
                  ) : (
                    <List size={20} weight="bold" className="text-white" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile Menu - Fullscreen Overlay */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-40 lg:hidden ${menuBgClass}`}
            style={{
              background: 'rgba(18, 18, 20, 0.95)',
              backdropFilter: 'blur(20px) saturate(180%)',
              WebkitBackdropFilter: 'blur(20px) saturate(180%)'
            }}
          >
            {/* Decorative gradients */}
            <div className="pointer-events-none absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, hsl(270 85% 55% / 0.3), transparent)', filter: 'blur(100px)' }} />
            <div className="pointer-events-none absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, hsl(270 85% 50% / 0.2), transparent)', filter: 'blur(120px)' }} />

            {/* Close button */}
            <div className="absolute top-4 right-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
              >
                <X size={20} weight="bold" className="text-white" />
              </button>
            </div>

            {/* Centered navigation */}
            <div className="h-full w-full flex flex-col items-center justify-center px-8 text-center">
              <Image 
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto Logo"
                width={72}
                height={72}
                className="w-16 h-auto mb-8"
              />

              <nav className="w-full max-w-sm space-y-4">
                <Link
                  href="/#how-it-works"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-3 text-white/90 hover:text-white text-2xl font-bold"
                >
                  Fonctionnement
                </Link>
                <Link
                  href="/guilde"
                  onClick={() => setShowMobileMenu(false)}
                  className={`block py-3 text-2xl font-bold ${
                    currentPage === 'guilde' ? `${colors.text}` : 'text-white/90 hover:text-white'
                  }`}
                >
                  Guildes
                </Link>
                <Link
                  href="/#tarifs"
                  onClick={() => setShowMobileMenu(false)}
                  className="block py-3 text-white/90 hover:text-white text-2xl font-bold"
                >
                  Tarifs
                </Link>

                {/* Resources inline */}
                <div className="pt-4">
                  {resourcesItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setShowMobileMenu(false)}
                      className={`block py-2 text-lg ${item.active ? `${colors.text}` : 'text-gray-300 hover:text-white'}`}
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>

                {/* Auth Buttons */}
                <div className="pt-6 space-y-3">
                  <button
                    onClick={() => {
                      handleAuth('login')
                      setShowMobileMenu(false)
                    }}
                    className="w-full py-3 text-white/90 hover:text-white border border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-all"
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => {
                      handleAuth('signup')
                      setShowMobileMenu(false)
                    }}
                    className="w-full py-3 rounded-xl text-white font-semibold shadow-lg bg-gradient-to-r from-violet-600 to-violet-500"
                  >
                    Commencer
                  </button>
                </div>
              </nav>

              {/* Tap outside to close */}
              <button
                className="absolute inset-0 -z-10"
                aria-label="Fermer le menu"
                onClick={() => setShowMobileMenu(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}