import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { STAM_JWT_SECRET, STAM_JWT_KEY_ID, STAM_SESSION_CONFIG } from '../config'
import { getClientIp, getUserAgent } from '@/lib/security'
import type { StamUser } from '@prisma/client'

export interface StamSessionPayload {
  userId: string
  sessionId: string
  iat: number
  exp: number
}

export interface StamSessionUser {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

/**
 * Create a new session for a STAM user
 */
export async function createStamSession(
  user: StamUser,
  request: NextRequest,
  rememberMe: boolean = true
): Promise<string> {
  const ip = getClientIp(request)
  const userAgent = getUserAgent(request)

  // Create JWT token first to get the token value
  const token = await new SignJWT({
    userId: user.id,
    sessionId: 'temp', // Will be replaced
  })
    .setProtectedHeader({ alg: 'HS256', kid: STAM_JWT_KEY_ID })
    .setIssuedAt()
    .setExpirationTime(
      rememberMe
        ? Math.floor(Date.now() / 1000) + STAM_SESSION_CONFIG.maxAge
        : Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24h if not remember me
    )
    .sign(STAM_JWT_SECRET)

  // Create session in database
  const session = await prisma.stamSession.create({
    data: {
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + STAM_SESSION_CONFIG.maxAge * 1000),
    },
  })

  // Update last login
  await prisma.stamUser.update({
    where: { id: user.id },
    data: { lastLoginAt: new Date() },
  })

  return token
}

/**
 * Get current STAM session from cookies
 */
export async function getStamSession(): Promise<{
  user: StamSessionUser
  sessionId: string
} | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(STAM_SESSION_CONFIG.cookieName)?.value

  if (!token) {
    return null
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify(token, STAM_JWT_SECRET, {
      algorithms: ['HS256'],
    })

    const sessionPayload = payload as unknown as StamSessionPayload

    // Check session exists in DB
    const session = await prisma.stamSession.findUnique({
      where: { id: sessionPayload.sessionId },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        displayName: session.user.displayName,
        avatarUrl: session.user.avatarUrl,
      },
      sessionId: session.id,
    }
  } catch (error) {
    return null
  }
}

/**
 * Destroy current STAM session
 */
export async function destroyStamSession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(STAM_SESSION_CONFIG.cookieName)?.value

  if (token) {
    try {
      const { payload } = await jwtVerify(token, STAM_JWT_SECRET)
      const sessionPayload = payload as unknown as StamSessionPayload

      // Delete session from DB
      await prisma.stamSession.delete({
        where: { id: sessionPayload.sessionId },
      }).catch(() => {
        // Session might already be deleted, ignore error
      })
    } catch (error) {
      // Invalid token, ignore
    }
  }

  // Clear cookie
  cookieStore.delete(STAM_SESSION_CONFIG.cookieName)
}

/**
 * Set STAM session cookie in response
 */
export function setStamSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: STAM_SESSION_CONFIG.cookieName,
    value: token,
    httpOnly: STAM_SESSION_CONFIG.httpOnly,
    secure: STAM_SESSION_CONFIG.secure,
    sameSite: STAM_SESSION_CONFIG.sameSite,
    maxAge: STAM_SESSION_CONFIG.maxAge,
    path: STAM_SESSION_CONFIG.path,
  })
}
