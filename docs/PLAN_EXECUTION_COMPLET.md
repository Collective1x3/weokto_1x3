# 🚀 PLAN D'EXÉCUTION COMPLET - WEOKTO & STAM
## Site Fonctionnel et Production-Ready

**Objectif** : Créer un site 100% fonctionnel et utilisable par tous les utilisateurs (affiliés WEOKTO, clients STAM, admins, gestionnaires, owner).

**Philosophie** : Manuel, optimisé, sans sur-automatisation. Landing pages codées main, contrôle total.

---

## 📋 TABLE DES MATIÈRES

1. [Phase 0 : Setup Initial & Infrastructure](#phase-0--setup-initial--infrastructure)
2. [Phase 1 : Base de Données & Models](#phase-1--base-de-données--models)
3. [Phase 2 : Authentification & Sécurité](#phase-2--authentification--sécurité)
4. [Phase 3 : Landing Pages & Frontend de Base](#phase-3--landing-pages--frontend-de-base)
5. [Phase 4 : Dashboard Utilisateurs (WEOKTO & STAM)](#phase-4--dashboard-utilisateurs-weokto--stam)
6. [Phase 5 : Système Guildes & Membership](#phase-5--système-guildes--membership)
7. [Phase 6 : Paiements PCI Vault (Proxy-Only)](#phase-6--paiements-pci-vault-proxy-only)
8. [Phase 7 : Système d'Affiliation](#phase-7--système-daffiliation)
9. [Phase 8 : Dashboard Owner (Création Produits/Plans)](#phase-8--dashboard-owner-création-produitsplans)
10. [Phase 9 : Gestion Refunds & Clawback](#phase-9--gestion-refunds--clawback)
11. [Phase 10 : Ledgers & Payout Manuel Affiliés](#phase-10--ledgers--payout-manuel-affiliés)
12. [Phase 11 : Chat Socket.io (Temps Réel)](#phase-11--chat-socketio-temps-réel)
13. [Phase 12 : Système Formations (Bunny.net)](#phase-12--système-formations-bunnynet)
14. [Phase 13 : Dashboard Admin & Product Manager](#phase-13--dashboard-admin--product-manager)
15. [Phase 14 : Blog WEOKTO & STAM](#phase-14--blog-weokto--stam)
16. [Phase 15 : Optimisations & Performance](#phase-15--optimisations--performance)
17. [Phase 16 : Testing & Bug Fixes](#phase-16--testing--bug-fixes)
18. [Phase 17 : Déploiement & Git Setup](#phase-17--déploiement--git-setup)

---

# PHASE 0 : SETUP INITIAL & INFRASTRUCTURE

## 0.1 - Initialisation Projet Next.js

### Backend
- [x] Naviguer vers `/Users/zachariepiocelle/Mac/weokto/weokto_01`
- [x] Exécuter `npx create-next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"` (créé manuellement suite à erreur npm)
- [x] Accepter configuration : App Router, TypeScript, Tailwind CSS, pas de src/
- [x] Vérifier structure : `app/`, `public/`, `lib/`, `components/`

## 0.1.1 - Structure Dossiers WEOKTO vs STAM

**IMPORTANT** : Séparer clairement dès le début les routes WEOKTO et STAM.

### Backend
- [x] Créer structure de dossiers :
  ```
  app/
  ├── (weokto)/                    # Routes WEOKTO (groupe route)
  │   ├── page.tsx                 # Landing page WEOKTO
  │   ├── login/
  │   ├── verify-otp/
  │   ├── home/
  │   ├── profile/
  │   ├── guild/
  │   ├── affiliate/
  │   ├── blog/
  │   └── ...
  │
  ├── (stam)/                      # Routes STAM (groupe route)
  │   ├── page.tsx                 # Landing page STAM
  │   ├── login/
  │   ├── verify-otp/
  │   ├── dashboard/
  │   ├── formations/
  │   ├── messages/
  │   ├── blog/
  │   └── ...
  │
  ├── api/
  │   ├── auth/                    # API WEOKTO auth
  │   ├── affiliate/               # API WEOKTO affiliation
  │   ├── owner/                   # API Owner
  │   ├── admin/                   # API Admin
  │   └── stam/                    # API STAM (toutes les routes STAM)
  │       ├── auth/
  │       ├── customers/
  │       ├── formations/
  │       └── ...
  │
  ├── wo-renwo-9492xE/            # Dashboard Owner (hors groupes)
  ├── admin/                       # Dashboard Admin (hors groupes)
  └── product-manager/             # Dashboard Product Manager (hors groupes)
  ```

**Avantages groupes route `(weokto)` et `(stam)` :**
- URLs propres (pas de `/weokto/` ou `/stam/` dans l'URL)
- Layouts séparés automatiquement
- Middleware peut router selon hostname
- Code organisé et maintenable

### Backend
- [x] Créer `app/(weokto)/layout.tsx` :
  ```typescript
  // Layout spécifique WEOKTO
  export default function WeoktoLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body className="bg-weokto-dark">
          {/* Header WEOKTO */}
          {children}
          {/* Footer WEOKTO */}
        </body>
      </html>
    )
  }
  ```

### Backend
- [x] Créer `app/(stam)/layout.tsx` :
  ```typescript
  // Layout spécifique STAM
  export default function StamLayout({ children }: { children: React.ReactNode }) {
    return (
      <html lang="fr">
        <body className="bg-stam-bg">
          {/* Header STAM */}
          {children}
          {/* Footer STAM */}
        </body>
      </html>
    )
  }
  ```

### Backend
- [x] Créer structure composants séparés :
  ```
  components/
  ├── weokto/
  │   ├── WeoktoSidebar.tsx
  │   ├── WeoktoHeader.tsx
  │   ├── WeoktoFooter.tsx
  │   ├── WeoktoAuthModal.tsx
  │   └── ...
  │
  ├── stam/
  │   ├── StamSidebar.tsx
  │   ├── StamHeader.tsx
  │   ├── StamFooter.tsx
  │   ├── StamAuthModal.tsx
  │   └── ...
  │
  ├── shared/              # Composants partagés
  │   ├── Button.tsx
  │   ├── Input.tsx
  │   └── ...
  │
  └── payments/            # Composants paiements (partagés)
      ├── ManualPaymentButton.tsx
      └── CheckoutModal.tsx
  ```

### Backend
- [ ] Middleware adapté à cette structure : (Phase 2)
  ```typescript
  // middleware.ts
  export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const hostname = request.headers.get('host') || ''

    // Détection STAM vs WEOKTO par hostname
    const isStamHost = stamHosts.some(h => hostname.includes(h))

    // Si hostname STAM mais URL WEOKTO → 404
    if (isStamHost && !pathname.startsWith('/stam')) {
      // Toutes les routes STAM sont dans app/(stam)/
      // Mais les URLs sont sans (stam) grâce au groupe route
      // Donc on ne fait rien ici, Next.js gère automatiquement
    }

    // Si hostname WEOKTO mais essaie d'accéder routes STAM → 404
    if (!isStamHost && pathname.startsWith('/stam')) {
      return NextResponse.rewrite(new URL('/404', request.url))
    }

    // Continue avec vérifications sessions, etc.
  }
  ```

## 0.2 - Installation Dépendances Core

### Backend
- [x] Installer Prisma : `npm install prisma @prisma/client`
- [x] Installer Auth : `npm install jose jsonwebtoken bcryptjs`
- [x] Installer Types : `npm install -D @types/jsonwebtoken @types/bcryptjs @types/node`
- [x] Installer Email : `npm install resend react-email @react-email/components`
- [x] Installer Utils : `npm install zod date-fns uuid`
- [x] Installer Validation : `npm install -D @types/uuid`

## 0.3 - Installation Dépendances Socket.io & Real-time

### Backend
- [x] Installer Socket.io : `npm install socket.io socket.io-client`
- [x] Installer Redis : `npm install ioredis @socket.io/redis-adapter`
- [x] Installer Types : `npm install -D @types/socket.io`

## 0.4 - Installation Dépendances Frontend

### Frontend
- [x] Installer UI : `npm install framer-motion`
- [x] Installer Icons : `npm install @phosphor-icons/react phosphor-react`
- [x] Installer Forms : `npm install react-hook-form`
- [x] Installer Markdown : `npm install react-markdown remark-gfm gray-matter`

## 0.5 - Copie Documentation PCI Vault

### Database
- [x] Vérifier présence `/weokto_01/docs/pcivault_docs_llm.md`
- [ ] Lire section "Capture Endpoint" pour flow proxy (Phase 6)
- [ ] Noter endpoints API : `/api/v1/capture/create`, `/api/v1/tokens/charge` (Phase 6)

## 0.6 - Configuration Environment Variables

### Backend
- [x] Copier `.env.example` vers `.env`
- [x] Générer JWT secrets : `openssl rand -base64 32` (2 fois, WEOKTO + STAM)
- [x] Remplir `DATABASE_URL` (PostgreSQL Supabase) - placeholder créé
- [x] Configurer `STAM_HOSTS="be-stam.com,www.be-stam.com"`
- [x] Laisser PCI Vault vide pour l'instant (Phase 6)
- [x] Laisser Bunny.net vide pour l'instant (Phase 12)
- [ ] Configurer Resend API key (nécessite clé API)

---

# PHASE 1 : BASE DE DONNÉES & MODELS

## 1.1 - Setup Prisma

### Database
- [x] Exécuter `npx prisma init`
- [x] Vérifier création `prisma/schema.prisma` et `DATABASE_URL` dans `.env`

## 1.2 - Copie Schema Database Final

### Database
- [x] Ouvrir `docs/SCHEMA_DATABASE_FINAL.md`
- [x] Copier **tout le contenu** du bloc ```prisma (lignes 35-XXX) - via Task Agent
- [x] Remplacer contenu de `prisma/schema.prisma` - 33 modèles, 16 enums, 1283 lignes
- [x] Vérifier enums : `Platform`, `UserType`, `MemberRole`, `CustomerStatus`, etc.

## 1.3 - Création des Migrations Prisma

### Database
- [ ] Exécuter `npx prisma migrate dev --name init` (nécessite DATABASE_URL Supabase valide)
- [ ] Vérifier création `prisma/migrations/XXX_init/`
- [ ] Vérifier tables créées dans Supabase Dashboard

**IMPORTANT** : Les migrations Prisma créent les tables, mais pour Supabase il faut **aussi** créer les RLS policies manuellement.

## 1.4 - Génération Client Prisma

### Database
- [x] Exécuter `npx prisma generate`
- [x] Vérifier `node_modules/.prisma/client/`

## 1.5 - Création Singleton Prisma

### Backend
- [x] Créer `lib/prisma.ts`
- [x] Implémenter pattern singleton :
  ```typescript
  import { PrismaClient } from '@prisma/client'

  const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
  }

  export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    })

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
  ```

## 1.6 - Seed Base de Données (Guildes Initiales)

### Database
- [x] Créer `prisma/seed.ts`
- [x] Seed Community Academy :
  ```typescript
  await prisma.community.create({
    data: {
      platform: 'WEOKTO',
      name: 'Community Academy',
      slug: 'community-academy',
      domain: null,
      isActive: true,
    }
  })
  ```
- [x] Seed TBCB (The Best Community Builder) :
  ```typescript
  await prisma.community.create({
    data: {
      platform: 'WEOKTO',
      name: 'The Best Community Builder',
      slug: 'tbcb',
      domain: null,
      isActive: true,
    }
  })
  ```
- [x] Ajouter script dans `package.json` :
  ```json
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
  }
  ```
- [ ] Exécuter `npx prisma db seed` (nécessite DATABASE_URL valide)

## 1.7 - Vérification Database

### Database
- [ ] Ouvrir Prisma Studio : `npx prisma studio` (nécessite DB)
- [ ] Vérifier présence 2 guildes (Community Academy, TBCB)
- [ ] Vérifier enums fonctionnels (Platform = WEOKTO, STAM)

## 1.8 - Scripts SQL Supabase & RLS Policies

**PHILOSOPHIE** : Pour Supabase, **TOUT** doit être fait via **scripts SQL**, pas via l'interface. Cela permet :
- Versionning (Git)
- Reproductibilité
- Rollback facile
- Documentation

### Database - Création Scripts SQL

- [x] Créer dossier `supabase/migrations/`
- [x] Créer `supabase/migrations/00_enable_rls.sql` :
  ```sql
  -- Enable Row Level Security sur TOUTES les tables
  ALTER TABLE "WeoktoUser" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "WeoktoSession" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "StamUser" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "StamSession" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Community" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "CommunityMember" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Product" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Plan" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Customer" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Invoice" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateProfile" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateCommission" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateAttribution" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateTrackingEvent" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateLedgerEntry" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "WithdrawalRequest" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Formation" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "FormationModule" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "StamProgress" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Refund" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "ChannelCategory" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Channel" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "MessageReaction" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "ManualPaymentButton" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateBoostCode" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "AffiliateBoostRedemption" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Competition" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "CompetitionLeaderboardEntry" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "PearlTransaction" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "Cosmetic" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "UserCosmetic" ENABLE ROW LEVEL SECURITY;
  ALTER TABLE "ProductAccess" ENABLE ROW LEVEL SECURITY;
  ```

### Database - RLS Policies WEOKTO Users

- [x] Créer `supabase/migrations/01_rls_weokto_users.sql` :
  ```sql
  -- WeoktoUser: Users peuvent lire leur propre profil
  CREATE POLICY "Users can read own profile"
    ON "WeoktoUser"
    FOR SELECT
    USING (id = current_setting('app.user_id', true)::text);

  -- WeoktoUser: Users peuvent update leur propre profil
  CREATE POLICY "Users can update own profile"
    ON "WeoktoUser"
    FOR UPDATE
    USING (id = current_setting('app.user_id', true)::text)
    WITH CHECK (id = current_setting('app.user_id', true)::text);

  -- WeoktoSession: Users peuvent lire leurs propres sessions
  CREATE POLICY "Users can read own sessions"
    ON "WeoktoSession"
    FOR SELECT
    USING ("userId" = current_setting('app.user_id', true)::text);

  -- WeoktoSession: Service role peut tout faire (backend)
  CREATE POLICY "Service role full access"
    ON "WeoktoSession"
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
  ```

### Database - RLS Policies STAM Users

- [x] Créer `supabase/migrations/02_rls_stam_users.sql` :
  ```sql
  -- StamUser: Users peuvent lire leur propre profil
  CREATE POLICY "Users can read own profile"
    ON "StamUser"
    FOR SELECT
    USING (id = current_setting('app.stam_user_id', true)::text);

  -- StamUser: Users peuvent update leur propre profil
  CREATE POLICY "Users can update own profile"
    ON "StamUser"
    FOR UPDATE
    USING (id = current_setting('app.stam_user_id', true)::text)
    WITH CHECK (id = current_setting('app.stam_user_id', true)::text);

  -- StamSession: Users peuvent lire leurs sessions
  CREATE POLICY "Users can read own sessions"
    ON "StamSession"
    FOR SELECT
    USING ("userId" = current_setting('app.stam_user_id', true)::text);

  -- StamSession: Service role full access
  CREATE POLICY "Service role full access"
    ON "StamSession"
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');
  ```

### Database - RLS Policies Commissions & Affiliation

- [x] Créer `supabase/migrations/03_rls_affiliate.sql` :
  ```sql
  -- AffiliateProfile: Users peuvent lire leur propre profil affilié
  CREATE POLICY "Affiliates can read own profile"
    ON "AffiliateProfile"
    FOR SELECT
    USING ("userId" = current_setting('app.user_id', true)::text);

  -- AffiliateCommission: Affiliés peuvent lire leurs commissions
  CREATE POLICY "Affiliates can read own commissions"
    ON "AffiliateCommission"
    FOR SELECT
    USING ("affiliateId" = current_setting('app.user_id', true)::text);

  -- AffiliateCommission: Service role (backend) peut tout
  CREATE POLICY "Service role full access commissions"
    ON "AffiliateCommission"
    FOR ALL
    USING (current_setting('request.jwt.claims', true)::json->>'role' = 'service_role');

  -- AffiliateLedgerEntry: Affiliés peuvent lire leur ledger
  CREATE POLICY "Affiliates can read own ledger"
    ON "AffiliateLedgerEntry"
    FOR SELECT
    USING ("affiliateId" = current_setting('app.user_id', true)::text);

  -- WithdrawalRequest: Affiliés peuvent lire leurs withdrawals
  CREATE POLICY "Affiliates can read own withdrawals"
    ON "WithdrawalRequest"
    FOR SELECT
    USING ("affiliateId" = current_setting('app.user_id', true)::text);

  -- WithdrawalRequest: Affiliés peuvent create withdrawal
  CREATE POLICY "Affiliates can create withdrawal"
    ON "WithdrawalRequest"
    FOR INSERT
    WITH CHECK ("affiliateId" = current_setting('app.user_id', true)::text);
  ```

### Database - RLS Policies Customers & Subscriptions

- [x] Créer `supabase/migrations/04_rls_customers.sql` :
  ```sql
  -- Customer: Users peuvent lire leurs propres customers
  CREATE POLICY "Stam users can read own customers"
    ON "Customer"
    FOR SELECT
    USING ("stamUserId" = current_setting('app.stam_user_id', true)::text);

  -- Invoice: Via customer
  CREATE POLICY "Users can read own invoices"
    ON "Invoice"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Customer"
        WHERE "Customer".id = "Invoice"."customerId"
        AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
      )
    );
  ```

### Database - RLS Policies Communities & Guilds

- [x] Créer `supabase/migrations/05_rls_communities.sql` :
  ```sql
  -- Community: Public read (pour affichage landing pages)
  CREATE POLICY "Communities are publicly readable"
    ON "Community"
    FOR SELECT
    USING ("isActive" = true);

  -- CommunityMember: Users peuvent lire memberships de leur guilde
  CREATE POLICY "Members can read guild members"
    ON "CommunityMember"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "CommunityMember" AS cm
        WHERE cm."userId" = current_setting('app.user_id', true)::text
        AND cm."communityId" = "CommunityMember"."communityId"
      )
    );

  -- CommunityMember: Users peuvent join/leave
  CREATE POLICY "Users can manage own membership"
    ON "CommunityMember"
    FOR ALL
    USING ("userId" = current_setting('app.user_id', true)::text)
    WITH CHECK ("userId" = current_setting('app.user_id', true)::text);
  ```

### Database - RLS Policies Formations

- [x] Créer `supabase/migrations/06_rls_formations.sql` :
  ```sql
  -- Formation: Clients avec Customer actif peuvent read
  CREATE POLICY "Active customers can read formations"
    ON "Formation"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Customer"
        WHERE "Customer"."productId" = "Formation"."productId"
        AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
        AND "Customer"."status" = 'ACTIVE'
      )
    );

  -- Module: Via formation
  CREATE POLICY "Customers can read modules"
    ON "Module"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Formation" f
        JOIN "Customer" c ON c."productId" = f."productId"
        WHERE f.id = "Module"."formationId"
        AND c."stamUserId" = current_setting('app.stam_user_id', true)::text
        AND c."status" = 'ACTIVE'
      )
    );

  -- Lesson: Via module
  CREATE POLICY "Customers can read lessons"
    ON "Lesson"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Module" m
        JOIN "Formation" f ON f.id = m."formationId"
        JOIN "Customer" c ON c."productId" = f."productId"
        WHERE m.id = "Lesson"."moduleId"
        AND c."stamUserId" = current_setting('app.stam_user_id', true)::text
        AND c."status" = 'ACTIVE'
      )
    );

  -- LessonProgress: Users peuvent read/write leur propre progression
  CREATE POLICY "Users can manage own lesson progress"
    ON "LessonProgress"
    FOR ALL
    USING ("userId" = current_setting('app.stam_user_id', true)::text)
    WITH CHECK ("userId" = current_setting('app.stam_user_id', true)::text);
  ```

### Database - RLS Policies Chat

- [x] Créer `supabase/migrations/07_rls_chat.sql` :
  ```sql
  -- Channel: Members de la guilde peuvent read
  CREATE POLICY "Guild members can read channels"
    ON "Channel"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "CommunityMember"
        WHERE "CommunityMember"."communityId" = "Channel"."communityId"
        AND "CommunityMember"."userId" = current_setting('app.user_id', true)::text
      )
    );

  -- Message: Members du channel peuvent read
  CREATE POLICY "Channel members can read messages"
    ON "Message"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Channel" ch
        JOIN "CommunityMember" cm ON cm."communityId" = ch."communityId"
        WHERE ch.id = "Message"."channelId"
        AND cm."userId" = current_setting('app.user_id', true)::text
      )
    );

  -- Message: Members peuvent send messages
  CREATE POLICY "Members can send messages"
    ON "Message"
    FOR INSERT
    WITH CHECK (
      "authorId" = current_setting('app.user_id', true)::text
      AND EXISTS (
        SELECT 1 FROM "Channel" ch
        JOIN "CommunityMember" cm ON cm."communityId" = ch."communityId"
        WHERE ch.id = "Message"."channelId"
        AND cm."userId" = current_setting('app.user_id', true)::text
      )
    );

  -- DirectMessage: Users peuvent read leurs DMs
  CREATE POLICY "Users can read own direct messages"
    ON "DirectMessage"
    FOR SELECT
    USING (
      "senderId" = current_setting('app.user_id', true)::text
      OR "recipientId" = current_setting('app.user_id', true)::text
    );

  -- DirectMessage: Users peuvent send DMs
  CREATE POLICY "Users can send direct messages"
    ON "DirectMessage"
    FOR INSERT
    WITH CHECK ("senderId" = current_setting('app.user_id', true)::text);
  ```

### Database - RLS Policies Owner/Admin

- [x] Créer `supabase/migrations/08_rls_admin_owner.sql` :
  ```sql
  -- Fonction helper pour check admin/owner
  CREATE OR REPLACE FUNCTION is_admin_or_owner()
  RETURNS BOOLEAN AS $$
  BEGIN
    RETURN EXISTS (
      SELECT 1 FROM "WeoktoUser"
      WHERE id = current_setting('app.user_id', true)::text
      AND "userType" IN ('ADMIN', 'OWNER')
    );
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Product: Owner/Admin peuvent tout
  CREATE POLICY "Admins can manage products"
    ON "Product"
    FOR ALL
    USING (is_admin_or_owner())
    WITH CHECK (is_admin_or_owner());

  -- Product: Public read
  CREATE POLICY "Products are publicly readable"
    ON "Product"
    FOR SELECT
    USING ("isActive" = true);

  -- Plan: Owner/Admin peuvent tout
  CREATE POLICY "Admins can manage plans"
    ON "Plan"
    FOR ALL
    USING (is_admin_or_owner())
    WITH CHECK (is_admin_or_owner());

  -- Plan: Public read
  CREATE POLICY "Plans are publicly readable"
    ON "Plan"
    FOR SELECT
    USING ("isActive" = true);

  -- ManualPaymentButton: Owner/Admin peuvent tout
  CREATE POLICY "Admins can manage payment buttons"
    ON "ManualPaymentButton"
    FOR ALL
    USING (is_admin_or_owner())
    WITH CHECK (is_admin_or_owner());

  -- Refund: Owner/Admin peuvent read/manage
  CREATE POLICY "Admins can manage refunds"
    ON "Refund"
    FOR ALL
    USING (is_admin_or_owner())
    WITH CHECK (is_admin_or_owner());

  -- Refund: Clients peuvent read leurs propres refunds
  CREATE POLICY "Customers can read own refunds"
    ON "Refund"
    FOR SELECT
    USING (
      EXISTS (
        SELECT 1 FROM "Customer"
        WHERE "Customer".id = "Refund"."customerId"
        AND "Customer"."stamUserId" = current_setting('app.stam_user_id', true)::text
      )
    );
  ```

### Database - Exécution Scripts SQL

- [ ] Dans Supabase Dashboard → SQL Editor (nécessite instance Supabase)
- [ ] Exécuter scripts dans l'ordre (00, 01, 02, etc.)
- [ ] Vérifier aucune erreur
- [ ] Tester RLS avec queries test :
  ```sql
  -- Test: User ne peut pas lire profil d'un autre user
  SET app.user_id = 'user-1-id';
  SELECT * FROM "WeoktoUser" WHERE id = 'user-2-id'; -- Doit retourner 0 rows
  ```

### Backend - Helper pour Set User Context

- [x] Créer `lib/supabase/rls.ts` :
  ```typescript
  import { prisma } from '@/lib/prisma'

  export async function setUserContext(userId: string, platform: 'WEOKTO' | 'STAM' = 'WEOKTO') {
    if (platform === 'WEOKTO') {
      await prisma.$executeRaw`SET app.user_id = ${userId}`
    } else {
      await prisma.$executeRaw`SET app.stam_user_id = ${userId}`
    }
  }

  export async function clearUserContext() {
    await prisma.$executeRaw`RESET app.user_id`
    await prisma.$executeRaw`RESET app.stam_user_id`
  }
  ```

### Backend - Utilisation dans API Routes

- [ ] Dans chaque API route protégée, set context :
  ```typescript
  // app/api/auth/me/route.ts
  export async function GET(request: NextRequest) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    // Set RLS context
    await setUserContext(session.user.id, 'WEOKTO')

    // Maintenant les queries Prisma respectent RLS
    const user = await prisma.weoktoUser.findUnique({
      where: { id: session.user.id }
    })

    await clearUserContext()

    return NextResponse.json(user)
  }
  ```

---

# PHASE 2 : AUTHENTIFICATION & SÉCURITÉ

## 2.1 - Configuration JWT

### Backend
- [x] Créer `lib/auth/config.ts`
- [x] Définir constants :
  ```typescript
  export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
  export const STAM_JWT_SECRET = new TextEncoder().encode(process.env.STAM_JWT_SECRET)
  export const JWT_KEY_ID = 'weokto-v1'
  export const STAM_JWT_KEY_ID = 'stam-v1'

  export const SESSION_CONFIG = {
    cookieName: 'weokto_session',
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  }

  export const STAM_SESSION_CONFIG = {
    cookieName: 'stam_session',
    maxAge: 30 * 24 * 60 * 60,
  }
  ```

## 2.2 - Système Sessions WEOKTO

### Backend
- [x] Copier `/weokto site/WeOkto.com/lib/auth/session.ts` vers `lib/auth/session.ts`
- [x] Adapter imports (vérifier `@/lib/prisma`, `@/lib/security`, etc.)
- [x] Vérifier fonction `createSession(user, request, rememberMe)`
- [x] Vérifier fonction `getSession()` (cookies, JWT verify)
- [x] Vérifier fonction `destroySession()`

## 2.3 - Système Sessions STAM

### Backend
- [x] Copier `/weokto site/WeOkto.com/lib/auth/stam/session.ts` vers `lib/auth/stam/session.ts`
- [x] Adapter pour `STAM_JWT_SECRET` et `STAM_SESSION_CONFIG`
- [x] Vérifier fonction `createStamSession(user, request, rememberMe)`
- [x] Vérifier fonction `getStamSession()`
- [x] Vérifier fonction `destroyStamSession()`

## 2.4 - Magic Link (Envoi Email)

### Backend
- [x] Créer `lib/auth/magic-link.ts`
- [x] Fonction `generateMagicLink(email: string, platform: 'WEOKTO' | 'STAM')` :
  - Créer token unique (crypto.randomUUID())
  - Hash token (SHA256)
  - Créer OTP 6 chiffres
  - Stocker dans `MagicLink` table avec `expiresAt` (15 min)
  - Retourner `{ tokenHash, otpCode }`
- [x] Fonction `verifyMagicLink(token: string)` :
  - Hash token reçu
  - Chercher dans DB (non expiré, non utilisé)
  - Marquer comme utilisé
  - Retourner email
- [x] Fonction `verifyOTP(email: string, otp: string)` :
  - Chercher MagicLink par email + OTP
  - Vérifier non expiré
  - Marquer comme utilisé
  - Retourner email
- [x] Fonction `cleanupExpiredTokens()` pour nettoyer les tokens expirés

### Backend
- [x] Créer `lib/email/send-magic-link.ts`
- [x] Template email avec Resend + React Email :
  - Lien magic : `https://weokto.com/verify?token=xxx`
  - Code OTP : 6 chiffres gras
  - Expiration : 15 minutes
  - Branding WEOKTO (purple #B794F4) ou STAM (distinct)
- [x] Créer `lib/email/templates/MagicLinkEmail.tsx`
- [x] Configuration Resend avec initialisation conditionnelle (RESEND_API_KEY)

## 2.5 - API Routes Authentification WEOKTO

### Backend
- [x] Créer `app/api/auth/magic-link/send/route.ts`
  - POST avec `{ email }`
  - Générer magic link
  - Envoyer email via Resend
  - Retourner success

- [x] Créer `app/api/auth/magic-link/verify/route.ts`
  - GET avec `?token=xxx`
  - Vérifier token
  - Créer/récupérer WeoktoUser
  - Créer session
  - Set cookie
  - Redirect `/home` ou `/choose-guild` si pas de guilde

- [x] Créer `app/api/auth/magic-link/verify-otp/route.ts`
  - POST avec `{ email, otp }`
  - Vérifier OTP
  - Créer/récupérer WeoktoUser
  - Créer session
  - Set cookie
  - Retourner success + redirect URL

- [x] Créer `app/api/auth/logout/route.ts`
  - POST
  - Destroy session
  - Clear cookie
  - Retourner success

- [x] Créer `app/api/auth/me/route.ts`
  - GET
  - Retourner user depuis session
  - 401 si pas de session

## 2.6 - API Routes Authentification STAM

### Backend
**Note**: Routes créées sous `/api/stam/auth/` au lieu de `/app/stam/api/auth/`

- [x] Créer `app/api/stam/auth/magic-link/send/route.ts`
  - Identique WEOKTO mais platform = 'STAM'
  - Créer StamUser au lieu de WeoktoUser

- [x] Créer `app/api/stam/auth/magic-link/verify/route.ts`
  - Utiliser `createStamSession`
  - Redirect vers `/stam/dashboard` ou produit spécifique

- [x] Créer `app/api/stam/auth/magic-link/verify-otp/route.ts`
  - Identique WEOKTO mais STAM

- [x] Créer `app/api/stam/auth/logout/route.ts`
  - `destroyStamSession()`

- [x] Créer `app/api/stam/auth/me/route.ts`
  - Retourner StamUser

## 2.7 - Middleware (Routing WEOKTO vs STAM)

### Backend
- [x] Copier `/weokto site/WeOkto.com/middleware.ts` vers `middleware.ts`
- [x] Fonction `isStamHost(host: string)` :
  ```typescript
  const stamHosts = process.env.STAM_HOSTS?.split(',') || []
  return stamHosts.some(h => host.includes(h))
  ```
- [x] Logique routing :
  - Si STAM host → vérifier `stam_session`, redirect STAM routes
  - Si WEOKTO host → vérifier `weokto_session`, redirect WEOKTO routes
- [x] Protected routes :
  - WEOKTO : `/home`, `/profile`, `/settings`, `/dashboard`
  - STAM : `/stam/dashboard`, `/stam/community/*`
  - Owner : `/wo-renwo-9492xE/*` (WEOWNER ou ADMIN uniquement)
  - Admin : `/admin/*` (ADMIN ou WEOWNER uniquement)
  - Product Manager : `/product-manager/*` (PRODUCT_MANAGER, ADMIN, ou WEOWNER)
- [x] Redirect non-auth vers `/` (WEOKTO) ou `/stam` (STAM)
- [x] Fonction `getSession()` et `getStamSession()` pour récupération sessions
- [x] Fonction `getUserType()` pour détermination type utilisateur

## 2.8 - Utility Functions Sécurité

### Backend
- [x] Créer `lib/security.ts`
- [x] Fonction `shouldUpdateLastLogin(userId: string)` :
  - Vérifier si dernier login > 1 heure
  - Retourner boolean
- [x] Fonction `getClientIp(request: NextRequest)` :
  - Extraire IP depuis headers (x-forwarded-for, x-real-ip)
- [x] Fonction `getUserAgent(request: NextRequest)` :
  - Extraire user-agent
- [x] Fonction `generateOTP()` : Générer code OTP 6 chiffres
- [x] Fonction `hashString(str: string)` : Hash SHA-256

---

# PHASE 3 : LANDING PAGES & FRONTEND DE BASE

## 3.1 - Copie Assets & Fonts

### Frontend
- [ ] Copier `/weokto site/WeOkto.com/public/fonts/` vers `public/fonts/`
- [ ] Copier `/weokto site/WeOkto.com/public/images/` vers `public/images/`
- [ ] Vérifier logos, icons, hero images

## 3.2 - Configuration Tailwind

### Frontend
- [x] Ouvrir `tailwind.config.ts`
- [x] Ajouter custom colors :
  ```typescript
  colors: {
    weokto: {
      purple: '#B794F4',
      dark: '#1e1e1e',
      darker: '#0a0a0a',
    },
    stam: {
      // À définir selon design STAM
    }
  }
  ```
- [ ] Ajouter custom fonts (si spécifiques) - NON FAIT

## 3.3 - Layout Root Global

### Frontend
- [x] Copier `/weokto site/WeOkto.com/app/layout.tsx` vers `app/layout.tsx`
- [x] Vérifier metadata (title, description)
- [x] Vérifier fonts import
- [x] Inclure Tailwind global styles
- [ ] AuthProvider wrapping - NON FAIT (identifié mais pas encore implémenté)

## 3.4 - Landing Page WEOKTO

### Frontend
**Note**: Structure de base créée - route principale renommée de `/login` vers `/home`

- [x] Copier `/weokto site/WeOkto.com/app/page.tsx` vers `app/(weokto)/page.tsx`
- [x] Vérifier imports :
  - `@phosphor-icons/react`
  - `framer-motion`
  - Components (Footer, FAQ, etc.)
- [x] Adapter contenu :
  - Hero : "CRÉE. VENDS. DOMINE."
  - Présentation Community Academy
  - Présentation TBCB
  - Section "Wins" (témoignages, stats)
  - Section pricing (tiers guildes)
  - FAQ
- [x] CTA : "Commencer" → ouvre modal auth (Magic Link)

### Frontend
- [x] Créer `components/weokto/TerminalHeaderLandingPage.tsx`
  - Header style terminal/hacker
  - Navigation : Accueil, Guildes, Blog, Login
  - Mobile responsive

- [x] Créer `components/weokto/FooterLandingPage.tsx`
  - Links : Mentions légales, CGU, Contact
  - Social links
  - Copyright WEOKTO

- [x] Créer `components/weokto/FAQSection.tsx`
  - Accordion FAQ
  - Questions courantes (guildes, affiliation, commissions)

- [x] Créer `components/weokto/TerminalAuthModal.tsx`
  - Modal Magic Link
  - Input email
  - Envoyer code → API `/api/auth/magic-link/send`
  - Input OTP (6 chiffres)
  - Vérifier → API `/api/auth/magic-link/verify-otp`
  - Loading states, error messages

## 3.5 - Landing Page STAM

### Frontend
- [x] Créer `app/(stam)/page.tsx`
- [x] Design distinct de WEOKTO (autre branding)
- [x] Hero : "Rejoins la communauté n°1 du..."
- [x] Présentation communautés disponibles (dynamique depuis DB)
- [x] Section formations
- [x] Section chat temps réel
- [x] CTA : "S'inscrire" → modal auth STAM

### Frontend
- [x] Layout déjà créé en 0.1.1 : `app/(stam)/layout.tsx`

- [x] Créer `components/stam/HeaderStam.tsx`
  - Navigation STAM
  - Login/Signup

- [x] Créer `components/stam/FooterStam.tsx`
  - Links STAM

## 3.6 - Page Login/Signup WEOKTO

### Frontend
**Note**: Routes renommées pour éviter conflits - `/login` → `/auth`, `/verify-otp` → `/verify`

- [x] Créer `app/(weokto)/auth/page.tsx` (était `/login`)
  - Formulaire email
  - Bouton "Envoyer lien magique"
  - Appel API `/api/auth/magic-link/send`
  - Redirection vers `/verify` avec email en query

- [x] Créer `app/(weokto)/verify/page.tsx` (était `/verify-otp`)
  - Input 6 chiffres OTP
  - Bouton "Vérifier"
  - Appel API `/api/auth/magic-link/verify-otp`
  - Redirect `/home` ou `/choose-guild`

- [ ] Suspense wrapper - NON FAIT (identifié mais pas encore implémenté)

## 3.7 - Page Login/Signup STAM

### Frontend
**Note**: Routes renommées pour éviter conflits - `/login` → `/auth-stam`, `/verify-otp` → `/verify-stam`

- [x] Créer `app/(stam)/auth-stam/page.tsx` (était `/login`)
  - Identique WEOKTO mais branding STAM
  - API `/api/stam/auth/magic-link/send`

- [x] Créer `app/(stam)/verify-stam/page.tsx` (était `/verify-otp`)
  - Identique WEOKTO mais STAM
  - API `/api/stam/auth/magic-link/verify-otp`

- [ ] Suspense wrapper - NON FAIT (identifié mais pas encore implémenté)

## 3.8 - Context Auth (Frontend State)

### Frontend
- [x] Créer `contexts/AuthContext.tsx`
- [x] Provider global :
  ```typescript
  const AuthContext = createContext<{
    showAuthModal: boolean
    setShowAuthModal: (show: boolean) => void
    platform: 'WEOKTO' | 'STAM'
    step: 'email' | 'otp'
    email: string
    setEmail: (email: string) => void
    sendMagicLink: () => Promise<void>
    loadingAction: boolean
    successMessage: string | null
    errorMessage: string | null
  }>()
  ```
- [ ] Wrap `app/layout.tsx` avec `<AuthProvider>` - NON FAIT (identifié mais pas encore implémenté)

### Frontend
- [x] Créer `contexts/UserSessionContext.tsx`
- [x] Fetch user depuis `/api/auth/me` au mount
- [x] Provider :
  ```typescript
  const UserSessionContext = createContext<{
    user: WeoktoUser | null
    loading: boolean
    refetch: () => void
  }>()
  ```

### Frontend
- [x] Créer `contexts/StamUserContext.tsx`
  - Identique pour STAM
  - Fetch `/api/stam/auth/me`

---

# PHASE 4 : DASHBOARD UTILISATEURS (WEOKTO & STAM)

## 4.1 - Dashboard WEOKTO (Affilié/Client)

### Frontend
- [ ] Créer `app/(weokto)/home/page.tsx`
  - Hero : "Bienvenue [displayName]"
  - Stats overview (commissions, clients, MRR si affilié)
  - Quick actions (voir guilde, voir stats, etc.)

- [ ] Créer `app/(weokto)/home/layout.tsx`
  - Include sidebar navigation

### Frontend
- [ ] Copier depuis ancien projet vers `components/weokto/WeoktoSidebar.tsx`
- [ ] Adapter menu :
  - Accueil (`/home`)
  - Ma Guilde (`/guild/[slug]`)
  - Compétitions (`/competitions`)
  - Pearls (`/pearls`)
  - MyOkto (`/myokto`)
  - Profil (`/profile`)
  - Paramètres (`/settings`)
  - Déconnexion
- [ ] Mobile responsive (burger menu)

### Frontend
- [ ] Créer `app/(weokto)/profile/page.tsx`
  - Affichage displayName, email, avatarUrl
  - Formulaire édition (displayName, bio, avatar upload)
  - Bouton "Sauvegarder" → API `/api/auth/update-profile`

### Backend
- [ ] Créer `app/api/auth/update-profile/route.ts`
  - POST avec `{ displayName, bio, avatarUrl }`
  - Update `WeoktoUser`
  - Retourner user updaté

### Frontend
- [ ] Créer `app/(weokto)/settings/page.tsx`
  - Changer email → API `/api/auth/update-email`
  - Préférences notifications
  - Supprimer compte (future)

## 4.2 - Dashboard STAM (Client)

### Frontend
- [ ] Créer `app/(stam)/dashboard/page.tsx`
  - Hero : "Bienvenue [displayName]"
  - Liste communautés abonnées (Customer actif)
  - Accès formations
  - Accès chat

### Frontend
- [ ] Créer `app/(stam)/dashboard/layout.tsx`
  - Sidebar STAM :
    - Dashboard
    - Mes Communautés (liste dynamique)
    - Formations
    - Messages
    - Profil
    - Déconnexion

### Frontend - Layout Adaptatif Multi-Produit

**User Flow** :
1. StamUser login
2. Récupérer tous ses `Customer` (produits actifs)
3. Si 1 produit → Single page layout
4. Si 2-4 produits → Tabs navigation
5. Si 5+ produits → Sidebar navigation

### Frontend
- [ ] Créer `components/stam/MultiProductLayout.tsx`
- [ ] Logic :
  ```typescript
  const { customers } = useStamUser() // Liste des Customer

  if (customers.length === 1) {
    return <SingleProductView customer={customers[0]} />
  } else if (customers.length <= 4) {
    return <TabsProductView customers={customers} />
  } else {
    return <SidebarProductView customers={customers} />
  }
  ```

### Frontend
- [ ] Créer `components/stam/SingleProductView.tsx`
  - Affichage direct communauté unique

- [ ] Créer `components/stam/TabsProductView.tsx`
  - Tabs horizontaux (2-4 produits)
  - localStorage pour persister last visited

- [ ] Créer `components/stam/SidebarProductView.tsx`
  - Sidebar avec liste produits (5+)
  - Click → switch produit actif

### Backend
- [ ] Créer `app/stam/api/customers/route.ts`
  - GET
  - Retourner tous les `Customer` du StamUser connecté
  - Include `product`, `plan`, `community`

### Frontend
- [ ] Créer `app/(stam)/profile/page.tsx`
  - Édition profil STAM
  - Similaire WEOKTO

## 4.3 - Page "Choose Guild" (WEOKTO)

**User Flow** :
- User login sans guilde → redirect `/choose-guild`
- Affichage 2 guildes : Community Academy, TBCB
- User clique → join guilde
- Redirect `/home`

### Frontend
- [ ] Créer `app/(weokto)/choose-guild/page.tsx`
- [ ] Fetch guildes disponibles : API `/api/guilds`
- [ ] Cards pour chaque guilde :
  - Nom
  - Description
  - Tier (gratuit, premium)
  - Bouton "Rejoindre"
- [ ] Click "Rejoindre" → API `/api/auth/choose-guild`

### Backend
- [ ] Créer `app/api/guilds/route.ts`
  - GET
  - Retourner `Community` avec `platform = WEOKTO`, `isActive = true`

### Backend
- [ ] Copier `app/api/auth/choose-guild/route.ts`
- [ ] POST avec `{ guildId }`
- [ ] Update `WeoktoUser.currentGuildId = guildId`
- [ ] Vérifier limite 1 changement/30j (`lastGuildChangeAt`)
- [ ] Retourner success

### Frontend
- [ ] Vérifier dans `middleware.ts` :
  - Si user connecté sans guilde → redirect `/choose-guild`
  - Si user avec guilde → allow `/home`, `/guild/*`, etc.

---

# PHASE 5 : SYSTÈME GUILDES & MEMBERSHIP

## 5.1 - Page Guilde Détails

### Frontend
- [ ] Créer `app/(weokto)/guild/[slug]/page.tsx`
- [ ] Fetch guilde : API `/api/guilds/[slug]`
- [ ] Affichage :
  - Hero (nom guilde, bannière si existe)
  - Description
  - Liste channels (Discord-like)
  - Section formations associées
  - Section membres actifs (top contributors)

### Backend
- [ ] Créer `app/api/guilds/[slug]/route.ts`
  - GET
  - Retourner `Community` avec `slug`
  - Include `members` (total count), `channels`

## 5.2 - Layout Guilde (Discord-style)

### Frontend
- [ ] Créer `app/(weokto)/guild/[slug]/layout.tsx`
- [ ] Sidebar :
  - Logo guilde
  - Liste channels par catégorie :
    - 📢 Annonces
    - 💬 Général
    - 🎓 Formations
    - 🏆 Wins
    - ❓ Support
- [ ] Click channel → navigate `/guild/[slug]/channel/[channelId]`

### Frontend
- [ ] Créer `components/guild/GuildSidebar.tsx`
  - Fetch channels : API `/api/guilds/[slug]/channels`
  - Grouper par `category`
  - Icons pour chaque type channel

### Backend
- [ ] Créer `app/api/guilds/[slug]/channels/route.ts`
  - GET
  - Retourner `Channel[]` de la guilde
  - Filter par `isActive = true`

## 5.3 - Page Channel (Chat Preview)

**Note** : Chat complet en Phase 11, ici juste structure

### Frontend
- [ ] Créer `app/(weokto)/guild/[slug]/channel/[channelId]/page.tsx`
- [ ] Structure :
  - Header channel (nom, description)
  - Zone messages (vide pour l'instant, placeholder)
  - Input message (disabled, "Chat disponible bientôt")

## 5.4 - Membership Management

### Backend
- [ ] Créer `app/api/guilds/[slug]/join/route.ts`
  - POST
  - Créer `CommunityMember` :
    ```typescript
    await prisma.communityMember.create({
      data: {
        userId: session.user.id,
        communityId: guildId,
        role: 'MEMBER',
        joinedAt: new Date(),
      }
    })
    ```
  - Update `WeoktoUser.currentGuildId`

### Backend
- [ ] Créer `app/api/guilds/[slug]/leave/route.ts`
  - POST
  - Delete `CommunityMember`
  - Set `WeoktoUser.currentGuildId = null`
  - Redirect `/choose-guild`

### Frontend
- [ ] Dans `app/(weokto)/guild/[slug]/page.tsx` :
  - Vérifier membership (API `/api/guilds/[slug]/membership`)
  - Si membre → afficher "Quitter guilde"
  - Si pas membre → afficher "Rejoindre"

### Backend
- [ ] Créer `app/api/guilds/[slug]/membership/route.ts`
  - GET
  - Retourner `CommunityMember` si existe, null sinon

---

# PHASE 6 : PAIEMENTS PCI VAULT (PROXY-ONLY)

## 6.1 - Lecture Documentation PCI Vault

### Backend
- [ ] Lire `docs/pcivault_docs_llm.md` section "Capture Endpoint"
- [ ] Noter flow :
  1. Backend → POST `/api/v1/capture/create` (PCI Vault)
  2. PCI Vault → Retourne `{url, secret}`
  3. Frontend → Iframe vers `url` avec `secret`
  4. User → Saisit CB sur PCI Vault
  5. PCI Vault → Callback backend avec `{token, reference, brand, last4, expMonth, expYear}`
  6. Backend → Stocke uniquement token + infos partielles

## 6.2 - Configuration PCI Vault

### Backend
- [ ] Ajouter dans `.env` :
  ```
  PCIVAULT_API_KEY="..."
  PCIVAULT_API_URL="https://api.pcivault.io"
  PCIVAULT_WEBHOOK_SECRET="..."
  ```

### Backend
- [ ] Créer `lib/pcivault/client.ts`
- [ ] Fonction `createCaptureEndpoint(customerId: string, amount: number)` :
  ```typescript
  const response = await fetch(`${PCIVAULT_API_URL}/api/v1/capture/create`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PCIVAULT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      customerId,
      amount,
      currency: 'EUR',
      callbackUrl: `${process.env.NEXT_PUBLIC_URL}/api/payments/pci-vault/callback`,
    })
  })

  const { url, secret } = await response.json()
  return { url, secret }
  ```

### Backend
- [ ] Fonction `chargeToken(token: string, amount: number)` :
  ```typescript
  const response = await fetch(`${PCIVAULT_API_URL}/api/v1/tokens/charge`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${PCIVAULT_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      amount,
      currency: 'EUR',
    })
  })

  return response.json()
  ```

## 6.3 - Dashboard Owner : Création Produits

**User Flow** :
- Owner login → `/wo-renwo-9492xE/dashboard`
- Navigation "Produits" → `/wo-renwo-9492xE/products`
- Bouton "Créer produit"
- Formulaire : nom, platform (WEOKTO/STAM), communauté associée
- Save → API `/api/owner/products`

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/layout.tsx`
  - Layout owner avec sidebar :
    - Dashboard
    - Produits
    - Plans (Pricing)
    - Boutons Paiement
    - Affiliés
    - Ledgers
    - Payouts
    - Analytics

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/products/page.tsx`
  - Liste produits (table)
  - Colonnes : Nom, Platform, Communauté, Actif, Actions
  - Bouton "Créer produit" → modal ou page `/products/new`

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/products/new/page.tsx`
  - Formulaire :
    - Nom (input)
    - Platform (select WEOKTO/STAM)
    - Communauté (select depuis DB)
    - Active (checkbox)
  - Submit → API `/api/owner/products`

### Backend
- [ ] Créer `app/api/owner/products/route.ts`
  - GET : Liste produits (owner seulement)
  - POST : Créer produit
    ```typescript
    const product = await prisma.product.create({
      data: {
        name,
        platform,
        communityId,
        isActive,
      }
    })
    ```

## 6.4 - Dashboard Owner : Création Plans (Pricing)

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/plans/page.tsx`
  - Liste plans par produit
  - Colonnes : Nom, Produit, Prix, Interval, Commission %, Actif
  - Bouton "Créer plan"

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/plans/new/page.tsx`
  - Formulaire :
    - Produit (select)
    - Nom plan (ex: "Premium Mensuel")
    - Prix (number, en centimes)
    - Billing Interval (select : MONTHLY, QUARTERLY, ANNUALLY, ONE_TIME, LIFETIME)
    - Trial Days (number, 0 si pas de trial)
    - Commission % (number, default 30)
    - Actif (checkbox)
  - Submit → API `/api/owner/plans`

### Backend
- [ ] Créer `app/api/owner/plans/route.ts`
  - GET : Liste plans
  - POST : Créer plan
    ```typescript
    const plan = await prisma.plan.create({
      data: {
        productId,
        name,
        price,
        billingInterval,
        trialDays,
        commissionPercentage,
        isActive,
      }
    })
    ```

## 6.5 - Dashboard Owner : Création Boutons Paiement Manuels

**Philosophie** : Boutons codés à la main sur landing pages, créés via dashboard owner.

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/payment-buttons/page.tsx`
  - Liste boutons existants
  - Colonnes : ButtonKey, Produit, Plan, Actif, Copy Code
  - Bouton "Créer bouton"

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/payment-buttons/new/page.tsx`
  - Formulaire :
    - Produit (select)
    - Plan (select, filtré par produit)
    - Button Key (input, ex: "guild-marketing-premium-monthly")
    - Display Name (input, ex: "Rejoindre Guild Marketing Premium")
    - Description (textarea)
    - CTA Text (input, ex: "Rejoindre - 49€/mois")
    - Success URL (input, ex: "/guild/marketing/welcome")
    - Cancel URL (input, ex: "/guild/marketing/checkout-cancelled")
    - Actif (checkbox)
  - Submit → API `/api/owner/payment-buttons`
  - Afficher code snippet à copier :
    ```tsx
    <ManualPaymentButton buttonKey="guild-marketing-premium-monthly">
      Rejoindre Premium - 49€/mois
    </ManualPaymentButton>
    ```

### Backend
- [ ] Créer `app/api/owner/payment-buttons/route.ts`
  - GET : Liste boutons
  - POST : Créer bouton
    ```typescript
    const button = await prisma.manualPaymentButton.create({
      data: {
        productId,
        planId,
        buttonKey,
        displayName,
        description,
        ctaText,
        successUrl,
        cancelUrl,
        isActive,
      }
    })
    ```

## 6.6 - Composant Frontend : ManualPaymentButton

### Frontend
- [ ] Créer `components/payments/ManualPaymentButton.tsx`
- [ ] Props :
  ```typescript
  interface Props {
    buttonKey: string
    children?: React.ReactNode
    className?: string
  }
  ```
- [ ] Logic :
  1. Fetch button config : API `/api/payments/button-config?key=xxx`
  2. Click → open modal checkout
  3. Modal : iframe PCI Vault (voir 6.7)

### Backend
- [ ] Créer `app/api/payments/button-config/route.ts`
  - GET avec `?key=xxx`
  - Retourner `ManualPaymentButton` avec `product`, `plan`
  - 404 si pas trouvé ou `isActive = false`

## 6.7 - Flow Checkout PCI Vault (Initiate)

**User Flow** :
1. User clique bouton paiement (ex: "Rejoindre Premium - 49€/mois")
2. Frontend → API `/api/payments/initiate` avec `buttonKey`
3. Backend :
   - Récupère button config
   - Récupère/crée Customer (STAM) ou update WeoktoUser
   - Crée PCI Vault capture endpoint
   - Retourne `{captureUrl, captureSecret, amount, productName}`
4. Frontend → ouvre modal avec iframe vers `captureUrl`
5. User → saisit CB sur PCI Vault (proxy)
6. PCI Vault → callback backend `/api/payments/pci-vault/callback`

### Backend
- [ ] Créer `app/api/payments/initiate/route.ts`
- [ ] POST avec `{ buttonKey, email (optionnel si logged in) }`
- [ ] Logique :
  ```typescript
  // 1. Récupérer button
  const button = await prisma.manualPaymentButton.findUnique({
    where: { buttonKey },
    include: { product: true, plan: true }
  })

  // 2. Récupérer user session
  const session = await getSession() // ou getStamSession()

  // 3. Créer/récupérer Customer (STAM) ou WeoktoUser
  let customer
  if (button.product.platform === 'STAM') {
    const stamUser = await prisma.stamUser.findUnique({ where: { email: session.user.email } })
    customer = await prisma.customer.findFirst({
      where: {
        stamUserId: stamUser.id,
        productId: button.productId,
      }
    })

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          stamUserId: stamUser.id,
          productId: button.productId,
          status: 'TRIAL', // ou ACTIVE si pas de trial
        }
      })
    }
  } else {
    // WEOKTO : gérer abonnement guild premium
  }

  // 4. Créer capture endpoint PCI Vault
  const { url, secret } = await createCaptureEndpoint(customer.id, button.plan.price)

  // 5. Stocker PciVaultCaptureEndpoint en DB
  const captureEndpoint = await prisma.pciVaultCaptureEndpoint.create({
    data: {
      customerId: customer.id,
      buttonId: button.id,
      captureUrl: url,
      captureSecret: secret,
      amount: button.plan.price,
      status: 'PENDING',
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
    }
  })

  return NextResponse.json({
    captureUrl: url,
    captureSecret: secret,
    amount: button.plan.price,
    productName: button.product.name,
    planName: button.plan.name,
  })
  ```

### Frontend
- [ ] Créer `components/payments/CheckoutModal.tsx`
- [ ] Props : `captureUrl`, `captureSecret`, `amount`, `productName`, `onSuccess`, `onCancel`
- [ ] Affichage :
  - Header : "Paiement - {productName}"
  - Montant : `{amount / 100}€`
  - Iframe : `<iframe src={captureUrl} ...>`
  - Bouton "Annuler"
- [ ] Écouter message postMessage depuis iframe PCI Vault (success/error)

## 6.8 - Callback PCI Vault (Capture Success)

### Backend
- [ ] Créer `app/api/payments/pci-vault/callback/route.ts`
- [ ] POST (appelé par PCI Vault après saisie CB réussie)
- [ ] Payload :
  ```json
  {
    "customerId": "...",
    "token": "tok_xxx",
    "reference": "ref_xxx",
    "brand": "Visa",
    "last4": "4242",
    "expMonth": 12,
    "expYear": 2025,
    "amount": 4900,
    "status": "success"
  }
  ```
- [ ] Logique :
  ```typescript
  // 1. Vérifier webhook signature (PCI Vault secret)

  // 2. Récupérer capture endpoint
  const captureEndpoint = await prisma.pciVaultCaptureEndpoint.findFirst({
    where: { customerId: payload.customerId, status: 'PENDING' }
  })

  // 3. Créer PaymentMethod
  const paymentMethod = await prisma.paymentMethod.create({
    data: {
      customerId: payload.customerId,
      pciVaultToken: payload.token,
      pciVaultReference: payload.reference,
      brand: payload.brand,
      last4: payload.last4,
      expMonth: payload.expMonth,
      expYear: payload.expYear,
      isDefault: true,
    }
  })

  // 4. Créer Invoice
  const invoice = await prisma.invoice.create({
    data: {
      customerId: payload.customerId,
      planId: captureEndpoint.button.planId,
      amount: payload.amount,
      status: 'PAID',
      paidAt: new Date(),
      paymentMethodId: paymentMethod.id,
    }
  })

  // 5. Update Customer status & subscription dates
  await prisma.customer.update({
    where: { id: payload.customerId },
    data: {
      status: 'ACTIVE',
      currentPlanId: plan.id,
      subscriptionEndsAt: plan.billingInterval !== 'ONE_TIME' && plan.billingInterval !== 'LIFETIME'
        ? calculateNextBillingDate(plan.billingInterval)
        : null,
    }
  })

  // 7. Créer CommunityMember (accès communauté)
  await prisma.communityMember.create({
    data: {
      communityId: plan.product.communityId,
      platform: 'STAM',
      stamUserId: customer.stamUserId,
      email: customer.stamUser.email,
      displayName: customer.stamUser.displayName,
      avatarUrl: customer.stamUser.avatarUrl,
      role: 'MEMBER',
      customerId: customer.id,
      currentProductId: plan.productId,
      isActive: true,
    }
  })

  // 8. Track affiliation (si cookie présent)
  await createAffiliateAttribution(payload.customerId, request) // Voir Phase 7

  // 9. Mark capture endpoint as completed
  await prisma.pciVaultCaptureEndpoint.update({
    where: { id: captureEndpoint.id },
    data: { status: 'COMPLETED' }
  })

  // 10. Redirect user
  return NextResponse.json({
    success: true,
    redirectUrl: captureEndpoint.button.successUrl,
  })
  ```

### Backend
- [ ] Créer `lib/payments/billing.ts`
- [ ] Fonction `calculateNextBillingDate(interval: BillingInterval)` :
  ```typescript
  const now = new Date()
  switch (interval) {
    case 'MONTHLY': return addMonths(now, 1)
    case 'QUARTERLY': return addMonths(now, 3)
    case 'ANNUALLY': return addYears(now, 1)
    default: return now
  }
  ```

## 6.9 - CRON : Renouvellements Automatiques (Subscriptions)

### Backend
- [ ] Créer `lib/cron/subscriptions.ts`
- [ ] Job quotidien :
  ```typescript
  export async function processSubscriptionRenewals() {
    const tomorrow = addDays(new Date(), 1)

    const customersDue = await prisma.customer.findMany({
      where: {
        status: 'ACTIVE',
        subscriptionEndsAt: { lte: tomorrow },
      },
      include: {
        plan: true,
      }
    })

    for (const customer of customersDue) {
      try {
        // 1. Charger PCI Vault token
        const result = await chargeToken(customer.pciVaultToken, customer.plan.priceAmount)

        if (result.status === 'success') {
          // 2. Créer invoice
          await prisma.invoice.create({
            data: {
              customerId: customer.id,
              planId: customer.currentPlanId,
              amountExcludingTax: customer.plan.priceAmount,
              taxAmount: 0,
              amountIncludingTax: customer.plan.priceAmount,
              status: 'PAID',
              paidAt: new Date(),
              pciVaultPaymentId: result.paymentId,
            }
          })

          // 3. Update customer subscription dates
          await prisma.customer.update({
            where: { id: customer.id },
            data: {
              subscriptionEndsAt: calculateNextBillingDate(customer.plan.billingInterval),
            }
          })

          // 4. Créer commission affilié (si applicable)
          await createAffiliateCommission(customer.id, customer.plan.id, customer.plan.priceAmount)
        } else {
          // Payment failed
          await prisma.customer.update({
            where: { id: customer.id },
            data: { status: 'PAST_DUE' }
          })

          // TODO: Envoyer email relance paiement
        }
      } catch (error) {
        console.error(`Renewal failed for customer ${customer.id}`, error)
      }
    }
  }
  ```

### Backend
- [ ] Créer `app/api/cron/subscriptions/route.ts`
  - GET (protégé par secret CRON_SECRET)
  - Appeler `processSubscriptionRenewals()`

### Backend
- [ ] Configurer Vercel Cron Job ou service externe (cron-job.org)
  - URL : `https://yourdomain.com/api/cron/subscriptions`
  - Header : `Authorization: Bearer ${CRON_SECRET}`
  - Schedule : Quotidien à 2h du matin

---

# PHASE 7 : SYSTÈME D'AFFILIATION

## 7.1 - Tracking Cookies (30 jours, Last-Click)

**User Flow** :
1. Affilié partage lien : `https://weokto.com/guild/marketing?ref=affiliate123`
2. Visiteur clique lien
3. Backend enregistre tracking event (cookie 30j)
4. Si visiteur achète → attribution last-click

### Backend
- [ ] Créer `app/api/affiliate/track/route.ts`
- [ ] GET avec `?ref=affiliateSlug`
- [ ] Logique :
  ```typescript
  const affiliate = await prisma.affiliateProfile.findUnique({
    where: { affiliateSlug }
  })

  if (!affiliate) return NextResponse.json({ error: 'Invalid ref' }, { status: 404 })

  // Créer tracking event
  const trackingEvent = await prisma.affiliateTrackingEvent.create({
    data: {
      affiliateId: affiliate.userId,
      source: 'DIRECT_LINK',
      ipAddress: getClientIp(request),
      userAgent: getUserAgent(request),
      referrer: request.headers.get('referer'),
      expiresAt: addDays(new Date(), 30), // Cookie 30 jours
    }
  })

  // Set cookie
  cookies().set('weokto_aff_ref', trackingEvent.id, {
    maxAge: 30 * 24 * 60 * 60, // 30 jours
    httpOnly: true,
    secure: true,
  })

  return NextResponse.json({ success: true })
  ```

### Frontend
- [ ] Dans landing pages (WEOKTO/STAM) :
  - Vérifier query param `?ref=xxx`
  - Si présent → fetch `/api/affiliate/track?ref=xxx`

### Frontend
- [ ] Créer `hooks/useAffiliateTracking.ts`
  ```typescript
  export function useAffiliateTracking() {
    useEffect(() => {
      const params = new URLSearchParams(window.location.search)
      const ref = params.get('ref')

      if (ref) {
        fetch(`/api/affiliate/track?ref=${ref}`)
      }
    }, [])
  }
  ```
- [ ] Utiliser dans `app/page.tsx` et `app/stam/page.tsx`

## 7.2 - Attribution à l'Achat (Last-Click)

### Backend
- [ ] Dans `app/api/payments/pci-vault/callback/route.ts` (déjà créé en 6.8) :
- [ ] Ajouter fonction `createAffiliateAttribution(customerId, request)` :
  ```typescript
  async function createAffiliateAttribution(customerId: string, request: NextRequest) {
    const cookieStore = await cookies()
    const affRefCookie = cookieStore.get('weokto_aff_ref')

    if (!affRefCookie) return // Pas de tracking cookie

    // Récupérer tracking event
    const trackingEvent = await prisma.affiliateTrackingEvent.findUnique({
      where: { id: affRefCookie.value },
      include: { affiliate: { include: { affiliateProfile: true } } }
    })

    if (!trackingEvent || trackingEvent.expiresAt < new Date()) return

    // Vérifier attribution existante (last-click)
    const existingAttribution = await prisma.affiliateAttribution.findFirst({
      where: { customerId }
    })

    if (existingAttribution) {
      // Remplacer attribution (last-click wins)
      await prisma.affiliateAttribution.update({
        where: { id: existingAttribution.id },
        data: {
          affiliateId: trackingEvent.affiliateId,
          trackingEventId: trackingEvent.id,
          replacedAt: null, // Reset
        }
      })
    } else {
      // Créer nouvelle attribution
      await prisma.affiliateAttribution.create({
        data: {
          affiliateId: trackingEvent.affiliateId,
          customerId,
          trackingEventId: trackingEvent.id,
          productId: customer.productId,
        }
      })
    }
  }
  ```

## 7.3 - Calcul Commissions (Lock Periods Progressifs)

**Règles** :
- Lock periods selon ancienneté affilié :
  - Nouveau (0-30j) : 45j (80%) + 90j (20%)
  - Récent (31-60j) : 40j (85%) + 60j (15%)
  - Validé (61-90j) : 35j (90%) + 40j (10%)
  - Trusted (90+j) : 30j (94%) + 40j (6%)
- Risk levels override ancienneté

### Backend
- [ ] Créer `lib/affiliate/commission.ts`
- [ ] Fonction `calculateAffiliateLockProfile(affiliateId: string)` :
  ```typescript
  const affiliate = await prisma.affiliateProfile.findUnique({
    where: { userId: affiliateId }
  })

  const accountAge = differenceInDays(new Date(), affiliate.firstCommissionAt || new Date())

  // Risk level override
  if (affiliate.riskLevel === 'AT_RISK') {
    return { mainLockDays: 60, mainPercentage: 80, extendedLockDays: 90, extendedPercentage: 20 }
  } else if (affiliate.riskLevel === 'HIGH_RISK') {
    return { mainLockDays: 90, mainPercentage: 70, extendedLockDays: 120, extendedPercentage: 30 }
  } else if (affiliate.riskLevel === 'EXTREME_RISK') {
    return { mainLockDays: 90, mainPercentage: 60, extendedLockDays: 180, extendedPercentage: 40 }
  }

  // Age-based
  if (accountAge <= 30) {
    return { mainLockDays: 45, mainPercentage: 80, extendedLockDays: 90, extendedPercentage: 20 }
  } else if (accountAge <= 60) {
    return { mainLockDays: 40, mainPercentage: 85, extendedLockDays: 60, extendedPercentage: 15 }
  } else if (accountAge <= 90) {
    return { mainLockDays: 35, mainPercentage: 90, extendedLockDays: 40, extendedPercentage: 10 }
  } else {
    return { mainLockDays: 30, mainPercentage: 94, extendedLockDays: 40, extendedPercentage: 6 }
  }
  ```

### Backend
- [ ] Fonction `createAffiliateCommission(customerId, planId, amount)` :
  ```typescript
  const attribution = await prisma.affiliateAttribution.findFirst({
    where: { customerId }
  })

  if (!attribution) return // Pas d'affiliation

  const plan = await prisma.plan.findUnique({ where: { id: planId } })
  const commissionAmount = (amount * plan.commissionPercentage) / 100

  // Récupérer lock profile
  const lockProfile = await calculateAffiliateLockProfile(attribution.affiliateId)

  // Calcul montants split
  const mainAmount = Math.floor((commissionAmount * lockProfile.mainPercentage) / 100)
  const extendedAmount = commissionAmount - mainAmount

  // Créer commission
  const commission = await prisma.affiliateCommission.create({
    data: {
      affiliateProgramId: plan.affiliateProgramId,
      affiliateId: attribution.affiliateId,
      customerId,
      invoiceId,
      status: 'PENDING_LOCK',

      // Lock periods
      lockPeriodDays: lockProfile.mainLockDays,
      lockedUntil: addDays(new Date(), lockProfile.mainLockDays),
      maturesAt: addDays(new Date(), lockProfile.extendedLockDays),

      // Montants
      lockedAmount: mainAmount,
      extendedLockAmount: extendedAmount,
      extendedLockedUntil: addDays(new Date(), lockProfile.extendedLockDays),
      totalAmount: commissionAmount,
      currency: 'EUR',

      // Rate details
      rateApplied: plan.commissionRate,
      baseAmount: amount,

      // Metadata avec détails du calcul
      metadata: {
        riskLevel: affiliate.riskLevel,
        accountAge: differenceInDays(new Date(), affiliate.firstCommissionAt || new Date()),
        splitRatio: {
          main: lockProfile.mainPercentage,
          extended: lockProfile.extendedPercentage,
        },
        mainLockDays: lockProfile.mainLockDays,
        extendedLockDays: lockProfile.extendedLockDays,
      }
    }
  })

  // Update affiliate profile firstCommissionAt si première
  if (!attribution.affiliate.affiliateProfile.firstCommissionAt) {
    await prisma.affiliateProfile.update({
      where: { userId: attribution.affiliateId },
      data: { firstCommissionAt: new Date() }
    })
  }
  ```

### Backend
- [ ] Intégrer dans `app/api/payments/pci-vault/callback/route.ts` :
  - Après création invoice
  - Appeler `createAffiliateCommission(customer.id, plan.id, invoice.amount)`

## 7.4 - CRON : Maturation Commissions

### Backend
- [ ] Créer `lib/cron/commissions.ts`
- [ ] Job quotidien :
  ```typescript
  export async function matureCommissions() {
    const now = new Date()

    // 1. Main lock maturation (lockedUntil)
    const mainLockReady = await prisma.affiliateCommission.findMany({
      where: {
        status: 'LOCKED',
        lockedUntil: { lte: now },
      }
    })

    for (const commission of mainLockReady) {
      // Débloquer la portion principale (80-94%)
      await prisma.affiliateCommission.update({
        where: { id: commission.id },
        data: {
          status: 'PARTIALLY_MATURED',
        }
      })

      // Créer ledger entry
      await prisma.affiliateLedgerEntry.create({
        data: {
          affiliateId: commission.affiliateId,
          type: 'COMMISSION_MATURED',
          amount: commission.lockedAmount,
          commissionId: commission.id,
          description: `Commission matured (main lock)`,
          balanceAfter: calculateNewBalance(commission.affiliateId, commission.lockedAmount),
        }
      })
    }

    // 2. Extended lock maturation (extendedLockedUntil)
    const extendedLockReady = await prisma.affiliateCommission.findMany({
      where: {
        status: 'PARTIALLY_MATURED',
        extendedLockedUntil: { lte: now },
      }
    })

    for (const commission of extendedLockReady) {
      // Débloquer la portion étendue (6-20%)
      await prisma.affiliateCommission.update({
        where: { id: commission.id },
        data: {
          status: 'MATURED',
        }
      })

      // Créer ledger entry
      await prisma.affiliateLedgerEntry.create({
        data: {
          affiliateId: commission.affiliateId,
          type: 'COMMISSION_MATURED',
          amount: commission.extendedLockAmount,
          commissionId: commission.id,
          description: `Commission matured (extended lock)`,
          balanceAfter: calculateNewBalance(commission.affiliateId, commission.extendedLockAmount),
        }
      })
    }
  }
  ```

### Backend
- [ ] Créer `app/api/cron/commissions/route.ts`
  - GET (protégé CRON_SECRET)
  - Appeler `matureCommissions()`

## 7.5 - Dashboard Affilié (Stats Basiques)

### Frontend
- [ ] Créer `app/(weokto)/affiliate/dashboard/page.tsx`
- [ ] Fetch stats : API `/api/affiliate/stats`
- [ ] Affichage :
  - Total commissions gagnées
  - Commissions locked vs available
  - MRR (voir Phase suivante pour calcul détaillé)
  - Nombre clients actifs
  - Lien affiliation personnalisé (`https://weokto.com?ref={affiliateSlug}`)

### Backend
- [ ] Créer `app/api/affiliate/stats/route.ts`
  - GET
  - Retourner :
    ```typescript
    const commissions = await prisma.affiliateCommission.findMany({
      where: { affiliateId: session.user.id }
    })

    const totalEarned = commissions.reduce((sum, c) => sum + c.totalAmount, 0)
    const totalLocked = commissions.reduce((sum, c) => sum + c.lockedAmount, 0)
    const totalAvailable = commissions.reduce((sum, c) => sum + c.availableAmount, 0)

    const activeCustomers = await prisma.affiliateAttribution.count({
      where: {
        affiliateId: session.user.id,
        customer: { status: 'ACTIVE' }
      }
    })

    return NextResponse.json({
      totalEarned,
      totalLocked,
      totalAvailable,
      activeCustomers,
    })
    ```

### Frontend
- [ ] Créer `app/(weokto)/affiliate/commissions/page.tsx`
  - Table détaillée commissions
  - Colonnes : Client, Plan, Montant, Status, Lock Release Date
  - Filtres : Status (LOCKED, MATURED, PAID)

### Backend
- [ ] Créer `app/api/affiliate/commissions/route.ts`
  - GET
  - Retourner liste `AffiliateCommission[]` avec pagination

## 7.6 - Attribution Produits Gratuits

**Règle** : Si user rejoint guilde gratuite via lien affilié, attribuer pendant 30-60j (selon ancienneté affilié). Si upgrade vers payant → commission.

### Backend
- [ ] Dans `app/api/guilds/[slug]/join/route.ts` :
- [ ] Ajouter logique :
  ```typescript
  // Si guilde gratuite + tracking cookie présent
  const affRefCookie = cookieStore.get('weokto_aff_ref')

  if (affRefCookie && guild.tier === 'FREE') {
    const trackingEvent = await prisma.affiliateTrackingEvent.findUnique({
      where: { id: affRefCookie.value }
    })

    if (trackingEvent && trackingEvent.expiresAt > new Date()) {
      // Créer attribution gratuite
      await prisma.affiliateAttribution.create({
        data: {
          affiliateId: trackingEvent.affiliateId,
          customerId: null, // Pas encore customer
          weoktoUserId: session.user.id,
          productId: guild.productId,
          isFreeProductAttribution: true,
          attributionExpiresAt: addDays(new Date(), 30), // 30j par défaut
        }
      })
    }
  }
  ```

### Backend
- [ ] Dans création commission (upgrade) :
  - Vérifier `affiliateAttribution.isFreeProductAttribution = true`
  - Si oui, stocker `metadata.fromFreeProduct = true` dans commission

---

# PHASE 8 : DASHBOARD OWNER (CRÉATION PRODUITS/PLANS)

**Note** : Déjà couvert en Phase 6.3-6.5, compléter ici avec fonctionnalités avancées.

## 8.1 - Analytics Owner

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/analytics/page.tsx`
- [ ] Fetch : API `/api/owner/analytics`
- [ ] Affichage :
  - Total revenue (MRR + one-time)
  - Nombre clients actifs
  - Churn rate
  - Top produits (revenue)
  - Top affiliés (commissions générées)

### Backend
- [ ] Créer `app/api/owner/analytics/route.ts`
  - GET
  - Calculer métriques globales

## 8.2 - Gestion Affiliés (Owner)

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/affiliates/page.tsx`
  - Liste affiliés
  - Colonnes : Nom, Email, Total Commissions, Clients, Risk Level, Actions
  - Bouton "Modifier risk level"

### Backend
- [ ] Créer `app/api/owner/affiliates/route.ts`
  - GET : Liste affiliés
  - PATCH : Modifier risk level
    ```typescript
    await prisma.affiliateProfile.update({
      where: { userId },
      data: { riskLevel }
    })
    ```

### Frontend
- [ ] Modal modifier risk level :
  - Select : NORMAL, AT_RISK, HIGH_RISK, EXTREME_RISK
  - Notes internes (textarea)
  - Save → API

---

# PHASE 9 : GESTION REFUNDS & CLAWBACK

## 9.1 - Demande Refund (Client)

### Frontend
- [ ] Créer `app/stam/settings/page.tsx`
  - Section "Annuler abonnement"
  - Bouton "Demander remboursement" (si < 14 jours)
  - Modal confirmation avec raison

### Backend
- [ ] Créer `app/stam/api/refund/request/route.ts`
  - POST avec `{ customerId, reason }`
  - Créer `Refund` :
    ```typescript
    const refund = await prisma.refund.create({
      data: {
        invoiceId,
        customerId,
        amount: invoice.amount,
        reason,
        status: 'PENDING',
        requestedAt: new Date(),
      }
    })
    ```
  - Envoyer notification owner

## 9.2 - Traitement Refund (Owner)

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/refunds/page.tsx`
  - Liste refunds pending
  - Colonnes : Client, Montant, Raison, Date, Actions
  - Boutons : "Approuver", "Rejeter"

### Backend
- [ ] Créer `app/api/owner/refunds/[refundId]/approve/route.ts`
  - POST
  - Logique :
    ```typescript
    // 1. Approuver refund
    await prisma.refund.update({
      where: { id: refundId },
      data: {
        status: 'APPROVED',
        approvedAt: new Date(),
      }
    })

    // 2. Annuler customer subscription
    await prisma.customer.update({
      where: { id: refund.customerId },
      data: {
        status: 'CANCELLED',
        subscriptionEndsAt: new Date()
      }
    })

    // 3. Clawback commissions affilié
    await clawbackAffiliateCommission(refund.customerId, refund.amount)
    ```

### Backend
- [ ] Créer `app/api/owner/refunds/[refundId]/reject/route.ts`
  - POST
  - Update `Refund.status = REJECTED`

## 9.3 - Clawback Commissions

### Backend
- [ ] Créer `lib/affiliate/clawback.ts`
- [ ] Fonction `clawbackAffiliateCommission(customerId, refundAmount)` :
  ```typescript
  const commissions = await prisma.affiliateCommission.findMany({
    where: {
      customerId,
      status: { in: ['LOCKED', 'MATURED'] }, // Pas PAID
    },
    orderBy: { createdAt: 'desc' }
  })

  let remainingClawback = refundAmount

  for (const commission of commissions) {
    if (remainingClawback <= 0) break

    const clawbackAmount = Math.min(commission.totalAmount, remainingClawback)

    await prisma.affiliateCommission.update({
      where: { id: commission.id },
      data: {
        status: 'CLAWED_BACK',
        clawbackAmount,
        clawbackAt: new Date(),
      }
    })

    remainingClawback -= clawbackAmount
  }

  // Si remainingClawback > 0, créer dette dans AffiliateProfile
  if (remainingClawback > 0) {
    await prisma.affiliateProfile.update({
      where: { userId: commission.affiliateId },
      data: {
        debtAmount: { increment: remainingClawback }
      }
    })
  }
  ```

### Backend
- [ ] Intégrer dans `app/api/owner/refunds/[refundId]/approve/route.ts`

---

# PHASE 10 : LEDGERS & PAYOUT MANUEL AFFILIÉS

## 10.1 - Ledger System (Transactions)

### Backend
- [ ] Toutes les opérations créent `AffiliateLedgerEntry` :
  - Commission earned → type: COMMISSION
  - Clawback → type: CLAWBACK
  - Payout → type: PAYOUT

### Backend
- [ ] Dans `createAffiliateCommission` :
  ```typescript
  await prisma.affiliateLedgerEntry.create({
    data: {
      affiliateId: commission.affiliateId,
      type: 'COMMISSION',
      amount: commission.totalAmount,
      commissionId: commission.id,
      description: `Commission - Customer ${customerId}`,
      balanceAfter: calculateNewBalance(affiliateId, commission.totalAmount),
    }
  })
  ```

### Backend
- [ ] Dans `clawbackAffiliateCommission` :
  ```typescript
  await prisma.affiliateLedgerEntry.create({
    data: {
      affiliateId: commission.affiliateId,
      type: 'CLAWBACK',
      amount: -clawbackAmount,
      refundId: refund.id,
      description: `Clawback - Refund ${refund.id}`,
      balanceAfter: calculateNewBalance(affiliateId, -clawbackAmount),
    }
  })
  ```

## 10.2 - Dashboard Owner : Payouts

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/payouts/page.tsx`
  - Liste affiliés avec balance disponible > 0
  - Colonnes : Affilié, Balance Disponible, Derniers Payout, Actions
  - Bouton "Effectuer payout"

### Frontend
- [ ] Modal payout :
  - Montant (input, max = balance disponible)
  - Méthode (select : Virement, PayPal, Stripe)
  - Référence transaction (input)
  - Notes (textarea)
  - Submit → API `/api/owner/payouts/create`

### Backend
- [ ] Créer `app/api/owner/payouts/create/route.ts`
  - POST avec `{ affiliateId, amount, method, reference, notes }`
  - Logique :
    ```typescript
    // 1. Vérifier balance disponible
    const affiliate = await prisma.affiliateProfile.findUnique({
      where: { userId: affiliateId }
    })

    const availableBalance = await calculateAvailableBalance(affiliateId)

    if (amount > availableBalance) {
      return NextResponse.json({ error: 'Insufficient balance' }, { status: 400 })
    }

    // 2. Créer withdrawal request
    const withdrawal = await prisma.withdrawalRequest.create({
      data: {
        affiliateId,
        amount,
        status: 'COMPLETED', // Manuel = instant
        method,
        reference,
        notes,
        requestedAt: new Date(),
        completedAt: new Date(),
      }
    })

    // 3. Marquer commissions comme PAID
    const commissions = await prisma.affiliateCommission.findMany({
      where: {
        affiliateId,
        status: 'MATURED',
        availableAmount: { gt: 0 }
      },
      orderBy: { createdAt: 'asc' }
    })

    let remainingPayout = amount

    for (const commission of commissions) {
      if (remainingPayout <= 0) break

      const payoutAmount = Math.min(commission.availableAmount, remainingPayout)

      await prisma.affiliateCommission.update({
        where: { id: commission.id },
        data: {
          availableAmount: { decrement: payoutAmount },
          status: payoutAmount === commission.availableAmount ? 'PAID' : 'MATURED',
          paidAt: new Date(),
        }
      })

      remainingPayout -= payoutAmount
    }

    // 4. Créer ledger entry
    await prisma.affiliateLedgerEntry.create({
      data: {
        affiliateId,
        type: 'PAYOUT',
        amount: -amount,
        withdrawalId: withdrawal.id,
        description: `Payout - ${method} - ${reference}`,
        balanceAfter: calculateNewBalance(affiliateId, -amount),
      }
    })

    return NextResponse.json({ success: true, withdrawal })
    ```

### Backend
- [ ] Fonction `calculateAvailableBalance(affiliateId)` :
  ```typescript
  const commissions = await prisma.affiliateCommission.findMany({
    where: { affiliateId, status: { in: ['MATURED', 'PAID'] } }
  })

  return commissions.reduce((sum, c) => sum + c.availableAmount, 0)
  ```

## 10.3 - Dashboard Affilié : Historique Payouts

### Frontend
- [ ] Créer `app/(weokto)/affiliate/payouts/page.tsx`
  - Liste withdrawals
  - Colonnes : Date, Montant, Méthode, Statut, Référence
  - Filtres : Statut (PENDING, COMPLETED)

### Backend
- [ ] Créer `app/api/affiliate/payouts/route.ts`
  - GET
  - Retourner `WithdrawalRequest[]` de l'affilié connecté

## 10.4 - Dashboard Affilié : Ledger (Transactions)

### Frontend
- [ ] Créer `app/(weokto)/affiliate/ledger/page.tsx`
  - Table transactions
  - Colonnes : Date, Type, Montant, Description, Balance After
  - Filtres : Type (COMMISSION, CLAWBACK, PAYOUT)

### Backend
- [ ] Créer `app/api/affiliate/ledger/route.ts`
  - GET
  - Retourner `AffiliateLedgerEntry[]` avec pagination

---

# PHASE 11 : CHAT SOCKET.IO (TEMPS RÉEL)

## 11.1 - Setup Serveur Socket.io

### Backend
- [ ] Créer `server/socket-server.ts`
- [ ] Configuration :
  ```typescript
  import { createServer } from 'http'
  import { Server } from 'socket.io'
  import { createAdapter } from '@socket.io/redis-adapter'
  import Redis from 'ioredis'

  const httpServer = createServer()
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_URL,
      credentials: true,
    }
  })

  // Redis adapter pour multi-instances
  const pubClient = new Redis(process.env.REDIS_URL)
  const subClient = pubClient.duplicate()
  io.adapter(createAdapter(pubClient, subClient))

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Auth
    socket.on('authenticate', async (token) => {
      try {
        const user = await verifyToken(token) // Vérifier JWT
        socket.data.userId = user.id
        socket.data.userType = user.userType
      } catch (error) {
        socket.disconnect()
      }
    })

    // Join channel
    socket.on('join_channel', async (channelId) => {
      // Vérifier accès
      const hasAccess = await checkChannelAccess(socket.data.userId, channelId)
      if (!hasAccess) return

      socket.join(`channel:${channelId}`)

      // Fetch derniers messages
      const messages = await fetchChannelMessages(channelId, 50)
      socket.emit('channel_messages', messages)
    })

    // Send message
    socket.on('send_message', async (data) => {
      const { channelId, content } = data

      // Sauvegarder en DB
      const message = await prisma.message.create({
        data: {
          channelId,
          authorId: socket.data.userId,
          content,
        },
        include: { author: true }
      })

      // Broadcast to channel
      io.to(`channel:${channelId}`).emit('new_message', message)
    })

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  httpServer.listen(3001, () => {
    console.log('Socket.io server running on port 3001')
  })
  ```

### Backend
- [ ] Créer `package.json` script :
  ```json
  "scripts": {
    "socket-server": "ts-node server/socket-server.ts"
  }
  ```

## 11.2 - Client Socket.io (Frontend)

### Frontend
- [ ] Créer `lib/socket/client.ts`
  ```typescript
  import { io, Socket } from 'socket.io-client'

  let socket: Socket | null = null

  export function connectSocket(token: string) {
    if (socket?.connected) return socket

    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
      auth: { token },
      autoConnect: true,
    })

    socket.on('connect', () => {
      console.log('Socket connected')
      socket?.emit('authenticate', token)
    })

    return socket
  }

  export function disconnectSocket() {
    socket?.disconnect()
    socket = null
  }

  export function getSocket() {
    return socket
  }
  ```

### Frontend
- [ ] Créer `hooks/useSocket.ts`
  ```typescript
  export function useSocket() {
    const { user } = useUserSession()
    const [socket, setSocket] = useState<Socket | null>(null)

    useEffect(() => {
      if (!user) return

      const token = getCookie('weokto_session') // Ou depuis context
      const s = connectSocket(token)
      setSocket(s)

      return () => {
        disconnectSocket()
      }
    }, [user])

    return socket
  }
  ```

## 11.3 - Composant Chat (Channel View)

### Frontend
- [ ] Créer `components/chat/ChannelChat.tsx`
- [ ] Props : `channelId`
- [ ] Logic :
  ```typescript
  const socket = useSocket()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    if (!socket) return

    socket.emit('join_channel', channelId)

    socket.on('channel_messages', (msgs) => {
      setMessages(msgs)
    })

    socket.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg])
    })

    return () => {
      socket.off('channel_messages')
      socket.off('new_message')
    }
  }, [socket, channelId])

  const sendMessage = () => {
    if (!inputValue.trim()) return

    socket?.emit('send_message', {
      channelId,
      content: inputValue,
    })

    setInputValue('')
  }
  ```

### Frontend
- [ ] UI :
  - Messages list (scroll to bottom auto)
  - Input message (textarea)
  - Bouton "Envoyer" (ou Enter)
  - Affichage avatar + displayName par message
  - Timestamp

### Frontend
- [ ] Intégrer dans `app/(weokto)/guild/[slug]/channel/[channelId]/page.tsx`

## 11.4 - Notifications (Unread Messages)

### Backend
- [ ] Créer `MessageReadStatus` table (si pas déjà dans schema) :
  - userId, messageId, readAt

### Backend
- [ ] Socket.io event `mark_read` :
  ```typescript
  socket.on('mark_read', async ({ channelId, messageId }) => {
    await prisma.messageReadStatus.create({
      data: {
        userId: socket.data.userId,
        messageId,
        readAt: new Date(),
      }
    })
  })
  ```

### Frontend
- [ ] Badge unread count sur sidebar channels :
  ```typescript
  const unreadCount = await prisma.message.count({
    where: {
      channelId,
      createdAt: { gt: lastReadAt },
      authorId: { not: userId }
    }
  })
  ```

### Backend
- [ ] API `/api/channels/[channelId]/unread`
  - GET
  - Retourner count messages non lus

## 11.5 - Chat Direct Messages (DM)

### Frontend
- [ ] Créer `app/(weokto)/messages/page.tsx`
  - Liste conversations DM
  - Click → ouvrir conversation

### Frontend
- [ ] Créer `app/(weokto)/messages/[userId]/page.tsx`
  - Chat 1-1 avec userId
  - Utiliser Socket.io room `dm:${userId1}:${userId2}` (sorted)

### Backend
- [ ] Socket.io events :
  ```typescript
  socket.on('join_dm', async (otherUserId) => {
    const roomId = createDMRoom(socket.data.userId, otherUserId)
    socket.join(roomId)

    const messages = await fetchDMMessages(socket.data.userId, otherUserId)
    socket.emit('dm_messages', messages)
  })

  socket.on('send_dm', async ({ recipientId, content }) => {
    const message = await prisma.directMessage.create({
      data: {
        senderId: socket.data.userId,
        recipientId,
        content,
      }
    })

    const roomId = createDMRoom(socket.data.userId, recipientId)
    io.to(roomId).emit('new_dm', message)
  })
  ```

---

# PHASE 12 : SYSTÈME FORMATIONS (BUNNY.NET)

## 12.1 - Configuration Bunny.net

### Backend
- [ ] Ajouter dans `.env` :
  ```
  BUNNY_LIBRARY_ID="..."
  BUNNY_API_KEY="..."
  BUNNY_CDN_URL="https://your-cdn.b-cdn.net"
  ```

### Backend
- [ ] Créer `lib/bunny/client.ts`
- [ ] Fonction `uploadVideo(file: File)` :
  ```typescript
  const formData = new FormData()
  formData.append('video', file)

  const response = await fetch(`https://video.bunnycdn.com/library/${BUNNY_LIBRARY_ID}/videos`, {
    method: 'POST',
    headers: {
      'AccessKey': BUNNY_API_KEY,
    },
    body: formData,
  })

  const { guid } = await response.json()
  return guid
  ```

### Backend
- [ ] Fonction `getVideoUrl(videoGuid: string)` :
  ```typescript
  return `${BUNNY_CDN_URL}/${videoGuid}/playlist.m3u8`
  ```

## 12.2 - Dashboard Owner : Upload Formations

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/formations/page.tsx`
  - Liste formations par produit
  - Bouton "Créer formation"

### Frontend
- [ ] Créer `app/wo-renwo-9492xE/formations/new/page.tsx`
  - Formulaire :
    - Titre
    - Description
    - Produit (select)
    - Modules (sections)
      - Pour chaque module :
        - Titre module
        - Leçons (array)
          - Titre leçon
          - Upload vidéo (Bunny.net)
          - Durée (auto depuis Bunny)
          - Order (drag & drop)
  - Submit → API `/api/owner/formations`

### Backend
- [ ] Créer `app/api/owner/formations/route.ts`
  - POST
  - Créer `Formation` avec `Module[]` et `Lesson[]`
  - Pour chaque vidéo uploadée :
    ```typescript
    const videoGuid = await uploadVideo(file)

    await prisma.lesson.create({
      data: {
        moduleId,
        title,
        videoUrl: getVideoUrl(videoGuid),
        videoDuration: duration,
        order,
      }
    })
    ```

## 12.3 - Page Formations (STAM Client)

### Frontend
- [ ] Créer `app/(stam)/formations/page.tsx`
  - Liste formations disponibles (selon Customer actif)
  - Cards formations avec progression (%)

### Frontend
- [ ] Créer `app/(stam)/formations/[formationId]/page.tsx`
  - Sidebar : Liste modules + leçons
  - Main : Video player (leçon active)
  - Bouton "Marquer comme complété"
  - Progression : X/Y leçons complétées

### Frontend
- [ ] Créer `components/formations/VideoPlayer.tsx`
  - Video.js ou Plyr.js
  - Source : HLS (Bunny.net .m3u8)
  - Controls : play/pause, seek, fullscreen, quality

### Backend
- [ ] Créer `app/stam/api/formations/[formationId]/route.ts`
  - GET
  - Retourner `Formation` avec `modules`, `lessons`
  - Include `LessonProgress` pour user connecté

## 12.4 - Tracking Progression

### Backend
- [ ] Créer `app/stam/api/lessons/[lessonId]/complete/route.ts`
  - POST
  - Logique :
    ```typescript
    await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.user.id,
          lessonId,
        }
      },
      update: {
        completedAt: new Date(),
        progress: 100,
      },
      create: {
        userId: session.user.id,
        lessonId,
        completedAt: new Date(),
        progress: 100,
      }
    })
    ```

### Backend
- [ ] Créer `app/stam/api/formations/[formationId]/progress/route.ts`
  - GET
  - Retourner :
    ```typescript
    const totalLessons = await prisma.lesson.count({
      where: { module: { formationId } }
    })

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: session.user.id,
        lesson: { module: { formationId } },
        completedAt: { not: null }
      }
    })

    const progress = (completedLessons / totalLessons) * 100

    return { progress, completedLessons, totalLessons }
    ```

---

# PHASE 13 : DASHBOARD ADMIN & PRODUCT MANAGER

## 13.1 - Dashboard Admin

### Frontend
- [ ] Créer `app/admin/layout.tsx`
  - Sidebar :
    - Dashboard
    - Utilisateurs
    - Produits
    - Communautés
    - Logs
    - Paramètres

### Frontend
- [ ] Créer `app/admin/dashboard/page.tsx`
  - Métriques globales :
    - Total users (WEOKTO + STAM)
    - Revenue (MRR + one-time)
    - Active subscriptions
    - Churn rate

### Frontend
- [ ] Créer `app/admin/users/page.tsx`
  - Table tous users (WEOKTO + STAM)
  - Colonnes : Email, Type, Platform, Créé le, Actions
  - Filtres : Platform, UserType
  - Search bar (email, displayName)
  - Actions : Voir détails, Modifier role, Suspendre

### Backend
- [ ] Créer `app/api/admin/users/route.ts`
  - GET : Liste users avec pagination
  - PATCH : Modifier user (role, status)

### Frontend
- [ ] Créer `app/admin/users/[userId]/page.tsx`
  - Détails user :
    - Info perso
    - Subscriptions actives
    - Commissions (si affilié)
    - Activity log

### Frontend
- [ ] Créer `app/admin/logs/page.tsx`
  - Table logs système
  - Filtres : Type (error, warning, info), Date

## 13.2 - Dashboard Product Manager

### Frontend
- [ ] Créer `app/product-manager/layout.tsx`
  - Sidebar :
    - Produits
    - Plans
    - Formations
    - Analytics

### Frontend
- [ ] Créer `app/product-manager/products/page.tsx`
  - Similaire owner mais limité :
    - Voir tous produits
    - Créer/modifier produits
    - PAS accès payouts, affiliates management

### Backend
- [ ] Créer `app/api/product-manager/products/route.ts`
  - GET : Liste produits
  - POST : Créer produit (si PRODUCT_MANAGER, ADMIN, ou OWNER)

---

# PHASE 14 : BLOG WEOKTO & STAM

## 14.1 - Structure Blog (Markdown Files)

### Backend
- [ ] Créer `content/blog/weokto/` et `content/blog/stam/`
- [ ] Chaque article = fichier `.md` avec frontmatter :
  ```markdown
  ---
  title: "Titre Article"
  slug: "titre-article"
  category: "community-building"
  author: "WEOKTO Team"
  publishedAt: "2025-01-15"
  excerpt: "Description courte..."
  image: "/images/blog/article.jpg"
  tags: ["affiliation", "guildes"]
  ---

  Contenu markdown...
  ```

## 14.2 - Blog WEOKTO

### Frontend
- [ ] Copier `/weokto site/WeOkto.com/app/(weokto)/blog/` vers `app/(weokto)/blog/`
- [ ] Adapter :
  - `app/(weokto)/blog/page.tsx` : Liste articles
  - `app/(weokto)/blog/post/[slug]/page.tsx` : Article détail
  - `components/blog/BlogCard.tsx` : Card article

### Backend
- [ ] Créer `lib/blog/weokto.ts`
- [ ] Fonction `getAllPosts()` :
  ```typescript
  import fs from 'fs'
  import path from 'path'
  import matter from 'gray-matter'

  const postsDirectory = path.join(process.cwd(), 'content/blog/weokto')

  export function getAllPosts() {
    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        ...data,
        content,
      }
    }).sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
  }

  export function getPostBySlug(slug: string) {
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return { slug, ...data, content }
  }
  ```

### Frontend
- [ ] `app/(weokto)/blog/page.tsx` :
  - Fetch `getAllPosts()`
  - Display grid cards
  - Filtres : Catégorie, Tags
  - Search bar

### Frontend
- [ ] `app/(weokto)/blog/post/[slug]/page.tsx` :
  - Fetch `getPostBySlug(slug)`
  - Render markdown avec `react-markdown` + `remark-gfm`
  - Sidebar : Articles récents, Catégories

### Frontend
- [ ] `app/(weokto)/blog/category/[slug]/page.tsx` :
  - Filtrer articles par catégorie

## 14.3 - Blog STAM

### Frontend
- [ ] Copier `/weokto site/WeOkto.com/app/(stam)/blog/` vers `app/(stam)/blog/`
- [ ] Identique WEOKTO mais branding STAM
- [ ] Content depuis `content/blog/stam/`

### Backend
- [ ] Créer `lib/blog/stam.ts` (similaire weokto.ts)

## 14.4 - SEO & Sitemap

### Backend
- [ ] Créer `app/(weokto)/blog/sitemap.xml/route.ts`
  ```typescript
  export async function GET() {
    const posts = getAllPosts()

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>https://weokto.com/blog/post/${post.slug}</loc>
          <lastmod>${post.publishedAt}</lastmod>
        </url>
      `).join('')}
    </urlset>`

    return new Response(xml, {
      headers: { 'Content-Type': 'application/xml' }
    })
  }
  ```

### Backend
- [ ] Créer `app/(weokto)/blog/rss.xml/route.ts` (RSS feed)

---

# PHASE 15 : OPTIMISATIONS & PERFORMANCE

## 15.1 - Caching Stratégique

### Backend
- [ ] Implémenter Redis caching pour :
  - Stats dashboard affilié (TTL 5 min)
  - Liste guildes (TTL 1h)
  - Blog posts (TTL 1h)

### Backend
- [ ] Créer `lib/cache/redis.ts`
  ```typescript
  import Redis from 'ioredis'

  const redis = new Redis(process.env.REDIS_URL)

  export async function getCached<T>(key: string, fetchFn: () => Promise<T>, ttl: number): Promise<T> {
    const cached = await redis.get(key)

    if (cached) {
      return JSON.parse(cached)
    }

    const data = await fetchFn()
    await redis.setex(key, ttl, JSON.stringify(data))

    return data
  }

  export async function invalidateCache(pattern: string) {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  }
  ```

### Backend
- [ ] Utiliser dans API routes :
  ```typescript
  // app/api/affiliate/stats/route.ts
  const stats = await getCached(
    `affiliate:stats:${session.user.id}`,
    () => calculateAffiliateStats(session.user.id),
    300 // 5 min TTL
  )
  ```

## 15.2 - Database Indexing

### Database
- [ ] Vérifier indexes Prisma schema (déjà dans SCHEMA_DATABASE_FINAL.md) :
  - `@@index([userId])` sur Sessions
  - `@@index([customerId])` sur Commissions
  - `@@index([affiliateId])` sur Tracking Events
  - `@@unique([email])` sur Users

### Database
- [ ] Si manquant, créer migration :
  ```prisma
  @@index([createdAt])
  @@index([status])
  ```

## 15.3 - Image Optimization

### Frontend
- [ ] Utiliser Next.js `<Image>` component partout :
  ```tsx
  import Image from 'next/image'

  <Image
    src="/images/hero.jpg"
    alt="Hero"
    width={1200}
    height={600}
    priority // Si above fold
    placeholder="blur" // Si possible
  />
  ```

### Frontend
- [ ] Compresser images avant upload (TinyPNG, ImageOptim)

## 15.4 - Code Splitting

### Frontend
- [ ] Lazy load modals :
  ```tsx
  const CheckoutModal = dynamic(() => import('@/components/payments/CheckoutModal'), {
    ssr: false,
    loading: () => <LoadingSpinner />
  })
  ```

### Frontend
- [ ] Lazy load chat component (heavy)
- [ ] Lazy load video player

## 15.5 - API Rate Limiting

### Backend
- [ ] Créer `lib/rate-limit.ts`
  ```typescript
  import { LRUCache } from 'lru-cache'

  const rateLimitCache = new LRUCache({
    max: 500,
    ttl: 60000, // 1 min
  })

  export function rateLimit(identifier: string, limit: number = 10) {
    const count = (rateLimitCache.get(identifier) as number) || 0

    if (count >= limit) {
      return { success: false, remaining: 0 }
    }

    rateLimitCache.set(identifier, count + 1)

    return { success: true, remaining: limit - count - 1 }
  }
  ```

### Backend
- [ ] Utiliser dans API routes sensibles :
  ```typescript
  // app/api/auth/magic-link/send/route.ts
  const { success } = rateLimit(email, 5) // 5 req/min

  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }
  ```

## 15.6 - Monitoring & Logging

### Backend
- [ ] Créer `lib/logger.ts`
  ```typescript
  export function logError(error: Error, context: any) {
    console.error({
      timestamp: new Date().toISOString(),
      error: error.message,
      stack: error.stack,
      context,
    })

    // TODO: Envoyer vers service externe (Sentry, LogRocket)
  }

  export function logInfo(message: string, data: any) {
    console.log({
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      data,
    })
  }
  ```

### Backend
- [ ] Wrapper try/catch dans routes :
  ```typescript
  try {
    // Logic
  } catch (error) {
    logError(error, { route: '/api/payments/initiate', userId })
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
  ```

---

# PHASE 16 : TESTING & BUG FIXES

## 16.1 - Tests Manuels Critiques

### Testing
- [ ] **Auth Flow WEOKTO** :
  - [ ] Envoyer magic link → recevoir email
  - [ ] Cliquer lien → redirect `/home`
  - [ ] Entrer OTP → redirect `/home`
  - [ ] Logout → redirect `/`

- [ ] **Auth Flow STAM** :
  - [ ] Envoyer magic link STAM
  - [ ] Vérifier → redirect `/stam/dashboard`

- [ ] **Choose Guild** :
  - [ ] Login sans guilde → redirect `/choose-guild`
  - [ ] Rejoindre Community Academy → redirect `/home`
  - [ ] Vérifier `currentGuildId` updaté en DB

- [ ] **Paiements PCI Vault** :
  - [ ] Click bouton paiement → modal iframe PCI Vault
  - [ ] Saisir CB test (PCI Vault sandbox)
  - [ ] Vérifier callback → Customer ACTIVE, PaymentMethod créé
  - [ ] Vérifier Commission créée (si tracking cookie)

- [ ] **Affiliation** :
  - [ ] Partager lien `?ref=affiliate123`
  - [ ] Vérifier tracking cookie créé (DevTools)
  - [ ] Acheter produit → vérifier Attribution créée
  - [ ] Vérifier Commission LOCKED avec lock dates correctes

- [ ] **Refund & Clawback** :
  - [ ] Demander refund client
  - [ ] Approuver refund owner
  - [ ] Vérifier Commission CLAWED_BACK

- [ ] **Payout Affilié** :
  - [ ] Maturer commission (modifier dates en DB pour test)
  - [ ] Effectuer payout manuel owner
  - [ ] Vérifier Ledger entry créée
  - [ ] Vérifier Commission PAID

- [ ] **Chat Socket.io** :
  - [ ] Login 2 users différents
  - [ ] Envoyer message channel → vérifier real-time
  - [ ] Envoyer DM → vérifier réception

- [ ] **Formations** :
  - [ ] Upload vidéo Bunny.net owner
  - [ ] Accéder formation client STAM
  - [ ] Lire vidéo (HLS)
  - [ ] Marquer leçon complétée → vérifier progression

## 16.2 - Tests Edge Cases

### Testing
- [ ] **Multi-produit STAM** :
  - [ ] Créer Customer avec 1 produit → vérifier SingleProductView
  - [ ] Ajouter 2e produit → vérifier TabsProductView
  - [ ] Ajouter 5+ produits → vérifier SidebarProductView

- [ ] **Lock Periods** :
  - [ ] Nouveau affilié (0j) → vérifier 45j + 90j
  - [ ] Modifier `firstCommissionAt` (35j) → vérifier 40j + 60j
  - [ ] Set riskLevel HIGH_RISK → vérifier 90j + 120j

- [ ] **Subscription Renewal** :
  - [ ] Subscription avec `currentPeriodEnd` demain
  - [ ] Lancer CRON `/api/cron/subscriptions`
  - [ ] Vérifier charge PCI Vault, nouvelle invoice, dates updatées

- [ ] **Free Product Attribution** :
  - [ ] Rejoindre guilde gratuite avec `?ref=xxx`
  - [ ] Vérifier `isFreeProductAttribution = true`
  - [ ] Upgrade vers premium → vérifier commission avec `metadata.fromFreeProduct`

## 16.3 - Bug Fixes

### Bug Tracking
- [ ] Créer fichier `BUGS.md` pour tracker bugs trouvés
- [ ] Pour chaque bug :
  - Description
  - Steps to reproduce
  - Expected vs Actual
  - Fix appliqué
  - Test de non-régression

### Common Issues
- [ ] **Session cookies** :
  - Vérifier `httpOnly`, `secure`, `sameSite`
  - Tester logout → cookie supprimé

- [ ] **Middleware redirects** :
  - Boucles infinies (redirect loop)
  - Paths incorrect (trailing slash)

- [ ] **Socket.io disconnect** :
  - Reconnexion auto
  - Cleanup listeners

- [ ] **PCI Vault iframe** :
  - Cross-origin issues (CORS)
  - PostMessage communication

---

# PHASE 17 : DÉPLOIEMENT & GIT SETUP

## 17.1 - Initialisation Git

### Backend
- [ ] Naviguer vers `/weokto_01`
- [ ] Exécuter `git init`
- [ ] Vérifier `.gitignore` présent (créé en Phase 0)
- [ ] Premier commit :
  ```bash
  git add .
  git commit -m "Initial commit - WEOKTO & STAM from scratch

  - Setup Next.js 15 + TypeScript + Tailwind
  - Prisma schema complet (consolidé)
  - Documentation complète (docs/)
  - Structure projet de base

  🤖 Generated with Claude Code

  Co-Authored-By: Claude <noreply@anthropic.com>"
  ```

## 17.2 - Push vers GitHub (Même Repo)

### Backend
- [ ] Vérifier remote GitHub existant :
  ```bash
  cd "/Users/zachariepiocelle/Mac/weokto/weokto site/WeOkto.com"
  git remote -v
  ```
- [ ] Copier URL remote (ex: `git@github.com:username/weokto.git`)

### Backend
- [ ] Retourner vers nouveau projet :
  ```bash
  cd "/Users/zachariepiocelle/Mac/weokto/weokto_01"
  git remote add origin <URL_COPIEE>
  ```

### Backend
- [ ] Créer branche `v2-from-scratch` :
  ```bash
  git checkout -b v2-from-scratch
  git push -u origin v2-from-scratch
  ```

## 17.3 - Déploiement Vercel (Frontend + API)

### Deployment
- [ ] Aller sur vercel.com
- [ ] Connecter repo GitHub
- [ ] New Project → Import `weokto` repo
- [ ] Configuration :
  - Root Directory : `/weokto_01` (ou déplacer fichiers à la racine)
  - Framework : Next.js
  - Build Command : `npm run build`
  - Environment Variables : Copier depuis `.env`
- [ ] Deploy

### Deployment
- [ ] Vérifier deployment réussi
- [ ] Tester URL production : `https://weokto.vercel.app`

## 17.4 - Déploiement Socket.io Server (Railway/Render)

### Deployment
- [ ] Créer compte Railway.app ou Render.com
- [ ] New Project → Deploy from GitHub
- [ ] Sélectionner repo, branche `v2-from-scratch`
- [ ] Configuration :
  - Build Command : `npm install && npm run build`
  - Start Command : `npm run socket-server`
  - Environment Variables : `REDIS_URL`, `DATABASE_URL`, `JWT_SECRET`
- [ ] Deploy

### Deployment
- [ ] Noter URL Socket.io : `https://weokto-socket.railway.app`
- [ ] Updater `.env` Vercel : `NEXT_PUBLIC_SOCKET_URL=https://weokto-socket.railway.app`
- [ ] Redeploy Vercel

## 17.5 - Configuration DNS (STAM Hosts)

### Deployment
- [ ] Aller sur registrar domaine (ex: Namecheap)
- [ ] Ajouter A record pour `be-stam.com` → IP Vercel
- [ ] Ajouter CNAME `www.be-stam.com` → `cname.vercel-dns.com`
- [ ] Dans Vercel : Add domain `be-stam.com`
- [ ] Vérifier SSL certificate auto

### Deployment
- [ ] Tester :
  - `https://weokto.com` → Landing WEOKTO
  - `https://be-stam.com` → Landing STAM
  - Middleware routing fonctionne

## 17.6 - Setup CRON Jobs

### Deployment
- [ ] Dans Vercel : Settings → Cron Jobs
- [ ] Ajouter :
  - `/api/cron/subscriptions` → Daily 2AM
  - `/api/cron/commissions` → Daily 3AM
- [ ] Ou utiliser service externe (cron-job.org) :
  - URL : `https://weokto.com/api/cron/subscriptions`
  - Header : `Authorization: Bearer ${CRON_SECRET}`

## 17.7 - Monitoring Production

### Deployment
- [ ] Setup Sentry (erreurs) :
  - `npm install @sentry/nextjs`
  - Configurer `sentry.client.config.ts`
  - Ajouter `SENTRY_DSN` en env var

### Deployment
- [ ] Setup Analytics (optionnel) :
  - Vercel Analytics (built-in)
  - Ou Plausible/Fathom (privacy-friendly)

## 17.8 - Backup & Database

### Deployment
- [ ] Configurer backups automatiques Supabase :
  - Settings → Database → Backups
  - Daily backups activés

### Deployment
- [ ] Vérifier point-in-time recovery activé

## 17.9 - Documentation Déploiement

### Documentation
- [ ] Créer `docs/DEPLOYMENT.md` :
  - URLs production (WEOKTO, STAM, Socket.io)
  - Environment variables requises
  - Procédure rollback
  - Contacts support (Vercel, Railway, Supabase)

## 17.10 - Post-Deployment Checks

### Testing
- [ ] Login WEOKTO production
- [ ] Login STAM production
- [ ] Acheter produit test (PCI Vault sandbox)
- [ ] Envoyer message chat
- [ ] Vérifier CRON logs (Vercel → Functions → Logs)

---

# RÉCAPITULATIF FINAL

## ✅ Checklist Complète

### Infrastructure
- [x] Next.js 15 + TypeScript + Tailwind
- [x] Prisma + PostgreSQL (Supabase)
- [x] Socket.io + Redis
- [x] PCI Vault integration
- [x] Bunny.net (vidéos)
- [x] Resend (emails)

### Authentification
- [x] Magic Links (WEOKTO + STAM)
- [x] JWT sessions (séparées)
- [x] Middleware routing
- [x] Protected routes

### Produits & Paiements
- [x] Création produits/plans (Owner)
- [x] Boutons paiement manuels
- [x] Checkout PCI Vault (proxy-only)
- [x] Subscriptions & renewals
- [x] Refunds & clawback

### Affiliation
- [x] Tracking cookies (30j, last-click)
- [x] Attribution
- [x] Commissions (lock periods progressifs)
- [x] Maturation & payouts
- [x] Ledgers
- [x] Dashboard affilié (stats basiques)

### Frontend
- [x] Landing pages (WEOKTO + STAM)
- [x] Dashboard users (WEOKTO + STAM)
- [x] Dashboard owner
- [x] Dashboard admin
- [x] Dashboard product manager
- [x] Choose guild
- [x] Guildes & channels
- [x] Multi-produit STAM (layout adaptatif)

### Chat
- [x] Socket.io server
- [x] Chat channels (temps réel)
- [x] Direct messages
- [x] Notifications unread

### Formations
- [x] Upload vidéos Bunny.net
- [x] Player HLS
- [x] Tracking progression
- [x] Modules & leçons

### Blog
- [x] Blog WEOKTO (markdown)
- [x] Blog STAM
- [x] SEO (sitemap, RSS)

### Performance
- [x] Redis caching
- [x] Image optimization
- [x] Code splitting
- [x] Rate limiting

### Déploiement
- [x] Git setup
- [x] Vercel (frontend)
- [x] Railway (Socket.io)
- [x] DNS (STAM hosts)
- [x] CRON jobs
- [x] Monitoring

## 🎯 Résultat Final

**Site 100% fonctionnel et production-ready** avec :
- ✅ Utilisateurs WEOKTO (affiliés) peuvent s'inscrire, rejoindre guildes, gagner commissions
- ✅ Utilisateurs STAM (clients) peuvent acheter, accéder formations, chatter
- ✅ Owner peut créer produits, gérer affiliés, effectuer payouts
- ✅ Admin peut gérer users et voir analytics
- ✅ Product Manager peut gérer produits/formations
- ✅ Paiements sécurisés (PCI Vault proxy)
- ✅ Chat temps réel fonctionnel
- ✅ Blog actif (WEOKTO + STAM)
- ✅ Optimisé et scalable

**TOUT est couvert. Le site est LANCÉ et UTILISABLE par TOUS les utilisateurs.** 🚀
