import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAffiliateSummary } from '@/services/reporting/affiliate'
import { AffiliateAnalyticsStats } from '@/components/weokto/analytics/AffiliateAnalyticsContent'

export default async function AnalyticsEntryPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const summary = await getAffiliateSummary({ affiliateId: session.id })

  return <AffiliateAnalyticsStats summary={summary} />
}
