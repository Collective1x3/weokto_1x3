'use client'

import { useFormStatus } from 'react-dom'

export function SaveButton({ label = 'Enregistrer' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-md transition hover:bg-emerald-700 disabled:bg-emerald-500 disabled:opacity-70"
      disabled={pending}
    >
      {pending ? 'Enregistrement...' : label}
    </button>
  )
}
