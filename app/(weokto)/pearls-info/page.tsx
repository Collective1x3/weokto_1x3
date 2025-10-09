'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderLandingPage from '@/components/weokto/HeaderLandingPage'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'

export default function InfoPearlsPage() {
 const [sliderValue, setSliderValue] = useState(250000)
 const [displayValue, setDisplayValue] = useState(250000)
 const canvasRef = useRef<HTMLCanvasElement>(null)

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

 const formatNumber = (num: number) => {
   if (num >= 1000000) {
     return `${(num / 1000000).toFixed(num >= 10000000 ? 0 : 1)}M€`
   } else if (num >= 1000) {
     return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K€`
   }
   return `${num}€`
 }

 const calculatePearls = (amount: number) => {
   return amount * 2
 }

 const formatPearls = (pearls: number) => {
   if (pearls >= 1000000) {
     return `${(pearls / 1000000).toFixed(pearls >= 10000000 ? 0 : 1)}M`
   } else if (pearls >= 1000) {
     return `${(pearls / 1000).toFixed(pearls >= 10000 ? 0 : 1)}K`
   }
   return pearls.toLocaleString('fr-FR')
 }

 const rewards = [
   {
     icon: Icons.PaintBrush,
     title: 'COSMÉTIQUES',
     description: 'Badges, bordures, effets visuels pour personnaliser ton profil',
     pearls: 'À PARTIR DE 500',
     color: '#B794F4'
   },
   {
     icon: Icons.Lightning,
     title: 'BOOSTS DE COMMISSIONS',
     description: 'Augmente tes commissions chez certains fournisseurs partenaires',
     pearls: 'À PARTIR DE 2,000',
     color: '#FFB000'
   },
   {
     icon: Icons.Ticket,
     title: 'ÉVÉNEMENTS EXCLUSIFS',
     description: 'Accès VIP aux événements Weokto, masterclasses et networking',
     pearls: 'À PARTIR DE 5,000',
     color: '#3B82F6'
   },
   {
     icon: Icons.AirplaneTilt,
     title: 'VOYAGES ET EXPÉRIENCES',
     description: 'Trips exclusifs avec la communauté, séjours et aventures uniques',
     pearls: 'À PARTIR DE 20,000',
     color: '#10B981'
   }
 ]

 const faqItems = [
   {
     q: 'COMMENT GAGNER DES PEARLS ?',
     a: '1€ de vente générée = 2 Pearls. C\'est calculé sur le montant total de la vente, pas sur ta commission. Une vente à 100€ te rapporte 200 Pearls. Tu peux aussi en gagner pendant les compétitions.'
   },
   {
     q: 'À QUOI SERVENT LES PEARLS ?',
     a: 'Les Pearls te permettent d\'acheter des cosmétiques pour ton profil, des boosts de commissions chez certains fournisseurs, l\'accès à des événements exclusifs, et même des voyages avec la communauté.'
   },
   {
     q: 'PUIS-JE ÉCHANGER MES PEARLS CONTRE DE L\'ARGENT ?',
     a: 'Non, les Pearls ne sont pas une monnaie. Elles ne peuvent pas être échangées contre de l\'argent réel. C\'est un système de récompenses pour valoriser les créateurs actifs.'
   },
   {
     q: 'LES COSMÉTIQUES SONT-ILS ÉCHANGEABLES ?',
     a: 'Non, les cosmétiques et autres récompenses ne sont pas échangeables entre membres. Chaque récompense est liée à ton compte personnel.'
   },
   {
     q: 'POURQUOI CE SYSTÈME EXISTE ?',
     a: 'Les Pearls permettent à Weokto et aux fournisseurs de reverser une partie de leurs profits aux créateurs. C\'est notre façon de créer une plateforme équitable.'
   },
   {
     q: 'LES PEARLS EXPIRENT-ELLES ?',
     a: 'Non, tes Pearls n\'expirent jamais. Tu peux les accumuler aussi longtemps que tu veux avant de les utiliser.'
   },
   {
     q: 'Y A-T-IL DES MULTIPLICATEURS DE PEARLS ?',
     a: 'Oui ! Pendant les compétitions et événements spéciaux, tu peux gagner des multiplicateurs x2, x3 ou plus sur tes Pearls.'
   },
   {
     q: 'COMMENT VOIR MON SOLDE DE PEARLS ?',
     a: 'Ton solde de Pearls est visible dans ton dashboard Weokto, avec l\'historique complet de tes gains et dépenses.'
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
         <div className="text-[#FFB000] text-sm mb-4">SYSTÈME DE RÉCOMPENSES</div>

         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 text-[#B794F4] tracking-wider">
           LES PEARLS WEOKTO
         </h1>

         <p className="text-sm md:text-base text-white mb-4">
           PLUS TU VENDS, PLUS TU GAGNES. 1€ GÉNÉRÉ = 2 PEARLS.
         </p>
         <p className="text-sm md:text-base text-[#FFB000]">
           ÉCHANGE TES PEARLS CONTRE DES RÉCOMPENSES EXCLUSIVES.
         </p>
       </div>
     </section>

     {/* Conversion Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">SIMULATEUR</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             COMMENT ÇA MARCHE
           </h2>
         </div>

         {/* Simulator */}
         <div className="border-2 border-[#FFB000] bg-black/90 p-8 mb-12">
           <div className="max-w-3xl mx-auto">
             <div className="text-center mb-8">
               <p className="text-xs text-gray-400 mb-2">VENTES TOTALES GÉNÉRÉES</p>
               <div className="text-4xl md:text-5xl font-bold text-[#FFB000]">
                 {formatNumber(displayValue)}
               </div>
             </div>

             {/* Slider */}
             <div className="mb-8">
               <input
                 type="range"
                 min="10"
                 max="10000000"
                 value={sliderValue}
                 onChange={(e) => {
                   const value = Number(e.target.value)
                   setSliderValue(value)
                   setDisplayValue(value)
                 }}
                 className="w-full h-2 bg-[#B794F4]/20 rounded-lg appearance-none cursor-pointer slider"
                 style={{
                   background: `linear-gradient(to right, #FFB000 0%, #FFB000 ${(sliderValue / 10000000) * 100}%, rgba(183, 148, 244, 0.2) ${(sliderValue / 10000000) * 100}%, rgba(183, 148, 244, 0.2) 100%)`
                 }}
               />
               <div className="flex justify-between mt-2 text-xs text-gray-500">
                 <span>10€</span>
                 <span>10M€</span>
               </div>
             </div>

             {/* Results Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border border-[#B794F4] bg-black/80 p-6 text-center">
                 <Icons.Coins size={32} className="text-[#FFB000] mx-auto mb-3" />
                 <p className="text-xs text-gray-400 mb-2">PEARLS GAGNÉES</p>
                 <p className="text-3xl font-bold text-[#FFB000]">
                   {formatPearls(calculatePearls(displayValue))}
                 </p>
                 <p className="text-xs text-gray-500 mt-2">2 PEARLS PAR EURO GÉNÉRÉ</p>
               </div>

               <div className="border border-[#B794F4] bg-black/80 p-6 text-center">
                 <p className="text-xs text-gray-400 mb-2">RÉCOMPENSE DÉBLOQUÉE</p>
                 <div className="text-2xl font-bold text-white mb-2">
                   {displayValue < 250 ? 'BADGE BRONZE' :
                    displayValue < 500 ? 'BADGE ARGENT' :
                    displayValue < 1000 ? 'BADGE OR' :
                    displayValue < 2500 ? 'COSMÉTIQUES' :
                    displayValue < 5000 ? 'BOOST +5%' :
                    displayValue < 10000 ? 'BOOST +10%' :
                    displayValue < 25000 ? 'GROUPE VIP' :
                    displayValue < 50000 ? 'BOOST +15%' :
                    displayValue < 100000 ? 'MASTERMIND' :
                    displayValue < 250000 ? 'ÉVÉNEMENT VIP' :
                    displayValue < 500000 ? 'MASTERCLASS' :
                    displayValue < 750000 ? 'WEEKEND VIP' :
                    displayValue < 1000000 ? 'VOYAGE EUROPE' :
                    displayValue < 1500000 ? 'VOYAGE USA' :
                    displayValue < 2000000 ? 'VOYAGE ASIE' :
                    displayValue < 3000000 ? 'MONTRE LUXE' :
                    displayValue < 4000000 ? 'VOYAGE MONDE' :
                    displayValue < 5000000 ? 'ROLEX' :
                    displayValue < 6000000 ? 'VOYAGE PRIVÉ' :
                    displayValue < 7000000 ? 'JET PRIVÉ' :
                    displayValue < 8000000 ? 'VOITURE SPORT' :
                    displayValue < 9000000 ? 'YACHT CHARTER' :
                    displayValue < 10000000 ? 'LAMBO' :
                    'CERCLE PRIVÉ'}
                 </div>
                 <div className="text-xs text-[#FFB000]">
                   [✓] DÉBLOQUÉ
                 </div>
               </div>
             </div>

             <div className="mt-6 text-center">
               <p className="text-xs text-gray-500">
                 * Simulation indicative. Les récompenses varient selon les saisons.
               </p>
             </div>
           </div>
         </div>

         {/* Info Box */}
         <div className="border-2 border-[#B794F4] bg-black/90 p-6">
           <div className="flex items-start gap-4">
             <Icons.Star size={24} className="text-[#FFB000] mt-1" />
             <div>
               <h3 className="text-lg font-bold text-white mb-2">BON À SAVOIR</h3>
               <p className="text-sm text-gray-300">
                 Les Pearls sont calculées sur le montant total de la vente, pas sur ta commission.
                 Une vente à 100€ te rapporte 200 Pearls, peu importe ta commission.
                 C'est notre façon de récompenser ton effort de vente.
               </p>
               <div className="flex flex-wrap gap-3 mt-4">
                 <span className="text-xs text-[#FFB000]">[✓] CALCUL SUR VENTE TOTALE</span>
                 <span className="text-xs text-[#FFB000]">[✓] INDÉPENDANT DES COMMISSIONS</span>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Rewards Grid */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">REWARDS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             CATALOGUE DES RÉCOMPENSES
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {rewards.map((reward, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="border border-[#B794F4] bg-black/90"
             >
               <div className="border-b border-[#B794F4] p-2 flex items-center justify-between">
                 <div className="text-xs">REWARD_{index + 1}</div>
                 <reward.icon size={20} style={{ color: reward.color }} />
               </div>

               <div className="p-6">
                 <h3 className="text-lg font-bold text-white mb-2">{reward.title}</h3>
                 <p className="text-xs text-gray-400 mb-4">{reward.description}</p>
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-black border border-[#FFB000]">
                   <Icons.Coins size={14} className="text-[#FFB000]" />
                   <span className="text-xs font-bold text-[#FFB000]">{reward.pearls} PEARLS</span>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* Vision Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">NOTRE VISION</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             PLUS QU'UNE PLATEFORME, UNE AVENTURE
           </h2>
         </div>

         <div className="border-2 border-[#FFB000] bg-black/90 p-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
             <div className="text-center">
               <Icons.UsersThree size={48} className="text-[#FFB000] mx-auto mb-3" />
               <h3 className="text-sm font-bold text-white mb-2">FORCE COLLECTIVE</h3>
               <p className="text-xs text-gray-400">
                 Le groupe gagnera toujours face à un individu seul
               </p>
             </div>
             <div className="text-center">
               <Icons.Rocket size={48} className="text-[#B794F4] mx-auto mb-3" />
               <h3 className="text-sm font-bold text-white mb-2">SCALE ENSEMBLE</h3>
               <p className="text-xs text-gray-400">
                 Masterminds et voyages pour grandir ensemble
               </p>
             </div>
             <div className="text-center">
               <Icons.Trophy size={48} className="text-[#10B981] mx-auto mb-3" />
               <h3 className="text-sm font-bold text-white mb-2">VIVRE L'AVENTURE</h3>
               <p className="text-xs text-gray-400">
                 Plus que de l'argent, des expériences uniques
               </p>
             </div>
           </div>

           <div className="text-center pt-8 border-t border-[#FFB000]/30">
             <p className="text-sm text-gray-300 mb-4">
               Weokto est un moyen facile de faire de l'argent, mais c'est surtout une façon d'atteindre des sommets ensemble.
             </p>
             <p className="text-lg font-bold text-white">
               CE GROUPE, C'EST <span className="text-[#FFB000]">WEOKTO</span>.
             </p>
           </div>
         </div>
       </div>
     </section>

     {/* Philosophy */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-4">
         <div className="border-2 border-[#B794F4] bg-black/90 p-8 text-center">
           <Icons.Scales size={48} className="text-[#FFB000] mx-auto mb-6" />
           <p className="text-sm text-gray-300 mb-6">
             Les Pearls ne sont pas une monnaie et ne peuvent pas être échangées contre de l'argent.
             Les cosmétiques ne sont pas échangeables entre membres.
           </p>
           <p className="text-xs text-gray-400">
             C'est notre façon de reverser une partie de nos profits et ceux des fournisseurs
             directement aux créateurs. Une plateforme équitable où chaque effort est récompensé.
           </p>
         </div>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="inline-flex items-center gap-2 mb-4">
             <span className="text-[#FFB000] text-sm font-mono">FAQ</span>
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
           {faqItems.map((faq, index) => (
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
         <Icons.Trophy size={48} className="text-[#FFB000] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
           COMMENCE À GAGNER DES PEARLS
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           REJOINS WEOKTO ET TRANSFORME CHAQUE VENTE EN RÉCOMPENSES EXCLUSIVES.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             [COMMENCER À GAGNER]
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

       .slider::-webkit-slider-thumb {
         appearance: none;
         width: 20px;
         height: 20px;
         background: #FFB000;
         cursor: pointer;
         border-radius: 50%;
         border: 2px solid #000;
       }

       .slider::-moz-range-thumb {
         width: 20px;
         height: 20px;
         background: #FFB000;
         cursor: pointer;
         border-radius: 50%;
         border: 2px solid #000;
       }
     `}</style>
   </div>
 )
}
