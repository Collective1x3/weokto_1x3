# 🗄️ SCHEMA DATABASE FINAL - WEOKTO & STAM

**Version définitive consolidée**
**Date** : 2025-01-08
**Status** : Production-Ready

---

## 📌 RÈGLES IMPORTANTES

### Sécurité PCI Vault
**AUCUNE donnée de carte bancaire n'est stockée dans notre database.**
- PCI Vault fonctionne en **mode proxy uniquement**
- Nous stockons uniquement les **tokens** PCI Vault
- Les champs `brand`, `last4`, `expMonth`, `expYear` sont fournis par PCI Vault après tokenization
- Ces champs sont **en lecture seule** et ne contiennent jamais de données sensibles complètes

### Architecture
- **1 base de données PostgreSQL** pour WEOKTO + STAM
- **Platform enum** pour séparer les contextes
- **Pas de multi-tenancy** : Vous êtes le seul propriétaire
- **Pas de logos/descriptions pour communautés** : Tout est codé à la main

### Rôles Utilisateurs
- `CLIENT` : Utilisateur lambda
- `AFFILIATE` : Affilié actif
- `ADMIN` : Administrateur (gestion globale système)
- `PRODUCT_MANAGER` : Gestionnaire de produits (création/modification produits)
- `OWNER` : Propriétaire (vous, accès total)

---

## 🔐 PRISMA SCHEMA COMPLET

```prisma
// ============================================================================
// CONFIGURATION
// ============================================================================

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// ============================================================================
// ENUMS GLOBAUX
// ============================================================================

enum Platform {
  WEOKTO  // weokto.com - Affiliés & Guildes
  STAM    // be-stam.com - Clients & Communautés

  @@map("platform")
}

enum UserType {
  CLIENT           // Utilisateur lambda
  AFFILIATE        // Affilié actif
  ADMIN            // Administrateur système
  PRODUCT_MANAGER  // Gestionnaire de produits
  OWNER            // Propriétaire

  @@map("user_type")
}

enum MemberRole {
  MEMBER
  MODERATOR
  ADMIN

  @@map("member_role")
}

// ============================================================================
// AUTHENTIFICATION
// ============================================================================

model WeoktoSession {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      WeoktoUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@map("weokto_sessions")
}

model StamSession {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  createdAt DateTime @default(now())

  user      StamUser @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
  @@map("stam_sessions")
}

model MagicLinkToken {
  id        String   @id @default(cuid())
  email     String   @db.Citext
  token     String   @unique
  platform  Platform
  expiresAt DateTime
  usedAt    DateTime?
  createdAt DateTime @default(now())

  @@index([email, platform])
  @@index([token])
  @@map("magic_link_tokens")
}

// ============================================================================
// UTILISATEURS WEOKTO (Affiliés)
// ============================================================================

model WeoktoUser {
  id                String    @id @default(cuid())
  email             String    @unique @db.Citext
  authId            String    @unique
  displayName       String?
  avatarUrl         String?
  bio               String?

  // Rôle
  userType          UserType  @default(CLIENT)

  // Affiliation - Tracking risque
  firstCommissionAt DateTime?    // Première commission reçue (pour ancienneté)
  totalRefunds      Int          @default(0)
  refundRate        Decimal      @default(0) @db.Decimal(5, 4) // 0.0000 à 1.0000
  riskLevel         AffiliateRiskLevel @default(NORMAL)

  // Gamification
  pearlBalance      Int          @default(0)
  pearlsEarned      Int          @default(0)
  pearlsSpent       Int          @default(0)

  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  lastLoginAt       DateTime?

  // Relations
  sessions              WeoktoSession[]
  communityMemberships  CommunityMember[]
  affiliateProfile      AffiliateProfile?
  affiliateCommissions  AffiliateCommission[]
  trackingEvents        AffiliateTrackingEvent[]
  attributions          AffiliateAttribution[]
  boostRedemptions      AffiliateBoostRedemption[]
  withdrawalRequests    WithdrawalRequest[]
  ledgerEntries         AffiliateLedgerEntry[]
  pearlTransactions     PearlTransaction[]
  userCosmetics         UserCosmetic[]
  competitionEntries    CompetitionLeaderboardEntry[]

  @@index([email])
  @@index([userType])
  @@index([riskLevel])
  @@map("weokto_users")
}

model AffiliateProfile {
  id                    String   @id @default(cuid())
  userId                String   @unique

  // Stats
  totalCommissionsEarned Int     @default(0)
  totalWithdrawn        Int      @default(0)
  totalRefunded         Int      @default(0)
  debtAmount            Int      @default(0) // Dette suite clawback si commission déjà payée

  // Guild (obligatoire pour affiliés)
  currentGuildId        String?
  guildJoinedAt         DateTime?
  lastGuildChangeAt     DateTime? // Pour limite 1x/30j

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  user                  WeoktoUser @relation(fields: [userId], references: [id])

  @@map("affiliate_profiles")
}

enum AffiliateRiskLevel {
  NORMAL              // Compte normal
  AT_RISK             // Surveillance (15%+ refund)
  HIGH_RISK           // Risque élevé (25%+ refund)
  EXTREME_RISK        // Risque extrême (40%+ refund, manuel)

  @@map("affiliate_risk_level")
}

// ============================================================================
// UTILISATEURS STAM (Clients)
// ============================================================================

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

  @@index([email])
  @@map("stam_users")
}

// ============================================================================
// COMMUNAUTÉS (Unifié pour WEOKTO & STAM)
// ============================================================================

model Community {
  id              String   @id @default(cuid())

  // Type de plateforme
  platform        Platform // WEOKTO = Guilde | STAM = Communauté

  // Identification
  name            String
  slug            String   @unique

  // ⚠️ PAS DE LOGO/BANNER/DESCRIPTION : Tout est codé à la main
  // imageUrl, bannerUrl, description → SUPPRIMÉS

  // Configuration
  domain          String?  @unique
  settings        Json?    // Config chat, permissions, etc.

  // Marketplace (WEOKTO uniquement - faux fournisseurs)
  supplierId      String?  // ID du faux fournisseur
  supplierName    String?  // Nom affiché ("Fournisseur A")

  // Landing page custom (URL vers page codée à la main)
  landingPageUrl  String?

  // Admin
  ownerNotes      String?  // Notes privées owner
  isActive        Boolean  @default(true)

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  products        Product[]
  members         CommunityMember[]
  formations      Formation[]
  channels        Channel[]
  categories      ChannelCategory[]

  @@index([platform])
  @@index([slug])
  @@map("communities")
}

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
  lastReadAt      DateTime?    // Pour unread messages
  isActive        Boolean      @default(true)

  // Paiement
  customerId      String?
  currentProductId String?      // Produit/tier actuel

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  // Relations
  community       Community
  weoktoUser      WeoktoUser?  @relation(fields: [weoktoUserId], references: [id])
  stamUser        StamUser?    @relation(fields: [stamUserId], references: [id])
  customer        Customer?    @relation(fields: [customerId], references: [id])
  messages        Message[]

  @@unique([communityId, weoktoUserId])
  @@unique([communityId, stamUserId])
  @@index([communityId])
  @@index([weoktoUserId])
  @@index([stamUserId])
  @@map("community_members")
}

// ============================================================================
// PRODUITS & PRICING
// ============================================================================

model Product {
  id              String   @id @default(cuid())
  communityId     String
  slug            String   @unique

  name            String
  shortDescription String?

  // Type
  isFree          Boolean  @default(false)
  requiresTrial   Boolean  @default(false)

  // Statut
  isActive        Boolean  @default(true)
  isPublished     Boolean  @default(false)
  publishedAt     DateTime?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  community       Community
  plans           Plan[]
  affiliateProgram AffiliateProgram?
  customers       Customer[]
  productAccess   ProductAccess[]

  @@index([communityId])
  @@index([slug])
  @@map("products")
}

model Plan {
  id              String   @id @default(cuid())
  productId       String
  slug            String   @unique

  name            String
  description     String?

  // Pricing
  priceAmount     Int      // En centimes
  currency        String   @default("EUR")
  billingInterval PlanInterval

  // Trial
  trialDays       Int?     // null = pas de trial
  trialAmount     Int?     // Coût trial (en centimes, 0 = gratuit)

  // Setup fee
  setupFee        Int?     // Frais d'inscription one-time

  // Limites
  maxBillingCycles Int?    // null = illimité

  // Config
  isActive        Boolean  @default(true)
  isFeatured      Boolean  @default(false)

  metadata        Json?

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  // Relations
  product         Product
  customers       Customer[]
  manualPaymentButtons ManualPaymentButton[]

  @@index([productId])
  @@index([slug])
  @@map("plans")
}

enum PlanInterval {
  ONE_TIME
  MONTHLY
  QUARTERLY
  ANNUALLY
  LIFETIME

  @@map("plan_interval")
}

// ============================================================================
// PAIEMENTS (PCI VAULT PROXY ONLY)
// ============================================================================

// ⚠️ AUCUNE DONNÉE DE CARTE BANCAIRE N'EST STOCKÉE ICI
// PCI Vault fonctionne en mode PROXY uniquement
// Nous stockons uniquement les TOKENS

model Customer {
  id              String       @id @default(cuid())
  stamUserId      String       // 1 StamUser peut avoir plusieurs Customers (1 par produit)
  productId       String

  // Current subscription
  currentPlanId   String?
  status          CustomerStatus @default(TRIAL)

  // Dates
  trialEndsAt     DateTime?
  subscriptionEndsAt DateTime?

  // PCI Vault Token (JAMAIS de données CB complètes)
  pciVaultToken   String?      // Token retourné par PCI Vault
  pciVaultRef     String?      // Référence PCI Vault

  // Info carte (partielle, fournie par PCI Vault APRÈS tokenization)
  // ⚠️ Ces champs sont EN LECTURE SEULE et ne contiennent JAMAIS de données sensibles complètes
  brand           String?      // "visa", "mastercard" (fourni par PCI Vault)
  last4           String?      // 4 derniers chiffres (fourni par PCI Vault)
  expMonth        Int?         // Mois expiration (fourni par PCI Vault)
  expYear         Int?         // Année expiration (fourni par PCI Vault)

  metadata        Json?

  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  stamUser        StamUser     @relation(fields: [stamUserId], references: [id])
  product         Product      @relation(fields: [productId], references: [id])
  plan            Plan?        @relation(fields: [currentPlanId], references: [id])
  invoices        Invoice[]
  refunds         Refund[]
  communityMembers CommunityMember[]
  attributions    AffiliateAttribution[]

  @@unique([stamUserId, productId]) // 1 seul customer par (user, produit)
  @@index([stamUserId])
  @@index([productId])
  @@index([pciVaultToken])
  @@map("customers")
}

enum CustomerStatus {
  TRIAL
  ACTIVE
  PAST_DUE
  CANCELLED
  EXPIRED

  @@map("customer_status")
}

model Invoice {
  id                    String        @id @default(cuid())
  customerId            String
  planId                String?

  // Montants
  amountExcludingTax    Int
  taxAmount             Int          @default(0)
  amountIncludingTax    Int

  currency              String       @default("EUR")

  // Statut
  status                InvoiceStatus @default(DRAFT)

  // Dates
  dueDate               DateTime?
  paidAt                DateTime?
  voidedAt              DateTime?

  // PCI Vault Payment (PROXY)
  pciVaultPaymentId     String?      // ID transaction PCI Vault
  pciVaultStatus        String?      // Status retourné par PCI Vault

  metadata              Json?

  createdAt             DateTime     @default(now())
  updatedAt             DateTime     @updatedAt

  // Relations
  customer              Customer     @relation(fields: [customerId], references: [id])
  plan                  Plan?        @relation(fields: [planId], references: [id])
  commissions           AffiliateCommission[]
  refunds               Refund[]

  @@index([customerId])
  @@index([status])
  @@index([pciVaultPaymentId])
  @@map("invoices")
}

enum InvoiceStatus {
  DRAFT
  PENDING
  PAID
  VOID
  REFUNDED

  @@map("invoice_status")
}

model Refund {
  id              String        @id @default(cuid())
  customerId      String
  invoiceId       String

  amount          Int           // Montant remboursé (centimes)
  currency        String        @default("EUR")

  reason          String?       // Raison du remboursement
  status          RefundStatus  @default(PENDING)

  requestedAt     DateTime      @default(now())
  approvedAt      DateTime?
  rejectedAt      DateTime?
  processedAt     DateTime?

  metadata        Json?

  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  customer        Customer      @relation(fields: [customerId], references: [id])
  invoice         Invoice       @relation(fields: [invoiceId], references: [id])

  @@index([customerId])
  @@index([status])
  @@map("refunds")
}

enum RefundStatus {
  PENDING
  APPROVED
  REJECTED
  PROCESSED

  @@map("refund_status")
}

// Boutons de paiement manuels (pas de checkout automatique)
model ManualPaymentButton {
  id                    String   @id @default(cuid())
  productId             String
  planId                String

  buttonKey             String   @unique // "guild-marketing-premium-monthly"
  displayName           String
  ctaText               String   @default("S'inscrire")

  // PCI Vault Configuration
  pcivaultPaymentType   String   // "subscription" | "one-time"
  pcivaultWebhookUrl    String?  // Webhook pour callback PCI Vault

  // Redirects
  successUrl            String?
  cancelUrl             String?

  isActive              Boolean  @default(true)

  metadata              Json?

  createdAt             DateTime @default(now())
  updatedAt             DateTime @updatedAt

  product               Product  @relation(fields: [productId], references: [id])
  plan                  Plan     @relation(fields: [planId], references: [id])

  @@index([buttonKey])
  @@index([productId])
  @@map("manual_payment_buttons")
}

// ============================================================================
// AFFILIATION
// ============================================================================

model AffiliateProgram {
  id                      String    @id @default(cuid())
  productId               String    @unique

  isActive                Boolean   @default(false)

  // Taux par défaut (100% customisable)
  defaultRateType         String    // "percentage" | "fixed"
  defaultRate             Decimal   @db.Decimal(10, 4)

  // Config
  cookieDurationDays      Int       @default(30)
  includeRenewals         Boolean   @default(true)

  metadata                Json?

  createdAt               DateTime  @default(now())
  updatedAt               DateTime  @updatedAt

  product                 Product   @relation(fields: [productId], references: [id])
  commissions             AffiliateCommission[]

  @@map("affiliate_programs")
}

model AffiliateTrackingEvent {
  id              String                 @id @default(cuid())

  clickId         String                 @unique
  affiliateId     String

  // Produit ciblé
  productId       String?
  platform        Platform?

  // Tracking complet
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

  affiliate       WeoktoUser             @relation(fields: [affiliateId], references: [id])
  attributions    AffiliateAttribution[]

  @@index([clickId])
  @@index([affiliateId])
  @@index([expiresAt])
  @@index([productId])
  @@map("affiliate_tracking_events")
}

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

  // Si attribution remplacée par un nouveau click (last-click)
  replacedAt               DateTime?
  replacedByEventId        String?

  metadata                 Json?

  createdAt                DateTime                @default(now())

  trackingEvent            AffiliateTrackingEvent? @relation(fields: [affiliateTrackingEventId], references: [id])
  customer                 Customer?               @relation(fields: [customerId], references: [id])
  affiliate                WeoktoUser              @relation(fields: [affiliateId], references: [id])

  @@index([customerId, productId])
  @@index([affiliateId])
  @@index([attributionExpiresAt])
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

  program              AffiliateProgram @relation(fields: [affiliateProgramId], references: [id])
  affiliate            WeoktoUser       @relation(fields: [affiliateId], references: [id])
  customer             Customer?        @relation(fields: [customerId], references: [id])
  invoice              Invoice?         @relation(fields: [invoiceId], references: [id])
  ledgerEntries        AffiliateLedgerEntry[]

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

// ============================================================================
// BOOST CODES (Non cumulables)
// ============================================================================

model AffiliateBoostCode {
  id                String    @id @default(cuid())

  code              String    @unique // "BOOST-XY7K9M"

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

  description       String?
  isActive          Boolean   @default(true)

  createdAt         DateTime  @default(now())
  createdBy         String?   // Owner ID

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

// ============================================================================
// LEDGER COMPTABLE (Immuable)
// ============================================================================

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
  COMMISSION_MATURED     // Commission débloquée
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

// ============================================================================
// PAYOUTS (Retraits Manuels)
// ============================================================================

model WithdrawalRequest {
  id              String           @id @default(cuid())
  affiliateId     String

  // Montants
  requestedAmount Int              // Montant demandé (avant frais)
  feeAmount       Int              // 3% de frais WEOKTO
  netAmount       Int              // Montant net à payer

  currency        String           @default("EUR")

  status          WithdrawalStatus @default(PENDING_REVIEW)

  // Dates
  requestedAt     DateTime         @default(now())
  reviewedAt      DateTime?
  approvedAt      DateTime?
  paidAt          DateTime?
  rejectedAt      DateTime?

  // Paiement (manuel)
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

// ============================================================================
// GAMIFICATION (Features futures)
// ============================================================================

model Competition {
  id          String           @id @default(cuid())

  type        CompetitionType  // WEEKLY | MONTHLY | SEASONAL
  mode        CompetitionMode  // SOLO | GUILD

  startDate   DateTime
  endDate     DateTime

  name        String
  description String?

  rewards     Json             // { "1": "10000_pearls", "2": "5000_pearls", ... }

  isActive    Boolean          @default(true)

  createdAt   DateTime         @default(now())

  leaderboard CompetitionLeaderboardEntry[]

  @@index([type, startDate, endDate])
  @@map("competitions")
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

model PearlTransaction {
  id          String              @id @default(cuid())
  userId      String

  type        PearlTransactionType
  amount      Int                 // Positif = gain, négatif = dépense

  description String
  metadata    Json?

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

model Cosmetic {
  id          String           @id @default(cuid())

  type        CosmeticType
  name        String
  description String?
  rarity      CosmeticRarity   @default(COMMON)

  imageUrl    String?
  animationUrl String?

  pearlPrice  Int

  isActive    Boolean          @default(true)

  createdAt   DateTime         @default(now())

  users       UserCosmetic[]

  @@map("cosmetics")
}

enum CosmeticType {
  BADGE
  AVATAR_FRAME
  BACKGROUND
  EFFECT
  TITLE

  @@map("cosmetic_type")
}

enum CosmeticRarity {
  COMMON
  RARE
  EPIC
  LEGENDARY

  @@map("cosmetic_rarity")
}

model UserCosmetic {
  id          String    @id @default(cuid())
  userId      String
  cosmeticId  String

  isEquipped  Boolean   @default(false)

  obtainedAt  DateTime  @default(now())
  equippedAt  DateTime?

  user        WeoktoUser @relation(fields: [userId], references: [id])
  cosmetic    Cosmetic   @relation(fields: [cosmeticId], references: [id])

  @@unique([userId, cosmeticId])
  @@index([userId])
  @@map("user_cosmetics")
}

// ============================================================================
// CHAT (Socket.io)
// ============================================================================

model ChannelCategory {
  id          BigInt   @id @default(autoincrement())
  communityId String
  name        String
  slug        String
  position    Int      @default(0)
  createdAt   DateTime @default(now())
  createdBy   String

  community   Community @relation(fields: [communityId], references: [id])
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

  community   Community         @relation(fields: [communityId], references: [id])
  category    ChannelCategory?  @relation(fields: [categoryId], references: [id])
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

  channel     Channel           @relation(fields: [channelId], references: [id])
  community   Community         @relation(fields: [communityId], references: [id])
  member      CommunityMember   @relation(fields: [memberId], references: [id])
  replyTo     Message?          @relation("MessageReplies", fields: [replyToId], references: [id])
  replies     Message[]         @relation("MessageReplies")
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

  message   Message @relation(fields: [messageId], references: [id])

  @@id([messageId, memberId, emoji])
  @@map("message_reactions")
}

// ============================================================================
// FORMATIONS
// ============================================================================

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

  community       Community @relation(fields: [communityId], references: [id])
  modules         FormationModule[]

  @@index([communityId])
  @@index([slug])
  @@map("formations")
}

model FormationModule {
  id              String    @id @default(cuid())
  formationId     String
  moduleIndex     Int       // Ordre séquentiel (1, 2, 3...)

  title           String
  description     String?
  videoUrl        String?   // URL Bunny.net iframe
  durationMinutes Int       @default(0)

  isPublished     Boolean   @default(false)

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  formation       Formation @relation(fields: [formationId], references: [id])
  progress        StamProgress[]

  @@unique([formationId, moduleIndex])
  @@index([formationId])
  @@map("formation_modules")
}

model StamProgress {
  id              String    @id @default(cuid())
  stamUserId      String
  formationId     String
  moduleId        String
  moduleIndex     Int

  timeSpent       Int       @default(0) // Secondes
  status          ProgressStatus @default(NOT_STARTED)

  startedAt       DateTime?
  completedAt     DateTime?

  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  stamUser        StamUser        @relation(fields: [stamUserId], references: [id])
  module          FormationModule @relation(fields: [moduleId], references: [id])

  @@unique([stamUserId, formationId, moduleIndex])
  @@index([stamUserId])
  @@index([formationId])
  @@map("stam_progress")
}

enum ProgressStatus {
  NOT_STARTED
  IN_PROGRESS
  COMPLETED

  @@map("progress_status")
}

// ============================================================================
// ACCÈS & ENTITLEMENTS
// ============================================================================

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

  product         Product  @relation(fields: [productId], references: [id])

  @@index([productId])
  @@map("product_access")
}
```

---

## 📝 NOTES IMPORTANTES

### PCI Vault - Sécurité Paiements

**RÈGLE ABSOLUE** : Nous ne stockons JAMAIS de données de carte bancaire.

**Flow PCI Vault** :
1. Frontend crée un endpoint de capture via notre backend
2. Backend appelle PCI Vault `/capture` avec notre key/passphrase
3. PCI Vault retourne `{url, secret}`
4. Frontend envoie la CB directement à PCI Vault avec le secret
5. PCI Vault retourne `{token, reference, brand, last4, expMonth, expYear}`
6. Frontend nous envoie le token
7. Nous stockons le token + infos partielles (brand, last4, etc.)

**Champs autorisés** (fournis par PCI Vault) :
- `pciVaultToken` : Token chiffré
- `brand` : "visa", "mastercard" (sans données sensibles)
- `last4` : 4 derniers chiffres (usage affichage uniquement)
- `expMonth` / `expYear` : Date expiration (usage validation uniquement)

**Champs INTERDITS** :
- ❌ `cardNumber` complet
- ❌ `cvv`
- ❌ Toute donnée non tokenizée

### Rôles & Permissions

**OWNER** :
- Accès total
- Création/modification produits
- Gestion affiliés
- Dashboard complet

**ADMIN** :
- Gestion système globale
- Modération communautés
- Support clients
- Pas d'accès finances

**PRODUCT_MANAGER** :
- Création/modification produits uniquement
- Gestion formations
- Pas d'accès affiliés/finances

**AFFILIATE** :
- Dashboard personnel
- Tracking commissions
- Withdrawals

**CLIENT** :
- Accès produits achetés uniquement

### Champs Supprimés (Simplification)

**Community** :
- ❌ `imageUrl` / `bannerUrl` → Tout est codé à la main
- ❌ `description` → Landing pages custom

**Rational** : Vous codez chaque landing page manuellement pour chaque produit, donc pas besoin de champs génériques.

---

C'est le schema FINAL consolidé. Tout le reste de la documentation sera mis à jour en conséquence.
