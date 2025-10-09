'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function HeaderCommunityAcademy() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="relative z-50 border-b-2 border-[#3B82F6] bg-black/90 backdrop-blur-md sticky top-0">
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
            <div className="text-base sm:text-lg md:text-xl font-bold tracking-wider text-[#3B82F6]">COMMUNITY ACADEMY</div>
          </Link>

          <nav className="hidden lg:flex items-center gap-2 xl:gap-4">
            <Link href="/#how-it-works" className="hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]">
              FONCTIONNEMENT
            </Link>
            <Link href="/#guildes" className="hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]">
              GUILDES
            </Link>
            <Link href="/#tarifs" className="hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]">
              TARIFS
            </Link>
            <div className="relative group">
              <button className="hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all flex items-center gap-1 text-[#3B82F6]">
                RESSOURCES
                <span className="text-xs">▼</span>
              </button>
              <div className="absolute top-full left-0 -mt-1 pt-1 hidden group-hover:block">
                <div className="bg-black border-2 border-[#3B82F6] min-w-[200px] mt-1">
                  <Link href="/#competitions" className="block hover:bg-[#3B82F6] hover:text-black px-4 py-2 text-sm transition-all text-[#3B82F6]">
                    COMPÉTITIONS
                  </Link>
                  <Link href="/#pearls" className="block hover:bg-[#3B82F6] hover:text-black px-4 py-2 text-sm transition-all text-[#3B82F6]">
                    SYSTÈME DE PEARLS
                  </Link>
                  <Link href="/outils" className="block hover:bg-[#3B82F6] hover:text-black px-4 py-2 text-sm transition-all text-[#3B82F6]">
                    OUTILS IA
                  </Link>
                  <Link href="/info-revenus" className="block hover:bg-[#3B82F6] hover:text-black px-4 py-2 text-sm transition-all text-[#3B82F6]">
                    REVENUS
                  </Link>
                  <Link href="/infofournisseurs" className="block hover:bg-[#3B82F6] hover:text-black px-4 py-2 text-sm transition-all text-[#3B82F6]">
                    FOURNISSEURS
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button className="hidden sm:block px-3 sm:px-4 py-1.5 sm:py-2 border border-[#3B82F6] hover:bg-[#3B82F6] hover:text-black transition-all text-xs sm:text-sm text-[#3B82F6]">
              CONNEXION
            </button>
            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#3B82F6] text-black hover:bg-[#3B82F6]/80 transition-all font-bold text-xs sm:text-sm">
              REJOINDRE L'ACADEMY
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden px-3 py-2 border border-[#3B82F6] hover:bg-[#3B82F6] hover:text-black transition-all text-[#3B82F6] text-base"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t-2 border-[#3B82F6] bg-black/95">
          <nav className="px-4 py-4 space-y-2">
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
            >
              FONCTIONNEMENT
            </Link>
            <Link
              href="/#guildes"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
            >
              GUILDES
            </Link>
            <Link
              href="/#tarifs"
              onClick={() => setMobileMenuOpen(false)}
              className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
            >
              TARIFS
            </Link>
            <div className="border-t border-[#3B82F6] mt-2 pt-2">
              <div className="text-xs text-[#3B82F6]/60 px-3 py-1">RESSOURCES</div>
              <Link
                href="/#competitions"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
              >
                COMPÉTITIONS
              </Link>
              <Link
                href="/#pearls"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
              >
                SYSTÈME DE PEARLS
              </Link>
              <Link
                href="/outils"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
              >
                OUTILS IA
              </Link>
              <Link
                href="/info-revenus"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
              >
                REVENUS
              </Link>
              <Link
                href="/infofournisseurs"
                onClick={() => setMobileMenuOpen(false)}
                className="block hover:bg-[#3B82F6] hover:text-black px-3 py-2 text-sm transition-all text-[#3B82F6]"
              >
                FOURNISSEURS
              </Link>
            </div>
            <div className="border-t border-[#3B82F6] mt-2 pt-2 space-y-2">
              <button className="w-full px-3 py-2 border border-[#3B82F6] hover:bg-[#3B82F6] hover:text-black transition-all text-sm text-[#3B82F6]">
                CONNEXION
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
