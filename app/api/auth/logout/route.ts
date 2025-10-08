import { NextRequest, NextResponse } from 'next/server'
import { destroySession } from '@/lib/auth/session'

export async function POST(request: NextRequest) {
  try {
    // Destroy session
    await destroySession()

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  } catch (error) {
    console.error('Error in /api/auth/logout:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
