'use client'

import * as Icons from 'phosphor-react'

interface UploadProgressBarProps {
  progress: number // 0-100
}

export function UploadProgressBar({ progress }: UploadProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-[#FFB000]">
          <Icons.CloudArrowUp size={14} />
          <span className="font-bold">UPLOAD EN COURS...</span>
        </div>
        <span className="text-white font-bold">{clampedProgress}%</span>
      </div>

      {/* Progress Bar Container */}
      <div className="relative w-full h-3 border-2 border-[#B794F4] bg-black overflow-hidden">
        {/* Progress Fill */}
        <div
          className="h-full transition-all duration-300 ease-out relative overflow-hidden"
          style={{
            width: `${clampedProgress}%`,
            background: 'linear-gradient(90deg, #B794F4 0%, #FFB000 50%, #B794F4 100%)'
          }}
        >
          {/* Animated shine effect */}
          <div
            className="absolute inset-0 animate-shimmer"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)',
              backgroundSize: '200% 100%'
            }}
          />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              rgba(183, 148, 244, 0.1) 0px,
              rgba(183, 148, 244, 0.1) 1px,
              transparent 1px,
              transparent 10px
            )`,
          }}
        />
      </div>

      {/* Status Text */}
      <div className="flex items-center justify-between text-xs">
        <span className="text-[#B794F4]/60">
          {clampedProgress < 100 ? 'Téléchargement du fichier...' : 'Upload terminé !'}
        </span>
        {clampedProgress === 100 && (
          <Icons.CheckCircle size={14} weight="fill" className="text-[#10B981]" />
        )}
      </div>
    </div>
  )
}

// Add this to your global CSS or Tailwind config for the shimmer animation
// @keyframes shimmer {
//   0% { transform: translateX(-100%); }
//   100% { transform: translateX(100%); }
// }
// .animate-shimmer {
//   animation: shimmer 2s infinite;
// }