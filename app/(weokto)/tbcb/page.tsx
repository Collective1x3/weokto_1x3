'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderTBCB from '@/components/weokto/HeaderTBCB'
import FooterTBCB from '@/components/weokto/FooterTBCB'

export default function LPTBCBPage() {
 const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'quarterly' | 'biannual'>('monthly')
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

     ctx.fillStyle = '#EF4444'
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

 const testimonials = [
   {
     name: "Jules",
     content: "J'ai appliqué la méthode TBCB et boom, 500k vues en 2 semaines. Les coachs sont pas là pour être pote avec toi, ils sont là pour te faire réussir et c'est parfait.",
     revenue: "€5K/mois",
     image: "/images/pfptestimonialcowboy.png"
   },
   {
     name: "Nolan13",
     content: "TBCB c'est droit au but. Des stratégies qui rapportent rapidement. Je suis qu'au premier mois : 100k vues totales et environ 900€ de MRR !",
     revenue: "€900/mois",
     image: "/images/pfptestimonialgym.png"
   },
   {
     name: "Marion",
     content: "Les coachs sont parfois un peu froid mais au moins je suis passé à 1.6k€ de MRR en 3 semaines avec 6 comptes.",
     revenue: "€1.6K/mois",
     image: "/images/pfptestimonialjapan.png"
   }
 ]

 const faqs = [
   {
     q: "C'EST QUOI LA DIFFÉRENCE AVEC LES AUTRES GUILDES ?",
     a: "TBCB c'est direct, efficace. On te montre ce qui marche, tu appliques, tu fais du cash. Les coachs sont là pour te pousser, pas pour te tenir la main."
   },
   {
     q: "JE GALÈRE AVEC LES ALGORITHMES, VOUS POUVEZ M'AIDER ?",
     a: "C'est notre spécialité. On a cracké les algos de toutes les plateformes. Tu vas apprendre à les exploiter pour faire 100k vues minimum par semaine. Nos templates de posts sont des machines à vues."
   },
   {
     q: "C'EST OBLIGÉ DE POSTER TOUS LES JOURS ?",
     a: "Si tu veux du résultat rapide, oui. Mais on t'apprend à créer 30 posts en 2h avec notre système. Après c'est de la programmation et de l'automation. Tu bosses 1 jour, tu postes toute la semaine."
   },
   {
     q: "LES COACHS SONT VRAIMENT DISPONIBLES 24/7 ?",
     a: "7j/7, mais on dort aussi comme des humains normaux. On est le plus présent possible pour répondre rapidement à tes questions. Et bientôt un 3e coach va rejoindre l'équipe pour être encore plus présents et t'aider à scaler."
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
         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(239, 68, 68, 0.03) 2px, rgba(239, 68, 68, 0.03) 4px)',
         animation: 'scanlines 8s linear infinite'
       }} />
     </div>

     {/* CRT Screen Effect */}
     <div className="fixed inset-0 pointer-events-none">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(239,68,68,0.01)] to-transparent" />
     </div>

     <HeaderTBCB />

     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 z-10">
       <div className="max-w-5xl mx-auto text-center">
         <div className="text-[#EF4444] text-sm mb-4">NO BULLSHIT, RÉSULTATS RAPIDES</div>

         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 text-[#EF4444] tracking-wider">
           TBCB
         </h1>

         <p className="text-sm md:text-base text-white mb-4">
           ON POSTE, ON GÉNÈRE DES VUES, ON FAIT DU CASH.
         </p>
         <p className="text-sm md:text-base text-[#EF4444]">
           DE 0 À 100K VUES EN 14 JOURS.
         </p>

         {/* Stats Grid */}
         <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
           <div className="border border-[#EF4444] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#EF4444]">+234</div>
             <div className="text-xs text-gray-400">MEMBRES ACTIFS</div>
           </div>
           <div className="border border-[#EF4444] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#EF4444]">7j/7</div>
             <div className="text-xs text-gray-400">COACHING DISPO</div>
           </div>
           <div className="border border-[#EF4444] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#EF4444]">8-12j</div>
             <div className="text-xs text-gray-400">1ÈRE VENTE</div>
           </div>
         </div>
       </div>
     </section>

     {/* Progression Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">PROGRESSION</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
             LA MÉTHODE TBCB
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           <div className="border border-[#EF4444]/30 bg-black/90 p-6 hover:border-[#EF4444] transition-all">
             <div className="text-[#EF4444] text-sm mb-2">[JOUR 1-2]</div>
             <h3 className="text-lg font-bold text-white mb-2">SETUP</h3>
             <p className="text-xs text-gray-400">
               Formation intensive + création de tous tes comptes. On pose les bases solides.
             </p>
           </div>

           <div className="border border-[#EF4444]/30 bg-black/90 p-6 hover:border-[#EF4444] transition-all">
             <div className="text-[#EF4444] text-sm mb-2">[JOUR 3-4]</div>
             <h3 className="text-lg font-bold text-white mb-2">PREMIERS POSTS</h3>
             <p className="text-xs text-gray-400">
               Tu commences à poster. On teste les hooks, on analyse, on ajuste.
             </p>
           </div>

           <div className="border border-[#EF4444]/30 bg-black/90 p-6 hover:border-[#EF4444] transition-all">
             <div className="text-[#EF4444] text-sm mb-2">[JOUR 5-7]</div>
             <h3 className="text-lg font-bold text-white mb-2">30K VUES</h3>
             <p className="text-xs text-gray-400">
               Ça commence à prendre. Les vues montent, les DM arrivent.
             </p>
           </div>

           <div className="border border-[#10B981]/30 bg-black/90 p-6 hover:border-[#10B981] transition-all">
             <div className="text-[#10B981] text-sm mb-2">[JOUR 8-14]</div>
             <h3 className="text-lg font-bold text-[#10B981] mb-2">100K+ VUES</h3>
             <p className="text-xs text-gray-400">
               L'algo te kiffe. Tu es viral. Les ventes tombent. Welcome to TBCB.
             </p>
           </div>
         </div>

         {/* Stats Bar */}
         <div className="mt-12 border border-[#EF4444] bg-black/90 p-6">
           <div className="grid grid-cols-3 gap-6 text-center">
             <div>
               <div className="text-2xl font-bold text-[#EF4444]">87%</div>
               <div className="text-xs text-gray-400">ATTEIGNENT 100K VUES</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-[#EF4444]">8-12 jours</div>
               <div className="text-xs text-gray-400">PREMIÈRE VENTE MOYENNE</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-[#EF4444]">€1.6K</div>
               <div className="text-xs text-gray-400">REVENUS MOYENS MOIS 1</div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Coaches Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">COACHS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
             TES COACHS DÉDIÉS
           </h2>
         </div>

         <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
           {/* Coach Tibo */}
           <div className="border border-[#EF4444] bg-black/90 p-6">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 border border-[#EF4444] overflow-hidden">
                 <img
                   src="/images/pfpr4_coachTBCB.png"
                   alt="Tibo"
                   className="w-full h-full object-cover"
                 />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">TIBO</h3>
                 <p className="text-[#EF4444] text-xs mb-2">[HEAD COACH • EXPERT CONTENT]</p>
                 <p className="text-xs text-gray-400 mb-3">
                   Créateur de systèmes qui génèrent 1M+ de vues par mois. Expert en algorithmes et scaling agressif.
                 </p>
                 <div className="flex gap-2">
                   <span className="text-xs text-[#EF4444]">[10M+ VUES/MOIS]</span>
                   <span className="text-xs text-[#EF4444]">[SCALING EXPERT]</span>
                 </div>
               </div>
             </div>
           </div>

           {/* Coach Adam */}
           <div className="border border-[#EF4444] bg-black/90 p-6">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 border border-[#EF4444] overflow-hidden">
                 <img
                   src="/images/pfpadam_coachTBCB.png"
                   alt="Adam"
                   className="w-full h-full object-cover"
                 />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">ADAM</h3>
                 <p className="text-[#EF4444] text-xs mb-2">[ELITE COACH • EXPERT CONVERSION]</p>
                 <p className="text-xs text-gray-400 mb-3">
                   Spécialiste du "post to profit". Transforme chaque vue en euro. Expert en hooks psychologiques.
                 </p>
                 <div className="flex gap-2">
                   <span className="text-xs text-[#EF4444]">[35% CONVERSION]</span>
                   <span className="text-xs text-[#EF4444]">[DM CLOSER]</span>
                 </div>
               </div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Testimonials */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">TÉMOIGNAGES</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
             ILS ONT TRANSFORMÉ LEUR VIE
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {testimonials.map((testimonial, index) => (
             <motion.div
               key={index}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: index * 0.1 }}
               className="border border-[#EF4444] bg-black/90 p-6"
             >
               <div className="flex items-start gap-3 mb-4">
                 <div className="w-12 h-12 border border-[#EF4444] overflow-hidden">
                   <img
                     src={testimonial.image}
                     alt={testimonial.name}
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">{testimonial.name}</h3>
                   <p className="text-xs text-[#EF4444]">{testimonial.revenue}</p>
                 </div>
               </div>
               <p className="text-xs text-gray-300 italic">
                 "{testimonial.content}"
               </p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>

     {/* Pricing Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">TARIFS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
             CHOISIS TON PLAN
           </h2>
         </div>

         <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {/* Starter Plan */}
           <div className="border border-[#B794F4] bg-black/90 p-6">
             <div className="text-center mb-6">
               <h3 className="text-xl font-bold text-white mb-2">TBCB DÉBUTANT</h3>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-xs">
                 [100% GRATUIT]
               </div>
             </div>

             <div className="text-center mb-6">
               <div className="text-4xl font-bold text-white">0€</div>
               <p className="text-xs text-gray-400">POUR DÉCOUVRIR</p>
             </div>

             <div className="space-y-2 mb-6">
               <div className="text-xs text-gray-300">[✓] FORMATION DÉBUTANT</div>
               <div className="text-xs text-gray-300">[✓] ACCÈS COMMUNAUTÉ DÉBUTANT</div>
               <div className="text-xs text-gray-300">[✓] ENTRAIDE DES TBCB PRO</div>
             </div>

             <button className="w-full py-3 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-sm font-bold">
               [COMMENCER GRATUITEMENT]
             </button>
           </div>

           {/* Premium Plan */}
           <div className="border-2 border-[#EF4444] bg-black/90 p-6 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2">
               <div className="px-4 py-1 bg-[#EF4444] text-black text-xs font-bold">
                 [PLUS POPULAIRE]
               </div>
             </div>

             <div className="text-center mb-6 mt-2">
               <h3 className="text-xl font-bold text-white mb-2">TBCB PRO</h3>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF4444]/20 text-[#EF4444] text-xs">
                 [FORMATION COMPLÈTE]
               </div>
             </div>

             {/* Pricing tabs */}
             <div className="mb-6">
               <div className="flex gap-2 mb-4">
                 <button
                   onClick={() => setSelectedPlan('monthly')}
                   className={`flex-1 py-2 px-3 text-xs font-bold transition-all ${
                     selectedPlan === 'monthly'
                       ? 'bg-[#EF4444] text-black'
                       : 'border border-[#EF4444]/30 text-gray-400 hover:border-[#EF4444]'
                   }`}
                 >
                   MENSUEL
                 </button>
                 <button
                   onClick={() => setSelectedPlan('quarterly')}
                   className={`flex-1 py-2 px-3 text-xs font-bold transition-all relative ${
                     selectedPlan === 'quarterly'
                       ? 'bg-[#EF4444] text-black'
                       : 'border border-[#EF4444]/30 text-gray-400 hover:border-[#EF4444]'
                   }`}
                 >
                   3 MOIS
                   <span className="absolute -top-2 -right-2 px-1 py-0.5 bg-[#10B981] text-black text-xs">
                     -56%
                   </span>
                 </button>
                 <button
                   onClick={() => setSelectedPlan('biannual')}
                   className={`flex-1 py-2 px-3 text-xs font-bold transition-all relative ${
                     selectedPlan === 'biannual'
                       ? 'bg-[#EF4444] text-black'
                       : 'border border-[#EF4444]/30 text-gray-400 hover:border-[#EF4444]'
                   }`}
                 >
                   1 AN
                   <span className="absolute -top-2 -right-2 px-1 py-0.5 bg-[#10B981] text-black text-xs">
                     -76%
                   </span>
                 </button>
               </div>

               <div className="text-center">
                 <div className="text-4xl font-bold text-white mb-1">
                   {selectedPlan === 'monthly' && '44,99€'}
                   {selectedPlan === 'quarterly' && '59,99€'}
                   {selectedPlan === 'biannual' && '129€'}
                 </div>
                 <p className="text-xs text-gray-400">
                   {selectedPlan === 'monthly' && 'PAR MOIS, SANS ENGAGEMENT'}
                   {selectedPlan === 'quarterly' && 'POUR 3 MOIS'}
                   {selectedPlan === 'biannual' && 'POUR 12 MOIS'}
                 </p>
                 {selectedPlan === 'quarterly' && (
                   <p className="text-[#10B981] text-xs mt-1">
                     ÉCONOMISE 75€ (20€/MOIS)
                   </p>
                 )}
                 {selectedPlan === 'biannual' && (
                   <p className="text-[#10B981] text-xs mt-1">
                     ÉCONOMISE 411€ (10,75€/MOIS)
                   </p>
                 )}
               </div>
             </div>

             <div className="space-y-2 mb-6">
               <div className="text-xs text-gray-300">[✓] COACHING 7J/7</div>
               <div className="text-xs text-gray-300">[✓] FORMATION COMPLÈTE ET CONCRÈTE</div>
               <div className="text-xs text-gray-300">[✓] TEMPLATES & SCRIPTS DE VENTE</div>
               <div className="text-xs text-gray-300">[✓] RÉDUCTIONS CHEZ FOURNISSEURS</div>
               <div className="text-xs text-gray-300">[✓] SUPPORT PRIORITAIRE 24/7</div>
               <div className="text-xs text-gray-300">[✓] MISES À JOUR RÉGULIÈRES</div>
               <div className="text-xs text-gray-300">[✓] RÉSEAU DES MEILLEURS CRÉATEURS</div>
             </div>

             <button className="w-full py-3 bg-[#EF4444] text-black hover:bg-[#EF4444]/80 transition-all text-sm font-bold">
               [COMMENCER MAINTENANT]
             </button>
           </div>
         </div>

         {/* Trust badges */}
         <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
           <div className="text-xs text-gray-400">
             <span className="text-[#EF4444]">+234</span> MEMBRES ACTIFS
           </div>
           <div className="text-xs text-gray-400">
             <span className="text-[#FFB000]">4.7/5</span> (47 AVIS)
           </div>
           <div className="text-xs text-gray-400">
             <span className="text-[#EF4444]">↻</span> ANNULATION FACILE
           </div>
         </div>
       </div>
     </section>

     {/* Content Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">CONTENU</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
             CE QUE CONTIENT TBCB
           </h2>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="border border-[#EF4444] bg-black/90 p-6">
             <Icons.UsersThree size={32} className="text-[#EF4444] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">COACHING INTENSIF</h3>
             <div className="text-xs text-[#EF4444]">[24/7]</div>
           </div>

           <div className="border border-[#EF4444] bg-black/90 p-6">
             <Icons.TrendUp size={32} className="text-[#EF4444] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">STRATÉGIES VIRALES</h3>
             <div className="text-xs text-[#EF4444]">[100K+ VUES]</div>
           </div>

           <div className="border border-[#10B981] bg-black/90 p-6">
             <Icons.GraduationCap size={32} className="text-[#10B981] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">FORMATION COMPLÈTE</h3>
             <div className="text-xs text-[#10B981]">[MAJ HEBDO]</div>
           </div>
         </div>

         {/* Comparison Bar */}
         <div className="mt-12 border border-[#EF4444] bg-black/90 p-6">
           <div className="text-center mb-6">
             <h3 className="text-sm font-bold text-white">TBCB VS LES AUTRES</h3>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
             <div>
               <div className="text-xs text-gray-500 mb-1">TEMPS 1ÈRE VENTE</div>
               <div className="text-lg font-bold text-[#EF4444]">8-12J</div>
               <div className="text-xs text-gray-600 line-through">30J AILLEURS</div>
             </div>
             <div>
               <div className="text-xs text-gray-500 mb-1">TAUX RÉUSSITE</div>
               <div className="text-lg font-bold text-[#EF4444]">87%</div>
               <div className="text-xs text-gray-600 line-through">23% AILLEURS</div>
             </div>
             <div>
               <div className="text-xs text-gray-500 mb-1">SUPPORT COACH</div>
               <div className="text-lg font-bold text-[#EF4444]">7J/7</div>
               <div className="text-xs text-gray-600 line-through">1X/SEM AILLEURS</div>
             </div>
             <div>
               <div className="text-xs text-gray-500 mb-1">REVENUS MOIS 1</div>
               <div className="text-lg font-bold text-[#EF4444]">€1.6K</div>
               <div className="text-xs text-gray-600 line-through">€200 AILLEURS</div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="text-[#EF4444] text-sm mb-4">FAQ</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#EF4444]">
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
               <details className="group border border-[#EF4444]/30 bg-black/50 p-5 cursor-pointer hover:border-[#EF4444]/50 transition-all">
                 <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                   <span className="text-sm">{faq.q}</span>
                   <span className="text-[#EF4444] group-open:rotate-90 transition-transform ml-4">›</span>
                 </summary>
                 <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#EF4444]/30">
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
         <Icons.RocketLaunch size={48} className="text-[#EF4444] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#EF4444]">
           PRÊT À PASSER À L'ACTION ?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           REJOINS TBCB ET COMMENCE À FAIRE DE L'ARGENT DÈS MAINTENANT.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#EF4444] text-black hover:bg-[#EF4444]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             [REJOINDRE TBCB MAINTENANT]
           </button>
         </div>

         <p className="text-xs text-gray-500 mt-4">
           PLUS DE 234 MEMBRES ACTIFS
         </p>
       </div>
     </section>

     {/* Footer */}
     <FooterTBCB showSupplierCTA={false} />

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
