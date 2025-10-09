'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

interface TerminalAuthModalProps {
  showAuthModal: boolean
  setShowAuthModal: (show: boolean) => void
  authMode: 'login' | 'signup'
  setAuthMode: (mode: 'login' | 'signup') => void
  email: string
  setEmail: (email: string) => void
  sendMagicLink: (mode: 'login' | 'signup') => void
  loadingAction: null | 'login' | 'signup'
  successMessage: string
  errorMessage: string
}

export default function TerminalAuthModal({
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
}: TerminalAuthModalProps) {
  const [otpMode, setOtpMode] = useState(false)
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [otpError, setOtpError] = useState<string>('')
  const [otpInfo, setOtpInfo] = useState<string>('')
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [linkSent, setLinkSent] = useState(false)
  const [typingEffect, setTypingEffect] = useState('')
  const [cursorBlink, setCursorBlink] = useState(true)

  // Local storage keys to persist modal state
  const LS_KEYS = {
    open: 'auth.modal.open',
    email: 'auth.email',
    linkSent: 'auth.linkSent',
    otpMode: 'auth.otpMode',
  }

  // Cursor blink effect
  useEffect(() => {
    const timer = setInterval(() => setCursorBlink(b => !b), 500)
    return () => clearInterval(timer)
  }, [])

  // Typing effect for title
  useEffect(() => {
    if (showAuthModal) {
      const text = authMode === 'login' ? 'Connexion' : 'Inscription'
      let i = 0
      setTypingEffect('')
      const interval = setInterval(() => {
        if (i <= text.length) {
          setTypingEffect(text.slice(0, i))
          i++
        } else {
          clearInterval(interval)
        }
      }, 50)
      return () => clearInterval(interval)
    }
  }, [authMode, showAuthModal])

  // Persistence logic
  useEffect(() => {
    try {
      const persistedOpen = typeof window !== 'undefined' ? localStorage.getItem(LS_KEYS.open) : null
      const persistedEmail = typeof window !== 'undefined' ? localStorage.getItem(LS_KEYS.email) : null
      const persistedLinkSent = typeof window !== 'undefined' ? localStorage.getItem(LS_KEYS.linkSent) : null
      const persistedOtpMode = typeof window !== 'undefined' ? localStorage.getItem(LS_KEYS.otpMode) : null

      if (persistedOpen === '1') setShowAuthModal(true)
      if (persistedEmail) setEmail(persistedEmail)
      if (persistedLinkSent === '1') setLinkSent(true)
      if (persistedOtpMode === '1') setOtpMode(true)

      // URL flag ?auth=1 to auto-open
      if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search)
        if (params.get('auth') === '1') {
          setShowAuthModal(true)
          persistOpenState(true)
        }
      }
    } catch {}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    persistOpenState(showAuthModal)
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href)
      if (showAuthModal) {
        url.searchParams.set('auth', '1')
      } else {
        url.searchParams.delete('auth')
      }
      window.history.replaceState({}, '', url.toString())
    }
  }, [showAuthModal])

  const persistOpenState = (open: boolean) => {
    try { localStorage.setItem(LS_KEYS.open, open ? '1' : '0') } catch {}
  }

  const persistLinkSent = (sent: boolean) => {
    try { localStorage.setItem(LS_KEYS.linkSent, sent ? '1' : '0') } catch {}
  }

  const persistOtpMode = (enabled: boolean) => {
    try { localStorage.setItem(LS_KEYS.otpMode, enabled ? '1' : '0') } catch {}
  }

  const persistEmail = (value: string) => {
    try { localStorage.setItem(LS_KEYS.email, value) } catch {}
  }

  const clearPersisted = () => {
    try {
      localStorage.removeItem(LS_KEYS.open)
      localStorage.removeItem(LS_KEYS.email)
      localStorage.removeItem(LS_KEYS.linkSent)
      localStorage.removeItem(LS_KEYS.otpMode)
    } catch {}
  }

  // OTP handling
  useEffect(() => {
    if (otpMode && inputsRef.current[0]) {
      inputsRef.current[0]?.focus()
    }
  }, [otpMode])

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return
    const next = [...otpValues]
    next[index] = value
    setOtpValues(next)
    setOtpError('')
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowUp') && index > 0) {
      e.preventDefault()
      inputsRef.current[index - 1]?.focus()
    }
    if ((e.key === 'ArrowRight' || e.key === 'ArrowDown') && index < 5) {
      e.preventDefault()
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (paste.length === 0) return
    e.preventDefault()
    const next = paste.split('')
    while (next.length < 6) next.push('')
    setOtpValues(next)
    const lastIndex = Math.max(0, Math.min(5, paste.length - 1))
    inputsRef.current[lastIndex]?.focus()
  }

  const verifyOtp = async () => {
    if (!email) {
      setOtpError('Email requis')
      return
    }
    const code = otpValues.join('')
    if (code.length !== 6) {
      setOtpError('Code à 6 chiffres requis')
      return
    }
    setVerifying(true)
    setOtpError('')
    setOtpInfo('')
    try {
      const res = await fetch('/api/auth/magic-link/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code })
      })
      const data = await res.json()
      if (!res.ok) {
        setOtpError(data?.error || 'Code invalide')
      } else {
        setOtpInfo('Connexion réussie ✓')
        const to = data?.redirectTo || '/'
        setTimeout(() => {
          window.location.assign(to)
        }, 600)
      }
    } catch (err) {
      setOtpError('Erreur de connexion')
    } finally {
      setVerifying(false)
    }
  }

  return (
    <AnimatePresence>
      {showAuthModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
          onClick={() => {
            if (!linkSent) {
              setShowAuthModal(false)
              persistOpenState(false)
            }
          }}
        >
          {/* Scanlines effect */}
          <div className="fixed inset-0 pointer-events-none opacity-50">
            <div className="absolute inset-0" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
              animation: 'scanlines 8s linear infinite'
            }} />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md border-2 border-[#B794F4] bg-black/90 backdrop-blur-sm shadow-2xl shadow-[#B794F4]/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Terminal header */}
            <div className="border-b border-[#B794F4] bg-[#B794F4]/10 px-4 py-2 relative flex items-center">
              <div className="flex items-center gap-2 absolute left-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <span className="text-sm text-[#B794F4] font-mono font-bold w-full text-center">
                WEOKTO
              </span>
              <button
                onClick={() => {
                  setShowAuthModal(false)
                  setLinkSent(false)
                  clearPersisted()
                }}
                className="text-[#B794F4] hover:text-white transition-colors text-lg font-mono absolute right-4"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 font-mono">
              {/* Logo */}
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                  alt="Weokto"
                  width={56}
                  height={56}
                  className="w-14 h-14"
                />
              </div>

              {/* Title */}
              <div className="mb-6 text-center">
                <h2 className="text-[#FFB000] text-xl font-bold">
                  {typingEffect}
                  <span className={`inline-block w-2 h-5 bg-[#FFB000] ml-1 ${cursorBlink ? 'opacity-100' : 'opacity-0'}`} />
                </h2>
                {authMode === 'signup' && (
                  <p className="text-[#B794F4]/60 text-sm mt-2">
                    Crée ton compte et commence à gagner
                  </p>
                )}
              </div>

              {/* Form */}
              <div className="space-y-4">
                {/* Email input */}
                <div>
                  <label className="block text-xs text-[#B794F4] mb-2">
                    Adresse email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      persistEmail(e.target.value)
                    }}
                    placeholder="user@domain.com"
                    className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white placeholder:text-[#B794F4]/30 focus:border-[#FFB000] focus:outline-none font-mono text-sm"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && email && !loadingAction) {
                        setLinkSent(true)
                        persistLinkSent(true)
                        sendMagicLink(authMode)
                      }
                    }}
                  />
                </div>

                {/* Success message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 border border-green-500/30 bg-green-500/10"
                  >
                    <p className="text-xs text-green-400 font-mono">
                      ✓ {successMessage}
                    </p>
                  </motion.div>
                )}

                {/* Error message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-2 border border-red-500/30 bg-red-500/10"
                  >
                    <p className="text-xs text-red-400 font-mono">
                      ✗ {errorMessage}
                    </p>
                  </motion.div>
                )}

                {/* Submit button */}
                <button
                  onClick={async () => {
                    setLinkSent(true)
                    persistLinkSent(true)
                    persistOpenState(true)
                    persistEmail(email)
                    await Promise.resolve(sendMagicLink(authMode))
                  }}
                  disabled={loadingAction !== null || !email}
                  className="w-full relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute inset-0 bg-[#FFB000] blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative px-4 py-3 bg-[#FFB000] hover:bg-[#FFB000]/90 text-black font-bold text-sm transition-all border border-[#FFB000]">
                    {loadingAction ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="inline-block w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                        {'Envoi en cours...'}
                      </span>
                    ) : (
                      <span>
                        {'Recevoir le lien magique'}
                      </span>
                    )}
                  </div>
                </button>

                {/* OTP Mode Toggle */}
                {linkSent && (
                  <div className="border-t border-[#B794F4]/20 pt-3">
                    <button
                      onClick={() => {
                        setOtpMode((v) => {
                          persistOtpMode(!v)
                          return !v
                        })
                      }}
                      className="w-full py-2 text-xs text-[#B794F4] hover:text-[#FFB000] transition-colors"
                    >
                      {otpMode ? 'Masquer le code' : 'Entrer le code à 6 chiffres'}
                    </button>
                  </div>
                )}

                {/* OTP Input */}
                {otpMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <label className="block text-xs text-[#B794F4]">
                      Code de vérification
                    </label>
                    <div className="flex items-center justify-between gap-2">
                      {otpValues.map((v, i) => (
                        <input
                          key={i}
                          ref={(el) => { inputsRef.current[i] = el }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={v}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className="w-10 h-12 text-center bg-black border border-[#B794F4]/30 text-[#FFB000] text-lg font-mono focus:border-[#FFB000] focus:outline-none"
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-red-400 font-mono">{otpError}</p>
                    )}

                    {otpInfo && (
                      <p className="text-xs text-green-400 font-mono">{otpInfo}</p>
                    )}

                    <button
                      onClick={verifyOtp}
                      disabled={verifying || !email}
                      className="w-full py-2 bg-[#B794F4] hover:bg-[#B794F4]/90 text-black font-bold text-xs transition-all disabled:opacity-50"
                    >
                      {verifying ? 'Vérification...' : 'Valider le code'}
                    </button>
                  </motion.div>
                )}

                {/* Mode switch */}
                <div className="border-t border-[#B794F4]/20 pt-4">
                  <button
                    onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                    className="w-full py-2 text-xs text-[#B794F4] hover:text-[#FFB000] transition-colors"
                  >
                    {authMode === 'login'
                      ? 'ou Créer un compte'
                      : 'ou J\'ai déjà un compte'}
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-6 pt-4 border-t border-[#B794F4]/20">
                <p className="text-[10px] text-[#B794F4]/40 text-center">
                  En continuant, tu acceptes nos conditions d'utilisation
                </p>
              </div>
            </div>
          </motion.div>

          <style jsx>{`
            @keyframes scanlines {
              0% { background-position: 0 0; }
              100% { background-position: 0 10px; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  )
}