/**
 * AuthContext
 *
 * Context for managing authentication modal state across the application
 *
 * Features:
 * - Open/close auth modal
 * - Track which platform (WEOKTO or STAM)
 * - Track which step (email or OTP)
 * - Global state for authentication flow
 *
 * Used by:
 * - TerminalAuthModal (WEOKTO)
 * - Any component that needs to trigger login
 *
 * Usage:
 * ```tsx
 * const { isAuthModalOpen, openAuthModal, closeAuthModal } = useAuth();
 * ```
 */

'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthStep = 'email' | 'otp';
type Platform = 'weokto' | 'stam';

interface AuthContextType {
  isAuthModalOpen: boolean;
  authStep: AuthStep;
  platform: Platform;
  email: string;
  openAuthModal: (platform: Platform) => void;
  closeAuthModal: () => void;
  setAuthStep: (step: AuthStep) => void;
  setEmail: (email: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authStep, setAuthStep] = useState<AuthStep>('email');
  const [platform, setPlatform] = useState<Platform>('weokto');
  const [email, setEmail] = useState('');

  const openAuthModal = (selectedPlatform: Platform) => {
    setPlatform(selectedPlatform);
    setAuthStep('email');
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setAuthStep('email');
    setEmail('');
  };

  const value: AuthContextType = {
    isAuthModalOpen,
    authStep,
    platform,
    email,
    openAuthModal,
    closeAuthModal,
    setAuthStep,
    setEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
