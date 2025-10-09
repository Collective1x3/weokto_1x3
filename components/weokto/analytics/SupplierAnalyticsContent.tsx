'use client'

import { ClipboardText, CurrencyCircleDollar, UsersThree } from '@phosphor-icons/react'
import type { SupplierSummary } from '@/services/reporting/supplier'

export type SupplierAnalyticsSummary = SupplierSummary

function formatCurrency(amount: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amount / 100)
}

function MetricCard({ label, value, caption, subtle }: { label: string; value: string; caption?: string; subtle?: boolean }) {
  return (
    <div className={`rounded-xl border px-4 py-4 ${subtle ? 'bg-slate-900/40 border-slate-800 text-slate-200' : 'bg-slate-900/60 border-slate-800 text-slate-100'}`}>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold">{value}</p>
      {caption && <p className="text-xs text-slate-500 mt-1">{caption}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm text-slate-300">
      <span className="text-slate-400">{label}</span>
      <span className="font-medium text-slate-100">{value}</span>
    </div>
  )
}

export function SupplierAnalyticsContent({ summary }: { summary: SupplierSummary }) {
  return (
    <div className="space-y-10 font-mono">
      <header className="rounded-2xl border border-[#B794F4] bg-[#1e1e1e] px-6 py-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded border border-[#B794F4] bg-purple-400/10">
              <CurrencyCircleDollar size={28} className="text-[#B794F4]" weight="bold" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-[#B794F4]">[Analytics supplier]</p>
              <h1 className="text-xl font-bold text-white">Performance commerciale</h1>
              <p className="mt-1 max-w-2xl text-xs text-gray-400">
                Mesure ton chiffre d’affaires, les abonnements actifs et l’impact affilié en temps réel pour piloter tes offres.
              </p>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2 text-xs uppercase tracking-widest text-gray-500">
            <div className="flex items-center gap-2 rounded-lg border border-[#B794F4]/30 bg-purple-400/5 px-3 py-2">
              <UsersThree size={16} className="text-[#B794F4]" />
              <span>Abonnements actifs&nbsp;: {summary.subscriptions.active}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-[#B794F4]/30 bg-purple-400/5 px-3 py-2">
              <ClipboardText size={16} className="text-emerald-300" />
              <span>Factures suivies&nbsp;: {summary.recentInvoices.length}</span>
            </div>
          </div>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <MetricCard label="Revenu brut" value={formatCurrency(summary.revenue.gross)} caption="Charges réussies" />
        <MetricCard label="Net encaissé" value={formatCurrency(summary.revenue.net)} caption="Après TVA" />
        <MetricCard label="TVA collectée" value={formatCurrency(summary.revenue.vat)} caption="Période" subtle />
        <MetricCard label="Remboursements" value={formatCurrency(summary.revenue.refunds)} caption="Montant remboursé" subtle />
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Abonnements actifs" value={summary.subscriptions.active.toLocaleString('fr-FR')} caption="En cours" />
        <MetricCard label="Trials" value={summary.subscriptions.trialsEnding.toLocaleString('fr-FR')} caption="En période d’essai" subtle />
        <MetricCard label="Résiliés" value={summary.subscriptions.cancelled.toLocaleString('fr-FR')} caption="Historique" subtle />
      </section>

      <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60">
          <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-100">Dernières factures</h2>
              <p className="text-xs text-slate-500">10 dernières charges générées côté supplier.</p>
            </div>
          </header>
          <ul className="divide-y divide-slate-800">
            {summary.recentInvoices.map((invoice) => (
              <li key={invoice.id} className="px-6 py-4">
                <div className="flex justify-between text-sm text-slate-300">
                  <span>{invoice.customerEmail}</span>
                  <span>{formatCurrency(invoice.amount, invoice.currency)}</span>
                </div>
                <div className="mt-2 flex justify-between text-xs text-slate-500">
                  <span>{new Date(invoice.createdAt).toLocaleString('fr-FR')}</span>
                  <span className="uppercase">{invoice.status}</span>
                </div>
                {invoice.affiliateAmount ? (
                  <p className="mt-2 text-xs text-emerald-400">
                    Commission affilié : {formatCurrency(invoice.affiliateAmount, invoice.currency)}
                  </p>
                ) : null}
              </li>
            ))}
            {summary.recentInvoices.length === 0 && (
              <li className="px-6 py-10 text-center text-sm text-slate-500">Aucun paiement récent.</li>
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Affiliation</h2>
            <p className="text-xs text-slate-500">Soldes affiliés et retraits.</p>
          </div>
          <dl className="space-y-3 text-sm">
            <Row label="Généré par affiliés" value={formatCurrency(summary.affiliates.earned)} />
            <Row label="À payer" value={formatCurrency(summary.affiliates.pending)} />
            <Row label="Retraits en attente" value={formatCurrency(summary.withdrawals.pending)} />
          </dl>
          <div className="space-y-3">
            {summary.affiliates.topAffiliates.map((affiliate) => (
              <div key={affiliate.affiliateId} className="rounded-lg border border-slate-800 bg-slate-900/40 px-3 py-2">
                <p className="text-sm text-slate-200">{affiliate.displayName ?? affiliate.email}</p>
                <p className="text-xs text-slate-500">{affiliate.email}</p>
                <p className="text-xs text-emerald-400 mt-1">{formatCurrency(affiliate.amount)} générés</p>
              </div>
            ))}
            {summary.affiliates.topAffiliates.length === 0 && (
              <p className="text-xs text-slate-500">Aucune commission affilié pour l’instant.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
