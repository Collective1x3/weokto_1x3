/**
 * Authentication Configuration
 * JWT secrets, session config for WEOKTO and STAM platforms
 */

export const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
export const STAM_JWT_SECRET = new TextEncoder().encode(process.env.STAM_JWT_SECRET)

export const JWT_KEY_ID = 'weokto-v1'
export const STAM_JWT_KEY_ID = 'stam-v1'

export const SESSION_CONFIG = {
  cookieName: 'weokto_session',
  maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
}

export const STAM_SESSION_CONFIG = {
  cookieName: 'stam_session',
  maxAge: 30 * 24 * 60 * 60, // 30 jours en secondes
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
}

export const MAGIC_LINK_CONFIG = {
  expiresInMinutes: 15,
  otpLength: 6,
}
