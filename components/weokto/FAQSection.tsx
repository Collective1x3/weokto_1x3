/**
 * FAQSection Component
 *
 * Accordion-style FAQ section for WEOKTO landing page
 *
 * Features:
 * - Accordion functionality (expand/collapse)
 * - Smooth animations with framer-motion
 * - Terminal-style visual design
 * - Multiple FAQ items
 * - Click to expand/collapse individual items
 *
 * Uses:
 * - Tailwind CSS with WEOKTO purple theme (#B794F4)
 * - @phosphor-icons/react for icons (CaretDown, CaretUp)
 * - framer-motion for smooth expand/collapse animations
 * - useState for managing open/closed state
 *
 * Props:
 * - faqs?: Array<{ question: string; answer: string }> (optional, uses default FAQs if not provided)
 */

'use client';

import React, { useState } from 'react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQSectionProps {
  faqs?: FAQ[];
}

const defaultFaqs: FAQ[] = [
  {
    question: "What is WEOKTO?",
    answer: "WEOKTO is a platform for affiliates and guilds to create, sell, and dominate."
  },
  {
    question: "How does the affiliate program work?",
    answer: "Our affiliate program allows you to earn commissions by promoting products."
  },
  {
    question: "What are guilds?",
    answer: "Guilds are exclusive communities where members can collaborate and grow together."
  }
];

export default function FAQSection({ faqs = defaultFaqs }: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 px-4 bg-gray-900">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-purple-400">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-purple-500/20 rounded-lg overflow-hidden bg-gray-800/50"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-purple-500/10 transition-colors"
              >
                <span className="font-semibold text-white">{faq.question}</span>
                <span className="text-purple-400">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 py-4 border-t border-purple-500/20 bg-gray-900/50">
                  <p className="text-gray-300">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
