'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderLandingPage from '@/components/weokto/HeaderLandingPage'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'

export default function InfoRevenusPage() {
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

 const processSteps = [
   {
     title: 'TU RAMÈNES LES CLIENTS',
     description: 'Tu fais la promotion des communautés et génères des ventes avec ton lien unique',
     who: 'TOI',
     icon: Icons.Megaphone,
     color: '#FFB000'
   },
   {
     title: 'LES FOURNISSEURS GÈRENT',
     description: 'Ils s\'occupent du produit, de la communauté, du support et de toute la livraison de valeur',
     who: 'FOURNISSEUR',
     icon: Icons.Buildings,
     color: '#B794F4'
   },
   {
     title: 'WEOKTO GÈRE TOUT',
     description: 'On encaisse tous les paiements et on paie créateurs ET fournisseurs. Support, refunds, litiges : tout est géré',
     who: 'WEOKTO',
     icon: Icons.CurrencyCircleDollar,
     color: '#B794F4'
   }
 ]

 const paymentFeatures = [
   {
     title: 'PAIEMENTS SÉCURISÉS',
     description: 'On gère les paiements via nos partenaires. On optimise au maximum les frais.',
     icon: Icons.Bank
   },
   {
     title: 'DASHBOARD WEOKTO',
     description: 'Stats en temps réel, suivi des commissions, historique complet. Tout est centralisé.',
     icon: Icons.ChartBar
   },
   {
     title: 'RETRAITS FLEXIBLES',
     description: 'Demande tes payouts directement depuis Weokto. On les traite en quelques jours ouvrés.',
     icon: Icons.Clock
   },
   {
     title: 'TRANSPARENCE TOTALE',
     description: 'Dashboard détaillé, historique complet, suivi en temps réel. Tu sais toujours où tu en es.',
     icon: Icons.ShieldCheck
   }
 ]

 const faqItems = [
   {
     q: 'QUI GÈRE LES CLIENTS APRÈS LA VENTE ?',
     a: 'Les fournisseurs s\'occupent de tout : onboarding, support, livraison du produit, animation de la communauté. Tu te concentres uniquement sur l\'acquisition de nouveaux clients.'
   },
   {
     q: 'COMMENT FONCTIONNE LE SYSTÈME DE PAIEMENT ?',
     a: 'Les clients paient via nos partenaires de paiement sécurisés. Les commissions sont calculées automatiquement et versées selon les règles de validation. Tu peux suivre tout en temps réel sur ton dashboard Weokto.'
   },
   {
     q: 'QUAND PUIS-JE RETIRER MES COMMISSIONS ?',
     a: 'Les retraits sont disponibles après validation des ventes. Tu peux demander un payout directement depuis ton dashboard Weokto. Le traitement se fait en quelques jours ouvrés.'
   },
   {
     q: 'QUE SE PASSE-T-IL SI UN CLIENT ANNULE ?',
     a: 'Si l\'annulation arrive pendant la période de garantie, la commission est annulée. Après validation, tu gardes les commissions déjà versées. Les revenus récurrents s\'arrêtent à la fin de l\'abonnement.'
   },
   {
     q: 'COMMENT SUIVRE MES PERFORMANCES ?',
     a: 'Dashboard complet sur Weokto : nombre de ventes, taux de conversion, revenus totaux, commissions en attente, historique complet. Tout est transparent et en temps réel.'
   },
   {
     q: 'PUIS-JE VENDRE PLUSIEURS PRODUITS ?',
     a: 'Oui ! Tu peux rejoindre plusieurs fournisseurs et vendre différentes communautés. Diversifie tes sources de revenus pour maximiser tes gains.'
   },
   {
     q: 'QUI GÈRE LES PAIEMENTS ?',
     a: 'Weokto encaisse tous les paiements clients et redistribue aux créateurs ET aux fournisseurs. C\'est ce qui garantit que tout le monde soit payé. Les fournisseurs sont vérifiés et les transactions sont sécurisées via nos partenaires de paiement.'
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
     </div>

     <HeaderLandingPage />

     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 z-10">
       <div className="max-w-5xl mx-auto text-center">
         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 text-[#B794F4] tracking-wider">
           TU VENDS, ON GÈRE TOUT
         </h1>

         <p className="text-sm md:text-base text-white mb-4">
           FOCUS SUR L'ACQUISITION.
         </p>
         <p className="text-sm md:text-base text-[#FFB000]">
           LES FOURNISSEURS LIVRENT LA VALEUR, WEOKTO GÈRE LES PAIEMENTS.
         </p>
       </div>
     </section>

     {/* Process Flow Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">QUI FAIT QUOI</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             UNE RÉPARTITION CLAIRE DES RÔLES
           </h2>
           <p className="text-sm text-gray-400 mt-2">
             Chacun son expertise pour un système qui fonctionne
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {processSteps.map((step, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.15 }}
               className="relative"
             >
               <div className="border border-[#B794F4]/30 bg-black/90 p-6 hover:border-[#B794F4] transition-all h-full">
                 <div className="absolute -top-3 -right-3">
                   <span
                     className="px-3 py-1 text-xs font-bold text-black"
                     style={{ backgroundColor: step.color }}
                   >
                     [{step.who}]
                   </span>
                 </div>

                 <div className="mb-4">
                   <step.icon size={32} className="text-[#B794F4]" />
                 </div>

                 <h3 className="text-sm font-bold mb-3 text-white">
                   {step.title}
                 </h3>
                 <p className="text-xs text-gray-400">
                   {step.description}
                 </p>

                 {step.who === 'FOURNISSEUR' && (
                   <p className="text-xs text-[#B794F4] mt-3 italic">
                     *Avec supervision Weokto à toutes les étapes
                   </p>
                 )}
               </div>

               {index < processSteps.length - 1 && (
                 <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2">
                   <Icons.ArrowRight size={24} className="text-[#B794F4]/50" />
                 </div>
               )}
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* Payment Features */}
     <section className="py-20 relative z-10">
       <div className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">PAIEMENTS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             COMMENT FONCTIONNENT LES PAIEMENTS
           </h2>
           <p className="text-sm text-gray-400 mt-2">
             Simple, transparent et automatisé. Tout est géré pour toi.
           </p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {paymentFeatures.map((feature, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
               whileInView={{ opacity: 1, x: 0 }}
               transition={{ delay: index * 0.1 }}
               viewport={{ once: true }}
               className="border border-[#B794F4]/30 bg-black/90 p-6 hover:border-[#B794F4] transition-all"
             >
               <div className="flex gap-4">
                 <div className="flex-shrink-0">
                   <feature.icon size={24} className="text-[#FFB000]" />
                 </div>
                 <div className="flex-1">
                   <h3 className="text-sm font-bold text-white mb-2">
                     {feature.title}
                   </h3>
                   <p className="text-xs text-gray-400">
                     {feature.description}
                   </p>
                 </div>
               </div>
             </motion.div>
           ))}
         </div>

         {/* Important Note */}
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           className="mt-12"
         >
           <details className="group border-2 border-[#FFB000] bg-black/90 p-6 cursor-pointer">
             <summary className="flex items-center justify-between font-mono text-[#FFB000] marker:content-none">
               <div className="flex items-center gap-3">
                 <Icons.Info size={24} className="text-[#FFB000]" />
                 <span className="text-lg font-bold">BON À SAVOIR</span>
               </div>
               <span className="text-[#FFB000] group-open:rotate-90 transition-transform">›</span>
             </summary>
             <p className="mt-4 text-sm text-gray-300 pl-9 text-left">
               Weokto encaisse tous les paiements et redistribue aux créateurs et fournisseurs.
               C'est ce qui garantit que tout le monde soit payé. On gère tout de manière transparente et sécurisée.
             </p>
           </details>
         </motion.div>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="text-[#FFB000] text-sm mb-4">FAQ</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#B794F4]">
             QUESTIONS FRÉQUENTES SUR LES REVENUS
           </h2>
         </div>

         <div className="space-y-4">
           {faqItems.map((faq, index) => (
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
         <Icons.CurrencyCircleDollar size={48} className="text-[#FFB000] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
           PRÊT À GÉNÉRER DES REVENUS PASSIFS ?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           REJOINS WEOKTO ET COMMENCE À VENDRE DES COMMUNAUTÉS DÈS AUJOURD'HUI.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#B794F4] text-black hover:bg-[#B794F4]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             [COMMENCER MAINTENANT]
           </button>
         </div>
       </div>
     </section>

     {/* Footer */}
     <FooterLandingPage showSupplierCTA={true} />

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
