"use client";

import { type ReactNode } from 'react';
import { UserSessionProvider, type DashboardUser } from '@/contexts/UserSessionContext';
import DashboardSidebarRedesigned from '@/components/weokto/DashboardSidebarRedesigned';
import { useSessionRefresh } from '@/hooks/useSessionRefresh';

type LayoutProps = {
  children: ReactNode
  initialUser: DashboardUser | null
}

export default function DashboardLayoutRedesigned({ children, initialUser }: LayoutProps) {
  return (
    <UserSessionProvider initialUser={initialUser}>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </UserSessionProvider>
  );
}

function DashboardLayoutInner({ children }: { children: ReactNode }) {
  // Auto-refresh session for active users
  useSessionRefresh();

  return (
    <div className="flex h-screen bg-[#0A0A0F] relative">
      {/* Sidebar */}
      <DashboardSidebarRedesigned />

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Subtle ambient background effect */}
        <div className="absolute inset-0 pointer-events-none opacity-30 z-0">
          {/* Gradient orbs for subtle ambient lighting */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        {/* Content wrapper with proper scrolling */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <div className="min-h-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}