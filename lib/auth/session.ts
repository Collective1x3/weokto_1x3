import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { JWT_SECRET, JWT_KEY_ID, SESSION_CONFIG } from './config'
import { shouldUpdateLastLogin, getClientIp, getUserAgent } from '@/lib/security'
import type { WeoktoUser } from '@prisma/client'

export interface SessionPayload {
  userId: string
  sessionId: string
  iat: number
  exp: number
}

export interface SessionUser {
  id: string
  email: string
  userType: string
  displayName: string | null
  avatarUrl: string | null
}

/**
 * Create a new session for a WEOKTO user
 */
export async function createSession(
  user: WeoktoUser,
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
    .setProtectedHeader({ alg: 'HS256', kid: JWT_KEY_ID })
    .setIssuedAt()
    .setExpirationTime(
      rememberMe
        ? Math.floor(Date.now() / 1000) + SESSION_CONFIG.maxAge
        : Math.floor(Date.now() / 1000) + 24 * 60 * 60 // 24h if not remember me
    )
    .sign(JWT_SECRET)

  // Create session in database
  const session = await prisma.weoktoSession.create({
    data: {
      userId: user.id,
      token: token,
      expiresAt: new Date(Date.now() + SESSION_CONFIG.maxAge * 1000),
    },
  })

  // Update last login if needed
  if (await shouldUpdateLastLogin(user.id)) {
    await prisma.weoktoUser.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    })
  }

  return token
}

/**
 * Get current session from cookies
 */
export async function getSession(): Promise<{
  user: SessionUser
  sessionId: string
} | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value

  if (!token) {
    return null
  }

  try {
    // Verify JWT
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })

    const sessionPayload = payload as unknown as SessionPayload

    // Check session exists in DB
    const session = await prisma.weoktoSession.findUnique({
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
        userType: session.user.userType,
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
 * Destroy current session
 */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      const sessionPayload = payload as unknown as SessionPayload

      // Delete session from DB
      await prisma.weoktoSession.delete({
        where: { id: sessionPayload.sessionId },
      }).catch(() => {
        // Session might already be deleted, ignore error
      })
    } catch (error) {
      // Invalid token, ignore
    }
  }

  // Clear cookie
  cookieStore.delete(SESSION_CONFIG.cookieName)
}

/**
 * Set session cookie in response
 */
export function setSessionCookie(response: NextResponse, token: string): void {
  response.cookies.set({
    name: SESSION_CONFIG.cookieName,
    value: token,
    httpOnly: SESSION_CONFIG.httpOnly,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    maxAge: SESSION_CONFIG.maxAge,
    path: SESSION_CONFIG.path,
  })
}
