import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getStamSession } from '@/lib/auth/stam/session'

const cards = [
  {
    title: 'Espace apprenant',
    description: 'Progression chapitres, ressources à valider, notes laissées par les formateurs.',
    href: '/stam/dashboard/user',
    roles: ['CLIENT', 'AFFILIATE']
  },
  {
    title: 'Espace supplier',
    description: 'Gestion des formations, upload ressources, analytics de complétion.',
    href: '/stam/dashboard/supplier',
    roles: ['SUPPLIER']
  },
  {
    title: 'Espace admin',
    description: 'Pilotage global STAM, contrôle qualité, monitoring webhooks.',
    href: '/stam/dashboard/admin',
    roles: ['ADMIN', 'WEOWNER']
  }
]

export default async function StamDashboardIndex() {
  const session = await getStamSession()
  if (!session) {
    redirect('/stam/login')
  }

  const availableCards = cards.filter((card) => card.roles.includes(session.user.userType || ''))

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
      <div className="space-y-8">
        <header className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm">
            <span className="text-xs font-bold uppercase tracking-[0.35em] text-emerald-900">Tableau de bord</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Bienvenue sur STAM, {session.user.displayName || session.user.email}
          </h1>
          <p className="text-base font-medium text-gray-600 leading-relaxed">
            Les modules ci-dessous sont en cours de construction. Clique pour accéder au prototype correspondant à ton rôle.
          </p>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          {availableCards.length === 0 ? (
            <div className="rounded-3xl border border-gray-200 bg-white p-8 text-base font-medium text-gray-600 shadow-xl shadow-black/5">
              Aucun espace n&apos;est encore configuré pour ton rôle ({session.user.userType}). Contacte un admin STAM si besoin.
            </div>
          ) : (
            availableCards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-black/5 transition-all duration-300 hover:-translate-y-2 hover:border-emerald-300 hover:shadow-2xl hover:shadow-emerald-500/15"
              >
                <h2 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-emerald-900">{card.title}</h2>
                <p className="mt-4 text-base font-medium text-gray-600 leading-relaxed">{card.description}</p>
              </Link>
            ))
          )}
        </section>
      </div>
    </div>
  )
}
