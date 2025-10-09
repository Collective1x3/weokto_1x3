'use client'

import { useCallback } from 'react'
import * as Icons from 'phosphor-react'

interface VideoPlayerProps {
  embedUrl: string | null
  onComplete?: () => void
}

export function VideoPlayer({ embedUrl, onComplete }: VideoPlayerProps) {
  const handleCompleteClick = useCallback(() => {
    onComplete?.()
  }, [onComplete])

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full border border-[#B794F4]/40 bg-black/80">
        {embedUrl ? (
          <iframe
            key={embedUrl}
            src={embedUrl}
            title="Lecteur vidéo"
            className="h-full w-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-[#B794F4]/60">
            <div className="flex items-center gap-2">
              <Icons.Warning size={18} className="text-[#FFB000]" />
              <span>Vidéo indisponible pour le moment.</span>
            </div>
          </div>
        )}
      </div>

      {onComplete && (
        <button
          onClick={handleCompleteClick}
          className="inline-flex items-center gap-2 border border-[#B794F4]/40 px-4 py-2 text-xs uppercase tracking-wide text-[#B794F4] hover:bg-[#B794F4]/10"
        >
          <Icons.CheckCircle size={14} /> Marquer le chapitre comme terminé
        </button>
      )}
    </div>
  )
}
