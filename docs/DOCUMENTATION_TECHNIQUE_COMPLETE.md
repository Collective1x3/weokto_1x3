# 📚 DOCUMENTATION TECHNIQUE COMPLÈTE
## WEOKTO & STAM - Guide de Référence pour Développeurs

---

## 📋 TABLE DES MATIÈRES

> **📌 DOCUMENTS COMPLÉMENTAIRES**
> - **[SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)** - Schéma Prisma consolidé définitif
> - **[DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)** - Dashboard affilié avec métriques avancées

1. [Vue d'Ensemble du Projet](#vue-densemble-du-projet)
2. [Architecture Globale](#architecture-globale)
3. [Stack Technique](#stack-technique)
4. [Base de Données - Schema Prisma](#base-de-données---schema-prisma) → **Voir [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)**
5. [Système d'Authentification](#système-dauthentification)
6. [Système de Chat (Socket.io)](#système-de-chat-socketio)
7. [Système de Formations](#système-de-formations)
8. [Système de Paiements (PCI Vault)](#système-de-paiements-pci-vault)
9. [Système d'Affiliation](#système-daffiliation) → **Dashboard avancé : [DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)**
10. [Design System & Frontend](#design-system--frontend)
11. [API Routes & Endpoints](#api-routes--endpoints)
12. [Déploiement & Infrastructure](#déploiement--infrastructure)
13. [Features Futures (Gamification)](#features-futures-gamification)

---

## 🎯 VUE D'ENSEMBLE DU PROJET

### Concept

**WEOKTO** et **STAM** sont deux plateformes distinctes mais partageant la même infrastructure technique :

- **WEOKTO (weokto.com)** : Plateforme pour affiliés/créateurs
  - Marketplace de produits digitaux
  - Guildes de formation au community building
  - Système d'affiliation complet
  - Dashboard affilié avec commissions et tracking

- **STAM (be-stam.com)** : Plateforme pour clients finaux
  - Communautés en ligne payantes
  - Formations intégrées
  - Chat en temps réel
  - Pas de système d'affiliation visible

### Business Model

```
┌──────────────────────────────────────────────────────────┐
│                    VOUS (Propriétaire)                   │
│                                                           │
│  Crée tous les produits sous différentes marques        │
│  (Fournisseurs fictifs pour la marketplace)             │
└──────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                  ▼
   ┌─────────────┐                  ┌──────────────┐
   │   WEOKTO    │                  │     STAM     │
   │  (Affiliés) │                  │  (Clients)   │
   └─────────────┘                  └──────────────┘
         │                                  │
         │ Promeut                          │ Achète
         │                                  │
         └──────────────► Produit ◄─────────┘
                              │
                              ▼
                    Commission affilié
```

### Philosophie de Développement

**"Manuel, Rapide, Efficace"**

- Landing pages codées à la main (pas de builder)
- Boutons de paiement créés manuellement
- Contenu formations uploadé manuellement sur Bunny.net
- Pas d'automatisation complexe
- Contrôle total sur chaque aspect

---

## 🏗️ ARCHITECTURE GLOBALE

### Séparation des Plateformes

```
┌─────────────────────────────────────────────────────────┐
│                  INFRASTRUCTURE PARTAGÉE                 │
│                                                          │
│  • Base de données PostgreSQL (Supabase)               │
│  • Système d'authentification (JWT)                     │
│  • Serveur Socket.io (Redis adapter)                   │
│  • Stockage fichiers (Supabase Storage)                │
│  • Streaming vidéo (Bunny.net)                         │
│  • Paiements (PCI Vault)                               │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┴────────────────┐
         ▼                                  ▼
┌─────────────────┐              ┌─────────────────┐
│ WEOKTO Platform │              │  STAM Platform  │
│                 │              │                 │
│ • Guildes       │              │ • Communautés   │
│ • Marketplace   │              │ • Formations    │
│ • Affiliation   │              │ • Chat          │
│ • Dashboard     │              │ • Learning      │
└─────────────────┘              └─────────────────┘
```

### Hiérarchie des Entités

```
COMMUNITY (Guilde ou Communauté)
  │
  ├── platform: "WEOKTO" ou "STAM"
  │
  ├── PRODUCTS (Tiers d'accès)
  │   ├── Product 1 (Gratuit)
  │   │   └── Plans (Gratuit)
  │   │
  │   └── Product 2 (Premium)
  │       ├── Plan 1 (Mensuel - 49€/mois)
  │       └── Plan 2 (Annuel - 490€/an)
  │
  ├── CHANNELS (Chat)
  │   ├── Channel Général
  │   └── Channel Premium (réservé Product 2)
  │
  └── FORMATIONS
      ├── Formation 1
      │   ├── Module 1
      │   │   ├── Leçon 1 (vidéo Bunny)
      │   │   └── Leçon 2
      │   └── Module 2
      └── Formation 2
```

### Flow Utilisateur Complet

```
┌──────────────────────────────────────────────────────────┐
│ 1. AFFILIÉ WEOKTO                                        │
│    • S'inscrit sur weokto.com                           │
│    • Rejoint une Guilde (obligatoire, min tier gratuit) │
│    • Explore marketplace fournisseurs                    │
│    • Génère lien affilié pour produit STAM             │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 2. CLIENT FINAL                                          │
│    • Clique sur lien affilié                            │
│    • Arrive sur be-stam.com                             │
│    • Cookie tracking enregistré (30j)                   │
│    • Visite landing page produit                        │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 3. ACHAT                                                 │
│    • Clique sur bouton paiement                         │
│    • Checkout PCI Vault (iframe)                        │
���    • Paiement réussi                                    │
│    • Création compte StamUser                           │
│    • Accès communauté débloqué                         │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 4. COMMISSION AFFILIÉ                                    │
│    • Système détecte cookie affilié                     │
│    • Calcule commission (base + tier guild + boosts)    │
│    • Crée AffiliateCommission (locked 30j)             │
│    • Affilié voit dans dashboard WEOKTO                 │
└──────────────────────────────────────────────────────────┘
```

---

## 💻 STACK TECHNIQUE

### Frontend

```json
{
  "framework": "Next.js 15.5+",
  "language": "TypeScript 5.9+",
  "styling": "Tailwind CSS 4.1+",
  "ui-library": "shadcn/ui (Radix UI)",
  "animations": "Framer Motion 12+",
  "icons": "Phosphor Icons React",
  "forms": "React Hook Form + Zod",
  "data-fetching": "SWR",
  "real-time": "Socket.io Client 4.7+"
}
```

### Backend

```json
{
  "runtime": "Node.js 24+",
  "framework": "Next.js API Routes",
  "database": "PostgreSQL (Supabase)",
  "orm": "Prisma 6.15+",
  "auth": "JWT (jose library)",
  "real-time": "Socket.io Server 4.7+",
  "cache": "Redis (ioredis)",
  "queues": "BullMQ 5.8+",
  "email": "Resend + React Email",
  "payments": "PCI Vault",
  "video": "Bunny.net"
}
```

### Infrastructure

```json
{
  "hosting": "Vercel",
  "database": "Supabase PostgreSQL",
  "storage": "Supabase Storage + Bunny.net",
  "redis": "Upstash Redis ou Redis Labs",
  "monitoring": "Vercel Analytics + Sentry",
  "cdn": "Vercel Edge Network"
}
```

### Outils de Développement

```json
{
  "package-manager": "pnpm 10.16+",
  "linting": "ESLint 9+",
  "formatting": "Prettier 3.6+",
  "git": "Git + GitHub"
}
```

---

## 🗄️ BASE DE DONNÉES - SCHEMA PRISMA

> **📌 SCHÉMA CONSOLIDÉ DÉFINITIF**
>
> Le schéma complet et à jour se trouve dans : **[SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md)**
>
> Ce document contient :
> - Le schéma Prisma complet et consolidé
> - Tous les enums (UserType avec ADMIN, PRODUCT_MANAGER, OWNER)
> - Toutes les relations et contraintes
> - Documentation PCI Vault (proxy-only, aucune donnée CB stockée)
> - Règles de sécurité et validation
>
> **⚠️ IMPORTANT** : Ne pas utiliser les fragments de schéma ci-dessous - ils sont conservés pour référence historique uniquement. Utilisez toujours [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) comme source de vérité.

### Vue d'Ensemble

Le schéma unifie WEOKTO et STAM en utilisant un enum `Platform` pour différencier les entités.

### Entités Principales

#### 1. Utilisateurs

```prisma
// Utilisateurs WEOKTO (Affiliés)
model WeoktoUser {
  id                String    @id @default(cuid())
  email             String    @unique @db.Citext
  authId            String    @unique // Supabase Auth ID
  displayName       String?
  avatarUrl         String?
  userType          UserType  @default(CLIENT) // CLIENT | AFFILIATE | WEOWNER

  // Guild membership (max 1 guilde)
  currentGuildId    String?
  lastGuildChangeAt DateTime? // Pour limite 1 changement/30j

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?

  // Relations
  sessions                WeoktoSession[]
  communityMemberships    CommunityMember[]
  customers               Customer[]

  // Affiliation
  affiliateProfile        AffiliateProfile?
  affiliateCommissions    AffiliateCommission[]
  withdrawalRequests      WithdrawalRequest[]

  @@map("weokto_users")
}

// Utilisateurs STAM (Clients)
// 🎯 UN CLIENT STAM PEUT AVOIR PLUSIEURS PRODUITS/COMMUNAUTÉS avec 1 SEUL PROFIL
model StamUser {
  id                String    @id @default(cuid())
  email             String    @unique @db.Citext
  authId            String    @unique
  displayName       String?
  avatarUrl         String?
  bio               String?

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?

  // Relations (1 StamUser → Plusieurs produits/communautés)
  sessions              StamSession[]
  communityMemberships  CommunityMember[]    // PLUSIEURS communautés possibles
  customers             Customer[]           // 1 Customer par produit acheté
  formationProgress     StamProgress[]

  @@map("stam_users")
}

enum UserType {
  CLIENT           // Utilisateur lambda
  AFFILIATE        // Affilié actif
  ADMIN            // Administrateur (gestion globale)
  PRODUCT_MANAGER  // Gestionnaire de produits
  OWNER            // Propriétaire (vous)

  @@map("user_type")
}

enum Platform {
  WEOKTO
  STAM

  @@map("platform")
}
```

#### 2. Communautés (Guildes WEOKTO + Communautés STAM)

```prisma
model Community {
  id              String   @id @default(cuid())

  // Type de plateforme
  platform        Platform // WEOKTO | STAM

  // Identification
  name            String
  slug            String   @unique
  description     String?

  // Média
  imageUrl        String?
  bannerUrl       String?

  // Configuration
  domain          String?  @unique
  settings        Json?    // Config chat, permissions, etc.

  // Marketplace (WEOKTO uniquement)
  supplierId      String?  // ID du faux fournisseur
  supplierName    String?  // Nom affiché ("Fournisseur A")

  // Landing page custom
  landingPageUrl  String?  // URL vers la LP codée à la main

  // Admin
  ownerNotes      String?  // Notes privées
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  products            Product[]
  channels            Channel[]
  channelCategories   ChannelCategory[]
  members             CommunityMember[]
  messages            Message[]
  formations          Formation[]

  @@index([platform])
  @@index([slug])
  @@map("communities")
}
```

#### 3. Produits (Tiers d'Accès)

```prisma
model Product {
  id              String   @id @default(cuid())
  communityId     String

  // Identification
  name            String   // "Tier Gratuit", "Tier Premium"
  slug            String
  description     String?

  // Position (ordre affichage)
  position        Int      @default(0)

  // Type
  isFree          Boolean  @default(false)
  accessType      String   @default("full") // "full" | "limited" | "trial"

  // Landing page
  landingPageUrl  String?

  // Features
  features        Json?    // ["Accès chat", "Formations", "Support"]

  isActive        Boolean  @default(true)
  metadata        Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  community         Community
  plans             Plan[]
  manualButtons     ManualPaymentButton[]
  accesses          ProductAccess[]
  members           CommunityMember[]

  // Affiliation (optionnel)
  affiliateProgram  AffiliateProgram?

  @@unique([communityId, slug])
  @@index([communityId])
  @@map("products")
}
```

#### 4. Plans (Pricing)

```prisma
model Plan {
  id                String    @id @default(cuid())
  productId         String

  name              String    // "Mensuel", "Annuel", "Lifetime"
  description       String?

  // Prix
  price             Int       // En centimes (4900 = 49€)
  currency          String    @default("EUR")

  // Récurrence
  billingInterval   String?   // "month" | "year" | null (one-time)
  billingCount      Int?      @default(1)

  // Trial
  trialDays         Int?
  trialAmount       Int?      // Prix du trial en centimes

  // Frais inscription
  registrationFee   Int?

  // Limites
  maxBillingCycles  Int?      // null = infini

  isActive          Boolean   @default(true)
  metadata          Json?

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  // Relations
  product           Product
  subscriptions     Subscription[]
  manualButtons     ManualPaymentButton[]

  @@index([productId])
  @@map("plans")
}
```

#### 5. Boutons de Paiement Manuels

```prisma
model ManualPaymentButton {
  id                    String   @id @default(cuid())
  productId             String
  planId                String

  // Identifiant unique
  buttonKey             String   @unique // "guild-marketing-premium-monthly"

  // Affichage
  displayName           String
  description           String?
  ctaText               String   @default("S'inscrire")

  // Type
  pcivaultPaymentType   String   // "subscription" | "one-time"

  // URLs
  successUrl            String?
  cancelUrl             String?

  isActive              Boolean  @default(true)
  metadata              Json?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  product               Product
  plan                  Plan

  @@index([buttonKey])
  @@map("manual_payment_buttons")
}
```

#### 6. Membres de Communautés

```prisma
model CommunityMember {
  id              String       @id @default(cuid())
  communityId     String
  platform        Platform

  // User selon plateforme
  weoktoUserId    String?
  stamUserId      String?

  // Info
  email           String       @db.Citext
  displayName     String?
  avatarUrl       String?

  role            MemberRole   @default(MEMBER)
  joinedAt        DateTime     @default(now())
  lastActiveAt    DateTime?
  isActive        Boolean      @default(true)

  // Paiement
  customerId      String?
  currentProductId String?      // Produit actuel (tier)

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  community       Community
  weoktoUser      WeoktoUser?
  stamUser        StamUser?
  customer        Customer?
  currentProduct  Product?
  messages        Message[]
  entitlements    Entitlement[]

  @@unique([communityId, weoktoUserId])
  @@unique([communityId, stamUserId])
  @@index([communityId])
  @@map("community_members")
}

enum MemberRole {
  MEMBER
  SUPPORT
  COACH
  MODERATOR
  ADMIN

  @@map("member_role")
}
```

#### 7. Channels & Messages (Chat)

```prisma
model ChannelCategory {
  id          BigInt   @id @default(autoincrement())
  communityId String
  name        String
  slug        String
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  createdBy   String

  community   Community
  channels    Channel[]

  @@unique([communityId, slug])
  @@map("channel_categories")
}

model Channel {
  id          BigInt    @id @default(autoincrement())
  communityId String
  categoryId  BigInt?
  name        String
  slug        String
  description String?
  isPrivate   Boolean   @default(false)
  position    Int       @default(0)
  createdAt   DateTime  @default(now())
  createdBy   String

  community   Community
  category    ChannelCategory?
  messages    Message[]

  @@unique([communityId, slug])
  @@index([communityId])
  @@map("channels")
}

model Message {
  id          BigInt    @id @default(autoincrement())
  channelId   BigInt
  communityId String
  memberId    String
  content     String    @db.Text
  replyToId   BigInt?
  editedAt    DateTime?
  deletedAt   DateTime?
  createdAt   DateTime  @default(now())

  channel     Channel
  community   Community
  member      CommunityMember
  replyTo     Message?  @relation("MessageReplies", fields: [replyToId], references: [id])
  replies     Message[] @relation("MessageReplies")
  reactions   MessageReaction[]

  @@index([channelId, createdAt(sort: Desc)])
  @@index([communityId])
  @@map("messages")
}

model MessageReaction {
  messageId BigInt
  memberId  String
  emoji     String
  createdAt DateTime @default(now())

  message   Message

  @@id([messageId, memberId, emoji])
  @@map("message_reactions")
}
```

#### 8. Formations

```prisma
model Formation {
  id              String    @id @default(cuid())
  communityId     String

  slug            String    @unique
  title           String
  subtitle        String?
  description     String?
  level           String?   // "beginner" | "intermediate" | "advanced"
  coverImageUrl   String?
  estimatedMinutes Int      @default(0)
  tags            String[]  @default([])

  isPublished     Boolean   @default(false)
  publishedAt     DateTime?

  metadata        Json?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  community       Community
  modules         FormationModule[]
  resources       FormationResource[]
  progressRecords StamProgress[]

  @@index([communityId])
  @@map("formations")
}

model FormationModule {
  id              String    @id @default(cuid())
  formationId     String
  moduleIndex     Int       // Ordre du module (1, 2, 3...)
  title           String
  synopsis        String?
  content         Json?     // Rich text content
  videoUrl        String?   // URL Bunny.net (iframe)
  durationSeconds Int       @default(0)
  metadata        Json?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  formation       Formation
  resources       FormationResource[]
  progress        StamProgress[]

  @@unique([formationId, moduleIndex])
  @@index([formationId])
  @@map("formation_modules")
}

model FormationResource {
  id          String           @id @default(cuid())
  formationId String
  moduleId    String?
  type        String           // "video" | "pdf" | "link"
  title       String?
  url         String?
  metadata    Json?

  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  formation   Formation
  module      FormationModule?

  @@index([formationId])
  @@map("formation_resources")
}

model StamProgress {
  id            String               @id @default(cuid())
  stamUserId    String
  formationId   String
  moduleId      String?
  moduleIndex   Int?
  status        StamProgressStatus   @default(IN_PROGRESS)
  timeSpent     Int                  @default(0) // En secondes
  completedAt   DateTime?
  metadata      Json?

  createdAt     DateTime             @default(now())
  updatedAt     DateTime             @updatedAt

  stamUser      StamUser
  formation     Formation
  module        FormationModule?

  @@unique([stamUserId, formationId, moduleIndex])
  @@index([formationId])
  @@map("stam_progress")
}

enum StamProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED

  @@map("stam_progress_status")
}
```

#### 9. Système de Paiements

```prisma
model Customer {
  id                      String          @id @default(cuid())
  platform                Platform

  // User
  weoktoUserId            String?
  stamUserId              String?

  email                   String          @db.Citext
  fullName                String?
  country                 String?

  status                  CustomerStatus  @default(ACTIVE)

  // PCI Vault
  pspCustomerId           String?
  defaultPaymentMethodId  String?         @unique

  metadata                Json?

  createdAt               DateTime        @default(now())
  updatedAt               DateTime        @updatedAt

  weoktoUser              WeoktoUser?
  stamUser                StamUser?
  paymentMethods          PaymentMethod[]
  subscriptions           Subscription[]
  invoices                Invoice[]

  @@unique([platform, weoktoUserId])
  @@unique([platform, stamUserId])
  @@map("customers")
}

model PaymentMethod {
  id                    String               @id @default(cuid())
  customerId            String

  // PCI Vault
  pcivaultToken         String
  pcivaultReference     String
  pcivaultCaptureUrl    String?
  pcivaultCaptureSecret String?

  // Info carte (partielle)
  brand                 String?
  last4                 String?
  expMonth              Int?
  expYear               Int?

  status                PaymentMethodStatus  @default(PENDING_VALIDATION)

  metadata              Json?

  createdAt             DateTime             @default(now())
  updatedAt             DateTime             @updatedAt

  customer              Customer
  subscriptions         Subscription[]

  @@map("payment_methods")
}

model Subscription {
  id                        String             @id @default(cuid())
  customerId                String
  planId                    String
  paymentMethodId           String?

  status                    SubscriptionStatus @default(ACTIVE)
  billingInterval           String
  nextBillingAt             DateTime?
  billingAnchor             DateTime?

  trialStartsAt             DateTime?
  trialEndsAt               DateTime?

  cancellationReason        String?

  metadata                  Json?

  createdAt                 DateTime           @default(now())
  updatedAt                 DateTime           @updatedAt

  customer                  Customer
  plan                      Plan
  paymentMethod             PaymentMethod?
  invoices                  Invoice[]
  entitlements              Entitlement[]

  @@index([customerId])
  @@index([nextBillingAt])
  @@map("subscriptions")
}

model Invoice {
  id                    String        @id @default(cuid())
  customerId            String
  subscriptionId        String?

  status                InvoiceStatus @default(DRAFT)
  currency              String        @default("EUR")

  subtotalAmount        Int
  discountAmount        Int           @default(0)
  taxAmount             Int           @default(0)
  amountExcludingTax    Int
  amountIncludingTax    Int

  dueAt                 DateTime?
  paidAt                DateTime?

  metadata              Json?

  createdAt             DateTime      @default(now())
  updatedAt             DateTime      @updatedAt

  customer              Customer
  subscription          Subscription?

  @@index([customerId])
  @@map("invoices")
}

enum CustomerStatus {
  ACTIVE
  INACTIVE
  BLOCKED

  @@map("customer_status")
}

enum PaymentMethodStatus {
  PENDING_VALIDATION
  ACTIVE
  EXPIRED
  FAILED

  @@map("payment_method_status")
}

enum SubscriptionStatus {
  ACTIVE
  PAST_DUE
  CANCELED
  TRIALING
  INCOMPLETE

  @@map("subscription_status")
}

enum InvoiceStatus {
  DRAFT
  PENDING
  PAID
  FAILED
  REFUNDED

  @@map("invoice_status")
}
```

#### 10. Système d'Affiliation

**Attribution Model** : **Last-Click** (le dernier cookie gagne)
**Cookie Duration** : 30 jours
**Lock Periods** : Progressifs selon ancienneté et profil de risque

```prisma
model WeoktoUser {
  // ... autres champs

  // Affiliation
  userType              UserType     @default(CLIENT)
  affiliateProfile      AffiliateProfile?

  // Tracking
  firstCommissionAt     DateTime?    // Première commission reçue
  totalRefunds          Int          @default(0)
  refundRate            Decimal      @default(0) @db.Decimal(5, 4) // 0.0000 à 1.0000
  riskLevel             AffiliateRiskLevel @default(NORMAL)

  affiliateCommissions  AffiliateCommission[]
}

model AffiliateProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique

  // Statistiques
  totalCommissionsEarned Int     @default(0)
  totalWithdrawn        Int      @default(0)
  totalRefunded         Int      @default(0)

  // Guild (obligatoire)
  currentGuildId        String?
  guildJoinedAt         DateTime?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  WeoktoUser @relation(fields: [userId], references: [id])

  @@map("affiliate_profiles")
}

enum AffiliateRiskLevel {
  NORMAL              // Compte normal
  AT_RISK             // Surveillance
  HIGH_RISK           // Risque élevé
  EXTREME_RISK        // Risque extrême (manuel)

  @@map("affiliate_risk_level")
}

model AffiliateProgram {
  id                      String    @id @default(cuid())
  productId               String    @unique

  isActive                Boolean   @default(false)

  // Taux
  defaultRateType         String    // "percentage" | "fixed"
  defaultRate             Decimal   @db.Decimal(10, 4)

  // Config
  cookieDurationDays      Int       @default(30)
  includeRenewals         Boolean   @default(true)

  // Lock periods ne sont plus ici (calculés dynamiquement)

  metadata                Json?

  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  product                 Product
  tiers                   AffiliateTier[]
  commissions             AffiliateCommission[]
  boostRules              AffiliateBoostRule[]

  @@map("affiliate_programs")
}

model AffiliateBoostRule {
  id                  String   @id @default(cuid())
  programId           String

  name                String
  description         String?

  // Condition
  requiredGuildId     String?  // Doit être membre de cette guilde
  requiredProductId   String?  // ... avec ce tier

  // Boost
  boostType           String   // "percentage_increase" | "flat_bonus"
  boostValue          Decimal  @db.Decimal(10, 4)

  isActive            Boolean  @default(true)

  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  program             AffiliateProgram

  @@map("affiliate_boost_rules")
}

model AffiliateTrackingEvent {
  id              String                 @id @default(cuid())

  clickId         String                 @unique
  affiliateId     String

  // Produit ciblé
  productId       String?
  platform        Platform?

  // Tracking
  campaign        String?
  source          String?
  medium          String?
  utm             Json?

  // Device/Browser Fingerprinting
  ip              String?
  userAgent       String?
  fingerprint     String?

  // Geographic
  country         String?
  city            String?

  expiresAt       DateTime?
  createdAt       DateTime               @default(now())

  affiliate       WeoktoUser
  attributions    AffiliateAttribution[]

  @@index([clickId])
  @@index([affiliateId])
  @@index([expiresAt])
  @@map("affiliate_tracking_events")
}

model AffiliateAttribution {
  id                       String                  @id @default(cuid())
  affiliateTrackingEventId String?
  customerId               String?
  productId                String
  affiliateId              String

  attributionModel         String                  @default("last-click")

  boundAt                  DateTime
  expiresAt                DateTime?

  // Si attribution remplacée par un nouveau click
  replacedAt               DateTime?
  replacedByEventId        String?

  metadata                 Json?

  createdAt                DateTime                @default(now())

  trackingEvent            AffiliateTrackingEvent?
  customer                 Customer?
  affiliate                WeoktoUser

  @@index([customerId, productId])
  @@index([affiliateId])
  @@map("affiliate_attributions")
}

model AffiliateCommission {
  id                   String                    @id @default(cuid())
  affiliateProgramId   String
  affiliateId          String
  customerId           String?
  invoiceId            String?

  status               AffiliateCommissionStatus @default(PENDING_LOCK)

  // Lock system progressif
  lockPeriodDays       Int                       // Calculé selon profil
  lockedUntil          DateTime
  maturesAt            DateTime                  // Date de maturité

  // Split amount system
  lockedAmount         Int                       // Montant bloqué (80-94%)
  extendedLockAmount   Int                       // Montant avec lock étendu (6-20%)
  extendedLockedUntil  DateTime?                 // Lock étendu pour la portion

  totalAmount          Int                       // lockedAmount + extendedLockAmount
  currency             String                    @default("EUR")

  // Rate details
  rateApplied          Decimal?                  @db.Decimal(10, 4)
  baseAmount           Int?

  // Metadata avec détails de calcul
  metadata             Json?     // { riskLevel, accountAge, splitRatio, boosts, etc }

  createdAt            DateTime  @default(now())
  updatedAt            DateTime  @updatedAt

  program              AffiliateProgram
  affiliate            WeoktoUser
  customer             Customer?

  @@index([affiliateId])
  @@index([status, lockedUntil])
  @@index([status, maturesAt])
  @@map("affiliate_commissions")
}

enum AffiliateCommissionStatus {
  PENDING_LOCK
  LOCKED
  MATURED             // Prêt à être retiré
  PAID
  CLAWED_BACK         // Remboursement client
  PARTIALLY_MATURED   // Une partie mature, l'autre non

  @@map("affiliate_commission_status")
}

model WithdrawalRequest {
  id              String           @id @default(cuid())
  affiliateId     String

  amount          Int
  currency        String           @default("EUR")

  status          WithdrawalStatus @default(PENDING_REVIEW)

  requestedAt     DateTime         @default(now())
  approvedAt      DateTime?
  paidAt          DateTime?

  payoutReference String?
  method          String?
  notes           String?

  metadata        Json?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  affiliate       WeoktoUser

  @@map("withdrawal_requests")
}

enum WithdrawalStatus {
  PENDING_REVIEW
  APPROVED
  PAID
  REJECTED
  CANCELLED

  @@map("withdrawal_status")
}
```

#### 11. Accès & Entitlements

```prisma
model ProductAccess {
  id              String   @id @default(cuid())
  productId       String

  accessType      String   // "community" | "formation" | "channel" | "module"
  targetId        String

  name            String
  description     String?

  metadata        Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  product         Product
  entitlements    Entitlement[]

  @@index([productId])
  @@map("product_accesses")
}

model Entitlement {
  id                String        @id @default(cuid())
  communityMemberId String
  productAccessId   String

  subscriptionId    String?
  invoiceId         String?

  activationSource  String?       // "payment" | "manual" | "trial"
  activatedAt       DateTime      @default(now())

  revokedAt         DateTime?
  revocationReason  String?

  metadata          Json?

  createdAt         DateTime      @default(now())
  updatedAt         DateTime      @updatedAt

  communityMember   CommunityMember
  productAccess     ProductAccess
  subscription      Subscription?

  @@index([communityMemberId])
  @@map("entitlements")
}
```

---

## 🤝 SYSTÈME D'AFFILIATION

### Vue d'Ensemble

**Attribution Model** : **Last-Click** (le dernier cookie/tracking event gagne)
**Cookie Duration** : 30 jours
**Guild Requirement** : Tous les affiliés DOIVENT être dans une guilde (minimum tier gratuit)

### Lock Periods Progressifs

Le système de lock est **dynamique** et calculé selon :
1. **Ancienneté du compte** (jours depuis première commission)
2. **Profil de risque** (taux de refund, comportement)

#### Tableau des Lock Periods

```typescript
// Configuration des lock periods
const LOCK_PERIODS = {
  // Comptes normaux (par ancienneté)
  NEW_ACCOUNT: {        // 0-30 jours
    name: 'Nouveau compte',
    mainLockDays: 45,
    mainPercentage: 80,
    extendedLockDays: 90,
    extendedPercentage: 20
  },
  RECENT_ACCOUNT: {     // 31-60 jours
    name: 'Compte récent',
    mainLockDays: 40,
    mainPercentage: 85,
    extendedLockDays: 60,
    extendedPercentage: 15
  },
  VALIDATED_ACCOUNT: {  // 61-90 jours
    name: 'Compte validé',
    mainLockDays: 35,
    mainPercentage: 90,
    extendedLockDays: 40,
    extendedPercentage: 10
  },
  TRUSTED_ACCOUNT: {    // 90+ jours
    name: 'Compte trusted',
    mainLockDays: 30,
    mainPercentage: 94,
    extendedLockDays: 40,
    extendedPercentage: 6
  },

  // Comptes à risque (override l'ancienneté)
  AT_RISK: {
    name: 'À risque',
    mainLockDays: 60,
    mainPercentage: 80,
    extendedLockDays: 90,
    extendedPercentage: 20
  },
  HIGH_RISK: {
    name: 'Risque élevé',
    mainLockDays: 90,
    mainPercentage: 70,
    extendedLockDays: 120,
    extendedPercentage: 30
  },
  EXTREME_RISK: {
    name: 'Risque extrême',
    mainLockDays: 90,
    mainPercentage: 60,
    extendedLockDays: 180,
    extendedPercentage: 40
  }
}
```

### Calcul du Profil Affilié

```typescript
// lib/affiliate/profile.ts

interface AffiliateLockProfile {
  accountAge: number // Jours depuis firstCommissionAt
  riskLevel: AffiliateRiskLevel
  lockConfig: LockConfig
}

interface LockConfig {
  name: string
  mainLockDays: number
  mainPercentage: number
  extendedLockDays: number
  extendedPercentage: number
}

export async function calculateAffiliateLockProfile(
  affiliateId: string
): Promise<AffiliateLockProfile> {
  const affiliate = await prisma.weoktoUser.findUnique({
    where: { id: affiliateId },
    include: { affiliateProfile: true }
  })

  if (!affiliate) {
    throw new Error('Affiliate not found')
  }

  // 1. Calculer ancienneté (jours depuis première commission)
  const accountAge = affiliate.firstCommissionAt
    ? daysSince(affiliate.firstCommissionAt)
    : 0

  // 2. Déterminer profil de risque
  const riskLevel = affiliate.riskLevel

  // 3. Choisir config de lock
  let lockConfig: LockConfig

  // Profils à risque overrident l'ancienneté
  if (riskLevel === 'EXTREME_RISK') {
    lockConfig = LOCK_PERIODS.EXTREME_RISK
  } else if (riskLevel === 'HIGH_RISK') {
    lockConfig = LOCK_PERIODS.HIGH_RISK
  } else if (riskLevel === 'AT_RISK') {
    lockConfig = LOCK_PERIODS.AT_RISK
  } else {
    // Profil normal : selon ancienneté
    if (accountAge <= 30) {
      lockConfig = LOCK_PERIODS.NEW_ACCOUNT
    } else if (accountAge <= 60) {
      lockConfig = LOCK_PERIODS.RECENT_ACCOUNT
    } else if (accountAge <= 90) {
      lockConfig = LOCK_PERIODS.VALIDATED_ACCOUNT
    } else {
      lockConfig = LOCK_PERIODS.TRUSTED_ACCOUNT
    }
  }

  return {
    accountAge,
    riskLevel,
    lockConfig
  }
}

function daysSince(date: Date): number {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}
```

### Création Commission avec Lock Progressif

```typescript
// lib/affiliate/commission.ts

export async function createAffiliateCommission(data: {
  affiliateId: string
  programId: string
  customerId: string
  invoiceId: string
  baseAmount: number // Montant avant commission rate
  rateApplied: number
}) {
  const { affiliateId, programId, baseAmount, rateApplied } = data

  // 1. Calculer profil de lock
  const profile = await calculateAffiliateLockProfile(affiliateId)

  // 2. Calculer montant total commission
  const totalAmount = Math.floor(baseAmount * rateApplied)

  // 3. Split selon les pourcentages
  const lockedAmount = Math.floor(
    totalAmount * (profile.lockConfig.mainPercentage / 100)
  )
  const extendedLockAmount = totalAmount - lockedAmount

  // 4. Calculer dates de maturité
  const now = new Date()
  const lockedUntil = addDays(now, profile.lockConfig.mainLockDays)
  const extendedLockedUntil = addDays(now, profile.lockConfig.extendedLockDays)

  // 5. Créer commission
  const commission = await prisma.affiliateCommission.create({
    data: {
      affiliateProgramId: programId,
      affiliateId,
      customerId: data.customerId,
      invoiceId: data.invoiceId,

      status: 'PENDING_LOCK',

      lockPeriodDays: profile.lockConfig.mainLockDays,
      lockedUntil,
      maturesAt: lockedUntil,

      lockedAmount,
      extendedLockAmount,
      extendedLockedUntil,

      totalAmount,
      currency: 'EUR',

      rateApplied,
      baseAmount,

      metadata: {
        accountAge: profile.accountAge,
        riskLevel: profile.riskLevel,
        lockProfile: profile.lockConfig.name,
        splitRatio: `${profile.lockConfig.mainPercentage}/${profile.lockConfig.extendedPercentage}`
      }
    }
  })

  // 6. Mettre à jour firstCommissionAt si première commission
  if (!affiliate.firstCommissionAt) {
    await prisma.weoktoUser.update({
      where: { id: affiliateId },
      data: { firstCommissionAt: now }
    })
  }

  return commission
}

function addDays(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() + days)
  return result
}
```

### Maturation des Commissions (CRON Job)

```typescript
// scripts/matureCommissions.ts

export async function matureCommissions() {
  const now = new Date()

  // 1. Trouver commissions qui atteignent la première maturité
  const commissionsToMature = await prisma.affiliateCommission.findMany({
    where: {
      status: 'LOCKED',
      maturesAt: { lte: now }
    }
  })

  for (const commission of commissionsToMature) {
    // Vérifier si la portion principale est mature
    if (commission.lockedUntil <= now) {
      // La portion principale est mature

      if (commission.extendedLockedUntil && commission.extendedLockedUntil > now) {
        // Il reste la portion extended lock
        await prisma.affiliateCommission.update({
          where: { id: commission.id },
          data: {
            status: 'PARTIALLY_MATURED',
            maturesAt: commission.extendedLockedUntil
          }
        })
      } else {
        // Tout est mature
        await prisma.affiliateCommission.update({
          where: { id: commission.id },
          data: {
            status: 'MATURED',
            maturesAt: now
          }
        })
      }
    }
  }

  // 2. Trouver commissions partiellement matures qui deviennent totalement matures
  const partiallyMatured = await prisma.affiliateCommission.findMany({
    where: {
      status: 'PARTIALLY_MATURED',
      extendedLockedUntil: { lte: now }
    }
  })

  for (const commission of partiallyMatured) {
    await prisma.affiliateCommission.update({
      where: { id: commission.id },
      data: {
        status: 'MATURED',
        maturesAt: now
      }
    })
  }

  console.log(`Matured ${commissionsToMature.length} commissions`)
}
```

### Calcul du Solde Disponible

```typescript
// lib/affiliate/balance.ts

export async function getAffiliateBalance(affiliateId: string) {
  const commissions = await prisma.affiliateCommission.findMany({
    where: { affiliateId }
  })

  const now = new Date()

  let available = 0        // Disponible maintenant
  let locked = 0          // Bloqué (pas mature)
  let partiallyLocked = 0 // Partiellement mature
  let paid = 0            // Déjà payé

  for (const c of commissions) {
    switch (c.status) {
      case 'MATURED':
        available += c.totalAmount
        break

      case 'PARTIALLY_MATURED':
        // La portion principale est disponible
        available += c.lockedAmount
        // La portion extended est toujours bloquée
        locked += c.extendedLockAmount
        break

      case 'LOCKED':
      case 'PENDING_LOCK':
        locked += c.totalAmount
        break

      case 'PAID':
        paid += c.totalAmount
        break

      case 'CLAWED_BACK':
        // Ne compte pas
        break
    }
  }

  return {
    available,
    locked,
    partiallyLocked,
    paid,
    total: available + locked + paid
  }
}
```

### Tracking Amélioré avec Last-Click

```typescript
// lib/affiliate/tracking.ts

export async function trackAffiliateClick(data: {
  affiliateId: string
  productId?: string
  campaign?: string
  source?: string
  medium?: string
  utm?: Record<string, string>
  ip?: string
  userAgent?: string
  fingerprint?: string
  country?: string
  city?: string
}) {
  const clickId = generateClickId()
  const expiresAt = addDays(new Date(), 30) // Cookie 30 jours

  // Créer tracking event
  const event = await prisma.affiliateTrackingEvent.create({
    data: {
      clickId,
      affiliateId: data.affiliateId,
      productId: data.productId,
      platform: 'STAM',
      campaign: data.campaign,
      source: data.source,
      medium: data.medium,
      utm: data.utm,
      ip: data.ip,
      userAgent: data.userAgent,
      fingerprint: data.fingerprint,
      country: data.country,
      city: data.city,
      expiresAt
    }
  })

  return {
    clickId,
    expiresAt
  }
}

export async function attributeAffiliateSale(data: {
  clickId: string
  customerId: string
  productId: string
  invoiceId: string
}) {
  // 1. Récupérer tracking event
  const event = await prisma.affiliateTrackingEvent.findUnique({
    where: { clickId: data.clickId }
  })

  if (!event) {
    throw new Error('Tracking event not found')
  }

  // 2. Vérifier expiration
  if (event.expiresAt && event.expiresAt < new Date()) {
    throw new Error('Tracking event expired')
  }

  // 3. Vérifier s'il existe déjà une attribution pour ce client/produit
  const existingAttribution = await prisma.affiliateAttribution.findFirst({
    where: {
      customerId: data.customerId,
      productId: data.productId,
      replacedAt: null // Pas remplacée
    }
  })

  // 4. Si attribution existante : LAST-CLICK = remplacer
  if (existingAttribution) {
    await prisma.affiliateAttribution.update({
      where: { id: existingAttribution.id },
      data: {
        replacedAt: new Date(),
        replacedByEventId: event.id
      }
    })
  }

  // 5. Créer nouvelle attribution
  const attribution = await prisma.affiliateAttribution.create({
    data: {
      affiliateTrackingEventId: event.id,
      customerId: data.customerId,
      productId: data.productId,
      affiliateId: event.affiliateId,
      attributionModel: 'last-click',
      boundAt: new Date(),
      expiresAt: event.expiresAt
    }
  })

  return attribution
}
```

### Gestion du Profil de Risque

```typescript
// lib/affiliate/risk.ts

export async function updateAffiliateRiskLevel(affiliateId: string) {
  const affiliate = await prisma.weoktoUser.findUnique({
    where: { id: affiliateId },
    include: {
      affiliateProfile: true,
      affiliateCommissions: {
        where: { status: { in: ['MATURED', 'PAID', 'CLAWED_BACK'] } }
      }
    }
  })

  if (!affiliate) return

  // Calculer taux de refund
  const totalCommissions = affiliate.affiliateCommissions.length
  const refundedCommissions = affiliate.affiliateCommissions.filter(
    c => c.status === 'CLAWED_BACK'
  ).length

  const refundRate = totalCommissions > 0
    ? refundedCommissions / totalCommissions
    : 0

  // Déterminer niveau de risque
  let riskLevel: AffiliateRiskLevel = 'NORMAL'

  if (refundRate >= 0.4) {
    riskLevel = 'EXTREME_RISK' // 40%+ refund
  } else if (refundRate >= 0.25) {
    riskLevel = 'HIGH_RISK' // 25%+ refund
  } else if (refundRate >= 0.15) {
    riskLevel = 'AT_RISK' // 15%+ refund
  }

  // Mettre à jour
  await prisma.weoktoUser.update({
    where: { id: affiliateId },
    data: {
      totalRefunds: refundedCommissions,
      refundRate,
      riskLevel
    }
  })

  return riskLevel
}

export async function handleRefund(data: {
  invoiceId: string
  customerId: string
}) {
  // 1. Trouver commission associée
  const commission = await prisma.affiliateCommission.findFirst({
    where: {
      invoiceId: data.invoiceId,
      customerId: data.customerId,
      status: { in: ['MATURED', 'PAID'] }
    }
  })

  if (!commission) return

  // 2. Clawback
  await prisma.affiliateCommission.update({
    where: { id: commission.id },
    data: { status: 'CLAWED_BACK' }
  })

  // 3. Mettre à jour profil de risque
  await updateAffiliateRiskLevel(commission.affiliateId)

  // 4. Si déjà payé, créer dette
  if (commission.status === 'PAID') {
    // Logique de récupération de fonds
    // (débit prochain withdrawal, etc.)
  }
}
```

### Système de Boost Codes (Codes Promo Affiliés)

**Principe** : Les affiliés peuvent entrer des **codes boost** pour augmenter leurs commissions sur certains ou tous les produits.

**Règles** :
- **Non cumulables** : 1 seul code actif à la fois par affilié
- 2 types de codes :
  - **Global** : Boost sur TOUS les produits
  - **Spécifique** : Boost sur produits ciblés uniquement
- Durée de validité configurable
- Usage limité par code (optionnel)

#### Schema Database

```prisma
model AffiliateBoostCode {
  id                String    @id @default(cuid())

  code              String    @unique // "BOOST20-ABC123"

  // Type et valeur
  boostType         String    // "percentage_increase" | "flat_bonus"
  boostValue        Decimal   @db.Decimal(10, 4)

  // Scope
  scope             BoostCodeScope @default(GLOBAL)
  targetProductIds  String[]  // Si scope = SPECIFIC

  // Validité
  validFrom         DateTime  @default(now())
  validUntil        DateTime?

  // Usage
  maxUses           Int?      // null = illimité
  currentUses       Int       @default(0)

  // Metadata
  description       String?
  metadata          Json?

  isActive          Boolean   @default(true)

  createdAt         DateTime  @default(now())
  createdBy         String?   // Owner ID

  // Relations
  redemptions       AffiliateBoostRedemption[]

  @@index([code])
  @@index([scope])
  @@map("affiliate_boost_codes")
}

enum BoostCodeScope {
  GLOBAL      // Sur tous les produits
  SPECIFIC    // Sur produits spécifiques

  @@map("boost_code_scope")
}

model AffiliateBoostRedemption {
  id              String              @id @default(cuid())

  codeId          String
  affiliateId     String

  // Status
  status          BoostRedemptionStatus @default(ACTIVE)

  redeemedAt      DateTime            @default(now())
  expiresAt       DateTime?
  deactivatedAt   DateTime?

  // Stats
  commissionsEarned Int               @default(0)
  salesCount        Int               @default(0)

  metadata        Json?

  code            AffiliateBoostCode  @relation(fields: [codeId], references: [id])
  affiliate       WeoktoUser          @relation(fields: [affiliateId], references: [id])

  @@unique([affiliateId, status]) // 1 seul code ACTIVE par affilié
  @@index([affiliateId])
  @@index([codeId])
  @@map("affiliate_boost_redemptions")
}

enum BoostRedemptionStatus {
  ACTIVE
  EXPIRED
  DEACTIVATED

  @@map("boost_redemption_status")
}
```

#### Génération Codes (Dashboard Owner)

```typescript
// app/api/owner/boost-codes/generate/route.ts

export async function POST(request: Request) {
  const {
    quantity,          // Nombre de codes à générer
    boostType,         // "percentage_increase" | "flat_bonus"
    boostValue,        // Ex: 5 (5% ou 5€)
    scope,             // "GLOBAL" | "SPECIFIC"
    targetProductIds,  // Si SPECIFIC
    validFrom,
    validUntil,
    maxUses,
    description
  } = await request.json()

  const codes: string[] = []

  for (let i = 0; i < quantity; i++) {
    const code = generateBoostCode() // Ex: "BOOST20-XY7K9M"

    await prisma.affiliateBoostCode.create({
      data: {
        code,
        boostType,
        boostValue,
        scope,
        targetProductIds: scope === 'SPECIFIC' ? targetProductIds : [],
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validUntil: validUntil ? new Date(validUntil) : null,
        maxUses,
        description,
        createdBy: 'owner'
      }
    })

    codes.push(code)
  }

  return NextResponse.json({
    success: true,
    codes,
    quantity: codes.length
  })
}

function generateBoostCode(): string {
  const prefix = 'BOOST'
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${random}`
}
```

#### Interface Owner - Générateur

```typescript
// app/owner/boost-codes/generate/page.tsx

export default function GenerateBoostCodesPage() {
  const [config, setConfig] = useState({
    quantity: 10,
    boostType: 'percentage_increase',
    boostValue: 5,
    scope: 'GLOBAL',
    targetProductIds: [],
    validUntil: null,
    maxUses: null,
    description: ''
  })

  const handleGenerate = async () => {
    const response = await fetch('/api/owner/boost-codes/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })

    const { codes } = await response.json()
    // Afficher codes générés
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <h2>Générer Codes Boost</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Quantité */}
            <div>
              <Label>Nombre de codes</Label>
              <Input
                type="number"
                value={config.quantity}
                onChange={(e) => setConfig({ ...config, quantity: parseInt(e.target.value) })}
              />
            </div>

            {/* Type de boost */}
            <div>
              <Label>Type de boost</Label>
              <Select
                value={config.boostType}
                onValueChange={(v) => setConfig({ ...config, boostType: v })}
              >
                <SelectItem value="percentage_increase">Pourcentage (+%)</SelectItem>
                <SelectItem value="flat_bonus">Montant fixe (+€)</SelectItem>
              </Select>
            </div>

            {/* Valeur */}
            <div>
              <Label>Valeur du boost</Label>
              <Input
                type="number"
                value={config.boostValue}
                onChange={(e) => setConfig({ ...config, boostValue: parseFloat(e.target.value) })}
              />
              <p className="text-sm text-muted">
                {config.boostType === 'percentage_increase'
                  ? `+${config.boostValue}% de commission`
                  : `+${config.boostValue}€ par vente`
                }
              </p>
            </div>

            {/* Scope */}
            <div>
              <Label>Applicabilité</Label>
              <RadioGroup
                value={config.scope}
                onValueChange={(v) => setConfig({ ...config, scope: v })}
              >
                <RadioGroupItem value="GLOBAL">
                  Tous les produits
                </RadioGroupItem>
                <RadioGroupItem value="SPECIFIC">
                  Produits spécifiques
                </RadioGroupItem>
              </RadioGroup>
            </div>

            {config.scope === 'SPECIFIC' && (
              <div>
                <Label>Produits ciblés</Label>
                <MultiSelect
                  options={products}
                  value={config.targetProductIds}
                  onChange={(ids) => setConfig({ ...config, targetProductIds: ids })}
                />
              </div>
            )}

            {/* Validité */}
            <div>
              <Label>Date d'expiration (optionnel)</Label>
              <DatePicker
                value={config.validUntil}
                onChange={(date) => setConfig({ ...config, validUntil: date })}
              />
            </div>

            {/* Usage max */}
            <div>
              <Label>Utilisations max par code (optionnel)</Label>
              <Input
                type="number"
                placeholder="Illimité"
                value={config.maxUses || ''}
                onChange={(e) => setConfig({ ...config, maxUses: e.target.value ? parseInt(e.target.value) : null })}
              />
            </div>

            {/* Description */}
            <div>
              <Label>Description interne</Label>
              <Textarea
                placeholder="Ex: Campagne Black Friday 2025"
                value={config.description}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
              />
            </div>

            <Button onClick={handleGenerate}>
              Générer {config.quantity} codes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

#### Utilisation Code (Affilié)

```typescript
// POST /api/affiliate/boost-codes/redeem

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id')
  const { code } = await request.json()

  // 1. Vérifier si code existe
  const boostCode = await prisma.affiliateBoostCode.findUnique({
    where: { code: code.toUpperCase() }
  })

  if (!boostCode || !boostCode.isActive) {
    return NextResponse.json(
      { error: 'Code invalide ou expiré' },
      { status: 400 }
    )
  }

  // 2. Vérifier validité
  const now = new Date()
  if (boostCode.validFrom > now) {
    return NextResponse.json(
      { error: 'Code pas encore actif' },
      { status: 400 }
    )
  }

  if (boostCode.validUntil && boostCode.validUntil < now) {
    return NextResponse.json(
      { error: 'Code expiré' },
      { status: 400 }
    )
  }

  // 3. Vérifier usage max
  if (boostCode.maxUses && boostCode.currentUses >= boostCode.maxUses) {
    return NextResponse.json(
      { error: 'Code épuisé' },
      { status: 400 }
    )
  }

  // 4. Vérifier si affilié a déjà un code actif
  const existingRedemption = await prisma.affiliateBoostRedemption.findFirst({
    where: {
      affiliateId: userId,
      status: 'ACTIVE'
    }
  })

  if (existingRedemption) {
    return NextResponse.json(
      { error: 'Vous avez déjà un code boost actif. Désactivez-le avant d\'en activer un nouveau.' },
      { status: 400 }
    )
  }

  // 5. Créer redemption
  const redemption = await prisma.affiliateBoostRedemption.create({
    data: {
      codeId: boostCode.id,
      affiliateId: userId,
      status: 'ACTIVE',
      expiresAt: boostCode.validUntil
    }
  })

  // 6. Incrémenter usage
  await prisma.affiliateBoostCode.update({
    where: { id: boostCode.id },
    data: {
      currentUses: { increment: 1 }
    }
  })

  return NextResponse.json({
    success: true,
    redemption,
    boost: {
      type: boostCode.boostType,
      value: boostCode.boostValue,
      scope: boostCode.scope
    }
  })
}
```

#### Calcul Commission avec Boost

```typescript
// lib/affiliate/commission.ts (MODIFIÉ)

export async function createAffiliateCommission(data: {
  affiliateId: string
  programId: string
  customerId: string
  invoiceId: string
  baseAmount: number
  rateApplied: number
}) {
  // ... (calcul profil de lock existant)

  // NOUVEAU: Vérifier boost code actif
  const activeBoost = await prisma.affiliateBoostRedemption.findFirst({
    where: {
      affiliateId: data.affiliateId,
      status: 'ACTIVE',
      expiresAt: { gte: new Date() }
    },
    include: { code: true }
  })

  let finalRate = data.rateApplied
  let boostApplied = false

  if (activeBoost) {
    const code = activeBoost.code

    // Vérifier si le boost s'applique à ce produit
    const program = await prisma.affiliateProgram.findUnique({
      where: { id: data.programId }
    })

    const boostApplies =
      code.scope === 'GLOBAL' ||
      (code.scope === 'SPECIFIC' && code.targetProductIds.includes(program.productId))

    if (boostApplies) {
      if (code.boostType === 'percentage_increase') {
        // Ex: 20% base + 5% boost = 25%
        finalRate = data.rateApplied + (parseFloat(code.boostValue.toString()) / 100)
      }
      // Note: flat_bonus serait ajouté après calcul du montant

      boostApplied = true
    }
  }

  // Calculer montant avec rate finale
  let totalAmount = Math.floor(data.baseAmount * finalRate)

  // Appliquer flat bonus si applicable
  if (activeBoost && activeBoost.code.boostType === 'flat_bonus' && boostApplied) {
    totalAmount += Math.floor(parseFloat(activeBoost.code.boostValue.toString()) * 100)
  }

  // Split selon profil
  const lockedAmount = Math.floor(totalAmount * (profile.lockConfig.mainPercentage / 100))
  const extendedLockAmount = totalAmount - lockedAmount

  // Créer commission
  const commission = await prisma.affiliateCommission.create({
    data: {
      // ... (champs existants)
      totalAmount,
      rateApplied: finalRate,
      baseAmount: data.baseAmount,
      metadata: {
        accountAge: profile.accountAge,
        riskLevel: profile.riskLevel,
        lockProfile: profile.lockConfig.name,
        splitRatio: `${profile.lockConfig.mainPercentage}/${profile.lockConfig.extendedPercentage}`,
        boostCode: boostApplied ? {
          code: activeBoost.code.code,
          type: activeBoost.code.boostType,
          value: activeBoost.code.boostValue,
          originalRate: data.rateApplied,
          boostedRate: finalRate
        } : null
      }
    }
  })

  // Mettre à jour stats redemption
  if (boostApplied) {
    await prisma.affiliateBoostRedemption.update({
      where: { id: activeBoost.id },
      data: {
        commissionsEarned: { increment: totalAmount },
        salesCount: { increment: 1 }
      }
    })
  }

  return commission
}
```

#### Interface Affilié - Boost Codes

```typescript
// app/affiliate/boost-codes/page.tsx

export default function BoostCodesPage() {
  const { activeBoost, history } = useBoostCodes()
  const [code, setCode] = useState('')

  const handleRedeem = async () => {
    await fetch('/api/affiliate/boost-codes/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
  }

  const handleDeactivate = async () => {
    await fetch('/api/affiliate/boost-codes/deactivate', {
      method: 'POST'
    })
  }

  return (
    <div className="space-y-6">
      {/* Code actif */}
      {activeBoost ? (
        <Card className="border-violet-500 bg-violet-500/5">
          <CardHeader>
            <h3>🚀 Code Boost Actif</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{activeBoost.code.code}</p>
              <p>
                {activeBoost.code.boostType === 'percentage_increase'
                  ? `+${activeBoost.code.boostValue}% de commission`
                  : `+${activeBoost.code.boostValue}€ par vente`
                }
              </p>
              <p className="text-sm text-muted">
                {activeBoost.code.scope === 'GLOBAL'
                  ? 'Sur tous les produits'
                  : `Sur ${activeBoost.code.targetProductIds.length} produits`
                }
              </p>
              {activeBoost.expiresAt && (
                <p className="text-sm text-muted">
                  Expire le {formatDate(activeBoost.expiresAt)}
                </p>
              )}

              <div className="pt-4">
                <p className="text-sm">Avec ce code :</p>
                <p>{activeBoost.salesCount} ventes</p>
                <p>{formatCurrency(activeBoost.commissionsEarned)} gagnés</p>
              </div>

              <Button variant="destructive" onClick={handleDeactivate}>
                Désactiver le code
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <h3>Activer un Code Boost</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Entrez votre code (ex: BOOST-XY7K9M)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
              />
              <Button onClick={handleRedeem} disabled={!code}>
                Activer
              </Button>

              <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertDescription>
                  Un seul code boost peut être actif à la fois. Il s'appliquera automatiquement à toutes vos ventes éligibles.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Historique */}
      <Card>
        <CardHeader>
          <h3>Historique</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Boost</TableHead>
                <TableHead>Ventes</TableHead>
                <TableHead>Gagné</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map(h => (
                <TableRow key={h.id}>
                  <TableCell>{h.code.code}</TableCell>
                  <TableCell>
                    {h.code.boostType === 'percentage_increase'
                      ? `+${h.code.boostValue}%`
                      : `+${h.code.boostValue}€`
                    }
                  </TableCell>
                  <TableCell>{h.salesCount}</TableCell>
                  <TableCell>{formatCurrency(h.commissionsEarned)}</TableCell>
                  <TableCell>
                    <StatusBadge status={h.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

### Affiliation sur Produits Gratuits

**Principe Important** : Les affiliés peuvent amener des clients vers des tiers/produits **gratuits** et être **liés à ce client** pour tracker les futures conversions (upsells).

#### Pourquoi c'est Important

```
┌─────────────────────────────────────────────────────────┐
│ SCÉNARIO TYPIQUE                                         │
├─────────────────────────────────────────────────────────┤
│ 1. Affilié promeut "Communauté Marketing" (tier gratuit)│
│ 2. Client rejoint via lien affilié                      │
│ 3. Pas de commission (tier gratuit)                     │
│ 4. MAIS: Attribution enregistrée                        │
│ 5. 2 semaines plus tard: Client upgrade vers Premium    │
│ 6. Affilié reçoit commission sur l'upgrade              │
└─────────────────────────────────────────────────────────┘
```

#### Schema Database Extension

```prisma
model AffiliateAttribution {
  id                       String                  @id @default(cuid())
  affiliateTrackingEventId String?
  customerId               String?
  productId                String
  affiliateId              String

  attributionModel         String                  @default("last-click")

  // Attribution sur produit gratuit
  isFreeProductAttribution Boolean                 @default(false)
  attributionExpiresAt     DateTime?               // Expiration pour tier gratuit

  boundAt                  DateTime
  expiresAt                DateTime?

  // Si attribution remplacée par un nouveau click
  replacedAt               DateTime?
  replacedByEventId        String?

  metadata                 Json?

  createdAt                DateTime                @default(now())

  trackingEvent            AffiliateTrackingEvent?
  customer                 Customer?
  affiliate                WeoktoUser

  @@index([customerId, productId])
  @@index([affiliateId])
  @@index([attributionExpiresAt])
  @@map("affiliate_attributions")
}
```

#### Configuration Attribution Gratuite

```typescript
// lib/affiliate/freeProductAttribution.ts

// Durées d'attribution pour produits gratuits (en jours)
const FREE_PRODUCT_ATTRIBUTION_PERIODS = {
  NEW_ACCOUNT: 60,      // Nouveau compte : 60 jours
  RECENT_ACCOUNT: 45,   // Compte récent : 45 jours
  VALIDATED_ACCOUNT: 30, // Compte validé : 30 jours
  TRUSTED_ACCOUNT: 30    // Compte trusted : 30 jours (stable)
}

export async function attributeFreeProductSignup(data: {
  clickId: string
  customerId: string
  productId: string
  affiliateId: string
}) {
  // 1. Calculer profil affilié
  const profile = await calculateAffiliateLockProfile(data.affiliateId)

  // 2. Déterminer durée attribution
  let attributionDays: number
  const accountAge = profile.accountAge

  if (accountAge <= 30) {
    attributionDays = FREE_PRODUCT_ATTRIBUTION_PERIODS.NEW_ACCOUNT
  } else if (accountAge <= 60) {
    attributionDays = FREE_PRODUCT_ATTRIBUTION_PERIODS.RECENT_ACCOUNT
  } else if (accountAge <= 90) {
    attributionDays = FREE_PRODUCT_ATTRIBUTION_PERIODS.VALIDATED_ACCOUNT
  } else {
    attributionDays = FREE_PRODUCT_ATTRIBUTION_PERIODS.TRUSTED_ACCOUNT
  }

  // 3. Calculer date expiration
  const attributionExpiresAt = addDays(new Date(), attributionDays)

  // 4. Créer attribution
  const attribution = await prisma.affiliateAttribution.create({
    data: {
      affiliateTrackingEventId: data.clickId,
      customerId: data.customerId,
      productId: data.productId,
      affiliateId: data.affiliateId,
      attributionModel: 'last-click',
      isFreeProductAttribution: true,
      attributionExpiresAt,
      boundAt: new Date(),
      metadata: {
        accountAge: profile.accountAge,
        attributionDays
      }
    }
  })

  return attribution
}
```

#### Flow Complet avec Produit Gratuit

```typescript
// lib/affiliate/freeProductFlow.ts

export async function handleFreeProductSignup(data: {
  clickId: string
  customerId: string
  productId: string
  communityId: string
}) {
  // 1. Récupérer tracking event
  const event = await prisma.affiliateTrackingEvent.findUnique({
    where: { clickId: data.clickId }
  })

  if (!event) {
    throw new Error('Tracking event not found')
  }

  // 2. Vérifier que le produit est gratuit
  const product = await prisma.product.findUnique({
    where: { id: data.productId }
  })

  if (!product.isFree) {
    throw new Error('Product is not free')
  }

  // 3. Créer attribution gratuite
  const attribution = await attributeFreeProductSignup({
    clickId: data.clickId,
    customerId: data.customerId,
    productId: data.productId,
    affiliateId: event.affiliateId
  })

  // 4. Pas de commission créée (produit gratuit)
  // Mais l'attribution existe pour les futurs upgrades

  return {
    attribution,
    message: 'Free product attribution created. Affiliate will receive commission on future upgrades.'
  }
}

// Quand le client upgrade vers un tier payant
export async function handleUpgradeFromFreeProduct(data: {
  customerId: string
  fromProductId: string  // Tier gratuit
  toProductId: string    // Tier payant
  invoiceId: string
  baseAmount: number
}) {
  const now = new Date()

  // 1. Chercher attribution valide pour le produit gratuit
  const attribution = await prisma.affiliateAttribution.findFirst({
    where: {
      customerId: data.customerId,
      productId: data.fromProductId,
      isFreeProductAttribution: true,
      attributionExpiresAt: { gte: now }, // Pas expirée
      replacedAt: null
    }
  })

  if (!attribution) {
    // Pas d'attribution valide = pas de commission
    return null
  }

  // 2. Récupérer programme d'affiliation du nouveau produit
  const program = await prisma.affiliateProgram.findFirst({
    where: {
      productId: data.toProductId,
      isActive: true
    }
  })

  if (!program) {
    return null
  }

  // 3. Créer commission pour l'upgrade
  const commission = await createAffiliateCommission({
    affiliateId: attribution.affiliateId,
    programId: program.id,
    customerId: data.customerId,
    invoiceId: data.invoiceId,
    baseAmount: data.baseAmount,
    rateApplied: parseFloat(program.defaultRate.toString())
  })

  // 4. Mettre à jour l'attribution pour le nouveau produit
  await prisma.affiliateAttribution.update({
    where: { id: attribution.id },
    data: {
      productId: data.toProductId,
      isFreeProductAttribution: false, // Plus un tier gratuit
      metadata: {
        ...attribution.metadata,
        upgradedAt: now,
        fromProductId: data.fromProductId
      }
    }
  })

  return commission
}
```

#### Nettoyage des Attributions Expirées (CRON)

```typescript
// scripts/cleanExpiredFreeAttributions.ts

export async function cleanExpiredFreeAttributions() {
  const now = new Date()

  // Marquer les attributions gratuites expirées
  const result = await prisma.affiliateAttribution.updateMany({
    where: {
      isFreeProductAttribution: true,
      attributionExpiresAt: { lt: now },
      replacedAt: null // Pas déjà remplacées
    },
    data: {
      replacedAt: now,
      metadata: {
        reason: 'expired_free_attribution'
      }
    }
  })

  console.log(`Cleaned ${result.count} expired free product attributions`)
}
```

#### Dashboard Affilié - Tracking Produits Gratuits

```typescript
// app/api/affiliate/dashboard/route.ts

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')

  // Statistiques produits gratuits
  const freeAttributions = await prisma.affiliateAttribution.findMany({
    where: {
      affiliateId: userId,
      isFreeProductAttribution: true,
      attributionExpiresAt: { gte: new Date() }
    },
    include: {
      customer: true,
      product: true
    }
  })

  // Conversions depuis produits gratuits
  const conversionsFromFree = await prisma.affiliateCommission.findMany({
    where: {
      affiliateId: userId,
      metadata: {
        path: ['fromProductId'],
        not: null // A un fromProductId = conversion depuis gratuit
      }
    }
  })

  return NextResponse.json({
    freeAttributions: {
      active: freeAttributions.length,
      details: freeAttributions.map(attr => ({
        customerId: attr.customerId,
        productName: attr.product.name,
        expiresAt: attr.attributionExpiresAt,
        daysRemaining: daysBetween(new Date(), attr.attributionExpiresAt)
      }))
    },
    conversionsFromFree: {
      total: conversionsFromFree.length,
      totalAmount: conversionsFromFree.reduce((sum, c) => sum + c.totalAmount, 0)
    }
  })
}
```

### Dashboard Affilié Avancé

> **📊 DASHBOARD AVANCÉ COMPLET**
>
> Le dashboard affilié avec toutes les métriques avancées se trouve dans : **[DASHBOARD_AFFILIE_AVANCE.md](DASHBOARD_AFFILIE_AVANCE.md)**
>
> Ce document contient :
> - **MRR (Monthly Recurring Revenue)** : Calcul basé sur les commissions actives avec normalisation mensuelle
> - **Clients Gratuits** : Tracking avec dates d'expiration et alertes
> - **Essais Gratuits** : Suivi des trials avec taux de conversion et likelihood scoring
> - **Churn** : Métriques d'annulation avec lifetime value et raisons
> - **Cookies** : Tracking actif avec alertes d'expiration et taux de conversion
> - **Taux de Conversion** : Par source, produit, pays, et device
> - **Interface Dashboard** : Composants React et API routes complètes
> - **CRON Jobs** : Mises à jour automatiques des métriques
>
> **Métriques Clés** :
> ```typescript
> interface AffiliateDashboard {
>   mrr: {
>     current: number              // MRR actuel
>     projected: number            // MRR projeté (3 mois)
>     growth: number               // Croissance MoM %
>     byProduct: Record<string, number>
>   }
>   freeClients: {
>     totalActive: number          // Nombre total
>     expiringThisWeek: number     // Expirent dans 7j
>     expiringThisMonth: number    // Expirent dans 30j
>     conversionRate: number       // % convertis en payants
>   }
>   cookies: {
>     totalActive: number          // Cookies actifs
>     expiringToday: number        // Expirent aujourd'hui
>     expiringThisWeek: number     // Expirent dans 7j
>     conversionRate: number       // % convertis
>   }
>   conversions: {
>     bySource: Record<string, ConversionMetric>
>     byProduct: Record<string, ConversionMetric>
>     byCountry: Record<string, ConversionMetric>
>   }
> }
> ```

---

## 🔐 SYSTÈME D'AUTHENTIFICATION

### Architecture

**Système basé sur JWT avec Magic Links (passwordless)**

```
┌──────────────────────────────────────────────────────────┐
│ 1. USER ENTRE EMAIL                                      │
│    → POST /api/auth/magic-link/send                     │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 2. SERVEUR                                               │
│    • Crée MagicLink en DB (tokenHash + otpCode)         │
│    • Envoie email via Resend                            │
│    • Email contient:                                     │
│      - Lien magic: /verify?token=xxx                    │
│      - Code OTP: 123456                                 │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 3. USER CLIQUE LIEN OU ENTRE OTP                        │
│    → POST /api/auth/magic-link/verify                   │
│    → POST /api/auth/magic-link/verify-otp              │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 4. SERVEUR VÉRIFIE & CRÉE SESSION                       │
│    • Vérifie token/OTP valide et non expiré            │
│    • Crée/Récupère User (WeoktoUser ou StamUser)       │
│    • Génère JWT avec:                                   │
│      - userId                                            │
│      - userType                                          │
│      - platform                                          │
│    • Set cookie HTTP-only                               │
│    • Crée Session en DB                                 │
└──────────────────────────────────────────────────────────┘
                          │
                          ▼
┌──────────────────────────────────────────────────────────┐
│ 5. USER AUTHENTIFIÉ                                      │
│    • Cookie envoyé automatiquement                      │
│    • Middleware vérifie JWT                             │
│    • Accès aux routes protégées                         │
└──────────────────────────────────────────────────────────┘
```

### Configuration (lib/auth/config.ts)

```typescript
// JWT Secrets (différents pour WEOKTO et STAM)
export const JWT_SECRET = resolveJWTSecret('JWT_SECRET', {
  label: 'Weokto JWT secret',
  devFallback: 'dev-only-weokto-secret-min-32-chars-long!!'
})

export const STAM_JWT_SECRET = resolveJWTSecret('STAM_JWT_SECRET', {
  label: 'STAM JWT secret',
  devFallback: 'dev-only-stam-secret-min-32-chars-long!!'
})

// Session Config
export const SESSION_CONFIG = {
  maxAge: 45 * 24 * 60 * 60, // 45 jours
  cookieName: 'weokto-session',
  domain: '.weokto.com', // Partagé sur tous sous-domaines
  secure: true, // HTTPS uniquement
  httpOnly: true, // Pas accessible en JS
  sameSite: 'lax'
}

export const STAM_SESSION_CONFIG = {
  maxAge: 45 * 24 * 60 * 60,
  cookieName: 'stam-session',
  domain: undefined, // Pas de sous-domaines
  secure: true,
  httpOnly: true,
  sameSite: 'lax'
}

// Rate Limiting
export const RATE_LIMIT_CONFIG = {
  magicLinkSend: {
    maxAttempts: 2,
    windowMs: 3600000, // 1 heure
  },
  magicLinkVerify: {
    maxAttempts: 6,
    windowMs: 3600000,
  }
}
```

### Structure JWT Payload

```typescript
interface JWTPayload {
  userId: string           // ID du WeoktoUser ou StamUser
  email: string
  userType: UserType       // CLIENT | AFFILIATE | WEOWNER
  platform: Platform       // WEOKTO | STAM
  sessionId: string        // ID de la Session en DB
  iat: number             // Issued at
  exp: number             // Expiration
  kid: string             // Key ID
}
```

### Middleware d'Authentification

Le middleware vérifie automatiquement les sessions sur chaque requête.

```typescript
// middleware.ts
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const host = normalizeHost(request.headers.get('host'))

  // Déterminer la plateforme
  const isStam = isStamHost(host)

  if (isStam) {
    return handleStamRequest(request, path)
  }

  // WEOKTO
  const sessionCookie = request.cookies.get(SESSION_CONFIG.cookieName)

  if (sessionCookie?.value) {
    const validation = await validateSession(sessionCookie.value)

    if (validation.valid) {
      // Ajouter userId dans headers pour API routes
      const headers = new Headers(request.headers)
      headers.set('x-user-id', validation.userId)
      headers.set('x-user-type', validation.userType)

      return NextResponse.next({ request: { headers } })
    }
  }

  // Routes protégées → redirect login
  if (isProtectedRoute(path)) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}
```

### Récupérer l'Utilisateur Actuel (API Route)

```typescript
// Dans une API route
import { headers } from 'next/headers'

export async function GET() {
  const headersList = headers()
  const userId = headersList.get('x-user-id')
  const userType = headersList.get('x-user-type')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await prisma.weoktoUser.findUnique({
    where: { id: userId }
  })

  return NextResponse.json({ user })
}
```

### Sessions en Base de Données

```prisma
model WeoktoSession {
  id        String     @id @default(cuid())
  userId    String
  token     String     @unique // Hash du JWT
  ipAddress String?
  userAgent String?
  createdAt DateTime   @default(now())
  expiresAt DateTime
  revokedAt DateTime?

  user      WeoktoUser @relation(fields: [userId], references: [id])

  @@index([token])
  @@index([userId])
  @@map("weokto_sessions")
}

model StamSession {
  id        String    @id @default(cuid())
  userId    String
  token     String    @unique
  ipAddress String?
  userAgent String?
  createdAt DateTime  @default(now())
  expiresAt DateTime
  revokedAt DateTime?

  user      StamUser @relation(fields: [userId], references: [id])

  @@index([token])
  @@index([userId])
  @@map("stam_sessions")
}
```

### Logout

```typescript
// POST /api/auth/logout
export async function POST(request: Request) {
  const sessionCookie = cookies().get(SESSION_CONFIG.cookieName)

  if (sessionCookie) {
    // Révoquer session en DB
    await prisma.weoktoSession.updateMany({
      where: { token: hashToken(sessionCookie.value) },
      data: { revokedAt: new Date() }
    })
  }

  // Supprimer cookie
  cookies().delete(SESSION_CONFIG.cookieName)

  return NextResponse.json({ success: true })
}
```

---

## 💬 SYSTÈME DE CHAT (SOCKET.IO)

### Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                     │
│                                                          │
│  import { io } from 'socket.io-client'                  │
│  const socket = io(SOCKET_URL, { auth: { token } })    │
└─────────────────────────────────────────────────────────┘
                          │
                          │ WebSocket
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  SOCKET.IO SERVER                        │
│              (services/socket/src/)                      │
│                                                          │
│  • Authentification JWT                                 │
│  • Rooms (1 room = 1 channel)                          │
│  • Redis Adapter (multi-instance)                       │
│  • Events: message, reaction, typing, presence          │
└─────────────────────────────────────────────────────────┘
                          │
         ┌────────────────┼────────────────┐
         ▼                ▼                ▼
   ┌──────────┐    ┌──────────┐    ┌──────────┐
   │ Instance │    │ Instance │    │ Instance │
   │    1     │    │    2     │    │    3     │
   └──────────┘    └──────────┘    └──────────┘
         │                │                │
         └────────────────┴────────────────┘
                          │
                          ▼
                    ┌──────────┐
                    │  REDIS   │
                    │ (Pub/Sub)│
                    └──────────┘
```

### Configuration Serveur (services/socket/src/index.ts)

```typescript
import { Server } from 'socket.io'
import { createAdapter } from '@socket.io/redis-adapter'
import { pubClient, subClient } from './redis'

export async function bootstrap() {
  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.SOCKET_ALLOWED_ORIGINS?.split(',')
    }
  })

  // Redis adapter pour scale horizontal
  io.adapter(createAdapter(pubClient, subClient))

  // Enregistrer les handlers
  registerSocketHandlers(io)

  httpServer.listen(process.env.PORT || 3001)
}
```

### Authentification Socket

```typescript
// services/socket/src/auth.ts
import { jwtVerify } from 'jose'

export async function authenticateSocket(socket: Socket) {
  const token = socket.handshake.auth.token

  if (!token) {
    throw new Error('No auth token')
  }

  // Vérifier JWT
  const { payload } = await jwtVerify(token, JWT_SECRET)

  return {
    userId: payload.userId as string,
    platform: payload.platform as Platform
  }
}
```

### Handlers d'Events

```typescript
// services/socket/src/sockets.ts
export function registerSocketHandlers(io: Server) {
  io.on('connection', async (socket) => {
    try {
      // Auth
      const { userId, platform } = await authenticateSocket(socket)

      // Contexte utilisateur
      socket.data.userId = userId
      socket.data.platform = platform

      logger.info('User connected', { userId, platform })

      // Events
      socket.on('join-channel', handleJoinChannel)
      socket.on('leave-channel', handleLeaveChannel)
      socket.on('send-message', handleSendMessage)
      socket.on('add-reaction', handleAddReaction)
      socket.on('typing-start', handleTypingStart)
      socket.on('typing-stop', handleTypingStop)

      socket.on('disconnect', () => {
        logger.info('User disconnected', { userId })
      })

    } catch (error) {
      logger.error('Socket auth failed', { error })
      socket.disconnect()
    }
  })
}
```

### Event: Join Channel

```typescript
async function handleJoinChannel(
  socket: Socket,
  data: { channelId: string; communityId: string }
) {
  const { userId, platform } = socket.data

  // Vérifier accès
  const hasAccess = await checkChannelAccess(
    userId,
    platform,
    data.channelId,
    data.communityId
  )

  if (!hasAccess) {
    socket.emit('error', { message: 'No access to this channel' })
    return
  }

  // Rejoindre la room
  const room = `channel:${data.channelId}`
  await socket.join(room)

  // Notifier les autres
  socket.to(room).emit('user-joined', {
    userId,
    channelId: data.channelId
  })

  // Charger historique messages
  const messages = await loadChannelMessages(data.channelId, { limit: 50 })

  socket.emit('messages-loaded', { messages })
}
```

### Event: Send Message

```typescript
async function handleSendMessage(
  socket: Socket,
  data: { channelId: string; content: string; replyToId?: bigint }
) {
  const { userId, platform } = socket.data

  // Récupérer member
  const member = await prisma.communityMember.findFirst({
    where: {
      platform,
      [platform === 'WEOKTO' ? 'weoktoUserId' : 'stamUserId']: userId
    },
    include: {
      weoktoUser: platform === 'WEOKTO',
      stamUser: platform === 'STAM'
    }
  })

  if (!member) {
    socket.emit('error', { message: 'Not a community member' })
    return
  }

  // Créer message
  const message = await prisma.message.create({
    data: {
      channelId: data.channelId,
      communityId: member.communityId,
      memberId: member.id,
      content: data.content,
      replyToId: data.replyToId
    },
    include: {
      member: {
        include: {
          weoktoUser: true,
          stamUser: true
        }
      },
      replyTo: true,
      reactions: true
    }
  })

  // Broadcast à tous dans le channel
  const room = `channel:${data.channelId}`
  socket.to(room).emit('new-message', { message })

  // Confirmer au sender
  socket.emit('message-sent', { message })
}
```

### Event: Typing Indicator

```typescript
async function handleTypingStart(
  socket: Socket,
  data: { channelId: string }
) {
  const { userId } = socket.data
  const room = `channel:${data.channelId}`

  // Broadcast (sauf sender)
  socket.to(room).emit('user-typing', {
    userId,
    channelId: data.channelId
  })
}

async function handleTypingStop(
  socket: Socket,
  data: { channelId: string }
) {
  const { userId } = socket.data
  const room = `channel:${data.channelId}`

  socket.to(room).emit('user-stopped-typing', {
    userId,
    channelId: data.channelId
  })
}
```

### Client (React Hook)

```typescript
// hooks/useSocket.ts
import { io, Socket } from 'socket.io-client'
import { useEffect, useState } from 'react'

export function useSocket(token: string | null) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!token) return

    const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      auth: { token }
    })

    newSocket.on('connect', () => setConnected(true))
    newSocket.on('disconnect', () => setConnected(false))

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token])

  return { socket, connected }
}
```

### Client (Chat Component)

```typescript
// components/Chat.tsx
export function Chat({ channelId, communityId }: Props) {
  const { socket, connected } = useSocket(token)
  const [messages, setMessages] = useState<Message[]>([])
  const [typing, setTyping] = useState<string[]>([])

  useEffect(() => {
    if (!socket) return

    // Join channel
    socket.emit('join-channel', { channelId, communityId })

    // Listen events
    socket.on('messages-loaded', (data) => {
      setMessages(data.messages)
    })

    socket.on('new-message', (data) => {
      setMessages(prev => [...prev, data.message])
    })

    socket.on('user-typing', (data) => {
      setTyping(prev => [...prev, data.userId])
    })

    socket.on('user-stopped-typing', (data) => {
      setTyping(prev => prev.filter(id => id !== data.userId))
    })

    return () => {
      socket.off('messages-loaded')
      socket.off('new-message')
      socket.off('user-typing')
      socket.off('user-stopped-typing')
    }
  }, [socket, channelId])

  const sendMessage = (content: string) => {
    socket?.emit('send-message', { channelId, content })
  }

  return (
    <div>
      <MessageList messages={messages} />
      {typing.length > 0 && <TypingIndicator users={typing} />}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}
```

### Presence (Utilisateurs en ligne)

```typescript
// services/socket/src/presence.ts
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function setUserOnline(userId: string, channelId: string) {
  const key = `presence:channel:${channelId}`
  await redis.sadd(key, userId)
  await redis.expire(key, 300) // 5 min
}

export async function setUserOffline(userId: string, channelId: string) {
  const key = `presence:channel:${channelId}`
  await redis.srem(key, userId)
}

export async function getOnlineUsers(channelId: string): Promise<string[]> {
  const key = `presence:channel:${channelId}`
  return await redis.smembers(key)
}
```

---

## 📚 SYSTÈME DE FORMATIONS

### Principe

**Simplicité maximale - Tout manuel**

- Pas de builder complexe
- Upload vidéos manuellement sur Bunny.net
- Copier/coller URL iframe dans le module
- Contenu texte en JSON (rich text simple)
- Tracking progression basique

### Structure Formation

```
Formation
  └── Modules (Chapitres)
        ├── Module 1: Introduction
        │   ├── Vidéo (iframe Bunny.net)
        │   ├── Contenu texte (JSON)
        │   ├── Resources (PDFs, liens)
        │   └── Durée estimée
        │
        └── Module 2: Avancé
            ├── Vidéo
            ├── Contenu
            └── Resources
```

### Création Formation (Dashboard OWNER)

```typescript
// Interface de création manuelle
interface FormationCreate {
  communityId: string
  title: string
  subtitle?: string
  description?: string
  level: 'beginner' | 'intermediate' | 'advanced'
  coverImageUrl?: string
  tags: string[]
}

// POST /api/owner/formations
export async function createFormation(data: FormationCreate) {
  const formation = await prisma.formation.create({
    data: {
      ...data,
      slug: slugify(data.title),
      isPublished: false
    }
  })

  return formation
}
```

### Ajout Module

```typescript
// POST /api/owner/formations/[formationId]/modules
interface ModuleCreate {
  title: string
  synopsis?: string
  videoUrl?: string // URL iframe Bunny.net
  content?: any     // Rich text JSON
  durationSeconds: number
}

export async function addModule(
  formationId: string,
  data: ModuleCreate
) {
  // Auto-increment moduleIndex
  const lastModule = await prisma.formationModule.findFirst({
    where: { formationId },
    orderBy: { moduleIndex: 'desc' }
  })

  const moduleIndex = (lastModule?.moduleIndex ?? 0) + 1

  const module = await prisma.formationModule.create({
    data: {
      formationId,
      moduleIndex,
      ...data
    }
  })

  return module
}
```

### Upload Vidéo Bunny.net

```bash
# 1. Upload vidéo sur Bunny.net dashboard
# 2. Récupérer l'URL embed
# 3. Copier dans le champ videoUrl

# Exemple URL:
https://iframe.mediadelivery.net/embed/LIBRARY_ID/VIDEO_ID?autoplay=false
```

### Player Vidéo (Frontend)

```typescript
// components/VideoPlayer.tsx
export function VideoPlayer({ videoUrl, onProgress }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Track progression
  useEffect(() => {
    const interval = setInterval(() => {
      // Bunny.net postMessage API
      iframeRef.current?.contentWindow?.postMessage(
        { type: 'GET_CURRENT_TIME' },
        '*'
      )
    }, 5000) // Toutes les 5s

    window.addEventListener('message', (event) => {
      if (event.data.type === 'CURRENT_TIME') {
        onProgress(event.data.currentTime)
      }
    })

    return () => clearInterval(interval)
  }, [])

  return (
    <iframe
      ref={iframeRef}
      src={videoUrl}
      width="100%"
      height="100%"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    />
  )
}
```

### Tracking Progression

```typescript
// POST /api/formations/[formationId]/progress
interface ProgressUpdate {
  moduleIndex: number
  timeSpent: number // Secondes
  completed: boolean
}

export async function updateProgress(
  stamUserId: string,
  formationId: string,
  data: ProgressUpdate
) {
  const module = await prisma.formationModule.findFirst({
    where: {
      formationId,
      moduleIndex: data.moduleIndex
    }
  })

  if (!module) return

  // Upsert progression
  const progress = await prisma.stamProgress.upsert({
    where: {
      stamUserId_formationId_moduleIndex: {
        stamUserId,
        formationId,
        moduleIndex: data.moduleIndex
      }
    },
    update: {
      timeSpent: {
        increment: data.timeSpent
      },
      status: data.completed ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: data.completed ? new Date() : null
    },
    create: {
      stamUserId,
      formationId,
      moduleId: module.id,
      moduleIndex: data.moduleIndex,
      timeSpent: data.timeSpent,
      status: data.completed ? 'COMPLETED' : 'IN_PROGRESS',
      completedAt: data.completed ? new Date() : null
    }
  })

  return progress
}
```

### Interface Membre (Frontend)

```typescript
// app/stam/learn/[formationId]/page.tsx
export default function FormationPage({ formationId }: Props) {
  const { formation, modules, progress } = useFormation(formationId)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(1)

  const currentModule = modules.find(m => m.moduleIndex === currentModuleIndex)
  const moduleProgress = progress.find(p => p.moduleIndex === currentModuleIndex)

  return (
    <div className="grid grid-cols-[300px_1fr]">
      {/* Sidebar - Liste modules */}
      <aside>
        <h2>{formation.title}</h2>
        {modules.map(module => (
          <ModuleItem
            key={module.id}
            module={module}
            progress={progress.find(p => p.moduleIndex === module.moduleIndex)}
            active={currentModuleIndex === module.moduleIndex}
            onClick={() => setCurrentModuleIndex(module.moduleIndex)}
          />
        ))}
      </aside>

      {/* Contenu principal */}
      <main>
        {currentModule.videoUrl && (
          <VideoPlayer
            videoUrl={currentModule.videoUrl}
            onProgress={(seconds) => {
              updateProgress({
                moduleIndex: currentModuleIndex,
                timeSpent: seconds
              })
            }}
          />
        )}

        {currentModule.content && (
          <RichTextContent content={currentModule.content} />
        )}

        {/* Bouton compléter */}
        <button
          onClick={() => {
            markModuleComplete(currentModuleIndex)
            setCurrentModuleIndex(prev => prev + 1)
          }}
        >
          Marquer comme terminé et continuer
        </button>
      </main>
    </div>
  )
}
```

---

## 💳 SYSTÈME DE PAIEMENTS (PCI VAULT)

> **🔒 SÉCURITÉ PCI VAULT - MODÈLE PROXY UNIQUEMENT**
>
> **IMPORTANT** : PCI Vault utilise un système de **proxy/capture** :
> - Les données de carte bancaire vont **directement du frontend à PCI Vault**
> - Notre backend **ne voit JAMAIS les données CB complètes**
> - Nous stockons **uniquement** :
>   - `pciVaultToken` : Token de référence
>   - `brand` : Marque de la carte (ex: "Visa", "Mastercard")
>   - `last4` : 4 derniers chiffres
>   - `expMonth`, `expYear` : Date d'expiration
> - Ces informations partielles sont **fournies par PCI Vault** après tokenization
> - **Aucune donnée sensible** n'est jamais stockée dans notre base de données
>
> **Flow de sécurité** :
> 1. Backend crée un endpoint de capture via PCI Vault API
> 2. PCI Vault retourne `{url, secret}`
> 3. Frontend affiche iframe/form pointant vers cette URL
> 4. Utilisateur saisit CB → données vont directement à PCI Vault
> 5. PCI Vault retourne `{token, reference, brand, last4, expMonth, expYear}`
> 6. Backend reçoit uniquement le token + infos partielles
>
> Voir [SCHEMA_DATABASE_FINAL.md](SCHEMA_DATABASE_FINAL.md) pour les contraintes de stockage.

### Architecture

```
Landing Page (codée main)
  └── ManualPaymentButton (buttonKey unique)
        │
        ▼
    POST /api/payments/initiate
        │
        ├─ Récupère Product + Plan
        ├─ Crée/Récupère Customer
        ├─ Génère PcivaultCaptureEndpoint
        └─ Retourne iframe URL
        │
        ▼
    Iframe PCI Vault (saisie carte)
        │
        ▼
    POST /api/payments/pci-vault/callback
        │
        ├─ Crée PaymentMethod
        ├─ Crée Invoice
        ├─ Crée Subscription (si récurrent)
        ├─ Accorde accès (Entitlements)
        ├─ Track affiliation
        └─ Redirect success
```

### Création Bouton (Dashboard OWNER)

```typescript
// Interface création
interface ManualPaymentButtonCreate {
  productId: string
  planId: string
  buttonKey: string           // "guild-marketing-premium-monthly"
  displayName: string         // "Rejoindre Guild Marketing Premium"
  description?: string
  ctaText: string            // "Rejoindre - 49€/mois"
  pcivaultPaymentType: 'subscription' | 'one-time'
  successUrl: string         // "/guild/marketing/welcome"
  cancelUrl: string          // "/guild/marketing/checkout-cancelled"
}

// POST /api/owner/payment-buttons
export async function createPaymentButton(data: ManualPaymentButtonCreate) {
  const button = await prisma.manualPaymentButton.create({
    data: {
      ...data,
      isActive: true
    }
  })

  return button
}
```

### Utilisation Bouton (Landing Page)

```tsx
// Landing page custom (codée à la main)
// app/guild/marketing/page.tsx

import ManualPaymentButton from '@/components/payments/ManualPaymentButton'

export default function GuildMarketingLanding() {
  return (
    <div>
      <h1>Guild Marketing</h1>
      <p>Rejoins la communauté des experts marketing...</p>

      {/* Tier gratuit */}
      <ManualPaymentButton buttonKey="guild-marketing-free">
        Rejoindre gratuitement
      </ManualPaymentButton>

      {/* Tier premium */}
      <ManualPaymentButton buttonKey="guild-marketing-premium-monthly">
        Rejoindre Premium - 49€/mois
      </ManualPaymentButton>
    </div>
  )
}
```

### Component ManualPaymentButton

```tsx
// components/payments/ManualPaymentButton.tsx
'use client'

export function ManualPaymentButton({
  buttonKey,
  children
}: {
  buttonKey: string
  children: React.ReactNode
}) {
  const [loading, setLoading] = useState(false)
  const [iframeUrl, setIframeUrl] = useState<string | null>(null)

  const handleClick = async () => {
    setLoading(true)

    try {
      const res = await fetch('/api/payments/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buttonKey })
      })

      const data = await res.json()

      if (data.iframeUrl) {
        setIframeUrl(data.iframeUrl)
      }
    } catch (error) {
      console.error('Payment init failed', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button onClick={handleClick} disabled={loading}>
        {loading ? 'Chargement...' : children}
      </button>

      {iframeUrl && (
        <PaymentModal
          iframeUrl={iframeUrl}
          onClose={() => setIframeUrl(null)}
        />
      )}
    </>
  )
}
```

### API: Initiate Payment

```typescript
// POST /api/payments/initiate
export async function POST(request: Request) {
  const { buttonKey } = await request.json()
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 1. Récupérer bouton
  const button = await prisma.manualPaymentButton.findUnique({
    where: { buttonKey },
    include: {
      product: {
        include: { community: true }
      },
      plan: true
    }
  })

  if (!button || !button.isActive) {
    return NextResponse.json({ error: 'Button not found' }, { status: 404 })
  }

  // 2. Récupérer/Créer customer
  const user = await prisma.weoktoUser.findUnique({ where: { id: userId } })

  let customer = await prisma.customer.findFirst({
    where: {
      platform: button.product.community.platform,
      weoktoUserId: userId
    }
  })

  if (!customer) {
    customer = await prisma.customer.create({
      data: {
        platform: button.product.community.platform,
        weoktoUserId: userId,
        email: user.email
      }
    })
  }

  // 3. Générer PcivaultCaptureEndpoint
  const uniqueId = generateUniqueId()
  const secret = generateSecret()

  const captureEndpoint = await prisma.pcivaultCaptureEndpoint.create({
    data: {
      uniqueId,
      url: `${process.env.APP_URL}/api/payments/pci-vault/callback`,
      secret,
      productId: button.productId,
      customerId: customer.id,
      usageContext: 'checkout',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000) // 30 min
    }
  })

  // 4. Construire URL PCI Vault
  const pcivaultUrl = new URL(process.env.PCIVAULT_CHECKOUT_URL!)
  pcivaultUrl.searchParams.set('amount', button.plan.price.toString())
  pcivaultUrl.searchParams.set('currency', button.plan.currency)
  pcivaultUrl.searchParams.set('capture_url', captureEndpoint.url)
  pcivaultUrl.searchParams.set('capture_secret', secret)
  pcivaultUrl.searchParams.set('return_url', button.successUrl)

  if (button.pcivaultPaymentType === 'subscription') {
    pcivaultUrl.searchParams.set('recurring', 'true')
    pcivaultUrl.searchParams.set('interval', button.plan.billingInterval!)
  }

  return NextResponse.json({
    iframeUrl: pcivaultUrl.toString(),
    checkoutId: uniqueId
  })
}
```

### API: Callback PCI Vault

```typescript
// POST /api/payments/pci-vault/callback
export async function POST(request: Request) {
  const data = await request.json()

  // 1. Vérifier signature
  const endpoint = await prisma.pcivaultCaptureEndpoint.findUnique({
    where: { uniqueId: data.checkoutId }
  })

  if (!endpoint || endpoint.secret !== data.secret) {
    return NextResponse.json({ error: 'Invalid callback' }, { status: 401 })
  }

  // 2. Créer PaymentMethod
  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      customerId: endpoint.customerId,
      pcivaultToken: data.token,
      pcivaultReference: data.reference,
      brand: data.card.brand,
      last4: data.card.last4,
      expMonth: data.card.expMonth,
      expYear: data.card.expYear,
      status: 'ACTIVE'
    }
  })

  // 3. Créer Invoice
  const button = await prisma.manualPaymentButton.findFirst({
    where: { productId: endpoint.productId },
    include: { plan: true, product: true }
  })

  const invoice = await prisma.invoice.create({
    data: {
      customerId: endpoint.customerId,
      status: 'PAID',
      currency: button.plan.currency,
      subtotalAmount: button.plan.price,
      taxAmount: 0,
      amountExcludingTax: button.plan.price,
      amountIncludingTax: button.plan.price,
      paidAt: new Date()
    }
  })

  // 4. Si subscription, créer
  let subscription = null
  if (button.pcivaultPaymentType === 'subscription') {
    subscription = await prisma.subscription.create({
      data: {
        customerId: endpoint.customerId,
        planId: button.planId,
        paymentMethodId: paymentMethod.id,
        status: 'ACTIVE',
        billingInterval: button.plan.billingInterval!,
        nextBillingAt: calculateNextBilling(
          button.plan.billingInterval!,
          button.plan.billingCount!
        )
      }
    })
  }

  // 5. Créer membership communauté
  const member = await prisma.communityMember.create({
    data: {
      communityId: button.product.communityId,
      platform: button.product.community.platform,
      weoktoUserId: endpoint.weoktoUserId,
      email: endpoint.customer.email,
      customerId: endpoint.customerId,
      currentProductId: button.productId
    }
  })

  // 6. Accorder accès (Entitlements)
  const accesses = await prisma.productAccess.findMany({
    where: { productId: button.productId }
  })

  for (const access of accesses) {
    await prisma.entitlement.create({
      data: {
        communityMemberId: member.id,
        productAccessId: access.id,
        subscriptionId: subscription?.id,
        invoiceId: invoice.id,
        activationSource: 'payment'
      }
    })
  }

  // 7. Track affiliation (si cookie présent)
  await trackAffiliateConversion(request, {
    customerId: endpoint.customerId,
    productId: button.productId,
    invoiceId: invoice.id,
    amount: button.plan.price
  })

  return NextResponse.json({ success: true })
}
```

### Renewals Automatiques (CRON)

```typescript
// scripts/processRenewals.ts
export async function processRenewals() {
  const subscriptionsDue = await prisma.subscription.findMany({
    where: {
      status: 'ACTIVE',
      nextBillingAt: {
        lte: new Date()
      },
      paymentMethodId: { not: null }
    },
    include: {
      customer: true,
      plan: true,
      paymentMethod: true
    }
  })

  for (const sub of subscriptionsDue) {
    try {
      // 1. Appel PCI Vault pour débiter
      const result = await chargePCIVault({
        token: sub.paymentMethod.pcivaultToken,
        amount: sub.plan.price,
        currency: sub.plan.currency
      })

      if (!result.success) {
        // Échec → PAST_DUE
        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'PAST_DUE' }
        })
        continue
      }

      // 2. Créer Invoice
      const invoice = await prisma.invoice.create({
        data: {
          customerId: sub.customerId,
          subscriptionId: sub.id,
          status: 'PAID',
          currency: sub.plan.currency,
          amountIncludingTax: sub.plan.price,
          paidAt: new Date()
        }
      })

      // 3. Update subscription
      await prisma.subscription.update({
        where: { id: sub.id },
        data: {
          nextBillingAt: calculateNextBilling(
            sub.billingInterval,
            sub.plan.billingCount
          )
        }
      })

      // 4. Commission affilié (si applicable)
      await createAffiliateCommission({
        customerId: sub.customerId,
        productId: sub.plan.productId,
        invoiceId: invoice.id,
        amount: sub.plan.price
      })

    } catch (error) {
      logger.error('Renewal failed', { subscriptionId: sub.id, error })
    }
  }
}
```

---

## 🎨 DESIGN SYSTEM & FRONTEND

### Philosophie Design

**WEOKTO** : Style cyberpunk/gaming, sombre, énergique
- Couleurs : Violet (#7C3AED), Cyan (#38BDF8), fond sombre (#0B0D12)
- Typographie : Inter, Manrope
- Effets : Glitch, scanlines, néon

**STAM** : Style épuré, organique, minimaliste
- Couleurs : Beige (#F5F1E8), Ambre, tons chauds
- Typographie : Inter, Manrope
- Effets : Blobs, ombres douces, animations fluides

### Tailwind Config

```typescript
// tailwind.config.ts
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // WEOKTO
        primary: {
          500: '#7C3AED',
          600: '#6D28D9',
        },
        secondary: {
          500: '#38BDF8',
          600: '#0EA5E9',
        },

        // STAM
        pearl: {
          500: '#F59E0B',
          600: '#D97706',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui']
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'glitch': 'glitch 1s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-2px, 2px)' },
          '66%': { transform: 'translate(2px, -2px)' }
        }
      }
    }
  }
}
```

### Components Système (shadcn/ui)

```bash
# Installer shadcn/ui
npx shadcn-ui@latest init

# Ajouter components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add tooltip
```

### Example: WEOKTO Card

```tsx
// components/weokto/Card.tsx
export function WeoktoCard({ children, glitch = false }: Props) {
  return (
    <div className={cn(
      "relative rounded-lg bg-zinc-900 border border-zinc-800",
      "backdrop-blur-sm shadow-lg shadow-primary-500/20",
      glitch && "animate-glitch"
    )}>
      {/* Scanlines effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="h-full w-full" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, currentColor 2px, currentColor 4px)'
        }} />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}
```

### Example: STAM Card

```tsx
// components/stam/Card.tsx
export function StamCard({ children }: Props) {
  return (
    <div className="relative rounded-2xl bg-stone-50 border border-stone-200 shadow-lg shadow-stone-900/5">
      {/* Blob decoration */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full blur-3xl opacity-40" />

      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </div>
  )
}
```

### Animations (Framer Motion)

```tsx
// components/AnimatedSection.tsx
import { motion } from 'framer-motion'

export function AnimatedSection({ children }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

### Icons (Phosphor)

```tsx
import { Users, ChatCircleDots, Trophy } from '@phosphor-icons/react'

export function Features() {
  return (
    <div>
      <Users size={24} weight="duotone" />
      <ChatCircleDots size={24} weight="duotone" />
      <Trophy size={24} weight="duotone" />
    </div>
  )
}
```

---

## 🔌 API ROUTES & ENDPOINTS

### Structure

```
app/api/
├── auth/
│   ├── magic-link/
│   │   ├── send/route.ts
│   │   ├── verify/route.ts
│   │   └── verify-otp/route.ts
│   ├── logout/route.ts
│   └── me/route.ts
│
├── payments/
│   ├── initiate/route.ts
│   └── pci-vault/
│       └── callback/route.ts
│
├── affiliate/
│   ├── links/generate/route.ts
│   ├── dashboard/route.ts
│   ├── commissions/route.ts
│   └── withdrawals/route.ts
│
├── communities/
│   ├── [communityId]/
│   │   ├── route.ts
│   │   ├── join/route.ts
│   │   └── channels/route.ts
│
├── formations/
│   ├── [formationId]/
│   │   ├── route.ts
│   │   ├── modules/route.ts
│   │   └── progress/route.ts
│
└── owner/
    ├── communities/route.ts
    ├── payment-buttons/route.ts
    ├── affiliates/route.ts
    └── analytics/route.ts
```

### Pattern Standard

```typescript
// app/api/resource/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { prisma } from '@/lib/prisma'

// GET /api/resource
export async function GET(request: NextRequest) {
  const headersList = headers()
  const userId = headersList.get('x-user-id')

  if (!userId) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const data = await prisma.resource.findMany({
      where: { userId }
    })

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal error' },
      { status: 500 }
    )
  }
}

// POST /api/resource
export async function POST(request: NextRequest) {
  const userId = headers().get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  // Validation avec Zod
  const validated = ResourceSchema.parse(body)

  const created = await prisma.resource.create({
    data: {
      ...validated,
      userId
    }
  })

  return NextResponse.json({ data: created }, { status: 201 })
}
```

---

## 🚀 DÉPLOIEMENT & INFRASTRUCTURE

### Environnements

```bash
# Development
npm run dev          # Next.js (port 3000)
npm run socket:dev   # Socket.io (port 3001)

# Production
npm run build
npm start            # Next.js
npm run socket:start # Socket.io
```

### Variables d'Environnement

```bash
# .env.local

# Database
DATABASE_URL="postgresql://..."
DIRECT_URL="postgresql://..."

# Auth
JWT_SECRET="..." # 32+ chars
STAM_JWT_SECRET="..." # 32+ chars
WEOKTO_COOKIE_DOMAIN=".weokto.com"

# Redis
REDIS_URL="redis://..."

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# PCI Vault
PCIVAULT_CHECKOUT_URL="https://checkout.pcivault.io"
PCIVAULT_API_KEY="..."

# Bunny.net
BUNNY_API_KEY="..."
BUNNY_LIBRARY_ID="..."

# Email (Resend)
RESEND_API_KEY="..."

# Socket.io
SOCKET_URL="https://socket.weokto.com"
SOCKET_ALLOWED_ORIGINS="https://weokto.com,https://be-stam.com"

# App URLs
APP_URL="https://weokto.com"
STAM_URL="https://be-stam.com"
```

### Vercel Deployment

```json
// vercel.json
{
  "buildCommand": "prisma generate && next build",
  "framework": "nextjs",
  "regions": ["cdg1"],
  "env": {
    "DATABASE_URL": "@database-url",
    "JWT_SECRET": "@jwt-secret"
  }
}
```

### Socket.io Server (Séparé)

Déployer sur Render, Railway, ou Fly.io

```dockerfile
# Dockerfile (Socket server)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
COPY pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --frozen-lockfile

COPY services/socket ./services/socket
COPY prisma ./prisma

RUN pnpm prisma generate
RUN pnpm run socket:build

EXPOSE 3001

CMD ["pnpm", "run", "socket:start"]
```

---

## ✅ CHECKLIST DÉVELOPPEMENT

### Setup Initial
- [ ] Clone projet
- [ ] `pnpm install`
- [ ] Copier `.env.example` → `.env.local`
- [ ] Configurer Supabase
- [ ] `pnpm prisma generate`
- [ ] `pnpm prisma db push`
- [ ] Seed data initial
- [ ] `pnpm dev`

### Avant Production
- [ ] Tests E2E complets
- [ ] Sécurité : Rate limiting, CORS, CSP
- [ ] Performance : Lighthouse > 90
- [ ] SEO : Meta tags, sitemap
- [ ] Analytics : Vercel + custom events
- [ ] Monitoring : Sentry
- [ ] Backup DB automatique
- [ ] Documentation à jour

---

## 🏠 STAM - LAYOUT MULTI-PRODUITS

### Principe

**Un client STAM = 1 profil** qui peut accéder à **plusieurs produits/communautés**.

Le layout doit s'adapter dynamiquement selon le nombre de communautés du client.

### Scenarios UX

```
┌─────────────────────────────────────────────────────────────┐
│ SCÉNARIO 1: Client avec 1 seule communauté                  │
├─────────────────────────────────────────────────────────────┤
│ → Layout simple, accès direct                               │
│ → Pas de sélecteur de communauté                           │
│ → Branding de la communauté en full screen                 │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SCÉNARIO 2: Client avec 2-3 communautés                    │
├─────────────────────────────────────────────────────────────┤
│ → Tabs en haut pour switch entre communautés               │
│ → État sauvegardé (dernière communauté visitée)            │
│ → Chaque tab = branding de la communauté                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ SCÉNARIO 3: Client avec 4+ communautés                     │
├─────────────────────────────────────────────────────────────┤
│ → Sidebar gauche avec liste des communautés                │
│ → Avatar + nom de chaque communauté                        │
│ → Indicateurs (nouvelles notifs, unread)                   │
│ → Sidebar collapsible sur mobile                           │
└─────────────────────────────────────────────────────────────┘
```

### Schema Layout

```typescript
// lib/stam/layout.ts

interface StamLayoutContext {
  stamUser: StamUser
  communities: Community[]
  currentCommunity: Community | null
  switchCommunity: (communityId: string) => void
}

export function getLayoutType(communitiesCount: number): 'single' | 'tabs' | 'sidebar' {
  if (communitiesCount === 1) return 'single'
  if (communitiesCount <= 3) return 'tabs'
  return 'sidebar'
}
```

### Implementation

#### Composant Principal

```typescript
// app/stam/layout.tsx

export default function StamLayout({ children }: { children: React.ReactNode }) {
  const { stamUser } = useStamAuth()
  const { communities, currentCommunity, setCurrentCommunity } = useStamCommunities()

  const layoutType = getLayoutType(communities.length)

  // Restaurer dernière communauté visitée
  useEffect(() => {
    const lastCommunityId = localStorage.getItem('stam:lastCommunityId')
    if (lastCommunityId && communities.find(c => c.id === lastCommunityId)) {
      setCurrentCommunity(lastCommunityId)
    } else if (communities.length > 0) {
      setCurrentCommunity(communities[0].id)
    }
  }, [communities])

  // Sauvegarder choix
  useEffect(() => {
    if (currentCommunity) {
      localStorage.setItem('stam:lastCommunityId', currentCommunity.id)
    }
  }, [currentCommunity])

  if (!currentCommunity) {
    return <LoadingScreen />
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Header global */}
      <StamHeader user={stamUser} />

      {/* Layout adaptatif */}
      {layoutType === 'single' && (
        <SingleCommunityLayout community={currentCommunity}>
          {children}
        </SingleCommunityLayout>
      )}

      {layoutType === 'tabs' && (
        <TabsCommunityLayout
          communities={communities}
          currentCommunity={currentCommunity}
          onSwitch={setCurrentCommunity}
        >
          {children}
        </TabsCommunityLayout>
      )}

      {layoutType === 'sidebar' && (
        <SidebarCommunityLayout
          communities={communities}
          currentCommunity={currentCommunity}
          onSwitch={setCurrentCommunity}
        >
          {children}
        </SidebarCommunityLayout>
      )}
    </div>
  )
}
```

#### Layout 1: Single Community

```typescript
// components/stam/layouts/SingleCommunityLayout.tsx

export function SingleCommunityLayout({
  community,
  children
}: {
  community: Community
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex">
      {/* Sidebar communauté */}
      <CommunitySidebar community={community} />

      {/* Contenu principal */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}
```

#### Layout 2: Tabs (2-3 Communautés)

```typescript
// components/stam/layouts/TabsCommunityLayout.tsx

export function TabsCommunityLayout({
  communities,
  currentCommunity,
  onSwitch,
  children
}: {
  communities: Community[]
  currentCommunity: Community
  onSwitch: (id: string) => void
  children: React.ReactNode
}) {
  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="border-b bg-background/95 backdrop-blur">
        <div className="flex gap-2 px-4">
          {communities.map(community => (
            <button
              key={community.id}
              onClick={() => onSwitch(community.id)}
              className={cn(
                'px-4 py-3 border-b-2 transition-colors',
                currentCommunity.id === community.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                <Avatar size="sm" src={community.logoUrl} />
                <span className="font-medium">{community.name}</span>
                {community.unreadCount > 0 && (
                  <Badge variant="destructive" size="sm">
                    {community.unreadCount}
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Contenu */}
      <div className="flex-1 flex">
        <CommunitySidebar community={currentCommunity} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
```

#### Layout 3: Sidebar (4+ Communautés)

```typescript
// components/stam/layouts/SidebarCommunityLayout.tsx

export function SidebarCommunityLayout({
  communities,
  currentCommunity,
  onSwitch,
  children
}: {
  communities: Community[]
  currentCommunity: Community
  onSwitch: (id: string) => void
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex-1 flex">
      {/* Sidebar communautés */}
      <aside
        className={cn(
          'border-r bg-muted/30 transition-all',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        {/* Toggle collapse */}
        <div className="p-2 border-b flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </Button>
        </div>

        {/* Liste communautés */}
        <div className="p-2 space-y-1">
          {communities.map(community => (
            <button
              key={community.id}
              onClick={() => onSwitch(community.id)}
              className={cn(
                'w-full p-3 rounded-lg transition-colors flex items-center gap-3',
                currentCommunity.id === community.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              )}
            >
              <Avatar size="md" src={community.logoUrl} />
              {!collapsed && (
                <div className="flex-1 text-left">
                  <p className="font-medium text-sm">{community.name}</p>
                  {community.unreadCount > 0 && (
                    <p className="text-xs opacity-80">
                      {community.unreadCount} nouveaux messages
                    </p>
                  )}
                </div>
              )}
              {collapsed && community.unreadCount > 0 && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </div>
      </aside>

      {/* Contenu principal */}
      <div className="flex-1 flex">
        <CommunitySidebar community={currentCommunity} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
```

### Hook: useStamCommunities

```typescript
// hooks/useStamCommunities.ts

export function useStamCommunities() {
  const { stamUser } = useStamAuth()
  const [currentCommunityId, setCurrentCommunityId] = useState<string | null>(null)

  // Fetch communautés du user
  const { data: memberships } = useQuery({
    queryKey: ['stam-communities', stamUser?.id],
    queryFn: async () => {
      const response = await fetch('/api/stam/my-communities')
      return response.json()
    },
    enabled: !!stamUser
  })

  const communities = memberships?.map((m: any) => m.community) || []
  const currentCommunity = communities.find((c: any) => c.id === currentCommunityId) || null

  return {
    communities,
    currentCommunity,
    setCurrentCommunity: setCurrentCommunityId,
    isLoading: !memberships
  }
}
```

### API Route

```typescript
// app/api/stam/my-communities/route.ts

export async function GET(request: Request) {
  const stamUserId = request.headers.get('x-stam-user-id')

  const memberships = await prisma.communityMember.findMany({
    where: {
      stamUserId,
      platform: 'STAM'
    },
    include: {
      community: {
        include: {
          product: {
            include: {
              plan: true
            }
          }
        }
      }
    }
  })

  // Enrichir avec unread count
  const enriched = await Promise.all(
    memberships.map(async (m) => {
      const unreadCount = await prisma.message.count({
        where: {
          communityId: m.communityId,
          createdAt: { gt: m.lastReadAt || new Date(0) }
        }
      })

      return {
        ...m,
        community: {
          ...m.community,
          unreadCount
        }
      }
    })
  )

  return NextResponse.json(enriched)
}
```

### Mobile Responsive

```typescript
// Sur mobile, toujours utiliser un drawer pour les communautés
export function MobileCommunitySwitcher({
  communities,
  currentCommunity,
  onSwitch
}: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Trigger */}
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="lg:hidden"
      >
        <Avatar size="sm" src={currentCommunity.logoUrl} />
        <span>{currentCommunity.name}</span>
        <ChevronDown className="ml-2" />
      </Button>

      {/* Drawer */}
      <Drawer open={open} onClose={() => setOpen(false)}>
        <DrawerHeader>
          <DrawerTitle>Mes Communautés</DrawerTitle>
        </DrawerHeader>
        <DrawerContent>
          <div className="space-y-2 p-4">
            {communities.map(community => (
              <button
                key={community.id}
                onClick={() => {
                  onSwitch(community.id)
                  setOpen(false)
                }}
                className={cn(
                  'w-full p-4 rounded-lg border flex items-center gap-3',
                  currentCommunity.id === community.id && 'border-primary bg-primary/5'
                )}
              >
                <Avatar src={community.logoUrl} />
                <div className="flex-1 text-left">
                  <p className="font-medium">{community.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {community.product.plan.name}
                  </p>
                </div>
                {community.unreadCount > 0 && (
                  <Badge variant="destructive">{community.unreadCount}</Badge>
                )}
              </button>
            ))}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  )
}
```

---

## 📊 DASHBOARD OWNER - GESTION AFFILIÉS

### Vue d'Ensemble

Dashboard complet pour monitorer et gérer tous les affiliés depuis un seul endroit.

### Statistiques Globales

```typescript
// app/api/owner/affiliates/stats/route.ts

export async function GET() {
  const stats = await getAffiliateGlobalStats()
  return NextResponse.json(stats)
}

async function getAffiliateGlobalStats() {
  const now = new Date()
  const lastMonth = subDays(now, 30)

  // Total affiliés
  const totalAffiliates = await prisma.weoktoUser.count({
    where: { userType: 'AFFILIATE' }
  })

  // Affiliés actifs (au moins 1 vente dans les 30 derniers jours)
  const activeAffiliates = await prisma.affiliateCommission.groupBy({
    by: ['affiliateId'],
    where: {
      createdAt: { gte: lastMonth }
    }
  })

  // Total commissions
  const commissions = await prisma.affiliateCommission.aggregate({
    _sum: { totalAmount: true },
    _count: true,
    where: {
      status: { not: 'CLAWED_BACK' }
    }
  })

  // Commissions par statut
  const commissionsByStatus = await prisma.affiliateCommission.groupBy({
    by: ['status'],
    _sum: { totalAmount: true },
    _count: true
  })

  // Top 10 affiliés
  const topAffiliates = await prisma.affiliateCommission.groupBy({
    by: ['affiliateId'],
    _sum: { totalAmount: true },
    _count: true,
    orderBy: { _sum: { totalAmount: 'desc' } },
    take: 10
  })

  // Géolocalisation
  const geoStats = await prisma.affiliateTrackingEvent.groupBy({
    by: ['country'],
    _count: true,
    where: {
      country: { not: null },
      createdAt: { gte: lastMonth }
    },
    orderBy: { _count: { country: 'desc' } },
    take: 10
  })

  return {
    totalAffiliates,
    activeAffiliates: activeAffiliates.length,
    totalCommissions: {
      amount: commissions._sum.totalAmount || 0,
      count: commissions._count
    },
    commissionsByStatus: commissionsByStatus.map(s => ({
      status: s.status,
      amount: s._sum.totalAmount || 0,
      count: s._count
    })),
    topAffiliates: await Promise.all(
      topAffiliates.map(async (t) => {
        const user = await prisma.weoktoUser.findUnique({
          where: { id: t.affiliateId },
          select: { displayName: true, email: true, riskLevel: true }
        })
        return {
          affiliateId: t.affiliateId,
          displayName: user?.displayName,
          email: user?.email,
          riskLevel: user?.riskLevel,
          totalAmount: t._sum.totalAmount || 0,
          salesCount: t._count
        }
      })
    ),
    geoStats: geoStats.map(g => ({
      country: g.country,
      clicks: g._count
    }))
  }
}
```

### Stats Par Affilié

```typescript
// app/api/owner/affiliates/[affiliateId]/stats/route.ts

export async function GET(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  const stats = await getAffiliateDetailedStats(params.affiliateId)
  return NextResponse.json(stats)
}

async function getAffiliateDetailedStats(affiliateId: string) {
  const affiliate = await prisma.weoktoUser.findUnique({
    where: { id: affiliateId },
    include: {
      affiliateProfile: true
    }
  })

  if (!affiliate) {
    throw new Error('Affiliate not found')
  }

  // Commissions
  const commissions = await prisma.affiliateCommission.findMany({
    where: { affiliateId },
    include: {
      program: {
        include: { product: true }
      }
    },
    orderBy: { createdAt: 'desc' }
  })

  const totalEarned = commissions
    .filter(c => c.status !== 'CLAWED_BACK')
    .reduce((sum, c) => sum + c.totalAmount, 0)

  const totalLocked = commissions
    .filter(c => c.status === 'LOCKED' || c.status === 'PENDING_LOCK')
    .reduce((sum, c) => sum + c.totalAmount, 0)

  const totalMatured = commissions
    .filter(c => c.status === 'MATURED')
    .reduce((sum, c) => sum + c.totalAmount, 0)

  const totalPaid = commissions
    .filter(c => c.status === 'PAID')
    .reduce((sum, c) => sum + c.totalAmount, 0)

  const totalRefunded = commissions
    .filter(c => c.status === 'CLAWED_BACK')
    .reduce((sum, c) => sum + c.totalAmount, 0)

  // Taux de conversion
  const clicks = await prisma.affiliateTrackingEvent.count({
    where: { affiliateId }
  })

  const conversions = commissions.length
  const conversionRate = clicks > 0 ? (conversions / clicks) * 100 : 0

  // Produits les plus performants
  const productStats = await prisma.affiliateCommission.groupBy({
    by: ['affiliateProgramId'],
    _sum: { totalAmount: true },
    _count: true,
    where: {
      affiliateId,
      status: { not: 'CLAWED_BACK' }
    },
    orderBy: { _sum: { totalAmount: 'desc' } },
    take: 5
  })

  const topProducts = await Promise.all(
    productStats.map(async (p) => {
      const program = await prisma.affiliateProgram.findUnique({
        where: { id: p.affiliateProgramId },
        include: { product: true }
      })
      return {
        productName: program?.product.name,
        amount: p._sum.totalAmount || 0,
        sales: p._count
      }
    })
  )

  // Évolution temporelle (30 derniers jours)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(new Date(), 29 - i)
    return date.toISOString().split('T')[0]
  })

  const dailyStats = await Promise.all(
    last30Days.map(async (date) => {
      const dayStart = new Date(date)
      const dayEnd = new Date(date)
      dayEnd.setDate(dayEnd.getDate() + 1)

      const daySales = await prisma.affiliateCommission.aggregate({
        _sum: { totalAmount: true },
        _count: true,
        where: {
          affiliateId,
          createdAt: { gte: dayStart, lt: dayEnd },
          status: { not: 'CLAWED_BACK' }
        }
      })

      return {
        date,
        amount: daySales._sum.totalAmount || 0,
        sales: daySales._count
      }
    })
  )

  return {
    affiliate: {
      id: affiliate.id,
      displayName: affiliate.displayName,
      email: affiliate.email,
      riskLevel: affiliate.riskLevel,
      refundRate: affiliate.refundRate,
      firstCommissionAt: affiliate.firstCommissionAt,
      accountAge: affiliate.firstCommissionAt
        ? daysSince(affiliate.firstCommissionAt)
        : 0
    },
    balances: {
      totalEarned,
      totalLocked,
      totalMatured,
      totalPaid,
      totalRefunded
    },
    performance: {
      clicks,
      conversions,
      conversionRate: conversionRate.toFixed(2) + '%',
      topProducts
    },
    timeline: dailyStats
  }
}
```

### Détection Fraude & Risque

```typescript
// app/api/owner/affiliates/fraud-detection/route.ts

export async function GET() {
  const suspiciousAffiliates = await detectSuspiciousAffiliates()
  return NextResponse.json(suspiciousAffiliates)
}

interface FraudAlert {
  affiliateId: string
  displayName: string
  email: string
  riskLevel: string
  alerts: string[]
  score: number
}

async function detectSuspiciousAffiliates(): Promise<FraudAlert[]> {
  const affiliates = await prisma.weoktoUser.findMany({
    where: { userType: 'AFFILIATE' },
    include: {
      affiliateCommissions: {
        include: { customer: true }
      }
    }
  })

  const alerts: FraudAlert[] = []

  for (const affiliate of affiliates) {
    const suspiciousPatterns: string[] = []
    let fraudScore = 0

    // 1. Taux de refund élevé
    if (affiliate.refundRate >= 0.4) {
      suspiciousPatterns.push(`Taux de refund: ${(affiliate.refundRate * 100).toFixed(1)}%`)
      fraudScore += 40
    } else if (affiliate.refundRate >= 0.25) {
      suspiciousPatterns.push(`Taux de refund élevé: ${(affiliate.refundRate * 100).toFixed(1)}%`)
      fraudScore += 25
    }

    // 2. Ventes concentrées (même client achète plusieurs fois rapidement)
    const customerFrequency = affiliate.affiliateCommissions.reduce((acc, c) => {
      acc[c.customerId] = (acc[c.customerId] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const repeatedCustomers = Object.entries(customerFrequency).filter(([_, count]) => count >= 3)
    if (repeatedCustomers.length > 0) {
      suspiciousPatterns.push(`${repeatedCustomers.length} clients avec 3+ achats`)
      fraudScore += 15
    }

    // 3. Ventes très rapprochées (burst de ventes)
    const recentCommissions = affiliate.affiliateCommissions
      .filter(c => c.createdAt >= subDays(new Date(), 7))
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

    if (recentCommissions.length >= 10) {
      const firstDate = recentCommissions[0].createdAt
      const lastDate = recentCommissions[recentCommissions.length - 1].createdAt
      const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)

      if (daysDiff < 2) {
        suspiciousPatterns.push(`${recentCommissions.length} ventes en ${daysDiff.toFixed(1)} jours`)
        fraudScore += 20
      }
    }

    // 4. Montants suspects (toujours arrondis, ou très similaires)
    const amounts = affiliate.affiliateCommissions.map(c => c.totalAmount)
    const uniqueAmounts = new Set(amounts)
    if (amounts.length >= 5 && uniqueAmounts.size === 1) {
      suspiciousPatterns.push('Tous les montants identiques')
      fraudScore += 25
    }

    // 5. Compte récent avec beaucoup de ventes
    const accountAge = affiliate.firstCommissionAt
      ? daysSince(affiliate.firstCommissionAt)
      : 0

    if (accountAge <= 7 && affiliate.affiliateCommissions.length >= 20) {
      suspiciousPatterns.push(`${affiliate.affiliateCommissions.length} ventes en ${accountAge} jours`)
      fraudScore += 30
    }

    // Si au moins 1 pattern suspect
    if (suspiciousPatterns.length > 0) {
      alerts.push({
        affiliateId: affiliate.id,
        displayName: affiliate.displayName || 'N/A',
        email: affiliate.email,
        riskLevel: affiliate.riskLevel,
        alerts: suspiciousPatterns,
        score: fraudScore
      })
    }
  }

  // Trier par score décroissant
  return alerts.sort((a, b) => b.score - a.score)
}
```

### Gestion Manuelle

```typescript
// app/api/owner/affiliates/[affiliateId]/manage/route.ts

// Ajuster profil de risque manuellement
export async function PATCH(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  const body = await request.json()
  const { riskLevel, notes } = body

  const updated = await prisma.weoktoUser.update({
    where: { id: params.affiliateId },
    data: {
      riskLevel,
      metadata: {
        manualRiskAdjustment: {
          adjustedAt: new Date(),
          adjustedBy: 'owner',
          previousLevel: body.previousLevel,
          notes
        }
      }
    }
  })

  return NextResponse.json({ success: true, updated })
}

// Bloquer un affilié
export async function POST(
  request: Request,
  { params }: { params: { affiliateId: string } }
) {
  const body = await request.json()
  const { action, reason } = body

  if (action === 'block') {
    // Bloquer toutes futures commissions
    await prisma.weoktoUser.update({
      where: { id: params.affiliateId },
      data: {
        userType: 'CLIENT', // Retirer statut affilié
        metadata: {
          blocked: true,
          blockedAt: new Date(),
          blockedReason: reason
        }
      }
    })

    // Clawback commissions non payées
    await prisma.affiliateCommission.updateMany({
      where: {
        affiliateId: params.affiliateId,
        status: { in: ['MATURED', 'LOCKED', 'PENDING_LOCK'] }
      },
      data: { status: 'CLAWED_BACK' }
    })

    return NextResponse.json({ success: true, action: 'blocked' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
```

### Interface Dashboard Owner

```typescript
// app/owner/affiliates/page.tsx

export default function AffiliatesDashboard() {
  const { stats, topAffiliates, geoStats, fraudAlerts } = useAffiliatesStats()

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="Total Affiliés"
          value={stats.totalAffiliates}
          icon={Users}
        />
        <StatCard
          title="Actifs (30j)"
          value={stats.activeAffiliates}
          icon={TrendingUp}
        />
        <StatCard
          title="Commissions Total"
          value={formatCurrency(stats.totalCommissions.amount)}
          icon={DollarSign}
        />
        <StatCard
          title="Taux Conversion"
          value={stats.conversionRate}
          icon={Target}
        />
      </div>

      {/* Alertes fraude */}
      {fraudAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <h3>⚠️ Alertes Fraude ({fraudAlerts.length})</h3>
          </CardHeader>
          <CardContent>
            {fraudAlerts.map(alert => (
              <FraudAlertItem
                key={alert.affiliateId}
                alert={alert}
                onInvestigate={() => router.push(`/owner/affiliates/${alert.affiliateId}`)}
              />
            ))}
          </CardContent>
        </Card>
      )}

      {/* Top Affiliés */}
      <Card>
        <CardHeader>
          <h3>🏆 Top 10 Affiliés</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Affilié</TableHead>
                <TableHead>Ventes</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Risque</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topAffiliates.map((affiliate, i) => (
                <TableRow key={affiliate.affiliateId}>
                  <TableCell>
                    <div>
                      <p className="font-medium">#{i + 1} {affiliate.displayName}</p>
                      <p className="text-sm text-muted">{affiliate.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>{affiliate.salesCount}</TableCell>
                  <TableCell>{formatCurrency(affiliate.totalAmount)}</TableCell>
                  <TableCell>
                    <RiskBadge level={affiliate.riskLevel} />
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      onClick={() => router.push(`/owner/affiliates/${affiliate.affiliateId}`)}
                    >
                      Détails
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Géo Stats */}
      <Card>
        <CardHeader>
          <h3>🌍 Clicks par Pays (30j)</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {geoStats.map(stat => (
              <div key={stat.country} className="flex justify-between">
                <span>{stat.country}</span>
                <span className="font-medium">{stat.clicks} clicks</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 💰 LEDGER & SYSTÈME COMPTABLE AFFILIÉS

### Principe

Le **Ledger** est un journal comptable **immuable** qui enregistre toutes les transactions financières des affiliés.

### Schema Database

```prisma
model AffiliateLedgerEntry {
  id              String              @id @default(cuid())
  affiliateId     String

  type            LedgerEntryType
  amount          Int                 // Positif = crédit, négatif = débit
  currency        String              @default("EUR")

  // Balance après cette transaction
  balanceAfter    Int

  // Références
  commissionId    String?
  withdrawalId    String?
  adjustmentId    String?

  // Metadata
  description     String
  metadata        Json?

  createdAt       DateTime            @default(now())
  createdBy       String?             // Owner ID si ajustement manuel

  affiliate       WeoktoUser          @relation(fields: [affiliateId], references: [id])
  commission      AffiliateCommission? @relation(fields: [commissionId], references: [id])
  withdrawal      WithdrawalRequest?  @relation(fields: [withdrawalId], references: [id])

  @@index([affiliateId, createdAt])
  @@index([type])
  @@map("affiliate_ledger")
}

enum LedgerEntryType {
  COMMISSION_EARNED      // Commission créée
  COMMISSION_MATURED     // Commission déblo quée
  COMMISSION_CLAWED_BACK // Remboursement client
  WITHDRAWAL_REQUESTED   // Demande de retrait
  WITHDRAWAL_APPROVED    // Retrait approuvé
  WITHDRAWAL_PAID        // Retrait payé
  WITHDRAWAL_REJECTED    // Retrait rejeté (re-crédit)
  ADJUSTMENT_CREDIT      // Ajustement manuel (crédit)
  ADJUSTMENT_DEBIT       // Ajustement manuel (débit)
  FEE_DEDUCTED          // Frais déduits

  @@map("ledger_entry_type")
}
```

### Création Entrée Ledger

```typescript
// lib/ledger/create.ts

export async function createLedgerEntry(data: {
  affiliateId: string
  type: LedgerEntryType
  amount: number
  description: string
  commissionId?: string
  withdrawalId?: string
  metadata?: any
  createdBy?: string
}) {
  // 1. Calculer nouvelle balance
  const currentBalance = await getAffiliateBalance(data.affiliateId)
  const balanceAfter = currentBalance + data.amount

  // 2. Créer entrée
  const entry = await prisma.affiliateLedgerEntry.create({
    data: {
      affiliateId: data.affiliateId,
      type: data.type,
      amount: data.amount,
      currency: 'EUR',
      balanceAfter,
      description: data.description,
      commissionId: data.commissionId,
      withdrawalId: data.withdrawalId,
      metadata: data.metadata,
      createdBy: data.createdBy
    }
  })

  return entry
}

async function getAffiliateBalance(affiliateId: string): Promise<number> {
  // Récupérer dernière entrée ledger
  const lastEntry = await prisma.affiliateLedgerEntry.findFirst({
    where: { affiliateId },
    orderBy: { createdAt: 'desc' }
  })

  return lastEntry?.balanceAfter || 0
}
```

### Hooks Automatiques

```typescript
// lib/ledger/hooks.ts

// Hook: Quand commission mature
export async function onCommissionMatured(commission: AffiliateCommission) {
  await createLedgerEntry({
    affiliateId: commission.affiliateId,
    type: 'COMMISSION_MATURED',
    amount: commission.lockedAmount, // Portion qui mature
    description: `Commission mature - ${commission.metadata?.lockProfile}`,
    commissionId: commission.id,
    metadata: {
      productId: commission.affiliateProgramId,
      lockPeriodDays: commission.lockPeriodDays
    }
  })
}

// Hook: Quand commission partiellement mature
export async function onCommissionPartiallyMatured(commission: AffiliateCommission) {
  await createLedgerEntry({
    affiliateId: commission.affiliateId,
    type: 'COMMISSION_MATURED',
    amount: commission.lockedAmount,
    description: `Commission partiellement mature (${commission.lockedAmount / 100}€)`,
    commissionId: commission.id,
    metadata: {
      partial: true,
      remainingLocked: commission.extendedLockAmount
    }
  })
}

// Hook: Clawback (refund)
export async function onCommissionClawedBack(commission: AffiliateCommission) {
  await createLedgerEntry({
    affiliateId: commission.affiliateId,
    type: 'COMMISSION_CLAWED_BACK',
    amount: -commission.totalAmount, // Négatif = débit
    description: `Remboursement client - Commission annulée`,
    commissionId: commission.id,
    metadata: {
      reason: 'customer_refund'
    }
  })
}
```

---

## 💸 SYSTÈME DE PAYOUTS (RETRAITS)

### Règles

- **Minimum** : 30€
- **Frais WEOKTO** : 3%
- **Condition** : Seules les commissions **MATURED** peuvent être retirées
- **Méthode** : Manuelle (à définir : virement, Stripe Connect, PayPal, etc.)
- **Validation** : Owner doit approuver chaque retrait

### Schema Database (déjà existant + extension)

```prisma
model WithdrawalRequest {
  id              String           @id @default(cuid())
  affiliateId     String

  // Montants
  requestedAmount Int              // Montant demandé (avant frais)
  feeAmount       Int              // 3% de frais
  netAmount       Int              // Montant net à payer

  currency        String           @default("EUR")

  status          WithdrawalStatus @default(PENDING_REVIEW)

  // Dates
  requestedAt     DateTime         @default(now())
  reviewedAt      DateTime?
  approvedAt      DateTime?
  paidAt          DateTime?
  rejectedAt      DateTime?

  // Paiement
  paymentMethod   String?          // "manual" | "stripe" | "paypal" | "wire"
  payoutReference String?          // Référence transaction
  payoutProof     String?          // URL preuve de paiement

  // Notes
  notes           String?          // Notes internes
  rejectionReason String?

  metadata        Json?

  createdAt       DateTime         @default(now())
  updatedAt       DateTime         @updatedAt

  affiliate       WeoktoUser       @relation(fields: [affiliateId], references: [id])
  ledgerEntries   AffiliateLedgerEntry[]

  @@index([status])
  @@index([affiliateId])
  @@map("withdrawal_requests")
}

enum WithdrawalStatus {
  PENDING_REVIEW   // En attente review owner
  APPROVED         // Approuvé, en attente paiement
  PAID             // Payé
  REJECTED         // Rejeté
  CANCELLED        // Annulé par affilié

  @@map("withdrawal_status")
}
```

### Demande de Retrait (Affilié)

```typescript
// POST /api/affiliate/withdrawals/request

export async function POST(request: Request) {
  const userId = request.headers.get('x-user-id')
  const { requestedAmount } = await request.json()

  // 1. Vérifier balance disponible
  const balance = await getAffiliateAvailableBalance(userId)

  if (balance < 3000) { // 30€ en centimes
    return NextResponse.json(
      { error: 'Minimum 30€ requis' },
      { status: 400 }
    )
  }

  if (requestedAmount > balance) {
    return NextResponse.json(
      { error: 'Solde insuffisant' },
      { status: 400 }
    )
  }

  // 2. Calculer frais (3%)
  const feeAmount = Math.floor(requestedAmount * 0.03)
  const netAmount = requestedAmount - feeAmount

  // 3. Créer demande
  const withdrawal = await prisma.withdrawalRequest.create({
    data: {
      affiliateId: userId,
      requestedAmount,
      feeAmount,
      netAmount,
      status: 'PENDING_REVIEW',
      paymentMethod: 'manual'
    }
  })

  // 4. Créer entrée ledger (réservation)
  await createLedgerEntry({
    affiliateId: userId,
    type: 'WITHDRAWAL_REQUESTED',
    amount: -requestedAmount, // Débit
    description: `Demande de retrait #${withdrawal.id.slice(0, 8)}`,
    withdrawalId: withdrawal.id,
    metadata: {
      feeAmount,
      netAmount
    }
  })

  return NextResponse.json({ withdrawal })
}

async function getAffiliateAvailableBalance(affiliateId: string): Promise<number> {
  // Solde = commissions MATURED - withdrawals en cours/payés
  const commissions = await prisma.affiliateCommission.aggregate({
    _sum: { totalAmount: true },
    where: {
      affiliateId,
      status: 'MATURED'
    }
  })

  const withdrawals = await prisma.withdrawalRequest.aggregate({
    _sum: { requestedAmount: true },
    where: {
      affiliateId,
      status: { in: ['PENDING_REVIEW', 'APPROVED', 'PAID'] }
    }
  })

  const available = (commissions._sum.totalAmount || 0) - (withdrawals._sum.requestedAmount || 0)
  return Math.max(0, available)
}
```

### Approbation/Rejet (Owner)

```typescript
// PATCH /api/owner/withdrawals/[id]/review

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { action, notes, payoutReference } = await request.json()

  const withdrawal = await prisma.withdrawalRequest.findUnique({
    where: { id: params.id }
  })

  if (!withdrawal) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (action === 'approve') {
    // Approuver
    const updated = await prisma.withdrawalRequest.update({
      where: { id: params.id },
      data: {
        status: 'APPROVED',
        reviewedAt: new Date(),
        approvedAt: new Date(),
        notes
      }
    })

    // Ledger
    await createLedgerEntry({
      affiliateId: withdrawal.affiliateId,
      type: 'WITHDRAWAL_APPROVED',
      amount: 0, // Pas de changement balance (déjà débité)
      description: `Retrait approuvé - En attente paiement`,
      withdrawalId: withdrawal.id
    })

    return NextResponse.json({ success: true, withdrawal: updated })
  }

  if (action === 'reject') {
    // Rejeter = re-créditer
    const updated = await prisma.withdrawalRequest.update({
      where: { id: params.id },
      data: {
        status: 'REJECTED',
        reviewedAt: new Date(),
        rejectedAt: new Date(),
        rejectionReason: notes
      }
    })

    // Re-créditer
    await createLedgerEntry({
      affiliateId: withdrawal.affiliateId,
      type: 'WITHDRAWAL_REJECTED',
      amount: withdrawal.requestedAmount, // Positif = re-crédit
      description: `Retrait rejeté - Solde restauré`,
      withdrawalId: withdrawal.id,
      metadata: { reason: notes }
    })

    return NextResponse.json({ success: true, withdrawal: updated })
  }

  if (action === 'mark_paid') {
    // Marquer comme payé
    const updated = await prisma.withdrawalRequest.update({
      where: { id: params.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        payoutReference,
        notes
      }
    })

    // Ledger - Frais
    await createLedgerEntry({
      affiliateId: withdrawal.affiliateId,
      type: 'FEE_DEDUCTED',
      amount: -withdrawal.feeAmount,
      description: `Frais retrait (3%)`,
      withdrawalId: withdrawal.id
    })

    // Ledger - Paiement
    await createLedgerEntry({
      affiliateId: withdrawal.affiliateId,
      type: 'WITHDRAWAL_PAID',
      amount: 0,
      description: `Retrait payé - ${withdrawal.netAmount / 100}€`,
      withdrawalId: withdrawal.id,
      metadata: {
        payoutReference,
        paymentMethod: withdrawal.paymentMethod
      }
    })

    // Marquer commissions comme PAID
    await prisma.affiliateCommission.updateMany({
      where: {
        affiliateId: withdrawal.affiliateId,
        status: 'MATURED',
        createdAt: { lte: withdrawal.requestedAt }
      },
      data: { status: 'PAID' }
    })

    return NextResponse.json({ success: true, withdrawal: updated })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
```

### Interface Affilié - Withdrawals

```typescript
// app/affiliate/withdrawals/page.tsx

export default function WithdrawalsPage() {
  const { balance, withdrawals } = useWithdrawals()
  const [amount, setAmount] = useState('')

  const handleRequest = async () => {
    const amountCents = Math.floor(parseFloat(amount) * 100)

    await fetch('/api/affiliate/withdrawals/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ requestedAmount: amountCents })
    })
  }

  const feeAmount = Math.floor(parseFloat(amount || '0') * 0.03)
  const netAmount = parseFloat(amount || '0') - feeAmount

  return (
    <div className="space-y-6">
      {/* Balance */}
      <Card>
        <CardHeader>
          <h3>Solde Disponible</h3>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">
            {formatCurrency(balance.available)}
          </p>
          <p className="text-sm text-muted">
            Bloqué : {formatCurrency(balance.locked)}
          </p>
        </CardContent>
      </Card>

      {/* Demande retrait */}
      <Card>
        <CardHeader>
          <h3>Demander un Retrait</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="number"
              placeholder="Montant (min 30€)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            {amount && (
              <div className="text-sm space-y-1">
                <p>Montant demandé : {amount}€</p>
                <p>Frais WEOKTO (3%) : -{feeAmount.toFixed(2)}€</p>
                <p className="font-bold">Montant net : {netAmount.toFixed(2)}€</p>
              </div>
            )}

            <Button
              onClick={handleRequest}
              disabled={!amount || parseFloat(amount) < 30 || parseFloat(amount) * 100 > balance.available}
            >
              Demander le Retrait
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historique */}
      <Card>
        <CardHeader>
          <h3>Historique des Retraits</h3>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Net</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {withdrawals.map(w => (
                <TableRow key={w.id}>
                  <TableCell>{formatDate(w.requestedAt)}</TableCell>
                  <TableCell>{formatCurrency(w.requestedAmount)}</TableCell>
                  <TableCell>
                    <StatusBadge status={w.status} />
                  </TableCell>
                  <TableCell>{formatCurrency(w.netAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
```

---

## 🎮 FEATURES FUTURES (GAMIFICATION)

Ces systèmes sont documentés pour faciliter leur implémentation ultérieure. Ils forment un **écosystème de gamification complet** pour motiver et récompenser les affiliés WEOKTO.

---

### 1. SYSTÈME DE COMPÉTITIONS

**Principe** : Classement automatique des affiliés basé sur les ventes générées, avec récompenses exclusives.

#### Types de Compétitions

```
┌─────────────────────────────────────────────────────────────┐
│ 1. HEBDOMADAIRE (7 jours)                                   │
│    • Sprint intensif                                         │
│    • Récompenses : 1K-5K Pearls, boosts temporaires        │
│    • Reset chaque lundi 00h00                               │
├─────────────────────────────────────────────────────────────┤
│ 2. MENSUELLE (30 jours)                                     │
│    • Challenge régulier                                      │
│    • Récompenses : 10K-50K Pearls, cosmétiques exclusifs   │
│    • Reset 1er du mois                                      │
├─────────────────────────────────────────────────────────────┤
│ 3. SAISONNIÈRE (trimestre)                                  │
│    • Grand championnat                                       │
│    • Récompenses : Voyages, voitures, 100K+ Pearls         │
│    • Reset fin de saison (dates annoncées à l'avance)      │
└─────────────────────────────────────────────────────────────┘
```

#### Modes de Compétition

```prisma
enum CompetitionMode {
  SOLO      // Classement individuel
  GUILD     // Classement par guilde (somme membres)
}
```

**Note** : Le mode "Clans" (petits groupes 3-8 personnes) a été retiré pour simplifier.

#### Schema Database

```prisma
model Competition {
  id          String           @id @default(cuid())

  // Type
  type        CompetitionType  // WEEKLY | MONTHLY | SEASONAL
  mode        CompetitionMode  // SOLO | GUILD

  // Période
  startDate   DateTime
  endDate     DateTime

  // Config
  name        String           // "Sprint Hebdo #42"
  description String?

  // Récompenses (JSON)
  rewards     Json             // { "1": "10000_pearls", "2": "5000_pearls", ... }

  isActive    Boolean          @default(true)

  createdAt   DateTime         @default(now())

  leaderboard CompetitionLeaderboardEntry[]

  @@index([type, startDate, endDate])
  @@map("competitions")
}

model CompetitionLeaderboardEntry {
  id             String      @id @default(cuid())
  competitionId  String

  // Participant
  userId         String?     // Si mode SOLO
  guildId        String?     // Si mode GUILD

  // Stats
  totalSales     Int         @default(0) // En centimes
  salesCount     Int         @default(0)
  rank           Int?        // Calculé

  // Récompense
  rewardClaimed  Boolean     @default(false)
  claimedAt      DateTime?

  updatedAt      DateTime    @updatedAt

  competition    Competition @relation(fields: [competitionId], references: [id])
  user           WeoktoUser? @relation(fields: [userId], references: [id])

  @@unique([competitionId, userId])
  @@unique([competitionId, guildId])
  @@index([competitionId, totalSales])
  @@map("competition_leaderboard")
}

enum CompetitionType {
  WEEKLY
  MONTHLY
  SEASONAL

  @@map("competition_type")
}

enum CompetitionMode {
  SOLO
  GUILD

  @@map("competition_mode")
}
```

#### Fonctionnement

**1. Inscription Automatique**
```typescript
// Dès qu'un affilié réalise sa première vente, il est automatiquement inscrit
async function onAffiliateCommissionCreated(commission: AffiliateCommission) {
  const activeCompetitions = await prisma.competition.findMany({
    where: {
      isActive: true,
      startDate: { lte: new Date() },
      endDate: { gte: new Date() }
    }
  })

  for (const comp of activeCompetitions) {
    if (comp.mode === 'SOLO') {
      await prisma.competitionLeaderboardEntry.upsert({
        where: {
          competitionId_userId: {
            competitionId: comp.id,
            userId: commission.affiliateId
          }
        },
        update: {
          totalSales: { increment: commission.amount },
          salesCount: { increment: 1 }
        },
        create: {
          competitionId: comp.id,
          userId: commission.affiliateId,
          totalSales: commission.amount,
          salesCount: 1
        }
      })
    }

    if (comp.mode === 'GUILD') {
      const user = await prisma.weoktoUser.findUnique({
        where: { id: commission.affiliateId }
      })

      if (user.currentGuildId) {
        await prisma.competitionLeaderboardEntry.upsert({
          where: {
            competitionId_guildId: {
              competitionId: comp.id,
              guildId: user.currentGuildId
            }
          },
          update: {
            totalSales: { increment: commission.amount },
            salesCount: { increment: 1 }
          },
          create: {
            competitionId: comp.id,
            guildId: user.currentGuildId,
            totalSales: commission.amount,
            salesCount: 1
          }
        })
      }
    }
  }
}
```

**2. Calcul du Classement (CRON quotidien)**
```typescript
async function updateCompetitionRankings() {
  const activeCompetitions = await prisma.competition.findMany({
    where: { isActive: true }
  })

  for (const comp of activeCompetitions) {
    const entries = await prisma.competitionLeaderboardEntry.findMany({
      where: { competitionId: comp.id },
      orderBy: { totalSales: 'desc' }
    })

    // Attribuer rang
    for (let i = 0; i < entries.length; i++) {
      await prisma.competitionLeaderboardEntry.update({
        where: { id: entries[i].id },
        data: { rank: i + 1 }
      })
    }
  }
}
```

**3. Distribution Récompenses (fin de compétition)**
```typescript
async function distributeCompetitionRewards(competitionId: string) {
  const competition = await prisma.competition.findUnique({
    where: { id: competitionId },
    include: { leaderboard: { orderBy: { rank: 'asc' } } }
  })

  const rewards = competition.rewards as Record<string, string>

  for (const entry of competition.leaderboard) {
    const reward = rewards[entry.rank.toString()]
    if (!reward) continue

    // Parse reward (ex: "10000_pearls", "voyage_bali")
    const [amount, type] = reward.split('_')

    if (type === 'pearls') {
      await prisma.weoktoUser.update({
        where: { id: entry.userId },
        data: {
          pearlBalance: { increment: parseInt(amount) }
        }
      })

      await prisma.pearlTransaction.create({
        data: {
          userId: entry.userId,
          type: 'COMPETITION_REWARD',
          amount: parseInt(amount),
          description: `Récompense ${competition.name} - Rang ${entry.rank}`
        }
      })
    }

    await prisma.competitionLeaderboardEntry.update({
      where: { id: entry.id },
      data: {
        rewardClaimed: true,
        claimedAt: new Date()
      }
    })
  }
}
```

#### Interface Frontend

**Leaderboard en temps réel**
```typescript
// app/competition/page.tsx
export default function CompetitionPage() {
  const { competitions, activeTab } = useCompetitions()
  const { leaderboard, myRank } = useLeaderboard(activeTab)

  return (
    <div>
      {/* Tabs: Hebdo / Mensuel / Saison */}
      <Tabs value={activeTab}>
        <TabsList>
          <TabsTrigger value="weekly">Hebdomadaire</TabsTrigger>
          <TabsTrigger value="monthly">Mensuelle</TabsTrigger>
          <TabsTrigger value="seasonal">Saisonnière</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Ma position */}
      <Card>
        <p>Ton rang : #{myRank}</p>
        <p>Ventes totales : {formatCurrency(myStats.totalSales)}</p>
      </Card>

      {/* Leaderboard */}
      <Table>
        {leaderboard.map((entry, i) => (
          <TableRow key={entry.id}>
            <TableCell>#{i + 1}</TableCell>
            <TableCell>{entry.user.displayName}</TableCell>
            <TableCell>{entry.guild?.name}</TableCell>
            <TableCell>{formatCurrency(entry.totalSales)}</TableCell>
            <TableCell>{rewards[i + 1]}</TableCell>
          </TableRow>
        ))}
      </Table>
    </div>
  )
}
```

---

### 2. SYSTÈME PEARLS

**Principe** : Monnaie virtuelle de récompense pour acheter cosmétiques, boosts et expériences exclusives.

#### Règles de Base

- **1€ de vente générée = 2 Pearls**
- Calculé sur **montant total vente**, pas sur la commission
- Pearls **non convertibles** en argent réel
- **Jamais d'expiration**
- Multiplicateurs possibles (événements spéciaux)

#### Schema Database

```prisma
model WeoktoUser {
  // ... (autres champs)

  pearlBalance    Int              @default(0)
  pearlsEarned    Int              @default(0) // Total historique
  pearlsSpent     Int              @default(0)

  pearlTransactions PearlTransaction[]
  userCosmetics     UserCosmetic[]
}

model PearlTransaction {
  id          String              @id @default(cuid())
  userId      String

  type        PearlTransactionType
  amount      Int                 // Positif = gain, négatif = dépense

  description String
  metadata    Json?               // Context additionnel

  createdAt   DateTime            @default(now())

  user        WeoktoUser          @relation(fields: [userId], references: [id])

  @@index([userId, createdAt])
  @@map("pearl_transactions")
}

enum PearlTransactionType {
  SALE           // Vente générée
  COMPETITION    // Récompense compétition
  BONUS          // Bonus manuel
  PURCHASE       // Achat cosmétique
  BOOST          // Achat boost
  EVENT          // Achat événement

  @@map("pearl_transaction_type")
}
```

#### Attribution Automatique

```typescript
// Déclenché après création AffiliateCommission
async function awardPearlsForSale(commission: AffiliateCommission) {
  // Récupérer montant vente (pas la commission)
  const invoice = await prisma.invoice.findUnique({
    where: { id: commission.invoiceId }
  })

  const saleAmount = invoice.amountIncludingTax // En centimes
  const pearlsToAward = Math.floor((saleAmount / 100) * 2) // 1€ = 2 Pearls

  // Ajouter Pearls
  await prisma.weoktoUser.update({
    where: { id: commission.affiliateId },
    data: {
      pearlBalance: { increment: pearlsToAward },
      pearlsEarned: { increment: pearlsToAward }
    }
  })

  // Transaction historique
  await prisma.pearlTransaction.create({
    data: {
      userId: commission.affiliateId,
      type: 'SALE',
      amount: pearlsToAward,
      description: `Vente de ${saleAmount / 100}€`,
      metadata: {
        commissionId: commission.id,
        invoiceId: invoice.id
      }
    }
  })
}
```

#### Boutique Pearls

**Catégories de récompenses :**

```typescript
interface PearlReward {
  id: string
  category: 'cosmetic' | 'boost' | 'event' | 'experience'
  name: string
  price: number // En Pearls
  description: string
  available: boolean
}

const PEARL_REWARDS: PearlReward[] = [
  // Cosmétiques
  {
    id: 'skin-terminal-elite',
    category: 'cosmetic',
    name: 'Skin Terminal Elite',
    price: 2400,
    description: 'Skin animé exclusif pour ton profil'
  },
  {
    id: 'badge-legendary',
    category: 'cosmetic',
    name: 'Badge Legendary',
    price: 1800,
    description: 'Badge doré avec animation'
  },

  // Boosts
  {
    id: 'boost-commission-5',
    category: 'boost',
    name: 'Boost Commission +5%',
    price: 5000,
    description: '30 jours de boost commission sur tous produits'
  },

  // Événements
  {
    id: 'event-mastermind-bali',
    category: 'event',
    name: 'Mastermind Bali 2025',
    price: 15000,
    description: '5 jours all-inclusive + sessions privées'
  },

  // Expériences
  {
    id: 'exp-1on1-founder',
    category: 'experience',
    name: 'Session 1:1 CEO',
    price: 4800,
    description: '2h avec un fondateur WEOKTO'
  }
]
```

#### Achat avec Pearls

```typescript
// POST /api/pearls/purchase
async function purchaseWithPearls(userId: string, rewardId: string) {
  const user = await prisma.weoktoUser.findUnique({ where: { id: userId } })
  const reward = PEARL_REWARDS.find(r => r.id === rewardId)

  if (!reward || !reward.available) {
    throw new Error('Reward not available')
  }

  if (user.pearlBalance < reward.price) {
    throw new Error('Insufficient pearls')
  }

  // Transaction atomique
  await prisma.$transaction([
    // Débiter Pearls
    prisma.weoktoUser.update({
      where: { id: userId },
      data: {
        pearlBalance: { decrement: reward.price },
        pearlsSpent: { increment: reward.price }
      }
    }),

    // Historique
    prisma.pearlTransaction.create({
      data: {
        userId,
        type: 'PURCHASE',
        amount: -reward.price,
        description: `Achat: ${reward.name}`,
        metadata: { rewardId }
      }
    }),

    // Si cosmétique, l'ajouter
    ...(reward.category === 'cosmetic' ? [
      prisma.userCosmetic.create({
        data: {
          userId,
          cosmeticId: reward.id,
          obtainedAt: new Date()
        }
      })
    ] : [])
  ])

  return { success: true }
}
```

---

### 3. SYSTÈME MYOKTO (PROFIL CUSTOMISABLE)

**Principe** : Page profil personnalisable avec cosmétiques obtenus via Pearls.

#### Schema Database

```prisma
model Cosmetic {
  id          String           @id @default(cuid())

  type        CosmeticType     // BADGE | AVATAR_FRAME | BACKGROUND | EFFECT

  name        String
  description String?
  rarity      CosmeticRarity   @default(COMMON)

  // Assets
  imageUrl    String?
  animationUrl String?         // Pour effets animés

  // Prix
  pearlPrice  Int

  isActive    Boolean          @default(true)

  createdAt   DateTime         @default(now())

  users       UserCosmetic[]

  @@map("cosmetics")
}

model UserCosmetic {
  id          String    @id @default(cuid())
  userId      String
  cosmeticId  String

  // Equipped
  isEquipped  Boolean   @default(false)

  obtainedAt  DateTime  @default(now())
  equippedAt  DateTime?

  user        WeoktoUser @relation(fields: [userId], references: [id])
  cosmetic    Cosmetic   @relation(fields: [cosmeticId], references: [id])

  @@unique([userId, cosmeticId])
  @@index([userId])
  @@map("user_cosmetics")
}

enum CosmeticType {
  BADGE          // Badge à côté du nom
  AVATAR_FRAME   // Bordure autour de l'avatar
  BACKGROUND     // Fond de profil
  EFFECT         // Effet visuel animé
  TITLE          // Titre sous le nom

  @@map("cosmetic_type")
}

enum CosmeticRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY

  @@map("cosmetic_rarity")
}
```

#### Interface MyOkto

```typescript
// app/myokto/page.tsx
export default function MyOktoPage() {
  const { user, cosmetics, equipped } = useMyOkto()

  return (
    <div className="grid grid-cols-[1fr_400px]">
      {/* Preview Profile */}
      <div>
        <ProfilePreview
          user={user}
          equipped={equipped}
        />
      </div>

      {/* Inventory */}
      <aside>
        <Tabs>
          <TabsList>
            <TabsTrigger value="badges">Badges</TabsTrigger>
            <TabsTrigger value="frames">Cadres</TabsTrigger>
            <TabsTrigger value="backgrounds">Fonds</TabsTrigger>
            <TabsTrigger value="effects">Effets</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-2 gap-2">
          {cosmetics.map(c => (
            <CosmeticCard
              key={c.id}
              cosmetic={c}
              isEquipped={equipped.includes(c.id)}
              onEquip={() => equipCosmetic(c.id)}
            />
          ))}
        </div>
      </aside>
    </div>
  )
}
```

#### Équiper Cosmétique

```typescript
// POST /api/myokto/equip
async function equipCosmetic(userId: string, cosmeticId: string) {
  const cosmetic = await prisma.cosmetic.findUnique({
    where: { id: cosmeticId }
  })

  // Vérifier possession
  const userCosmetic = await prisma.userCosmetic.findUnique({
    where: {
      userId_cosmeticId: { userId, cosmeticId }
    }
  })

  if (!userCosmetic) {
    throw new Error('You do not own this cosmetic')
  }

  // Déséquiper autres du même type
  await prisma.userCosmetic.updateMany({
    where: {
      userId,
      cosmetic: { type: cosmetic.type },
      isEquipped: true
    },
    data: { isEquipped: false }
  })

  // Équiper celui-ci
  await prisma.userCosmetic.update({
    where: { id: userCosmetic.id },
    data: {
      isEquipped: true,
      equippedAt: new Date()
    }
  })
}
```

---

### 4. OKTO AI (PHASE 2 - OPTIONNEL)

**Principe** : SaaS de création de contenu pour réseaux sociaux, intégré à WEOKTO.

**Status** : Feature avancée à implémenter en Phase 2, après MVP stable.

#### Fonctionnalités Prévues

- Génération de posts (texte + visuels) pour Instagram, TikTok, LinkedIn
- Calendrier de publication automatisé
- Templates personnalisables
- Analyse de performance
- AI copywriting adapté à l'audience

#### Architecture Technique

```
┌─────────────────────────────────────────────────────────┐
│                    WEOKTO Frontend                       │
│                                                          │
│  Route: /oktoai                                          │
│  • Iframe ou React Query vers API Okto AI              │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    OKTO AI (Service séparé)             │
│                                                          │
│  • Backend Node.js/Python                               │
│  • Base de données séparée                              │
│  • Intégration OpenAI/Anthropic                         │
│  • Intégration APIs sociales (Meta, TikTok)            │
└─────────────────────────────────────────────────────────┘
```

#### Schema Database (minimal)

```prisma
// Dans WEOKTO DB
model WeoktoUser {
  // ... autres champs

  oktoAiEnabled    Boolean  @default(false)
  oktoAiApiKey     String?  // Pour communiquer avec service Okto AI
}

// Dans Okto AI DB (séparée)
model OktoAiUser {
  id              String   @id @default(cuid())
  weoktoUserId    String   @unique

  creditsRemaining Int     @default(0)
  plan            String   @default("free")

  posts           AiPost[]
  templates       AiTemplate[]
}
```

**Priorité** : Basse, à documenter plus en détail lors de la Phase 2.

---

### Résumé Implémentation

**MVP (Phase 1)** :
- ✅ Compétitions : Backend complet + Leaderboard basique
- ✅ Pearls : Attribution automatique + Boutique simple
- ✅ MyOkto : Profil customisable + 5-10 cosmétiques de base

**Phase 2** :
- ⏸️ Okto AI : Service complet de création de contenu

**Avantages de cette approche** :
- Architecture pensée dès le début
- Pas de refonte database plus tard
- Implémentation progressive sans cassure
- Gamification complète qui motive les affiliés

---

**Document maintenu par l'équipe de développement**
**Dernière mise à jour** : 2025-10-08
**Version** : 1.1.0
