import type { ReactNode } from 'react'
import StamDashboardHeader from '@/components/weokto/stam/dashboard/StamDashboardHeader'
import StamFooter from '@/components/weokto/stam/StamFooter'
import StamUserSessionProvider from './StamUserSessionProvider'
import { getStamSession } from '@/lib/auth/stam/session'
import type { DashboardUser } from '@/contexts/UserSessionContext'

export const dynamic = 'force-dynamic'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getStamSession()

  const initialUser: DashboardUser | null = session
    ? {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName ?? null,
        bio: session.user.bio ?? null,
        publicSlug: null,
        guildId: null,
        userType: session.user.userType ?? null,
        createdAt: session.user.createdAt ? session.user.createdAt.toISOString() : null,
        lastLoginAt: session.user.lastLoginAt ? session.user.lastLoginAt.toISOString() : null,
        profileSectionsOrder: null
      }
    : null

  return (
    <StamUserSessionProvider initialUser={initialUser}>
      <div className="min-h-screen bg-white">
        <StamDashboardHeader />
        <main className="pb-20 pt-0 md:pb-0 md:pt-20">{children}</main>
        <StamFooter />
      </div>
    </StamUserSessionProvider>
  )
}
