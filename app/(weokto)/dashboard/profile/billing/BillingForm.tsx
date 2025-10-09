'use client'

import { useFormState, useFormStatus } from 'react-dom'

interface FormState {
  status: 'idle' | 'success' | 'error'
  message?: string | null
}

const initialState: FormState = { status: 'idle', message: null }

interface BillingFormProps {
  customerId: string
  productName?: string | null
  initial?: {
    country?: string | null
    state?: string | null
    city?: string | null
    postalCode?: string | null
    street?: string | null
    vatNumber?: string | null
    taxExempt?: boolean | null
  }
  action: (state: FormState, formData: FormData) => Promise<FormState>
}

const COUNTRIES = ['FR', 'BE', 'CH', 'LU', 'CA', 'US', 'GB', 'DE', 'ES', 'IT', 'NL', 'PT']

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200 transition hover:bg-emerald-500/20 disabled:opacity-50"
    >
      {pending ? 'Enregistrement…' : 'Enregistrer'}
    </button>
  )
}

export function BillingForm({ customerId, productName, initial, action }: BillingFormProps) {
  const [state, formAction] = useFormState(action, initialState)

  return (
    <form action={formAction} className="space-y-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <input type="hidden" name="customerId" value={customerId} />

      <header className="space-y-1">
        <h2 className="text-lg font-semibold text-slate-100">{productName ?? 'Client'}</h2>
        <p className="text-xs text-slate-500">
          Adresse de facturation et informations TVA utilisées pour les factures de ce produit.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span>Pays</span>
          <select
            name="country"
            defaultValue={initial?.country ?? 'FR'}
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
            required
          >
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span>Région / État</span>
          <input
            name="state"
            defaultValue={initial?.state ?? ''}
            placeholder="Île-de-France"
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span>Ville</span>
          <input
            name="city"
            defaultValue={initial?.city ?? ''}
            placeholder="Paris"
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span>Code postal</span>
          <input
            name="postalCode"
            defaultValue={initial?.postalCode ?? ''}
            placeholder="75008"
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
            required
          />
        </label>

        <label className="md:col-span-2 flex flex-col gap-1 text-sm text-slate-300">
          <span>Adresse</span>
          <input
            name="street"
            defaultValue={initial?.street ?? ''}
            placeholder="10 avenue des Champs-Élysées"
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-sm text-slate-300">
          <span>Numéro de TVA (optionnel)</span>
          <input
            name="vatNumber"
            defaultValue={initial?.vatNumber ?? ''}
            placeholder="FR12345678901"
            className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-100 focus:border-purple-400/60 focus:outline-none"
          />
        </label>

        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            name="taxExempt"
            defaultChecked={initial?.taxExempt ?? false}
            className="h-4 w-4 rounded border border-slate-700 bg-slate-900/80 text-purple-400 focus:ring-purple-400"
          />
          Entreprise exonérée de TVA
        </label>
      </div>

      <div className="flex items-center justify-between">
        {state.status !== 'idle' && state.message && (
          <span
            className={`text-sm ${state.status === 'success' ? 'text-emerald-300' : 'text-rose-300'}`}
          >
            {state.message}
          </span>
        )}
        <SubmitButton />
      </div>
    </form>
  )
}
