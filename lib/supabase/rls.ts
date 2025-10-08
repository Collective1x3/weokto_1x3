import { prisma } from '@/lib/prisma'

/**
 * Set user context for Row Level Security (RLS) policies in Supabase
 *
 * @param userId - The user ID to set in the context
 * @param platform - 'WEOKTO' or 'STAM' to determine which context variable to set
 */
export async function setUserContext(userId: string, platform: 'WEOKTO' | 'STAM' = 'WEOKTO') {
  if (platform === 'WEOKTO') {
    await prisma.$executeRaw`SET LOCAL app.user_id = ${userId}`
  } else {
    await prisma.$executeRaw`SET LOCAL app.stam_user_id = ${userId}`
  }
}

/**
 * Clear user context for RLS policies
 */
export async function clearUserContext() {
  await prisma.$executeRaw`RESET app.user_id`
  await prisma.$executeRaw`RESET app.stam_user_id`
}

/**
 * Execute a function with user context automatically set and cleared
 *
 * @example
 * const result = await withUserContext('user-id', 'WEOKTO', async () => {
 *   return await prisma.weoktoUser.findUnique({ where: { id: 'user-id' } })
 * })
 */
export async function withUserContext<T>(
  userId: string,
  platform: 'WEOKTO' | 'STAM',
  fn: () => Promise<T>
): Promise<T> {
  try {
    await setUserContext(userId, platform)
    return await fn()
  } finally {
    await clearUserContext()
  }
}
