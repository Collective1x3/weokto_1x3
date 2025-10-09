import type { ReactNode } from 'react'
import type { PaymentMethodStatus } from '@prisma/client'
import { StatusBadge } from './StatusBadge'

export interface PaymentMethodDisplay {
  id: string
  brand?: string | null
  last4?: string | null
  expMonth?: number | null
  expYear?: number | null
  funding?: string | null
  status: PaymentMethodStatus
  isDefault?: boolean
  createdAt: Date
  storedCredentialType?: string | null
  actions?: ReactNode
}

function formatExpiry(month?: number | null, year?: number | null) {
  if (!month || !year) return '—'
  return `${month.toString().padStart(2, '0')}/${year}`
}

function paymentStatusTone(status: PaymentMethodStatus): Parameters<typeof StatusBadge>[0]['tone'] {
  switch (status) {
    case 'ACTIVE':
      return 'positive'
    case 'PENDING_VALIDATION':
      return 'info'
    case 'EXPIRED':
      return 'warning'
    case 'FAILED':
      return 'negative'
    default:
      return 'default'
  }
}

export function PaymentMethodCard({
  brand,
  last4,
  expMonth,
  expYear,
  funding,
  status,
  isDefault,
  createdAt,
  storedCredentialType,
  actions
}: PaymentMethodDisplay) {
  return (
    <article className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 shadow-lg shadow-black/10">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">
            {brand ? `${brand} •••• ${last4 ?? '????'}` : 'Méthode de paiement'}
          </h3>
          <p className="text-sm text-slate-500">
            {funding ? funding.toLowerCase() : 'type inconnu'} • Ajoutée le{' '}
            {new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).format(createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <StatusBadge label={status.replaceAll('_', ' ')} tone={paymentStatusTone(status)} />
          {isDefault && <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-300 border border-emerald-500/40">Par défaut</span>}
        </div>
      </header>

      <dl className="mt-6 grid gap-4 text-sm text-slate-300 md:grid-cols-2">
        <div className="flex justify-between md:flex-col md:items-start md:gap-1">
          <dt className="text-slate-500">Expiration</dt>
          <dd className="text-slate-100">{formatExpiry(expMonth, expYear)}</dd>
        </div>
        <div className="flex justify-between md:flex-col md:items-start md:gap-1">
          <dt className="text-slate-500">Stored credential</dt>
          <dd className="text-slate-100">{storedCredentialType ?? '—'}</dd>
        </div>
      </dl>

      {actions && <div className="mt-6 flex flex-wrap gap-3">{actions}</div>}
    </article>
  )
}
