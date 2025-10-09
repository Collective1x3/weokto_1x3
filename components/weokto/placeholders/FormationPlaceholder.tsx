'use client'

import { GraduationCap, PlayCircle, Medal, BookOpen, ChartLine } from 'phosphor-react'
import ComingSoonCard from '@/components/weokto/guild/ComingSoonCard'

export default function FormationPlaceholder() {
  return (
    <div className="p-6">
      {/* Mock course preview */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="border-2 border-[#B794F4]/30 bg-black/50 p-4 font-mono">
          <h3 className="text-[#FFB000] text-xs font-bold mb-4">{'> APERÇU DES FUTURS MODULES'}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-[#B794F4]/20 p-3 opacity-50">
              <div className="flex items-start gap-3">
                <PlayCircle size={24} className="text-[#B794F4] flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">Module 1: Les Bases</p>
                  <p className="text-[#B794F4]/60 text-xs">12 vidéos • 2h30</p>
                  <div className="mt-2">
                    <div className="h-1 bg-[#B794F4]/20">
                      <div className="h-full w-0 bg-[#FFB000]" />
                    </div>
                    <p className="text-xs text-[#B794F4]/40 mt-1">0% complété</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#B794F4]/20 p-3 opacity-50">
              <div className="flex items-start gap-3">
                <BookOpen size={24} className="text-[#B794F4] flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">Module 2: Stratégies</p>
                  <p className="text-[#B794F4]/60 text-xs">8 vidéos • 1h45</p>
                  <div className="mt-2">
                    <div className="h-1 bg-[#B794F4]/20">
                      <div className="h-full w-0 bg-[#FFB000]" />
                    </div>
                    <p className="text-xs text-[#B794F4]/40 mt-1">Verrouillé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#B794F4]/20 p-3 opacity-50">
              <div className="flex items-start gap-3">
                <ChartLine size={24} className="text-[#B794F4] flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">Module 3: Avancé</p>
                  <p className="text-[#B794F4]/60 text-xs">15 vidéos • 4h00</p>
                  <div className="mt-2">
                    <div className="h-1 bg-[#B794F4]/20">
                      <div className="h-full w-0 bg-[#FFB000]" />
                    </div>
                    <p className="text-xs text-[#B794F4]/40 mt-1">Verrouillé</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-[#B794F4]/20 p-3 opacity-50">
              <div className="flex items-start gap-3">
                <Medal size={24} className="text-[#B794F4] flex-shrink-0" />
                <div>
                  <p className="text-white text-sm font-bold">Certification</p>
                  <p className="text-[#B794F4]/60 text-xs">Examen final</p>
                  <div className="mt-2">
                    <p className="text-xs text-[#FFB000]/60">Requiert 100% de progression</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Plateforme de Formation"
        description="Accédez à des cours exclusifs, suivez votre progression et obtenez des certifications. En cours de développement!"
        icon={<GraduationCap size={64} weight="duotone" className="text-[#B794F4]" />}
        variant="beta"
      />
    </div>
  )
}