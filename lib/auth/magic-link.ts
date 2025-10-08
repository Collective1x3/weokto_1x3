import { prisma } from '@/lib/prisma'
import { hashString, generateOTP } from '@/lib/security'
import { MAGIC_LINK_CONFIG } from './config'
import type { Platform } from '@prisma/client'

export interface MagicLinkResult {
  token: string
  otpCode: string
  email: string
  expiresAt: Date
}

/**
 * Generate a magic link for email authentication
 * Creates a unique token, generates OTP, and stores in database
 */
export async function generateMagicLink(
  email: string,
  platform: Platform
): Promise<MagicLinkResult> {
  // Generate unique token
  const token = crypto.randomUUID()

  // Hash the token for storage
  const tokenHash = await hashString(token)

  // Generate 6-digit OTP
  const otpCode = generateOTP(MAGIC_LINK_CONFIG.otpLength)

  // Calculate expiration (15 minutes from now)
  const expiresAt = new Date(
    Date.now() + MAGIC_LINK_CONFIG.expiresInMinutes * 60 * 1000
  )

  // Delete any existing unused tokens for this email/platform
  await prisma.magicLinkToken.deleteMany({
    where: {
      email: email.toLowerCase(),
      platform,
      usedAt: null,
    },
  })

  // Store in database
  await prisma.magicLinkToken.create({
    data: {
      email: email.toLowerCase(),
      token: tokenHash,
      otpCode,
      platform,
      expiresAt,
    },
  })

  return {
    token, // Return unhashed token for the link
    otpCode,
    email: email.toLowerCase(),
    expiresAt,
  }
}

/**
 * Verify a magic link token
 * Returns the email if token is valid and not expired
 */
export async function verifyMagicLink(token: string): Promise<{
  email: string
  platform: Platform
} | null> {
  // Hash the received token
  const tokenHash = await hashString(token)

  // Find the magic link token
  const magicLink = await prisma.magicLinkToken.findUnique({
    where: { token: tokenHash },
  })

  // Check if token exists, not used, and not expired
  if (!magicLink || magicLink.usedAt || magicLink.expiresAt < new Date()) {
    return null
  }

  // Mark token as used
  await prisma.magicLinkToken.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() },
  })

  return {
    email: magicLink.email,
    platform: magicLink.platform,
  }
}

/**
 * Verify OTP code for email
 * Returns the email if OTP is valid and not expired
 */
export async function verifyOTP(
  email: string,
  otp: string,
  platform: Platform
): Promise<boolean> {
  // Find the magic link by email, OTP, and platform
  const magicLink = await prisma.magicLinkToken.findFirst({
    where: {
      email: email.toLowerCase(),
      otpCode: otp,
      platform,
      usedAt: null,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  // Check if exists and not expired
  if (!magicLink || magicLink.expiresAt < new Date()) {
    return false
  }

  // Mark as used
  await prisma.magicLinkToken.update({
    where: { id: magicLink.id },
    data: { usedAt: new Date() },
  })

  return true
}

/**
 * Clean up expired magic link tokens (run via cron)
 */
export async function cleanupExpiredTokens(): Promise<number> {
  const result = await prisma.magicLinkToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { usedAt: { not: null } },
      ],
    },
  })

  return result.count
}
