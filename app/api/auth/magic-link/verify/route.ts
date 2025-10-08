import { NextRequest, NextResponse } from 'next/server'
import { verifyMagicLink } from '@/lib/auth/magic-link'
import { createSession, setSessionCookie } from '@/lib/auth/session'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url))
    }

    // Verify magic link token
    const result = await verifyMagicLink(token)

    if (!result || result.platform !== 'WEOKTO') {
      return NextResponse.redirect(new URL('/?error=invalid_token', request.url))
    }

    const { email } = result

    // Find or create WEOKTO user
    let user = await prisma.weoktoUser.findUnique({
      where: { email },
    })

    if (!user) {
      // Create new user
      user = await prisma.weoktoUser.create({
        data: {
          email,
          authId: `auth_${Date.now()}_${Math.random().toString(36).slice(2)}`,
          userType: 'CLIENT', // Default to CLIENT
        },
      })
    }

    // Create session
    const sessionToken = await createSession(user, request, true)

    // Create response with redirect
    const response = NextResponse.redirect(new URL('/home', request.url))

    // Set session cookie
    setSessionCookie(response, sessionToken)

    return response
  } catch (error) {
    console.error('Error in /api/auth/magic-link/verify:', error)
    return NextResponse.redirect(new URL('/?error=server_error', request.url))
  }
}
