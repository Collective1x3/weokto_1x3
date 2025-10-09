const clauses = [
  {
    title: '1. Objet',
    body: 'STAM fournit un espace de formation en ligne destiné aux guildes et programmes partenaires de Weokto. L’utilisation est soumise à validation manuelle et au respect des règles communautaires.'
  },
  {
    title: '2. Comptes',
    body: 'Les comptes STAM sont indépendants des comptes Weokto. Un même email peut être utilisé sur les deux plateformes, chaque profil restant isolé. Tu es responsable de la confidentialité de ton accès.'
  },
  {
    title: '3. Contenus',
    body: 'Les contenus pédagogiques restent ta propriété. Tu garantis disposer des droits nécessaires et tu autorises STAM à les héberger pour la diffusion auprès des apprenants concernés.'
  },
  {
    title: '4. Paiements',
    body: 'Le module de facturation est en construction. Les offres actuelles sont gratuites ou facturées manuellement. Les conditions définitives seront publiées avant l’ouverture commerciale.'
  },
  {
    title: '5. Résiliation',
    body: 'En cas de non-respect des règles (fraude, contenu illégal, spam), STAM peut suspendre ou supprimer l’accès sans préavis. Une exportation des données pourra être fournie sur demande.'
  }
]

export default function StamTermsPage() {
  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-xs uppercase tracking-[0.35em] text-white/40">Conditions générales d&apos;utilisation</p>
        <h1 className="text-3xl font-semibold text-white">STAM – CGU intérimaires</h1>
        <p className="text-sm text-white/70">
          Document à finaliser avec ton juriste avant lancement public. Ces clauses servent de base pour les tests beta.
        </p>
      </header>

      <section className="space-y-4">
        {clauses.map((clause) => (
          <article key={clause.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h2 className="text-lg font-semibold text-white">{clause.title}</h2>
            <p className="mt-3 text-sm text-white/70">{clause.body}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-white/70">
        <p>
          Version : Beta 0.1 — valide jusqu&apos;au déploiement officiel. Pour toute question : legal@be-stam.com.
        </p>
      </section>
    </div>
  )
}
