import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/session'

export default async function AffiliateAnalyticsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }

  if (session.user.userType !== 'AFFILIATE') {
    redirect('/dashboard')
  }

  redirect('/analytics')
}
