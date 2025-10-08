/**
 * STAM Landing Page
 *
 * Landing page for STAM (different from dashboard)
 *
 * Features:
 * - Hero section showcasing STAM value proposition
 * - Features overview
 * - Pricing/Plans preview
 * - Testimonials
 * - CTA sections
 * - Footer with links
 *
 * Uses:
 * - HeaderStam component for navigation
 * - FooterStam component
 * - Tailwind CSS with STAM blue theme (#3B82F6)
 * - @phosphor-icons/react for icons
 * - framer-motion for animations
 *
 * Mobile responsive with proper TypeScript types
 */

import React from 'react';

export default function StamLandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header - component to be created */}
      {/* <HeaderStam /> */}

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            STAM Landing Page
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-700">
            Build and grow your online community
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        {/* Feature cards */}
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4 bg-gray-50">
        {/* Pricing cards */}
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        {/* Testimonials */}
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        {/* Final call to action */}
      </section>

      {/* Footer */}
      {/* <FooterStam /> */}
    </div>
  );
}
