import { NextRequest, NextResponse } from 'next/server'
import { getStamSession } from '@/lib/auth/stam/session'
import { prisma } from '@/lib/prisma'
import { setUserContext, clearUserContext } from '@/lib/supabase/rls'

export async function POST(request: NextRequest) {
  const session = await getStamSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { displayName, bio, avatarUrl } = body

    await setUserContext(session.user.id, 'STAM')

    const updatedUser = await prisma.stamUser.update({
      where: { id: session.user.id },
      data: {
        displayName: displayName || undefined,
        avatarUrl: avatarUrl || undefined,
      }
    })

    await clearUserContext()

    return NextResponse.json(updatedUser)
  } catch (error) {
    await clearUserContext()
    console.error('Error updating STAM profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
