'use client'

import Link from 'next/link'
import * as Icons from 'phosphor-react'
import clsx from 'clsx'
import { ProgressBar } from './ProgressBar'

interface FormationCardData {
  id: string
  title: string
  description: string | null
  sectionsCount: number
  chaptersCount: number
  progressPercent: number
  completedChapters: number
  nextChapterId: string | null
  firstChapterId: string | null
  previewThumbnail: string | null
  isCompleted: boolean
  lastActivity: string | null
}

interface FormationCardProps {
  formation: FormationCardData
}

export function FormationModuleCard({ formation }: FormationCardProps) {
  const continueChapterId = formation.nextChapterId ?? formation.firstChapterId
  const continueHref = continueChapterId ? `/guild/formation/chapters/${continueChapterId}` : '#'
  const lastActivity = formation.lastActivity
    ? new Intl.DateTimeFormat('fr-FR', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(formation.lastActivity))
    : null

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e] p-4 transition-all duration-200 hover:border-[#B794F4]/60 hover:bg-purple-400/5 md:flex-row">
      <div className="w-full overflow-hidden rounded-lg border border-[#B794F4]/20 bg-black/60 md:w-64">
        <div className="aspect-video w-full bg-black/80">
          {formation.previewThumbnail ? (
            <img
              src={formation.previewThumbnail}
              alt={`Aperçu de ${formation.title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1e1e1e] via-purple-900/20 to-[#0f172a] text-gray-500 text-xs uppercase tracking-wide">
              <Icons.FilmSlate size={24} className="text-purple-400/60" />
              Aucun aperçu
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Icons.GraduationCap size={24} className="mt-1 text-purple-400" />
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{formation.title}</h3>
              {formation.description && (
                <p className="text-xs text-gray-400 line-clamp-2">{formation.description}</p>
              )}
            </div>
          </div>
          {formation.isCompleted && (
            <span className="rounded px-2 py-0.5 text-xs uppercase text-[#10B981] border border-[#10B981]/40">
              Terminée
            </span>
          )}
        </div>

        <div className="space-y-3 rounded-lg border border-[#B794F4]/20 bg-black/40 p-4">
          <div className="flex flex-wrap gap-3 text-xs text-gray-400">
            <span className="inline-flex items-center gap-1">
              <Icons.StackSimple size={14} className="text-purple-400" /> {formation.sectionsCount} catégories
            </span>
            <span className="inline-flex items-center gap-1">
              <Icons.BookOpen size={14} className="text-purple-400" /> {formation.chaptersCount} modules
            </span>
          </div>
          <ProgressBar percentage={formation.progressPercent} />
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {formation.completedChapters} / {formation.chaptersCount} modules terminés
            </span>
            <span className="text-purple-400 font-bold">{formation.progressPercent}%</span>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            href={continueHref}
            className={clsx(
              'inline-flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all duration-200',
              continueHref === '#'
                ? 'cursor-not-allowed border-purple-400/30 text-gray-500'
                : 'border-purple-400 bg-purple-400 text-black hover:bg-purple-400/80'
            )}
          >
            <Icons.Play size={16} /> Regarder la formation
          </Link>
        </div>

        <div className="flex flex-col gap-1 text-xs text-gray-500 text-center">
          <span>{formation.isCompleted ? 'Formation terminée - bravo !' : 'Reprends là où tu t\'es arrêté.'}</span>
          {lastActivity && <span>Dernière activité : {lastActivity}</span>}
        </div>
      </div>
    </div>
  )
}
