'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function FooterCool() {
  const [konami, setKonami] = useState<string[]>([])
  const [showSecret, setShowSecret] = useState(false)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [matrixRain, setMatrixRain] = useState(false)
  const [terminalInput, setTerminalInput] = useState('')
  const [terminalOutput, setTerminalOutput] = useState<string[]>(['SYSTEM READY...'])

  // Konami Code Easter Egg
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      const newKonami = [...konami, e.key].slice(-10)
      setKonami(newKonami)

      if (JSON.stringify(newKonami) === JSON.stringify(konamiCode)) {
        setShowSecret(true)
        setMatrixRain(true)
        setTimeout(() => setMatrixRain(false), 5000)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [konami])

  // Matrix Rain Effect
  useEffect(() => {
    if (!matrixRain || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = 200

    const chars = 'WEOKTO01アイウエオカキクケコ$€¥£'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = []

    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#FFB000'
      ctx.font = fontSize + 'px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    return () => clearInterval(interval)
  }, [matrixRain])

  // ASCII Art Animation
  const asciiFrames = [
    `╔══╗
║WE║
╚══╝`,
    `╔═══╗
║WEO║
╚═══╝`,
    `╔════╗
║WEOK║
╚════╝`,
    `╔═════╗
║WEOKT║
╚═════╝`,
    `╔══════╗
║WEOKTO║
╚══════╝`
  ]

  const [asciiFrame, setAsciiFrame] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAsciiFrame(prev => (prev + 1) % asciiFrames.length)
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const footerLinks = [
    { name: 'GUILDES', href: '/guilde', color: '#B794F4' },
    { name: 'PEARLS', href: '/oldpearls', color: '#FFB000' },
    { name: 'OUTILS_IA', href: '/outils', color: '#FF6B6B' },
    { name: 'BLOG', href: '/blog', color: '#4ECDC4' },
  ]

  const socialLinks = [
    { name: '[X]', href: 'https://twitter.com/weokto' },
    { name: '[IG]', href: 'https://instagram.com/weokto' },
    { name: '[TK]', href: 'https://tiktok.com/@weokto' },
  ]

  const handleTerminalCommand = (cmd: string) => {
    const lowerCmd = cmd.toLowerCase().trim()
    let output = ''

    switch(lowerCmd) {
      case 'help':
        output = 'COMMANDS: about | pearls | guilds | contact | matrix | glitch | clear'
        break
      case 'about':
        output = 'WEOKTO - LA PLATEFORME DU COMMUNITY BUILDING'
        break
      case 'pearls':
        output = 'SYSTÈME DE RÉCOMPENSES: 1€ = 2 PEARLS'
        break
      case 'guilds':
        output = 'GUILDES DISPONIBLES: COPYWRITERS | CRÉATEURS DE CONTENU'
        break
      case 'contact':
        output = 'CONTACT: hello@weokto.com'
        break
      case 'matrix':
        setMatrixRain(true)
        setTimeout(() => setMatrixRain(false), 5000)
        output = 'MATRIX MODE ACTIVATED...'
        break
      case 'glitch':
        document.body.style.animation = 'glitch 0.5s'
        setTimeout(() => {
          document.body.style.animation = ''
        }, 500)
        output = 'GLITCH EFFECT APPLIED'
        break
      case 'clear':
        setTerminalOutput(['SYSTEM READY...'])
        return
      default:
        output = `COMMAND NOT FOUND: ${cmd}`
    }

    setTerminalOutput(prev => [...prev, `> ${cmd}`, output].slice(-5))
  }

  return (
    <footer className="relative mt-20 overflow-hidden bg-black border-t-4 border-[#B794F4]">
      {/* Matrix Rain Canvas */}
      {matrixRain && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none"
          style={{ opacity: 0.3 }}
        />
      )}

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Interactive Header */}
        <div className="text-center mb-8">
          <motion.div
            animate={{
              rotateY: [0, 360],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="inline-block mb-4"
          >
            <pre className="text-[#FFB000] text-xs font-mono">
              {asciiFrames[asciiFrame]}
            </pre>
          </motion.div>

          {/* Secret Message */}
          <AnimatePresence>
            {showSecret && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                className="mb-4"
              >
                <p className="text-2xl font-mono text-[#FFB000] animate-pulse">
                  [KONAMI CODE ACTIVATED]
                </p>
                <p className="text-sm font-mono text-[#B794F4]">
                  SECRET MODE UNLOCKED - +1000 PEARLS
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Cool Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {footerLinks.map((link) => (
            <motion.a
              key={link.name}
              href={link.href}
              onMouseEnter={() => setHoveredLink(link.name)}
              onMouseLeave={() => setHoveredLink(null)}
              whileHover={{ scale: 1.05 }}
              className="relative p-6 border-2 text-center font-mono transition-all overflow-hidden group"
              style={{
                borderColor: hoveredLink === link.name ? link.color : '#333',
                backgroundColor: hoveredLink === link.name ? `${link.color}10` : 'transparent'
              }}
            >
              <motion.div
                className="absolute inset-0"
                initial={{ x: '-100%' }}
                animate={{ x: hoveredLink === link.name ? '0%' : '-100%' }}
                style={{ backgroundColor: `${link.color}20` }}
              />
              <span className="relative text-sm font-bold" style={{ color: link.color }}>
                [{link.name}]
              </span>
              {hoveredLink === link.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute top-0 right-0 text-xs p-1"
                  style={{ color: link.color }}
                >
                  {'>>'}
                </motion.div>
              )}
            </motion.a>
          ))}
        </div>

        {/* Command Line Interface */}
        <div className="bg-black border-2 border-[#B794F4] p-4 mb-8 font-mono text-sm">
          <div className="mb-2 max-h-32 overflow-y-auto">
            {terminalOutput.map((line, i) => (
              <div key={i} className="text-[#FFB000] text-xs">
                {line}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[#FFB000]">weokto@terminal</span>
            <span className="text-[#B794F4]">~</span>
            <span className="text-white">$</span>
            <input
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder="type 'help' for commands..."
              className="flex-1 bg-transparent outline-none text-white text-xs"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleTerminalCommand(terminalInput)
                  setTerminalInput('')
                }
              }}
            />
            <span className="text-[#B794F4] animate-pulse">_</span>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            {'>'} TRY THE KONAMI CODE: ↑↑↓↓←→←→BA
          </div>
        </div>

        {/* Social Links with Hover Effects */}
        <div className="flex justify-center gap-4 mb-8">
          {socialLinks.map((social) => (
            <motion.a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{
                scale: 1.1,
                y: -5,
              }}
              className="px-4 py-2 border-2 border-[#B794F4] text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all font-mono text-xs"
            >
              {social.name}
            </motion.a>
          ))}
        </div>

        {/* Animated Bottom Message */}
        <div className="text-center">
          <motion.div
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-xs font-mono text-[#B794F4] mb-2"
          >
            BUILD. SELL. DOMINATE. REPEAT.
          </motion.div>

          <div className="text-xs font-mono text-gray-600 space-y-1">
            <p>© {new Date().getFullYear()} WEOKTO CORPORATION</p>
            <motion.p
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-[#FFB000]"
            >
              THIS FOOTER IS COOLER THAN YOUR PORTFOLIO
            </motion.p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes glitch {
          0% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </footer>
  )
}