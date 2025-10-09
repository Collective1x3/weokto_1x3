import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

const footerSections = [
  {
    title: 'Produit',
    links: [
      { href: '/stam/features', label: 'Fonctionnalités' },
      { href: '/stam#pricing', label: 'Tarifs' },
      { href: '/stam/blog', label: 'Blog' }
    ]
  },
  {
    title: 'Support',
    links: [
      { href: '/stam/contact', label: 'Contact' }
    ]
  }
]

export default function StamFooter() {
  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-[#F5F1E8] via-[#FAF9F7] to-[#F5F1E8] border-t border-stone-200">
      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-gradient-to-br from-amber-100/20 to-stone-100/20 rounded-full blur-3xl opacity-50" />
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-gradient-to-tl from-stone-200/15 to-amber-50/15 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-6 py-12 md:px-8 lg:px-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 mb-16">
          {/* Logo & Description */}
          <div className="space-y-6 md:col-span-2">
            <Link href="/stam" className="inline-flex items-center gap-2 group">
              <span className="text-3xl font-bold tracking-tight text-stone-900 transition-colors duration-300 group-hover:text-amber-900">STAM</span>
            </Link>
            <p className="text-base font-medium text-stone-700 leading-relaxed max-w-md">
              La plateforme qui transforme votre expertise en expérience d&apos;apprentissage communautaire.
            </p>
            <div className="flex gap-3">
              <Link
                href="/stam/login"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3.5 text-sm font-bold text-[#FEFDFB] shadow-lg shadow-stone-900/20 transition-all duration-300 hover:scale-105 hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/30"
              >
                Démarrer gratuitement
                <ArrowRight size={18} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Footer Links - Enhanced */}
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-5">
              <h3 className="text-sm font-bold text-stone-900 uppercase tracking-wider">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-base font-medium text-stone-600 transition-all duration-300 hover:text-amber-900 hover:translate-x-1"
                    >
                      {link.label}
                      <ArrowRight size={14} weight="bold" className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Copyright & Bottom Section */}
        <div className="border-t border-stone-300 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-medium text-stone-600">
              © {new Date().getFullYear()} STAM. Tous droits réservés.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
              <Link
                href="/stam/blog/rss.xml"
                className="text-sm font-medium text-stone-600 transition-colors duration-300 hover:text-stone-900"
              >
                Flux RSS
              </Link>
              <Link
                href="/stam/privacy"
                className="text-sm font-medium text-stone-600 transition-colors duration-300 hover:text-stone-900"
              >
                Confidentialité
              </Link>
              <Link
                href="/stam/terms"
                className="text-sm font-medium text-stone-600 transition-colors duration-300 hover:text-stone-900"
              >
                Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
