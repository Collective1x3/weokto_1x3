'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderLandingPage from '@/components/weokto/HeaderLandingPage'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'

export default function InfoOutilsPage() {
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

 const tools = [
   {
     id: 'carousel',
     icon: Icons.Cards,
     title: 'CRÉATEUR DE CARROUSELS',
     description: 'Génère des carrousels ultra-engageants adaptés à chaque produit fournisseur',
     features: [
       'Templates optimisés par niche',
       'Personnalisation automatique',
       'Export en un clic',
       'A/B testing intégré'
     ],
     status: 'beta',
     color: '#B794F4'
   },
   {
     id: 'video',
     icon: Icons.VideoCamera,
     title: 'GÉNÉRATEUR DE VIDÉOS',
     description: 'Créé des vidéos TikTok/Reels qui convertissent, sans montage',
     features: [
       'Scripts personnalisés',
       'Montage automatique',
       'Musique et trends',
       'Optimisation par plateforme'
     ],
     status: 'coming',
     color: '#FFB000'
   },
   {
     id: 'planning',
     icon: Icons.Calendar,
     title: 'CONTENT MANAGEMENT',
     description: 'Planifie et publie ton contenu sur 30 jours en quelques minutes',
     features: [
       'Calendrier intelligent',
       'Publication multi-plateformes',
       'Heures optimales',
       'File d\'attente automatique'
     ],
     status: 'beta',
     color: '#10B981'
   },
   {
     id: 'analytics',
     icon: Icons.ChartLineUp,
     title: 'ANALYTICS AVANCÉES',
     description: 'Tracking complet de tes performances et optimisation IA',
     features: [
       'ROI par contenu',
       'Analyse prédictive',
       'Suggestions d\'amélioration',
       'Rapports détaillés'
     ],
     status: 'coming',
     color: '#EF4444'
   },
   {
     id: 'style',
     icon: Icons.PaintBrush,
     title: 'STYLE CREATOR',
     description: 'Développe ton style unique et reste cohérent sur toutes tes publications',
     features: [
       'Brand kit personnel',
       'Cohérence visuelle',
       'Templates sur mesure',
       'Evolution automatique'
     ],
     status: 'beta',
     color: '#3B82F6'
   },
   {
     id: 'automation',
     icon: Icons.Robot,
     title: 'AUTOMATISATION IA',
     description: 'L\'IA qui comprend ton audience et créé du contenu qui convertit',
     features: [
       'Analyse d\'audience',
       'Génération de hooks',
       'Copywriting optimisé',
       'Tests automatiques'
     ],
     status: 'coming',
     color: '#F59E0B'
   }
 ]

 const pricingTiers = [
   {
     name: 'STARTER',
     price: '9€',
     credits: '1,000',
     features: [
       '1,000 crédits/mois',
       'Outils de base',
       'Support communauté',
       'Export standard'
     ]
   },
   {
     name: 'GROWTH',
     price: '29€',
     credits: '5,000',
     popular: true,
     features: [
       '5,000 crédits/mois',
       'Tous les outils',
       'Support prioritaire',
       'Analytics avancées',
       'Export HD'
     ]
   },
   {
     name: 'SCALE',
     price: '79€',
     credits: '20,000',
     features: [
       '20,000 crédits/mois',
       'Accès illimité',
       'Support dédié',
       'API access',
       'Custom branding'
     ]
   }
 ]

 const faqs = [
   {
     q: "SUIS-JE OBLIGÉ D'UTILISER LES OUTILS WEOKTO ?",
     a: "Non ! C'est 100% optionnel. Tu peux créer ton contenu comme tu veux, avec tes propres outils. Nos outils sont là pour t'aider si tu en as besoin, pas pour t'imposer une méthode."
   },
   {
     q: "COMMENT FONCTIONNENT LES CRÉDITS ?",
     a: "1 crédit = 1 utilisation d'outil (ex: 1 carrousel généré). Tu peux acheter des crédits ou en gagner gratuitement via les compétitions, challenges et parrainages. Les crédits n'expirent jamais."
   },
   {
     q: "LES OUTILS SONT-ILS ADAPTÉS À TOUS LES PRODUITS ?",
     a: "Oui ! Nos IA sont entraînées sur chaque produit fournisseur. Elles comprennent les spécificités de chaque niche et créent du contenu personnalisé qui convertit."
   },
   {
     q: "QUAND LES OUTILS SERONT-ILS DISPONIBLES ?",
     a: "Progressivement dès la Saison 1. Les membres les plus actifs auront un accès early beta. Certains outils sont déjà en test privé."
   },
   {
     q: "EST-CE QUE L'IA REMPLACE MA CRÉATIVITÉ ?",
     a: "Jamais ! L'IA est ton assistant, pas ton remplaçant. Elle te fait gagner du temps sur la production pour que tu puisses te concentrer sur ta stratégie et ta personnalité unique."
   },
   {
     q: "COMMENT ÊTRE SÛR QUE LE CONTENU SERA UNIQUE ?",
     a: "Chaque génération est unique et personnalisée selon ton style. L'IA ne fait jamais deux fois le même contenu, même pour le même produit."
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
         <div className="text-[#FFB000] text-sm mb-4">BÊTA - DISPONIBLE SAISON 1</div>

         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 text-[#B794F4] tracking-wider">
           L'IA QUI CRÉÉ TON CONTENU
         </h1>

         <p className="text-sm md:text-base text-white mb-4">
           30 JOURS DE CONTENU EN 30 MINUTES.
         </p>
         <p className="text-sm md:text-base text-[#FFB000]">
           DES OUTILS IA CONÇUS POUR LES CRÉATEURS WEOKTO.
         </p>
       </div>
     </section>

     {/* Important Notice */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="border-2 border-[#FFB000] bg-black/90 p-8">
           <div className="flex items-center gap-3 mb-6">
             <Icons.Info size={24} className="text-[#FFB000]" />
             <h2 className="text-xl font-mono font-bold text-[#FFB000]">IMPORTANT À SAVOIR</h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="space-y-4">
               <div className="flex items-start gap-2">
                 <span className="text-[#10B981]">✓</span>
                 <div>
                   <p className="text-sm text-white font-bold mb-1">100% OPTIONNEL</p>
                   <p className="text-xs text-gray-400">Tu n'es jamais obligé d'utiliser nos outils. Créé ton contenu comme tu veux.</p>
                 </div>
               </div>
               <div className="flex items-start gap-2">
                 <span className="text-[#10B981]">✓</span>
                 <div>
                   <p className="text-sm text-white font-bold mb-1">CRÉDITS GRATUITS</p>
                   <p className="text-xs text-gray-400">Gagne des crédits en participant aux compétitions et challenges.</p>
                 </div>
               </div>
             </div>

             <div className="space-y-4">
               <div className="flex items-start gap-2">
                 <span className="text-[#10B981]">✓</span>
                 <div>
                   <p className="text-sm text-white font-bold mb-1">ARRIVÉE PROGRESSIVE</p>
                   <p className="text-xs text-gray-400">Les outils arrivent petit à petit. Early access pour les plus actifs.</p>
                 </div>
               </div>
               <div className="flex items-start gap-2">
                 <span className="text-[#10B981]">✓</span>
                 <div>
                   <p className="text-sm text-white font-bold mb-1">PRIX ACCESSIBLES</p>
                   <p className="text-xs text-gray-400">On veut que tu réussisses. Prix pensés pour être rentables dès le 1er jour.</p>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Tools Showcase */}
     <section className="py-20 relative z-10">
       <div className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">OUTILS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             LES OUTILS QUI CHANGENT LA DONNE
           </h2>
           <p className="text-sm text-gray-400 mt-2">
             Conçus spécifiquement pour les créateurs Weokto. Optimisés pour convertir.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {tools.map((tool, index) => (
             <motion.div
               key={tool.id}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="border border-[#B794F4]/30 bg-black/90 p-6 hover:border-[#B794F4] transition-all relative"
             >
               {tool.status === 'beta' && (
                 <div className="absolute -top-3 -right-3">
                   <span className="px-2 py-1 bg-[#FFB000] text-black text-xs font-bold">BÊTA</span>
                 </div>
               )}
               {tool.status === 'coming' && (
                 <div className="absolute -top-3 -right-3">
                   <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs font-bold">BIENTÔT</span>
                 </div>
               )}

               <div className="mb-4">
                 <tool.icon size={32} className="mb-3" style={{ color: tool.color }} />
                 <h3 className="text-sm font-bold text-white mb-2">{tool.title}</h3>
                 <p className="text-xs text-gray-400">{tool.description}</p>
               </div>

               <div className="space-y-1">
                 {tool.features.map((feature, idx) => (
                   <div key={idx} className="text-xs text-gray-300">
                     <span className="text-[#B794F4]"></span> {feature}
                   </div>
                 ))}
               </div>

               <button
                 className={`mt-6 w-full py-2 text-xs font-bold transition-all ${
                   tool.status === 'coming'
                     ? 'border border-gray-700 text-gray-500 cursor-not-allowed'
                     : 'border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black'
                 }`}
                 disabled={tool.status === 'coming'}
               >
                 {tool.status === 'coming' ? 'PROCHAINEMENT' : 'DISPONIBLE EN BÊTA'}
               </button>
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* How It Works */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">PROCESSUS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             COMMENT ÇA MARCHE
           </h2>
           <p className="text-sm text-gray-400 mt-2">
             3 étapes pour transformer ta création de contenu
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             {
               step: '01',
               icon: Icons.Target,
               title: 'CHOISIS TON PRODUIT',
               description: 'Sélectionne un produit d\'un fournisseur Weokto que tu veux promouvoir'
             },
             {
               step: '02',
               icon: Icons.MagicWand,
               title: 'L\'IA FAIT LE TRAVAIL',
               description: 'Nos outils créent du contenu optimisé pour ce produit spécifique'
             },
             {
               step: '03',
               icon: Icons.Rocket,
               title: 'PUBLIE ET MONÉTISE',
               description: 'Exporte, programme et publie. Puis convertit tes clients'
             }
           ].map((item, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.15 }}
               viewport={{ once: true }}
               className="text-center"
             >
               <div className="mb-6 relative inline-block">
                 <div className="w-20 h-20 border-2 border-[#B794F4] bg-black flex items-center justify-center">
                   <item.icon size={32} className="text-[#B794F4]" />
                 </div>
                 <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#FFB000] flex items-center justify-center">
                   <span className="text-black font-bold text-xs">{item.step}</span>
                 </div>
               </div>
               <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
               <p className="text-xs text-gray-400">{item.description}</p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* Pricing Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">COMING SOON - SAISON 1</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             DES PRIX PENSÉS POUR TA RÉUSSITE
           </h2>
           <p className="text-sm text-gray-400 mt-2">
             Investissement minimal, ROI maximal. Et des crédits gratuits à gagner en permanence.
           </p>
         </div>

         <div className="relative">
           {/* Blurred Pricing Cards */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-30 blur-sm">
             {pricingTiers.map((tier, index) => (
               <div
                 key={index}
                 className={`border ${tier.popular ? 'border-[#FFB000]' : 'border-[#B794F4]/30'} bg-black/90 p-6`}
               >
                 {tier.popular && (
                   <div className="text-center mb-2">
                     <span className="px-3 py-1 bg-[#FFB000] text-black text-xs font-bold">
                       POPULAIRE
                     </span>
                   </div>
                 )}
                 <h3 className="text-lg font-bold text-white mb-2 text-center">{tier.name}</h3>
                 <div className="text-center mb-4">
                   <span className="text-3xl font-bold text-white">{tier.price}</span>
                   <span className="text-gray-400">/mois</span>
                 </div>
                 <div className="text-sm text-[#FFB000] font-bold mb-4 text-center">
                   {tier.credits} CRÉDITS
                 </div>
                 <ul className="space-y-2 mb-6">
                   {tier.features.map((feature, idx) => (
                     <li key={idx} className="text-xs text-gray-300">
                       ✓ {feature}
                     </li>
                   ))}
                 </ul>
                 <button className="w-full py-2 border border-[#B794F4] text-[#B794F4] text-xs font-bold">
                   [BIENTÔT DISPONIBLE]
                 </button>
               </div>
             ))}
           </div>

           {/* Overlay Message */}
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="border-2 border-[#FFB000] bg-black/95 p-8 max-w-lg text-center">
               <Icons.Lock size={48} className="text-[#B794F4] mx-auto mb-4" />
               <h3 className="text-xl font-bold text-white mb-3">DISPONIBLE SAISON 1</h3>
               <p className="text-sm text-gray-300 mb-6">
                 Les prix seront dévoilés au lancement de la Saison 1.
               </p>
               <div className="border border-[#B794F4] bg-black/90 p-4">
                 <p className="text-sm text-[#FFB000] font-bold mb-2">
                   COMMENT GAGNER DES CRÉDITS GRATUITS :
                 </p>
                 <ul className="text-xs text-gray-400 space-y-1 text-left">
                   <li>Participe aux compétitions</li>
                   <li>Complete les challenges hebdomadaires</li>
                   <li>Atteins des milestones de revenus</li>
                 </ul>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">FAQ</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             QUESTIONS FRÉQUENTES
           </h2>
         </div>

         <div className="space-y-4">
           {faqs.map((faq, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               transition={{ delay: index * 0.05 }}
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
         <Icons.Sparkle size={48} className="text-[#FFB000] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
           PRÊT À AUTOMATISER TA CRÉATION ?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           REJOINS WEOKTO MAINTENANT ET SOIS PARMI LES PREMIERS À TESTER NOS OUTILS IA RÉVOLUTIONNAIRES.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             COMMENCER MAINTENANT
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
