"use client"

import Link from 'next/link'
import { useMemo, type ReactNode } from 'react'
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import {
  ChartBar,
  ChartLineUp,
  Coins,
  Handshake,
  Lightning,
  TrendUp,
  UsersThree,
  Wallet as WalletIcon
} from '@phosphor-icons/react'

import type { getAffiliateSummary } from '@/services/reporting/affiliate'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/weokto/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig
} from '@/components/weokto/ui/chart'

type AffiliateSummary = Awaited<ReturnType<typeof getAffiliateSummary>>
type AffiliateAnalyticsTab = 'stats' | 'wallet'

const CURRENCY_COLORS = ['#B794F4', '#7C3AED', '#22D3EE', '#F97316', '#A855F7']

const STATUS_COLORS = {
  free: '#A855F7',
  trialing: '#38BDF8',
  active: '#34D399',
  canceling: '#F97316'
}

function formatCurrency(amountCents: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amountCents / 100)
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('fr-FR').format(value)
}

function formatDateLabel(value: string) {
  const date = new Date(value)
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(date)
}

function formatRange(range: AffiliateSummary['range']) {
  const from = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(range.from)
  const to = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short' }).format(range.to)
  return `${from} → ${to}`
}

interface AffiliateAnalyticsShellProps {
  summary: AffiliateSummary
  activeTab: AffiliateAnalyticsTab
  children: React.ReactNode
}

function AffiliateAnalyticsShell({ summary, activeTab, children }: AffiliateAnalyticsShellProps) {
  const tabs = [
    { key: 'stats', label: '[STATS]', href: '/analytics' },
    { key: 'wallet', label: '[WALLET]', href: '/analytics/wallet' }
  ] as const

  const mrrDisplay = summary.subscriptionMetrics.mrr.length
    ? summary.subscriptionMetrics.mrr
        .map((entry) => formatCurrency(entry.amount, entry.currency))
        .join(' • ')
    : '—'

  return (
    <div className="space-y-6 font-mono pt-4 lg:pt-6">
      <div className="rounded-2xl border border-[#B794F4] bg-[#1e1e1e] px-6 py-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.4em] text-[#B794F4]">[Weokto.Affiliate.Intel]</p>
            <div className="space-y-1 text-white">
              <h1 className="text-xl font-bold uppercase tracking-[0.2em]">Dash Affiliation</h1>
              <p className="text-xs text-gray-400">
                Analyse ton funnel : MRR, abonnements, performances et paiements en un clin d’œil.
              </p>
            </div>
          </div>

          <div className="grid gap-2 text-xs uppercase tracking-widest text-gray-400 sm:grid-cols-2 lg:text-right">
            <div className="rounded-lg border border-[#B794F4]/40 bg-purple-400/10 px-3 py-2 text-[#B794F4]">
              MRR : <span className="font-semibold">{mrrDisplay}</span>
            </div>
            <div className="rounded-lg border border-[#B794F4]/20 px-3 py-2 text-gray-300">
              Période : <span className="font-semibold text-white">{formatRange(summary.range)}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const isActive = tab.key === activeTab
            return (
              <Link
                key={tab.key}
                href={tab.href}
                className={[
                  'inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-xs font-bold uppercase transition-all duration-200',
                  isActive
                    ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                    : 'border-[#B794F4]/30 bg-transparent text-gray-400 hover:border-[#B794F4]/60 hover:text-white hover:bg-purple-400/10'
                ].join(' ')}
              >
                {tab.label}
              </Link>
            )
          })}
        </div>
      </div>

      <div className="grid gap-3 text-xs uppercase tracking-widest text-gray-400 sm:grid-cols-3">
        <div className="rounded-xl border border-[#B794F4]/30 bg-[#1a1a1f] px-4 py-3">
          <p className="text-[11px] text-[#B794F4]/80">Disponible</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(summary.totals.matured)}</p>
        </div>
        <div className="rounded-xl border border-[#B794F4]/30 bg-[#1a1a1f] px-4 py-3">
          <p className="text-[11px] text-[#B794F4]/80">En verrouillage</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(summary.totals.locked)}</p>
        </div>
        <div className="rounded-xl border border-[#B794F4]/30 bg-[#1a1a1f] px-4 py-3">
          <p className="text-[11px] text-[#B794F4]/80">Déjà payé</p>
          <p className="mt-1 text-lg font-semibold text-white">{formatCurrency(summary.totals.paid)}</p>
        </div>
      </div>

      <div className="space-y-6">{children}</div>
    </div>
  )
}

export function AffiliateAnalyticsStats({ summary }: { summary: AffiliateSummary }) {
  const timelineConfig = useMemo<ChartConfig>(() => {
    const currencies = summary.revenueTimeline.flatMap((point) => Object.keys(point.values))
    const unique = Array.from(new Set(currencies))
    return unique.reduce<ChartConfig>((acc, currency, index) => {
      acc[currency] = {
        label: currency,
        color: CURRENCY_COLORS[index % CURRENCY_COLORS.length]
      }
      return acc
    }, {})
  }, [summary.revenueTimeline])

  const timelineData = summary.revenueTimeline.map((point) => ({
    date: point.date,
    ...point.values
  }))

  const statusData = [
    {
      status: 'Gratuit',
      key: 'free',
      count: summary.subscriptionMetrics.freeCustomers
    },
    {
      status: 'Essai',
      key: 'trialing',
      count: summary.subscriptionMetrics.trialingCustomers
    },
    {
      status: 'Actif',
      key: 'active',
      count: summary.subscriptionMetrics.activeCustomers
    },
    {
      status: 'En annulation',
      key: 'canceling',
      count: summary.subscriptionMetrics.cancelingCustomers
    }
  ]

  const activeRetained = summary.subscriptionMetrics.activeRetainedCustomers

  return (
    <AffiliateAnalyticsShell summary={summary} activeTab="stats">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={<TrendUp size={18} className="text-purple-300" />}
          title="Clients actifs"
          value={formatNumber(summary.subscriptionMetrics.activeCustomers)}
          subtitle="Abonnements en cours"
        />
        <MetricCard
          icon={<Handshake size={18} className="text-sky-300" />}
          title="Free trials actifs"
          value={formatNumber(summary.subscriptionMetrics.trialingCustomers)}
          subtitle="Essais en cours"
        />
        <MetricCard
          icon={<ChartLineUp size={18} className="text-emerald-300" />}
          title="Actifs engagés"
          value={formatNumber(activeRetained)}
          subtitle="Sans annulation programmée"
        />
        <MetricCard
          icon={<Lightning size={18} className="text-amber-300" />}
          title="Actifs en annulation"
          value={formatNumber(summary.subscriptionMetrics.cancelingCustomers)}
          subtitle="Souscription annulée en fin de période"
        />
        <MetricCard
          icon={<UsersThree size={18} className="text-purple-300" />}
          title="Clients gratuits"
          value={formatNumber(summary.subscriptionMetrics.freeCustomers)}
          subtitle="Accès gratuits / lead magnets"
        />
        <MetricCard
          icon={<Coins size={18} className="text-emerald-300" />}
          title="MRR agrégé"
          value={
            summary.subscriptionMetrics.mrr.length
              ? summary.subscriptionMetrics.mrr
                  .map((entry) => formatCurrency(entry.amount, entry.currency))
                  .join(' • ')
              : '—'
          }
          subtitle="Montant mensuel récurrent"
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <Card className="border border-[#B794F4]/30 bg-[#1a1a1f]">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-white">
              <ChartBar size={18} className="text-purple-300" />
              Revenu affilié (timeline)
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Commissions générées sur la période sélectionnée.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            {timelineData.length ? (
              <ChartContainer config={timelineConfig} className="h-64">
                <AreaChart data={timelineData}>
                  <CartesianGrid vertical={false} stroke="#2d2d38" strokeDasharray="4 8" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDateLabel}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8B8E98', fontSize: 12 }}
                  />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#8B8E98', fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                  <ChartLegend content={<ChartLegendContent className="pt-4" />} />
                  {Object.keys(timelineConfig).map((currency) => (
                    <Area
                      key={currency}
                      type="monotone"
                      dataKey={currency}
                      stroke={`var(--color-${currency})`}
                      fill={`var(--color-${currency})`}
                      strokeWidth={2}
                      fillOpacity={0.15}
                    />
                  ))}
                </AreaChart>
              </ChartContainer>
            ) : (
              <EmptyPlaceholder message="Aucune commission enregistrée sur cette période." />
            )}
          </CardContent>
        </Card>

        <Card className="border border-[#B794F4]/30 bg-[#1a1a1f]">
          <CardHeader className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-white">
              <UsersThree size={18} className="text-purple-300" />
              Statut des clients
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Répartition des clients affiliés par statut d’abonnement.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={statusData}>
                  <CartesianGrid vertical={false} stroke="#2d2d38" strokeDasharray="4 8" />
                  <XAxis dataKey="status" axisLine={false} tickLine={false} tick={{ fill: '#8B8E98', fontSize: 12 }} />
                  <YAxis allowDecimals={false} axisLine={false} tickLine={false} tick={{ fill: '#8B8E98', fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f1f2b',
                      borderRadius: '0.75rem',
                      border: '1px solid rgba(183,148,244,0.4)',
                      color: '#fff'
                    }}
                    cursor={{ fill: 'rgba(183, 148, 244, 0.1)' }}
                    formatter={(value: number) => [formatNumber(value), 'clients']}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {statusData.map((entry) => (
                      <Cell key={entry.key} fill={STATUS_COLORS[entry.key as keyof typeof STATUS_COLORS]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="border border-[#B794F4]/30 bg-[#1a1a1f]">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <Handshake size={18} className="text-purple-300" />
            Produits affiliés
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Total clients par produit, avec focus sur l’activité abonnement.
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          {summary.productBreakdown.length ? (
            <div className="overflow-x-auto rounded-xl border border-[#B794F4]/20 bg-black/30">
              <table className="min-w-full text-sm text-gray-200">
                <thead className="bg-[#1f1f2b] text-xs uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Produit</th>
                    <th className="px-4 py-3 text-left font-semibold">Clients</th>
                    <th className="px-4 py-3 text-left font-semibold">Actifs</th>
                    <th className="px-4 py-3 text-left font-semibold">Essai</th>
                    <th className="px-4 py-3 text-left font-semibold">Annulation</th>
                    <th className="px-4 py-3 text-left font-semibold">Gratuit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B794F4]/10">
                  {summary.productBreakdown.slice(0, 8).map((product) => (
                    <tr key={`${product.productId ?? 'none'}`}>
                      <td className="px-4 py-3 font-semibold text-white">{product.productName}</td>
                      <td className="px-4 py-3 text-gray-300">{formatNumber(product.totalCustomers)}</td>
                      <td className="px-4 py-3 text-emerald-300">{formatNumber(product.activeCustomers)}</td>
                      <td className="px-4 py-3 text-sky-300">{formatNumber(product.trialingCustomers)}</td>
                      <td className="px-4 py-3 text-amber-300">{formatNumber(product.cancelingCustomers)}</td>
                      <td className="px-4 py-3 text-purple-300">{formatNumber(product.freeCustomers)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyPlaceholder message="Aucune donnée produit disponible pour l’instant." />
          )}
        </CardContent>
      </Card>
    </AffiliateAnalyticsShell>
  )
}

export function AffiliateAnalyticsWallet({ summary }: { summary: AffiliateSummary }) {
  return (
    <AffiliateAnalyticsShell summary={summary} activeTab="wallet">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          icon={<WalletIcon size={18} className="text-emerald-300" />}
          title="Solde disponible"
          value={formatCurrency(summary.totals.matured)}
          subtitle="Retraits possibles dès maintenant"
        />
        <MetricCard
          icon={<Coins size={18} className="text-purple-300" />}
          title="En maturation"
          value={formatCurrency(summary.totals.locked)}
          subtitle="En attente de fin de délai anti-remboursement"
        />
        <MetricCard
          icon={<WalletIcon size={18} className="text-amber-300" />}
          title="Historique payé"
          value={formatCurrency(summary.totals.paid)}
          subtitle="Total déjà versé sur ton compte"
        />
      </section>

      <Card className="border border-[#B794F4]/30 bg-[#1a1a1f]">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <ChartLineUp size={18} className="text-purple-300" />
            Commissions récentes
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Les dernières commissions calculées pour toi (hors détails clients).
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          {summary.recentCommissions.length ? (
            <ul className="space-y-3">
              {summary.recentCommissions.slice(0, 8).map((commission) => (
                <li
                  key={commission.id}
                  className="rounded-xl border border-[#B794F4]/20 bg-black/30 px-4 py-3 text-sm text-gray-200"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-white">{commission.productName}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(commission.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#B794F4]">
                        {formatCurrency(commission.amount, commission.currency)}
                      </p>
                      <p className="text-xs uppercase text-gray-500">{commission.status}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyPlaceholder message="Aucune commission enregistrée pour le moment." />
          )}
        </CardContent>
      </Card>

      <Card className="border border-[#B794F4]/30 bg-[#1a1a1f]">
        <CardHeader className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2 text-white">
            <WalletIcon size={18} className="text-purple-300" />
            Payouts & demandes
          </CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Historique de tes retraits (validations et paiements).
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          {summary.withdrawals.length ? (
            <div className="overflow-x-auto rounded-xl border border-[#B794F4]/20 bg-black/30">
              <table className="min-w-full text-sm text-gray-200">
                <thead className="bg-[#1f1f2b] text-xs uppercase tracking-widest text-gray-400">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Montant</th>
                    <th className="px-4 py-3 text-left font-semibold">Statut</th>
                    <th className="px-4 py-3 text-left font-semibold">Demandé le</th>
                    <th className="px-4 py-3 text-left font-semibold">Payé le</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#B794F4]/10">
                  {summary.withdrawals.slice(0, 10).map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td className="px-4 py-3 font-semibold text-white">
                        {formatCurrency(withdrawal.amount, withdrawal.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={withdrawal.status} />
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {new Date(withdrawal.requestedAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {withdrawal.paidAt ? new Date(withdrawal.paidAt).toLocaleDateString('fr-FR') : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyPlaceholder message="Aucune demande de retrait effectuée pour l’instant." />
          )}
        </CardContent>
      </Card>
    </AffiliateAnalyticsShell>
  )
}

function MetricCard({ icon, title, value, subtitle }: { icon: ReactNode; title: string; value: string; subtitle: string }) {
  return (
    <Card className="rounded-2xl border border-[#B794F4]/30 bg-[#1a1a1f] text-sm text-gray-200">
      <CardHeader className="flex flex-col gap-1">
        <CardTitle className="flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#B794F4]/40 bg-purple-400/10">
            {icon}
          </span>
          {title}
        </CardTitle>
        <CardDescription className="text-xs text-gray-400">{subtitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </CardContent>
    </Card>
  )
}

function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase()
  const tone =
    normalized === 'paid'
      ? 'text-emerald-300 border border-emerald-500/40 bg-emerald-500/10'
      : normalized === 'pending_review' || normalized === 'pending'
      ? 'text-amber-300 border border-amber-500/40 bg-amber-500/10'
      : 'text-gray-300 border border-gray-600/60 bg-gray-700/10'

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs uppercase tracking-wide ${tone}`}>
      {status}
    </span>
  )
}

function EmptyPlaceholder({ message }: { message: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#B794F4]/30 bg-transparent px-4 py-8 text-center text-sm text-gray-400">
      {message}
    </div>
  )
}
