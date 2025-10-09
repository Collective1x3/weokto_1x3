'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { GraduationCap, Fire } from 'phosphor-react'

const guilds = [
  {
    id: 'comacag0ub51y0001k0046sq1',
    name: 'COMMUNITY ACADEMY',
    tagline: 'LA RÉFÉRENCE ABSOLUE',
    description: 'Formation complète & accompagnement 7J/7. La formation la plus structurée en community building.',
    color: 'blue',
    borderColor: '#3B82F6',
    gradient: 'from-blue-600 to-blue-500',
    icon: GraduationCap,
    stats: {
      members: '573',
      active: '87%',
      rating: '4.9/5'
    }
  },
  {
    id: 'cmTBCBg0ucayh0001l204ganz',
    name: 'TBCB',
    subtitle: 'THE BEST COMMUNITY BUILDER',
    tagline: 'APPROCHE SANS BULLSHIT',
    description: 'Focus sur l\'action et l\'application directe. Moins de théorie, plus de pratique. Pour ceux qui veulent des résultats concrets.',
    color: 'orange',
    borderColor: '#FFB000',
    gradient: 'from-red-600 to-orange-500',
    icon: Fire,
    stats: {
      members: '234',
      active: '92%',
      rating: '4.8/5'
    }
  }
]

export default function ChooseGuildPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedGuild, setSelectedGuild] = useState<string | null>(null)
  const [showInfo, setShowInfo] = useState(false)
  const router = useRouter()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 20)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#B794F4'
      ctx.font = '15px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96)
        ctx.fillText(text, i * 20, drops[i] * 20)

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        router.push('/')
      }
    } catch (error) {
      router.push('/')
    }
  }

  const handleSelectGuild = async (guildId: string) => {
    setLoading(true)
    setError('')
    setSelectedGuild(guildId)

    try {
      const response = await fetch('/api/auth/choose-guild', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ guildId })
      })

      if (response.ok) {
        router.push('/home')
      } else {
        const data = await response.json()
        setError(data.error || 'Erreur lors de la sélection')
        setSelectedGuild(null)
      }
    } catch (error) {
      setError('Erreur de connexion')
      setSelectedGuild(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#B794F4] font-mono relative overflow-hidden">
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-10 pointer-events-none"
      />

      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
          animation: 'scanlines 8s linear infinite'
        }} />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-5xl">
          <div className="mb-8 text-center">
            <Image
              src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
              alt="Weokto"
              width={80}
              height={80}
              className="mx-auto mb-4"
            />
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 uppercase tracking-wider">
              {'> Choisis ta guilde'}
            </h1>
            <p className="text-sm text-[#B794F4]/80">
              Les guildes sont au cœur de Weokto. Sélectionne celle qui correspond à ton style.
            </p>
          </div>

          {error && (
            <div className="border border-[#EF4444] bg-[#EF4444]/10 p-3 mb-6 max-w-2xl mx-auto">
              <p className="text-xs text-[#EF4444] text-center">{error}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {guilds.map((guild) => {
              const Icon = guild.icon
              const isSelected = selectedGuild === guild.id
              const isLoading = loading && isSelected

              return (
                <div
                  key={guild.id}
                  className={`border-2 bg-black/90 transition-all flex flex-col ${
                    isSelected
                      ? `border-[${guild.borderColor}] scale-105`
                      : `border-[#B794F4] hover:border-[${guild.borderColor}]`
                  }`}
                >
                  <div className={`h-24 sm:h-28 bg-gradient-to-r ${guild.gradient} relative border-b-2 border-[${guild.borderColor}]`}>
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                    }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Icon size={40} weight="duotone" className="text-white/90 sm:w-12 sm:h-12" />
                    </div>
                  </div>

                  <div className="p-4 sm:p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg sm:text-xl font-bold text-white">{guild.name}</h3>
                      {guild.subtitle && (
                        <div className="text-[10px] sm:text-xs text-gray-400 whitespace-nowrap">{guild.subtitle}</div>
                      )}
                    </div>
                    <div className="text-xs text-[#FFB000] mb-3 sm:mb-4">{'>> ' + guild.tagline}</div>

                    <div className="border border-[#B794F4]/30 p-2 sm:p-3 mb-3 sm:mb-4 font-mono">
                      <div className="text-[10px] sm:text-xs space-y-1">
                        <div className="flex justify-between">
                          <span className="text-gray-400">MEMBRES:</span>
                          <span className="text-white">{guild.stats.members}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">ACTIFS:</span>
                          <span className="text-white">{guild.stats.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">NOTE:</span>
                          <span className="text-[#FFB000]">{guild.stats.rating}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 mb-4 leading-relaxed flex-1">
                      {guild.description}
                    </p>

                    <button
                      onClick={() => handleSelectGuild(guild.id)}
                      disabled={loading}
                      className={`w-full py-2.5 sm:py-3 font-bold text-xs sm:text-sm transition-all border-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                        isLoading
                          ? 'bg-[#B794F4] text-black border-[#B794F4]'
                          : `bg-gradient-to-r ${guild.gradient} text-white border-${guild.color}-400 hover:opacity-90`
                      }`}
                    >
                      {isLoading ? 'CHARGEMENT...' : `REJOINDRE ${guild.name}`}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Info Section - Expandable */}
          <div className="mt-6 sm:mt-8">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-full p-3 sm:p-4 bg-black/50 border border-[#B794F4]/50 hover:border-[#B794F4] transition-all flex items-center justify-between group"
            >
              <div className="text-xs sm:text-sm font-mono text-[#FFB000] font-bold">C'EST QUOI UNE GUILDE ?</div>
              <span className={`text-[#B794F4] transition-transform ${showInfo ? 'rotate-90' : ''}`}>›</span>
            </button>

            {showInfo && (
              <div className="border-x border-b border-[#B794F4]/50 p-4 sm:p-6 bg-black/30">
                <div className="space-y-4 text-xs sm:text-sm text-gray-300">
                  <div className="border-l-2 border-[#FFB000] pl-3 sm:pl-4">
                    <p className="mb-2">
                      Les guildes sont des <span className="text-white font-bold">communautés de formation indépendantes</span> créées par des experts du community building.
                    </p>
                    <p className="text-[#B794F4]">
                      Elles ne sont pas créées par Weokto, mais nous vérifions rigoureusement chaque créateur.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2">
                      <span className="text-[#FFB000] mt-0.5">✓</span>
                      <div>
                        <p className="text-white font-bold mb-1">MODE GRATUIT</p>
                        <p className="text-gray-400 text-xs">Toutes les guildes proposent un accès gratuit (Tier 1)</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FFB000] mt-0.5">✓</span>
                      <div>
                        <p className="text-white font-bold mb-1">FORMATIONS VÉRIFIÉES</p>
                        <p className="text-gray-400 text-xs">Nous vérifions la qualité des formations proposées</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FFB000] mt-0.5">✓</span>
                      <div>
                        <p className="text-white font-bold mb-1">CRÉATEURS AUDITÉS</p>
                        <p className="text-gray-400 text-xs">Expérience, résultats et réputation vérifiés</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[#FFB000] mt-0.5">✓</span>
                      <div>
                        <p className="text-white font-bold mb-1">RÉSULTATS MEMBRES</p>
                        <p className="text-gray-400 text-xs">Suivi mensuel des performances de chaque guilde</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[#B794F4]/30 pt-3 sm:pt-4">
                    <p className="text-xs text-gray-400 text-center">
                      Weokto s'assure que chaque guilde maintient un niveau de qualité élevé.
                      <br className="hidden sm:block" />
                      Si une guilde ne respecte pas nos standards, elle est retirée de la plateforme.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <p className="text-xs text-[#B794F4]/60">
              {'WEOKTO_GUILD_SELECTION'}
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 10px;
          }
        }
      `}</style>
    </div>
  )
}
