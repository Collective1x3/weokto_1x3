'use client'

import { FormEvent, useEffect, useMemo, useState } from 'react'
import {
  ArrowClockwise,
  CalendarBlank,
  Check,
  Coins,
  Lightning,
  SpinnerGap,
  WarningCircle
} from 'phosphor-react'

type BillingBase = 'day' | 'week' | 'month' | 'year'

const billingBaseOptions: { value: BillingBase; label: string }[] = [
  { value: 'day', label: 'Jours' },
  { value: 'week', label: 'Semaines' },
  { value: 'month', label: 'Mois' },
  { value: 'year', label: 'Années' }
]

interface PricingBuilderProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productDefaultCurrency?: string | null
  plan?: ExistingPlan
  onCompleted?: () => void
}

interface ExistingPlan {
  id: string
  name: string
  price: number
  currency: string
  billingInterval?: string | null
  billingCount?: number | null
  isFree: boolean
  trialDays?: number | null
  registrationFee?: number | null
  maxBillingCycles?: number | null
}

interface FormState {
  name: string
  currency: string
  amount: string
  isFree: boolean
  model: 'one_time' | 'recurring'
  billingBase: BillingBase
  billingCount: number
  trialDays: string
  registrationFee: string
  maxBillingCycles: string
}

const defaultFormState: FormState = {
  name: '',
  currency: 'EUR',
  amount: '',
  isFree: false,
  model: 'recurring',
  billingBase: 'month',
  billingCount: 1,
  trialDays: '',
  registrationFee: '',
  maxBillingCycles: ''
}

function toCents(value: string) {
  const parsed = Number(value.replace(',', '.'))
  if (Number.isNaN(parsed) || parsed < 0) return 0
  return Math.round(parsed * 100)
}

function fromCents(value?: number | null) {
  if (!value) return ''
  return (value / 100).toFixed(2).replace('.', ',')
}

function normalizeInterval(base: BillingBase): string {
  switch (base) {
    case 'day':
      return 'daily'
    case 'week':
      return 'weekly'
    case 'month':
      return 'monthly'
    case 'year':
      return 'yearly'
    default:
      return 'monthly'
  }
}

function deriveBase(interval?: string | null): BillingBase {
  switch ((interval ?? '').toLowerCase()) {
    case 'daily':
    case 'day':
      return 'day'
    case 'weekly':
    case 'week':
      return 'week'
    case 'yearly':
    case 'year':
      return 'year'
    default:
      return 'month'
  }
}

export function PricingBuilder({ isOpen, onClose, productId, productDefaultCurrency, plan, onCompleted }: PricingBuilderProps) {
  const [form, setForm] = useState<FormState>({
    ...defaultFormState,
    currency: plan?.currency ?? productDefaultCurrency ?? 'EUR'
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    if (!plan) {
      setForm({
        ...defaultFormState,
        currency: productDefaultCurrency ?? 'EUR'
      })
      setError(null)
      setSuccess(false)
      return
    }

    const isOneTime = !plan.billingInterval || plan.billingInterval === 'lifetime'
    setForm({
      name: plan.name ?? '',
      currency: plan.currency ?? productDefaultCurrency ?? 'EUR',
      amount: plan.isFree ? '' : fromCents(plan.price),
      isFree: plan.isFree,
      model: isOneTime ? 'one_time' : 'recurring',
      billingBase: deriveBase(plan.billingInterval),
      billingCount: Math.max(plan.billingCount ?? 1, 1),
      trialDays: plan.trialDays ? String(plan.trialDays) : '',
      registrationFee: plan.registrationFee ? fromCents(plan.registrationFee) : '',
      maxBillingCycles: plan.maxBillingCycles ? String(plan.maxBillingCycles) : ''
    })
    setError(null)
    setSuccess(false)
  }, [isOpen, plan, productDefaultCurrency])

  const heading = plan ? 'Modifier le prix' : 'Nouveau prix'
  const actionLabel = plan ? 'Enregistrer' : 'Créer'

  const preview = useMemo(() => {
    if (form.isFree) {
      return 'Gratuit'
    }
    const amountCents = toCents(form.amount)
    if (amountCents <= 0) {
      return '—'
    }
    const amountLabel = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: form.currency
    }).format(amountCents / 100)

    if (form.model === 'one_time') {
      return `${amountLabel} à vie`
    }

    const unit = billingBaseOptions.find((option) => option.value === form.billingBase)?.label ?? 'mois'
    const count = Math.max(form.billingCount, 1)
    return `${amountLabel} tous les ${count} ${unit.toLowerCase()}`
  }, [form.amount, form.currency, form.model, form.billingBase, form.billingCount, form.isFree])

  if (!isOpen) return null

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!form.name.trim()) {
      setError('Donne un nom à ton plan.')
      return
    }

    if (!form.isFree && toCents(form.amount) <= 0) {
      setError('Renseigne un montant valide (supérieur à zéro).')
      return
    }

    if (form.model === 'recurring' && form.billingCount <= 0) {
      setError('Le nombre d’intervalles doit être supérieur à 0.')
      return
    }

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      currency: form.currency.toUpperCase(),
      productId,
      isFree: form.isFree
    }

    if (form.isFree) {
      payload.price = 0
      payload.billingInterval = 'lifetime'
      payload.billingCount = 1
    } else {
      payload.price = toCents(form.amount)
      if (form.model === 'one_time') {
        payload.billingInterval = 'lifetime'
        payload.billingCount = 1
      } else {
        payload.billingInterval = normalizeInterval(form.billingBase)
        payload.billingCount = Math.max(form.billingCount, 1)
      }
    }

    if (form.trialDays) {
      const trial = Number(form.trialDays)
      if (!Number.isNaN(trial) && trial >= 0) {
        payload.trialDays = trial
      }
    }

    if (form.registrationFee) {
      payload.registrationFee = toCents(form.registrationFee)
    }

    if (form.maxBillingCycles) {
      const cycles = Number(form.maxBillingCycles)
      if (!Number.isNaN(cycles) && cycles > 0) {
        payload.maxBillingCycles = cycles
      }
    }

    try {
      setLoading(true)
      const endpoint = plan ? `/api/plans/${plan.id}` : '/api/plans'
      const method = plan ? 'PATCH' : 'POST'
      const response = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Impossible de sauvegarder le plan')
      }

      setSuccess(true)
      onCompleted?.()
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inattendue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/70 p-4 backdrop-blur">
      <div className="relative w-full max-w-3xl rounded-2xl border border-[#B794F4]/40 bg-[#111016] p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg border border-transparent px-3 py-1 text-gray-500 transition-colors hover:border-[#B794F4]/40 hover:text-white"
        >
          ×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">{heading}</h2>
          <p className="mt-1 text-sm text-gray-400">Configure le prix affiché lors du checkout.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-[2fr,1fr]">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
                Nom du plan
              </label>
              <input
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                type="text"
                placeholder="Ex. Premium Mensuel"
                className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
                Devise
              </label>
              <select
                value={form.currency}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, currency: event.target.value === 'USD' ? 'USD' : 'EUR' }))
                }
                className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#B794F4]/30 bg-[#181421] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">Type de plan</p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, isFree: true, amount: '', model: 'one_time' }))}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    form.isFree
                      ? 'border-emerald-400 bg-emerald-500/10 text-emerald-200'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                  }`}
                >
                  <Lightning size={18} weight="bold" />
                  Gratuit
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      isFree: false,
                      model: prev.model === 'one_time' ? 'recurring' : prev.model
                    }))
                  }
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                    !form.isFree
                      ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                  }`}
                >
                  <Coins size={18} weight="bold" />
                  Payant
                </button>
              </div>

              {!form.isFree && (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs uppercase tracking-[0.25em] text-gray-400">Montant</label>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={form.amount}
                      onChange={(event) => setForm((prev) => ({ ...prev, amount: event.target.value }))}
                      placeholder="Ex. 24,99"
                      className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
                    />
                  </div>

                  <div className="rounded-lg border border-[#B794F4]/20 bg-[#14111c] p-3">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
                      Mode de facturation
                    </p>
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, model: 'one_time' }))}
                        className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                          form.model === 'one_time'
                            ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                            : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                        }`}
                      >
                        Paiement unique
                      </button>
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, model: 'recurring' }))}
                        className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] ${
                          form.model === 'recurring'
                            ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                            : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                        }`}
                      >
                        Abonnement
                      </button>
                    </div>

                    {form.model === 'recurring' && (
                      <div className="mt-4 flex gap-2">
                        <input
                          type="number"
                          min={1}
                          value={form.billingCount}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              billingCount: Math.max(Number(event.target.value) || 1, 1)
                            }))
                          }
                          className="w-20 rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
                        />
                        <select
                          value={form.billingBase}
                          onChange={(event) =>
                            setForm((prev) => ({
                              ...prev,
                              billingBase: (event.target.value as BillingBase) ?? 'month'
                            }))
                          }
                          className="flex-1 rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
                        >
                          {billingBaseOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="rounded-xl border border-[#B794F4]/30 bg-[#181421] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">Récapitulatif</p>
              <p className="mt-3 text-lg font-semibold text-white">{preview}</p>
              <ul className="mt-4 space-y-2 text-xs text-gray-400">
                <li className="flex items-center gap-2">
                  <CalendarBlank size={16} className="text-purple-300" />
                  Trial (jours)&nbsp;
                  <input
                    type="number"
                    min={0}
                    value={form.trialDays}
                    onChange={(event) => setForm((prev) => ({ ...prev, trialDays: event.target.value }))}
                    className="w-20 rounded border border-[#B794F4]/20 bg-transparent px-2 py-1 text-xs text-white outline-none focus:border-[#B794F4]"
                  />
                </li>
                {!form.isFree && (
                  <li className="flex items-center gap-2">
                    <ArrowClockwise size={16} className="text-purple-300" />
                    Frais initiaux&nbsp;
                    <input
                      type="text"
                      value={form.registrationFee}
                      onChange={(event) => setForm((prev) => ({ ...prev, registrationFee: event.target.value }))}
                      placeholder="0,00"
                      className="w-24 rounded border border-[#B794F4]/20 bg-transparent px-2 py-1 text-xs text-white outline-none focus:border-[#B794F4]"
                    />
                  </li>
                )}
                {form.model === 'recurring' && (
                  <li className="flex items-center gap-2">
                    <SpinnerGap size={16} className="text-purple-300" />
                    Limite de renouvellements&nbsp;
                    <input
                      type="number"
                      min={0}
                      value={form.maxBillingCycles}
                      onChange={(event) => setForm((prev) => ({ ...prev, maxBillingCycles: event.target.value }))}
                      placeholder="illimité"
                      className="w-24 rounded border border-[#B794F4]/20 bg-transparent px-2 py-1 text-xs text-white outline-none focus:border-[#B794F4]"
                    />
                  </li>
                )}
              </ul>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#2a1a20] px-4 py-3 text-sm text-[#F87171]">
              <WarningCircle size={18} weight="bold" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              <Check size={18} weight="bold" />
              <span>Tarif enregistré.</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#B794F4]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-[#B794F4]/50 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B794F4] bg-purple-400/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B794F4] transition-colors hover:bg-purple-400/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <SpinnerGap size={16} className="animate-spin" /> : <Check size={16} weight="bold" />}
              {actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
