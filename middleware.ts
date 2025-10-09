import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

// Environment variables
const STAM_HOSTS = (process.env.STAM_HOSTS || '').split(',').map(h => h.trim())
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const STAM_JWT_SECRET = new TextEncoder().encode(process.env.STAM_JWT_SECRET)

interface SessionPayload {
  userId: string
  sessionId: string
  iat: number
  exp: number
}

/**
 * Check if the hostname matches STAM hosts
 */
function isStamHost(host: string): boolean {
  // Remove port from hostname if present
  const hostname = host.split(':')[0]
  return STAM_HOSTS.some(stamHost => {
    const stamHostname = stamHost.split(':')[0]
    return hostname === stamHostname
  })
}

/**
 * Get session from WEOKTO cookie
 */
async function getSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get('weokto_session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Get session from STAM cookie
 */
async function getStamSession(request: NextRequest): Promise<SessionPayload | null> {
  const token = request.cookies.get('stam_session')?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, STAM_JWT_SECRET, {
      algorithms: ['HS256'],
    })
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

/**
 * Get user data from database via session
 * This is a lightweight check - full user data is fetched in route handlers
 */
async function getUserType(sessionPayload: SessionPayload, isStam: boolean): Promise<string | null> {
  // For middleware, we need to make a quick check
  // We'll use the Prisma client - but in middleware, we need to be careful
  // For now, we'll allow the request through if session is valid
  // and do full checks in the route handlers

  // This is a simplified version - in production you might want to cache user types
  // or include userType in the JWT payload itself
  try {
    const { prisma } = await import('@/lib/prisma')

    if (isStam) {
      const session = await prisma.stamSession.findUnique({
        where: { id: sessionPayload.sessionId },
        include: { user: true }
      })
      return session?.user ? null : null // STAM users don't have userType
    } else {
      const session = await prisma.weoktoSession.findUnique({
        where: { id: sessionPayload.sessionId },
        include: { user: true }
      })
      return session?.user?.userType || null
    }
  } catch {
    return null
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const host = request.headers.get('host') || ''
  const isStam = isStamHost(host)

  // Get appropriate session based on host
  const session = isStam
    ? await getStamSession(request)
    : await getSession(request)

  // Define protected routes
  const weoktoProtectedRoutes = ['/home', '/profile', '/settings', '/dashboard']
  const stamProtectedRoutes = ['/dashboard']
  const ownerRoutes = pathname.startsWith('/wo-renwo-9492xE')
  const adminRoutes = pathname.startsWith('/admin')
  const productManagerRoutes = pathname.startsWith('/product-manager')

  // STAM platform routing
  if (isStam) {
    // Check if route requires authentication
    const requiresAuth = stamProtectedRoutes.some(route => pathname.startsWith(route))

    if (requiresAuth && !session) {
      // Redirect to STAM root (login page)
      return NextResponse.redirect(new URL('/', request.url))
    }

    // Allow request to continue
    return NextResponse.next()
  }

  // WEOKTO platform routing

  // Owner dashboard routes - require OWNER or ADMIN userType
  if (ownerRoutes) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const userType = await getUserType(session, false)
    if (userType !== 'OWNER' && userType !== 'ADMIN') {
      // Redirect to home if not authorized
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // Admin routes - require ADMIN or OWNER
  if (adminRoutes) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const userType = await getUserType(session, false)
    if (userType !== 'ADMIN' && userType !== 'OWNER') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // Product Manager routes - require PRODUCT_MANAGER, ADMIN, or OWNER
  if (productManagerRoutes) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    const userType = await getUserType(session, false)
    if (userType !== 'PRODUCT_MANAGER' && userType !== 'ADMIN' && userType !== 'OWNER') {
      return NextResponse.redirect(new URL('/home', request.url))
    }
  }

  // Standard WEOKTO protected routes
  const requiresAuth = weoktoProtectedRoutes.some(route => pathname.startsWith(route))
  if (requiresAuth && !session) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Allow request to continue
  return NextResponse.next()
}

// Configure which routes should run the middleware
export const config = {
  matcher: [
    // WEOKTO protected routes
    '/home/:path*',
    '/profile/:path*',
    '/settings/:path*',
    // STAM protected routes
    '/dashboard/:path*',
    // Owner routes
    '/wo-renwo-9492xE/:path*',
    // Admin routes
    '/admin/:path*',
    // Product Manager routes
    '/product-manager/:path*',
  ],
}
