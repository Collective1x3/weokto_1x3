'use client'

import { useState, useTransition } from 'react'
import type { PaymentMethodStatus } from '@prisma/client'
import { useRouter } from 'next/navigation'

interface PaymentMethodActionsProps {
  paymentMethodId: string
  isDefault: boolean
  status: PaymentMethodStatus
}

export function PaymentMethodActions({ paymentMethodId, isDefault, status }: PaymentMethodActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [captureUrl, setCaptureUrl] = useState<string | null>(null)

  const handleSetDefault = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/profile/payment-methods/${paymentMethodId}/default`, {
          method: 'POST'
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de définir ce moyen de paiement par défaut')
        }
        setFeedback('Méthode définie par défaut.')
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant la mise à jour')
      }
    })
  }

  const handleDelete = () => {
    if (!window.confirm('Supprimer ce moyen de paiement ?')) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/profile/payment-methods/${paymentMethodId}`, {
          method: 'DELETE'
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de supprimer ce moyen de paiement')
        }
        setFeedback('Méthode supprimée. Pensez à en ajouter une nouvelle pour éviter toute interruption.')
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant la suppression')
      }
    })
  }

  const handleRefresh = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/profile/payment-methods/${paymentMethodId}/refresh`, {
          method: 'POST'
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de générer un lien de mise à jour')
        }
        const payload = await response.json()
        setCaptureUrl(payload?.capture?.iframeUrl ?? null)
        setFeedback('Lien de mise à jour généré. Ouvrez-le pour sécuriser une nouvelle carte.')
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant la mise à jour')
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-xs">
      {!isDefault && (
        <button
          onClick={handleSetDefault}
          disabled={isPending}
          className="rounded-xl border border-purple-500/40 px-3 py-1.5 font-medium text-purple-200 transition hover:bg-purple-500/10 disabled:opacity-50"
        >
          Définir par défaut
        </button>
      )}

      <button
        onClick={handleRefresh}
        disabled={isPending || status === 'FAILED'}
        className="rounded-xl border border-sky-500/40 px-3 py-1.5 font-medium text-sky-200 transition hover:bg-sky-500/10 disabled:opacity-50"
      >
        Mettre à jour
      </button>

      <button
        onClick={handleDelete}
        disabled={isPending}
        className="rounded-xl border border-rose-500/40 px-3 py-1.5 font-medium text-rose-200 transition hover:bg-rose-500/10 disabled:opacity-50"
      >
        Supprimer
      </button>

      {feedback && <p className="text-slate-400">{feedback}</p>}
      {captureUrl && (
        <button
          onClick={() => window.open(captureUrl, '_blank', 'noopener')}
          className="rounded-xl border border-emerald-500/40 px-3 py-1.5 font-medium text-emerald-200 transition hover:bg-emerald-500/10"
        >
          Ouvrir le formulaire sécurisé
        </button>
      )}
    </div>
  )
}
