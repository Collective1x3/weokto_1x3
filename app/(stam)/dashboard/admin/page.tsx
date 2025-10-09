import { redirect } from 'next/navigation'

import { getStamSession } from '@/lib/auth/stam/session'

const panels = [
  {
    title: 'Suivi des webhooks',
    description: 'Magic links, uploads Bunny, sync progression. À brancher avec Prisma + monitoring.'
  },
  {
    title: 'Gestion des suppliers',
    description: 'Valider les nouveaux comptes, assigner des guildes, suivre la qualité des formations.'
  },
  {
    title: 'Analytics consolidées',
    description: 'Tableaux comparatifs STAM vs Weokto pour mesurer l’engagement apprenant.'
  }
]

export default async function StamAdminDashboard() {
  const session = await getStamSession()
  if (!session) {
    redirect('/stam/login')
  }

  if (!['ADMIN', 'WEOWNER'].includes(session.user.userType || '')) {
    redirect('/stam/dashboard')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Console d&apos;administration STAM</h1>
        <p className="text-sm text-white/70">
          Bloc notes temporaire pour structurer le futur back-office. Relie-le à Prisma + charts dès que l&apos;API est
          prête.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {panels.map((panel) => (
          <div key={panel.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
            <h2 className="text-base font-semibold text-white">{panel.title}</h2>
            <p className="mt-3">{panel.description}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <h2 className="text-base font-semibold text-white">À faire</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Brancher les métriques Prisma (comptes, formations, ressources)</li>
          <li>Ajout d&apos;un mode audit avec historique des connexions</li>
          <li>Exports CSV / API interne pour la team ops</li>
        </ul>
      </section>
    </div>
  )
}
