'use client'

import React from 'react'

interface CodeBlockClientProps {
  children: string
  className?: string
}

export default function CodeBlockClient({ children, className }: CodeBlockClientProps) {
  const copyToClipboard = () => {
    try {
      navigator.clipboard.writeText(children)
    } catch (e) {
      // no-op
    }
  }

  return (
    <div className="relative group my-6">
      <button
        onClick={copyToClipboard}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copier le code"
        type="button"
      >
        <span className="text-gray-400" aria-hidden>⧉</span>
      </button>
      <pre className={`rounded-lg bg-[#1e1e1e] p-4 overflow-x-auto ${className || ''}`}>
        <code>{children}</code>
      </pre>
    </div>
  )
}


