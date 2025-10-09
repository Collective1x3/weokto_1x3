'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

export function useSessionRefresh() {
  const router = useRouter()

  const attemptRefresh = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        // Session refreshed successfully
        console.log('Session refreshed successfully')
        router.refresh()
        return true
      }
    } catch (error) {
      console.error('Failed to refresh session:', error)
    }
    return false
  }, [router])

  useEffect(() => {
    // Check if we need to refresh on page load
    const needsRefresh = document.cookie.includes('x-needs-refresh=true')
    if (needsRefresh) {
      attemptRefresh()
    }

    // Set up periodic refresh check every 30 minutes for active users
    const interval = setInterval(async () => {
      // Only refresh if user has been active in the last 5 minutes
      const lastActivity = parseInt(localStorage.getItem('lastActivity') || '0')
      const fiveMinutesAgo = Date.now() - (5 * 60 * 1000)

      if (lastActivity > fiveMinutesAgo) {
        await attemptRefresh()
      }
    }, 30 * 60 * 1000) // 30 minutes

    // Track user activity
    const trackActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString())
    }

    // Listen for user activity
    window.addEventListener('click', trackActivity)
    window.addEventListener('keypress', trackActivity)
    window.addEventListener('scroll', trackActivity)
    window.addEventListener('mousemove', trackActivity)

    return () => {
      clearInterval(interval)
      window.removeEventListener('click', trackActivity)
      window.removeEventListener('keypress', trackActivity)
      window.removeEventListener('scroll', trackActivity)
      window.removeEventListener('mousemove', trackActivity)
    }
  }, [attemptRefresh])

  return { attemptRefresh }
}
