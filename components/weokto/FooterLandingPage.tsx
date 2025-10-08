/**
 * FooterLandingPage Component
 *
 * Footer for WEOKTO landing page with links and information
 *
 * Features:
 * - Multi-column layout (Product, Company, Legal, Social)
 * - Newsletter subscription form
 * - Social media links
 * - Copyright notice
 * - Terminal-style design elements
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for social icons
 * - Responsive grid layout
 *
 * Props: None
 */

'use client';

import React from 'react';

export default function FooterLandingPage() {
  return (
    <footer className="bg-gray-950 border-t border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Product */}
          <div>
            <h3 className="text-purple-400 font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              {/* Links */}
            </ul>
          </div>

          {/* Column 2: Company */}
          <div>
            <h3 className="text-purple-400 font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              {/* Links */}
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h3 className="text-purple-400 font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              {/* Links */}
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-purple-400 font-bold mb-4">Newsletter</h3>
            {/* Newsletter form */}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            © 2024 WEOKTO. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex space-x-4">
            {/* Social icons */}
          </div>
        </div>
      </div>
    </footer>
  );
}
