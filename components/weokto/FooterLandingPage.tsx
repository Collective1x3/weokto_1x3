'use client'

import { memo, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface FooterLandingPageProps {
  showSupplierCTA?: boolean
  onOpenPartnerForm?: () => void
}

const FooterLandingPage = memo(function FooterLandingPage({
  showSupplierCTA = false,
  onOpenPartnerForm
}: FooterLandingPageProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()
  const [clickCount, setClickCount] = useState(0)
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (clickCount === 13) {
      setShowAnimation(true)
      setTimeout(() => {
        window.location.href = '/vision'
      }, 1200)
    }
  }, [clickCount])

  return (
    <>
      {/* Matrix transition animation */}
      {showAnimation && (
        <div className="fixed inset-0 z-50 bg-black pointer-events-none overflow-hidden">
          {/* Scanlines effect */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
            animation: 'scanlines 8s linear infinite'
          }} />

          {/* Main text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="text-center"
              style={{
                animation: 'textReveal 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards'
              }}
            >
              {/* ASCII decoration */}
              <div className="text-[#B794F4] text-xs md:text-sm font-mono mb-4 opacity-60"
                style={{ animation: 'fadeIn 0.6s ease-out' }}>
                {'>'} INITIALIZING {'<'}
              </div>

              {/* Main text with glitch effect */}
              <div className="relative">
                <div
                  className="text-[#FFB000] text-3xl md:text-5xl lg:text-6xl font-mono font-bold tracking-wider"
                  style={{
                    textShadow: '0 0 20px rgba(255, 176, 0, 0.5)',
                    animation: 'glowPulse 1.2s ease-in-out'
                  }}
                >
                  DO SOMETHING GREAT
                </div>

                {/* Glitch copies */}
                <div
                  className="absolute inset-0 text-[#B794F4] text-3xl md:text-5xl lg:text-6xl font-mono font-bold tracking-wider"
                  style={{
                    clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
                    animation: 'glitch1 0.8s ease-in-out',
                    opacity: 0.8
                  }}
                >
                  DO SOMETHING GREAT
                </div>
                <div
                  className="absolute inset-0 text-white text-3xl md:text-5xl lg:text-6xl font-mono font-bold tracking-wider"
                  style={{
                    clipPath: 'polygon(0 60%, 100% 60%, 100% 100%, 0 100%)',
                    animation: 'glitch2 0.8s ease-in-out',
                    opacity: 0.8
                  }}
                >
                  DO SOMETHING GREAT
                </div>
              </div>

              {/* Loading bar */}
              <div className="mt-8 w-48 h-1 bg-black/50 border border-[#B794F4]/30 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#B794F4] to-[#FFB000]"
                  style={{
                    animation: 'loadingBar 1s cubic-bezier(0.4, 0, 0.2, 1) forwards'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-4 left-4 text-[#FFB000] font-mono text-xs opacity-40"
            style={{ animation: 'cornerFade 1s ease-out' }}>
            [SYS.INIT]
          </div>
          <div className="absolute bottom-4 right-4 text-[#FFB000] font-mono text-xs opacity-40"
            style={{ animation: 'cornerFade 1s ease-out' }}>
            [ACCESS.GRANTED]
          </div>

          <style jsx>{`
            @keyframes textReveal {
              0% {
                opacity: 0;
                transform: translateY(20px) scale(0.95);
                filter: blur(4px);
              }
              60% {
                opacity: 1;
                transform: translateY(-5px) scale(1.02);
                filter: blur(0);
              }
              100% {
                opacity: 0;
                transform: translateY(-10px) scale(1.05);
                filter: blur(2px);
              }
            }

            @keyframes glowPulse {
              0%, 100% {
                textShadow: 0 0 20px rgba(255, 176, 0, 0.5);
              }
              50% {
                textShadow: 0 0 40px rgba(255, 176, 0, 0.8), 0 0 60px rgba(183, 148, 244, 0.4);
              }
            }

            @keyframes glitch1 {
              0%, 100% {
                transform: translate(0);
              }
              20% {
                transform: translate(-2px, 2px);
              }
              40% {
                transform: translate(-2px, -2px);
              }
              60% {
                transform: translate(2px, 2px);
              }
              80% {
                transform: translate(2px, -2px);
              }
            }

            @keyframes glitch2 {
              0%, 100% {
                transform: translate(0);
              }
              20% {
                transform: translate(2px, -2px);
              }
              40% {
                transform: translate(2px, 2px);
              }
              60% {
                transform: translate(-2px, -2px);
              }
              80% {
                transform: translate(-2px, 2px);
              }
            }

            @keyframes loadingBar {
              0% {
                width: 0;
                opacity: 0;
              }
              20% {
                opacity: 1;
              }
              90% {
                width: 100%;
                opacity: 1;
              }
              100% {
                width: 100%;
                opacity: 0;
              }
            }

            @keyframes fadeIn {
              from {
                opacity: 0;
              }
              to {
                opacity: 1;
              }
            }

            @keyframes cornerFade {
              0% {
                opacity: 0;
                transform: scale(0.8);
              }
              50% {
                opacity: 0.4;
                transform: scale(1);
              }
              100% {
                opacity: 0;
                transform: scale(1.1);
              }
            }

            @keyframes scanlines {
              0% {
                transform: translateY(0);
              }
              100% {
                transform: translateY(10px);
              }
            }
          `}</style>
        </div>
      )}

      <footer className="relative mt-20 border-t-2 border-[#B794F4] bg-black">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Section fournisseur si activée */}
        {showSupplierCTA && (
          <div className="border-2 border-[#FFB000] bg-black/90 p-4 md:p-6 mb-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <h3 className="text-base md:text-lg font-mono font-bold text-[#FFB000] mb-1 md:mb-2">
                  VOUS ÊTES FOURNISSEUR ?
                </h3>
                <p className="text-xs md:text-sm font-mono text-white">
                  ACCÉDEZ À DES MILLIERS DE CRÉATEURS MOTIVÉS
                </p>
              </div>
              <div className="flex items-center gap-2 md:gap-4">
                <button
                  onClick={() => router.push('/info-fournisseur')}
                  className="px-3 md:px-4 py-1.5 md:py-2 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-xs md:text-sm font-mono"
                >
                  EN SAVOIR PLUS
                </button>
                <button
                  onClick={() => onOpenPartnerForm?.()}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-xs md:text-sm font-mono font-bold"
                >
                  DEVENIR PARTENAIRE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Contenu principal du footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
          {/* Logo et description - prend toute la largeur sur mobile */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto"
                width={48}
                height={48}
                className="w-10 md:w-12 h-10 md:h-12"
              />
              <span className="text-lg md:text-xl font-mono font-bold text-[#B794F4]">WEOKTO</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mb-4 md:mb-6 hidden md:block">
              LA PLATEFORME DU COMMUNITY BUILDING.
              <br />
              GÉNÈRE DES REVENUS PASSIFS SANS LIMITE.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex gap-2 md:gap-3">
              <a
                href="https://twitter.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-[#B794F4]/10 transition-all text-xs font-mono text-[#B794F4]"
              >
                X
              </a>
              <a
                href="https://instagram.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-[#B794F4]/10 transition-all text-xs font-mono text-[#B794F4]"
              >
                IG
              </a>
              <a
                href="https://tiktok.com/@weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-[#B794F4]/10 transition-all text-xs font-mono text-[#B794F4]"
              >
                TK
              </a>
            </div>
          </div>

          {/* Produit */}
          <div className="col-span-1">
            <h4 className="text-xs md:text-sm font-mono font-bold text-[#FFB000] mb-3 md:mb-4">PRODUIT</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/#how-it-works" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  COMMENT ÇA MARCHE
                </Link>
              </li>
              <li>
                <Link href="/infoguilde" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  GUILDES
                </Link>
              </li>
              <li>
                <Link href="/infocompetition" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  COMPÉTITIONS
                </Link>
              </li>
              <li>
                <Link href="/infopearls" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  SYSTÈME DE PEARLS
                </Link>
              </li>
              <li>
                <Link href="/#tarifs" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  TARIFS
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div className="col-span-1">
            <h4 className="text-xs md:text-sm font-mono font-bold text-[#FFB000] mb-3 md:mb-4">RESSOURCES</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/blog" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  BLOG
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  CONTACT & SUPPORT
                </Link>
              </li>
              <li>
                <Link href="/outils" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  OUTILS IA
                </Link>
              </li>
              <li>
                <Link href="/info-revenus" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  SYSTÈME DE REVENUS
                </Link>
              </li>
              {showSupplierCTA && (
                <li>
                  <Link href="/info-fournisseur" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                    DEVENIR PARTENAIRE
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Légal */}
          <div className="col-span-1">
            <h4 className="text-xs md:text-sm font-mono font-bold text-[#FFB000] mb-3 md:mb-4">LÉGAL</h4>
            <ul className="space-y-1.5 md:space-y-2">
              <li>
                <Link href="/cgu" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  CONDITIONS GÉNÉRALES
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  POLITIQUE DE CONFIDENTIALITÉ
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  MENTIONS LÉGALES
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-xs font-mono text-gray-400 hover:text-[#B794F4] transition-colors">
                  POLITIQUE DE COOKIES
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#B794F4]/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono text-gray-500">
              © {currentYear} WEOKTO. TOUS DROITS RÉSERVÉS.
            </p>
            <div className="text-xs font-mono text-[#B794F4] relative select-none">
              <span
                onClick={() => setClickCount(prev => prev + 1)}
                className="cursor-default hover:text-[#FFB000]/30 transition-colors duration-300"
                style={{ userSelect: 'none' }}
              >
                +
              </span>
              BUILD. SELL. DOMINATE.
            </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  )
})

export default FooterLandingPage
