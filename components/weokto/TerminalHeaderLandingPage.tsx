'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import TerminalAuthModal from './TerminalAuthModal'

export default function TerminalHeaderLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    email,
    setEmail,
    sendMagicLink,
    loadingAction,
    successMessage,
    errorMessage
  } = useAuth()

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
    setMobileMenuOpen(false) // Close mobile menu when opening auth modal
  }

  return (
    <>
      <header className="relative z-50 border-b-2 border-[#B794F4] bg-black/90 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12"
              />
              <div className="text-base sm:text-lg md:text-xl font-bold tracking-wider text-[#B794F4]">WEOKTO</div>
            </Link>

            <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
              <Link href="/#how-it-works" className="hover:bg-[#B794F4] hover:text-black px-3 py-2 text-sm transition-all text-[#B794F4]">
                FONCTIONNEMENT
              </Link>
              <Link href="/#guildes" className="hover:bg-[#B794F4] hover:text-black px-3 py-2 text-sm transition-all text-[#B794F4]">
                GUILDES
              </Link>
              <Link href="/#tarifs" className="hover:bg-[#B794F4] hover:text-black px-3 py-2 text-sm transition-all text-[#B794F4]">
                TARIFS
              </Link>
              <div className="relative group">
                <button className="hover:bg-[#B794F4] hover:text-black px-3 py-2 text-sm transition-all flex items-center gap-1 text-[#B794F4]">
                  RESSOURCES
                  <span className="text-xs">▼</span>
                </button>
                <div className="absolute top-full left-0 -mt-1 pt-1 hidden group-hover:block">
                  <div className="bg-black border-2 border-[#B794F4] min-w-[200px] mt-1">
                    <Link href="/infocompetition" className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]">
                      COMPÉTITIONS
                    </Link>
                    <Link href="/infopearls" className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]">
                      SYSTÈME DE PEARLS
                    </Link>
                    <Link href="/info-outils" className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]">
                      OUTILS
                    </Link>
                    <Link href="/info-revenus" className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]">
                      REVENUS
                    </Link>
                  </div>
                </div>
              </div>
              <Link href="/blog" className="hover:bg-[#B794F4] hover:text-black px-3 py-2 text-sm transition-all text-[#B794F4]">
                BLOG
              </Link>
            </nav>

            <div className="hidden lg:flex items-center gap-4">
              <button
                onClick={() => handleAuth('login')}
                className="hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] border border-[#B794F4]"
              >
                CONNEXION
              </button>
              <button
                onClick={() => handleAuth('signup')}
                className="bg-[#FFB000] text-black px-4 py-2 text-sm font-bold hover:bg-[#FFB000]/80 transition-all"
              >
                COMMENCER
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden text-[#B794F4] hover:text-white transition-colors"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-[#B794F4]/30 py-4">
              <Link
                href="/#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]"
              >
                FONCTIONNEMENT
              </Link>
              <Link
                href="/#guildes"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]"
              >
                GUILDES
              </Link>
              <Link
                href="/#tarifs"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]"
              >
                TARIFS
              </Link>
              <div className="border-t border-[#B794F4]/20 my-2"></div>
              <div className="text-xs text-[#B794F4]/60 px-4 py-1">RESSOURCES</div>
              <Link
                href="/infocompetition"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] pl-8"
              >
                COMPÉTITIONS
              </Link>
              <Link
                href="/infopearls"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] pl-8"
              >
                SYSTÈME DE PEARLS
              </Link>
              <Link
                href="/info-outils"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] pl-8"
              >
                OUTILS
              </Link>
              <Link
                href="/info-revenus"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] pl-8"
              >
                REVENUS
              </Link>
              <Link
                href="/blog"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4]"
              >
                BLOG
              </Link>
              <div className="flex flex-col gap-2 px-4 mt-4">
                <button
                  onClick={() => handleAuth('login')}
                  className="hover:bg-[#B794F4] hover:text-black px-4 py-2 text-sm transition-all text-[#B794F4] border border-[#B794F4] text-center"
                >
                  CONNEXION
                </button>
                <button
                  onClick={() => handleAuth('signup')}
                  className="bg-[#FFB000] text-black px-4 py-2 text-sm font-bold hover:bg-[#FFB000]/80 transition-all text-center"
                >
                  COMMENCER
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      <TerminalAuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        sendMagicLink={sendMagicLink}
        loadingAction={loadingAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
    </>
  )
}