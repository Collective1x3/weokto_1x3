'use client'

import { FormEvent, useEffect, useState } from 'react'
import { Check, GlobeHemisphereWest, Lock, SpinnerGap, Warning } from 'phosphor-react'
import { useOrganisations } from '@/hooks/useOrganisation'

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  onCreated?: () => void
}

interface FormState {
  organisationId: string
  name: string
  description: string
  defaultCurrency: 'EUR' | 'USD'
  autoPageEnabled: boolean
  taxMode: 'inclusive' | 'exclusive'
}

const initialState: FormState = {
  organisationId: '',
  name: '',
  description: '',
  defaultCurrency: 'EUR',
  autoPageEnabled: true,
  taxMode: 'inclusive'
}

export function ProductModal({ isOpen, onClose, onCreated }: ProductModalProps) {
  const { organisations, isLoading: orgLoading } = useOrganisations()
  const [form, setForm] = useState<FormState>(initialState)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (organisations.length > 0 && !form.organisationId) {
      setForm((prev) => ({ ...prev, organisationId: organisations[0].id }))
    }
  }, [organisations, form.organisationId])

  if (!isOpen) {
    return null
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSuccess(false)

    if (!form.name.trim()) {
      setError('Renseigne un nom pour ton produit.')
      return
    }

    if (!form.organisationId) {
      setError('Sélectionne une organisation avant de créer le produit.')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          organisationId: form.organisationId,
          name: form.name.trim(),
          description: form.description.trim() || null,
          defaultCurrency: form.defaultCurrency,
          autoPageEnabled: form.autoPageEnabled,
          taxSetting: {
            taxMode: form.taxMode,
            collectVat: true
          }
        })
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error ?? 'Impossible de créer le produit')
      }

      setSuccess(true)
      setForm(initialState)
      onCreated?.()
      setTimeout(() => {
        setSuccess(false)
        onClose()
      }, 900)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création impossible')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl rounded-2xl border border-[#B794F4]/40 bg-[#111016] p-8 shadow-xl">
        <button
          type="button"
          onClick={() => {
            setForm(initialState)
            setError(null)
            setSuccess(false)
            onClose()
          }}
          className="absolute right-4 top-4 rounded-lg border border-transparent p-2 text-gray-500 transition-colors hover:border-[#B794F4]/40 hover:text-white"
        >
          <span className="sr-only">Fermer</span>×
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white">Nouveau produit</h2>
          <p className="mt-1 text-sm text-gray-400">Définis l’offre que tu souhaites vendre au sein de tes communautés.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
              Organisation
            </label>
            <div className="mt-2">
              {orgLoading ? (
                <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-3 text-sm text-gray-500">
                  Chargement des organisations…
                </div>
              ) : organisations.length === 0 ? (
                <div className="flex items-center gap-3 rounded-lg border border-[#EF4444]/40 bg-[#29191c] p-3 text-sm text-[#F87171]">
                  <Warning size={18} />
                  <span>Active ton organisation pour créer un produit.</span>
                </div>
              ) : (
                <select
                  value={form.organisationId}
                  onChange={(event) => setForm((prev) => ({ ...prev, organisationId: event.target.value }))}
                  className="w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
                >
                  {organisations.map((organisation) => (
                    <option key={organisation.id} value={organisation.id}>
                      {organisation.name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
                Nom du produit
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                placeholder="Ex. Accès Premium Guilde"
                className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
                Devise par défaut
              </label>
              <select
                value={form.defaultCurrency}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    defaultCurrency: event.target.value === 'USD' ? 'USD' : 'EUR'
                  }))
                }
                className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
              >
                <option value="EUR">EUR (€)</option>
                <option value="USD">USD ($)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Une description succincte affichée aux acheteurs."
              rows={3}
              className="mt-2 w-full rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] px-4 py-3 text-sm text-white outline-none transition-colors focus:border-[#B794F4]"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-[#B794F4]/20 bg-[#181421] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">Visibilité</p>
              <p className="mt-2 text-xs text-gray-400">
                Rendre public active la page d’achat automatique et le référencement interne.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, autoPageEnabled: true }))}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    form.autoPageEnabled
                      ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                  }`}
                >
                  <GlobeHemisphereWest size={16} weight="bold" />
                  Public
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, autoPageEnabled: false }))}
                  className={`flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    !form.autoPageEnabled
                      ? 'border-[#EF4444] bg-[#EF4444]/20 text-[#F87171]'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#F87171]/40 hover:text-[#F87171]'
                  }`}
                >
                  <Lock size={16} weight="bold" />
                  Privé
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-[#B794F4]/20 bg-[#181421] p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B794F4]/70">TVA</p>
              <p className="mt-2 text-xs text-gray-400">
                Inclusive signifie que la TVA est déjà comprise dans le prix affiché. Exclusive ajoute la TVA au moment du paiement.
              </p>
              <div className="mt-4 flex gap-2">
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, taxMode: 'inclusive' }))}
                  className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    form.taxMode === 'inclusive'
                      ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                  }`}
                >
                  TVA incluse
                </button>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, taxMode: 'exclusive' }))}
                  className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors ${
                    form.taxMode === 'exclusive'
                      ? 'border-[#B794F4] bg-purple-400/20 text-[#B794F4]'
                      : 'border-[#B794F4]/30 text-gray-400 hover:border-[#B794F4]/50 hover:text-white'
                  }`}
                >
                  TVA ajoutée
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-lg border border-[#EF4444]/40 bg-[#2a1a20] px-4 py-3 text-sm text-[#F87171]">
              <Warning size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              <Check size={18} weight="bold" />
              <span>Produit créé, redirection en cours…</span>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setForm(initialState)
                setError(null)
                onClose()
              }}
              className="rounded-lg border border-[#B794F4]/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400 transition-colors hover:border-[#B794F4]/50 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading || orgLoading || organisations.length === 0}
              className="inline-flex items-center gap-2 rounded-lg border border-[#B794F4] bg-purple-400/20 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#B794F4] transition-colors hover:bg-purple-400/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? <SpinnerGap className="animate-spin" size={16} /> : <Check size={16} weight="bold" />}
              Créer
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
