/**
 * STAM OTP Verification Page
 *
 * OTP verification page for STAM customers
 *
 * Features:
 * - 6-digit OTP input field
 * - Auto-focus and auto-submit when 6 digits entered
 * - Resend OTP functionality
 * - Clean, professional design
 * - Form validation
 * - Loading states
 * - Error handling
 * - Redirects to dashboard after successful verification
 *
 * Uses:
 * - Tailwind CSS with STAM blue theme (#3B82F6)
 * - @phosphor-icons/react for icons (LockKey, ArrowLeft)
 * - API route: POST /api/stam/auth/verify-otp
 * - useRouter for navigation
 * - useSearchParams to get email from query string
 *
 * TypeScript with proper types
 */

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function StamVerifyOtpPage() {
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
      const response = await fetch('/api/stam/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailFromQuery, otp })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Invalid OTP');
      }

      // Redirect to dashboard
      router.push('/dashboard');
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
      const response = await fetch('/api/stam/auth/send-magic-link', {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Verification container */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              {/* Lock icon placeholder */}
              <div className="text-blue-600 text-2xl">🔐</div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              Enter the 6-digit code sent to
            </p>
            <p className="text-blue-600 font-medium">
              {emailFromQuery}
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-6">
            <input
              id="otp"
              type="text"
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                setOtp(value);
                setError(null);
              }}
              className="w-full px-4 py-4 border-2 border-gray-300 rounded-lg text-gray-900 text-center text-3xl tracking-widest font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="000000"
              maxLength={6}
              autoFocus
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm text-center">{error}</p>
            </div>
          )}

          {/* Status */}
          {isLoading && (
            <div className="mb-6 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="text-blue-600 text-sm mt-2">Verifying...</p>
            </div>
          )}

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex gap-2 justify-center">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    i < otp.length ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Resend OTP */}
          <div className="text-center mb-6">
            <button
              onClick={handleResendOtp}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium disabled:opacity-50"
            >
              Didn't receive the code? Resend
            </button>
          </div>

          {/* Back to login */}
          <div className="text-center">
            <a
              href="/login"
              className="text-gray-500 hover:text-gray-700 text-sm flex items-center justify-center gap-2"
            >
              ← Back to login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
