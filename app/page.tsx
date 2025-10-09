'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import * as Icons from '@phosphor-icons/react'
import FooterLandingPage from '@/components/weokto/FooterLandingPage'
import FAQSection from '@/components/weokto/FAQSection'
import PartnerFormModal from '@/components/weokto/PartnerFormModal'
import TerminalHeaderLandingPage from '@/components/weokto/TerminalHeaderLandingPage'
import { useAuth } from '@/contexts/AuthContext'
import TerminalAuthModal from '@/components/weokto/TerminalAuthModal'

export default function LandingPageV7() {
  const [cursorBlink, setCursorBlink] = useState(true)
  const [glitchActive, setGlitchActive] = useState(false)
  const [earnings, setEarnings] = useState(127450)
  const [creators, setCreators] = useState(830)
  const [guilds, setGuilds] = useState(2)
  const [typewriterText, setTypewriterText] = useState('')
  const [showPartnerForm, setShowPartnerForm] = useState(false)
  const [level, setLevel] = useState(1)
  const [showAlternateText, setShowAlternateText] = useState(false)
  const [showFees, setShowFees] = useState(false)

  // Auth context
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    email,
    setEmail,
    sendMagicLink,
    loadingAction,
    successMessage,
    errorMessage
  } = useAuth()

  const handleStartClick = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }
  const [commandHistory, setCommandHistory] = useState<string[]>([
    '> SYSTEM INITIALIZED',
    '> LOADING WEOKTO.EXE...',
    '> XP SYSTEM: ACTIVE',
    '> PEARL ENGINE: ONLINE',
    '> GUILD NETWORK: CONNECTED',
    '> READY TO DOMINATE'
  ])

  const fullText = 'CRÉE. VENDS. DOMINE.'
  const alternateText = 'LA PLATEFORME DU COMMUNITY BUILDING.'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const showWeoktoRef = useRef(true)

  // Typewriter effect with text switch
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypewriterText(fullText.slice(0, index + 1))
        index++
      } else {
        clearInterval(timer)
        // Wait 3 seconds then switch to alternate text
        setTimeout(() => {
          setShowAlternateText(true)
          setTypewriterText('')
          let altIndex = 0
          const altTimer = setInterval(() => {
            if (altIndex < alternateText.length) {
              setTypewriterText(alternateText.slice(0, altIndex + 1))
              altIndex++
            } else {
              clearInterval(altTimer)
              // Switch back to original after 5 seconds
              setTimeout(() => {
                setShowAlternateText(false)
                setTypewriterText('')
                index = 0
                const resetTimer = setInterval(() => {
                  if (index < fullText.length) {
                    setTypewriterText(fullText.slice(0, index + 1))
                    index++
                  } else {
                    clearInterval(resetTimer)
                  }
                }, 100)
              }, 5000)
            }
          }, 50)
        }, 3000)
      }
    }, 100)
    return () => clearInterval(timer)
  }, [])

  // Cursor blink
  useEffect(() => {
    const timer = setInterval(() => setCursorBlink(b => !b), 500)
    return () => clearInterval(timer)
  }, [])

  // Random glitch effect - DISABLED
  // useEffect(() => {
  //   const glitchInterval = setInterval(() => {
  //     setGlitchActive(true)
  //     setTimeout(() => setGlitchActive(false), 100)
  //   }, 8000)
  //   return () => clearInterval(glitchInterval)
  // }, [])

  // Dynamic metrics
  useEffect(() => {
    const timer = setInterval(() => {
      setEarnings(e => e + Math.floor(Math.random() * 500))
      setCreators(c => c + Math.floor(Math.random() * 3))
      if (Math.random() > 0.9) setLevel(l => l + 1)
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  // Matrix rain effect with WEOKTO easter egg
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // Hide WEOKTO after 3 seconds
    const hideTimer = setTimeout(() => {
      showWeoktoRef.current = false
    }, 3000)

    const fontSize = 16
    const columns = Math.floor(canvas.width / fontSize)
    const drops: number[] = Array(columns).fill(1)

    // Define WEOKTO pattern (simple bitmap for each letter)
    const letters: { [key: string]: number[][] } = {
      W: [
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,1,0,1],
        [1,0,1,0,1],
        [1,1,0,1,1],
        [1,0,0,0,1]
      ],
      E: [
        [1,1,1,1,1],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,0],
        [1,0,0,0,0],
        [1,0,0,0,0],
        [1,1,1,1,1]
      ],
      O: [
        [0,1,1,1,0],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [1,0,0,0,1],
        [0,1,1,1,0]
      ],
      K: [
        [1,0,0,0,1],
        [1,0,0,1,0],
        [1,0,1,0,0],
        [1,1,0,0,0],
        [1,0,1,0,0],
        [1,0,0,1,0],
        [1,0,0,0,1]
      ],
      T: [
        [1,1,1,1,1],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0],
        [0,0,1,0,0]
      ]
    }

    // Create opacity map for the entire canvas
    const createOpacityMap = () => {
      const map: number[][] = []

      // Initialize map with zeros
      for (let y = 0; y < Math.ceil(canvas.height / fontSize); y++) {
        map[y] = []
        for (let x = 0; x < columns; x++) {
          map[y][x] = 0
        }
      }

      // Only show WEOKTO on desktop screens (>= 1024px) and if showWeokto is true
      if (window.innerWidth < 1024 || !showWeoktoRef.current) {
        return map
      }

      const letterWidth = 5
      const letterHeight = 7
      const letterSpacing = 2
      const wordWidth = 6 * letterWidth + 5 * letterSpacing // WEOKTO = 6 letters

      // Calculate scale based on screen size - make it fit within 80% of screen width
      const maxWordWidth = columns * 0.8
      const baseScale = Math.floor(maxWordWidth / wordWidth)
      const scale = Math.max(2, Math.min(baseScale, 8)) // Clamp between 2 and 8

      // Calculate starting position to center the word
      const startX = Math.floor((columns - wordWidth * scale) / 2)
      const startY = Math.floor((canvas.height / fontSize - letterHeight * scale) / 2)

      // Draw WEOKTO
      const word = 'WEOKTO'
      let currentX = startX

      for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
        const letter = letters[word[letterIndex]]
        if (!letter) continue

        // Draw each letter
        for (let y = 0; y < letterHeight; y++) {
          for (let x = 0; x < letterWidth; x++) {
            if (letter[y][x] === 1) {
              // Apply scaling
              for (let sy = 0; sy < scale; sy++) {
                for (let sx = 0; sx < scale; sx++) {
                  const mapY = startY + y * scale + sy
                  const mapX = currentX + x * scale + sx
                  if (mapY >= 0 && mapY < map.length && mapX >= 0 && mapX < columns) {
                    map[mapY][mapX] = 1
                  }
                }
              }
            }
          }
        }
        currentX += (letterWidth + letterSpacing) * scale
      }

      return map
    }

    const opacityMap = createOpacityMap()

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96)

        // Check if this position should be highlighted (only if still showing)
        const dropY = Math.floor(drops[i])
        const isHighlighted = showWeoktoRef.current && opacityMap[dropY] && opacityMap[dropY][i] === 1

        // Vary color and opacity based on position
        if (isHighlighted) {
          // Make WEOKTO positions brighter and slightly orange-tinted
          ctx.fillStyle = '#FFB000'
          ctx.globalAlpha = 0.9
        } else {
          // Normal purple rain with lower opacity
          ctx.fillStyle = '#B794F4'
          ctx.globalAlpha = 0.3
        }

        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        ctx.globalAlpha = 1 // Reset alpha

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    return () => {
      clearInterval(interval)
      clearTimeout(hideTimer)
    }
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
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,0,0,0.01)] to-transparent" />
      </div>

      {/* Glitch Effect Overlay - REMOVED to prevent flashing */}

      {/* Header */}
      <TerminalHeaderLandingPage />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-8 px-3">
        <div className="w-full max-w-5xl mx-auto text-center z-10">
          {/* Season 0 Announcement */}
          <div className="mb-4">
            <p className="text-xs md:text-sm text-[#FFB000] tracking-widest">
              {'[ SAISON 0 - ACCÈS ANTICIPÉ OUVERT ]'}
            </p>
          </div>

          {/* ASCII Art Logo - Responsive size */}
          <div className="mb-6">
            <div className="w-full overflow-x-auto">
              <pre className="text-[#B794F4] text-[8px] sm:text-xs md:text-sm mb-6 sm:mb-8 block mx-auto text-left" style={{display: 'inline-block'}}>
{`
██╗    ██╗███████╗ ██████╗ ██╗  ██╗████████╗ ██████╗
██║    ██║██╔════╝██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗
██║ █╗ ██║█████╗  ██║   ██║█████╔╝    ██║   ██║   ██║
██║███╗██║██╔══╝  ██║   ██║██╔═██╗    ██║   ██║   ██║
╚███╔███╔╝███████╗╚██████╔╝██║  ██╗   ██║   ╚██████╔╝
 ╚══╝╚══╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝
`}
              </pre>
            </div>
          </div>

          {/* Main Title with typewriter */}
          <h1 className="text-2xl sm:text-3xl md:text-5xl mb-4 sm:mb-6 tracking-wide sm:tracking-wider">
            {typewriterText}
            <span className={`inline-block w-3 h-6 sm:w-4 sm:h-8 bg-[#B794F4] ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
          </h1>

          <div className="mb-6 text-xs sm:text-sm md:text-base px-2 sm:px-0">
            <p className="mb-2 text-white">GAGNE DE L'ARGENT EN VENDANT DES COMMUNAUTÉS</p>
            <p className="mb-2 text-white">APPRENDS AVEC LES MEILLEURES GUILDES</p>
            <p className="mb-2 text-white">MULTIPLIE TES REVENUS GRÂCE AUX PEARLS</p>
          </div>

          {/* CTA Button */}
          <div className="flex items-center justify-center px-4 sm:px-0">
            <button
              onClick={handleStartClick}
              className="px-4 py-2.5 sm:px-6 sm:py-3 bg-[#B794F4] text-black hover:bg-[#B794F4]/80 transition-all text-xs sm:text-sm tracking-wider flex items-center gap-2 group"
            >
              <span className="inline-block w-0 group-hover:w-4 transition-all">{'>'}</span>
              DÉMARRER GRATUITEMENT
            </button>
          </div>

          {/* Live Stats Display */}
          <div className="mt-12 sm:mt-16 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto px-4 sm:px-0">
            <div className="border border-[#B794F4] p-3 sm:p-4 bg-black/80">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-[#FFB000]">72H</div>
              <div className="text-xs">PREMIÈRE VENTE</div>
            </div>
            <div className="border border-[#B794F4] p-3 sm:p-4 bg-black/80">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-[#FFB000]">+830</div>
              <div className="text-xs">CRÉATEURS ACTIFS</div>
            </div>
            <div className="border border-[#B794F4] p-3 sm:p-4 bg-black/80">
              <div className="text-xl sm:text-2xl mb-1 sm:mb-2 text-[#FFB000]">2</div>
              <div className="text-xs">GUILDES</div>
            </div>
          </div>
        </div>
      </section>

      {/* Terminal Features Section */}
      <section id="how-it-works" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="border-2 border-[#B794F4] bg-black/90">
            {/* Terminal Header */}
            <div className="border-b-2 border-[#B794F4] p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF5F56]" />
                <div className="w-3 h-3 bg-[#FFBD2E]" />
                <div className="w-3 h-3 bg-[#27C93F]" />
              </div>
              <div className="text-xs">FEATURES</div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6">
              <div className="space-y-4 text-xs sm:text-sm">
                <div className="text-[#FFB000]">{'>'} LES 5 ÉTAPES DE WEOKTO...</div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-white">{'>'} [1] REJOINS UNE GUILDE</div>
                  <div className="pl-3 sm:pl-4 text-xs text-gray-400">
                    <div>→ Les guildes t'apprennent le community building</div>
                    <div>→ Formation complète & accompagnement 7J/7</div>
                    <div>[██████████] FORMATION</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="text-white">{'>'} [2] CHOISIS TON FOURNISSEUR</div>
                  <div className="pl-3 sm:pl-4 text-xs text-gray-400">
                    <div>→ Sélectionne des produits de haute qualité</div>
                    <div>→ Les meilleurs du marché, vérifiés et approuvés</div>
                    <div>[██████████] QUALITÉ</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-white">{'>'} [3] CRÉE & CONVERTIT</div>
                  <div className="pl-3 sm:pl-4 text-xs text-gray-400">
                    <div>→ Crée du contenu percutant avec nos outils IA</div>
                    <div>→ Trouve et convertis des clients</div>
                    <div>[██████████] CONVERSION</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <div className="text-white">{'>'} [4] REVENUS PASSIFS</div>
                  <div className="pl-3 sm:pl-4 text-xs text-gray-400">
                    <div>→ Les commissions tombent automatiquement</div>
                    <div>→ Le business tourne pendant que tu dors</div>
                    <div>[█████████░] SCALING</div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <div className="text-white">{'>'} [5] GAGNE TOUJOURS PLUS</div>
                  <div className="pl-3 sm:pl-4 text-xs text-gray-400">
                    <div>→ Plus tu gagnes, plus tu es récompensé en Pearls</div>
                    <div>→ Avantages business, voyages et récompenses</div>
                    <div>[█████████░] RÉCOMPENSES</div>
                  </div>
                </motion.div>

                <div className="mt-6 text-[#FFB000] animate-pulse">
                  {'>'} LA SAISON 0 ARRIVE BIENTÔT...
                  <span className={`inline-block w-2 h-4 bg-[#FFB000] ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 sm:py-20 relative z-10">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h2 className="text-2xl md:text-3xl font-mono text-center mb-12 text-[#B794F4]">
            ILS ONT TRANSFORMÉ LEUR VIE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Tibo MRT */}
            <motion.div
              className="border-2 border-[#B794F4] bg-black/90 overflow-hidden hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Large Image Section */}
              <div className="relative h-48 sm:h-56 md:h-64 border-b-2 border-[#B794F4]">
                <Image
                  src="/images/testimonial1.jpg"
                  alt="Tibo MRT"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-xl">TIBO_MRT</div>
                  <div className="text-[#FFB000] text-lg font-bold">€12K/MOIS</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs text-gray-500">GUILDE: COMMUNITY ACADEMY</div>
                  <div className="text-xs text-[#FFB000]">24K PEARLS</div>
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "Weokto a changé ma vie alors qu'ils n'avaient qu'un discord, et une idée.
                  Maintenant, ils ont le site, les connexions et moi j'en tire de plus en plus d'argent
                  ça a littéralement changé ma vie."
                </p>
              </div>
            </motion.div>

            {/* Spider CB */}
            <motion.div
              className="border-2 border-[#B794F4] bg-black/90 overflow-hidden hover:scale-105 transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {/* Large Image Section */}
              <div className="relative h-48 sm:h-56 md:h-64 border-b-2 border-[#B794F4]">
                <Image
                  src="/images/testimonial2.jpg"
                  alt="Spider CB"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-xl">SPIDER_CB</div>
                  <div className="text-[#FFB000] text-lg font-bold">€9K/MOIS</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs text-gray-500">GUILDE: TBCB</div>
                  <div className="text-xs text-[#FFB000]">18K PEARLS</div>
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "J'ai commencé y'a quelques mois, c'était déjà incroyable sur le discord
                  mais maintenant avec le site c'est encore mieux. J'ai quitté staps
                  et je vis du community building."
                </p>
              </div>
            </motion.div>

            {/* Interactive You Card */}
            <motion.div
              className="border-2 border-[#FFB000] bg-black/90 overflow-hidden hover:scale-105 transition-all cursor-pointer group relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onClick={(e) => {
                const card = e.currentTarget;
                card.classList.toggle('unlocked');
              }}
            >
              {/* Blur overlay that disappears on click */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-md group-[.unlocked]:opacity-0 group-[.unlocked]:pointer-events-none transition-all duration-700 z-10 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-[#FFB000] text-xl font-bold mb-2 animate-pulse">[CLIQUE POUR DÉBLOQUER]</div>
                  <div className="text-sm text-gray-300">ÇA POURRAIT ÊTRE TOI</div>
                </div>
              </div>

              {/* Large Image Section */}
              <div className="relative h-48 sm:h-56 md:h-64 border-b-2 border-[#FFB000] group-[.unlocked]:brightness-100 brightness-50 transition-all duration-700">
                <Image
                  src="/images/testimonial-you.jpg"
                  alt="Toi"
                  fill
                  className="object-cover"
                  style={{ objectPosition: 'center' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-white font-bold text-xl">TOI</div>
                  <div className="text-[#FFB000] text-lg font-bold">€89K MRR</div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-xs text-gray-500">TA GUILDE</div>
                  <div className="text-xs text-[#FFB000]">178K PEARLS</div>
                </div>
                <p className="text-sm text-gray-300 italic leading-relaxed">
                  "Weokto a changé ma vie. J'ai pu faire plaisir à _______.
                  J'ai enfin _______. Ma famille est _______.
                  Merci à l'équipe Weokto et à ma guilde!"
                </p>
              </div>
            </motion.div>
          </div>

          {/* Call to action */}
          <div className="text-center mt-12">
            <p className="text-[#FFB000] text-sm animate-pulse mb-4">
              PROCHAINE SUCCESS STORY: LA TIENNE?
            </p>
            <button
              onClick={handleStartClick}
              className="px-6 py-3 border-2 border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-sm tracking-wider"
            >
              REJOINDRE UNE GUILDE
            </button>
          </div>
        </div>
      </section>

      {/* Pearls System Section - 8-bit Style */}
      <section id="pearls" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl mb-4 text-[#FFB000]">
              SYSTÈME DE PEARLS
            </h2>
            <div className="text-lg text-white mb-2">
              1€ GÉNÉRÉ = 2 PEARLS GAGNÉS
            </div>
            {/* Paragraphe explicatif supprimé selon demande */}
            <p className="text-sm text-[#FFB000] mt-2">
              PLUS TU GAGNES, PLUS TU GAGNES.
            </p>
          </div>

          {/* Conversion Display */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 px-2 sm:px-0">
            <div className="border border-[#B794F4] bg-black/80 p-3 sm:p-4 text-center w-32 sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl text-white font-bold mb-1">100K€</div>
              <div className="text-xs text-gray-400">TU GÉNÈRES</div>
            </div>

            <div className="text-lg sm:text-2xl text-[#FFB000] animate-pulse">
              {'>'}{'>'}{'>'}
            </div>

            <div className="border border-[#FFB000] bg-black/80 p-3 sm:p-4 text-center w-32 sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 flex flex-col items-center justify-center">
              <div className="text-lg sm:text-2xl text-[#FFB000] font-bold mb-1">200K</div>
              <div className="text-xs text-gray-400">PEARLS REÇUS</div>
            </div>
          </div>

          {/* Rewards Grid */}
          <div className="mb-6">
            <div className="text-sm text-[#FFB000] mb-4">RÉCOMPENSES DISPONIBLES:</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Voyage */}
              <div className="border border-[#B794F4] p-4 text-center hover:bg-[#B794F4]/10 transition-all">
                <div className="text-3xl mb-3 text-[#FFB000] font-mono">✈</div>
                <div className="text-xs text-white font-semibold">VOYAGES</div>
              </div>

              {/* Boost */}
              <div className="border border-[#B794F4] p-4 text-center hover:bg-[#B794F4]/10 transition-all">
                <div className="text-3xl mb-3 text-[#FFB000] font-mono">⚡</div>
                <div className="text-xs text-white font-semibold">BOOST COMMISSION</div>
              </div>

              {/* Cosmétique MyOkto */}
              <div className="border border-[#B794F4] p-4 text-center hover:bg-[#B794F4]/10 transition-all">
                <div className="text-3xl mb-3 text-[#FFB000] font-mono">◆</div>
                <div className="text-xs text-white font-semibold">COSMÉTIQUE MYOKTO</div>
              </div>

              {/* Events */}
              <div className="border border-[#B794F4] p-4 text-center hover:bg-[#B794F4]/10 transition-all">
                <div className="text-3xl mb-3 text-[#FFB000] font-mono">★</div>
                <div className="text-xs text-white font-semibold">EVENTS EXCLUSIFS</div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <a
              href="/infopearls"
              className="inline-flex items-center gap-2 text-[#FFB000] hover:text-white transition-colors"
            >
              <span className="text-sm">EN SAVOIR PLUS SUR LES PEARLS</span>
              <span>{'>'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Guildes - Hybrid Terminal/Modern */}
      <section id="guildes" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#FFB000] text-sm">SYSTÈME DE FORMATION</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-mono font-bold text-[#B794F4] mb-4">
              LES GUILDES
            </h2>
            <p className="text-sm font-mono text-white max-w-2xl mx-auto">
              APPRENDRE LE COMMUNITY BUILDING
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Community Academy - Hybrid Style */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="border-2 border-[#B794F4] bg-black/90 overflow-hidden">
                {/* Banner with gradient */}
                <div className="h-28 bg-gradient-to-r from-blue-600 to-blue-500 relative border-b-2 border-[#B794F4]">
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                  }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.GraduationCap size={48} weight="duotone" className="text-white/90" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 border border-white/50 text-xs font-mono text-white">
                      #1 FORMATION
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="text-xl font-mono font-bold text-white mb-1">COMMUNITY ACADEMY</h3>
                  <div className="text-xs font-mono text-[#B794F4] mb-3">&gt;&gt; LA RÉFÉRENCE ABSOLUE</div>

                  <div className="border border-[#B794F4]/30 p-3 mb-3 font-mono">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">STATUT:</span>
                        <span className="text-green-400">[EN LIGNE]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MEMBRES:</span>
                        <span className="text-white">573</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ACTIFS:</span>
                        <span className="text-white">87%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">NOTE:</span>
                        <span className="text-[#FFB000]">4.9/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CRÉÉE:</span>
                        <span className="text-white">08.04.2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-gray-300 mb-4 p-2 border-l-2 border-[#B794F4]/50">
                    La formation la plus complète en community building.
                    Cours structurés et accompagnement personnalisé.
                    Communauté active pour progresser ensemble.
                  </div>

                  <button
                    onClick={() => window.location.href = '/communityacademy-lp'}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-mono font-bold text-sm border-2 border-blue-400 hover:from-blue-700 hover:to-blue-600 transition-all"
                  >
                    &gt; REJOINDRE ACADEMY
                  </button>
                </div>
              </div>
            </motion.div>

            {/* TBCB - Hybrid Style */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="border-2 border-[#FFB000] bg-black/90 overflow-hidden">
                {/* Banner with gradient */}
                <div className="h-28 bg-gradient-to-r from-red-600 to-orange-500 relative border-b-2 border-[#FFB000]">
                  <div className="absolute inset-0 bg-black/30"></div>
                  <div className="absolute inset-0" style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)'
                  }}></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Icons.Fire size={48} weight="duotone" className="text-white/90 animate-pulse" />
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 border border-white/50 text-xs font-mono text-white">
                      #1 RÉSULTATS
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-baseline gap-2 mb-1">
                    <h3 className="text-xl font-mono font-bold text-white">TBCB</h3>
                    <span className="text-xs font-mono text-gray-400">THE BEST COMMUNITY BUILDER</span>
                  </div>
                  <div className="text-xs font-mono text-[#FFB000] mb-3">&gt;&gt; APPROCHE SANS BULLSHIT</div>

                  <div className="border border-[#FFB000]/30 p-3 mb-3 font-mono">
                    <div className="text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-400">STATUT:</span>
                        <span className="text-green-400">[EN LIGNE]</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">MEMBRES:</span>
                        <span className="text-white">234</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">ACTIFS:</span>
                        <span className="text-white">92%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">NOTE:</span>
                        <span className="text-[#FFB000]">4.8/5</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">CRÉÉE:</span>
                        <span className="text-white">13.05.2025</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs font-mono text-gray-300 mb-4 p-2 border-l-2 border-[#FFB000]/50">
                    Focus sur l'action et l'application directe.
                    Moins de théorie, plus de pratique.
                    Pour ceux qui veulent des résultats concrets.
                  </div>

                  <button
                    onClick={() => window.location.href = '/tbcb-lp'}
                    className="w-full py-2.5 bg-gradient-to-r from-red-600 to-orange-500 text-white font-mono font-bold text-sm border-2 border-red-400 hover:from-red-700 hover:to-orange-600 transition-all"
                  >
                    &gt; REJOINDRE TBCB
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Terminal comparison footer - responsive */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {/* Academy Method */}
            <div className="border border-[#B794F4] bg-black/90 p-4">
              <div className="text-center font-mono text-xs">
                <span className="text-blue-400">[MÉTHODE_ACADEMY]</span>
                <p className="text-gray-400 mt-2">
                  APPRENDRE -&gt; PRATIQUER -&gt; MAÎTRISER -&gt; RÉUSSIR
                </p>
              </div>
            </div>
            {/* TBCB Method */}
            <div className="border border-[#FFB000] bg-black/90 p-4">
              <div className="text-center font-mono text-xs">
                <span className="text-red-400">[MÉTHODE_TBCB]</span>
                <p className="text-gray-400 mt-2">
                  ACTION -&gt; RÉSULTATS -&gt; SCALE -&gt; DOMINER
                </p>
              </div>
            </div>
          </div>

          {/* CTA pour en savoir plus */}
          <div className="text-center mt-8">
            <button
              onClick={() => window.location.href = '/infoguilde'}
              className="px-6 py-2.5 border border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all font-mono text-sm"
            >
              EN SAVOIR PLUS SUR LES GUILDES
            </button>
          </div>
        </div>
      </section>

      {/* Competition Section - Terminal Style */}
      <section id="competitions" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-6xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#FFB000] text-sm">COMPÉTITIONS & CLASSEMENTS</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-4 text-[#B794F4]">
              COMPÉTITIONS & CLASSEMENTS
            </h2>
            <p className="text-sm text-gray-400 max-w-2xl mx-auto">
              Compétitions chaque saison avec des prix de folie.
              Prouve ta valeur et remporte des prix exclusifs : voyages, events, et bien plus.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Trophy Animation */}
            <motion.div
              className="relative h-80 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring" }}
            >
              <motion.div
                animate={{
                  y: [0, -20, 0],
                  rotate: [-5, 5, -5]
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="relative"
              >
                <div className="absolute inset-0 blur-3xl opacity-30" style={{ background: 'radial-gradient(circle, #FFB000 0%, transparent 70%)' }}></div>
                <Image
                  src="/images/trophy.png"
                  alt="Trophée Weokto"
                  width={352}
                  height={352}
                  loading="lazy"
                  className="relative z-10 w-48 h-48 sm:w-64 sm:h-64 lg:w-88 lg:h-88 object-contain"
                />
              </motion.div>
            </motion.div>

            {/* Competition Details */}
            <div className="space-y-4">
              <motion.div
                className="border border-[#B794F4] bg-black/80 p-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">TOP 1 - VOYAGE DE LUXE</div>
                    <div className="text-xs text-gray-400">
                      Dubaï all-inclusive + 100K Pearls bonus
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="border border-[#B794F4] bg-black/80 p-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">TOP 2-5 - EVENTS VIP</div>
                    <div className="text-xs text-gray-400">
                      Accès events exclusifs + 50K Pearls
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="border border-[#B794F4] bg-black/80 p-4"
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="font-bold text-white mb-1">TOP 10 - BOOST COMMISSION</div>
                    <div className="text-xs text-gray-400">
                      +5% commission pendant 3 mois
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Leaderboard Preview */}
              <div className="border border-[#FFB000] bg-black/90 p-4 mt-6">
                <div className="text-xs text-[#FFB000] mb-3">{'>'} CLASSEMENT ACTUEL</div>
                <div className="space-y-2 font-mono text-xs">
                  <div className="flex justify-between text-white">
                    <span>[1] TIBO_MRT</span>
                    <span className="text-[#FFB000]">24,185 PEARLS</span>
                  </div>
                  <div className="flex justify-between text-gray-300">
                    <span>[2] SPIDER_CB</span>
                    <span className="text-[#FFB000]">18,942 PEARLS</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>[3] ALEX_PRO</span>
                    <span className="text-[#FFB000]">15,327 PEARLS</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>[4] MARIE_BOOST</span>
                    <span className="text-[#FFB000]">12,891 PEARLS</span>
                  </div>
                  <div className="text-center mt-3 text-[#FFB000] animate-pulse">
                    {'>'} TON RANG: [--] START NOW
                  </div>
                </div>
              </div>

              <div className="text-center mt-6">
                <a
                  href="/infocompetition"
                  className="inline-flex items-center gap-2 px-4 py-2 border border-[#FFB000] text-[#FFB000] hover:bg-[#FFB000] hover:text-black transition-all text-sm"
                >
                  VOIR TOUTES LES COMPÉTITIONS
                  <span>{'>'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Zero Barrier Section - Terminal Style */}
      <section id="tarifs" className="py-12 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4">
              <span className="text-[#FFB000] text-sm animate-pulse">100% GRATUIT POUR SE LANCER</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-mono font-bold mb-6 text-[#B794F4]">
              ZÉRO BARRIÈRE À L'ENTRÉE.
              <br />
              COMMENCE MAINTENANT.
            </h2>
            <p className="text-sm font-mono text-white max-w-3xl mx-auto">
              LE MONDE DU BUSINESS EN LIGNE A TOUJOURS IMPOSÉ DES FRAIS D'ENTRÉE.
              <br />
              WEOKTO RÉVOLUTIONNE CE MODÈLE: DÉMARRE SANS INVESTISSEMENT.
            </p>
          </div>

          {/* Main Terminal Box */}
          <div className="border-2 border-[#FFB000] bg-black/90 max-w-2xl mx-auto">
            {/* Terminal Header */}
            <div className="border-b-2 border-[#FFB000] p-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF5F56]" />
                <div className="w-3 h-3 bg-[#FFBD2E]" />
                <div className="w-3 h-3 bg-[#27C93F]" />
              </div>
              <div className="text-xs text-[#FFB000]">PRICING</div>
            </div>

            {/* Terminal Content */}
            <div className="p-6 sm:p-8">
              {/* Prix */}
              <div className="text-center mb-8">
                <div className="text-5xl sm:text-6xl font-mono font-bold text-[#FFB000] mb-3">€0</div>
                <div className="text-base sm:text-lg font-mono text-white mb-6">DÉMARRAGE GRATUIT</div>
              </div>

              {/* Features - Liste simple */}
              <div className="max-w-md mx-auto mb-8 space-y-2">
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-[#FFB000]">[✓]</span>
                  <span>500 PEARLS DE BIENVENUE</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-[#FFB000]">[✓]</span>
                  <span>ACCÈS AUX GUILDES</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-[#FFB000]">[✓]</span>
                  <span>FOURNISSEURS & PRODUITS</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-[#FFB000]">[✓]</span>
                  <span>OUTILS IA OFFERTS</span>
                </div>
                <div className="flex items-center gap-2 text-white font-mono text-sm">
                  <span className="text-[#FFB000]">[✓]</span>
                  <span>COMPÉTITIONS & PRIX</span>
                </div>
              </div>

              {/* CTA */}
              <div className="text-center mb-6">
                <button
                  onClick={handleStartClick}
                  className="px-8 py-3 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all font-mono font-bold tracking-wider text-sm sm:text-base"
                >
                  DÉMARRER MAINTENANT
                </button>
              </div>

              {/* Frais - Version concise */}
              <div className="border-t border-[#B794F4]/30 pt-4">
                <div className="text-center text-xs font-mono text-gray-400 mb-2">
                  COMMISSION: 6% • PAYOUT: 4%
                </div>
                <button
                  onClick={() => setShowFees(!showFees)}
                  className="mx-auto block text-xs font-mono text-[#FFB000] hover:text-white transition-colors"
                >
                  {showFees ? '[-] MASQUER LES DÉTAILS' : '[+] VOIR LES DÉTAILS'}
                </button>

                {showFees && (
                  <div className="mt-4 pt-4 border-t border-[#B794F4]/20 space-y-2 text-xs font-mono">
                    <div className="flex justify-between text-gray-300">
                      <span>Commission Weokto</span>
                      <span className="text-white">6%</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Frais paiement</span>
                      <span className="text-white">1.8-3.9% + 0.30€</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Frais payout</span>
                      <span className="text-white">4%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection />

      {/* Final CTA */}
      <section className="py-12 sm:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-3 sm:px-4 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-mono font-bold mb-4 sm:mb-6 text-[#B794F4]">
            PRÊT À CONSTRUIRE TON EMPIRE ?
          </h2>

          <p className="text-base font-mono text-white max-w-3xl mx-auto mb-8">
            REJOINS DES MILLIERS DE CRÉATEURS QUI GÉNÈRENT
            <br />
            DES REVENUS PASSIFS CHAQUE MOIS.
          </p>

          <div className="mb-8">
            <button
              onClick={handleStartClick}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-sm sm:text-lg font-mono font-bold tracking-wider"
            >
              DÉMARRER MON BUSINESS GRATUIT
            </button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <FooterLandingPage showSupplierCTA={true} onOpenPartnerForm={() => setShowPartnerForm(true)} />

      {/* Partner Form Modal */}
      <PartnerFormModal
        isOpen={showPartnerForm}
        onClose={() => setShowPartnerForm(false)}
      />

      {/* Terminal Auth Modal */}
      <TerminalAuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        sendMagicLink={sendMagicLink}
        loadingAction={loadingAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

    </div>
  )
}
