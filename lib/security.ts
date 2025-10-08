import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * Check if we should update the lastLogin timestamp
 * Only update if last login was more than 1 hour ago
 */
export async function shouldUpdateLastLogin(userId: string): Promise<boolean> {
  const user = await prisma.weoktoUser.findUnique({
    where: { id: userId },
    select: { lastLoginAt: true },
  })

  if (!user || !user.lastLoginAt) return true

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  return user.lastLoginAt < oneHourAgo
}

/**
 * Extract client IP from request headers
 * Checks x-forwarded-for, x-real-ip, and falls back to connection IP
 */
export function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return null
}

/**
 * Extract user agent from request headers
 */
export function getUserAgent(request: NextRequest): string | null {
  return request.headers.get('user-agent')
}

/**
 * Generate a random OTP code
 */
export function generateOTP(length: number = 6): string {
  const digits = '0123456789'
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)]
  }
  return otp
}

/**
 * Hash a string using SHA-256
 */
export async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(str)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
