import type { ReactNode } from 'react'
import { getSession } from '@/lib/auth/session'
import DashboardLayoutClient from './DashboardLayoutClient'
import type { DashboardUser } from '@/contexts/UserSessionContext'

function toDashboardUser(user: NonNullable<Awaited<ReturnType<typeof getSession>>>): DashboardUser {
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName ?? null,
    bio: user.bio ?? null,
    publicSlug: user.publicSlug ?? null,
    guildId: user.guildId ?? null,
    userType: user.userType ?? null,
    createdAt: user.createdAt ? user.createdAt.toISOString() : null,
    lastLoginAt: user.lastLoginAt ? user.lastLoginAt.toISOString() : null,
    profileSectionsOrder: user.profileSectionsOrder ?? null
  }
}

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession()
  const initialUser = session ? toDashboardUser(session) : null

  return (
    <DashboardLayoutClient initialUser={initialUser}>
      {children}
    </DashboardLayoutClient>
  )
}
