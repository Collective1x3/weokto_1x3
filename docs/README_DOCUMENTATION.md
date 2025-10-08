# 📚 Guide de Navigation - Documentation Technique WEOKTO & STAM

## 🎯 Documents Principaux

### 1. **[DOCUMENTATION_TECHNIQUE_COMPLETE.md](DOCUMENTATION_TECHNIQUE_COMPLETE.md)**
**Rôle** : Documentation générale et guide de référence

**Contient** :
- Vue d'ensemble du projet (WEOKTO + STAM)
- Architecture globale et séparation des plateformes
- Stack technique complet
- Système d'authentification (Magic Links + JWT)
- Système de chat (Socket.io + Redis)
- Système de formations (Bunny.net)
- Design system et frontend
- API routes et endpoints
- Déploiement et infrastructure
- Features futures (Gamification : Compétitions, Pearls, MyOkto, Okto AI)

**Quand l'utiliser** :
- Pour comprendre l'architecture globale
- Pour voir comment les systèmes s'interconnectent
- Pour référence des flows et patterns généraux
- Pour documentation des API routes

---

### 2. **[SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)** ⭐️
**Rôle** : Source de vérité unique pour la base de données

**Contient** :
- **Schéma Prisma complet et consolidé** (un seul fichier, pas de fragments)
- Tous les models avec leurs relations
- Tous les enums :
  - `UserType` : CLIENT, AFFILIATE, ADMIN, PRODUCT_MANAGER, OWNER
  - `Platform` : WEOKTO, STAM
  - `CustomerStatus`, `AffiliateRiskLevel`, etc.
- **Documentation sécurité PCI Vault** (proxy-only, aucune donnée CB stockée)
- Contraintes et validations
- Index pour performance
- Règles métier dans les commentaires

**Quand l'utiliser** :
- ⚠️ **TOUJOURS** pour créer ou modifier des migrations Prisma
- Pour comprendre les relations entre entités
- Pour vérifier les contraintes et validations
- Pour référence sur les règles de sécurité PCI Vault

**⚠️ IMPORTANT** :
- Ne pas utiliser les fragments de schéma dans DOCUMENTATION_TECHNIQUE_COMPLETE.md
- Ce fichier est la **source de vérité unique**

---

### 3. **[DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)** ⭐️
**Rôle** : Spécification complète du dashboard affilié avec métriques avancées

**Contient** :
- **MRR (Monthly Recurring Revenue)**
  - Calcul basé sur commissions actives
  - Normalisation mensuelle (QUARTERLY → /3, ANNUALLY → /12)
  - Projection sur 3 mois
  - Croissance MoM
  - MRR par produit

- **Clients Gratuits (Free Clients)**
  - Tracking avec dates d'expiration
  - Alertes (expirant cette semaine/ce mois)
  - Taux de conversion vers payant
  - Liste détaillée par produit

- **Essais Gratuits (Trials)**
  - Suivi des trials actifs
  - Taux de conversion
  - Likelihood scoring (probabilité de conversion)
  - Days remaining tracking

- **Churn (Annulations)**
  - Métriques d'annulation (taux, total, nouveaux)
  - Lifetime value par client
  - Raisons d'annulation
  - Historique

- **Cookies (Tracking)**
  - Cookies actifs
  - Alertes d'expiration (aujourd'hui/cette semaine)
  - Taux de conversion par cookie
  - Durée moyenne restante

- **Taux de Conversion**
  - Par source (Google Ads, Facebook, Instagram, etc.)
  - Par produit
  - Par pays
  - Par device (mobile/desktop)

- **Interface Dashboard React**
  - Composants complets
  - Visualisations (charts)
  - Filtres et exports

- **API Routes**
  - `/api/affiliate/dashboard/metrics` (GET)
  - Structure de réponse complète
  - CRON jobs pour mises à jour automatiques

**Quand l'utiliser** :
- Pour implémenter le dashboard affilié
- Pour comprendre le calcul des métriques
- Pour créer les API routes de stats
- Pour les CRON jobs de mise à jour

---

## 🔍 Documents de Référence Supplémentaires

### 4. **claude/pcivault_docs_llm.md**
Documentation officielle PCI Vault pour l'IA

**Contient** :
- API de capture/proxy
- Flow de tokenization
- Endpoints disponibles
- Exemples d'intégration

**Quand l'utiliser** :
- Pour vérifier l'intégration PCI Vault
- Pour comprendre les endpoints de capture
- Pour référence lors de l'implémentation des paiements

---

## 📋 Checklist d'Implémentation

### Phase 1 : Base de Données
- [ ] Utiliser [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) pour créer `schema.prisma`
- [ ] Vérifier tous les enums (UserType, Platform, etc.)
- [ ] Créer migration initiale avec `npx prisma migrate dev`
- [ ] Vérifier les contraintes et index

### Phase 2 : Authentification & Sécurité
- [ ] Implémenter Magic Links (voir DOCUMENTATION_TECHNIQUE_COMPLETE.md)
- [ ] Configurer JWT avec secrets séparés (WEOKTO/STAM)
- [ ] Implémenter middleware de vérification de session
- [ ] Configurer domaines STAM dans `.env`

### Phase 3 : Paiements (PCI Vault)
- [ ] **Lire la section sécurité** dans SCHEMA_DATABASE_FINAL.md
- [ ] Implémenter création d'endpoints de capture (proxy-only)
- [ ] **NE JAMAIS stocker** de données CB complètes
- [ ] Stocker uniquement : token, brand, last4, expMonth, expYear
- [ ] Implémenter callbacks de succès/échec
- [ ] Tester en mode test avant production

### Phase 4 : Affiliation
- [ ] Implémenter système de tracking (last-click)
- [ ] Créer système de lock periods progressifs
- [ ] Implémenter calcul de risque
- [ ] Créer système de boost codes
- [ ] Implémenter attribution produits gratuits

### Phase 5 : Dashboard Affilié
- [ ] Utiliser [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md) comme spécification
- [ ] Implémenter calcul MRR
- [ ] Implémenter tracking clients gratuits
- [ ] Implémenter tracking trials
- [ ] Implémenter métriques de churn
- [ ] Implémenter tracking cookies
- [ ] Implémenter taux de conversion
- [ ] Créer interface React avec visualisations
- [ ] Créer CRON jobs pour mises à jour

### Phase 6 : Features Futures (Optionnel)
- [ ] Compétitions (WEEKLY, MONTHLY, SEASONAL)
- [ ] Système Pearls (1€ = 2 Pearls)
- [ ] MyOkto (profil customisable avec cosmetics)
- [ ] Okto AI (SaaS création de contenu)

---

## ⚠️ Règles Critiques

### Sécurité
1. **PCI Vault** : JAMAIS stocker de données CB complètes
2. **JWT** : Secrets séparés pour WEOKTO et STAM
3. **Cookies** : HTTP-only, Secure en production
4. **CORS** : Configuration stricte par domaine

### Base de Données
1. **Source de vérité** : SCHEMA_DATABASE_FINAL.md uniquement
2. **Ne pas créer** de champs génériques (imageUrl, description) dans Community
3. **Utiliser** les contraintes pour l'intégrité (@@unique, @@index)
4. **Vérifier** les relations avant suppression

### Affiliation
1. **Last-click** : Le dernier cookie/tracking event gagne
2. **Lock periods** : Toujours calculer selon ancienneté + risque
3. **Boost codes** : Non-cumulables (contrainte DB)
4. **Produits gratuits** : Attribution limitée dans le temps

### Frontend
1. **Landing pages** : Codées à la main (pas de builder)
2. **Boutons paiement** : ManualPaymentButton avec buttonKey unique
3. **STAM multi-produit** : Layout adaptatif (single/tabs/sidebar)

---

## 🚀 Démarrage Rapide

### 1. Lire d'abord
```bash
1. README_DOCUMENTATION.md (ce fichier)
2. DOCUMENTATION_TECHNIQUE_COMPLETE.md (vue d'ensemble)
3. SCHEMA_DATABASE_FINAL.md (structure DB)
```

### 2. Setup Projet
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Remplir : DATABASE_URL, JWT_SECRET, STAM_JWT_SECRET, etc.

# Setup database
npx prisma generate
npx prisma migrate dev --name init

# Start dev
npm run dev
```

### 3. Vérifier Intégrations
```bash
# PCI Vault
- Configurer PCIVAULT_API_KEY
- Tester en mode test

# Bunny.net (vidéos)
- Configurer BUNNY_LIBRARY_ID
- Configurer BUNNY_API_KEY

# Resend (emails)
- Configurer RESEND_API_KEY
```

---

## 📞 Support

Pour toute question ou clarification, se référer aux documents dans l'ordre :

1. **README_DOCUMENTATION.md** (ce fichier) - Navigation
2. **DOCUMENTATION_TECHNIQUE_COMPLETE.md** - Vue d'ensemble
3. **SCHEMA_DATABASE_FINAL.md** - Base de données
4. **DASHBOARD_AFFILIE_AVANCE.md** - Dashboard affilié

**Note** : Les documents sont maintenus à jour et consolidés. Ne pas se référer à d'anciens fragments ou extensions de schéma.

---

**Version** : 1.0.0
**Dernière mise à jour** : 2025-01-XX
**Auteur** : Documentation générée pour nouveau projet WEOKTO & STAM
