import { NextRequest, NextResponse } from 'next/server'
import { getStamSession } from '@/lib/auth/stam/session'
import { setUserContext, clearUserContext } from '@/lib/supabase/rls'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getStamSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Set RLS context for STAM platform
    await setUserContext(session.user.id, 'STAM')

    // Fetch full user data
    const user = await prisma.stamUser.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        displayName: true,
        avatarUrl: true,
        createdAt: true,
        lastLoginAt: true,
      },
    })

    // Clear RLS context
    await clearUserContext()

    if (!user) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable' },
        { status: 404 }
      )
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Error in /api/stam/auth/me:', error)
    await clearUserContext()
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
