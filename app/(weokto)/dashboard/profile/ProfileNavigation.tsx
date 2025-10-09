'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/profile', label: 'Profil' },
  { href: '/profile/subscriptions', label: 'Abonnements' },
  { href: '/profile/payments', label: 'Paiements' },
  { href: '/profile/payment-methods', label: 'Cartes' },
  { href: '/profile/billing', label: 'Facturation' }
]

export function ProfileNavigation() {
  const pathname = usePathname()

  return (
    <nav className="overflow-x-auto">
      <ul className="flex min-w-max items-center gap-2 rounded-2xl border border-slate-800 bg-slate-900/60 p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-purple-500/20 text-white border border-purple-400/60 shadow-[0_0_12px_rgba(183,148,244,0.25)]'
                    : 'text-slate-300 border border-transparent hover:border-purple-400/40 hover:text-white hover:bg-purple-500/10'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )}
