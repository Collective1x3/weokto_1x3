# 🚀 WEOKTO_01 - WEOKTO & STAM

**Projet from scratch** - Infrastructure complète pour plateformes WEOKTO et STAM

---

## ✅ STATUS : Phase 0 & Phase 1 TERMINÉES

**Dernière mise à jour** : 2025-10-09

### 📋 Progression
- ✅ **Phase 0** : Setup Initial & Infrastructure (100%)
- ✅ **Phase 1** : Base de Données & Models (95% - migration à exécuter)
- ⏳ **Phase 2** : Authentification & Sécurité (à venir)

👉 **Voir détails complets** : [SETUP_COMPLETE.md](SETUP_COMPLETE.md)

---

## 📚 Documentation

Toute la documentation se trouve dans le dossier **[docs/](docs/)**

### 🎯 Commencer Ici

1. **[SETUP_COMPLETE.md](SETUP_COMPLETE.md)** - ✨ **Résumé Phase 0 & 1 terminées**
2. **[docs/PLAN_EXECUTION_COMPLET.md](docs/PLAN_EXECUTION_COMPLET.md)** - Plan d'exécution complet (17 phases)
3. **[docs/SCHEMA_DATABASE_FINAL.md](docs/SCHEMA_DATABASE_FINAL.md)** - Schéma database (source de vérité)
4. **[docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md](docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md)** - Architecture complète

---

## ⚡ Quick Start

```bash
# 1. Lire la documentation
cd docs/
open GETTING_STARTED.md

# 2. Setup projet Next.js
npx create-next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# 3. Installer dépendances
npm install prisma @prisma/client
npm install socket.io socket.io-client socket.io-redis
npm install jsonwebtoken bcryptjs
npm install -D @types/jsonwebtoken @types/bcryptjs

# 4. Setup Prisma
npx prisma init

# 5. Copier schema depuis docs/SCHEMA_DATABASE_FINAL.md
# Copier le contenu dans prisma/schema.prisma

# 6. Setup .env
cp .env.example .env
# Remplir les variables d'environnement

# 7. Créer base de données
npx prisma migrate dev --name init
npx prisma generate

# 8. Lancer dev
npm run dev
```

---

## 🏗️ Qu'est-ce que WEOKTO & STAM ?

### WEOKTO (weokto.com)
Plateforme pour **affiliés et créateurs**
- Marketplace de produits digitaux
- Guildes de formation
- Système d'affiliation avec MRR tracking
- Dashboard avancé

### STAM (be-stam.com)
Plateforme pour **clients finaux**
- Communautés en ligne payantes
- Formations vidéo (Bunny.net)
- Chat temps réel (Socket.io)
- Multi-produits par utilisateur

---

## 📖 Documentation Disponible

| Document | Description |
|----------|-------------|
| [docs/README.md](docs/README.md) | Point d'entrée documentation |
| [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) | Guide démarrage rapide |
| [docs/SCHEMA_DATABASE_FINAL.md](docs/SCHEMA_DATABASE_FINAL.md) | Schéma Prisma consolidé ⭐️ |
| [docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md](docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md) | Architecture complète |
| [docs/DASHBOARD_AFFILIE_AVANCE.md](docs/DASHBOARD_AFFILIE_AVANCE.md) | Dashboard affilié métriques |
| [docs/README_DOCUMENTATION.md](docs/README_DOCUMENTATION.md) | Navigation documentation |
| [docs/INDEX.md](docs/INDEX.md) | Index alphabétique |

---

## 🔐 Sécurité & Concepts Clés

### PCI Vault (Paiements)
⚠️ **Modèle proxy-only** : Les données CB ne passent JAMAIS par notre backend
- Frontend → PCI Vault (direct)
- Backend → Stocke uniquement token + infos partielles

### Affiliation
- **Last-click** attribution (30 jours)
- Lock periods progressifs (30-90 jours)
- MRR tracking avancé

### STAM Multi-Produit
- 1 StamUser → Multiple Customer (un par produit)
- Layout adaptatif (single/tabs/sidebar)

---

## 📦 Stack Technique

```json
{
  "framework": "Next.js 15.5+",
  "language": "TypeScript 5.9+",
  "database": "PostgreSQL (Supabase)",
  "orm": "Prisma 6.15+",
  "auth": "JWT + Magic Links",
  "realtime": "Socket.io 4.7+ (Redis)",
  "payments": "PCI Vault (proxy)",
  "video": "Bunny.net",
  "email": "Resend",
  "styling": "Tailwind CSS 4.0+"
}
```

---

## 📋 Checklist Premier Jour

### Documentation (2h)
- [ ] Lire [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)
- [ ] Lire [docs/SCHEMA_DATABASE_FINAL.md](docs/SCHEMA_DATABASE_FINAL.md)
- [ ] Parcourir [docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md](docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md)

### Setup (1h)
- [ ] Initialiser Next.js
- [ ] Setup Prisma
- [ ] Configurer .env
- [ ] Créer database
- [ ] Lancer dev server

### Vérifications (30min)
- [ ] Prisma Studio fonctionne
- [ ] Frontend accessible
- [ ] Hot reload fonctionne

---

## 🎯 Prochaines Étapes

### Semaine 1 : Foundation
- [ ] Setup authentification (Magic Links + JWT)
- [ ] Middleware WEOKTO/STAM
- [ ] Premiers models Prisma

### Semaine 2 : Dashboard Owner
- [ ] Pages /wo-renwo-9492xE/
- [ ] Création produits/plans
- [ ] Boutons paiement manuels

### Semaine 3 : Paiements
- [ ] Intégration PCI Vault
- [ ] Flow checkout complet
- [ ] Callbacks success/failure

### Semaine 4 : Affiliation
- [ ] Tracking cookies
- [ ] Calcul commissions
- [ ] Dashboard affilié basique

---

## 🆘 Support

- **Documentation** : Voir [docs/](docs/)
- **Index alphabétique** : [docs/INDEX.md](docs/INDEX.md)
- **Architecture** : [docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md](docs/DOCUMENTATION_TECHNIQUE_COMPLETE.md)

---

## 📊 Structure Projet

```
weokto_01/
├── README.md (ce fichier)
├── docs/                           # Documentation complète
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── SCHEMA_DATABASE_FINAL.md ⭐️
│   ├── DOCUMENTATION_TECHNIQUE_COMPLETE.md
│   ├── DASHBOARD_AFFILIE_AVANCE.md
│   ├── README_DOCUMENTATION.md
│   └── INDEX.md
│
├── (à créer) app/                  # Next.js App Router
├── (à créer) prisma/               # Prisma schema
├── (à créer) lib/                  # Utilities
├── (à créer) components/           # React components
└── (à créer) public/               # Static assets
```

---

**Prochaine étape** : Lire [docs/GETTING_STARTED.md](docs/GETTING_STARTED.md) 🚀
