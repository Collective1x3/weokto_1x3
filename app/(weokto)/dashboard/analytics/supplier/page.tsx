import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getSupplierSummary } from '@/services/reporting/supplier'
import { SupplierAnalyticsContent } from '@/components/weokto/analytics/SupplierAnalyticsContent'

export default async function SupplierAnalyticsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (!['SUPPLIER', 'WEOWNER'].includes(session.userType)) {
    redirect('/dashboard')
  }

  const summary = await getSupplierSummary({
    supplierId: session.userType === 'SUPPLIER' ? session.id : undefined
  })

  if (!summary) {
    return (
      <div className="space-y-6">
        <header>
          <h1 className="text-2xl font-semibold text-slate-100">Performance des ventes</h1>
          <p className="text-slate-400 text-sm">Aucun produit associé pour l’instant.</p>
        </header>
      </div>
    )
  }

  return <SupplierAnalyticsContent summary={summary} />
}
