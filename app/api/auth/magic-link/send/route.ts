import { NextRequest, NextResponse } from 'next/server'
import { generateMagicLink } from '@/lib/auth/magic-link'
import { sendMagicLinkEmail } from '@/lib/email/send-magic-link'
import { z } from 'zod'

const sendMagicLinkSchema = z.object({
  email: z.string().email('Email invalide'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate request body
    const result = sendMagicLinkSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json(
        { error: 'Email invalide', details: result.error.flatten() },
        { status: 400 }
      )
    }

    const { email } = result.data

    // Generate magic link
    const { token, otpCode } = await generateMagicLink(email, 'WEOKTO')

    // Send email
    const emailResult = await sendMagicLinkEmail({
      email,
      otpCode,
      token,
      platform: 'WEOKTO',
    })

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Erreur lors de l\'envoi de l\'email' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Un code de vérification a été envoyé à votre email',
    })
  } catch (error) {
    console.error('Error in /api/auth/magic-link/send:', error)
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    )
  }
}
