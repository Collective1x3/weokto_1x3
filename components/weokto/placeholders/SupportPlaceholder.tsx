'use client'

import { Lifebuoy, Ticket, Clock, CheckCircle, Warning, UserCircle } from 'phosphor-react'
import ComingSoonCard from '@/components/weokto/guild/ComingSoonCard'

export default function SupportPlaceholder() {
  return (
    <div className="p-6">
      {/* Mock support tickets preview */}
      <div className="mb-8 max-w-4xl mx-auto">
        <div className="border border-[#B794F4]/20 bg-[#1e1e1e] rounded-lg p-4 font-mono">
          <h3 className="text-purple-400 text-xs font-bold mb-4">{'> APERÇU DU SYSTÈME DE SUPPORT'}</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Support Stats */}
            <div>
              <p className="text-purple-400 text-xs font-bold mb-3">STATISTIQUES</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 border border-[#B794F4]/20 rounded">
                  <span className="text-gray-500 text-xs">Temps de réponse moyen</span>
                  <span className="text-white text-sm font-bold">&lt; 2h</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-[#B794F4]/20 rounded">
                  <span className="text-gray-500 text-xs">Tickets résolus</span>
                  <span className="text-[#10B981] text-sm font-bold">98%</span>
                </div>
                <div className="flex items-center justify-between p-2 border border-[#B794F4]/20 rounded">
                  <span className="text-gray-500 text-xs">Support disponible</span>
                  <span className="text-purple-400 text-sm font-bold">24/7</span>
                </div>
              </div>
            </div>

            {/* Mock Tickets */}
            <div>
              <p className="text-purple-400 text-xs font-bold mb-3">VOS TICKETS</p>
              <div className="space-y-2 opacity-50">
                <div className="border border-[#B794F4]/20 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-purple-400" />
                    <span className="text-white text-xs flex-1">#0001 - Question technique</span>
                    <CheckCircle size={14} className="text-[#10B981]" />
                  </div>
                  <p className="text-gray-500 text-xs mt-1 ml-6">Résolu • il y a 2j</p>
                </div>

                <div className="border border-[#B794F4]/20 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-purple-400" />
                    <span className="text-white text-xs flex-1">#0002 - Demande coaching</span>
                    <Clock size={14} className="text-orange-500" />
                  </div>
                  <p className="text-gray-500 text-xs mt-1 ml-6">En cours • il y a 3h</p>
                </div>

                <div className="border border-[#B794F4]/20 rounded p-2">
                  <div className="flex items-center gap-2">
                    <Ticket size={16} className="text-[#EF4444]" />
                    <span className="text-white text-xs flex-1">#0003 - Problème urgent</span>
                    <Warning size={14} className="text-[#EF4444]" />
                  </div>
                  <p className="text-gray-500 text-xs mt-1 ml-6">Priorité haute • il y a 30min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Coaching Sessions Preview */}
          <div className="mt-6">
            <p className="text-purple-400 text-xs font-bold mb-3">SESSIONS DE COACHING</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 opacity-50">
              <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-3 text-center">
                <UserCircle size={32} className="text-purple-400 mx-auto mb-2" />
                <p className="text-white text-xs font-bold">1-on-1</p>
                <p className="text-gray-500 text-xs">Personnel</p>
              </div>
              <div className="border border-purple-400/20 bg-purple-400/5 rounded-lg p-3 text-center">
                <UserCircle size={32} className="text-purple-400 mx-auto mb-2" />
                <p className="text-white text-xs font-bold">Groupe</p>
                <p className="text-gray-500 text-xs">5-10 pers.</p>
              </div>
              <div className="border border-[#10B981]/20 bg-[#10B981]/5 rounded-lg p-3 text-center">
                <UserCircle size={32} className="text-[#10B981] mx-auto mb-2" />
                <p className="text-white text-xs font-bold">Masterclass</p>
                <p className="text-gray-500 text-xs">Live stream</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coming Soon Card */}
      <ComingSoonCard
        title="Support & Coaching"
        description="Système de tickets, coaching personnalisé et support prioritaire. Accompagnement premium bientôt disponible!"
        icon={<Lifebuoy size={64} weight="duotone" className="text-[#B794F4]" />}
        variant="construction"
      />
    </div>
  )
}