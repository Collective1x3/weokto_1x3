/**
 * TerminalAuthModal Component
 *
 * Terminal-style authentication modal for WEOKTO
 *
 * Features:
 * - Two-step authentication flow:
 *   1. Email input (sends magic link)
 *   2. OTP verification (6-digit code)
 * - Terminal aesthetic design
 * - Modal overlay with backdrop
 * - Form validation
 * - Loading states
 * - Error handling
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for icons (X, EnvelopeSimple, LockKey)
 * - framer-motion for modal animations
 * - AuthContext for modal open/close state
 * - API routes: POST /api/auth/send-magic-link, POST /api/auth/verify-otp
 *
 * Props:
 * - isOpen: boolean
 * - onClose: () => void
 */

'use client';

import React, { useState } from 'react';

interface TerminalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthStep = 'email' | 'otp';

export default function TerminalAuthModal({ isOpen, onClose }: TerminalAuthModalProps) {
  const [step, setStep] = useState<AuthStep>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call API to send magic link
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) throw new Error('Failed to send magic link');

      setStep('otp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Call API to verify OTP
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      if (!response.ok) throw new Error('Invalid OTP');

      // Redirect to dashboard or close modal
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-gray-900 border-2 border-purple-500 rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl shadow-purple-500/20">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          ×
        </button>

        {/* Terminal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-purple-400 font-mono">
            {step === 'email' ? '> LOGIN' : '> VERIFY OTP'}
          </h2>
        </div>

        {/* Email Step */}
        {step === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                EMAIL
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white focus:outline-none focus:border-purple-500"
                placeholder="your@email.com"
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? 'SENDING...' : 'SEND MAGIC LINK'}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-mono text-gray-400 mb-2">
                OTP CODE (6 DIGITS)
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full px-4 py-2 bg-gray-800 border border-purple-500/30 rounded text-white text-center text-2xl tracking-widest font-mono focus:outline-none focus:border-purple-500"
                placeholder="000000"
                maxLength={6}
                required
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm font-mono">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded transition-colors disabled:opacity-50"
            >
              {isLoading ? 'VERIFYING...' : 'VERIFY'}
            </button>

            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-purple-400 text-sm hover:text-purple-300"
            >
              ← Back to email
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
