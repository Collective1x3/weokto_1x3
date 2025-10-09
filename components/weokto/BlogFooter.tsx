'use client'

import Image from 'next/image'
import Link from 'next/link'
import { memo } from 'react'

const BlogFooter = memo(function BlogFooter() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative mt-20 border-t-2 border-[#B794F4] bg-black font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="py-8 border-b border-[#B794F4]/30">
          <div className="text-center">
            <p className="text-lg text-white mb-3">PRÊT À REJOINDRE WEOKTO ?</p>
            <p className="text-xs text-[#B794F4]/80 mb-6">COMMENCE À GÉNÉRER DES REVENUS DÈS AUJOURD'HUI</p>

            <button
              onClick={() => window.location.href = '/home'}
              className="px-6 py-3 bg-[#B794F4] text-black hover:bg-[#B794F4]/80 transition-all text-sm font-bold"
            >
              COMMENCER MAINTENANT
            </button>
          </div>
        </div>

        <div className="py-8 grid grid-cols-1 md:grid-cols-4 gap-6 text-xs">
          {/* Logo */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                alt="Weokto"
                width={40}
                height={40}
                className="w-10 h-10"
                priority
              />
              <div className="text-[#B794F4] font-bold">WEOKTO_BLOG</div>
            </Link>
            <p className="text-[#B794F4]/60 mb-4">
              KNOWLEDGE BASE
            </p>
            {/* Social Links */}
            <div className="flex gap-2">
              <a
                href="https://twitter.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all"
                aria-label="Twitter"
              >
                X
              </a>
              <a
                href="https://instagram.com/weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="https://tiktok.com/@weokto"
                target="_blank"
                rel="noopener noreferrer"
                className="px-2 py-1 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all"
                aria-label="TikTok"
              >
                TT
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white mb-3">NAVIGATION</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/blog" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  TOUS LES ARTICLES
                </Link>
              </li>
              <li>
                <Link href="/" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  ACCUEIL
                </Link>
              </li>
              <li>
                <Link href="/infoguilde" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  GUILDES
                </Link>
              </li>
              <li>
                <Link href="/home" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  DASHBOARD
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white mb-3">CATEGORIES</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/blog/success-stories" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  SUCCESS STORIES
                </Link>
              </li>
              <li>
                <Link href="/blog/tutoriels" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  TUTORIELS
                </Link>
              </li>
              <li>
                <Link href="/blog/annonces" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  ANNONCES
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white mb-3">RESSOURCES</h4>
            <ul className="space-y-1">
              <li>
                <Link href="/info-outils" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  OUTILS IA
                </Link>
              </li>
              <li>
                <Link href="/info-revenus" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  REVENUS
                </Link>
              </li>
              <li>
                <Link href="/infocompetition" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  COMPÉTITIONS
                </Link>
              </li>
              <li>
                <Link href="/infopearls" className="text-[#B794F4] hover:text-[#FFB000] transition-colors">
                  PEARLS
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Links */}
        <div className="py-4 border-t border-[#B794F4]/30">
          <div className="flex flex-wrap gap-4 justify-center mb-4 text-xs">
            <Link href="/sitemap-html" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              SITEMAP
            </Link>
            <Link href="/sitemap.xml" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              XML
            </Link>
            <Link href="/rss.xml" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              RSS
            </Link>
            <Link href="/privacy" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              PRIVACY
            </Link>
            <Link href="/cgu" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              TERMS
            </Link>
            <Link href="/contact" className="text-[#B794F4]/60 hover:text-[#B794F4] transition-colors">
              CONTACT
            </Link>
          </div>

          {/* Copyright */}
          <div className="text-center text-xs">
            <p className="text-[#B794F4]/40">
              © {currentYear} WEOKTO
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default BlogFooter
