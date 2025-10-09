"use client"

import { useState } from 'react'
import {
  Sparkle,
  Lightning,
  ShoppingBag,
  Crown,
  AirplaneTilt,
  Gift,
  TrendUp,
  Star,
  Plus,
  Minus,
  Trophy,
  GraduationCap,
  Airplane,
  Camera,
  Headphones
} from 'phosphor-react'

export default function PearlsPage() {
  const [activeTab, setActiveTab] = useState<'boutique' | 'voyages' | 'coaching'>('boutique')

  const pearlBalance = 12450
  const monthlyEarnings = 2450
  const nextMilestone = 15000
  const progressToMilestone = (pearlBalance / nextMilestone) * 100

  // Boutique items (cosmetics & digital goods)
  const boutiqueItems = [
    {
      id: 1,
      name: 'Skin Terminal Elite',
      description: 'Skin animé exclusif pour ton profil',
      price: 2400,
      icon: Star,
      status: 'NEW',
      available: true
    },
    {
      id: 2,
      name: 'Badge Legendary',
      description: 'Badge doré avec animation',
      price: 1800,
      icon: Crown,
      status: 'LIMITED',
      available: true
    },
    {
      id: 3,
      name: 'Sound Pack Victory',
      description: 'Sons personnalisés pour tes wins',
      price: 950,
      icon: Headphones,
      status: null,
      available: true
    },
    {
      id: 4,
      name: 'Trail Effect Neon',
      description: 'Effet visuel sur ton avatar',
      price: 1200,
      icon: Lightning,
      status: null,
      available: true
    }
  ]

  // Voyages items
  const voyagesItems = [
    {
      id: 1,
      name: 'Mastermind Bali 2025',
      description: '5 jours all-inclusive + sessions privées',
      price: 15000,
      icon: Airplane,
      status: '3 PLACES',
      available: true
    },
    {
      id: 2,
      name: 'Weekend VIP Paris',
      description: 'Hôtel 5★ + événement exclusif',
      price: 8500,
      icon: Star,
      status: '8 PLACES',
      available: true
    },
    {
      id: 3,
      name: 'Dubai Business Trip',
      description: '3 jours networking + formations',
      price: 12000,
      icon: Trophy,
      status: 'SOLD OUT',
      available: false
    }
  ]

  // Coaching items
  const coachingItems = [
    {
      id: 1,
      name: 'Session 1:1 CEO',
      description: '2h avec un fondateur Weokto',
      price: 4800,
      icon: Crown,
      status: null,
      available: true
    },
    {
      id: 2,
      name: 'Audit Complet Funnel',
      description: 'Analyse détaillée + plan d\'action',
      price: 3200,
      icon: TrendUp,
      status: null,
      available: true
    },
    {
      id: 3,
      name: 'Pack Creator Pro',
      description: 'Matériel studio complet',
      price: 6200,
      icon: Camera,
      status: 'NEW',
      available: true
    }
  ]

  // Recent activity
  const recentActivity = [
    { id: 1, type: 'earn', amount: 1250, description: 'Conversion Growth Pack', time: '2h' },
    { id: 2, type: 'spend', amount: 1800, description: 'Badge Legendary', time: '1j' },
    { id: 3, type: 'earn', amount: 620, description: 'Mission Flash', time: '3j' },
    { id: 4, type: 'earn', amount: 450, description: 'Bonus Streak 7j', time: '4j' },
    { id: 5, type: 'spend', amount: 950, description: 'Sound Pack', time: '5j' }
  ]

  const getItems = () => {
    switch(activeTab) {
      case 'voyages': return voyagesItems
      case 'coaching': return coachingItems
      default: return boutiqueItems
    }
  }

  return (
    <div className="min-h-screen p-4 font-mono">
      {/* Header simplifié */}
      <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-6 mb-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 border border-[#FFB000] bg-[#FFB000]/10 rounded flex items-center justify-center">
              <Sparkle size={32} weight="fill" className="text-[#FFB000]" />
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">SOLDE PEARLS</p>
              <p className="text-3xl font-bold text-[#FFB000]">{pearlBalance.toLocaleString('fr-FR')}</p>
              <p className="text-xs text-[#10B981]">+{monthlyEarnings} ce mois</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button className="px-6 py-3 rounded bg-[#10B981] text-black font-bold border border-[#10B981] hover:bg-[#10B981]/80 transition-all duration-200 flex items-center gap-2">
              <Plus size={20} weight="bold" />
              <span>[GAGNER PEARLS]</span>
            </button>
            <button className="px-6 py-3 rounded bg-transparent text-[#B794F4] font-bold border border-[#B794F4] hover:bg-purple-400/10 transition-all duration-200">
              [HISTORIQUE]
            </button>
          </div>
        </div>

        {/* Progress bar vers prochain milestone */}
        <div className="mt-4 pt-4 border-t border-[#B794F4]/20">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-gray-500">PROCHAIN PALIER: {nextMilestone.toLocaleString('fr-FR')} PEARLS</span>
            <span className="text-xs text-[#FFB000]">{progressToMilestone.toFixed(0)}%</span>
          </div>
          <div className="h-2 bg-[#1e1e1e] border border-[#B794F4]/30 rounded">
            <div
              className="h-full bg-gradient-to-r from-[#FFB000] to-[#B794F4] rounded"
              style={{ width: `${progressToMilestone}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-4">
          {/* Tabs de navigation */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-2 flex gap-2">
            <button
              onClick={() => setActiveTab('boutique')}
              className={`flex-1 px-4 py-3 font-bold rounded border transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'boutique'
                  ? 'bg-[#B794F4] text-black border-[#B794F4]'
                  : 'bg-transparent text-[#B794F4] border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-purple-400/10'
              }`}
            >
              <ShoppingBag size={20} weight={activeTab === 'boutique' ? 'bold' : 'regular'} />
              <span>[BOUTIQUE]</span>
            </button>
            <button
              onClick={() => setActiveTab('voyages')}
              className={`flex-1 px-4 py-3 font-bold rounded border transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'voyages'
                  ? 'bg-[#B794F4] text-black border-[#B794F4]'
                  : 'bg-transparent text-[#B794F4] border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-purple-400/10'
              }`}
            >
              <AirplaneTilt size={20} weight={activeTab === 'voyages' ? 'bold' : 'regular'} />
              <span>[VOYAGES]</span>
            </button>
            <button
              onClick={() => setActiveTab('coaching')}
              className={`flex-1 px-4 py-3 font-bold rounded border transition-all duration-200 flex items-center justify-center gap-2 ${
                activeTab === 'coaching'
                  ? 'bg-[#B794F4] text-black border-[#B794F4]'
                  : 'bg-transparent text-[#B794F4] border-[#B794F4]/30 hover:border-[#B794F4] hover:bg-purple-400/10'
              }`}
            >
              <GraduationCap size={20} weight={activeTab === 'coaching' ? 'bold' : 'regular'} />
              <span>[COACHING]</span>
            </button>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getItems().map(item => {
              const Icon = item.icon
              return (
                <div
                  key={item.id}
                  className={`border rounded-lg ${item.available ? 'border-[#B794F4]' : 'border-[#B794F4]/20'} bg-[#1e1e1e] p-4 transition-all duration-200 ${
                    item.available ? 'hover:border-[#FFB000] hover:bg-[#FFB000]/5 cursor-pointer' : 'opacity-50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 border border-[#FFB000]/50 bg-[#FFB000]/10 rounded flex items-center justify-center flex-shrink-0">
                      <Icon size={24} className="text-[#FFB000]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white">{item.name}</h3>
                        {item.status && (
                          <span className={`px-2 py-1 text-[10px] font-bold rounded border ${
                            item.status === 'SOLD OUT'
                              ? 'border-[#EF4444] text-[#EF4444]'
                              : item.status === 'NEW'
                              ? 'border-[#10B981] text-[#10B981]'
                              : 'border-[#FFB000] text-[#FFB000]'
                          }`}>
                            {item.status}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mb-3">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xl font-bold text-[#FFB000]">{item.price.toLocaleString('fr-FR')}</p>
                          <p className="text-xs text-gray-500">PEARLS</p>
                        </div>
                        <button
                          disabled={!item.available}
                          className={`px-4 py-2 font-bold rounded border text-xs transition-all duration-200 ${
                            item.available
                              ? 'bg-[#B794F4] text-black border-[#B794F4] hover:bg-[#FFB000] hover:border-[#FFB000]'
                              : 'bg-transparent text-gray-500 border-[#B794F4]/20 cursor-not-allowed'
                          }`}
                        >
                          {item.available ? '[OBTENIR]' : '[INDISPONIBLE]'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick stats */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Trophy size={18} className="text-[#FFB000]" />
              STATISTIQUES
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-2 border-b border-[#B794F4]/20">
                <span className="text-xs text-gray-500">Gagné ce mois</span>
                <span className="text-sm font-bold text-[#10B981]">+{monthlyEarnings}</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-[#B794F4]/20">
                <span className="text-xs text-gray-500">Dépensé total</span>
                <span className="text-sm font-bold text-white">9,800</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">Streak actuel</span>
                <span className="text-sm font-bold text-[#FFB000]">12 jours</span>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="border border-[#B794F4] bg-[#1e1e1e] rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Gift size={18} className="text-[#FFB000]" />
              ACTIVITÉ RÉCENTE
            </h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {recentActivity.map(activity => (
                <div key={activity.id} className="flex items-center justify-between p-2 rounded border border-[#B794F4]/20">
                  <div className="flex items-center gap-2">
                    {activity.type === 'earn' ? (
                      <Plus size={16} className="text-[#10B981]" />
                    ) : (
                      <Minus size={16} className="text-[#EF4444]" />
                    )}
                    <div>
                      <p className={`text-sm font-bold ${
                        activity.type === 'earn' ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}>
                        {activity.type === 'earn' ? '+' : '-'}{activity.amount}
                      </p>
                      <p className="text-xs text-gray-400">{activity.description}</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">{activity.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Next milestone */}
          <div className="border border-[#FFB000] bg-[#1e1e1e] rounded-lg p-4">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Star size={18} className="text-[#FFB000]" />
              PROCHAIN DÉBLOCAGE
            </h3>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">À {nextMilestone.toLocaleString('fr-FR')} PEARLS</p>
              <p className="text-sm text-white">Voyage Mastermind Bali</p>
              <p className="text-xs text-[#FFB000]">+ Badge exclusif animé</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}