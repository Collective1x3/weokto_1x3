import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getOwnerSummary } from '@/services/reporting/owner'
import { getSession } from '@/lib/auth/session'
import { OwnerAnalyticsContent } from '@/components/weokto/analytics/OwnerAnalyticsContent'

export default async function OwnerAnalyticsPage() {
  const session = await getSession()
  if (!session) {
    redirect('/login')
  }
  if (session.userType !== 'WEOWNER') {
    redirect('/dashboard')
  }

  const [summary, notifications, pendingCharges, failedWebhooks] = await Promise.all([
    getOwnerSummary(),
    prisma.ownerNotification.findMany({
      orderBy: { createdAt: 'desc' },
      take: 25
    }),
    prisma.scheduledCharge.count({ where: { attemptCount: { gt: 0 } } }),
    prisma.webhookEvent.count({ where: { status: 'FAILED' } })
  ])

  return (
    <OwnerAnalyticsContent
      summary={summary}
      notifications={notifications}
      pendingCharges={pendingCharges}
      failedWebhooks={failedWebhooks}
    />
  )
}
