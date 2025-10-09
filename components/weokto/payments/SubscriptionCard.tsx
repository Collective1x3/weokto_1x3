import type { ReactNode } from 'react'
import type { SubscriptionStatus } from '@prisma/client'
import { StatusBadge } from './StatusBadge'

export interface SubscriptionDisplay {
  id: string
  productName?: string | null
  planName?: string | null
  planId?: string | null
  status: SubscriptionStatus
  isFreePlan: boolean
  currency: string
  amountCents?: number | null
  billingInterval?: string | null
  billingAnchor?: Date | null
  nextBillingAt?: Date | null
  trialEndsAt?: Date | null
  graceUntil?: Date | null
  createdAt: Date
  paymentMethod?: {
    brand?: string | null
    last4?: string | null
    expMonth?: number | null
    expYear?: number | null
  } | null
  latestInvoice?: {
    id: string
    amountIncludingTax: number
    status: string
    createdAt: Date
    currency: string
  } | null
  notes?: string | null
  actions?: ReactNode
}

function formatCurrency(amountCents: number | null | undefined, currency = 'EUR') {
  if (amountCents === null || amountCents === undefined) return '-'
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100)
}

function formatDate(value: Date | null | undefined) {
  if (!value) return '—'
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(value)
}

function statusTone(status: SubscriptionStatus): Parameters<typeof StatusBadge>[0]['tone'] {
  switch (status) {
    case 'ACTIVE':
    case 'TRIALING':
      return 'positive'
    case 'PAST_DUE':
    case 'INCOMPLETE':
      return 'warning'
    case 'CANCELED':
    case 'INCOMPLETE_EXPIRED':
      return 'negative'
    default:
      return 'default'
  }
}

export function SubscriptionCard({
  productName,
  planName,
  status,
  isFreePlan,
  currency,
  amountCents,
  billingInterval,
  billingAnchor,
  nextBillingAt,
  trialEndsAt,
  graceUntil,
  createdAt,
  paymentMethod,
  latestInvoice,
  actions
}: SubscriptionDisplay) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg shadow-black/10">
      <header className="flex flex-col gap-2 border-b border-slate-800 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs uppercase tracking-wide text-slate-500">{productName || 'Offre'}</p>
          <h3 className="text-lg font-semibold text-slate-100">
            {planName || 'Plan personnalisé'}
            {isFreePlan && <span className="ml-2 text-xs font-normal text-emerald-400">Gratuit</span>}
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge label={status.replaceAll('_', ' ')} tone={statusTone(status)} />
          {actions}
        </div>
      </header>

      <div className="grid gap-6 px-6 py-6 md:grid-cols-2">
        <dl className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between">
            <dt className="text-slate-500">Montant</dt>
            <dd className="font-medium text-slate-100">{formatCurrency(isFreePlan ? 0 : amountCents ?? 0, currency)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Récurrence</dt>
            <dd className="uppercase text-slate-100">{billingInterval ? billingInterval : '—'}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Prochain prélèvement</dt>
            <dd className="text-slate-100">{formatDate(nextBillingAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Ancre de facturation</dt>
            <dd className="text-slate-100">{formatDate(billingAnchor)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Souscrit le</dt>
            <dd className="text-slate-100">{formatDate(createdAt)}</dd>
          </div>
        </dl>

        <dl className="space-y-3 text-sm text-slate-300">
          <div className="flex justify-between">
            <dt className="text-slate-500">Fin de période d’essai</dt>
            <dd className="text-slate-100">{formatDate(trialEndsAt)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Période de grâce</dt>
            <dd className="text-slate-100">{formatDate(graceUntil)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Méthode paiement</dt>
            <dd className="text-slate-100">
              {paymentMethod?.brand ? (
                <span>
                  {paymentMethod.brand} •••• {paymentMethod.last4}
                  {paymentMethod.expMonth && paymentMethod.expYear && (
                    <span className="ml-2 text-xs text-slate-500">
                      Exp. {paymentMethod.expMonth?.toString().padStart(2, '0')}/{paymentMethod.expYear}
                    </span>
                  )}
                </span>
              ) : (
                'Non définie'
              )}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-500">Dernière facture</dt>
            <dd className="text-slate-100">
              {latestInvoice ? (
                <span>
                  {formatCurrency(latestInvoice.amountIncludingTax, latestInvoice.currency)} • {formatDate(latestInvoice.createdAt)}
                </span>
              ) : (
                '—'
              )}
            </dd>
          </div>
        </dl>
      </div>
    </article>
  )
}
