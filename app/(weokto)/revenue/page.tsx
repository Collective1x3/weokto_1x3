'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Megaphone, Buildings, CurrencyCircleDollar, Bank, ChartBar, Clock,
  ShieldCheck, Info, Plus, ArrowRight, X, CheckCircle,
  TwitterLogo, InstagramLogo, TiktokLogo, ArrowDown, GitBranch
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HeaderWithAuth from '@/components/weokto/HeaderWithAuth'
import Footer from '@/components/weokto/Footer'
import { useAuth } from '@/contexts/AuthContext'

export default function RevenusPage() {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const router = useRouter()
  const { handleAuth } = useAuth()

  useEffect(() => {
    setIsClient(true)
    setIsMobile(window.innerWidth < 768)
  }, [])


  const processSteps = [
    {
      icon: Megaphone,
      title: 'Tu ramènes les clients',
      description: 'Tu fais la promotion des communautés et génères des ventes avec ton lien unique',
      who: 'TOI'
    },
    {
      icon: Buildings,
      title: 'Les fournisseurs gèrent',
      description: 'Ils s\'occupent du produit, de la communauté, du support et de toute la livraison de valeur',
      who: 'FOURNISSEUR'
    },
    {
      icon: CurrencyCircleDollar,
      title: 'Weokto gère tout',
      description: 'On encaisse tous les paiements et on paie créateurs ET fournisseurs. Support, refunds, litiges : tout est géré',
      who: 'WEOKTO'
    }
  ]

  const paymentFeatures = [
    {
      icon: Bank,
      title: 'Paiements via Whop',
      subtitle: 'Sécurisé et automatisé',
      description: 'Whop gère l\'encaissement et les payouts. Pas besoin de créer de compte dans 90% des cas, on s\'en occupe.',
      color: 'violet'
    },
    {
      icon: ChartBar,
      title: 'Dashboard Weokto',
      subtitle: 'Tout est visible',
      description: 'Stats en temps réel, suivi des commissions, historique complet. Tout est centralisé sur Weokto.',
      color: 'blue'
    },
    {
      icon: Clock,
      title: 'Retraits flexibles',
      subtitle: 'Quand tu veux',
      description: 'Demande tes payouts directement depuis Weokto. Traitement rapide selon les règles Whop.',
      color: 'green'
    },
    {
      icon: ShieldCheck,
      title: 'Transparence totale',
      subtitle: 'Tout est clair',
      description: 'Dashboard détaillé, historique complet, suivi en temps réel. Tu sais toujours où tu en es.',
      color: 'orange'
    }
  ]

  const faqItems = [
    {
      question: 'Qui gère les clients après la vente ?',
      answer: 'Les fournisseurs s\'occupent de tout : onboarding, support, livraison du produit, animation de la communauté. Tu te concentres uniquement sur l\'acquisition de nouveaux clients.'
    },
    {
      question: 'Comment fonctionne le système de paiement ?',
      answer: 'Les clients paient via Whop (processeur sécurisé). Les commissions sont calculées automatiquement et versées selon les règles de validation. Tu peux suivre tout en temps réel sur ton dashboard Weokto.'
    },
    {
      question: 'Dois-je créer un compte Whop ?',
      answer: 'Dans 90% des cas, non. Weokto crée automatiquement ton profil quand tu rejoins une guilde. Si tu as déjà un compte Whop, tu peux le lier à Weokto depuis ton profil.'
    },
    {
      question: 'Quand puis-je retirer mes commissions ?',
      answer: 'Les retraits sont disponibles selon les règles Whop (généralement après validation des ventes). Tu peux demander un payout directement depuis ton dashboard Weokto (20 à 30 jours environ).'
    },
    {
      question: 'Que se passe-t-il si un client annule ?',
      answer: 'Si l\'annulation arrive pendant la période de garantie, la commission est annulée. Après validation, tu gardes les commissions déjà versées. Les revenus récurrents s\'arrêtent à la fin de l\'abonnement.'
    },
    {
      question: 'Comment suivre mes performances ?',
      answer: 'Dashboard complet sur Weokto : nombre de ventes, taux de conversion, revenus totaux, commissions en attente, historique complet. Tout est transparent et en temps réel.'
    },
    {
      question: 'Puis-je vendre plusieurs produits ?',
      answer: 'Oui ! Tu peux rejoindre plusieurs fournisseurs et vendre différentes communautés. Diversifie tes sources de revenus pour maximiser tes gains.'
    },
    {
      question: 'Qui gère les paiements ?',
      answer: 'Weokto encaisse tous les paiements clients et redistribue aux créateurs ET aux fournisseurs. C\'est ce qui garantit que tout le monde soit payé. Les fournisseurs sont vérifiés et les transactions sécurisées via Whop.'
    }
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(9, 9, 11)' }}>
      <style>{`
        @import url("https://fonts.googleapis.com/css2?family=Manrope:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap");
        
        :root {
          --violet-hue: 270;
          --violet-sat: 85%;
          --bg-base: 9 9 11;
          --bg-subtle: 18 18 20;
          --bg-muted: 27 27 30;
          --text-primary: 250 250 250;
          --text-secondary: 212 212 216;
          --text-muted: 161 161 170;
          --border-subtle: 39 39 42;
          --border-strong: 63 63 70;
        }

        .glass-light {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.05));
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 8px 32px 0 rgba(139, 92, 246, 0.1);
        }

        .glass-card {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(255, 255, 255, 0.02));
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 
            0 4px 6px -1px rgba(0, 0, 0, 0.2),
            0 2px 4px -1px rgba(0, 0, 0, 0.1),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .glass-heavy {
          background: linear-gradient(135deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5));
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .text-primary { color: rgb(var(--text-primary)) }
        .text-secondary { color: rgb(var(--text-secondary)) }
        .text-muted { color: rgb(var(--text-muted)) }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .process-line {
          background: linear-gradient(90deg, transparent, rgba(139, 92, 246, 0.5), transparent);
          height: 2px;
        }
      `}</style>

      <HeaderWithAuth currentPage="revenus" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8"
            >
              <CurrencyCircleDollar size={18} weight="fill" className="text-green-500" />
              <span className="text-sm font-semibold text-green-400">SYSTÈME DE PAIEMENTS</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, delay: isMobile ? 0 : 0.05 }}
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800 }}
            >
              <span className="text-white">Tu vends, </span>
              <span style={{
                background: 'linear-gradient(135deg, hsl(270 85% 55%), hsl(270 85% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                on gère tout
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, delay: isMobile ? 0.05 : 0.1 }}
              className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed"
            >
              Focus sur l'acquisition. Les fournisseurs livrent la valeur, Weokto gère les paiements.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col gap-4 items-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={() => document.getElementById('process-section')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <span className="relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg text-lg font-bold text-white shadow-xl transition-all group-hover:shadow-violet-500/25">
                    Comprendre le système
                    <ArrowDown size={20} weight="bold" className="group-hover:translate-y-1 transition-transform" />
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <ShieldCheck size={16} weight="fill" className="text-green-400" />
                <span>Paiements sécurisés via Whop</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process-section" className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
              <GitBranch size={18} weight="fill" className="text-violet-500" />
              <span className="text-sm font-semibold text-violet-400">QUI FAIT QUOI</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              Une répartition claire des rôles
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Chacun son expertise pour un système qui fonctionne
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {processSteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                  <div className="absolute -top-4 -right-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                      step.who === 'TOI' ? 'bg-gradient-to-r from-green-600 to-green-500' :
                      step.who === 'FOURNISSEUR' ? 'bg-gradient-to-r from-blue-600 to-blue-500' :
                      'bg-gradient-to-r from-violet-600 to-violet-500'
                    }`}>
                      {step.who}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-violet-500/30 to-violet-600/30 flex items-center justify-center">
                      <step.icon size={32} weight="duotone" className="text-violet-400" />
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-gray-400 flex-1">{step.description}</p>
                  {step.who === 'FOURNISSEUR' && (
                    <p className="text-xs text-violet-400 mt-3 italic">*Avec supervision Weokto à toutes les étapes</p>
                  )}
                  
                  {index < processSteps.length - 1 && (
                    <div className="hidden md:flex absolute -right-8 top-1/2 -translate-y-1/2 z-10">
                      <ArrowRight size={32} weight="bold" className="text-violet-500/50" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Features */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              Comment fonctionnent les paiements
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Simple, transparent et automatisé. Tout est géré pour toi.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <feature.icon size={24} weight="duotone" className="text-violet-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-violet-400 font-semibold mb-2">{feature.subtitle}</p>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Important Note */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-12 glass-heavy rounded-2xl p-8 text-center"
          >
            <Info size={32} weight="fill" className="text-violet-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-3">Bon à savoir</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Weokto encaisse tous les paiements et redistribue aux créateurs et fournisseurs.
              C'est ce qui garantit que tout le monde soit payé. Dans 90% des cas, 
              tu n'as même pas besoin de créer un compte Whop - on gère tout.
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            style={{ fontFamily: '"Manrope", sans-serif' }}
          >
            Questions fréquentes sur les revenus
          </motion.h2>

          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <details className="group glass-card rounded-xl p-6 cursor-pointer hover:bg-white/[0.02] transition-all">
                  <summary className="flex items-center justify-between font-semibold text-white marker:content-none">
                    <span>{faq.question}</span>
                    <Plus size={20} weight="bold" className="text-violet-400 group-open:rotate-45 transition-transform" />
                  </summary>
                  <p className="mt-4 text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-heavy rounded-3xl p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent"></div>
            
            <div className="relative z-10">
              <CurrencyCircleDollar size={48} weight="duotone" className="text-green-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
                Prêt à générer des revenus passifs ?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoins Weokto et commence à vendre des communautés dès aujourd'hui.
                <span className="block text-violet-400 font-semibold mt-2">
                  Rejoins +133 membres qui génèrent déjà +1426€/mois de revenus passifs.
                </span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => handleAuth('signup')}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <span className="relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg text-lg font-bold text-white shadow-xl transition-all group-hover:shadow-violet-500/25">
                    Commencer maintenant
                    <ArrowRight size={20} weight="bold" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />

    </div>
  )
}