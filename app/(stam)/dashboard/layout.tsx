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
        id: session.id,
        email: session.email,
        displayName: session.displayName ?? null,
        bio: session.bio ?? null,
        publicSlug: null,
        guildId: null,
        userType: session.userType ?? null,
        createdAt: session.createdAt ? session.createdAt.toISOString() : null,
        lastLoginAt: session.lastLoginAt ? session.lastLoginAt.toISOString() : null,
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
