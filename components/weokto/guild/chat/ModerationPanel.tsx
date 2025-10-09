'use client'

import { useEffect, useState } from 'react'
import * as Icons from 'phosphor-react'
import type { RestrictionType } from '@/hooks/useGuildModeration'

interface ModerationPanelProps {
  isOpen: boolean
  onClose: () => void
  target: {
    userId: string
    displayName?: string | null
  } | null
  restrictions: Array<{
    id: string
    type: RestrictionType
    scope: 'GUILD' | 'CHANNEL'
    expires_at?: string | null
    created_at: string
    reason?: string | null
  }>
  onApply: (payload: {
    type: RestrictionType
    duration_minutes?: number | null
    reason?: string | null
  }) => Promise<void>
  onLift: (payload: { type: RestrictionType }) => Promise<void>
}

const QUICK_DURATIONS = [
  { label: '10 min', minutes: 10 },
  { label: '1 h', minutes: 60 },
  { label: '24 h', minutes: 60 * 24 }
]

export default function ModerationPanel({ isOpen, onClose, target, restrictions, onApply, onLift }: ModerationPanelProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customDuration, setCustomDuration] = useState<number | ''>('')
  const [reason, setReason] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setReason('')
      setCustomDuration('')
    }
  }, [isOpen])

  if (!isOpen || !target) return null

  const activeByType = (type: RestrictionType) =>
    restrictions.filter((restriction) => restriction.type === type)

  const handleApply = async (type: RestrictionType, duration: number | null) => {
    setIsSubmitting(true)
    try {
      await onApply({
        type,
        duration_minutes: duration ?? undefined,
        reason: reason || undefined
      })
      setReason('')
      setCustomDuration('')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLift = async (type: RestrictionType) => {
    setIsSubmitting(true)
    try {
      await onLift({ type })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderActiveBadge = (type: RestrictionType) => {
    const active = activeByType(type)
    if (active.length === 0) return null
    return (
      <div className="flex flex-col gap-1 bg-black/60 border border-[#FF4B4B]/40 p-2 text-xs text-[#FF4B4B] uppercase tracking-[0.3em]">
        {active.map((item) => (
          <div key={item.id} className="flex flex-col gap-1 border border-[#FF4B4B]/20 p-2">
            <div className="flex items-center justify-between gap-3">
              <span>
                Actif {item.expires_at ? `jusqu'au ${new Date(item.expires_at).toLocaleString('fr-FR')}` : '(permanent)'}
              </span>
              <button
                onClick={() => handleLift(type)}
                disabled={isSubmitting}
                className="text-[#B794F4] hover:text-[#FFB000]"
              >
                Lever
              </button>
            </div>
            {item.reason && (
              <p className="text-[10px] normal-case text-[#FFB000]">Raison : {item.reason}</p>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md bg-black border-2 border-[#B794F4] shadow-lg">
        <div className="flex items-center justify-between border-b border-[#B794F4]/40 px-4 py-3">
          <div>
            <p className="text-xs text-[#B794F4]/60 uppercase tracking-[0.3em]">Modération</p>
            <p className="text-white font-semibold tracking-wide">
              {target.displayName || target.userId}
            </p>
          </div>
          <button onClick={onClose} className="text-[#B794F4] hover:text-[#FFB000]">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="px-4 py-3 space-y-4">
          <div>
            <label className="text-xs text-[#B794F4]/60 uppercase tracking-[0.3em]">Raison (facultatif)</label>
            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              rows={2}
              placeholder="Note interne..."
              className="mt-1 w-full bg-black border border-[#B794F4]/40 text-white text-sm px-3 py-2 focus:border-[#FFB000] outline-none"
            />
          </div>

          <div className="grid gap-3">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.SpeakerSlash size={16} className="text-[#FFB000]" />
                <span className="text-sm text-white font-semibold uppercase tracking-[0.3em]">Mute</span>
              </div>
              {renderActiveBadge('MUTE')}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_DURATIONS.map((duration) => (
                  <button
                    key={duration.label}
                    disabled={isSubmitting}
                    onClick={() => handleApply('MUTE', duration.minutes)}
                    className="px-3 py-1 border border-[#B794F4]/40 text-xs uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
                  >
                    {duration.label}
                  </button>
                ))}
                <button
                  disabled={isSubmitting}
                  onClick={() => handleApply('MUTE', null)}
                  className="px-3 py-1 border border-[#FF4B4B]/50 text-xs uppercase tracking-[0.3em] text-[#FF4B4B] hover:text-[#FFB000]"
                >
                  Permanent
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.EyeSlash size={16} className="text-[#FFB000]" />
                <span className="text-sm text-white font-semibold uppercase tracking-[0.3em]">Rendre aveugle</span>
              </div>
              {renderActiveBadge('BLIND')}
              <div className="flex flex-wrap gap-2 mt-2">
                {QUICK_DURATIONS.map((duration) => (
                  <button
                    key={duration.label}
                    disabled={isSubmitting}
                    onClick={() => handleApply('BLIND', duration.minutes)}
                    className="px-3 py-1 border border-[#B794F4]/40 text-xs uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
                  >
                    {duration.label}
                  </button>
                ))}
                <button
                  disabled={isSubmitting}
                  onClick={() => handleApply('BLIND', null)}
                  className="px-3 py-1 border border-[#FF4B4B]/50 text-xs uppercase tracking-[0.3em] text-[#FF4B4B] hover:text-[#FFB000]"
                >
                  Permanent
                </button>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Icons.UserSwitch size={16} className="text-[#FF4B4B]" />
                <span className="text-sm text-white font-semibold uppercase tracking-[0.3em]">Bannir</span>
              </div>
              {renderActiveBadge('BAN')}
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  disabled={isSubmitting}
                  onClick={() => handleApply('BAN', 60 * 24)}
                  className="px-3 py-1 border border-[#B794F4]/40 text-xs uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
                >
                  24 h
                </button>
                <button
                  disabled={isSubmitting}
                  onClick={() => handleApply('BAN', null)}
                  className="px-3 py-1 border border-[#FF4B4B]/60 text-xs uppercase tracking-[0.3em] text-[#FF4B4B] hover:text-[#FFB000]"
                >
                  Permanent
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="text-xs text-[#B794F4]/60 uppercase tracking-[0.3em]">Durée personnalisée (minutes)</label>
            <div className="flex gap-2 mt-1">
              <input
                type="number"
                min={1}
                max={60 * 24 * 30}
                value={customDuration}
                onChange={(event) => setCustomDuration(event.target.value === '' ? '' : Number(event.target.value))}
                className="flex-1 bg-black border border-[#B794F4]/40 text-white text-sm px-3 py-2 focus:border-[#FFB000] outline-none"
              />
              <button
                disabled={isSubmitting || customDuration === ''}
                onClick={() => handleApply('MUTE', typeof customDuration === 'number' ? customDuration : null)}
                className="px-3 py-2 border border-[#B794F4]/40 text-xs uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
              >
                Muter
              </button>
              <button
                disabled={isSubmitting || customDuration === ''}
                onClick={() => handleApply('BLIND', typeof customDuration === 'number' ? customDuration : null)}
                className="px-3 py-2 border border-[#B794F4]/40 text-xs uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
              >
                Aveugler
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
