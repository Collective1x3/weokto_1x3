import Link from 'next/link'
import { StatusBadge } from './StatusBadge'

export interface InvoiceDisplay {
  id: string
  number?: string | null
  createdAt: Date
  status: string
  currency: string
  amountIncludingTax: number
  taxAmount: number
  downloadUrl?: string
  productName?: string | null
  planName?: string | null
}

function formatCurrency(amountCents: number, currency = 'EUR') {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100)
}

function statusTone(status: string): Parameters<typeof StatusBadge>[0]['tone'] {
  switch (status) {
    case 'PAID':
      return 'positive'
    case 'PENDING':
      return 'info'
    case 'FAILED':
      return 'negative'
    case 'REFUNDED':
      return 'warning'
    default:
      return 'default'
  }
}

export function InvoiceTable({ invoices }: { invoices: InvoiceDisplay[] }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60">
      <table className="min-w-full divide-y divide-slate-800 text-sm">
        <thead className="bg-slate-900/80 text-slate-400">
          <tr>
            <th className="px-6 py-4 text-left font-medium">Date</th>
            <th className="px-6 py-4 text-left font-medium">Produit / Plan</th>
            <th className="px-6 py-4 text-left font-medium">Montant TTC</th>
            <th className="px-6 py-4 text-left font-medium">TVA</th>
            <th className="px-6 py-4 text-left font-medium">Statut</th>
            <th className="px-6 py-4 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800 text-slate-100">
          {invoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-900/40 transition-colors">
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span className="font-medium">
                    {new Intl.DateTimeFormat('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }).format(invoice.createdAt)}
                  </span>
                  {invoice.number && <span className="text-xs text-slate-500">#{invoice.number}</span>}
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-col">
                  <span>{invoice.productName ?? '—'}</span>
                  <span className="text-xs text-slate-500">{invoice.planName ?? '—'}</span>
                </div>
              </td>
              <td className="px-6 py-4 font-medium">{formatCurrency(invoice.amountIncludingTax, invoice.currency)}</td>
              <td className="px-6 py-4 text-slate-200">{formatCurrency(invoice.taxAmount, invoice.currency)}</td>
              <td className="px-6 py-4">
                <StatusBadge label={invoice.status} tone={statusTone(invoice.status)} />
              </td>
              <td className="px-6 py-4 text-right">
                {invoice.downloadUrl ? (
                  <Link
                    href={invoice.downloadUrl}
                    className="inline-flex items-center rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-purple-400/60 hover:text-white"
                  >
                    Télécharger
                  </Link>
                ) : (
                  <span className="text-xs text-slate-500">Indisponible</span>
                )}
              </td>
            </tr>
          ))}

          {invoices.length === 0 && (
            <tr>
              <td className="px-6 py-12 text-center text-sm text-slate-500" colSpan={6}>
                Aucune facture disponible pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
