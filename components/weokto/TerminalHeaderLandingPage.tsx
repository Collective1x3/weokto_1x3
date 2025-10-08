/**
 * TerminalHeaderLandingPage Component
 *
 * Terminal-style header for WEOKTO landing page with navigation
 *
 * Features:
 * - Terminal aesthetic design
 * - Navigation menu (Home, Features, Pricing, About)
 * - Login/Signup CTA buttons
 * - Mobile responsive hamburger menu
 * - Sticky header on scroll
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for icons (Terminal, List, X)
 * - framer-motion for animations
 * - AuthContext to open auth modal
 *
 * Props: None
 */

'use client';

import React from 'react';

export default function TerminalHeaderLandingPage() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-purple-400 font-mono font-bold text-xl">WEOKTO</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {/* Nav links here */}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Login/Signup buttons */}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            {/* Hamburger menu */}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="md:hidden">
        {/* Mobile navigation */}
      </div>
    </header>
  );
}
