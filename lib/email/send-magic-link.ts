import { Resend } from 'resend'
import { render } from '@react-email/components'
import MagicLinkEmail from './templates/MagicLinkEmail'
import type { Platform } from '@prisma/client'

// Initialize Resend only if API key is provided (optional for development)
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export interface SendMagicLinkEmailParams {
  email: string
  otpCode: string
  token: string
  platform: Platform
}

/**
 * Send magic link email using Resend
 */
export async function sendMagicLinkEmail({
  email,
  otpCode,
  token,
  platform,
}: SendMagicLinkEmailParams): Promise<{ success: boolean; error?: string }> {
  try {
    // Check if Resend is configured
    if (!resend) {
      console.warn('Resend API key not configured. Email not sent. OTP:', otpCode)
      return {
        success: true,
        error: 'Email service not configured (dev mode)',
      }
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // Construct magic link URL
    const magicLink =
      platform === 'WEOKTO'
        ? `${baseUrl}/verify?token=${token}`
        : `${baseUrl}/verify?token=${token}` // STAM uses same route for now

    const platformString = platform === 'WEOKTO' ? 'WEOKTO' : 'STAM'

    // Render email template
    const emailHtml = await render(
      MagicLinkEmail({
        email,
        otpCode,
        magicLink,
        platform: platformString,
        expiresInMinutes: 15,
      })
    )

    // Send email via Resend
    await resend.emails.send({
      from: platform === 'WEOKTO'
        ? 'WEOKTO <noreply@weokto.com>'
        : 'STAM <noreply@be-stam.com>',
      to: email,
      subject: `Votre code de connexion ${platformString}`,
      html: emailHtml,
    })

    return { success: true }
  } catch (error) {
    console.error('Error sending magic link email:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
