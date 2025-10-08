/**
 * UserSessionContext
 *
 * Context for managing WEOKTO user session and authentication state
 *
 * Features:
 * - User authentication state
 * - User profile data
 * - Session management
 * - Login/logout functionality
 * - Fetch user data on mount
 * - Redirect logic for protected routes
 *
 * Used by:
 * - WEOKTO pages and components
 * - Protected routes requiring authentication
 *
 * Usage:
 * ```tsx
 * const { user, isLoading, login, logout } = useUserSession();
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface WeoktoUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'AFFILIATE' | 'GUILD_MEMBER' | 'GUILD_OWNER';
  affiliateId?: string;
  guildId?: string;
  createdAt: string;
}

interface UserSessionContextType {
  user: WeoktoUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserSessionContext = createContext<UserSessionContextType | undefined>(undefined);

interface UserSessionProviderProps {
  children: ReactNode;
}

export function UserSessionProvider({ children }: UserSessionProviderProps) {
  const router = useRouter();
  const [user, setUser] = useState<WeoktoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch user on mount
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Fetch user data after successful login
      await fetchUser();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setUser(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  const value: UserSessionContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshUser,
  };

  return (
    <UserSessionContext.Provider value={value}>
      {children}
    </UserSessionContext.Provider>
  );
}

export function useUserSession() {
  const context = useContext(UserSessionContext);
  if (context === undefined) {
    throw new Error('useUserSession must be used within a UserSessionProvider');
  }
  return context;
}
