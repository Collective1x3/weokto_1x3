import { NextRequest, NextResponse } from 'next/server'
import { verifyOTP } from '@/lib/auth/magic-link'
import { createStamSession } from '@/lib/auth/stam/session'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const verifyOTPSchema = z.object({
  email: z.string().email('Email invalide'),
  otp: z.string().length(6, 'Le code doit contenir 6 chiffres'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = verifyOTPSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Données invalides', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email, otp } = result.data

    // Verify OTP for STAM platform
    const isValid = await verifyOTP(email, otp, 'STAM')

    if (!isValid) {
      return NextResponse.json(
        { error: 'Code invalide ou expiré' },
        { status: 401 }
      )
    }

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

    // Return session token (will be set as cookie on client)
    return NextResponse.json({
      success: true,
      token: sessionToken,
      redirectUrl: '/stam/home',
    })
  } catch (error) {
    console.error('Error in /api/stam/auth/magic-link/verify-otp:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
