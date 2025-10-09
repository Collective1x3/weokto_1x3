'use client'

import { useState } from 'react'
import Link from 'next/link'
import * as Icons from 'phosphor-react'

interface Module {
  id: string
  title: string
  description: string | null
  isPublished: boolean
  position: number
  lessons: Array<{
    id: string
    videoDuration: number | null
  }>
  _count: {
    lessons: number
  }
}

interface ModuleCardProps {
  module: Module
  slug: string
  onEdit: () => void
  onDelete: () => void
  onRefresh: () => void
}

export function ModuleCard({ module, slug, onEdit, onDelete, onRefresh }: ModuleCardProps) {
  const [isTogglingPublish, setIsTogglingPublish] = useState(false)

  const totalDuration = module.lessons?.reduce((acc, lesson) => acc + (lesson.videoDuration || 0), 0) || 0
  const hours = Math.floor(totalDuration / 3600)
  const minutes = Math.floor((totalDuration % 3600) / 60)

  const handleTogglePublish = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsTogglingPublish(true)

    try {
      const res = await fetch(`/api/supplier/guilds/${slug}/formations/modules/${module.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !module.isPublished }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Échec de la mise à jour')
      }

      onRefresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setIsTogglingPublish(false)
    }
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onEdit()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onDelete()
  }

  return (
    <Link href={`/supplier/guilds/${slug}/formations/modules/${module.id}`}>
      <div className="border-2 border-[#B794F4] bg-black/90 hover:bg-[#B794F4]/5 transition-all p-4 h-full flex flex-col font-mono">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Icons.BookOpen size={20} className="text-[#FFB000] flex-shrink-0" />
            <h3 className="text-white font-bold text-sm truncate">{module.title}</h3>
          </div>
          <div className="flex items-center gap-2 ml-2">
            {module.isPublished ? (
              <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] text-xs font-bold whitespace-nowrap">
                PUBLIÉ
              </span>
            ) : (
              <span className="px-2 py-0.5 bg-[#FFB000]/20 text-[#FFB000] text-xs font-bold whitespace-nowrap">
                BROUILLON
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        {module.description && (
          <p className="text-[#B794F4]/60 text-xs mb-3 line-clamp-2 flex-1">
            {module.description}
          </p>
        )}

        {/* Stats */}
        <div className="border-t border-[#B794F4]/20 pt-3 mb-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5">
              <Icons.VideoCamera size={14} className="text-[#B794F4]" />
              <span className="text-[#B794F4]/60">
                {module._count.lessons} {module._count.lessons > 1 ? 'leçons' : 'leçon'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Icons.Clock size={14} className="text-[#B794F4]" />
              <span className="text-[#B794F4]/60">
                {totalDuration > 0 ? (
                  <>
                    {hours > 0 && `${hours}h `}
                    {minutes}min
                  </>
                ) : (
                  '0min'
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePublish}
            disabled={isTogglingPublish}
            className={`flex-1 px-3 py-2 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              module.isPublished
                ? 'border border-[#FFB000] text-[#FFB000] hover:bg-[#FFB000] hover:text-black'
                : 'bg-[#10B981] text-white hover:bg-[#10B981]/80'
            }`}
          >
            {isTogglingPublish ? (
              <Icons.CircleNotch size={14} className="inline animate-spin" />
            ) : module.isPublished ? (
              <>
                <Icons.EyeSlash size={14} className="inline mr-1" />
                CACHER
              </>
            ) : (
              <>
                <Icons.Eye size={14} className="inline mr-1" />
                PUBLIER
              </>
            )}
          </button>

          <button
            onClick={handleEdit}
            className="px-3 py-2 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4]/10 transition-colors"
            title="Modifier"
          >
            <Icons.PencilSimple size={14} />
          </button>

          <button
            onClick={handleDelete}
            className="px-3 py-2 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors"
            title="Supprimer"
          >
            <Icons.Trash size={14} />
          </button>
        </div>
      </div>
    </Link>
  )
}