'use client'

import { useState, memo } from 'react'
import { useRouter } from 'next/navigation'
import { Buildings, Info, ArrowRight, TwitterLogo, InstagramLogo, TiktokLogo } from '@phosphor-icons/react'
import Image from 'next/image'
import Link from 'next/link'
import PartnerFormModal from './PartnerFormModal'

const FooterWithSupplierCTA = memo(function FooterWithSupplierCTA({ onOpenPartnerForm }: { onOpenPartnerForm?: () => void }) {
  const router = useRouter()
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const currentYear = new Date().getFullYear()

  return (
    <>
      <footer className="relative mt-24 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section fournisseur - Compacte et intégrée */}
          <div className="border-b border-white/10 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center">
                  <Buildings size={20} weight="duotone" className="text-violet-400" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-white">Fournisseur de communauté ?</h3>
                  <p className="text-sm text-gray-400">Accédez à des milliers de créateurs motivés</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => router.push('/infofournisseurs')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  En savoir plus
                  <Info size={14} weight="bold" />
                </button>
                <button 
                  onClick={() => (onOpenPartnerForm ? onOpenPartnerForm() : setShowPartnerForm(true))}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-violet-400 hover:bg-violet-500/10 transition-colors border border-violet-500/30 hover:border-violet-500/50">
                  Devenir partenaire
                  <ArrowRight size={14} weight="bold" />
                </button>
              </div>
            </div>
          </div>

          {/* Contenu du footer */}
          <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo et description */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <Image 
                  src="/weoktologosvg/logo-weokto-blanc-violet-orange-ouvert.svg"
                  alt="Weokto Logo"
                  width={64}
                  height={64}
                  className="w-14 h-auto sm:w-16"
                  priority
                />
                <span className="text-xl font-bold text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>
                  Weokto
                </span>
              </div>
              <p className="text-sm text-gray-400 max-w-xs mb-6">
                La plateforme du community building. Génère des revenus passifs sans limite.
              </p>
              {/* Réseaux sociaux */}
              <div className="flex gap-3">
                <a 
                  href="https://twitter.com/weokto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Twitter"
                >
                  <TwitterLogo size={18} weight="fill" className="text-gray-400" />
                </a>
                <a 
                  href="https://instagram.com/weokto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105"
                  aria-label="Instagram"
                >
                  <InstagramLogo size={18} weight="fill" className="text-gray-400" />
                </a>
                <a 
                  href="https://tiktok.com/@weokto" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all hover:scale-105"
                  aria-label="TikTok"
                >
                  <TiktokLogo size={18} weight="fill" className="text-gray-400" />
                </a>
              </div>
            </div>

            {/* Produit */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Produit</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/#how-it-works" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Comment ça marche
                  </Link>
                </li>
                <li>
                  <Link href="/guilde" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Guildes
                  </Link>
                </li>
                <li>
                  <Link href="/competitions" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Compétitions
                  </Link>
                </li>
                <li>
                  <Link href="/pearls" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Système de Pearls
                  </Link>
                </li>
                <li>
                  <Link href="/#tarifs" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Tarifs
                  </Link>
                </li>
              </ul>
            </div>

            {/* Ressources */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Ressources</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/blog" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link href="/outils" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Outils IA
                  </Link>
                </li>
                <li>
                  <Link href="/revenus" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Système de revenus
                  </Link>
                </li>
                <li>
                  <Link href="/fournisseurs" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Devenir partenaire
                  </Link>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Légal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/cgu" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Conditions Générales
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Politique de Confidentialité
                  </Link>
                </li>
                <li>
                  <Link href="/mentions-legales" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Mentions Légales
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-sm text-gray-400 hover:text-violet-400 transition-colors">
                    Politique de Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="py-6 border-t border-white/10">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500">
                © {currentYear} Weokto. Tous droits réservés.
              </p>
              <p className="text-xs text-gray-600">
                Fait avec ❤️ pour la communauté
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Modal formulaire partenaire (interne uniquement si aucune prop n'est fournie) */}
      {!onOpenPartnerForm && (
        <PartnerFormModal
          isOpen={showPartnerForm}
          onClose={() => setShowPartnerForm(false)}
        />
      )}
    </>
  )
})

export default FooterWithSupplierCTA