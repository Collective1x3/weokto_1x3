const featureGroups = [
  {
    title: 'Pédagogie',
    items: [
      'Hiérarchie Formation → Section → Chapitre → Ressource',
      'Progression automatique (pourcentage + temps visionné)',
      'Déblocage conditionnel des chapitres via règles dynamiques'
    ]
  },
  {
    title: 'Ressources',
    items: [
      'Vidéos Bunny avec webhooks de statut et vignettes automatiques',
      'PDF signés via Supabase Storage avec URL expirables',
      'Ressources externes (audio, lien) encapsulées dans FormationResourceService'
    ]
  },
  {
    title: 'Analytics',
    items: [
      'Dashboard supplier : vues, complétion, temps moyen passé',
      'Logs d’événements pour croiser avec les guildes Weokto',
      'Export CSV & endpoints API pour automatisation (roadmap)'
    ]
  }
]

export default function StamFeaturesPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Fonctionnalités</p>
        <h1 className="text-3xl font-semibold text-white">Ce qui est déjà branché (et ce qui arrive)</h1>
        <p className="text-sm text-white/70">
          Les briques back-end sont en place. Cette page suit l’état d’avancement pour valider l’UX avant livraison.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        {featureGroups.map((group) => (
          <article key={group.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">{group.title}</h2>
            <ul className="mt-4 space-y-3 text-sm text-white/70">
              {group.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-white/50">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-8 text-sm text-white/70">
        <h2 className="text-xl font-semibold text-white">Roadmap front</h2>
        <ol className="mt-4 space-y-2 list-decimal list-inside">
          <li>UI des dashboards (user/supplier/admin) avec appels API dédiés</li>
          <li>Player vidéo HLS custom et visionneuse PDF / slides</li>
          <li>Automations email (Resend) spécifiques aux cohortes STAM</li>
          <li>Intégration Stripe/Whop pour les offres 100% STAM</li>
        </ol>
      </section>
    </div>
  )
}
