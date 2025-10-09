'use client'

import { useCallback, useState } from 'react'

export function ReferralLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch (error) {
      console.error('Clipboard copy failed', error)
      setCopied(false)
    }
  }, [url])

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 truncate rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-emerald-800">
        {url}
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:bg-emerald-700"
      >
        {copied ? 'Copié !' : 'Copier'}
      </button>
    </div>
  )
}
