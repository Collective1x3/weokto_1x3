/**
 * StamUserContext
 *
 * Context for managing STAM customer session and authentication state
 *
 * Features:
 * - Customer authentication state
 * - Customer profile data
 * - Session management
 * - Login/logout functionality
 * - Fetch customer data on mount
 * - Redirect logic for protected routes
 * - Active subscriptions and products
 *
 * Used by:
 * - STAM pages and components
 * - Protected routes requiring authentication
 *
 * Usage:
 * ```tsx
 * const { customer, isLoading, login, logout } = useStamUser();
 * ```
 */

'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface StamCustomer {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  subscriptionTier?: 'FREE' | 'BASIC' | 'PRO' | 'ENTERPRISE';
  subscriptionStatus?: 'ACTIVE' | 'INACTIVE' | 'CANCELLED' | 'TRIAL';
  stripeCustomerId?: string;
  guildId?: string;
  createdAt: string;
}

interface StamUserContextType {
  customer: StamCustomer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, otp: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const StamUserContext = createContext<StamUserContextType | undefined>(undefined);

interface StamUserProviderProps {
  children: ReactNode;
}

export function StamUserProvider({ children }: StamUserProviderProps) {
  const router = useRouter();
  const [customer, setCustomer] = useState<StamCustomer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch customer on mount
  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stam/auth/me', {
        credentials: 'include',
      });

      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData.customer);
        setIsAuthenticated(true);
      } else {
        setCustomer(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error fetching customer:', error);
      setCustomer(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/stam/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      // Fetch customer data after successful login
      await fetchCustomer();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/stam/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      setCustomer(null);
      setIsAuthenticated(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const refreshCustomer = async () => {
    await fetchCustomer();
  };

  const value: StamUserContextType = {
    customer,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshCustomer,
  };

  return (
    <StamUserContext.Provider value={value}>
      {children}
    </StamUserContext.Provider>
  );
}

export function useStamUser() {
  const context = useContext(StamUserContext);
  if (context === undefined) {
    throw new Error('useStamUser must be used within a StamUserProvider');
  }
  return context;
}
