import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'
import { setUserContext, clearUserContext } from '@/lib/supabase/rls'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Set RLS context
    await setUserContext(session.user.id, 'WEOKTO')

    // Fetch full user data
    const user = await prisma.weoktoUser.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        userType: true,
        displayName: true,
        avatarUrl: true,
        riskLevel: true,
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
    console.error('Error in /api/auth/me:', error)
    await clearUserContext()
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
