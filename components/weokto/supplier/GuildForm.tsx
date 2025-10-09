'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as Icons from 'phosphor-react'
import { createGuildSchema, CreateGuildInput } from '@/lib/validations/guild'

interface GuildFormProps {
  organisationId: string
  mode: 'create' | 'edit'
  initialData?: Partial<CreateGuildInput>
  onSuccess: (guild: any) => void
  onCancel?: () => void
}

export function GuildForm({ organisationId, mode, initialData, onSuccess, onCancel }: GuildFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<CreateGuildInput>({
    resolver: zodResolver(createGuildSchema),
    defaultValues: {
      organisationId,
      ...initialData,
    },
  })

  const onSubmit = async (data: CreateGuildInput) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = mode === 'create'
        ? '/api/supplier/guilds'
        : `/api/supplier/guilds/${initialData?.slug}`

      const res = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Une erreur est survenue')
      }

      const result = await res.json()
      onSuccess(result.guild)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const generateSlug = () => {
    const name = watch('name')
    if (name) {
      return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    }
    return ''
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <div className="rounded-lg border border-[#EF4444]/30 bg-[#EF4444]/10 p-4">
          <div className="flex gap-3">
            <Icons.Warning size={20} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#EF4444]">{error}</p>
          </div>
        </div>
      )}

      <input type="hidden" {...register('organisationId')} value={organisationId} />

      <div>
        <label className="block text-xs text-[#B794F4] mb-2 uppercase tracking-wide">
          {'>'} NOM DE LA GUILDE
        </label>
        <input
          {...register('name')}
          type="text"
          className="w-full px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white font-mono focus:outline-none focus:border-[#B794F4] transition-colors duration-200 placeholder:text-gray-500 text-sm"
          placeholder="Ma Super Guilde"
        />
        {errors.name && <p className="mt-1 text-xs text-[#EF4444]">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-xs text-[#B794F4] mb-2 uppercase tracking-wide">
          {'>'} SLUG (URL)
        </label>
        <div className="flex gap-2">
          <input
            {...register('slug')}
            type="text"
            className="flex-1 px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white font-mono focus:outline-none focus:border-[#B794F4] transition-colors duration-200 placeholder:text-gray-500 text-sm"
            placeholder="ma-super-guilde"
          />
          <button
            type="button"
            onClick={() => {
              const slug = generateSlug()
              setValue('slug', slug)
            }}
            className="px-4 py-3 rounded border border-[#B794F4]/40 text-[#B794F4] hover:bg-purple-400/10 transition-all duration-200 text-xs font-bold"
          >
            AUTO
          </button>
        </div>
        {errors.slug && <p className="mt-1 text-xs text-[#EF4444]">{errors.slug.message}</p>}
        <p className="mt-1 text-xs text-gray-500">
          Le slug sera utilisé dans l'URL : /guilds/votre-slug
        </p>
      </div>

      <div>
        <label className="block text-xs text-[#B794F4] mb-2 uppercase tracking-wide">
          {'>'} DESCRIPTION (OPTIONNEL)
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white font-mono focus:outline-none focus:border-[#B794F4] transition-colors duration-200 placeholder:text-gray-500 text-sm resize-none"
          placeholder="Décrivez votre guilde..."
        />
        {errors.description && (
          <p className="mt-1 text-xs text-[#EF4444]">{errors.description.message}</p>
        )}
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-4 rounded-lg bg-purple-400/10 text-[#B794F4] hover:bg-purple-400/20 transition-all duration-200 font-bold text-sm border border-[#B794F4]/40 hover:border-[#B794F4] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Icons.CircleNotch size={20} className="animate-spin" />
              {mode === 'create' ? '[CRÉATION...]' : '[MISE À JOUR...]'}
            </span>
          ) : mode === 'create' ? (
            '[CRÉER LA GUILDE]'
          ) : (
            '[METTRE À JOUR]'
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-4 rounded-lg border border-[#B794F4]/20 text-gray-400 hover:text-white hover:bg-purple-400/10 transition-all duration-200 font-bold text-sm"
          >
            [ANNULER]
          </button>
        )}
      </div>
    </form>
  )
}
