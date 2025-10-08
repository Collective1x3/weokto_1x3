# 🚀 Guide de Démarrage - WEOKTO & STAM

**Bienvenue dans le projet WEOKTO & STAM !**

Ce guide vous permettra de démarrer rapidement avec une compréhension claire de l'architecture et des documents disponibles.

---

## 📚 Documentation Disponible

### Documents à Lire (Dans l'Ordre)

1. **[README_DOCUMENTATION.md](README_DOCUMENTATION.md)** ⭐️
   - **Temps de lecture** : 10 minutes
   - **Quoi** : Vue d'ensemble de toute la documentation
   - **Pourquoi** : Comprendre quelle doc utiliser et quand

2. **[DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)** ⭐️
   - **Temps de lecture** : 45-60 minutes
   - **Quoi** : Guide de référence complet
   - **Pourquoi** : Comprendre l'architecture globale et les systèmes

3. **[SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)** ⭐️
   - **Temps de lecture** : 30 minutes
   - **Quoi** : Schéma Prisma consolidé définitif
   - **Pourquoi** : Créer la base de données et comprendre les relations

4. **[DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)**
   - **Temps de lecture** : 20 minutes
   - **Quoi** : Dashboard affilié avec métriques avancées
   - **Pourquoi** : Implémenter les stats pour affiliés

5. **[CHANGELOG_CONSOLIDATION.md](CHANGELOG_CONSOLIDATION.md)**
   - **Temps de lecture** : 10 minutes
   - **Quoi** : Historique des modifications récentes
   - **Pourquoi** : Comprendre les changements apportés

---

## 🎯 Qu'est-ce que WEOKTO & STAM ?

### WEOKTO (weokto.com)
**Pour qui** : Affiliés et créateurs

**Fonctionnalités** :
- Marketplace de produits digitaux
- Guildes de formation au community building
- Système d'affiliation complet avec tracking avancé
- Dashboard affilié avec MRR, churn, conversions

**Utilisateurs** :
- `CLIENT` : Utilisateur basique
- `AFFILIATE` : Affilié avec commissions
- `ADMIN` : Administrateur système
- `PRODUCT_MANAGER` : Gestionnaire de produits
- `WEOWNER` : Propriétaire (vous)

---

### STAM (be-stam.com)
**Pour qui** : Clients finaux

**Fonctionnalités** :
- Communautés en ligne payantes
- Formations intégrées (vidéos Bunny.net)
- Chat en temps réel (Socket.io + Redis)
- Profil unique pour multiple produits

**Utilisateurs** :
- `StamUser` avec multiple `Customer` (un par produit/communauté)
- Layout adaptatif selon nombre de produits (single/tabs/sidebar)

---

## 🏗️ Architecture en 5 Minutes

```
┌─────────────────────────────────────────────────┐
│         INFRASTRUCTURE PARTAGÉE                 │
│                                                  │
│  • PostgreSQL (Supabase)                        │
│  • JWT Auth (Magic Links)                       │
│  • Socket.io + Redis (Chat temps réel)         │
│  • PCI Vault (Paiements proxy-only)            │
│  • Bunny.net (Vidéos streaming)                │
└─────────────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                          ▼
┌──────────────┐          ┌──────────────┐
│   WEOKTO     │          │     STAM     │
│  (Affiliés)  │          │   (Clients)  │
│              │          │              │
│  • Guildes   │          │ • Communities│
│  • Dashboard │          │ • Formations │
│  • Tracking  │          │ • Chat       │
└──────────────┘          └──────────────┘
```

---

## 🔐 Concepts Clés à Retenir

### 1. Séparation WEOKTO/STAM
- **Même infrastructure**, **différentes plateformes**
- Enum `Platform { WEOKTO, STAM }` dans tous les models
- Authentification séparée (JWT_SECRET vs STAM_JWT_SECRET)
- Détection par hostname dans middleware

### 2. PCI Vault = Proxy Uniquement ⚠️
```typescript
// ✅ CORRECT
{
  pciVaultToken: "tok_abc123",
  brand: "Visa",
  last4: "4242",
  expMonth: 12,
  expYear: 2025
}

// ❌ JAMAIS STOCKER
{
  cardNumber: "4242424242424242",  // ❌ INTERDIT
  cvv: "123",                      // ❌ INTERDIT
  fullName: "John Doe"             // ❌ INTERDIT
}
```

**Flow** :
1. Backend → Crée capture endpoint via PCI Vault API
2. PCI Vault → Retourne `{url, secret}`
3. Frontend → Iframe vers PCI Vault
4. User → Saisit CB directement sur PCI Vault
5. PCI Vault → Retourne `{token, brand, last4, expMonth, expYear}`
6. Backend → Stocke uniquement le token + infos partielles

### 3. Affiliation = Last-Click
- Cookie duration : **30 jours**
- Le dernier tracking event gagne
- Lock periods **progressifs** selon ancienneté :
  - Nouveau (0-30j) : 45j (80%) + 90j (20%)
  - Récent (31-60j) : 40j (85%) + 60j (15%)
  - Validé (61-90j) : 35j (90%) + 40j (10%)
  - Trusted (90+j) : 30j (94%) + 40j (6%)
- Risk levels override l'ancienneté

### 4. STAM Multi-Produit
- **1 StamUser** → **Multiple Customer** (un par produit)
- Layout adaptatif :
  - 1 produit : Single page
  - 2-4 produits : Tabs navigation
  - 5+ produits : Sidebar navigation
- localStorage pour dernier produit visité

### 5. Manuel, Pas de Builders
- Landing pages **codées à la main**
- Boutons paiement créés via dashboard owner
- Formations uploadées manuellement sur Bunny.net
- **Pas de** imageUrl/bannerUrl/description génériques

---

## 📦 Stack Technique

```json
{
  "framework": "Next.js 15.5+",
  "language": "TypeScript 5.9+",
  "database": "PostgreSQL via Supabase",
  "orm": "Prisma 6.15+",
  "auth": "JWT + Magic Links (passwordless)",
  "realtime": "Socket.io 4.7+ (Redis adapter)",
  "payments": "PCI Vault (proxy)",
  "video": "Bunny.net",
  "email": "Resend + React Email",
  "styling": "Tailwind CSS 4.0+",
  "deployment": "Vercel (frontend) + Railway (Socket.io)"
}
```

---

## ⚡ Quick Start (15 minutes)

### 1. Clone & Install
```bash
cd "weokto site/WeOkto.com"
npm install
```

### 2. Environment Variables
```bash
cp .env.example .env
```

**Variables critiques** :
```env
# Database
DATABASE_URL="postgresql://..."

# JWT Secrets (générer avec openssl rand -base64 32)
JWT_SECRET="..."
STAM_JWT_SECRET="..."

# PCI Vault
PCIVAULT_API_KEY="..."
PCIVAULT_CHECKOUT_URL="https://checkout.pcivault.io"

# Bunny.net
BUNNY_LIBRARY_ID="..."
BUNNY_API_KEY="..."

# Resend
RESEND_API_KEY="..."

# STAM Hosts
STAM_HOSTS="be-stam.com,www.be-stam.com"
```

### 3. Database Setup
```bash
# Générer client Prisma
npx prisma generate

# Créer base de données
npx prisma migrate dev --name init

# (Optionnel) Seed avec données de test
npx prisma db seed
```

### 4. Start Development
```bash
# Frontend
npm run dev

# Socket.io server (séparé)
npm run socket-server
```

**URLs** :
- Frontend : http://localhost:3000
- Socket.io : http://localhost:3001

### 5. Tester
```bash
# Test WEOKTO
http://localhost:3000

# Test STAM (simuler hostname)
# Modifier /etc/hosts :
# 127.0.0.1 be-stam.com
http://be-stam.com:3000
```

---

## 📋 Checklist Premier Jour

### Lecture (2-3 heures)
- [ ] Lire README_DOCUMENTATION.md
- [ ] Parcourir DOCUMENTATION_TECHNIQUE_COMPLETE.md
- [ ] Lire SCHEMA_DATABASE_FINAL.md en détail
- [ ] Comprendre flow PCI Vault (section sécurité)

### Setup (1 heure)
- [ ] Cloner projet
- [ ] Installer dépendances
- [ ] Configurer .env
- [ ] Setup base de données
- [ ] Lancer dev server

### Vérifications (30 min)
- [ ] Accéder à WEOKTO (localhost:3000)
- [ ] Tester Magic Link login
- [ ] Vérifier connexion DB (Prisma Studio : `npx prisma studio`)
- [ ] Vérifier Socket.io connection

### Exploration Code (1 heure)
- [ ] Lire `middleware.ts` (routing WEOKTO/STAM)
- [ ] Lire `lib/auth/` (Magic Links + JWT)
- [ ] Lire `prisma/schema.prisma` (DB structure)
- [ ] Lire `app/api/` (API routes)

---

## 🎯 Premiers Objectifs

### Semaine 1 : Setup & Familiarisation
- [ ] Comprendre architecture globale
- [ ] Setup environnement de dev
- [ ] Créer premier utilisateur WEOWNER
- [ ] Tester authentification complète
- [ ] Explorer dashboard existant

### Semaine 2 : Dashboard Owner
- [ ] Créer pages /wo-renwo-9492xE/dashboard
- [ ] Implémenter création de produits
- [ ] Implémenter création de plans (pricing)
- [ ] Implémenter création de boutons paiement
- [ ] Tester flow complet de création

### Semaine 3 : Paiements PCI Vault
- [ ] Lire documentation PCI Vault (claude/pcivault_docs_llm.md)
- [ ] Implémenter création capture endpoint
- [ ] Implémenter iframe paiement
- [ ] Implémenter callback success/failure
- [ ] Tester paiement en mode test

### Semaine 4 : Affiliation
- [ ] Implémenter tracking cookies (30j)
- [ ] Implémenter calcul lock periods
- [ ] Implémenter création commissions
- [ ] Implémenter dashboard affilié basique
- [ ] Tester flow affiliation complet

---

## 🆘 Aide & Support

### Documentation
- **Vue d'ensemble** : [README_DOCUMENTATION.md](README_DOCUMENTATION.md)
- **Architecture** : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)
- **Base de données** : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)
- **Dashboard affilié** : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)

### Commandes Utiles
```bash
# Prisma
npx prisma studio              # Interface DB
npx prisma migrate dev         # Créer migration
npx prisma generate           # Générer client

# Development
npm run dev                   # Frontend
npm run socket-server         # Socket.io
npm run build                 # Build production
npm run type-check           # Vérifier types

# Database
npm run db:push              # Push schema sans migration
npm run db:reset             # Reset DB (⚠️ perte données)
npm run db:seed              # Seed données test
```

### Debugging
```bash
# Logs détaillés Prisma
DEBUG=prisma:* npm run dev

# Logs Socket.io
DEBUG=socket.io:* npm run socket-server

# Vérifier types TypeScript
npm run type-check
```

---

## 🎓 Ressources Externes

### Technologies
- **Next.js** : https://nextjs.org/docs
- **Prisma** : https://prisma.io/docs
- **Socket.io** : https://socket.io/docs
- **Tailwind CSS** : https://tailwindcss.com/docs

### Services
- **Supabase** : https://supabase.com/docs
- **PCI Vault** : Voir `claude/pcivault_docs_llm.md`
- **Bunny.net** : https://docs.bunny.net
- **Resend** : https://resend.com/docs

---

## 🚀 Bon Démarrage !

Vous avez maintenant toutes les informations nécessaires pour démarrer le projet WEOKTO & STAM.

**Prochaine étape** : Lire [README_DOCUMENTATION.md](README_DOCUMENTATION.md) pour une vue d'ensemble complète de la documentation.

**Questions** : Se référer aux documents dans l'ordre de priorité :
1. README_DOCUMENTATION.md (navigation)
2. DOCUMENTATION_TECHNIQUE_COMPLETE.md (architecture)
3. SCHEMA_DATABASE_FINAL.md (base de données)
4. DASHBOARD_AFFILIE_AVANCE.md (métriques)

---

**Bonne chance et bon code ! 🎉**
