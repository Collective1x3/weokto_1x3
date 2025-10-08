# 📚 Index de la Documentation - WEOKTO & STAM

**Dernière mise à jour** : 2025-01-XX

---

## 🎯 Par Où Commencer ?

### Nouveau sur le projet ?
**Lire dans cet ordre** :
1. **[GETTING_STARTED.md](GETTING_STARTED.md)** - Guide de démarrage (15 min)
2. **[README_DOCUMENTATION.md](README_DOCUMENTATION.md)** - Navigation docs (10 min)
3. **[DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)** - Architecture (45-60 min)

### Besoin d'une référence spécifique ?
- **Base de données** → [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)
- **Dashboard affilié** → [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)
- **Paiements** → [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-paiements-pci-vault)

---

## 📁 Tous les Documents

### 🌟 Documents Principaux

| Document | Rôle | Temps de lecture |
|----------|------|------------------|
| **[GETTING_STARTED.md](GETTING_STARTED.md)** | Guide de démarrage rapide pour nouveaux développeurs | 15 min |
| **[README_DOCUMENTATION.md](README_DOCUMENTATION.md)** | Guide de navigation de toute la documentation | 10 min |
| **[DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)** | Guide de référence complet (architecture, systèmes, API) | 45-60 min |
| **[SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)** ⭐️ | **Source de vérité** pour le schéma Prisma consolidé | 30 min |
| **[DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)** | Spécification complète du dashboard affilié avec métriques | 20 min |

---

### 📝 Documents Historiques & Référence

| Document | Rôle | Quand le lire |
|----------|------|---------------|
| **[CHANGELOG_CONSOLIDATION.md](CHANGELOG_CONSOLIDATION.md)** | Historique des modifications de consolidation | Pour comprendre l'évolution |
| **[INDEX.md](INDEX.md)** (ce fichier) | Index de tous les documents disponibles | Point d'entrée général |

---

### 📖 Documents par Catégorie

#### 🏗️ Architecture & Vue d'Ensemble
- [GETTING_STARTED.md](GETTING_STARTED.md) - Guide de démarrage
- [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md) - Architecture complète

#### 🗄️ Base de Données
- [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) ⭐️ **Source de vérité unique**

#### 💰 Affiliation & Métriques
- [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md) - Dashboard avec MRR, churn, conversions

#### 💳 Paiements
- [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-paiements-pci-vault) - Section PCI Vault
- `claude/pcivault_docs_llm.md` - Documentation officielle PCI Vault

#### 🔐 Authentification & Sécurité
- [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-dauthentification) - Magic Links + JWT
- [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) - Règles de sécurité PCI Vault

---

## 🔍 Recherche par Sujet

### A
- **Affiliation**
  - Système complet : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-daffiliation)
  - Dashboard avancé : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)
  - Lock periods : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#lock-periods-progressifs)
  - Attribution last-click : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#vue-densemble)

- **API Routes**
  - Liste complète : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-api-routes--endpoints)
  - Dashboard affilié : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#api-route-metrics)

- **Architecture**
  - Vue d'ensemble : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#️-architecture-globale)
  - Quick overview : [GETTING_STARTED.md](GETTING_STARTED.md#️-architecture-en-5-minutes)

- **Authentification**
  - Magic Links : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-dauthentification)
  - JWT : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#jwt-generation)

### B
- **Base de Données**
  - Schéma complet : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) ⭐️
  - Relations : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#relations)
  - Enums : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#enums)

- **Boost Codes**
  - Système complet : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#boost-codes-de-commission)

### C
- **Chat (Socket.io)**
  - Architecture : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-chat-socketio)
  - Redis adapter : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#redis-adapter)

- **Churn**
  - Métriques : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#4-métriques-de-churn)

- **Clients Gratuits**
  - Tracking : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#2-clients-gratuits-free-clients)
  - Attribution : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#attribution-produits-gratuits)

- **Commissions**
  - Calcul : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#commission-structure)
  - Lock periods : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#lock-periods-progressifs)

- **Community**
  - Model : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#community)
  - Membership : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#communitymember)

- **Conversion**
  - Taux par source : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#6-taux-de-conversion)

- **Cookies (Tracking)**
  - Métriques : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#5-cookies-tracking)
  - Attribution : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#tracking-affilié)

### D
- **Dashboard Affilié**
  - Spécification complète : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)
  - MRR : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#1-mrr-monthly-recurring-revenue)
  - Interface : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#interface-dashboard)

- **Dashboard Owner**
  - Création produits : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#dashboard-owner)
  - Boutons paiement : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#création-bouton-dashboard-owner)

- **Déploiement**
  - Infrastructure : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#️-déploiement--infrastructure)

### E
- **Enums**
  - UserType : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#usertype)
  - Platform : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#platform)
  - CustomerStatus : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#customerstatus)

- **Environment Variables**
  - Configuration : [GETTING_STARTED.md](GETTING_STARTED.md#2-environment-variables)

### F
- **Formations**
  - Système : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-formations)
  - Bunny.net : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#bunnynet-streaming)

### G
- **Gamification**
  - Compétitions : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#1-compétitions)
  - Pearls : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#2-pearls-monnaie-virtuelle)
  - MyOkto : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#3-myokto-profil-personnalisable)

- **Guildes**
  - System : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#guildes)

### L
- **Lock Periods**
  - Progressifs : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#lock-periods-progressifs)
  - Calcul : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#calcul-du-profil-affilié)

### M
- **Middleware**
  - Protection routes : [CHANGELOG_CONSOLIDATION.md](CHANGELOG_CONSOLIDATION.md#3--middleware---protection-des-routes)
  - STAM detection : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#middleware)

- **MRR (Monthly Recurring Revenue)**
  - Calcul : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#1-mrr-monthly-recurring-revenue)

### P
- **Paiements**
  - PCI Vault : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-paiements-pci-vault)
  - Sécurité : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#sécurité-pci-vault)
  - Boutons manuels : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#création-bouton-dashboard-owner)

- **PCI Vault**
  - Proxy-only : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#sécurité-pci-vault)
  - Flow : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#architecture-1)

- **Plans (Pricing)**
  - Model : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#plan)
  - Création : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#plans-pricing)

- **Prisma**
  - Schéma complet : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)
  - Migration : [GETTING_STARTED.md](GETTING_STARTED.md#3-database-setup)

### R
- **Rôles (UserType)**
  - Liste complète : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#usertype)
  - CLIENT, AFFILIATE, ADMIN, PRODUCT_MANAGER, WEOWNER

### S
- **Schéma Database**
  - **Source de vérité** : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) ⭐️

- **Sécurité**
  - PCI Vault : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#sécurité-pci-vault)
  - JWT : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#jwt-generation)

- **Socket.io**
  - Architecture : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-chat-socketio)
  - Rooms : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#rooms--namespaces)

- **STAM**
  - Platform : [GETTING_STARTED.md](GETTING_STARTED.md#stam-be-stamcom)
  - Multi-produit : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#stam-multi-produit)

- **Stack Technique**
  - Technologies : [GETTING_STARTED.md](GETTING_STARTED.md#-stack-technique)

### T
- **Tracking**
  - Cookies : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#5-cookies-tracking)
  - Attribution : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#tracking-affilié)

- **Trials (Essais Gratuits)**
  - Métriques : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md#3-essais-gratuits-trials)

### W
- **WEOKTO**
  - Platform : [GETTING_STARTED.md](GETTING_STARTED.md#weokto-weoktocom)
  - Guildes : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#guildes)

---

## 🎯 Cas d'Usage Courants

### "Je veux créer une migration Prisma"
1. Lire [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) ⭐️
2. Modifier `prisma/schema.prisma`
3. Exécuter `npx prisma migrate dev --name ma_migration`

### "Je veux comprendre le système de paiements"
1. Lire section sécurité dans [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md#sécurité-pci-vault)
2. Lire [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-paiements-pci-vault)
3. Consulter `claude/pcivault_docs_llm.md` pour API PCI Vault

### "Je veux implémenter le dashboard affilié"
1. Lire [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md) en entier
2. Créer composants React
3. Créer API routes
4. Setup CRON jobs

### "Je veux ajouter une nouvelle route protégée"
1. Modifier `middleware.ts`
2. Ajouter route dans les constantes (adminRoutes, etc.)
3. Ajouter vérification de userType
4. Tester avec différents rôles

### "Je veux comprendre l'architecture globale"
1. Lire [GETTING_STARTED.md](GETTING_STARTED.md#️-architecture-en-5-minutes)
2. Lire [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#️-architecture-globale)
3. Explorer le code avec cette compréhension

---

## 📊 Statistiques Documentation

- **Documents principaux** : 5
- **Documents de référence** : 2
- **Temps de lecture total** : ~2.5 heures
- **Dernière mise à jour** : 2025-01-XX

---

## ✅ Checklist Lecture Documentation

### Jour 1 : Bases
- [ ] GETTING_STARTED.md (15 min)
- [ ] README_DOCUMENTATION.md (10 min)
- [ ] SCHEMA_DATABASE_FINAL.md - Parcours rapide (15 min)

### Jour 2 : Architecture
- [ ] DOCUMENTATION_TECHNIQUE_COMPLETE.md (60 min)
- [ ] SCHEMA_DATABASE_FINAL.md - Lecture approfondie (30 min)

### Jour 3 : Spécialisations
- [ ] DASHBOARD_AFFILIE_AVANCE.md (20 min)
- [ ] CHANGELOG_CONSOLIDATION.md (10 min)

### Jour 4+ : Référence
- [ ] Relire sections spécifiques selon besoins
- [ ] Explorer code source avec compréhension docs

---

## 🚀 Actions Recommandées

### Première Lecture
1. Commencer par [GETTING_STARTED.md](GETTING_STARTED.md)
2. Continuer avec [README_DOCUMENTATION.md](README_DOCUMENTATION.md)
3. Lire [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)

### Référence Quotidienne
- **Database** : [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)
- **Architecture** : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)

### Développement Spécifique
- **Dashboard affilié** : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)
- **Paiements** : [DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md#-système-de-paiements-pci-vault)

---

**Bon apprentissage et bon développement ! 🎉**
