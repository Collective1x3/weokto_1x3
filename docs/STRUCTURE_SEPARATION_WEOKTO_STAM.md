# 📁 STRUCTURE SÉPARÉE WEOKTO & STAM

**Mise à jour** : Ce document explique la structure de dossiers avec séparation claire entre WEOKTO et STAM dès le début.

---

## 🎯 Principe de Séparation

**WEOKTO** et **STAM** sont deux plateformes distinctes partageant la même infrastructure mais avec :
- URLs différentes (weokto.com vs be-stam.com)
- Branding différent
- Layouts différents
- Fonctionnalités spécifiques

**Solution** : Utiliser les **Route Groups** de Next.js `(weokto)` et `(stam)` pour séparer clairement le code.

---

## 📂 Structure Complète du Projet

```
weokto_01/
│
├── app/
│   ├── (weokto)/                          # 🟣 ROUTES WEOKTO
│   │   ├── layout.tsx                     # Layout spécifique WEOKTO
│   │   ├── page.tsx                       # Landing page WEOKTO
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                   # Login WEOKTO
│   │   ├── verify-otp/
│   │   │   └── page.tsx                   # Vérification OTP WEOKTO
│   │   │
│   │   ├── home/
│   │   │   ├── layout.tsx                 # Dashboard layout avec sidebar
│   │   │   └── page.tsx                   # Dashboard home
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx                   # Profil utilisateur WEOKTO
│   │   │
│   │   ├── settings/
│   │   │   └── page.tsx                   # Paramètres WEOKTO
│   │   │
│   │   ├── choose-guild/
│   │   │   └── page.tsx                   # Choix guilde (Community Academy, TBCB)
│   │   │
│   │   ├── guild/
│   │   │   └── [slug]/
│   │   │       ├── layout.tsx             # Layout guilde (sidebar channels)
│   │   │       ├── page.tsx               # Guilde overview
│   │   │       └── channel/
│   │   │           └── [channelId]/
│   │   │               └── page.tsx       # Channel chat
│   │   │
│   │   ├── affiliate/
│   │   │   ├── dashboard/
│   │   │   │   └── page.tsx               # Dashboard affilié (stats, MRR)
│   │   │   ├── commissions/
│   │   │   │   └── page.tsx               # Liste commissions
│   │   │   ├── payouts/
│   │   │   │   └── page.tsx               # Historique payouts
│   │   │   └── ledger/
│   │   │       └── page.tsx               # Transactions ledger
│   │   │
│   │   ├── messages/
│   │   │   ├── page.tsx                   # Liste conversations
│   │   │   └── [userId]/
│   │   │       └── page.tsx               # Chat 1-1
│   │   │
│   │   └── blog/
│   │       ├── page.tsx                   # Liste articles blog WEOKTO
│   │       ├── post/
│   │       │   └── [slug]/
│   │       │       └── page.tsx           # Article détail
│   │       └── category/
│   │           └── [slug]/
│   │               └── page.tsx           # Articles par catégorie
│   │
│   ├── (stam)/                            # 🔵 ROUTES STAM
│   │   ├── layout.tsx                     # Layout spécifique STAM
│   │   ├── page.tsx                       # Landing page STAM
│   │   │
│   │   ├── login/
│   │   │   └── page.tsx                   # Login STAM
│   │   ├── verify-otp/
│   │   │   └── page.tsx                   # Vérification OTP STAM
│   │   │
│   │   ├── dashboard/
│   │   │   ├── layout.tsx                 # Dashboard layout STAM
│   │   │   └── page.tsx                   # Dashboard STAM (multi-produit)
│   │   │
│   │   ├── profile/
│   │   │   └── page.tsx                   # Profil STAM
│   │   │
│   │   ├── settings/
│   │   │   └── page.tsx                   # Paramètres STAM (annulation, refund)
│   │   │
│   │   ├── formations/
│   │   │   ├── page.tsx                   # Liste formations
│   │   │   └── [formationId]/
│   │   │       └── page.tsx               # Formation détail (vidéo player)
│   │   │
│   │   ├── messages/
│   │   │   ├── page.tsx                   # Messages STAM
│   │   │   └── [userId]/
│   │   │       └── page.tsx               # Chat 1-1 STAM
│   │   │
│   │   └── blog/
│   │       ├── page.tsx                   # Blog STAM
│   │       └── [slug]/
│   │           └── page.tsx               # Article STAM
│   │
│   ├── api/
│   │   ├── auth/                          # 🟣 API WEOKTO Auth
│   │   │   ├── magic-link/
│   │   │   │   ├── send/route.ts
│   │   │   │   ├── verify/route.ts
│   │   │   │   └── verify-otp/route.ts
│   │   │   ├── logout/route.ts
│   │   │   ├── me/route.ts
│   │   │   ├── update-profile/route.ts
│   │   │   └── choose-guild/route.ts
│   │   │
│   │   ├── guilds/                        # 🟣 API Guildes
│   │   │   ├── route.ts
│   │   │   └── [slug]/
│   │   │       ├── route.ts
│   │   │       ├── channels/route.ts
│   │   │       ├── join/route.ts
│   │   │       └── membership/route.ts
│   │   │
│   │   ├── affiliate/                     # 🟣 API Affiliation
│   │   │   ├── track/route.ts
│   │   │   ├── stats/route.ts
│   │   │   ├── commissions/route.ts
│   │   │   ├── payouts/route.ts
│   │   │   └── ledger/route.ts
│   │   │
│   │   ├── payments/                      # 💳 API Paiements (partagé)
│   │   │   ├── button-config/route.ts
│   │   │   ├── initiate/route.ts
│   │   │   └── pci-vault/
│   │   │       └── callback/route.ts
│   │   │
│   │   ├── owner/                         # 👑 API Owner
│   │   │   ├── products/route.ts
│   │   │   ├── plans/route.ts
│   │   │   ├── payment-buttons/route.ts
│   │   │   ├── formations/route.ts
│   │   │   ├── affiliates/route.ts
│   │   │   ├── analytics/route.ts
│   │   │   ├── refunds/
│   │   │   │   └── [refundId]/
│   │   │   │       ├── approve/route.ts
│   │   │   │       └── reject/route.ts
│   │   │   └── payouts/
│   │   │       └── create/route.ts
│   │   │
│   │   ├── admin/                         # 🛡️ API Admin
│   │   │   ├── users/route.ts
│   │   │   └── logs/route.ts
│   │   │
│   │   ├── product-manager/               # 📦 API Product Manager
│   │   │   └── products/route.ts
│   │   │
│   │   ├── stam/                          # 🔵 API STAM (toutes routes STAM)
│   │   │   ├── auth/
│   │   │   │   └── magic-link/
│   │   │   │       ├── send/route.ts
│   │   │   │       ├── verify/route.ts
│   │   │   │       └── verify-otp/route.ts
│   │   │   ├── customers/route.ts
│   │   │   ├── formations/
│   │   │   │   ├── [formationId]/
│   │   │   │   │   ├── route.ts
│   │   │   │   │   └── progress/route.ts
│   │   │   │   └── route.ts
│   │   │   ├── lessons/
│   │   │   │   └── [lessonId]/
│   │   │   │       └── complete/route.ts
│   │   │   └── refund/
│   │   │       └── request/route.ts
│   │   │
│   │   └── cron/                          # ⏰ CRON Jobs
│   │       ├── subscriptions/route.ts
│   │       └── commissions/route.ts
│   │
│   ├── wo-renwo-9492xE/                   # 👑 DASHBOARD OWNER (hors groupes)
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── plans/
│   │   ├── payment-buttons/
│   │   ├── formations/
│   │   ├── affiliates/
│   │   ├── refunds/
│   │   ├── payouts/
│   │   └── analytics/
│   │
│   ├── admin/                             # 🛡️ DASHBOARD ADMIN
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   ├── users/
│   │   └── logs/
│   │
│   ├── product-manager/                   # 📦 DASHBOARD PRODUCT MANAGER
│   │   ├── layout.tsx
│   │   ├── products/
│   │   ├── plans/
│   │   └── formations/
│   │
│   └── layout.tsx                         # Root layout
│
├── components/
│   ├── weokto/                            # 🟣 COMPOSANTS WEOKTO
│   │   ├── WeoktoSidebar.tsx
│   │   ├── TerminalHeaderLandingPage.tsx
│   │   ├── FooterLandingPage.tsx
│   │   ├── FAQSection.tsx
│   │   ├── TerminalAuthModal.tsx
│   │   └── ...
│   │
│   ├── stam/                              # 🔵 COMPOSANTS STAM
│   │   ├── StamSidebar.tsx
│   │   ├── HeaderStam.tsx
│   │   ├── FooterStam.tsx
│   │   ├── StamAuthModal.tsx
│   │   ├── MultiProductLayout.tsx
│   │   ├── SingleProductView.tsx
│   │   ├── TabsProductView.tsx
│   │   └── SidebarProductView.tsx
│   │
│   ├── shared/                            # 🔄 COMPOSANTS PARTAGÉS
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── ...
│   │
│   ├── payments/                          # 💳 COMPOSANTS PAIEMENTS
│   │   ├── ManualPaymentButton.tsx
│   │   └── CheckoutModal.tsx
│   │
│   ├── chat/                              # 💬 COMPOSANTS CHAT
│   │   ├── ChannelChat.tsx
│   │   └── MessageItem.tsx
│   │
│   ├── formations/                        # 🎓 COMPOSANTS FORMATIONS
│   │   └── VideoPlayer.tsx
│   │
│   └── guild/                             # 🏰 COMPOSANTS GUILDES
│       └── GuildSidebar.tsx
│
├── lib/
│   ├── auth/
│   │   ├── config.ts                      # Config JWT (WEOKTO + STAM)
│   │   ├── session.ts                     # Sessions WEOKTO
│   │   └── stam/
│   │       └── session.ts                 # Sessions STAM
│   │
│   ├── affiliate/
│   │   ├── commission.ts                  # Calcul commissions
│   │   └── clawback.ts                    # Clawback refunds
│   │
│   ├── payments/
│   │   └── billing.ts                     # Calculs billing
│   │
│   ├── pcivault/
│   │   └── client.ts                      # Client PCI Vault
│   │
│   ├── bunny/
│   │   └── client.ts                      # Client Bunny.net
│   │
│   ├── email/
│   │   └── send-magic-link.ts             # Envoi emails
│   │
│   ├── socket/
│   │   └── client.ts                      # Socket.io client
│   │
│   ├── blog/
│   │   ├── weokto.ts                      # Blog WEOKTO
│   │   └── stam.ts                        # Blog STAM
│   │
│   ├── cache/
│   │   └── redis.ts                       # Caching Redis
│   │
│   ├── cron/
│   │   ├── subscriptions.ts               # CRON subscriptions
│   │   └── commissions.ts                 # CRON commissions
│   │
│   ├── security.ts                        # Utils sécurité
│   ├── logger.ts                          # Logging
│   └── prisma.ts                          # Prisma singleton
│
├── contexts/
│   ├── AuthContext.tsx                    # Context auth WEOKTO
│   ├── UserSessionContext.tsx             # Context user WEOKTO
│   └── StamUserContext.tsx                # Context user STAM
│
├── hooks/
│   ├── useSocket.ts                       # Hook Socket.io
│   └── useAffiliateTracking.ts            # Hook tracking affilié
│
├── content/
│   └── blog/
│       ├── weokto/                        # Articles WEOKTO
│       │   ├── article-1.md
│       │   └── article-2.md
│       └── stam/                          # Articles STAM
│           ├── article-1.md
│           └── article-2.md
│
├── server/
│   └── socket-server.ts                   # Serveur Socket.io standalone
│
├── prisma/
│   ├── schema.prisma                      # Schéma Prisma (FINAL)
│   ├── seed.ts                            # Seed (guildes initiales)
│   └── migrations/
│
├── public/
│   ├── images/
│   └── fonts/
│
├── docs/                                   # 📚 DOCUMENTATION
│   ├── README.md
│   ├── GETTING_STARTED.md
│   ├── PLAN_EXECUTION_COMPLET.md ⭐️
│   ├── SCHEMA_DATABASE_FINAL.md
│   ├── DASHBOARD_AFFILIE_AVANCE.md
│   ├── DOCUMENTATION_TECHNIQUE_COMPLETE.md
│   ├── INDEX.md
│   ├── README_DOCUMENTATION.md
│   ├── STRUCTURE_SEPARATION_WEOKTO_STAM.md (ce fichier)
│   └── pcivault_docs_llm.md
│
├── middleware.ts                          # Middleware routing WEOKTO/STAM
├── .env.example
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── README.md
```

---

## 🔄 Comment ça Fonctionne ?

### 1. Route Groups `(weokto)` et `(stam)`

Les parenthèses `()` créent des **Route Groups** :
- Organisent le code sans affecter les URLs
- Permettent des layouts différents
- URLs restent propres : `/home`, `/dashboard` (pas `/weokto/home`)

**Exemple** :
```
app/(weokto)/home/page.tsx → URL: https://weokto.com/home
app/(stam)/dashboard/page.tsx → URL: https://be-stam.com/dashboard
```

### 2. Layouts Séparés

**WEOKTO Layout** (`app/(weokto)/layout.tsx`) :
```typescript
export default function WeoktoLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-[#1e1e1e] text-white">
        {/* Branding WEOKTO violet #B794F4 */}
        {children}
      </body>
    </html>
  )
}
```

**STAM Layout** (`app/(stam)/layout.tsx`) :
```typescript
export default function StamLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white text-gray-900">
        {/* Branding STAM distinct */}
        {children}
      </body>
    </html>
  )
}
```

### 3. Middleware Routing par Hostname

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const { pathname } = request.nextUrl

  // Détection STAM
  const stamHosts = ['be-stam.com', 'www.be-stam.com']
  const isStamHost = stamHosts.some(h => hostname.includes(h))

  // Routing automatique par Next.js via route groups
  // Pas besoin de rewrites manuels !

  // Vérifications sessions
  if (isStamHost) {
    // Vérifier stam_session cookie
    const session = await getStamSession()
    // ...
  } else {
    // Vérifier weokto_session cookie
    const session = await getSession()
    // ...
  }
}
```

### 4. API Routes Séparées

**WEOKTO API** : `/api/auth/*`, `/api/affiliate/*`, `/api/guilds/*`
**STAM API** : `/api/stam/auth/*`, `/api/stam/customers/*`, `/api/stam/formations/*`

**Avantage** : Clarté totale, pas de confusion entre plateformes.

---

## 🎨 Branding Séparé

### WEOKTO
- **Couleurs** : Violet #B794F4, Noir #1e1e1e
- **Style** : Terminal/Hacker, Dark mode
- **Fonts** : Monospace, Cyber
- **Composants** : `components/weokto/*`

### STAM
- **Couleurs** : À définir (ex: Bleu, Blanc)
- **Style** : Moderne, Clean, Light mode
- **Fonts** : Sans-serif élégant
- **Composants** : `components/stam/*`

---

## ✅ Avantages de cette Structure

1. **Clarté** : Code WEOKTO et STAM bien séparés
2. **Maintenabilité** : Facile de modifier une plateforme sans affecter l'autre
3. **Scalabilité** : Ajouter features spécifiques facilement
4. **URLs propres** : Pas de `/weokto/` ou `/stam/` dans les URLs
5. **Layouts automatiques** : Next.js gère les layouts par groupe
6. **Branding distinct** : Styles complètement séparés
7. **Testing plus facile** : Tester chaque plateforme indépendamment

---

## 🚀 Prochaines Étapes

1. Suivre **[PLAN_EXECUTION_COMPLET.md](PLAN_EXECUTION_COMPLET.md)**
2. Créer structure de dossiers selon ce document
3. Copier composants existants dans bons dossiers (`weokto/` ou `stam/`)
4. Implémenter middleware avec routing hostname
5. Tester séparation avec `localhost:3000` (WEOKTO) et hostname STAM local

---

**Cette structure est DÉFINITIVE et PRODUCTION-READY.** 🎉
