'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import HeaderCommunityAcademy from '@/components/weokto/HeaderCommunityAcademy'
import FooterCommunityAcademy from '@/components/weokto/FooterCommunityAcademy'

export default function LPCommunityAcademyPage() {
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

     ctx.fillStyle = '#3B82F6'
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
     name: "Théo 4k",
     content: "La formation est vraiment complète et bien structurée. Je débute mais j'ai déjà généré mes premiers revenus. Les coachs sont disponibles et répondent à toutes les questions.",
     revenue: "€900/mois",
     image: "/images/pfptestimonialtheo4k.png"
   },
   {
     name: "Lysa Y.",
     content: "Après m'être faite arnaquer 497€ par une vieille formation qui n'apprend rien, j'ai trouvé la Community Academy. J'ai remboursé les 497€ en 3 semaines, et maintenant je suis à environ 4k mensuels.",
     revenue: "€4K/mois",
     image: "/images/pfptestimoniallysay.png"
   },
   {
     name: "Tibo MRT",
     content: "J'étais bloqué à 2k par mois, Bastien m'a aidé à scale et à recruter pour aller chercher un autre pallier. Je vise les 50k mensuel avant la fin d'année.",
     revenue: "€12K/mois",
     image: "/images/testimonial1.jpg"
   }
 ]

 const faqs = [
   {
     q: "COMBIEN DE TEMPS FAUT-IL POUR VOIR DES RÉSULTATS ?",
     a: "La plupart de nos membres génèrent leurs premiers revenus dans les 30 premiers jours. Avec une application sérieuse de la méthode, tu peux atteindre 3000€/mois en 60-90 jours."
   },
   {
     q: "EST-CE QUE JE PEUX COMMENCER SANS EXPÉRIENCE ?",
     a: "Oui ! La formation est conçue pour les débutants complets. On t'accompagne étape par étape, de zéro jusqu'à tes premiers revenus récurrents. Pas besoin de compétences techniques."
   },
   {
     q: "QUEL TEMPS DOIS-JE Y CONSACRER PAR SEMAINE ?",
     a: "Nous recommandons minimum 5-10h par semaine pour des résultats optimaux. La formation est conçue pour s'adapter à ton rythme avec des vidéos courtes et actionnables."
   },
   {
     q: "Y A-T-IL UN SUPPORT APRÈS LA FORMATION ?",
     a: "Oui ! Tu as accès à la communauté pendant la durée de ton abonnement et au coaching 7/7 par les coachs."
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
         backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(59, 130, 246, 0.03) 2px, rgba(59, 130, 246, 0.03) 4px)',
         animation: 'scanlines 8s linear infinite'
       }} />
     </div>

     {/* CRT Screen Effect */}
     <div className="fixed inset-0 pointer-events-none">
       <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(59,130,246,0.01)] to-transparent" />
     </div>

     <HeaderCommunityAcademy />

     {/* Hero Section */}
     <section className="relative pt-32 pb-20 px-4 sm:px-6 z-10">
       <div className="max-w-5xl mx-auto text-center">
         <div className="text-[#3B82F6] text-sm mb-4">LA GUILDE DU COMMUNITY BUILDING</div>

         <h1 className="text-3xl md:text-5xl font-mono font-bold mb-6 text-[#3B82F6] tracking-wider">
           COMMUNITY ACADEMY
         </h1>

         <p className="text-sm md:text-base text-white mb-4">
           MAÎTRISE LE COMMUNITY BUILDING ET GÉNÈRE DES REVENUS PASSIFS.
         </p>
         <p className="text-sm md:text-base text-[#3B82F6]">
           DE 0 À TA PREMIÈRE VENTE EN 4 JOURS.
         </p>

         {/* Stats Grid */}
         <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-12">
           <div className="border border-[#3B82F6] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#3B82F6]">500+</div>
             <div className="text-xs text-gray-400">MEMBRES ACTIFS</div>
           </div>
           <div className="border border-[#3B82F6] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#3B82F6]">7j/7</div>
             <div className="text-xs text-gray-400">COACHING DISPO</div>
           </div>
           <div className="border border-[#3B82F6] bg-black/90 p-4">
             <div className="text-2xl font-bold text-[#3B82F6]">7 jours</div>
             <div className="text-xs text-gray-400">ESSAI GRATUIT</div>
           </div>
         </div>
       </div>
     </section>

     {/* Timeline Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#3B82F6] text-sm mb-4">MÉTHODE</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
             DE 0 À TA PREMIÈRE VENTE EN 4 JOURS
           </h2>
         </div>

         <div className="space-y-8">
           {/* Step 1 */}
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 border-2 border-[#3B82F6] bg-black flex items-center justify-center text-[#3B82F6] font-bold">
               1
             </div>
             <div className="flex-1 border border-[#3B82F6]/30 bg-black/90 p-4">
               <h3 className="text-sm font-bold text-white mb-1">[JOUR 1] FORMATION BASIQUE</h3>
               <p className="text-xs text-gray-400">
                 Apprends les fondamentaux du community building et découvre notre méthode exclusive
               </p>
             </div>
           </div>

           {/* Step 2 */}
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 border-2 border-[#3B82F6] bg-black flex items-center justify-center text-[#3B82F6] font-bold">
               2
             </div>
             <div className="flex-1 border border-[#3B82F6]/30 bg-black/90 p-4">
               <h3 className="text-sm font-bold text-white mb-1">[JOUR 2] MAÎTRISE DES BASES</h3>
               <p className="text-xs text-gray-400">
                 Consolide tes connaissances et prépare ton plan d'action personnalisé
               </p>
             </div>
           </div>

           {/* Step 3 */}
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 border-2 border-[#3B82F6] bg-black flex items-center justify-center text-[#3B82F6] font-bold">
               3
             </div>
             <div className="flex-1 border border-[#3B82F6]/30 bg-black/90 p-4">
               <h3 className="text-sm font-bold text-white mb-1">[JOUR 3] CRÉATION DE CONTENU</h3>
               <p className="text-xs text-gray-400">
                 Applique nos techniques pour créer du contenu qui convertit et attire les clients
               </p>
             </div>
           </div>

           {/* Step 4 */}
           <div className="flex items-center gap-4">
             <div className="w-12 h-12 border-2 border-[#10B981] bg-black flex items-center justify-center text-[#10B981] font-bold">
               ✓
             </div>
             <div className="flex-1 border border-[#10B981]/30 bg-black/90 p-4">
               <h3 className="text-sm font-bold text-[#10B981] mb-1">[JOUR 3-4] PREMIÈRE VENTE</h3>
               <p className="text-xs text-gray-400">
                 Félicitations ! Tu génères tes premiers revenus avec notre accompagnement
               </p>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Coaches Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-5xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#3B82F6] text-sm mb-4">COACHS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
             TES COACHS DÉDIÉS
           </h2>
         </div>

         <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
           {/* Coach Bastien */}
           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 border border-[#3B82F6] overflow-hidden">
                 <img
                   src="/images/bastiencoachCA.png"
                   alt="Bastien"
                   className="w-full h-full object-cover"
                 />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">BASTIEN</h3>
                 <p className="text-[#3B82F6] text-xs mb-2">[HEAD COACH • EXPERT ACQUISITION]</p>
                 <p className="text-xs text-gray-400 mb-3">
                   +18k€/mois en revenus passifs. Spécialiste des stratégies de conversion et du scaling rapide.
                 </p>
                 <div className="flex gap-2">
                   <span className="text-xs text-[#3B82F6]">[500+ ÉLÈVES]</span>
                   <span className="text-xs text-[#3B82F6]">[EXPERT COPYWRITING]</span>
                 </div>
               </div>
             </div>
           </div>

           {/* Coach Louanne */}
           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <div className="flex items-start gap-4">
               <div className="w-16 h-16 border border-[#3B82F6] overflow-hidden">
                 <img
                   src="/images/louannecoachCA.png"
                   alt="Louanne"
                   className="w-full h-full object-cover"
                 />
               </div>
               <div className="flex-1">
                 <h3 className="text-lg font-bold text-white mb-1">LOUANNE</h3>
                 <p className="text-[#3B82F6] text-xs mb-2">[ELITE COACH • EXPERTE ENGAGEMENT]</p>
                 <p className="text-xs text-gray-400 mb-3">
                   Community manager d'exception. Maîtrise parfaite des réseaux sociaux et de l'engagement.
                 </p>
                 <div className="flex gap-2">
                   <span className="text-xs text-[#3B82F6]">[3M+ REACH/MOIS]</span>
                   <span className="text-xs text-[#3B82F6]">[EXPERTE VIRALITÉ]</span>
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
           <div className="text-[#3B82F6] text-sm mb-4">TÉMOIGNAGES</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
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
               className="border border-[#3B82F6] bg-black/90 p-6"
             >
               <div className="flex items-start gap-3 mb-4">
                 <div className="w-12 h-12 border border-[#3B82F6] overflow-hidden">
                   <img
                     src={testimonial.image}
                     alt={testimonial.name}
                     className="w-full h-full object-cover"
                   />
                 </div>
                 <div>
                   <h3 className="text-sm font-bold text-white">{testimonial.name}</h3>
                   <p className="text-xs text-[#3B82F6]">{testimonial.revenue}</p>
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
           <div className="text-[#3B82F6] text-sm mb-4">TARIFS</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
             CHOISIS TON PLAN D'APPRENTISSAGE
           </h2>
         </div>

         <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
           {/* Starter Plan */}
           <div className="border border-[#B794F4] bg-black/90 p-6">
             <div className="text-center mb-6">
               <h3 className="text-xl font-bold text-white mb-2">COMMUNITY STARTER</h3>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#10B981]/20 text-[#10B981] text-xs">
                 [100% GRATUIT]
               </div>
             </div>

             <div className="text-center mb-6">
               <div className="text-4xl font-bold text-white">0€</div>
               <p className="text-xs text-gray-400">POUR DÉCOUVRIR</p>
             </div>

             <div className="space-y-2 mb-6">
               <div className="text-xs text-gray-300">[✓] FORMATION POUR SE LANCER</div>
               <div className="text-xs text-gray-300">[✓] ACCÈS À LA COMMUNAUTÉ</div>
               <div className="text-xs text-gray-300">[✓] SUPPORT COMMUNAUTAIRE</div>
             </div>

             <button className="w-full py-3 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-sm font-bold">
               [COMMENCER GRATUITEMENT]
             </button>
           </div>

           {/* Premium Plan */}
           <div className="border-2 border-[#3B82F6] bg-black/90 p-6 relative">
             <div className="absolute -top-3 left-1/2 -translate-x-1/2">
               <div className="px-4 py-1 bg-[#3B82F6] text-black text-xs font-bold">
                 [PLUS POPULAIRE]
               </div>
             </div>

             <div className="text-center mb-6 mt-2">
               <h3 className="text-xl font-bold text-white mb-2">COMMUNITY ACADEMY</h3>
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#3B82F6]/20 text-[#3B82F6] text-xs">
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
                       ? 'bg-[#3B82F6] text-black'
                       : 'border border-[#3B82F6]/30 text-gray-400 hover:border-[#3B82F6]'
                   }`}
                 >
                   MENSUEL
                 </button>
                 <button
                   onClick={() => setSelectedPlan('quarterly')}
                   className={`flex-1 py-2 px-3 text-xs font-bold transition-all relative ${
                     selectedPlan === 'quarterly'
                       ? 'bg-[#3B82F6] text-black'
                       : 'border border-[#3B82F6]/30 text-gray-400 hover:border-[#3B82F6]'
                   }`}
                 >
                   3 MOIS
                   <span className="absolute -top-2 -right-2 px-1 py-0.5 bg-[#10B981] text-black text-xs">
                     -53%
                   </span>
                 </button>
                 <button
                   onClick={() => setSelectedPlan('biannual')}
                   className={`flex-1 py-2 px-3 text-xs font-bold transition-all relative ${
                     selectedPlan === 'biannual'
                       ? 'bg-[#3B82F6] text-black'
                       : 'border border-[#3B82F6]/30 text-gray-400 hover:border-[#3B82F6]'
                   }`}
                 >
                   8 MOIS
                   <span className="absolute -top-2 -right-2 px-1 py-0.5 bg-[#10B981] text-black text-xs">
                     -73%
                   </span>
                 </button>
               </div>

               <div className="text-center">
                 <div className="text-4xl font-bold text-white mb-1">
                   {selectedPlan === 'monthly' && '49,99€'}
                   {selectedPlan === 'quarterly' && '69,99€'}
                   {selectedPlan === 'biannual' && '110€'}
                 </div>
                 <p className="text-xs text-gray-400">
                   {selectedPlan === 'monthly' && 'PAR MOIS, SANS ENGAGEMENT'}
                   {selectedPlan === 'quarterly' && 'POUR 3 MOIS'}
                   {selectedPlan === 'biannual' && 'POUR 8 MOIS'}
                 </p>
                 {selectedPlan === 'quarterly' && (
                   <p className="text-[#10B981] text-xs mt-1">
                     ÉCONOMISE 80€ (23,33€/MOIS)
                   </p>
                 )}
                 {selectedPlan === 'biannual' && (
                   <p className="text-[#10B981] text-xs mt-1">
                     ÉCONOMISE 290€ (13,75€/MOIS)
                   </p>
                 )}
               </div>
             </div>

             <div className="space-y-2 mb-6">
               <div className="text-xs text-gray-300">[✓] ACCÈS COMPLET À LA FORMATION</div>
               <div className="text-xs text-gray-300">[✓] COACHING 7J/7</div>
               <div className="text-xs text-gray-300">[✓] TEMPLATES & SCRIPTS</div>
               <div className="text-xs text-gray-300">[✓] COMMUNAUTÉ PRIVÉE</div>
               <div className="text-xs text-gray-300">[✓] RÉDUCTION CHEZ LES FOURNISSEURS</div>
               <div className="text-xs text-gray-300">[✓] MISES À JOUR</div>
               <div className="text-xs text-gray-300">[✓] SUPPORT PRIORITAIRE 24/7</div>
             </div>

             <button className="w-full py-3 bg-[#3B82F6] text-black hover:bg-[#3B82F6]/80 transition-all text-sm font-bold">
               [COMMENCER MAINTENANT]
             </button>
           </div>
         </div>

         {/* Trust badges */}
         <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
           <div className="text-xs text-gray-400">
             <span className="text-[#3B82F6]">+573</span> MEMBRES ACTIFS
           </div>
           <div className="text-xs text-gray-400">
             <span className="text-[#FFB000]">4.9/5</span> SATISFACTION
           </div>
           <div className="text-xs text-gray-400">
             <span className="text-[#3B82F6]">↻</span> ANNULATION FACILE
           </div>
         </div>
       </div>
     </section>

     {/* Content Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-6xl mx-auto px-4">
         <div className="text-center mb-12">
           <div className="text-[#3B82F6] text-sm mb-4">CONTENU</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
             CE QUE CONTIENT LA COMMUNITY ACADEMY
           </h2>
         </div>

         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.GraduationCap size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">FORMATION COMPLÈTE</h3>
             <p className="text-xs text-gray-400">
               Chaque aspect du community building : mindset, création de contenu, vente, scaling
             </p>
           </div>

           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.UsersThree size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">COACHING 7J/7</h3>
             <p className="text-xs text-gray-400">
               Bastien et Louanne répondent à toutes tes questions. Support illimité
             </p>
           </div>

           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.ChatCircleDots size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">COMMUNAUTÉ PRIVÉE</h3>
             <p className="text-xs text-gray-400">
               +573 membres actifs qui s'entraident et font du business ensemble
             </p>
           </div>

           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.FileText size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">TEMPLATES & SCRIPTS</h3>
             <p className="text-xs text-gray-400">
               Scripts de vente, templates viraux, stratégies prêtes à l'emploi
             </p>
           </div>

           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.ArrowsClockwise size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">MISES À JOUR</h3>
             <p className="text-xs text-gray-400">
               Accès permanent aux nouvelles stratégies et modules
             </p>
           </div>

           <div className="border border-[#3B82F6] bg-black/90 p-6">
             <Icons.Handshake size={32} className="text-[#3B82F6] mb-3" />
             <h3 className="text-sm font-bold text-white mb-2">RÉSEAU D'ENTREPRENEURS</h3>
             <p className="text-xs text-gray-400">
               Connexions avec des entrepreneurs qui font 5 à 45k€/mois
             </p>
           </div>
         </div>

         {/* Stats bar */}
         <div className="mt-12 border border-[#3B82F6] bg-black/90 p-6">
           <div className="grid grid-cols-3 gap-6 text-center">
             <div>
               <div className="text-2xl font-bold text-[#3B82F6]">573+</div>
               <div className="text-xs text-gray-400">MEMBRES ACTIFS</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-[#3B82F6]">7j/7</div>
               <div className="text-xs text-gray-400">SUPPORT COACH</div>
             </div>
             <div>
               <div className="text-2xl font-bold text-[#3B82F6]">11j</div>
               <div className="text-xs text-gray-400">1ÈRE VENTE MOYENNE</div>
             </div>
           </div>
         </div>
       </div>
     </section>

     {/* Rating Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-4">
         <div className="border-2 border-[#3B82F6] bg-black/90 p-12 text-center">
           <div className="mb-6">
             <div className="flex justify-center gap-2 mb-4">
               {[...Array(5)].map((_, i) => (
                 <Icons.Star
                   key={i}
                   size={32}
                   weight="fill"
                   className={i < 4 ? "text-[#FFB000]" : "text-gray-600"}
                 />
               ))}
             </div>
             <div className="text-4xl font-bold text-white mb-2">4.9 SUR 5</div>
             <p className="text-sm text-gray-400">NOTE MOYENNE GARANTIE ET VÉRIFIÉE PAR WEOKTO</p>
           </div>

           <div className="flex items-center justify-center gap-8">
             <div className="text-center">
               <div className="text-2xl font-bold text-[#3B82F6]">118</div>
               <div className="text-xs text-gray-400">AVIS VÉRIFIÉS</div>
             </div>
             <div className="w-px h-12 bg-[#3B82F6]"></div>
             <div className="text-center">
               <div className="text-2xl font-bold text-[#3B82F6]">98%</div>
               <div className="text-xs text-gray-400">SATISFACTION</div>
             </div>
           </div>

           <div className="mt-8 text-xs text-gray-400">
             <Icons.ShieldCheck size={20} className="text-[#10B981] inline mr-2" />
             TOUS LES AVIS SONT AUTHENTIQUES ET VÉRIFIÉS
           </div>
         </div>
       </div>
     </section>

     {/* FAQ Section */}
     <section className="py-20 relative z-10">
       <div className="max-w-4xl mx-auto px-6">
         <div className="text-center mb-12">
           <div className="text-[#3B82F6] text-sm mb-4">FAQ</div>
           <h2 className="text-2xl md:text-3xl font-mono font-bold text-[#3B82F6]">
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
               <details className="group border border-[#3B82F6]/30 bg-black/50 p-5 cursor-pointer hover:border-[#3B82F6]/50 transition-all">
                 <summary className="flex items-center justify-between font-mono text-white marker:content-none">
                   <span className="text-sm">{faq.q}</span>
                   <span className="text-[#3B82F6] group-open:rotate-90 transition-transform ml-4">›</span>
                 </summary>
                 <p className="mt-4 text-gray-400 text-xs font-mono leading-relaxed pl-4 border-l-2 border-[#3B82F6]/30">
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
         <Icons.RocketLaunch size={48} className="text-[#3B82F6] mx-auto mb-6" />

         <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#3B82F6]">
           PRÊT À TRANSFORMER TA VIE ?
         </h2>

         <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
           REJOINS COMMUNITY ACADEMY ET GÉNÈRE TES PREMIERS REVENUS EN 30 JOURS.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 justify-center">
           <button
             onClick={() => window.location.href = '/home'}
             className="px-8 py-4 bg-[#3B82F6] text-black hover:bg-[#3B82F6]/80 transition-all text-lg font-mono font-bold tracking-wider"
           >
             [REJOINDRE COMMUNITY ACADEMY]
           </button>
         </div>

         <p className="text-xs text-gray-500 mt-4">
           7 JOURS D'ESSAI GRATUIT
         </p>
       </div>
     </section>

     {/* Footer */}
     <FooterCommunityAcademy showSupplierCTA={false} />

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
