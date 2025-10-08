# 📊 DASHBOARD AFFILIÉ AVANCÉ - MÉTRIQUES COMPLÈTES

**Version** : 1.0.0
**Date** : 2025-01-08

---

## 🎯 VUE D'ENSEMBLE

Dashboard complet pour chaque affilié WEOKTO avec :
- **MRR** (Monthly Recurring Revenue) calculé sur commissions actives
- **Clients gratuits** liés avec période de liaison
- **Trials** en cours et taux de conversion
- **Clients en annulation** (churn)
- **Cookies de tracking** restants
- **Taux de conversion** sur pages
- **Statistiques avancées** temps réel

---

## 📈 MÉTRIQUES PRINCIPALES

### 1. MRR (Monthly Recurring Revenue)

**Calcul** : Somme des commissions récurrentes mensuelles des clients actifs de l'affilié.

```typescript
// lib/affiliate/metrics/mrr.ts

interface MRRMetrics {
  currentMRR: number       // MRR actuel (€)
  projectedMRR: number     // MRR projeté (inclut trials)
  mrrGrowth: number        // Croissance MRR (%)
  mrrByProduct: {
    productId: string
    productName: string
    mrr: number
    customerCount: number
  }[]
}

export async function calculateAffiliateMRR(affiliateId: string): Promise<MRRMetrics> {
  const now = new Date()
  const lastMonth = subMonths(now, 1)

  // 1. Récupérer toutes les commissions actives de l'affilié
  const activeCommissions = await prisma.affiliateCommission.findMany({
    where: {
      affiliateId,
      status: { in: ['LOCKED', 'MATURED', 'PAID'] },
      createdAt: { gte: subMonths(now, 12) } // 12 derniers mois
    },
    include: {
      customer: {
        include: {
          plan: true,
          product: true
        }
      },
      program: {
        include: { product: true }
      }
    }
  })

  // 2. Filtrer les clients avec abonnements actifs
  const activeSubscriptions = activeCommissions.filter(c =>
    c.customer?.status === 'ACTIVE' &&
    c.customer?.plan?.billingInterval !== 'ONE_TIME' &&
    c.customer?.plan?.billingInterval !== 'LIFETIME'
  )

  // 3. Calculer MRR actuel
  let currentMRR = 0
  const mrrByProduct = new Map<string, { mrr: number; count: number; name: string }>()

  for (const commission of activeSubscriptions) {
    const plan = commission.customer.plan

    // Normaliser en mensuel
    let monthlyCommission = commission.totalAmount / 100 // Convertir centimes en euros

    if (plan.billingInterval === 'QUARTERLY') {
      monthlyCommission = monthlyCommission / 3
    } else if (plan.billingInterval === 'ANNUALLY') {
      monthlyCommission = monthlyCommission / 12
    }

    currentMRR += monthlyCommission

    // Grouper par produit
    const productId = commission.program.productId
    const existing = mrrByProduct.get(productId) || {
      mrr: 0,
      count: 0,
      name: commission.program.product.name
    }
    existing.mrr += monthlyCommission
    existing.count += 1
    mrrByProduct.set(productId, existing)
  }

  // 4. Calculer MRR projeté (inclut trials qui vont se convertir)
  const trials = await prisma.customer.findMany({
    where: {
      status: 'TRIAL',
      trialEndsAt: { gte: now },
      id: { in: activeSubscriptions.map(c => c.customerId) }
    },
    include: { plan: true }
  })

  let projectedMRR = currentMRR

  for (const trial of trials) {
    // Estimer conversion (taux par défaut : 30%)
    const conversionRate = 0.30
    const plan = trial.plan

    if (plan && plan.billingInterval !== 'ONE_TIME') {
      const monthlyValue = calculateMonthlyValue(plan.priceAmount / 100, plan.billingInterval)

      // Récupérer taux commission pour ce produit
      const commission = activeSubscriptions.find(c => c.customerId === trial.id)
      if (commission) {
        const commissionAmount = monthlyValue * parseFloat(commission.rateApplied.toString())
        projectedMRR += commissionAmount * conversionRate
      }
    }
  }

  // 5. Croissance MRR
  const lastMonthMRR = await calculateMRRAtDate(affiliateId, lastMonth)
  const mrrGrowth = lastMonthMRR > 0
    ? ((currentMRR - lastMonthMRR) / lastMonthMRR) * 100
    : 0

  return {
    currentMRR: Math.round(currentMRR * 100) / 100,
    projectedMRR: Math.round(projectedMRR * 100) / 100,
    mrrGrowth: Math.round(mrrGrowth * 100) / 100,
    mrrByProduct: Array.from(mrrByProduct.entries()).map(([productId, data]) => ({
      productId,
      productName: data.name,
      mrr: Math.round(data.mrr * 100) / 100,
      customerCount: data.count
    }))
  }
}

function calculateMonthlyValue(amount: number, interval: string): number {
  switch (interval) {
    case 'MONTHLY': return amount
    case 'QUARTERLY': return amount / 3
    case 'ANNUALLY': return amount / 12
    default: return 0
  }
}
```

---

### 2. Clients Gratuits Affiliés

**Tracking** : Clients qui ont rejoint via lien affilié avec produit gratuit, avec période de liaison qui expire.

```typescript
// lib/affiliate/metrics/free-clients.ts

interface FreeClientsMetrics {
  totalActive: number              // Nombre total clients gratuits actifs
  expiringThisWeek: number         // Expirent dans 7 jours
  expiringThisMonth: number        // Expirent dans 30 jours
  totalExpired: number             // Expirés (perdus)
  conversionRate: number           // % qui ont upgrade
  freeClients: FreeClient[]
}

interface FreeClient {
  customerId: string
  email: string
  productName: string
  attributedAt: Date
  expiresAt: Date
  daysRemaining: number
  hasUpgraded: boolean
}

export async function getFreeClientsMetrics(affiliateId: string): Promise<FreeClientsMetrics> {
  const now = new Date()
  const weekFromNow = addDays(now, 7)
  const monthFromNow = addDays(now, 30)

  // 1. Récupérer attributions gratuites actives
  const freeAttributions = await prisma.affiliateAttribution.findMany({
    where: {
      affiliateId,
      isFreeProductAttribution: true,
      replacedAt: null
    },
    include: {
      customer: {
        include: {
          stamUser: true,
          product: true,
          plan: true
        }
      }
    }
  })

  const freeClients: FreeClient[] = []
  let expiringThisWeek = 0
  let expiringThisMonth = 0
  let totalExpired = 0
  let totalUpgraded = 0

  for (const attribution of freeAttributions) {
    const expiresAt = attribution.attributionExpiresAt

    if (!expiresAt) continue

    const daysRemaining = differenceInDays(expiresAt, now)
    const hasUpgraded = attribution.customer?.plan?.priceAmount > 0

    // Compter conversions
    if (hasUpgraded) {
      totalUpgraded++
    }

    // Compter expirations
    if (daysRemaining < 0) {
      totalExpired++
    } else if (daysRemaining <= 7) {
      expiringThisWeek++
    } else if (daysRemaining <= 30) {
      expiringThisMonth++
    }

    // Ajouter à la liste (seulement actifs non expirés)
    if (daysRemaining >= 0 && !hasUpgraded) {
      freeClients.push({
        customerId: attribution.customer.id,
        email: attribution.customer.stamUser.email,
        productName: attribution.customer.product.name,
        attributedAt: attribution.boundAt,
        expiresAt,
        daysRemaining,
        hasUpgraded
      })
    }
  }

  const totalActive = freeClients.length
  const conversionRate = freeAttributions.length > 0
    ? (totalUpgraded / freeAttributions.length) * 100
    : 0

  return {
    totalActive,
    expiringThisWeek,
    expiringThisMonth,
    totalExpired,
    conversionRate: Math.round(conversionRate * 100) / 100,
    freeClients: freeClients.sort((a, b) => a.daysRemaining - b.daysRemaining)
  }
}
```

---

### 3. Trials & Conversions

**Tracking** : Essais gratuits en cours, taux de conversion, clients en période trial.

```typescript
// lib/affiliate/metrics/trials.ts

interface TrialMetrics {
  activeTrials: number
  endingThisWeek: number
  conversionRate: number           // % trials convertis en payants
  averageConversionTime: number    // Jours moyens avant conversion
  trials: TrialInfo[]
}

interface TrialInfo {
  customerId: string
  email: string
  productName: string
  planName: string
  trialStartedAt: Date
  trialEndsAt: Date
  daysRemaining: number
  likelihood: 'high' | 'medium' | 'low' // Probabilité conversion
}

export async function getTrialMetrics(affiliateId: string): Promise<TrialMetrics> {
  const now = new Date()
  const weekFromNow = addDays(now, 7)

  // 1. Récupérer attributions de l'affilié avec customers en trial
  const attributions = await prisma.affiliateAttribution.findMany({
    where: {
      affiliateId,
      replacedAt: null,
      customer: {
        status: 'TRIAL'
      }
    },
    include: {
      customer: {
        include: {
          stamUser: true,
          product: true,
          plan: true
        }
      }
    }
  })

  const trials: TrialInfo[] = []
  let endingThisWeek = 0

  for (const attr of attributions) {
    const customer = attr.customer
    if (!customer || !customer.trialEndsAt) continue

    const daysRemaining = differenceInDays(customer.trialEndsAt, now)

    if (daysRemaining < 0) continue // Trial déjà terminé

    if (daysRemaining <= 7) {
      endingThisWeek++
    }

    // Calculer likelihood basé sur engagement (simpliste ici)
    const likelihood: 'high' | 'medium' | 'low' =
      daysRemaining > 14 ? 'low' :
      daysRemaining > 7 ? 'medium' :
      'high'

    trials.push({
      customerId: customer.id,
      email: customer.stamUser.email,
      productName: customer.product.name,
      planName: customer.plan?.name || 'N/A',
      trialStartedAt: customer.createdAt,
      trialEndsAt: customer.trialEndsAt,
      daysRemaining,
      likelihood
    })
  }

  // 2. Calculer taux de conversion (trials passés)
  const pastTrials = await prisma.customer.findMany({
    where: {
      id: { in: (await prisma.affiliateAttribution.findMany({
        where: { affiliateId },
        select: { customerId: true }
      })).map(a => a.customerId).filter(Boolean) as string[] },
      trialEndsAt: { lt: now }
    }
  })

  const converted = pastTrials.filter(c => c.status === 'ACTIVE').length
  const conversionRate = pastTrials.length > 0
    ? (converted / pastTrials.length) * 100
    : 0

  // 3. Temps moyen de conversion
  const convertedWithTiming = await prisma.customer.findMany({
    where: {
      id: { in: pastTrials.filter(c => c.status === 'ACTIVE').map(c => c.id) }
    },
    select: {
      createdAt: true,
      subscriptionEndsAt: true
    }
  })

  const avgConversionTime = convertedWithTiming.length > 0
    ? convertedWithTiming.reduce((sum, c) => {
        return sum + differenceInDays(c.subscriptionEndsAt || now, c.createdAt)
      }, 0) / convertedWithTiming.length
    : 0

  return {
    activeTrials: trials.length,
    endingThisWeek,
    conversionRate: Math.round(conversionRate * 100) / 100,
    averageConversionTime: Math.round(avgConversionTime),
    trials: trials.sort((a, b) => a.daysRemaining - b.daysRemaining)
  }
}
```

---

### 4. Churn (Clients en Annulation)

**Tracking** : Clients qui ont annulé ou sont sur le point d'annuler.

```typescript
// lib/affiliate/metrics/churn.ts

interface ChurnMetrics {
  churnedThisMonth: number         // Clients perdus ce mois
  churnRate: number                // % churn mensuel
  atRiskCustomers: number          // Clients à risque
  cancelledButActive: number       // Annulé mais toujours actif (fin période)
  churnedCustomers: ChurnedCustomer[]
}

interface ChurnedCustomer {
  customerId: string
  email: string
  productName: string
  cancelledAt: Date
  subscriptionEndsAt: Date | null
  reason: string | null
  lifetimeValue: number            // Valeur totale commissions générées
}

export async function getChurnMetrics(affiliateId: string): Promise<ChurnMetrics> {
  const now = new Date()
  const monthStart = startOfMonth(now)

  // 1. Clients churnés ce mois
  const churnedThisMonth = await prisma.customer.findMany({
    where: {
      status: { in: ['CANCELLED', 'EXPIRED'] },
      updatedAt: { gte: monthStart },
      id: { in: (await prisma.affiliateAttribution.findMany({
        where: { affiliateId },
        select: { customerId: true }
      })).map(a => a.customerId).filter(Boolean) as string[] }
    },
    include: {
      stamUser: true,
      product: true
    }
  })

  // 2. Clients annulés mais toujours actifs (fin de période)
  const cancelledButActive = await prisma.customer.findMany({
    where: {
      status: 'CANCELLED',
      subscriptionEndsAt: { gte: now },
      id: { in: (await prisma.affiliateAttribution.findMany({
        where: { affiliateId },
        select: { customerId: true }
      })).map(a => a.customerId).filter(Boolean) as string[] }
    }
  })

  // 3. Clients actifs totaux
  const totalActive = await prisma.customer.count({
    where: {
      status: 'ACTIVE',
      id: { in: (await prisma.affiliateAttribution.findMany({
        where: { affiliateId },
        select: { customerId: true }
      })).map(a => a.customerId).filter(Boolean) as string[] }
    }
  })

  // 4. Taux de churn
  const churnRate = totalActive > 0
    ? (churnedThisMonth.length / (totalActive + churnedThisMonth.length)) * 100
    : 0

  // 5. Clients à risque (définition simpliste : pas d'activité récente)
  // TODO: Ajouter logique engagement/activité
  const atRiskCustomers = 0

  // 6. Détails clients churnés
  const churnedCustomers: ChurnedCustomer[] = []

  for (const customer of churnedThisMonth) {
    // Calculer lifetime value
    const commissions = await prisma.affiliateCommission.aggregate({
      where: {
        affiliateId,
        customerId: customer.id
      },
      _sum: { totalAmount: true }
    })

    churnedCustomers.push({
      customerId: customer.id,
      email: customer.stamUser.email,
      productName: customer.product.name,
      cancelledAt: customer.updatedAt,
      subscriptionEndsAt: customer.subscriptionEndsAt,
      reason: customer.metadata?.cancellationReason || null,
      lifetimeValue: (commissions._sum.totalAmount || 0) / 100
    })
  }

  return {
    churnedThisMonth: churnedThisMonth.length,
    churnRate: Math.round(churnRate * 100) / 100,
    atRiskCustomers,
    cancelledButActive: cancelledButActive.length,
    churnedCustomers
  }
}
```

---

### 5. Cookies de Tracking

**Tracking** : État des cookies de tracking actifs pour l'affilié.

```typescript
// lib/affiliate/metrics/tracking-cookies.ts

interface CookieMetrics {
  totalActiveCookies: number
  expiringToday: number
  expiringThisWeek: number
  averageDaysRemaining: number
  conversionRate: number           // % cookies → ventes
  cookies: CookieInfo[]
}

interface CookieInfo {
  clickId: string
  productId: string | null
  createdAt: Date
  expiresAt: Date | null
  daysRemaining: number
  hasConverted: boolean
  ip: string | null
  country: string | null
}

export async function getCookieMetrics(affiliateId: string): Promise<CookieMetrics> {
  const now = new Date()
  const today = endOfDay(now)
  const weekFromNow = addDays(now, 7)

  // 1. Récupérer tous les tracking events actifs
  const trackingEvents = await prisma.affiliateTrackingEvent.findMany({
    where: {
      affiliateId,
      expiresAt: { gte: now }
    },
    include: {
      attributions: {
        include: {
          customer: true
        }
      }
    }
  })

  const cookies: CookieInfo[] = []
  let expiringToday = 0
  let expiringThisWeek = 0
  let totalDaysRemaining = 0
  let converted = 0

  for (const event of trackingEvents) {
    const expiresAt = event.expiresAt
    if (!expiresAt) continue

    const daysRemaining = differenceInDays(expiresAt, now)
    const hasConverted = event.attributions.some(a => a.customer?.status === 'ACTIVE')

    if (hasConverted) converted++

    if (expiresAt <= today) {
      expiringToday++
    } else if (expiresAt <= weekFromNow) {
      expiringThisWeek++
    }

    totalDaysRemaining += daysRemaining

    cookies.push({
      clickId: event.clickId,
      productId: event.productId,
      createdAt: event.createdAt,
      expiresAt,
      daysRemaining,
      hasConverted,
      ip: event.ip,
      country: event.country
    })
  }

  const averageDaysRemaining = cookies.length > 0
    ? totalDaysRemaining / cookies.length
    : 0

  const conversionRate = cookies.length > 0
    ? (converted / cookies.length) * 100
    : 0

  return {
    totalActiveCookies: cookies.length,
    expiringToday,
    expiringThisWeek,
    averageDaysRemaining: Math.round(averageDaysRemaining),
    conversionRate: Math.round(conversionRate * 100) / 100,
    cookies: cookies.sort((a, b) => a.daysRemaining - b.daysRemaining)
  }
}
```

---

### 6. Taux de Conversion sur Pages

**Tracking** : Performance des liens affiliés par source/page.

```typescript
// lib/affiliate/metrics/conversion-rate.ts

interface ConversionMetrics {
  overallConversionRate: number
  bySource: SourceConversion[]
  byProduct: ProductConversion[]
  byCountry: CountryConversion[]
  topPerformingSources: SourceConversion[]
}

interface SourceConversion {
  source: string
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number                  // Commissions générées
}

interface ProductConversion {
  productId: string
  productName: string
  clicks: number
  conversions: number
  conversionRate: number
  revenue: number
}

interface CountryConversion {
  country: string
  clicks: number
  conversions: number
  conversionRate: number
}

export async function getConversionMetrics(affiliateId: string): Promise<ConversionMetrics> {
  // 1. Tous les clicks
  const allClicks = await prisma.affiliateTrackingEvent.findMany({
    where: { affiliateId },
    include: {
      attributions: {
        include: {
          customer: true
        }
      }
    }
  })

  // 2. Par source
  const bySource = new Map<string, { clicks: number; conversions: number; revenue: number }>()

  for (const click of allClicks) {
    const source = click.source || 'direct'
    const existing = bySource.get(source) || { clicks: 0, conversions: 0, revenue: 0 }

    existing.clicks++

    const converted = click.attributions.filter(a => a.customer?.status === 'ACTIVE')
    if (converted.length > 0) {
      existing.conversions++

      // Récupérer revenue
      for (const attr of converted) {
        const commissions = await prisma.affiliateCommission.aggregate({
          where: {
            affiliateId,
            customerId: attr.customerId
          },
          _sum: { totalAmount: true }
        })
        existing.revenue += (commissions._sum.totalAmount || 0) / 100
      }
    }

    bySource.set(source, existing)
  }

  const sourceConversions: SourceConversion[] = Array.from(bySource.entries()).map(([source, data]) => ({
    source,
    clicks: data.clicks,
    conversions: data.conversions,
    conversionRate: (data.conversions / data.clicks) * 100,
    revenue: Math.round(data.revenue * 100) / 100
  }))

  // 3. Par produit
  const byProduct = new Map<string, { name: string; clicks: number; conversions: number; revenue: number }>()

  for (const click of allClicks) {
    if (!click.productId) continue

    const product = await prisma.product.findUnique({ where: { id: click.productId } })
    if (!product) continue

    const existing = byProduct.get(click.productId) || {
      name: product.name,
      clicks: 0,
      conversions: 0,
      revenue: 0
    }

    existing.clicks++

    const converted = click.attributions.filter(a => a.customer?.status === 'ACTIVE')
    if (converted.length > 0) {
      existing.conversions++

      for (const attr of converted) {
        const commissions = await prisma.affiliateCommission.aggregate({
          where: {
            affiliateId,
            customerId: attr.customerId
          },
          _sum: { totalAmount: true }
        })
        existing.revenue += (commissions._sum.totalAmount || 0) / 100
      }
    }

    byProduct.set(click.productId, existing)
  }

  const productConversions: ProductConversion[] = Array.from(byProduct.entries()).map(([productId, data]) => ({
    productId,
    productName: data.name,
    clicks: data.clicks,
    conversions: data.conversions,
    conversionRate: (data.conversions / data.clicks) * 100,
    revenue: Math.round(data.revenue * 100) / 100
  }))

  // 4. Par pays
  const byCountry = new Map<string, { clicks: number; conversions: number }>()

  for (const click of allClicks) {
    const country = click.country || 'Unknown'
    const existing = byCountry.get(country) || { clicks: 0, conversions: 0 }

    existing.clicks++

    const converted = click.attributions.filter(a => a.customer?.status === 'ACTIVE')
    if (converted.length > 0) {
      existing.conversions++
    }

    byCountry.set(country, existing)
  }

  const countryConversions: CountryConversion[] = Array.from(byCountry.entries()).map(([country, data]) => ({
    country,
    clicks: data.clicks,
    conversions: data.conversions,
    conversionRate: (data.conversions / data.clicks) * 100
  }))

  // 5. Taux global
  const totalClicks = allClicks.length
  const totalConversions = allClicks.filter(c =>
    c.attributions.some(a => a.customer?.status === 'ACTIVE')
  ).length
  const overallConversionRate = totalClicks > 0
    ? (totalConversions / totalClicks) * 100
    : 0

  return {
    overallConversionRate: Math.round(overallConversionRate * 100) / 100,
    bySource: sourceConversions.sort((a, b) => b.conversionRate - a.conversionRate),
    byProduct: productConversions.sort((a, b) => b.conversionRate - a.conversionRate),
    byCountry: countryConversions.sort((a, b) => b.conversionRate - a.conversionRate),
    topPerformingSources: sourceConversions
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)
  }
}
```

---

## 🎨 INTERFACE DASHBOARD AFFILIÉ

```typescript
// app/affiliate/dashboard/page.tsx

export default function AffiliateDashboard() {
  const { user } = useAuth()
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['affiliate-dashboard', user.id],
    queryFn: async () => {
      const response = await fetch('/api/affiliate/dashboard/metrics')
      return response.json()
    }
  })

  if (isLoading) return <DashboardSkeleton />

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard Affilié</h1>
        <p className="text-muted-foreground">Vue d'ensemble de vos performances</p>
      </div>

      {/* KPIs principaux */}
      <div className="grid grid-cols-4 gap-4">
        <StatCard
          title="MRR"
          value={`${metrics.mrr.currentMRR}€`}
          change={`${metrics.mrr.mrrGrowth > 0 ? '+' : ''}${metrics.mrr.mrrGrowth}%`}
          trend={metrics.mrr.mrrGrowth >= 0 ? 'up' : 'down'}
          icon={TrendingUp}
        />
        <StatCard
          title="Clients Actifs"
          value={metrics.totalActiveCustomers}
          subtitle={`${metrics.freeClients.totalActive} gratuits`}
          icon={Users}
        />
        <StatCard
          title="Trials Actifs"
          value={metrics.trials.activeTrials}
          subtitle={`${metrics.trials.conversionRate}% conversion`}
          icon={Clock}
        />
        <StatCard
          title="Churn Rate"
          value={`${metrics.churn.churnRate}%`}
          change={`${metrics.churn.churnedThisMonth} ce mois`}
          trend={metrics.churn.churnRate <= 5 ? 'up' : 'down'}
          icon={AlertTriangle}
        />
      </div>

      {/* Clients gratuits expirant */}
      {metrics.freeClients.expiringThisWeek > 0 && (
        <Card className="border-orange-500">
          <CardHeader>
            <CardTitle>⚠️ {metrics.freeClients.expiringThisWeek} clients gratuits expirent cette semaine</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Expire dans</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.freeClients.freeClients
                  .filter(c => c.daysRemaining <= 7)
                  .map(client => (
                    <TableRow key={client.customerId}>
                      <TableCell>{client.email}</TableCell>
                      <TableCell>{client.productName}</TableCell>
                      <TableCell>
                        <Badge variant={client.daysRemaining <= 3 ? 'destructive' : 'warning'}>
                          {client.daysRemaining}j
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Relancer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Trials se terminant */}
      {metrics.trials.endingThisWeek > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trials se terminant cette semaine ({metrics.trials.endingThisWeek})</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Produit</TableHead>
                  <TableHead>Fin dans</TableHead>
                  <TableHead>Likelihood</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {metrics.trials.trials
                  .filter(t => t.daysRemaining <= 7)
                  .map(trial => (
                    <TableRow key={trial.customerId}>
                      <TableCell>{trial.email}</TableCell>
                      <TableCell>{trial.productName}</TableCell>
                      <TableCell>{trial.daysRemaining}j</TableCell>
                      <TableCell>
                        <Badge variant={
                          trial.likelihood === 'high' ? 'success' :
                          trial.likelihood === 'medium' ? 'warning' :
                          'default'
                        }>
                          {trial.likelihood}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Cookies de tracking */}
      <Card>
        <CardHeader>
          <CardTitle>Cookies de Tracking</CardTitle>
          <CardDescription>
            {metrics.cookies.totalActiveCookies} actifs •
            {metrics.cookies.averageDaysRemaining}j restants en moyenne •
            {metrics.cookies.conversionRate}% taux de conversion
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-2xl font-bold">{metrics.cookies.totalActiveCookies}</p>
              <p className="text-sm text-muted-foreground">Total actifs</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-500">{metrics.cookies.expiringThisWeek}</p>
              <p className="text-sm text-muted-foreground">Expirent cette semaine</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-500">{metrics.cookies.expiringToday}</p>
              <p className="text-sm text-muted-foreground">Expirent aujourd'hui</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taux de conversion */}
      <Card>
        <CardHeader>
          <CardTitle>Performance par Source</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Source</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Conversions</TableHead>
                <TableHead>Taux</TableHead>
                <TableHead>Revenue</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.conversion.bySource.map(source => (
                <TableRow key={source.source}>
                  <TableCell className="font-medium">{source.source}</TableCell>
                  <TableCell>{source.clicks}</TableCell>
                  <TableCell>{source.conversions}</TableCell>
                  <TableCell>
                    <Badge variant={
                      source.conversionRate >= 10 ? 'success' :
                      source.conversionRate >= 5 ? 'warning' :
                      'default'
                    }>
                      {source.conversionRate.toFixed(2)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="font-bold">{source.revenue}€</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* MRR par produit */}
      <Card>
        <CardHeader>
          <CardTitle>MRR par Produit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics.mrr.mrrByProduct.map(product => (
              <div key={product.productId} className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{product.productName}</p>
                  <p className="text-sm text-muted-foreground">
                    {product.customerCount} clients actifs
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{product.mrr}€</p>
                  <p className="text-sm text-muted-foreground">MRR</p>
                </div>
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

## 🔄 API Route Complète

```typescript
// app/api/affiliate/dashboard/metrics/route.ts

export async function GET(request: Request) {
  const userId = request.headers.get('x-user-id')

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Calculer toutes les métriques en parallèle
  const [mrr, freeClients, trials, churn, cookies, conversion] = await Promise.all([
    calculateAffiliateMRR(userId),
    getFreeClientsMetrics(userId),
    getTrialMetrics(userId),
    getChurnMetrics(userId),
    getCookieMetrics(userId),
    getConversionMetrics(userId)
  ])

  // Total clients actifs
  const totalActiveCustomers = await prisma.customer.count({
    where: {
      status: 'ACTIVE',
      id: { in: (await prisma.affiliateAttribution.findMany({
        where: { affiliateId: userId },
        select: { customerId: true }
      })).map(a => a.customerId).filter(Boolean) as string[] }
    }
  })

  return NextResponse.json({
    mrr,
    freeClients,
    trials,
    churn,
    cookies,
    conversion,
    totalActiveCustomers
  })
}
```

---

## 📊 CRON JOBS

```typescript
// scripts/updateAffiliateMetrics.ts

// Exécuter toutes les heures
export async function updateAffiliateMetrics() {
  console.log('[CRON] Updating affiliate metrics...')

  // 1. Nettoyer attributions gratuites expirées
  await cleanExpiredFreeAttributions()

  // 2. Mettre à jour statuts trials
  await updateTrialStatuses()

  // 3. Calculer churn rate
  await calculateChurnRates()

  console.log('[CRON] Affiliate metrics updated successfully')
}

// À exécuter toutes les heures via cron ou Vercel Cron
```

---

C'est le **Dashboard Affilié Avancé complet** avec toutes les métriques demandées !
