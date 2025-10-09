'use client'

import { useMemo, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import type { SubscriptionStatus } from '@prisma/client'

export interface PlanOption {
  id: string
  name: string
  amountCents: number
  currency: string
  billingInterval?: string | null
}

interface SubscriptionActionsProps {
  subscriptionId: string
  status: SubscriptionStatus
  currentPlanId?: string | null
  isPaused: boolean
  availablePlans: PlanOption[]
}

function formatAmount(amountCents: number, currency: string, interval?: string | null) {
  const formatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency }).format(amountCents / 100)
  return interval ? `${formatted} / ${interval}` : formatted
}

export function SubscriptionActions({
  subscriptionId,
  status,
  currentPlanId,
  isPaused,
  availablePlans
}: SubscriptionActionsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [feedback, setFeedback] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState(currentPlanId ?? availablePlans[0]?.id ?? '')

  const otherPlans = useMemo(
    () => availablePlans.filter((plan) => plan.id !== currentPlanId),
    [availablePlans, currentPlanId]
  )

  const handleCancel = () => {
    if (!window.confirm('Confirmer l’annulation de l’abonnement ?')) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'customer_request' })
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible d’annuler cet abonnement')
        }
        setFeedback('Abonnement annulé. Une confirmation va être envoyée par email.')
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant l’annulation')
      }
    })
  }

  const handlePause = (days: number) => {
    startTransition(async () => {
      try {
        const resumeAt = new Date()
        resumeAt.setDate(resumeAt.getDate() + days)
        const response = await fetch(`/api/subscriptions/${subscriptionId}/pause`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeAt: resumeAt.toISOString(), reason: 'customer_pause' })
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de mettre en pause cet abonnement')
        }
        setFeedback(`Abonnement mis en pause pendant ${days} jours.`)
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant la mise en pause')
      }
    })
  }

  const handleResume = () => {
    startTransition(async () => {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
          method: 'POST'
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de reprendre cet abonnement')
        }
        setFeedback('Abonnement réactivé. Le prochain prélèvement suivra l’échéancier habituel.')
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant la reprise')
      }
    })
  }

  const handleSwitchPlan = (planId: string) => {
    if (!planId || planId === currentPlanId) return

    startTransition(async () => {
      try {
        const response = await fetch(`/api/subscriptions/${subscriptionId}/switch`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ planId })
        })
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error ?? 'Impossible de changer de plan pour cet abonnement')
        }
        setFeedback('Plan mis à jour. La prochaine facture reflétera ce changement.')
        router.refresh()
      } catch (error) {
        setFeedback(error instanceof Error ? error.message : 'Erreur inattendue pendant le changement de plan')
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={handleCancel}
        disabled={isPending || status === 'CANCELED'}
        className="rounded-xl border border-rose-500/40 px-3 py-1.5 text-xs font-medium text-rose-300 transition hover:bg-rose-500/10 disabled:opacity-50"
      >
        Annuler
      </button>

      {isPaused ? (
        <button
          onClick={handleResume}
          disabled={isPending}
          className="rounded-xl border border-emerald-500/40 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-500/10 disabled:opacity-50"
        >
          Reprendre
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePause(30)}
            disabled={isPending || status === 'CANCELED'}
            className="rounded-xl border border-amber-500/40 px-3 py-1.5 text-xs font-medium text-amber-300 transition hover:bg-amber-500/10 disabled:opacity-50"
          >
            Pause 30 jours
          </button>
        </div>
      )}

      {otherPlans.length > 0 && (
        <label className="inline-flex items-center gap-2 text-xs text-slate-400">
          Changer de plan
          <select
            value={selectedPlanId}
            onChange={(event) => {
              const nextPlanId = event.target.value
              setSelectedPlanId(nextPlanId)
              handleSwitchPlan(nextPlanId)
            }}
            disabled={isPending}
            className="rounded-lg border border-slate-700 bg-slate-900/80 px-2 py-1 text-xs text-slate-100 focus:border-purple-400/60 focus:outline-none"
          >
            {availablePlans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} — {formatAmount(plan.amountCents, plan.currency, plan.billingInterval)}
              </option>
            ))}
          </select>
        </label>
      )}

      {feedback && <p className="text-xs text-slate-400">{feedback}</p>}
    </div>
  )
}
