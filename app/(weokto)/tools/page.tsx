'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Cards, Camera, FileVideo, TextAlignLeft, VideoCamera, ChartBar,
  MagicWand, Sparkle, Lightning, Clock, Rocket, ArrowRight,
  X, CheckCircle, Lock, Info, Eye, Plus, TwitterLogo, InstagramLogo, TiktokLogo,
  ArrowDown, Gift, Check, Strategy, Calendar, ChartLineUp, PaintBrush, Robot, Target
} from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import HeaderWithAuth from '@/components/weokto/HeaderWithAuth'
import Footer from '@/components/weokto/Footer'
import { useAuth } from '@/contexts/AuthContext'

export default function OutilsPage() {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedTool, setSelectedTool] = useState<string | null>(null)
  const router = useRouter()
  const { handleAuth } = useAuth()

  useEffect(() => {
    setIsClient(true)
    setIsMobile(window.innerWidth < 768)
  }, [])


  const tools = [
    {
      id: 'carousel',
      icon: Cards,
      title: 'Créateur de Carrousels',
      description: 'Génère des carrousels ultra-engageants adaptés à chaque produit fournisseur',
      features: [
        'Templates optimisés par niche',
        'Personnalisation automatique',
        'Export en un clic',
        'A/B testing intégré'
      ],
      status: 'beta',
      color: 'violet'
    },
    {
      id: 'video',
      icon: VideoCamera,
      title: 'Générateur de Vidéos',
      description: 'Créé des vidéos TikTok/Reels qui convertissent, sans montage',
      features: [
        'Scripts personnalisés',
        'Montage automatique',
        'Musique et trends',
        'Optimisation par plateforme'
      ],
      status: 'coming',
      color: 'blue'
    },
    {
      id: 'planning',
      icon: Calendar,
      title: 'Content Management',
      description: 'Planifie et publie ton contenu sur 30 jours en quelques minutes',
      features: [
        'Calendrier intelligent',
        'Publication multi-plateformes',
        'Heures optimales',
        'File d\'attente automatique'
      ],
      status: 'beta',
      color: 'green'
    },
    {
      id: 'analytics',
      icon: ChartLineUp,
      title: 'Analytics Avancées',
      description: 'Tracking complet de tes performances et optimisation IA',
      features: [
        'ROI par contenu',
        'Analyse prédictive',
        'Suggestions d\'amélioration',
        'Rapports détaillés'
      ],
      status: 'coming',
      color: 'orange'
    },
    {
      id: 'style',
      icon: PaintBrush,
      title: 'Style Creator',
      description: 'Développe ton style unique et reste cohérent sur toutes tes publications',
      features: [
        'Brand kit personnel',
        'Cohérence visuelle',
        'Templates sur mesure',
        'Evolution automatique'
      ],
      status: 'beta',
      color: 'purple'
    },
    {
      id: 'automation',
      icon: Robot,
      title: 'Automatisation IA',
      description: 'L\'IA qui comprend ton audience et créé du contenu qui convertit',
      features: [
        'Analyse d\'audience',
        'Génération de hooks',
        'Copywriting optimisé',
        'Tests automatiques'
      ],
      status: 'coming',
      color: 'red'
    }
  ]

  const pricingTiers = [
    {
      name: 'Starter',
      price: '9€',
      crédits: '1,000',
      features: [
        '1,000 crédits/mois',
        'Outils de base',
        'Support communauté',
        'Export standard'
      ]
    },
    {
      name: 'Growth',
      price: '29€',
      crédits: '5,000',
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
      name: 'Scale',
      price: '79€',
      crédits: '20,000',
      features: [
        '20,000 crédits/mois',
        'Accès illimité',
        'Support dédié',
        'API access',
        'Custom branding'
      ]
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
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }

        @keyframes pulse-glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.6; }
        }

        .blur-pricing {
          filter: blur(8px);
          user-select: none;
          pointer-events: none;
        }

        .tool-card-gradient {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(255, 255, 255, 0.02));
        }
      `}</style>

      <HeaderWithAuth currentPage="outils" />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-80 h-80 rounded-full opacity-30"
            style={{
              background: `radial-gradient(circle, hsl(270 85% 55% / 0.3), transparent)`,
              filter: 'blur(100px)',
              animation: 'pulse-glow 8s ease-in-out infinite'
            }}
          />
          <div className="absolute top-40 right-20 w-60 h-60 rounded-full opacity-20"
            style={{
              background: `radial-gradient(circle, hsl(200 85% 50% / 0.2), transparent)`,
              filter: 'blur(80px)',
              animation: 'pulse-glow 10s ease-in-out infinite reverse'
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3 }}
              className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-8"
            >
              <Sparkle size={18} weight="fill" className="text-yellow-500" />
              <span className="text-sm font-semibold text-yellow-400">BÊTA - DISPONIBLE SAISON 1</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, delay: isMobile ? 0 : 0.05 }}
              className="text-5xl md:text-7xl font-bold mb-6"
              style={{ fontFamily: '"Manrope", sans-serif', fontWeight: 800 }}
            >
              <span className="text-white">L'IA qui </span>
              <span style={{
                background: 'linear-gradient(135deg, hsl(270 85% 55%), hsl(270 85% 45%))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                créé ton contenu
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: isMobile ? 0.2 : 0.3, delay: isMobile ? 0.05 : 0.1 }}
              className="text-xl md:text-2xl text-secondary mb-8 leading-relaxed"
            >
              30 jours de contenu en 30 minutes. Des outils IA conçus pour les créateurs Weokto.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="flex flex-col gap-4 items-center"
            >
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <button
                  onClick={() => document.getElementById('tools-showcase')?.scrollIntoView({ behavior: 'smooth' })}
                  className="group relative"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-200"></div>
                  <span className="relative flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-violet-500 rounded-lg text-lg font-bold text-white shadow-xl transition-all group-hover:shadow-violet-500/25">
                    Découvrir les outils
                    <ArrowDown size={20} weight="bold" className="group-hover:translate-y-1 transition-transform" />
                  </span>
                </button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted">
                <Gift size={16} weight="fill" className="text-green-400" />
                <span>Crédits gratuits à gagner régulièrement</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className="py-12 relative">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="glass-heavy rounded-3xl p-8 md:p-12 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 opacity-10">
              <Info size={256} weight="duotone" className="text-violet-500" />
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <Info size={24} weight="fill" className="text-violet-400" />
                </div>
                <h2 className="text-2xl font-bold text-white">Important à savoir</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold mb-1">100% Optionnel</p>
                      <p className="text-gray-400 text-sm">Tu n'es jamais obligé d'utiliser nos outils. Créé ton contenu comme tu veux.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold mb-1">Crédits Gratuits</p>
                      <p className="text-gray-400 text-sm">Gagne des crédits en participant aux compétitions et challenges.</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold mb-1">Arrivée Progressive</p>
                      <p className="text-gray-400 text-sm">Les outils arrivent petit à petit. Early access pour les plus actifs.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Check size={20} weight="bold" className="text-green-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-white font-semibold mb-1">Prix Accessibles</p>
                      <p className="text-gray-400 text-sm">On veut que tu réussisses. Les prix sont pensés pour être rentables dès le 1er jour.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tools Showcase */}
      <section id="tools-showcase" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              Les outils qui changent la donne
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Conçus spécifiquement pour les créateurs Weokto. Optimisés pour convertir.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col hover:scale-105 transition-all duration-300">
                  {tool.status === 'beta' && (
                    <div className="absolute -top-3 -right-3">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-full text-xs font-bold text-white">BÊTA</span>
                    </div>
                  )}
                  {tool.status === 'coming' && (
                    <div className="absolute -top-3 -right-3">
                      <span className="px-3 py-1 bg-gray-700 rounded-full text-xs font-bold text-gray-400">BIENTÔT</span>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-${tool.color}-500/30 to-${tool.color}-600/30 flex items-center justify-center mb-4`}>
                      <tool.icon size={24} weight="duotone" className="text-violet-400" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-sm text-gray-400 min-h-[40px]">{tool.description}</p>
                  </div>

                  <div className="space-y-2 flex-1">
                    {tool.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle size={16} weight="fill" className="text-violet-500 flex-shrink-0" />
                        <span className="text-xs text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setSelectedTool(tool.id)}
                    className={`mt-6 w-full py-2.5 rounded-lg font-medium text-sm transition-all ${
                      tool.status === 'coming' 
                        ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                        : 'bg-violet-500/20 text-violet-400 hover:bg-violet-500/30'
                    }`}
                    disabled={tool.status === 'coming'}
                  >
                    {tool.status === 'coming' ? 'Prochainement' : 'Disponible en bêta fermée'}
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative bg-gradient-to-b from-transparent via-violet-950/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
              <Strategy size={18} weight="fill" className="text-violet-500" />
              <span className="text-sm font-semibold text-violet-400">PROCESSUS SIMPLE</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              Comment ça marche
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              3 étapes pour transformer ta création de contenu
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                icon: Target,
                title: 'Choisis ton produit',
                description: 'Sélectionne un produit d\'un fournisseur Weokto que tu veux promouvoir'
              },
              {
                step: '2',
                icon: MagicWand,
                title: 'L\'IA fait le travail',
                description: 'Nos outils créent du contenu optimisé pour ce produit spécifique'
              },
              {
                step: '3',
                icon: Rocket,
                title: 'Publie et monétise',
                description: 'Exporte, programme et publie. Puis convertit tes clients'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="mb-6 relative inline-block">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
                    <item.icon size={32} weight="duotone" className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section - Blurred */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card rounded-full px-4 py-2 mb-6">
              <Clock size={18} weight="fill" className="text-orange-500" />
              <span className="text-sm font-semibold text-orange-400">COMING SOON - SAISON 1</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
              Des prix pensés pour ta réussite
            </h2>
            <p className="text-lg text-secondary max-w-3xl mx-auto">
              Investissement minimal, ROI maximal. Et des crédits gratuits à gagner en permanence.
            </p>
          </motion.div>

          <div className="relative">
            {/* Blurred Pricing Cards */}
            <div className="blur-pricing grid grid-cols-1 md:grid-cols-3 gap-6">
              {pricingTiers.map((tier, index) => (
                <div
                  key={index}
                  className={`glass-card rounded-2xl p-8 ${tier.popular ? 'ring-2 ring-violet-500' : ''}`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1 bg-gradient-to-r from-violet-600 to-violet-500 rounded-full text-xs font-bold text-white">
                        POPULAIRE
                      </span>
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400">/mois</span>
                  </div>
                  <div className="text-sm text-violet-400 font-semibold mb-6">
                    {tier.crédits} crédits inclus
                  </div>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check size={16} weight="bold" className="text-violet-500" />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className="w-full py-3 rounded-lg bg-violet-500/20 text-violet-400 font-semibold">
                    Bientôt disponible
                  </button>
                </div>
              ))}
            </div>

            {/* Overlay Message */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="glass-heavy rounded-3xl p-8 max-w-lg text-center"
              >
                <Lock size={48} weight="duotone" className="text-violet-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">Disponible Saison 1</h3>
                <p className="text-gray-300 mb-6">
                  Les prix seront dévoilés au lancement de la Saison 1.
                </p>
                <div className="glass-card rounded-xl p-4">
                  <p className="text-sm text-violet-400 font-semibold mb-2">
                    <Gift size={18} weight="fill" className="inline mr-2" />
                    Comment gagner des crédits gratuits :
                  </p>
                  <ul className="text-xs text-gray-400 space-y-1 text-left">
                    <li>• Participe aux compétitions</li>
                    <li>• Complete les challenges hebdomadaires</li>
                    <li>• Atteins des milestones de revenus</li>
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
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
            Questions fréquentes
          </motion.h2>

          <div className="space-y-4">
            {[
              {
                question: "Suis-je obligé d'utiliser les outils Weokto ?",
                answer: "Non ! C'est 100% optionnel. Tu peux créer ton contenu comme tu veux, avec tes propres outils. Nos outils sont là pour t'aider si tu en as besoin, pas pour t'imposer une méthode."
              },
              {
                question: "Comment fonctionnent les crédits ?",
                answer: "1 crédit = 1 utilisation d'outil (ex: 1 carrousel généré). Tu peux acheter des crédits ou en gagner gratuitement via les compétitions, challenges et parrainages. Les crédits n'expirent jamais."
              },
              {
                question: "Les outils sont-ils adaptés à tous les produits ?",
                answer: "Oui ! Nos IA sont entraînées sur chaque produit fournisseur. Elles comprennent les spécificités de chaque niche et créent du contenu personnalisé qui convertit."
              },
              {
                question: "Quand les outils seront-ils disponibles ?",
                answer: "Progressivement dès la Saison 1. Les membres les plus actifs auront un accès early beta. Certains outils sont déjà en test privé."
              },
              {
                question: "Est-ce que l'IA remplace ma créativité ?",
                answer: "Jamais ! L'IA est ton assistant, pas ton remplaçant. Elle te fait gagner du temps sur la production pour que tu puisses te concentrer sur ta stratégie et ta personnalité unique."
              },
              {
                question: "Comment être sûr que le contenu sera unique ?",
                answer: "Chaque génération est unique et personnalisée selon ton style. L'IA ne fait jamais deux fois le même contenu, même pour le même produit."
              }
            ].map((faq, index) => (
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
              <Sparkle size={48} weight="duotone" className="text-yellow-400 mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4" style={{ fontFamily: '"Manrope", sans-serif' }}>
                Prêt à automatiser ta création ?
              </h2>
              <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
                Rejoins Weokto maintenant et sois parmi les premiers à tester nos outils IA révolutionnaires.
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