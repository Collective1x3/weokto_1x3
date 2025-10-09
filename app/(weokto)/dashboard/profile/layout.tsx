import type { ReactNode } from 'react'
import { ProfileNavigation } from './ProfileNavigation'

export default function ProfileSectionLayout({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-8">
      <ProfileNavigation />
      <section className="space-y-8">
        {children}
      </section>
    </div>
  )
}
