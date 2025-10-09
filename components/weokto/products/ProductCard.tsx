'use client'

import Link from 'next/link'
import { CalendarBlank, Coins, GlobeHemisphereWest, Lock, UsersThree } from 'phosphor-react'

interface PlanSummary {
  id: string
  name: string
  price: number
  currency: string
  billingInterval?: string | null
  billingCount?: number | null
  isFree: boolean
}

export interface SupplierProductCardProps {
  product: {
    id: string
    name: string
    description?: string | null
    autoPageEnabled: boolean
    defaultCurrency?: string | null
    createdAt?: string
    plans?: PlanSummary[]
    plansCount?: number
    customersCount?: number
  }
  onManage?: (productId: string) => void
  onPricing?: (productId: string) => void
}

function formatPrice(amountCents: number, currency: string) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency
  }).format(amountCents / 100)
}

function formatInterval(plan: PlanSummary) {
  if (plan.isFree) {
    return 'Gratuit'
  }

  if (!plan.billingInterval || plan.billingInterval === 'lifetime') {
    return `${formatPrice(plan.price, plan.currency)} à vie`
  }

  const count = Math.max(plan.billingCount ?? 1, 1)

  const intervalLabel = (() => {
    const base = plan.billingInterval.toLowerCase()
    switch (base) {
      case 'daily':
      case 'day':
        return count > 1 ? `${count} jours` : 'jour'
      case 'weekly':
      case 'week':
        return count > 1 ? `${count} semaines` : 'semaine'
      case 'monthly':
      case 'month':
        return count > 1 ? `${count} mois` : 'mois'
      case 'yearly':
      case 'year':
        return count > 1 ? `${count} ans` : 'an'
      default:
        return count > 1 ? `${count} ${base}` : base
    }
  })()

  return `${formatPrice(plan.price, plan.currency)} / ${intervalLabel}`
}

export function SupplierProductCard({ product, onManage, onPricing }: SupplierProductCardProps) {
  const plans = product.plans ?? []
  const primaryPlan = plans.find((plan) => !plan.isFree) ?? plans[0] ?? null

  return (
    <div className="relative flex flex-col rounded-2xl border border-[#B794F4]/30 bg-[#1e1e1e] p-6 transition-all duration-200 hover:border-[#B794F4] hover:bg-[#1e1e1e]/80">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white">{product.name}</h2>
            <span
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold uppercase tracking-[0.18em] ${
                product.autoPageEnabled
                  ? 'border-emerald-400/40 text-emerald-300'
                  : 'border-red-400/40 text-red-300'
              }`}
            >
              {product.autoPageEnabled ? (
                <>
                  <GlobeHemisphereWest size={12} weight="bold" />
                  Public
                </>
              ) : (
                <>
                  <Lock size={12} weight="bold" />
                  Privé
                </>
              )}
            </span>
          </div>

          {product.description && (
            <p className="mt-2 text-sm text-gray-400 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="flex flex-col items-end gap-2 text-xs uppercase tracking-[0.25em] text-gray-500">
          <span className="flex items-center gap-1">
            <CalendarBlank size={14} />
            {product.createdAt
              ? new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).format(new Date(product.createdAt))
              : 'Date inconnue'}
          </span>
          {product.defaultCurrency && (
            <span className="flex items-center gap-1">
              <Coins size={14} />
              {product.defaultCurrency.toUpperCase()}
            </span>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
        <div className="rounded-xl border border-[#B794F4]/20 bg-[#19161f] p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[#B794F4]/70">Tarification</p>
          {primaryPlan ? (
            <p className="mt-2 text-lg font-semibold text-white">{formatInterval(primaryPlan)}</p>
          ) : (
            <p className="mt-2 text-sm text-gray-500">Aucun prix configuré</p>
          )}
          {plans.length > 1 && (
            <p className="mt-1 text-xs text-gray-500">{plans.length - 1} autres plans</p>
          )}
        </div>
        <div className="rounded-xl border border-[#B794F4]/20 bg-[#19161f] p-4">
          <p className="text-xs uppercase tracking-[0.28em] text-[#B794F4]/70">Clients</p>
          <div className="mt-2 flex items-center gap-2 text-white">
            <UsersThree size={20} className="text-purple-300" />
            <span className="text-lg font-semibold">
              {product.customersCount ?? product.plansCount ?? 0}{' '}
              <span className="text-sm text-gray-500">plans actifs</span>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => onManage?.(product.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#B794F4]/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B794F4] transition-all duration-200 hover:border-[#B794F4] hover:bg-purple-400/10"
        >
          Gérer
        </button>
        <button
          onClick={() => onPricing?.(product.id)}
          className="inline-flex items-center gap-2 rounded-lg border border-[#B794F4]/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 transition-all duration-200 hover:border-[#B794F4]/50 hover:text-white"
        >
          Tarifs
        </button>
        {product.autoPageEnabled && (
          <Link
            href={`/checkout?productId=${encodeURIComponent(product.id)}`}
            className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-200 transition-all duration-200 hover:border-emerald-400 hover:bg-emerald-400/10"
          >
            Voir la page
          </Link>
        )}
      </div>
    </div>
  )
}
