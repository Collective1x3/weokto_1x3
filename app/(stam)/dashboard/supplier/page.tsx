import { redirect } from 'next/navigation'

import { getStamSession } from '@/lib/auth/stam/session'

const todo = [
  'Brancher la liste des formations via API supplier',
  'Construire l’UI de drag & drop sections / chapitres',
  'Afficher les statistiques de complétion et temps moyen',
  'Déployer la gestion des ressources (upload vidéo/PDF)'
]

export default async function StamSupplierDashboard() {
  const session = await getStamSession()
  if (!session) {
    redirect('/stam/login')
  }

  if (session.userType !== 'SUPPLIER') {
    redirect('/stam/dashboard')
  }

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold text-white">Dashboard supplier</h1>
        <p className="text-sm text-white/70">
          Ce module pilotera tes formations STAM. Les actions ci-dessous décrivent la prochaine itération produit.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <h2 className="text-base font-semibold text-white">Checklist sprint</h2>
          <ul className="mt-4 space-y-2">
            {todo.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-white/40">▹</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
          <h2 className="text-base font-semibold text-white">Intégrations prévues</h2>
          <ul className="mt-4 space-y-2">
            <li>Bunny : suivi durée réelle, génération thumbnails</li>
            <li>Supabase Storage : PDF + assets incopiables</li>
            <li>Resend : notifications progression cohortes</li>
            <li>Whop/Stripe : options de monétisation STAM-only</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
