import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'
import { getAffiliateSummary } from '@/services/reporting/affiliate'
import { AffiliateAnalyticsWallet } from '@/components/weokto/analytics/AffiliateAnalyticsContent'

export default async function AffiliateWalletPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  const summary = await getAffiliateSummary({ affiliateId: session.user.id })

  return <AffiliateAnalyticsWallet summary={summary} />
}

