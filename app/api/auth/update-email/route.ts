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
    const { newEmail } = body

    if (!newEmail || !newEmail.includes('@')) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // Check if email already exists
    const existing = await prisma.weoktoUser.findUnique({
      where: { email: newEmail }
    })

    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 400 })
    }

    await setUserContext(session.user.id, 'WEOKTO')

    const updatedUser = await prisma.weoktoUser.update({
      where: { id: session.user.id },
      data: { email: newEmail }
    })

    await clearUserContext()

    return NextResponse.json({ success: true, user: updatedUser })
  } catch (error) {
    await clearUserContext()
    console.error('Error updating email:', error)
    return NextResponse.json({ error: 'Failed to update email' }, { status: 500 })
  }
}
