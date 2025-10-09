import type { ReactNode } from 'react'
import { getSession } from '@/lib/auth/session'
import DashboardLayoutClient from './DashboardLayoutClient'
import type { DashboardUser } from '@/contexts/UserSessionContext'

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  const initialUser: DashboardUser | null = session
    ? {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName ?? null,
        bio: session.user.bio ?? null,
        publicSlug: session.user.publicSlug ?? null,
        guildId: session.user.guildId ?? null,
        userType: session.user.userType ?? null,
        createdAt: session.user.createdAt ? session.user.createdAt.toISOString() : null,
        lastLoginAt: session.user.lastLoginAt ? session.user.lastLoginAt.toISOString() : null,
        profileSectionsOrder: session.user.profileSectionsOrder ?? null
      }
    : null

  return (
    <DashboardLayoutClient initialUser={initialUser}>
      {children}
    </DashboardLayoutClient>
  )
}
