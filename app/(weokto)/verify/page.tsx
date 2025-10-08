/**
 * WEOKTO OTP Verification Page
 *
 * OTP verification page for WEOKTO users
 *
 * Features:
 * - 6-digit OTP input field
 * - Auto-focus and auto-submit when 6 digits entered
 * - Resend OTP functionality
 * - Terminal-style design
 * - Form validation
 * - Loading states
 * - Error handling
 * - Redirects to dashboard after successful verification
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for icons (LockKey, ArrowLeft)
 * - API route: POST /api/auth/verify-otp
 * - useRouter for navigation
 * - useSearchParams to get email from query string
 *
 * TypeScript with proper types
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function WeoktoVerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = searchParams.get('email') || '';

  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-submit when 6 digits are entered
  useEffect(() => {
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otp]);

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromQuery, otp })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid OTP');
      }

      // Redirect to dashboard or home
      router.push('/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setOtp(''); // Clear OTP on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromQuery })
      });

      if (!response.ok) {
        throw new Error('Failed to resend OTP');
      }

      // Show success message (could use toast notification)
      alert('OTP resent successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Terminal-style container */}
        <div className="bg-gray-800 border-2 border-purple-500 rounded-lg p-8 shadow-2xl shadow-purple-500/20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-purple-400 font-mono mb-2">
              {'> VERIFY OTP'}
            </h1>
            <p className="text-gray-400 text-sm">
              Enter the 6-digit code sent to{' '}
              <span className="text-purple-400">{emailFromQuery}</span>
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <label
              htmlFor="otp"
              className="block text-sm font-mono text-purple-400 mb-2"
            >
              OTP CODE
            </label>
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError(null);
              }}
              className="w-full px-4 py-4 bg-gray-900 border border-purple-500/30 rounded text-white text-center text-3xl tracking-widest font-mono focus:outline-none focus:border-purple-500 transition-colors"
              placeholder="000000"
              maxLength={6}
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded">
              <p className="text-red-400 text-sm font-mono">{error}</p>
            </div>
          )}

          {/* Status */}
          {isLoading && (
            <div className="mb-6 text-center">
              <p className="text-purple-400 text-sm font-mono">Verifying...</p>
            </div>
          )}

          {/* Resend OTP */}
          <div className="text-center">
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-purple-400 hover:text-purple-300 text-sm disabled:opacity-50"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-gray-500 hover:text-gray-400 text-sm flex items-center justify-center gap-2"
            >
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
