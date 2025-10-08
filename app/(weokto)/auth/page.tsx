/**
 * WEOKTO Login Page
 *
 * Dedicated login page for WEOKTO with email form
 *
 * Features:
 * - Email input form
 * - Sends magic link to email
 * - Terminal-style design
 * - Form validation
 * - Loading states
 * - Error handling
 * - Redirects to /verify-otp after sending email
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for icons (EnvelopeSimple, ArrowRight)
 * - API route: POST /api/auth/send-magic-link
 * - useRouter for navigation
 *
 * TypeScript with proper types
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function WeoktoLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/send-magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send magic link');
      }

      // Redirect to OTP verification page
      router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
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
              {'> WEOKTO LOGIN'}
            </h1>
            <p className="text-gray-400 text-sm">
              Enter your email to receive a magic link
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-mono text-purple-400 mb-2"
              >
                EMAIL ADDRESS
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-900 border border-purple-500/30 rounded text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/30 rounded">
                <p className="text-red-400 text-sm font-mono">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'SENDING...' : 'SEND MAGIC LINK'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              New to WEOKTO?{' '}
              <a href="/home" className="text-purple-400 hover:text-purple-300">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
