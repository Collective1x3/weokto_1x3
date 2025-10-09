'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { ArrowRight, List, X } from '@phosphor-icons/react'

interface BlogHeaderProps {
  onAuthClick?: (mode: 'login' | 'signup') => void
}

export default function BlogHeader({ onAuthClick }: BlogHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const pathname = usePathname()
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleAuth = (mode: 'login' | 'signup') => {
    if (onAuthClick) onAuthClick(mode)
  }

  const blogItems = [
    { label: 'Dernier post', href: '/blog' },
    { label: 'Success Stories', href: '/blog/success-stories' },
    { label: 'Tutoriels', href: '/blog/tutoriels' },
    { label: 'Annonces', href: '/blog/annonces' },
  ]

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav
          ref={navRef}
          className="transition-all duration-300 relative"
          style={{
            borderBottom: '1px solid rgba(139, 92, 246, 0.1)',
            background: isScrolled ? 'rgba(9, 9, 11, 0.75)' : 'rgba(9, 9, 11, 0.25)',
            backdropFilter: 'blur(20px) saturate(150%)',
            WebkitBackdropFilter: 'blur(20px) saturate(150%)',
            boxShadow: '0 4px 30px rgba(139, 92, 246, 0.15)'
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0 h-px"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent)',
              filter: 'blur(2px)'
            }}
          />
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center gap-12">
                <Link href="/" className="flex items-center gap-3">
                  <Image
                    src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                    alt="Weokto Logo"
                    width={64}
                    height={64}
                    className="w-14 h-auto sm:w-16 lg:w-16 -mt-1"
                    priority
                  />
                  <div className="flex items-center gap-2">
                    <span
                      className="text-white text-xl font-bold"
                      style={{ fontFamily: '"Manrope", sans-serif' }}
                    >
                      Weokto
                    </span>
                    <span
                      className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.15)',
                        border: '1px solid rgba(139, 92, 246, 0.35)',
                        color: 'rgb(196, 181, 253)'
                      }}
                    >
                      blog
                    </span>
                  </div>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                  {blogItems.map((item) => {
                    const active = pathname === item.href
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`px-4 py-2 text-sm transition-all rounded-lg ${
                          active
                            ? 'text-violet-400 font-medium bg-violet-500/10'
                            : 'text-gray-300 hover:text-white hover:bg-white/[0.02]'
                        }`}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </nav>
              </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleAuth('login')}
                  className="hidden sm:block px-5 py-2.5 text-sm font-medium text-gray-300 hover:text-white transition-all"
                >
                  Connexion
                </button>

                <button onClick={() => handleAuth('signup')} className="relative group">
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <span className="relative flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg text-sm font-semibold text-white shadow-lg transition-all group-hover:shadow-violet-500/25">
                    Inscription
                    <ArrowRight size={16} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </button>

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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileMenu(false)} />
          <div className="absolute right-0 top-0 h-full w-80 bg-gray-900/95 backdrop-blur-xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <Image
                  src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                  alt="Weokto Logo"
                  width={48}
                  height={48}
                  className="w-12 h-auto"
                />
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>
                    Weokto
                  </span>
                  <span
                    className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: 'rgba(139, 92, 246, 0.15)',
                      border: '1px solid rgba(139, 92, 246, 0.35)',
                      color: 'rgb(196, 181, 253)'
                    }}
                  >
                    blog
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
              >
                <X size={20} weight="bold" className="text-gray-400" />
              </button>
            </div>

            <nav className="p-6 space-y-1">
              {blogItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setShowMobileMenu(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    pathname === item.href
                      ? 'text-violet-400 bg-violet-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              <div className="pt-6 mt-6 border-t border-gray-800 space-y-3">
                <button
                  onClick={() => {
                    handleAuth('login')
                    setShowMobileMenu(false)
                  }}
                  className="w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
                >
                  Connexion
                </button>

                <button
                  onClick={() => {
                    handleAuth('signup')
                    setShowMobileMenu(false)
                  }}
                  className="w-full relative group"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-60 group-hover:opacity-100 transition duration-200"></div>
                  <span className="relative flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg text-sm font-semibold text-white">
                    Inscription
                    <ArrowRight size={16} weight="bold" />
                  </span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  )
}


