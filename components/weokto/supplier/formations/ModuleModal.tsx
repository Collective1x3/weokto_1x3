'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import * as Icons from 'phosphor-react'

const moduleSchema = z.object({
  title: z.string().min(3, 'Le titre doit contenir au moins 3 caractères').max(100),
  description: z.string().max(500).optional(),
  isPublished: z.boolean().optional(),
})

type ModuleFormData = z.infer<typeof moduleSchema>

interface ModuleModalProps {
  slug: string
  module?: {
    id: string
    title: string
    description: string | null
    isPublished: boolean
  } | null
  onClose: () => void
  onSuccess: () => void
}

export function ModuleModal({ slug, module, onClose, onSuccess }: ModuleModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isEditing = !!module

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ModuleFormData>({
    defaultValues: {
      title: module?.title || '',
      description: module?.description || '',
      isPublished: module?.isPublished || false,
    },
  })

  const isPublished = watch('isPublished')

  const onSubmit = async (data: ModuleFormData) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const url = isEditing
        ? `/api/supplier/guilds/${slug}/formations/modules/${module.id}`
        : `/api/supplier/guilds/${slug}/formations/modules`

      const method = isEditing ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Échec de la sauvegarde du module')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isSubmitting, onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="rounded-2xl border border-[#B794F4] bg-[#1e1e1e] w-full max-w-2xl max-h-[90vh] overflow-y-auto font-mono">
        {/* Header */}
        <div className="border-b border-[#B794F4]/20 p-6 flex items-center justify-between sticky top-0 bg-[#1e1e1e] z-10">
          <div className="flex items-center gap-3">
            <Icons.BookOpen size={24} className="text-purple-400" />
            <h2 className="text-xl font-bold text-white">
              {isEditing ? 'MODIFIER LE MODULE' : 'NOUVEAU MODULE'}
            </h2>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-gray-400 hover:text-white transition-colors duration-200 disabled:opacity-50"
          >
            <Icons.X size={24} weight="bold" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-lg border border-[#EF4444] bg-[#EF4444]/10 p-4">
              <div className="flex gap-3">
                <Icons.Warning size={20} className="text-[#EF4444] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-[#EF4444] mb-1">ERREUR</p>
                  <p className="text-sm text-[#EF4444]/80">{error}</p>
                </div>
              </div>
            </div>
          )}

          {/* Title Field */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-bold text-white mb-2">
              TITRE DU MODULE *
            </label>
            <input
              id="title"
              type="text"
              {...register('title')}
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white focus:border-[#B794F4] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
              placeholder="Ex: Introduction aux fondamentaux"
            />
            {errors.title && (
              <p className="mt-2 text-xs text-[#EF4444] flex items-center gap-1">
                <Icons.Warning size={12} />
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-bold text-white mb-2">
              DESCRIPTION
            </label>
            <textarea
              id="description"
              {...register('description')}
              disabled={isSubmitting}
              rows={4}
              className="w-full px-4 py-3 bg-[#1e1e1e] rounded border border-[#B794F4]/40 text-white focus:border-[#B794F4] focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-500"
              placeholder="Décrivez le contenu de ce module..."
            />
            {errors.description && (
              <p className="mt-2 text-xs text-[#EF4444] flex items-center gap-1">
                <Icons.Warning size={12} />
                {errors.description.message}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">
              Maximum 500 caractères
            </p>
          </div>

          {/* Published Toggle */}
          <div className="mb-6">
            <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icons.Eye size={20} className="text-purple-400" />
                <div>
                  <p className="text-sm font-bold text-white">Publier le module</p>
                  <p className="text-xs text-gray-500">
                    Rendre ce module visible aux membres
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setValue('isPublished', !isPublished)}
                disabled={isSubmitting}
                className={`relative w-12 h-6 rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isPublished ? 'bg-[#10B981]' : 'bg-purple-400/30'
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                    isPublished ? 'left-6' : 'left-0.5'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg border border-[#B794F4]/20 text-gray-400 hover:text-white hover:bg-purple-400/10 transition-all duration-200 font-bold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ANNULER
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 rounded-lg bg-purple-400/10 text-[#B794F4] hover:bg-purple-400/20 transition-all duration-200 font-bold border border-[#B794F4]/40 hover:border-[#B794F4] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Icons.CircleNotch size={20} className="animate-spin" />
                  ENREGISTREMENT...
                </>
              ) : (
                <>
                  <Icons.FloppyDisk size={20} />
                  {isEditing ? 'ENREGISTRER' : 'CRÉER LE MODULE'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}