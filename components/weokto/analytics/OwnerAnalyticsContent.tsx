'use client'

import type { NotificationSeverity } from '@/services/notifications/owner'
import type { getOwnerSummary } from '@/services/reporting/owner'
import type { Prisma } from '@prisma/client'

type OwnerSummary = Awaited<ReturnType<typeof getOwnerSummary>>

const severityColors: Record<NotificationSeverity, string> = {
  critical: 'bg-red-500/10 text-red-500 border border-red-500/30',
  warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  info: 'bg-sky-500/10 text-sky-400 border border-sky-500/30'
}

function severityLabel(severity: NotificationSeverity) {
  switch (severity) {
    case 'critical':
      return 'Critique'
    case 'warning':
      return 'Alerte'
    default:
      return 'Info'
  }
}

function formatCurrency(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount / 100)
}

type OwnerNotificationEntity = Prisma.OwnerNotificationGetPayload<{}>

interface OwnerAnalyticsContentProps {
  summary: OwnerSummary
  notifications: OwnerNotificationEntity[]
  pendingCharges: number
  failedWebhooks: number
}

export function OwnerAnalyticsContent({
  summary,
  notifications,
  pendingCharges,
  failedWebhooks
}: OwnerAnalyticsContentProps) {
  const netProfit = summary.payments.net - summary.payments.pspFees - summary.commissions.paid

  return (
    <div className="space-y-10 font-mono">
      <header className="rounded-2xl border border-[#FFB000]/60 bg-black px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#FFB000]">[Analytics owner]</p>
            <h1 className="text-xl font-bold text-white">Vue globale finances & conformité</h1>
            <p className="mt-1 max-w-3xl text-xs text-gray-400">
              Synthèse des revenus, TVA, commissions et alertes critiques pour piloter la plateforme à l’échelle.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-widest text-gray-400">
            <span className="rounded-lg border border-[#FFB000]/40 px-3 py-2 text-[#FFB000]">
              Webhooks KO : {failedWebhooks}
            </span>
            <span className="rounded-lg border border-[#FFB000]/20 px-3 py-2 text-gray-300">
              Relances programmées : {pendingCharges}
            </span>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Revenu brut" value={formatCurrency(summary.payments.gross)} caption="Charges réussies" />
        <MetricCard label="Net encaissé" value={formatCurrency(summary.payments.net)} caption="Après taxes" />
        <MetricCard label="TVA collectée" value={formatCurrency(summary.payments.vat)} caption="Période en cours" />
        <MetricCard label="Profit net" value={formatCurrency(netProfit)} caption="Net - PSP - commissions" accent="positive" />
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Vue cross-platform</h2>
            <p className="text-xs text-slate-500">
              Indicateurs clés STAM pour compléter la vision Weokto.
            </p>
          </div>
          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">
            STAM
          </span>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <MetricCard
            label="Formations actives"
            value={summary.stam.formations.toString()}
            caption="Parcours publiés"
            subtle
          />
          <MetricCard
            label="Modules"
            value={summary.stam.modules.toString()}
            caption="Chapitres disponibles"
            subtle
          />
          <MetricCard
            label="Apprenants actifs"
            value={summary.stam.activeLearners.toString()}
            caption="Progression en cours"
            subtle
          />
          <MetricCard
            label="Taux de complétion"
            value={`${summary.stam.completionRate}%`}
            caption={`${summary.stam.completions} modules terminés`}
            subtle
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Commissions affiliés</h2>
            <p className="text-xs text-slate-500">Verrouillées, mûries et déjà payées.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <MetricCard label="Locked" value={formatCurrency(summary.commissions.locked)} caption="En maturation" subtle />
            <MetricCard label="Mûries" value={formatCurrency(summary.commissions.matured)} caption="Prêtes à payer" subtle />
            <MetricCard label="Payées" value={formatCurrency(summary.commissions.paid)} caption="Total historique" subtle />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">État des flux</h2>
            <p className="text-xs text-slate-500">PSP, retraits affiliés et provision TVA.</p>
          </div>
          <dl className="space-y-3 text-sm text-slate-300">
            <Row label="Frais PSP" value={formatCurrency(summary.payments.pspFees)} />
            <Row label="Remboursements" value={formatCurrency(summary.payments.refunds)} />
            <Row label="Affiliés à payer" value={formatCurrency(summary.commissions.locked + summary.commissions.matured)} />
            <Row label="Solde suppliers" value={formatCurrency(summary.supplierBalances.payable)} />
          </dl>
        </div>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/60">
        <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Ledger (agrégé)</h2>
            <p className="text-xs text-slate-500">Synthèse des comptes sur la période.</p>
          </div>
        </header>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-slate-400">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Compte</th>
                <th className="px-6 py-3 text-left font-medium">Devise</th>
                <th className="px-6 py-3 text-right font-medium">Solde net</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {summary.ledger.map((row) => (
                <tr key={`${row.account}-${row.currency}`} className="hover:bg-slate-900/40">
                  <td className="px-6 py-3 text-slate-300 font-mono text-xs">{row.account}</td>
                  <td className="px-6 py-3 text-slate-400 uppercase text-xs">{row.currency}</td>
                  <td className="px-6 py-3 text-right text-slate-100">{formatCurrency(row.balance, row.currency)}</td>
                </tr>
              ))}
              {summary.ledger.length === 0 && (
                <tr>
                  <td className="px-6 py-8 text-center text-slate-500" colSpan={3}>
                    Aucun mouvement sur la période.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Notifications" value={notifications.length.toString()} caption="25 dernières" subtle />
        <MetricCard label="Relances programmées" value={pendingCharges.toString()} caption="Tentatives en attente" subtle />
        <MetricCard label="Webhooks en échec" value={failedWebhooks.toString()} caption="À reprocess" accent={failedWebhooks > 0 ? 'alert' : undefined} />
      </section>

      <section className="bg-slate-900/60 border border-slate-800 rounded-xl">
        <header className="px-6 py-4 border-b border-slate-800">
          <h2 className="text-lg font-semibold text-slate-100">Alertes & évènements</h2>
        </header>
        <ul className="divide-y divide-slate-800">
          {notifications.map((notification) => (
            <li key={notification.id} className="px-6 py-4 flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${severityColors[notification.severity as NotificationSeverity]}`}>
                  {severityLabel(notification.severity as NotificationSeverity)}
                </span>
                <span className="text-xs text-slate-500">
                  {new Date(notification.createdAt).toLocaleString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    day: '2-digit',
                    month: '2-digit'
                  })}
                </span>
              </div>
              <p className="text-sm text-slate-200">{notification.message}</p>
              {notification.details && (
                <pre className="text-xs text-slate-400 bg-slate-900/80 border border-slate-800 rounded-lg p-3 overflow-x-auto">
                  {JSON.stringify(notification.details, null, 2)}
                </pre>
              )}
            </li>
          ))}

          {notifications.length === 0 && (
            <li className="px-6 py-10 text-center text-sm text-slate-500">Aucune alerte sur la période.</li>
          )}
        </ul>
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  caption,
  accent,
  subtle
}: {
  label: string
  value: string
  caption?: string
  accent?: 'positive' | 'alert'
  subtle?: boolean
}) {
  const accentClasses = {
    positive: 'border-emerald-500/30 text-emerald-300',
    alert: 'border-amber-500/30 text-amber-300'
  }

  const base = subtle ? 'bg-slate-900/40 border-slate-800 text-slate-200' : 'bg-slate-900/60 border-slate-800 text-slate-100'

  const accentClass = accent ? `${accentClasses[accent]} bg-opacity-10` : ''

  return (
    <div className={`rounded-xl border px-4 py-4 transition-colors ${base} ${accentClass}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      {caption && <p className="text-xs text-slate-500 mt-1">{caption}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  )
}
