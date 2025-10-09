'use client'

interface ProgressBarProps {
  percentage: number // 0-100
  showLabel?: boolean
  height?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export function ProgressBar({
  percentage,
  showLabel = true,
  height = 'md',
  animated = true
}: ProgressBarProps) {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  }

  const clampedPercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className="w-full">
      <div className={`${heightClasses[height]} bg-[#B794F4]/20 overflow-hidden relative`}>
        <div
          className={`h-full bg-gradient-to-r from-[#B794F4] to-[#FFB000] ${animated ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-[#B794F4]/60 font-mono">
            {Math.round(clampedPercentage)}% TERMINÉ
          </span>
        </div>
      )}
    </div>
  )
}