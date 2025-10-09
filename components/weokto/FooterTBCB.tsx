'use client'

import { memo } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

interface FooterTBCBProps {
  showSupplierCTA?: boolean
  onOpenPartnerForm?: () => void
}

const FooterTBCB = memo(function FooterTBCB({
  showSupplierCTA = false,
  onOpenPartnerForm
}: FooterTBCBProps) {
  const router = useRouter()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t-2 border-[#EF4444] bg-black">
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
                  onClick={() => router.push('/infofournisseurs')}
                  className="px-3 md:px-4 py-1.5 md:py-2 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-black transition-all text-xs md:text-sm font-mono"
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
              <span className="text-lg md:text-xl font-mono font-bold text-[#EF4444]">TBCB</span>
            </div>
            <p className="text-xs font-mono text-gray-400 mb-4 md:mb-6 hidden md:block">
              NO BULLSHIT. RÉSULTATS RAPIDES.
              <br />
              ON POSTE, ON GÉNÈRE DES VUES, ON FAIT DU CASH.
            </p>
            {/* Réseaux sociaux */}
            <div className="flex gap-2 md:gap-3">
              <a
                href="https://twitter.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#EF4444]/30 hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-xs font-mono text-[#EF4444]"
              >
                X
              </a>
              <a
                href="https://instagram.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#EF4444]/30 hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-xs font-mono text-[#EF4444]"
              >
                IG
              </a>
              <a
                href="https://tiktok.com/@weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 md:px-3 py-1.5 md:py-2 border border-[#EF4444]/30 hover:border-[#EF4444] hover:bg-[#EF4444]/10 transition-all text-xs font-mono text-[#EF4444]"
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
                <Link href="/#how-it-works" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  COMMENT ÇA MARCHE
                </Link>
              </li>
              <li>
                <Link href="/infoguilde" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  GUILDES
                </Link>
              </li>
              <li>
                <Link href="/infocompetition" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  COMPÉTITIONS
                </Link>
              </li>
              <li>
                <Link href="/infopearls" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  SYSTÈME DE PEARLS
                </Link>
              </li>
              <li>
                <Link href="/#tarifs" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
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
                <Link href="/blog" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  BLOG
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  CONTACT & SUPPORT
                </Link>
              </li>
              <li>
                <Link href="/outils" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  OUTILS IA
                </Link>
              </li>
              <li>
                <Link href="/info-revenus" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  SYSTÈME DE REVENUS
                </Link>
              </li>
              {showSupplierCTA && (
                <li>
                  <Link href="/infofournisseurs" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
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
                <Link href="/cgu" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  CONDITIONS GÉNÉRALES
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  POLITIQUE DE CONFIDENTIALITÉ
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  MENTIONS LÉGALES
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-xs font-mono text-gray-400 hover:text-[#EF4444] transition-colors">
                  POLITIQUE DE COOKIES
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[#EF4444]/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs font-mono text-gray-500">
              © {currentYear} TBCB BY WEOKTO. TOUS DROITS RÉSERVÉS.
            </p>
            <p className="text-xs font-mono text-[#EF4444]">
              NO BULLSHIT. RÉSULTATS RAPIDES.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default FooterTBCB
