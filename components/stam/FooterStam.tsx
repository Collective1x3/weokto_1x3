/**
 * FooterStam Component
 *
 * Footer for STAM landing page with links and information
 *
 * Features:
 * - Multi-column layout (Product, Resources, Company, Legal)
 * - Newsletter subscription form
 * - Social media links
 * - Copyright notice
 * - Clean, professional design
 *
 * Uses:
 * - Tailwind CSS with STAM blue theme (#3B82F6)
 * - @phosphor-icons/react for social icons (FacebookLogo, TwitterLogo, LinkedinLogo, InstagramLogo)
 * - Responsive grid layout
 *
 * Props: None
 */

'use client';

import React from 'react';

export default function FooterStam() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Product */}
          <div>
            <h3 className="text-blue-600 font-bold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Integrations
                </a>
              </li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h3 className="text-blue-600 font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Company */}
          <div>
            <h3 className="text-blue-600 font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600 text-sm">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h3 className="text-blue-600 font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-600 text-sm mb-4">
              Subscribe to our newsletter for updates
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-4 mb-4 md:mb-0">
            <p className="text-gray-500 text-sm">
              © 2024 STAM. All rights reserved.
            </p>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-blue-600 text-sm">
              Terms of Service
            </a>
          </div>

          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-400 hover:text-blue-600">
              {/* Social icons */}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
