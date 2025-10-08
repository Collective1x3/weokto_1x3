import { NextRequest, NextResponse } from 'next/server'
import { destroyStamSession } from '@/lib/auth/stam/session'

export async function POST(request: NextRequest) {
  try {
    // Destroy session
    await destroyStamSession()

    return NextResponse.json({
      success: true,
      message: 'Déconnexion réussie',
    })
  } catch (error) {
    console.error('Error in /api/stam/auth/logout:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
