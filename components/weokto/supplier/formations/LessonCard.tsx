'use client'

import { useState } from 'react'
import * as Icons from 'phosphor-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  bunnyVideoId: string | null
  bunnyLibraryId: string | null
  videoDuration: number | null
  thumbnailUrl: string | null
  videoStatus: string
  isFree: boolean
  position: number
}

interface LessonCardProps {
  lesson: Lesson
  slug: string
  moduleId: string
  onDelete: () => void
  onRefresh: () => void
}

export function LessonCard({ lesson, slug, moduleId, onDelete, onRefresh }: LessonCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [editTitle, setEditTitle] = useState(lesson.title)
  const [editDescription, setEditDescription] = useState(lesson.description || '')

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleToggleFree = async () => {
    setIsUpdating(true)

    try {
      const res = await fetch(`/api/supplier/guilds/${slug}/formations/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFree: !lesson.isFree }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Échec de la mise à jour')
      }

      onRefresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleSaveEdit = async () => {
    setIsUpdating(true)

    try {
      const res = await fetch(`/api/supplier/guilds/${slug}/formations/lessons/${lesson.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription || null,
        }),
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Échec de la mise à jour')
      }

      setIsEditing(false)
      onRefresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erreur lors de la mise à jour')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleCancelEdit = () => {
    setEditTitle(lesson.title)
    setEditDescription(lesson.description || '')
    setIsEditing(false)
  }

  const getStatusColor = () => {
    switch (lesson.videoStatus) {
      case 'ready':
        return 'text-[#10B981]'
      case 'processing':
        return 'text-[#FFB000]'
      case 'error':
        return 'text-[#EF4444]'
      default:
        return 'text-[#B794F4]'
    }
  }

  const getStatusIcon = () => {
    switch (lesson.videoStatus) {
      case 'ready':
        return <Icons.CheckCircle size={16} weight="fill" className="text-[#10B981]" />
      case 'processing':
        return <Icons.CircleNotch size={16} className="animate-spin text-[#FFB000]" />
      case 'error':
        return <Icons.XCircle size={16} weight="fill" className="text-[#EF4444]" />
      default:
        return <Icons.Clock size={16} className="text-[#B794F4]" />
    }
  }

  const getStatusText = () => {
    switch (lesson.videoStatus) {
      case 'ready':
        return 'Prête'
      case 'processing':
        return 'Traitement...'
      case 'error':
        return 'Erreur'
      default:
        return 'En attente'
    }
  }

  if (isEditing) {
    return (
      <div className="border-2 border-[#FFB000] bg-black/90 p-4 font-mono">
        <div className="flex items-center gap-2 mb-4">
          <Icons.PencilSimple size={20} className="text-[#FFB000]" />
          <h4 className="text-sm font-bold text-white">MODIFIER LA LEÇON</h4>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-white mb-2">TITRE</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              disabled={isUpdating}
              className="w-full px-3 py-2 bg-black border-2 border-[#B794F4] text-white text-sm focus:border-[#FFB000] focus:outline-none transition-colors disabled:opacity-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-white mb-2">DESCRIPTION</label>
            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              disabled={isUpdating}
              rows={3}
              className="w-full px-3 py-2 bg-black border-2 border-[#B794F4] text-white text-sm focus:border-[#FFB000] focus:outline-none transition-colors resize-none disabled:opacity-50"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCancelEdit}
              disabled={isUpdating}
              className="flex-1 px-4 py-2 border-2 border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4]/10 transition-colors text-xs font-bold disabled:opacity-50"
            >
              ANNULER
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isUpdating || !editTitle.trim()}
              className="flex-1 px-4 py-2 bg-[#B794F4] text-white hover:bg-[#FFB000] transition-colors text-xs font-bold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isUpdating ? (
                <>
                  <Icons.CircleNotch size={14} className="animate-spin" />
                  SAUVEGARDE...
                </>
              ) : (
                <>
                  <Icons.FloppyDisk size={14} />
                  SAUVEGARDER
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border-2 border-[#B794F4] bg-black/90 p-4 font-mono hover:bg-[#B794F4]/5 transition-colors">
      <div className="flex gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          {lesson.thumbnailUrl ? (
            <div className="relative">
              <img
                src={lesson.thumbnailUrl}
                alt={lesson.title}
                className="w-32 h-20 object-cover border border-[#B794F4]"
              />
              {lesson.videoDuration && (
                <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs font-bold">
                  {formatDuration(lesson.videoDuration)}
                </div>
              )}
            </div>
          ) : (
            <div className="w-32 h-20 border border-[#B794F4] bg-[#B794F4]/10 flex items-center justify-center">
              <Icons.VideoCamera size={32} className="text-[#B794F4]" />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <Icons.PlayCircle size={18} className="text-[#FFB000] flex-shrink-0" />
                <h3 className="text-white font-bold text-sm truncate">{lesson.title}</h3>
              </div>
              {lesson.description && (
                <p className="text-[#B794F4]/60 text-xs line-clamp-2 mb-2">
                  {lesson.description}
                </p>
              )}
            </div>
          </div>

          {/* Stats & Badges */}
          <div className="flex items-center gap-3 mb-3 text-xs">
            <div className={`flex items-center gap-1 ${getStatusColor()}`}>
              {getStatusIcon()}
              <span>{getStatusText()}</span>
            </div>

            {lesson.isFree && (
              <span className="px-2 py-0.5 bg-[#10B981]/20 text-[#10B981] font-bold">
                GRATUIT
              </span>
            )}

            {lesson.videoDuration && (
              <div className="flex items-center gap-1 text-[#B794F4]/60">
                <Icons.Clock size={12} />
                <span>{formatDuration(lesson.videoDuration)}</span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4]/10 transition-colors text-xs font-bold"
            >
              <Icons.PencilSimple size={14} className="inline mr-1" />
              MODIFIER
            </button>

            <button
              onClick={handleToggleFree}
              disabled={isUpdating}
              className={`px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50 ${
                lesson.isFree
                  ? 'border border-[#FFB000] text-[#FFB000] hover:bg-[#FFB000] hover:text-black'
                  : 'bg-[#10B981] text-white hover:bg-[#10B981]/80'
              }`}
            >
              {isUpdating ? (
                <Icons.CircleNotch size={14} className="inline animate-spin" />
              ) : lesson.isFree ? (
                <>
                  <Icons.Lock size={14} className="inline mr-1" />
                  RENDRE PAYANT
                </>
              ) : (
                <>
                  <Icons.Gift size={14} className="inline mr-1" />
                  RENDRE GRATUIT
                </>
              )}
            </button>

            <button
              onClick={onDelete}
              className="px-3 py-1.5 border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors text-xs font-bold"
            >
              <Icons.Trash size={14} className="inline mr-1" />
              SUPPRIMER
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}