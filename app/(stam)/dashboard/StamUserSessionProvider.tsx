'use client'

import type { ReactNode } from 'react'
import { UserSessionProvider, type DashboardUser } from '@/contexts/UserSessionContext'

interface StamUserSessionProviderProps {
  initialUser: DashboardUser | null
  children: ReactNode
}

export default function StamUserSessionProvider({ initialUser, children }: StamUserSessionProviderProps) {
  return <UserSessionProvider initialUser={initialUser}>{children}</UserSessionProvider>
}
