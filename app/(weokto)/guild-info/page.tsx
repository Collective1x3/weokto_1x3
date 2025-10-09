'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderLandingPage from '@/components/weokto/HeaderLandingPage'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'

export default function InfoGuildePage() {
 const [cursorBlink, setCursorBlink] = useState(true)
 const [showPartnerForm, setShowPartnerForm] = useState(false)
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

 const guilds = [
   {
     id: 'community-academy',
     name: 'COMMUNITY ACADEMY',
     tagline: 'LA RÉFÉRENCE ABSOLUE',
     description: 'Formation complète du débutant à l\'expert. Modules structurés et accompagnement personnalisé.',
     color: 'blue',
     gradient: 'from-blue-600 to-blue-500',
     icon: Icons.GraduationCap,
     members: 573,
     rating: 4.9,
     features: [
       'Formation structurée en 12 modules',
       'Mentors disponibles 7j/7',
       'Communauté active et soudée',
       'Accès gratuit Tier 1'
     ],
     stats: {
       actifs: 87,
       revenus: '€12K/mois',
       topPerformer: 'TIBO_MRT'
     }
   },
   {
     id: 'tbcb',
     name: 'TBCB',
     tagline: 'APPROCHE SANS BULLSHIT',
     description: 'Focus sur l\'action et les résultats rapides. Pour ceux qui veulent dominer les classements.',
     color: 'red',
     gradient: 'from-red-600 to-orange-500',
     icon: Icons.Fire,
     members: 234,
     rating: 4.8,
     features: [
       'Méthodes avancées de scaling',
       'Focus sur la conversion',
       'Compétitions internes',
       'Stratégies avancées'
     ],
     stats: {
       actifs: 92,
       revenus: '€9K/mois',
       topPerformer: 'SPIDER_CB'
     }
   }
 ]

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
       <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,0,0,0.01)] to-transparent" />
     </div>

     <HeaderLandingPage />

     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 z-10">
       <div className="max-w-5xl mx-auto text-center">
         <div className="text-[#FFB000] text-sm mb-4">GUILDES</div>

         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-8 text-[#B794F4] tracking-wider">
           C'EST QUOI UNE GUILDE ?
         </h1>

         <p className="text-sm md:text-base text-white max-w-3xl mx-auto mb-4">
           Les guildes sont des communautés indépendantes qui t'apprennent le community building.
           Rejoindre une guilde est obligatoire sur Weokto.
         </p>
         <p className="text-sm md:text-base text-[#FFB000]">
           100% GRATUIT POUR COMMENCER
         </p>
       </div>
     </section>

     {/* Guild Features */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Formation & Mentorat */}
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="border-2 border-[#B794F4] bg-black/90"
           >
             <div className="border-b-2 border-[#B794F4] p-2 flex items-center justify-between">
               <div className="text-xs">FORMATION_ET_MENTORAT</div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-xs text-green-500">ACTIVE</span>
               </div>
             </div>

             <div className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <Icons.GraduationCap size={24} className="text-[#FFB000]" />
                 <Icons.Users size={24} className="text-[#FFB000]" />
               </div>

               <h3 className="text-lg font-bold text-white mb-3">FORMATION & MENTORAT</h3>
               <p className="text-xs text-gray-400 mb-4">
                 Accès gratuit aux formations (Tier 1) et accompagnement personnalisé
                 par des experts qui ont déjà réussi.
               </p>

               <div className="space-y-2 text-xs">
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Modules progressifs du débutant à expert</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Mises à jour de stratégies chaque semaine</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Support 7j/7 par les mentors</span>
                 </div>
               </div>
             </div>
           </motion.div>

           {/* Compétitions & Entraide */}
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="border-2 border-[#B794F4] bg-black/90"
           >
             <div className="border-b-2 border-[#B794F4] p-2 flex items-center justify-between">
               <div className="text-xs">COMPETITION_ET_ENTRAIDE</div>
               <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <span className="text-xs text-green-500">ACTIVE</span>
               </div>
             </div>

             <div className="p-6">
               <div className="flex items-center gap-3 mb-4">
                 <Icons.Trophy size={24} className="text-[#FFB000]" />
                 <Icons.HandsClapping size={24} className="text-[#FFB000]" />
               </div>

               <h3 className="text-lg font-bold text-white mb-3">COMPÉTITIONS & ENTRAIDE</h3>
               <p className="text-xs text-gray-400 mb-4">
                 Participe aux saisons Weokto avec ta guilde.
                 La force du groupe te tire vers le succès.
               </p>

               <div className="space-y-2 text-xs">
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Compétitions par saison entre guildes</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Récompenses exclusives à gagner</span>
                 </div>
                 <div className="flex items-center gap-2">
                   <span className="text-[#FFB000]">✓</span>
                   <span>Ensemble on va plus loin, plus vite</span>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>
       </div>
     </section>

     {/* How it Works Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">COMMENT ÇA MARCHE</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             COMMENT ÇA FONCTIONNE
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
           {[
             {
               num: '1',
               title: 'REJOINS UNE GUILDE',
               desc: 'Obligatoire pour accéder à Weokto. Formation gratuite incluse.'
             },
             {
               num: '2',
               title: 'GÉNÈRE DES REVENUS',
               desc: 'Applique ce que tu apprends et commence à gagner de l\'argent.'
             },
             {
               num: '3',
               title: 'GAGNE AVEC TA GUILDE',
               desc: 'Participe aux compétitions Weokto entre guildes chaque saison.'
             }
           ].map((step, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="border border-[#B794F4] bg-black/80 p-6 text-center"
             >
               <div className="text-3xl font-bold text-[#FFB000] mb-4">[{step.num}]</div>
               <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
               <p className="text-xs text-gray-400">{step.desc}</p>
             </motion.div>
           ))}
         </div>

         <div className="border-2 border-[#FFB000] bg-black/90 p-6 text-center">
           <p className="text-sm text-[#FFB000] mb-4">
             <Icons.Info size={20} className="inline mr-2" />
             Les compétitions sont organisées par Weokto, pas par les guildes.
           </p>
           <a
             href="/infocompetition"
             className="inline-block px-6 py-2 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-sm font-bold"
           >
             DÉCOUVRIR LES COMPÉTITIONS
           </a>
         </div>
       </div>
     </section>

     {/* Quality Assurance */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="border-2 border-[#B794F4] bg-black/90 relative">
           <div className="border-b-2 border-[#B794F4] p-2 flex items-center justify-between">
             <div className="text-xs">QUALITY_CHECK</div>
             <Icons.Shield size={20} className="text-[#B794F4]" />
           </div>

           <div className="p-8">
             <h2 className="text-2xl font-mono font-bold text-white mb-6">
               ON VÉRIFIE TOUT, TOUT LE TEMPS
             </h2>

             <p className="text-sm text-gray-300 mb-8">
               Contrôle continu de chaque guilde partenaire:
             </p>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {[
                 { title: 'FORMATIONS À JOUR', desc: 'Contenu vérifié régulièrement' },
                 { title: 'MENTORS ACTIFS', desc: 'Réponses sous 24h' },
                 { title: 'SUIVI DES RÉSULTATS', desc: 'Stats mensuelles vérifiées' },
                 { title: 'TRANSPARENCE TOTALE', desc: 'Pas de bullshit, que du concret' }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-3">
                   <span className="text-[#FFB000]">✓</span>
                   <div>
                     <p className="text-white text-sm font-bold">{item.title}</p>
                     <p className="text-gray-400 text-xs">{item.desc}</p>
                   </div>
                 </div>
               ))}
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Guilds Showcase */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">GUILDS_AVAILABLE</div>
           <h2 className="text-2xl md:text-3xl text-[#B794F4]">
             DÉCOUVRE LES GUILDES
           </h2>
           <p className="text-sm text-white mt-4 max-w-2xl mx-auto">
             Chaque guilde a sa philosophie et ses méthodes. Trouve celle qui te correspond.
           </p>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {guilds.map((guild, index) => (
             <motion.div
               key={guild.id}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
             >
               <div className="border-2 border-[#B794F4] bg-black/90 overflow-hidden h-full">
                 {/* Guild Header */}
                 <div className={`h-32 bg-gradient-to-r ${guild.gradient} relative border-b-2 border-[#B794F4]`}>
                   <div className="absolute inset-0 bg-black/30"></div>
                   <div className="absolute inset-0" style={{
                     backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                   }}></div>
                   <div className="absolute inset-0 flex items-center justify-center">
                     <guild.icon size={48} weight="duotone" className="text-white/90" />
                   </div>
                   <div className="absolute top-3 right-3">
                     <span className="px-2 py-1 border border-white/50 text-xs font-mono text-white">
                       #{index + 1} {guild.color === 'blue' ? 'FORMATION' : 'RÉSULTATS'}
                     </span>
                   </div>
                 </div>

                 {/* Guild Content */}
                 <div className="p-6">
                   <h3 className="text-xl font-bold text-white mb-1">{guild.name}</h3>
                   <div className="text-xs text-[#FFB000] mb-3">{guild.tagline}</div>

                   {/* Stats Grid */}
                   <div className="border border-[#B794F4]/30 p-3 mb-4 font-mono">
                     <div className="text-xs space-y-1">
                       <div className="flex justify-between">
                         <span className="text-gray-400">STATUT:</span>
                         <span className="text-green-400">EN LIGNE</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400">MEMBRES:</span>
                         <span className="text-white">{guild.members}</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400">ACTIFS:</span>
                         <span className="text-white">{guild.stats.actifs}%</span>
                       </div>
                       <div className="flex justify-between">
                         <span className="text-gray-400">NOTE:</span>
                         <span className="text-[#FFB000]">{guild.rating}/5</span>
                       </div>
                     </div>
                   </div>

                   <p className="text-xs text-gray-300 mb-4 p-2 border-l-2 border-[#B794F4]/50">
                     {guild.description}
                   </p>

                   {/* Features */}
                   <div className="space-y-2 mb-6">
                     {guild.features.map((feature, idx) => (
                       <div key={idx} className="flex items-start gap-2">
                         <span className="text-[#FFB000] text-xs">✓</span>
                         <span className="text-xs text-gray-300">{feature}</span>
                       </div>
                     ))}
                   </div>

                   {/* Top Performer */}
                   <div className="border-t border-[#B794F4]/30 pt-4 mb-4">
                     <div className="text-center">
                       <p className="text-xs text-gray-500">TOP PERFORMER</p>
                       <p className="text-sm font-bold text-[#FFB000]">{guild.stats.topPerformer}</p>
                       <p className="text-xs text-gray-400">{guild.stats.revenus}</p>
                     </div>
                   </div>

                   {/* CTA Button */}
                   <button
                     onClick={() => window.location.href = `/guildes/${guild.id}`}
                     className={`w-full py-2.5 bg-gradient-to-r ${guild.gradient} text-white font-mono font-bold text-sm border-2 ${guild.color === 'blue' ? 'border-blue-400 hover:from-blue-700 hover:to-blue-600' : 'border-red-400 hover:from-red-700 hover:to-orange-600'} transition-all`}
                   >
                     REJOINDRE {guild.name.toUpperCase()}
                   </button>
                 </div>
               </div>
             </motion.div>
           ))}

           {/* Coming Soon Card */}
           <motion.div
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: guilds.length * 0.1 }}
           >
             <div className="border-2 border-gray-600 bg-black/90 overflow-hidden h-full">
               <div className="h-32 bg-gradient-to-r from-gray-800 to-gray-700 relative border-b-2 border-gray-600">
                 <div className="absolute inset-0 flex items-center justify-center">
                   <Icons.HourglassHigh size={48} className="text-gray-400 animate-pulse" />
                 </div>
                 <div className="absolute top-3 right-3">
                   <span className="px-2 py-1 border border-white/50 text-xs font-mono text-white">
                     COMING SOON
                   </span>
                 </div>
               </div>

               <div className="p-6">
                 <h3 className="text-xl font-bold text-white mb-1">NOUVELLE GUILDE</h3>
                 <div className="text-xs text-gray-400 mb-3">ARRIVÉE SAISON 1</div>

                 <p className="text-xs text-gray-300 mb-4 p-2 border-l-2 border-gray-600/50">
                   Une nouvelle guilde rejoindra Weokto lors de la Saison 1.
                   Prépare-toi à découvrir de nouvelles méthodes.
                 </p>

                 <div className="space-y-2 mb-6">
                   {['Méthodes exclusives', 'Approche innovante', 'Bonus de lancement'].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-2">
                       <Icons.Lock size={14} className="text-gray-600" />
                       <span className="text-xs text-gray-500">{item}</span>
                     </div>
                   ))}
                 </div>

                 <div className="text-center py-3 bg-gray-800/30">
                   <span className="text-gray-500 text-sm">
                     <Icons.Clock size={16} className="inline mr-2" />
                     BIENTÔT DISPONIBLE
                   </span>
                 </div>
               </div>
             </div>
           </motion.div>
         </div>

         {/* Method Comparison */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
           <div className="border border-[#B794F4] bg-black/90 p-4">
             <div className="text-center font-mono text-xs">
               <span className="text-blue-400">MÉTHODE ACADEMY</span>
               <p className="text-gray-400 mt-2">
                 APPRENDRE → PRATIQUER → MAÎTRISER → RÉUSSIR
               </p>
             </div>
           </div>
           <div className="border border-[#FFB000] bg-black/90 p-4">
             <div className="text-center font-mono text-xs">
               <span className="text-red-400">MÉTHODE TBCB</span>
               <p className="text-gray-400 mt-2">
                 ACTION → RÉSULTATS → SCALE → DOMINER
               </p>
             </div>
           </div>
         </div>
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
           {[
             {
               q: 'C\'EST TROP BEAU POUR ÊTRE VRAI',
               a: 'C\'est normal de douter. Regarde simplement les résultats des membres.'
             },
             {
               q: 'JE N\'AI PAS D\'EXPÉRIENCE',
               a: 'Parfait ! Les guildes sont faites pour ça. Formation progressive, accompagnement personnalisé et communauté bienveillante. 80% de nos top performers ont commencé de zéro.'
             },
             {
               q: 'JE N\'AI PAS LE TEMPS',
               a: '2-3h par jour suffisent pour commencer. Les revenus deviennent passifs une fois le système en place. Tu construis ton business, pas juste une activité.'
             },
             {
               q: 'C\'EST PAYANT ?',
               a: 'Chaque guilde propose un accès gratuit (Tier 1). Tu peux commencer sans rien payer et upgrader plus tard si tu veux aller plus vite. 100% gratuit pour commencer.'
             }
           ].map((faq, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: index * 0.05 }}
               viewport={{ once: true }}
             >
               <details className="group border border-[#B794F4]/30 bg-black/50 p-5 cursor-pointer hover:border-[#B794F4]/50 transition-all">
                 <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                   <span className="text-sm">{faq.q}</span>
                   <span className="text-[#FFB000] group-open:rotate-90 transition-transform ml-4">›</span>
                 </summary>
                 <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#B794F4]/30">
                   {faq.a}
                 </p>
               </details>
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* CTA Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4 text-center">
         <Icons.UsersThree size={48} className="text-[#FFB000] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
           PRÊT À REJOINDRE L'ÉLITE ?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           CHOISIS TA GUILDE ET COMMENCE TON ASCENSION VERS LA LIBERTÉ FINANCIÈRE.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             CHOISIR MA GUILDE
           </button>
         </div>

         {/* Discreet Partner Button */}
         <div className="mt-8">
           <button
             onClick={() => setShowPartnerForm(true)}
             className="text-xs text-gray-500 hover:text-gray-400 transition-colors underline underline-offset-4"
           >
             Devenir guilde partenaire
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

     {/* Partner Form Modal - Simplified for now */}
     {showPartnerForm && (
       <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
         <div className="border-2 border-[#B794F4] bg-black p-8 max-w-md w-full">
           <h3 className="text-xl font-bold text-[#B794F4] mb-4">DEVENIR PARTENAIRE</h3>
           <p className="text-sm text-white mb-6">
             Contactez-nous à: partners@weokto.com
           </p>
           <button
             onClick={() => setShowPartnerForm(false)}
             className="px-4 py-2 bg-[#B794F4] text-black hover:bg-[#B794F4]/80 transition-all text-sm font-bold"
           >
             FERMER
           </button>
         </div>
       </div>
     )}
   </div>
 )
}
