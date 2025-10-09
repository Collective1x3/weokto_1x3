'use client'

import { ReactNode, useEffect, useState } from 'react'
import { Sparkle, Warning } from 'phosphor-react'

interface ComingSoonCardProps {
  title: string
  description?: string
  icon?: ReactNode
  variant?: 'default' | 'construction' | 'beta'
}

export default function ComingSoonCard({
  title,
  description = 'Cette fonctionnalité sera bientôt disponible',
  icon,
  variant = 'default'
}: ComingSoonCardProps) {
  const [glitch, setGlitch] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setGlitch(true)
      setTimeout(() => setGlitch(false), 200)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const variants = {
    default: {
      border: 'border-purple-400',
      bg: 'bg-purple-400/5',
      text: 'text-purple-400',
      icon: <Sparkle size={48} weight="fill" className="text-purple-400" />
    },
    construction: {
      border: 'border-[#EF4444]',
      bg: 'bg-[#EF4444]/5',
      text: 'text-[#EF4444]',
      icon: <Warning size={48} weight="fill" className="text-[#EF4444]" />
    },
    beta: {
      border: 'border-[#B794F4]',
      bg: 'bg-purple-400/5',
      text: 'text-[#B794F4]',
      icon: <Sparkle size={48} weight="duotone" className="text-purple-400" />
    }
  }

  const currentVariant = variants[variant]

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <div
        className={`
          max-w-md w-full border ${currentVariant.border} ${currentVariant.bg} rounded-2xl
          p-8 text-center font-mono relative overflow-hidden
          transition-all duration-300 hover:scale-[1.02]
        `}
      >
        {/* Glitch effect */}
        {glitch && (
          <div
            className="absolute inset-0 opacity-50"
            style={{
              background: `linear-gradient(90deg, transparent 20%, ${
                variant === 'construction' ? '#EF4444' : '#B794F4'
              } 50%, transparent 80%)`,
              animation: 'glitchSlide 0.2s linear'
            }}
          />
        )}

        {/* Content */}
        <div className="relative z-10">
          <div className="mb-6 flex justify-center">
            {icon || currentVariant.icon}
          </div>

          <h2 className={`text-2xl font-bold mb-4 ${currentVariant.text}`}>
            {variant === 'construction' && '🚧 '}
            {title}
            {variant === 'construction' && ' 🚧'}
          </h2>

          <p className="text-gray-400 text-sm mb-6">
            {description}
          </p>

          <div className="space-y-2">
            <div className={`inline-block px-4 py-2 rounded-lg border ${currentVariant.border} ${currentVariant.text} text-xs font-bold animate-pulse`}>
              [COMING SOON]
            </div>

            {variant === 'beta' && (
              <p className="text-xs text-gray-500 mt-4">
                Rejoignez notre Discord pour être informé du lancement
              </p>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitchSlide {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}