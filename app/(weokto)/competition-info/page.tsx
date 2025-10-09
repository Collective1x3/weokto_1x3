'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderLandingPage from '@/components/weokto/HeaderLandingPage'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'
import Image from 'next/image'

export default function InfoCompetitionPage() {
 const [cursorBlink, setCursorBlink] = useState(true)
 const [activeTab, setActiveTab] = useState<'guildes' | 'solo' | 'clans'>('guildes')
 const [showNote, setShowNote] = useState(false)
 const canvasRef = useRef<HTMLCanvasElement>(null)

 // Cursor blink
 useEffect(() => {
   const timer = setInterval(() => setCursorBlink(b => !b), 500)
   return () => clearInterval(timer)
 }, [])

 // Matrix rain effect
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

 return (
   <div className="min-h-screen bg-black text-[#B794F4] font-mono relative overflow-hidden">
     {/* Matrix Rain Background */}
     <canvas
       ref={canvasRef}
       className="fixed inset-0 opacity-10 pointer-events-none"
     />

     {/* Scanlines */}
     <div className="fixed inset-0 pointer-events-none opacity-50">
       <div className="absolute inset-0" style={{
         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
         animation: 'scanlines 8s linear infinite'
       }} />
     </div>

     {/* CRT Screen Effect */}
     <div className="fixed inset-0 pointer-events-none">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(183,148,244,0.01)] to-transparent" />
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,176,0,0.01)] to-transparent" />
     </div>

     {/* Header */}
     <HeaderLandingPage />

     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
       <div className="max-w-5xl mx-auto text-center z-10">
         {/* Competition Label */}
         <div className="mb-4">
           <p className="text-xs md:text-sm text-[#FFB000] tracking-widest">
             {'[ COMPÉTITIONS ]'}
           </p>
         </div>

         {/* Main Title */}
         <h1 className="text-3xl md:text-5xl mb-6 tracking-wider font-mono font-bold text-[#B794F4]">
           PROUVE QUE TU ES LE MEILLEUR
         </h1>

         {/* Description */}
         <div className="mb-8 text-sm md:text-base">
           <p className="mb-2 text-white">PARTICIPE AUTOMATIQUEMENT AUX COMPÉTITIONS</p>
           <p className="mb-2 text-white">PLUS TU GÉNÈRES, PLUS TU GAGNES</p>
           <p className="mb-2 text-white">VOITURES, VOYAGES, PEARLS</p>
         </div>

         {/* Competition Info */}
         <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
           <div className="border border-[#B794F4] p-4 bg-black/80">
             <div className="text-2xl mb-2 text-[#FFB000]">3 TYPES</div>
             <div className="text-xs">HEBDO/MENSUEL/SAISON</div>
           </div>
           <div className="border border-[#B794F4] p-4 bg-black/80">
             <div className="text-2xl mb-2 text-[#FFB000]">2 MODES</div>
             <div className="text-xs">SOLO ET/OU GUILDES</div>
           </div>
           <div className="border border-[#B794F4] p-4 bg-black/80">
             <div className="text-2xl mb-2 text-[#FFB000]">AUTO</div>
             <div className="text-xs">INSCRIPTION GRATUITE</div>
           </div>
         </div>
       </div>
     </section>

     {/* How it Works */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">COMMENT ÇA MARCHE</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             4 ÉTAPES VERS LA VICTOIRE
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
             className="text-center"
           >
             <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#FFB000] bg-black/80 flex items-center justify-center">
               <span className="text-2xl font-bold text-[#FFB000]">1</span>
             </div>
             <h3 className="text-white font-bold mb-2">REJOINS WEOKTO</h3>
             <p className="text-xs text-gray-400">
               Inscription automatique aux compétitions dès ton arrivée
             </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.1 }}
             className="text-center"
           >
             <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#FFB000] bg-black/80 flex items-center justify-center">
               <span className="text-2xl font-bold text-[#FFB000]">2</span>
             </div>
             <h3 className="text-white font-bold mb-2">GÉNÈRE DES VENTES</h3>
             <p className="text-xs text-gray-400">
               Chaque euro généré compte pour ton classement
             </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.2 }}
             className="text-center"
           >
             <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#FFB000] bg-black/80 flex items-center justify-center">
               <span className="text-2xl font-bold text-[#FFB000]">3</span>
             </div>
             <h3 className="text-white font-bold mb-2">MONTE AU CLASSEMENT</h3>
             <p className="text-xs text-gray-400">
               Suivi en temps réel de ta position dans le leaderboard
             </p>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.3 }}
             className="text-center"
           >
             <div className="w-16 h-16 mx-auto mb-4 border-2 border-[#FFB000] bg-black/80 flex items-center justify-center">
               <span className="text-2xl font-bold text-[#FFB000]">4</span>
             </div>
             <h3 className="text-white font-bold mb-2">GAGNE DES RÉCOMPENSES</h3>
             <p className="text-xs text-gray-400">
               Pearls, voyages, voitures et prix exclusifs
             </p>
           </motion.div>
         </div>
       </div>
     </section>

     {/* Competition Modes Tabs */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">MODES DE COMPÉTITION</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             GAGNE SEUL OU EN ÉQUIPE
           </h2>
         </div>

         {/* Tab Navigation - Terminal Style */}
         <div className="border-2 border-[#B794F4] bg-black/90 p-1 max-w-xl mx-auto mb-8">
           <div className="flex">
             {(['guildes', 'solo', 'clans'] as const).map((mode) => (
               <button
                 key={mode}
                 onClick={() => setActiveTab(mode)}
                 className={`flex-1 py-2 px-4 text-sm font-mono transition-all ${
                   activeTab === mode
                     ? 'bg-[#B794F4] text-black'
                     : 'text-[#B794F4] hover:bg-[#B794F4]/20'
                 }`}
               >
                 {mode === 'guildes' && '[GUILDES]'}
                 {mode === 'solo' && '[SOLO]'}
                 {mode === 'clans' && '[CLANS]'}
                 {mode === 'clans' && <span className="ml-2 text-xs opacity-60">(SOON)</span>}
               </button>
             ))}
           </div>
         </div>

         {/* Tab Content */}
         <div className="border-2 border-[#B794F4] bg-black/90">
           <div className="border-b-2 border-[#B794F4] p-2 flex items-center justify-between">
             <div className="text-xs">MODE SÉLECTIONNÉ</div>
             <div className="text-xs text-[#FFB000]">
               {activeTab === 'guildes' && 'GUILDES'}
               {activeTab === 'solo' && 'SOLO'}
               {activeTab === 'clans' && 'CLANS'}
             </div>
           </div>

           <div className="p-6">
             {activeTab === 'guildes' && (
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <Icons.Users size={24} className="text-[#FFB000] mt-1" />
                   <div>
                     <h3 className="text-lg font-bold text-white mb-2">COMPÉTITION PAR GUILDES</h3>
                     <p className="text-sm text-gray-400 mb-4">
                       Ta guilde entière concourt. Les performances individuelles s'additionnent pour le classement collectif.
                     </p>
                     <div className="space-y-2 text-xs">
                       <div className="text-white">[✓] Entraide et stratégies communes</div>
                       <div className="text-white">[✓] Récompenses partagées</div>
                       <div className="text-white">[✓] Prestige de la guilde</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'solo' && (
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <Icons.User size={24} className="text-[#FFB000] mt-1" />
                   <div>
                     <h3 className="text-lg font-bold text-white mb-2">COMPÉTITION SOLO</h3>
                     <p className="text-sm text-gray-400 mb-4">
                       Ton talent, tes résultats. Affronte les meilleurs créateurs en duel direct.
                     </p>
                     <div className="space-y-2 text-xs">
                       <div className="text-white">[✓] 100% de tes gains comptent</div>
                       <div className="text-white">[✓] Récompenses personnelles</div>
                       <div className="text-white">[✓] Gloire individuelle</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}

             {activeTab === 'clans' && (
               <div className="space-y-4">
                 <div className="flex items-start gap-3">
                   <Icons.Shield size={24} className="text-[#B794F4] mt-1" />
                   <div>
                     <h3 className="text-lg font-bold text-white mb-2">COMPÉTITION PAR CLANS [COMING SOON]</h3>
                     <p className="text-sm text-gray-400 mb-4">
                       Crée ton clan avec tes potes (3-8 personnes) et affrontez les autres clans ensemble.
                     </p>
                     <div className="space-y-2 text-xs">
                       <div className="text-gray-500">[◯] Création libre de clans</div>
                       <div className="text-gray-500">[◯] Compétitions dédiées</div>
                       <div className="text-gray-500">[◯] Récompenses exclusives</div>
                       <div className="text-[#B794F4] mt-3">BIENTÔT DISPONIBLE: Dans les prochaines mises à jour</div>
                     </div>
                   </div>
                 </div>
               </div>
             )}
           </div>
         </div>
       </div>
     </section>

     {/* Competition Types Grid */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4 animate-pulse">
             TYPES DE COMPÉTITIONS
           </div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             TROIS FAÇONS DE DOMINER
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Seasonal Competition */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             className="border-2 border-[#FFB000] bg-black/90 hover:bg-black/95 transition-all"
           >
             <div className="border-b-2 border-[#FFB000] p-3 flex items-center justify-between">
               <span className="text-xs font-bold">SAISONNIÈRE</span>
               <div className="flex items-center gap-2">
                 <Icons.Calendar size={16} className="text-[#FFB000]" />
               </div>
             </div>
             <div className="p-5">
               <h3 className="text-xl font-bold text-white mb-2">SAISON COMPLÈTE</h3>
               <div className="text-xs text-[#FFB000] mb-3">DURÉE: ? MOIS</div>

               <p className="text-xs text-gray-400 mb-4">
                 Compétition sur toute la durée de la saison. Les plus grandes récompenses.
               </p>

               <div className="space-y-2">
                 <div className="text-xs text-[#B794F4]">RÉCOMPENSES:</div>
                 <div className="pl-4 space-y-1 text-xs">
                   <div className="text-white">[✓] Voyages exclusifs</div>
                   <div className="text-white">[✓] Voitures de luxe</div>
                   <div className="text-white">[✓] 100K+ Pearls</div>
                 </div>
               </div>
             </div>
           </motion.div>

           {/* Monthly Competition */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.1 }}
             className="border-2 border-[#B794F4] bg-black/90 hover:bg-black/95 transition-all"
           >
             <div className="border-b-2 border-[#B794F4] p-3 flex items-center justify-between">
               <span className="text-xs font-bold">MENSUELLE</span>
               <div className="flex items-center gap-2">
                 <Icons.CalendarBlank size={16} className="text-[#B794F4]" />
               </div>
             </div>
             <div className="p-5">
               <h3 className="text-xl font-bold text-white mb-2">MENSUELLE</h3>
               <div className="text-xs text-[#B794F4] mb-3">DURÉE: 1 MOIS</div>

               <p className="text-xs text-gray-400 mb-4">
                 Nouveaux défis chaque mois. Opportunités régulières de victoire.
               </p>

               <div className="space-y-2">
                 <div className="text-xs text-[#B794F4]">RÉCOMPENSES:</div>
                 <div className="pl-4 space-y-1 text-xs">
                   <div className="text-white">[✓] Boosts majeurs</div>
                   <div className="text-white">[✓] 10K-50K Pearls</div>
                   <div className="text-white">[✓] Cosmétiques exclusifs</div>
                 </div>
               </div>
             </div>
           </motion.div>

           {/* Weekly Competition */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
             className="border-2 border-[#B794F4] bg-black/90 hover:bg-black/95 transition-all"
           >
             <div className="border-b-2 border-[#B794F4] p-3 flex items-center justify-between">
               <span className="text-xs font-bold">HEBDOMADAIRE</span>
               <div className="flex items-center gap-2">
                 <Icons.Lightning size={16} className="text-[#B794F4]" />
               </div>
             </div>
             <div className="p-5">
               <h3 className="text-xl font-bold text-white mb-2">HEBDOMADAIRE</h3>
               <div className="text-xs text-[#B794F4] mb-3">DURÉE: 7 JOURS</div>

               <p className="text-xs text-gray-400 mb-4">
                 Sprint intensif sur une semaine. Action rapide, récompenses immédiates.
               </p>

               <div className="space-y-2">
                 <div className="text-xs text-[#B794F4]">RÉCOMPENSES:</div>
                 <div className="pl-4 space-y-1 text-xs">
                   <div className="text-white">[✓] Boosts temporaires</div>
                   <div className="text-white">[✓] Cosmétiques rares</div>
                   <div className="text-white">[✓] 1K-5K Pearls</div>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>

         {/* Important Note - Collapsible */}
         <div className="mt-8 max-w-3xl mx-auto">
           <button
             onClick={() => setShowNote(!showNote)}
             className="w-full border border-[#FFB000]/50 bg-black/90 p-3 hover:border-[#FFB000] transition-all flex items-center justify-between group"
           >
             <div className="flex items-center gap-2">
               <Icons.Info size={16} className="text-[#FFB000]" />
               <span className="text-xs text-[#FFB000] font-bold">[INFORMATION SUR LES RÉCOMPENSES]</span>
             </div>
             <span className={`text-[#FFB000] transition-transform ${showNote ? 'rotate-90' : ''}`}></span>
           </button>

           {showNote && (
             <div className="border-x border-b border-[#FFB000]/50 bg-black/90 p-4">
               <p className="text-xs text-gray-400">
                 Les récompenses affichées sur cette page sont à titre indicatif uniquement. Les prix varient
                 à chaque compétition et seront annoncés officiellement avant le début de chaque saison,
                 mois ou semaine selon le type de compétition.
               </p>
             </div>
           )}
         </div>
       </div>
     </section>

     {/* Leaderboard Preview */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             CLASSEMENT
           </h2>
         </div>

         <div className="border-2 border-[#FFB000] bg-black/90 max-w-3xl mx-auto">
           <div className="border-b-2 border-[#FFB000] p-2 flex items-center justify-between">
             <div className="text-xs">LEADERBOARD</div>
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <span className="text-xs text-green-500">LIVE</span>
             </div>
           </div>

           <div className="p-6">
             {/* Leaderboard Table */}
             <div className="font-mono text-xs">
               <div className="grid grid-cols-12 text-[#FFB000] pb-2 border-b border-[#FFB000]/30">
                 <span className="col-span-2">RANG</span>
                 <span className="col-span-4">MEMBRE</span>
                 <span className="col-span-3">GUILDE</span>
                 <span className="col-span-3 text-right">PEARLS</span>
               </div>

               <div className="space-y-2 mt-2">
                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   className="grid grid-cols-12 text-white"
                 >
                   <span className="col-span-2">[001]</span>
                   <span className="col-span-4">TIBO_MRT</span>
                   <span className="col-span-3">ACADEMY</span>
                   <span className="col-span-3 text-right text-[#FFB000]">24,185</span>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: 0.1 }}
                   className="grid grid-cols-12 text-white"
                 >
                   <span className="col-span-2">[002]</span>
                   <span className="col-span-4">SPIDER_CB</span>
                   <span className="col-span-3">TBCB</span>
                   <span className="col-span-3 text-right text-[#FFB000]">18,942</span>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: 0.2 }}
                   className="grid grid-cols-12 text-white"
                 >
                   <span className="col-span-2">[003]</span>
                   <span className="col-span-4">ELIOT_ABR</span>
                   <span className="col-span-3">ACADEMY</span>
                   <span className="col-span-3 text-right text-[#FFB000]">15,327</span>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: 0.3 }}
                   className="grid grid-cols-12 text-white"
                 >
                   <span className="col-span-2">[004]</span>
                   <span className="col-span-4">JADE_GFR</span>
                   <span className="col-span-3">TBCB</span>
                   <span className="col-span-3 text-right text-[#FFB000]">12,891</span>
                 </motion.div>

                 <motion.div
                   initial={{ opacity: 0 }}
                   whileInView={{ opacity: 1 }}
                   transition={{ delay: 0.4 }}
                   className="grid grid-cols-12 text-white"
                 >
                   <span className="col-span-2">[005]</span>
                   <span className="col-span-4">LUCAS_WIN</span>
                   <span className="col-span-3">ACADEMY</span>
                   <span className="col-span-3 text-right text-[#FFB000]">11,234</span>
                 </motion.div>

                 <div className="pt-4 mt-4 border-t border-[#B794F4]/30">
                   <div className="grid grid-cols-12 text-[#B794F4] animate-pulse">
                     <span className="col-span-2">[???]</span>
                     <span className="col-span-4">TOI</span>
                     <span className="col-span-3">?????</span>
                     <span className="col-span-3 text-right">START NOW</span>
                   </div>
                 </div>
               </div>
             </div>

             <div className="mt-6 text-center">
               <button
                 onClick={() => window.location.href = '/leaderboards'}
                 className="text-xs text-[#FFB000] hover:text-white transition-colors"
               >
                 VOIR LE CLASSEMENT COMPLET
               </button>
             </div>
           </div>
         </div>

         {/* Note below leaderboard */}
         <p className="text-center text-xs text-gray-400 mt-4">
           * Ce classement est à titre indicatif seulement
         </p>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 mb-4">
             <span className="text-[#FFB000] text-sm font-mono animate-pulse">FAQ</span>
           </div>
           <motion.h2
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
             className="text-3xl md:text-4xl font-mono font-bold text-[#B794F4]"
           >
             QUESTIONS FRÉQUENTES
           </motion.h2>
         </div>

         <div className="space-y-4">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">DOIS-JE M'INSCRIRE AUX COMPÉTITIONS?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 NON! TU ES AUTOMATIQUEMENT INSCRIT DÈS QUE TU REJOINS WEOKTO. CHAQUE VENTE COMPTE POUR TON CLASSEMENT.
               </p>
             </details>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.05 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">COMMENT SONT CALCULÉS LES CLASSEMENTS?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 BASÉS SUR LE MONTANT TOTAL GÉNÉRÉ EN VENTES. PLUS TU GÉNÈRES DE REVENUS, MIEUX TU ES CLASSÉ.
               </p>
             </details>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">QUAND COMMENCE LA SAISON 1?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 TRÈS BIENTÔT! LES DATES SERONT ANNONCÉES DIRECTEMENT SUR WEOKTO. RESTE CONNECTÉ POUR NE PAS MANQUER LE DÉBUT.
               </p>
             </details>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.15 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">PUIS-JE PARTICIPER À PLUSIEURS COMPÉTITIONS?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 OUI! TU PARTICIPES AUTOMATIQUEMENT AUX COMPÉTITIONS HEBDOMADAIRES, MENSUELLES ET SAISONNIÈRES.
               </p>
             </details>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">LES RÉCOMPENSES SONT-ELLES CUMULABLES?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 ABSOLUMENT! TU PEUX GAGNER DANS CHAQUE TYPE DE COMPÉTITION. PLUS DES PEARLS SUR CHAQUE VENTE.
               </p>
             </details>
           </motion.div>

           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.25 }}
             viewport={{ once: true }}
           >
             <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
               <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                 <span className="text-sm">COMMENT FONCTIONNENT LES CLANS?</span>
                 <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
               </summary>
               <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                 BIENTÔT DISPONIBLE! TU POURRAS CRÉER UN CLAN DE 3-8 PERSONNES AVEC TES AMIS POUR DES COMPÉTITIONS SPÉCIALES.
               </p>
             </details>
           </motion.div>
         </div>
       </div>
     </section>

     {/* CTA Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4 text-center">
         <Icons.Trophy size={48} className="text-[#FFB000] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
           PRÊT À DOMINER LE CLASSEMENT?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-2">
           REJOINS WEOKTO MAINTENANT ET COMMENCE À ACCUMULER DES GAINS.
         </p>
         <p className="text-sm font-mono text-[#FFB000] mb-8 animate-pulse">
           LES PREMIERS ARRIVÉS ONT TOUJOURS UN AVANTAGE
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             [COMMENCER MAINTENANT]
           </button>
           <button
             onClick={() => window.location.href = '/guildes'}
             className="px-8 py-4 border-2 border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-lg font-mono tracking-wider"
           >
             [DÉCOUVRIR LES GUILDES]
           </button>
         </div>
       </div>
     </section>

     {/* Footer */}
     <FooterLandingPage showSupplierCTA={false} />

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
