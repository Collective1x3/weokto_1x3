'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  GraduationCap,
  ChatCircleDots,
  Trophy,
  CurrencyDollar,
  ArrowRight,
  Sparkle,
  Users,
  BookOpen,
  Lightning
} from '@phosphor-icons/react/dist/ssr'

// CORE FEATURES
const coreFeatures = [
  {
    icon: GraduationCap,
    title: 'Formations structurées',
    description: 'Parcours d\'apprentissage complets'
  },
  {
    icon: ChatCircleDots,
    title: 'Communauté engagée',
    description: 'Chat temps réel et espaces privés'
  },
  {
    icon: Trophy,
    title: 'Gamification native',
    description: 'Motivation par le jeu et la progression'
  },
  {
    icon: CurrencyDollar,
    title: 'Monétisation simple',
    description: 'Abonnements et paiements intégrés'
  }
]

// PROBLEM STATEMENTS
const painPoints = [
  {
    icon: BookOpen,
    title: 'Votre expertise mérite mieux qu\'une simple vidéo'
  },
  {
    icon: Users,
    title: 'L\'apprentissage est social, pas solitaire'
  },
  {
    icon: Lightning,
    title: 'Créer et gérer devrait être simple, pas technique'
  }
]

export default function StamLandingPage() {
  return (
    <main className="relative bg-[#F5F1E8]">
      {/* Mobile Header - Fixed at top, centered STAM logo */}
      <header className="fixed left-0 right-0 top-0 z-50 flex items-center justify-center px-4 pt-4 md:hidden">
        <div className="rounded-2xl border border-stone-300 bg-[#FEFDFB]/95 px-6 py-3 shadow-lg shadow-stone-900/5 backdrop-blur-sm">
          <span className="text-xl font-bold tracking-tight text-stone-900">STAM</span>
        </div>
      </header>

      {/* SECTION 1: HERO - STAM Bottom Left Corner */}
      <section className="relative min-h-screen pl-4 pr-4 md:px-6 lg:px-8 flex items-end md:items-center overflow-hidden">
        {/* Background Elements - Organic Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Top Right Blob */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.4, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full blur-3xl"
          />

          {/* Bottom Right Blob */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.5, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-amber-50 to-stone-100 rounded-full blur-3xl"
          />

          {/* Decorative Dot Grid - Subtle */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: 'radial-gradient(circle, #d6d3d1 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative mx-auto max-w-7xl w-full pb-8 md:pb-16 lg:pb-20 pt-20 md:pt-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-end">
            {/* Left Column - Main Content */}
            <div className="space-y-6 md:space-y-8">
              {/* STAM - Massive Bottom Left Corner */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="-ml-2 md:-ml-3 lg:-ml-4"
              >
                <h1 className="text-[18vw] sm:text-[15vw] md:text-[12vw] lg:text-[10vw] xl:text-[160px] font-extrabold tracking-tighter text-stone-900 leading-[0.8]">
                  STAM
                </h1>
              </motion.div>

              {/* Baseline */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="max-w-md pl-1"
              >
                <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-medium text-stone-700 leading-relaxed">
                  Créez, gérez et monétisez votre communauté d&apos;apprentissage
                </p>
              </motion.div>

              {/* Decorative Line */}
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="h-1 w-24 bg-gradient-to-r from-amber-800 to-amber-600 rounded-full origin-left"
              />

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
                className="pt-4"
              >
                <Link
                  href="/stam/login"
                  className="group inline-flex items-center justify-center gap-3 rounded-xl bg-stone-900 px-8 sm:px-10 py-4 sm:py-5 text-base sm:text-lg font-bold text-[#FEFDFB] shadow-lg shadow-stone-900/20 transition-all duration-300 ease-out hover:bg-stone-800 hover:shadow-xl hover:shadow-stone-900/30 hover:-translate-y-0.5"
                >
                  Démarrer gratuitement
                  <ArrowRight
                    size={22}
                    weight="bold"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </motion.div>

              {/* Quick Value Props */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="flex flex-wrap gap-4 pt-2 text-sm font-medium text-stone-600"
              >
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                  <span>Sans engagement</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                  <span>0€/mois</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-700" />
                  <span>Prêt en 5 min</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column - Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:flex items-center justify-center relative"
            >
              <div className="relative w-full aspect-square max-w-lg rounded-2xl border-2 border-dashed border-stone-300 bg-[#FEFDFB]/50 backdrop-blur-sm flex items-center justify-center">
                <span className="text-stone-400 text-sm font-medium">Image à venir</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="absolute bottom-16 md:bottom-20 lg:bottom-24 left-1/2 -translate-x-1/2 hidden md:block"
        >
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <span className="text-sm font-semibold tracking-wide uppercase">Découvrir</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-5 h-8 rounded-full border-2 border-stone-400 flex items-start justify-center p-1">
                <div className="w-1 h-2 rounded-full bg-stone-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* SECTION 2: PROBLEM/VALUE */}
      <section className="relative min-h-screen px-4 py-20 sm:py-32 md:py-40 md:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 0.3, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2 }}
            className="absolute -left-48 top-1/4 w-96 h-96 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="mb-16 sm:mb-20 md:mb-24 text-center"
          >
            <h2 className="mb-6 sm:mb-8 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 leading-[0.9] px-4 sm:px-0">
              Transformez votre{' '}
              <span className="text-amber-800">
                expertise
              </span>
            </h2>
            <p className="mx-auto max-w-4xl text-lg sm:text-2xl font-medium text-stone-700 leading-relaxed px-4 sm:px-0">
              En expérience communautaire immersive
            </p>
          </motion.div>

          {/* Pain Points with 3D effect */}
          <div className="grid gap-8 sm:gap-10 md:gap-12 sm:grid-cols-2 md:grid-cols-3">
            {painPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 40, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -8, rotateX: 5, scale: 1.02 }}
                style={{ perspective: 1000 }}
                className="flex flex-col items-center text-center group cursor-pointer"
              >
                <motion.div
                  whileHover={{ rotateY: 5 }}
                  transition={{ duration: 0.3 }}
                  className="mb-6 sm:mb-8 inline-flex rounded-2xl bg-[#FEFDFB] border border-stone-200 p-6 sm:p-8 shadow-md shadow-stone-900/5 transition-all duration-500 ease-out group-hover:shadow-xl group-hover:shadow-amber-500/10 group-hover:border-amber-200"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <point.icon size={48} weight="bold" className="text-amber-800 sm:w-16 sm:h-16 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
                </motion.div>
                <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-tight px-4 sm:px-0 transition-colors duration-300 group-hover:text-amber-900">
                  {point.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SOLUTION/FEATURES */}
      <section className="relative px-4 py-16 sm:py-20 md:py-24 md:px-6 lg:px-8 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.2, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="absolute right-0 top-1/3 w-[600px] h-[600px] bg-gradient-to-tl from-amber-100 via-stone-100 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative mx-auto max-w-7xl w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            {/* Left - Text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              <h2 className="mb-4 sm:mb-6 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-stone-900 leading-[0.9]">
                Tout ce dont vous{' '}
                <span className="text-amber-800">
                  avez besoin
                </span>
              </h2>
              <p className="text-base sm:text-xl md:text-2xl font-medium text-stone-700 leading-relaxed">
                Pour éduquer et engager votre communauté
              </p>
            </motion.div>

            {/* Right - Image Placeholder */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="hidden lg:block"
            >
              <div className="relative aspect-video rounded-2xl border-2 border-dashed border-stone-300 bg-[#FEFDFB]/50 backdrop-blur-sm flex items-center justify-center overflow-hidden">
                <span className="text-stone-400 text-sm font-medium">Aperçu plateforme</span>
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-10" style={{
                  backgroundImage: 'linear-gradient(to right, #78716c 1px, transparent 1px), linear-gradient(to bottom, #78716c 1px, transparent 1px)',
                  backgroundSize: '40px 40px'
                }} />
              </div>
            </motion.div>
          </div>

          {/* Core Features - 2x2 Grid with enhanced 3D */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {coreFeatures.map((feature, index) => (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 40, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: index * 0.12, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{
                  y: -8,
                  rotateX: 3,
                  rotateY: 2,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                }}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl border border-stone-300 bg-gradient-to-br from-[#FEFDFB] to-[#FAF9F7] p-4 sm:p-8 md:p-10 shadow-md shadow-stone-900/5 transition-all duration-500 ease-out hover:shadow-xl hover:shadow-stone-900/10 hover:border-amber-300 cursor-pointer"
              >
                {/* Shine effect on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />

                <div className="relative" style={{ transform: 'translateZ(20px)' }}>
                  {/* Icon with 3D effect */}
                  <motion.div
                    className="mb-3 sm:mb-6 inline-flex rounded-lg sm:rounded-xl bg-amber-50 border border-amber-200 p-2.5 sm:p-5 transition-all duration-500 group-hover:bg-amber-100 group-hover:border-amber-300"
                    whileHover={{ rotateZ: 5 }}
                  >
                    <feature.icon size={28} weight="bold" className="text-amber-800 sm:w-12 sm:h-12 transition-transform duration-500 group-hover:scale-110" />
                  </motion.div>
                  <h3 className="mb-1.5 sm:mb-3 text-sm sm:text-2xl font-bold text-stone-900 transition-colors duration-300 group-hover:text-amber-900 leading-tight">{feature.title}</h3>
                  <p className="text-xs sm:text-base md:text-lg text-stone-600 leading-relaxed transition-colors duration-300 group-hover:text-stone-700">{feature.description}</p>
                </div>

                {/* Decorative corner element */}
                <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-amber-100/20 rounded-full blur-2xl transition-all duration-500 group-hover:w-32 group-hover:h-32 group-hover:bg-amber-200/30" />
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: SOCIAL PROOF + FINAL CTA */}
      <section className="relative min-h-screen px-4 py-20 sm:py-32 md:py-40 md:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{
              x: [0, 30, 0],
              y: [0, -20, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-amber-100 to-amber-50 rounded-full blur-3xl opacity-40"
          />
          <motion.div
            animate={{
              x: [0, -30, 0],
              y: [0, 20, 0],
              scale: [1, 1.15, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-gradient-to-tl from-stone-200 to-amber-100 rounded-full blur-3xl opacity-30"
          />
        </div>

        <div className="relative mx-auto max-w-6xl w-full">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
          >
            {/* Stats with 3D hover */}
            <div className="mb-16 sm:mb-20 grid gap-8 sm:gap-10 md:gap-12 sm:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, rotateY: 5 }}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#FEFDFB] to-[#FAF9F7] border border-stone-200 shadow-lg shadow-stone-900/5 transition-all duration-300 hover:shadow-xl hover:border-amber-300 cursor-pointer"
              >
                <div className="mb-2 sm:mb-3 text-5xl sm:text-7xl font-bold text-stone-900 bg-gradient-to-br from-stone-900 to-amber-900 bg-clip-text text-transparent">200+</div>
                <div className="text-base sm:text-xl font-medium text-stone-700">Créateurs actifs</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 30, rotateX: 15 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ scale: 1.05, rotateY: -5 }}
                style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
                className="p-8 rounded-2xl bg-gradient-to-br from-[#FEFDFB] to-[#FAF9F7] border border-stone-200 shadow-lg shadow-stone-900/5 transition-all duration-300 hover:shadow-xl hover:border-amber-300 cursor-pointer"
              >
                <div className="mb-2 sm:mb-3 text-5xl sm:text-7xl font-bold text-stone-900 bg-gradient-to-br from-stone-900 to-amber-900 bg-clip-text text-transparent">10k+</div>
                <div className="text-base sm:text-xl font-medium text-stone-700">Membres engagés</div>
              </motion.div>
            </div>

            {/* Pricing Card with enhanced 3D */}
            <motion.div
              id="pricing"
              initial={{ opacity: 0, y: 40, rotateX: 20 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -10, rotateX: 2, scale: 1.02 }}
              style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
              className="mb-16 sm:mb-20 mx-auto max-w-2xl"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-stone-300 bg-gradient-to-br from-[#FEFDFB] via-[#FAF9F7] to-[#FEFDFB] p-8 sm:p-12 shadow-xl shadow-stone-900/10 transition-all duration-500 hover:shadow-2xl hover:border-amber-300">
                <div className="relative" style={{ transform: 'translateZ(30px)' }}>
                  {/* Price display */}
                  <div className="mb-8 text-center">
                    <motion.div
                      className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-300 px-5 py-2.5 shadow-md"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <Sparkle size={24} weight="bold" className="text-amber-800" />
                    </motion.div>
                    <motion.div
                      className="mb-2"
                      initial={{ scale: 0.9 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                    >
                      <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-br from-stone-900 to-amber-900 bg-clip-text text-transparent">0€</span>
                      <span className="ml-2 text-xl sm:text-2xl text-stone-600">/mois</span>
                    </motion.div>
                    <p className="text-sm text-stone-500 font-medium">Toujours gratuit</p>
                  </div>

                  {/* Divider with gradient */}
                  <div className="my-8 h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent" />

                  {/* Pricing details */}
                  <div className="space-y-4">
                    <motion.div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50/50 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-base sm:text-lg font-medium text-stone-700">Frais de paiement</span>
                      <span className="text-base sm:text-lg font-bold text-stone-900">6% + 0,40€</span>
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-amber-50/50 transition-colors duration-300"
                      whileHover={{ x: 5 }}
                    >
                      <span className="text-base sm:text-lg font-medium text-stone-700">Frais de retrait</span>
                      <span className="text-base sm:text-lg font-bold text-stone-900">3% + 0,25€</span>
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Final CTA */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="mb-8 sm:mb-12 text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-stone-900 leading-[0.9] px-4 sm:px-0"
            >
              Commencez à{' '}
              <motion.span
                className="text-amber-800 inline-block"
                whileHover={{ scale: 1.05, rotate: -1 }}
              >
                éduquer
              </motion.span>{' '}
              gratuitement
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7, duration: 0.8 }}
              className="mx-auto mb-12 sm:mb-16 max-w-3xl text-lg sm:text-2xl font-medium text-stone-700 leading-relaxed px-4 sm:px-0"
            >
              Rejoignez les créateurs qui réinventent l&apos;éducation en ligne
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <Link
                href="/stam/login"
                className="group relative inline-flex items-center justify-center gap-2 sm:gap-3 rounded-xl bg-stone-900 px-10 sm:px-14 py-5 sm:py-7 text-base sm:text-xl font-bold text-[#FEFDFB] shadow-lg shadow-stone-900/20 transition-all duration-300 ease-out hover:bg-stone-800 hover:shadow-2xl hover:shadow-stone-900/30 hover:-translate-y-1 overflow-hidden"
              >
                {/* Shine effect */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />

                <span className="relative">Créer ma communauté</span>
                <ArrowRight size={24} weight="bold" className="relative transition-transform duration-300 group-hover:translate-x-2 sm:w-[28px] sm:h-[28px]" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
