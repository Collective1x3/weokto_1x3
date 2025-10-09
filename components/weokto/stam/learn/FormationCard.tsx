import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { ArrowRight } from '@phosphor-icons/react/dist/ssr'

interface FormationCardProps {
  href: string
  title: string
  subtitle?: string | null
  coverImageUrl?: string | null
  estimatedMinutes?: number
  progressPercentage?: number
  statusLabel?: ReactNode
  tagLabel?: string
}

export function FormationCard({
  href,
  title,
  subtitle,
  coverImageUrl,
  estimatedMinutes,
  progressPercentage,
  statusLabel,
  tagLabel
}: FormationCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-[0_20px_50px_-20px_rgba(28,25,23,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_-20px_rgba(28,25,23,0.18)]"
    >
      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-amber-50 via-emerald-50 to-stone-100">
        {coverImageUrl ? (
          <Image
            src={coverImageUrl}
            alt={`Visuel de la formation ${title}`}
            fill
            sizes="(min-width: 768px) 320px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="text-sm font-semibold uppercase tracking-[0.3em] text-stone-400">
              Formation
            </span>
          </div>
        )}

        {tagLabel && (
          <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            {tagLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-6">
        <div>
          <h3 className="text-lg font-semibold text-stone-900">{title}</h3>
          {subtitle && <p className="mt-1 text-sm text-stone-600">{subtitle}</p>}
        </div>

        <div className="space-y-4">
          {estimatedMinutes !== undefined && estimatedMinutes > 0 && (
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
              <span>Durée estimée</span>
              <span className="rounded-full bg-stone-100 px-2 py-0.5 text-stone-600">
                ~{estimatedMinutes} min
              </span>
            </div>
          )}

          {progressPercentage !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-medium text-stone-500">
                <span>Progression</span>
                <span className="font-semibold text-emerald-600">
                  {progressPercentage}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-500"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          )}

          {statusLabel && (
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
              {statusLabel}
            </div>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-sm font-semibold text-emerald-600 transition-colors duration-300 group-hover:text-emerald-700">
            Découvrir la formation
          </span>
          <ArrowRight
            size={20}
            weight="bold"
            className="text-emerald-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-emerald-600"
          />
        </div>
      </div>
    </Link>
  )
}
