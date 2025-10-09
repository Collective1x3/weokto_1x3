# Authentification Weokto / Stam

Cette page explique comment configurer l’authentification basée sur NextAuth, Prisma et Resend pour les deux plateformes.

## 1. Variables d’environnement

Copiez `.env.example` vers `.env.local` et renseignez les valeurs :

- `DATABASE_URL` : chaîne de connexion Postgres (service-role Supabase recommandée).
- `WEOKTO_NEXTAUTH_SECRET` / `STAM_NEXTAUTH_SECRET` : chaînes aléatoires (32+ caractères).
- `WEOKTO_SITE_URL` / `STAM_SITE_URL` : URL publique utilisée dans les emails (ex. `https://weokto.example`).
- `WEOKTO_EMAIL_FROM` / `STAM_EMAIL_FROM` : adresse d’envoi (format `Auth <auth@domaine>`).
- `WEOKTO_RESEND_API_KEY` / `STAM_RESEND_API_KEY` : clés API Resend.

## 2. Provisionnement base de données (Supabase)

1. Connectez-vous à votre instance Supabase en utilisant le rôle `service_role`.
2. Exécutez le script SQL :

```bash
psql "$DATABASE_URL" -f supabase/weokto_stam_auth.sql
```

Le script crée les tables, les types enum, les déclencheurs `updated_at` et active le RLS avec des policies réservées au rôle `service_role`.

## 3. Prisma

Installez le client et synchronisez le schéma :

```bash
npx prisma generate
# Optionnel si vous n’utilisez pas Supabase : npx prisma db push
```

## 4. Lancement local

```bash
npm install
npm run dev
```

Les landings sont accessibles via `http://localhost:3000/weokto` et `http://localhost:3000/stam`.

## 5. Flux d’authentification

- Formulaire email → déclenche NextAuth email provider.
- NextAuth enregistre le jeton de vérif + OTP (6 chiffres, valable 10 min).
- Un email est envoyé via Resend :
  - message violet pour Weokto (bienvenue vs connexion).
  - message beige pour Stam.
- L’utilisateur renseigne le code OTP : `/api/{site}/auth/verify-otp` renvoie le jeton.
- Le frontend termine la connexion avec `signIn('email', { email, token })`.
- Les sessions (JWT) expirent après 30 jours et se rafraîchissent automatiquement côté NextAuth.

## 6. Points de personnalisation

- Rôles par défaut : `CREATOR` pour Weokto, `USER` pour Stam (`@see prisma/schema.prisma`).
- Emails : contenus HTML dans `lib/email/templates.ts`.
- TTLs : configurés dans `lib/auth/token.ts`.
- Adaptateurs Prisma spécifiques : `lib/auth/prismaAdapters.ts`.

## 7. Tests manuels

1. Renseignez un email réel.
2. Vérifiez l’envoi Resend (environnement de test possible via domaine sandbox).
3. Testez un code invalide et expiré.
4. Vérifiez qu’un nouvel utilisateur obtient bien le rôle de base correspondant à son site.
