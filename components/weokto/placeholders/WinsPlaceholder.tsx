'use client'

import { Trophy, Fire, TrendUp, Medal, Crown, Target } from 'phosphor-react'
import ComingSoonCard from '@/components/weokto/guild/ComingSoonCard'

export default function WinsPlaceholder() {
  return (
    <div className="p-6">
      {/* Mock wins feed preview */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="border border-[#B794F4]/20 bg-[#1e1e1e] rounded-lg p-4 font-mono">
          <h3 className="text-purple-400 text-xs font-bold mb-4">{'> APERÇU DU FEED DE SUCCÈS'}</h3>

          <div className="space-y-4">
            {/* Mock win entry 1 */}
            <div className="border border-[#10B981]/20 bg-[#10B981]/5 rounded-lg p-4 opacity-50">
              <div className="flex items-start gap-3">
                <Trophy size={24} className="text-[#10B981] flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-bold text-sm">User_234</span>
                    <span className="text-gray-500 text-xs">• il y a 2h</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    Premier trade profitable après 3 mois d'apprentissage! 🚀
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-[#10B981]">+€500</span>
                    <div className="flex items-center gap-1">
                      <Fire size={16} className="text-orange-500" />
                      <span className="text-xs text-orange-500">23</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock win entry 2 */}
            <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-4 opacity-50">
              <div className="flex items-start gap-3">
                <Medal size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-bold text-sm">ProTrader_99</span>
                    <span className="text-gray-500 text-xs">• il y a 5h</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    Objectif mensuel atteint! Merci à la communauté pour le support 💪
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-purple-400">Goal: 100%</span>
                    <div className="flex items-center gap-1">
                      <Fire size={16} className="text-orange-500" />
                      <span className="text-xs text-orange-500">45</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mock win entry 3 */}
            <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-4 opacity-50">
              <div className="flex items-start gap-3">
                <Crown size={24} className="text-purple-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white font-bold text-sm">Alpha_Finder</span>
                    <span className="text-gray-500 text-xs">• il y a 1j</span>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">
                    Top performer du mois! 15 trades gagnants consécutifs 🏆
                  </p>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-purple-400">#1 Leaderboard</span>
                    <div className="flex items-center gap-1">
                      <Fire size={16} className="text-orange-500" />
                      <span className="text-xs text-orange-500">127</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Feed des Wins"
        description="Partagez vos succès, célébrez avec la communauté et inspirez-vous des victoires des autres membres!"
        icon={<Trophy size={64} weight="duotone" className="text-purple-400" />}
        variant="default"
      />
    </div>
  )
}