import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicLink } from '@/lib/auth/magic-link'
import { createStamSession, setStamSessionCookie } from '@/lib/auth/stam/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/stam?error=invalid_token', request.url))
    }

    // Verify magic link token
    const result = await verifyMagicLink(token)

    if (!result || result.platform !== 'STAM') {
      return NextResponse.redirect(new URL('/stam?error=invalid_token', request.url))
    }

    const { email } = result

    // Find or create STAM user
    let user = await prisma.stamUser.findUnique({
      where: { email },
    })

    if (!user) {
      // Create new user
      user = await prisma.stamUser.create({
        data: {
          email,
          authId: `auth_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        },
      })
    }

    // Create session
    const sessionToken = await createStamSession(user, request, true)

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/stam/home', request.url))

    // Set session cookie
    setStamSessionCookie(response, sessionToken)

    return response
  } catch (error) {
    console.error('Error in /api/stam/auth/magic-link/verify:', error)
    return NextResponse.redirect(new URL('/stam?error=server_error', request.url))
  }
}
