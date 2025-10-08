/**
 * HeaderStam Component
 *
 * Header for STAM landing page with navigation
 *
 * Features:
 * - Clean, professional design (STAM blue theme)
 * - Navigation menu (Home, Features, Pricing, Community, About)
 * - Login/Signup CTA buttons
 * - Mobile responsive hamburger menu
 * - Sticky header on scroll
 *
 * Uses:
 * - Tailwind CSS with STAM blue theme (#3B82F6)
 * - @phosphor-icons/react for icons (List, X, User)
 * - framer-motion for animations
 * - Links to STAM auth pages
 *
 * Props: None
 */

'use client';

import React, { useState } from 'react';

export default function HeaderStam() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <span className="text-blue-600 font-bold text-2xl">STAM</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">
              Pricing
            </a>
            <a href="#community" className="text-gray-700 hover:text-blue-600 transition-colors">
              Community
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
              About
            </a>
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="/login"
              className="px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              Login
            </a>
            <a
              href="/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Get Started
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700"
          >
            {isMobileMenuOpen ? '×' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <nav className="px-4 py-4 space-y-4">
            <a href="#features" className="block text-gray-700 hover:text-blue-600">
              Features
            </a>
            <a href="#pricing" className="block text-gray-700 hover:text-blue-600">
              Pricing
            </a>
            <a href="#community" className="block text-gray-700 hover:text-blue-600">
              Community
            </a>
            <a href="#about" className="block text-gray-700 hover:text-blue-600">
              About
            </a>
            <div className="pt-4 space-y-2">
              <a
                href="/login"
                className="block w-full px-4 py-2 text-center text-blue-600 border border-blue-600 rounded-lg"
              >
                Login
              </a>
              <a
                href="/login"
                className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg"
              >
                Get Started
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
