"use client";

import { type ReactNode, useEffect, useRef } from "react";
import { useSessionRefresh } from '@/hooks/useSessionRefresh';
import { UserSessionProvider, useUserSession, type DashboardUser } from '@/contexts/UserSessionContext';
import WeoktoSidebar from '@/components/weokto/WeoktoSidebar';

type LayoutProps = {
  children: ReactNode
  initialUser: DashboardUser | null
}

export default function DashboardLayoutClient({ children, initialUser }: LayoutProps) {
  return (
    <UserSessionProvider initialUser={initialUser}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </UserSessionProvider>
  );
}

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Auto-refresh session for active users
  useSessionRefresh();

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(20, 20, 20, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96)

        ctx.fillStyle = '#B794F4'
        ctx.globalAlpha = 0.3

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        ctx.globalAlpha = 1

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="flex h-screen bg-[#141414] font-mono relative">
      {/* Matrix Rain Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-10 pointer-events-none"
        style={{ zIndex: 0 }}
      />

      {/* Sidebar Container - padding only on desktop */}
      <div className="md:p-6">
        <WeoktoSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 relative z-10">
        {/* Scrollable content */}
        <div className="h-full overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
