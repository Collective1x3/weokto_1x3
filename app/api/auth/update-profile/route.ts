import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'
import { setUserContext, clearUserContext } from '@/lib/supabase/rls'

export async function POST(request: NextRequest) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { displayName, bio, avatarUrl } = body

    await setUserContext(session.user.id, 'WEOKTO')

    const updatedUser = await prisma.weoktoUser.update({
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
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
