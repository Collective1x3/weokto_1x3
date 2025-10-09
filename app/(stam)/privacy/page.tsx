const sections = [
  {
    title: '1. Données collectées',
    content: [
      'Email, prénom/nom (facultatifs) et métadonnées techniques pour la connexion magic link et code de vérification.',
      'Progression pédagogique (chapitres complétés, temps visionné) stockée pour le suivi des cohortes.',
      'Logs techniques (IP, user-agent) conservés 30 jours pour la sécurité.'
    ]
  },
  {
    title: '2. Finalités',
    content: [
      'Assurer le fonctionnement des formations STAM et fournir des analytics aux suppliers.',
      'Synchroniser les données avec les guildes Weokto sans exposer les comptes affiliés.',
      'Communiquer sur les mises à jour produit si consentement explicite.'
    ]
  },
  {
    title: '3. Sous-traitants',
    content: [
      'Supabase : base de données, stockage, authentification.',
      'Bunny.net : hébergement vidéo et suivi de conversion.',
      'Resend : emails transactionnels (lien magique, notifications).'
    ]
  }
]

export default function StamPrivacyPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Politique de confidentialité</p>
        <h1 className="text-3xl font-semibold text-white">Protection des données STAM</h1>
        <p className="text-sm text-white/70">
          Document de transition avant audit RGPD complet. Mets-le à jour dès que la V1 est figée.
        </p>
      </header>

      {sections.map((section) => (
        <section key={section.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-lg font-semibold text-white">{section.title}</h2>
          <ul className="mt-4 space-y-2 text-sm text-white/70">
            {section.content.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-white/40">•</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <p>
          Responsable de traitement : Weokto – 75 rue (à compléter).<br />
          Contact délégué : privacy@be-stam.com<br />
          Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
        </p>
      </section>
    </article>
  )
}
