
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, EnvelopeSimple, Sparkle, ArrowRight, Check, Key, ShieldCheck } from '@phosphor-icons/react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

interface AuthModalProps {
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

export default function AuthModal({
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
}: AuthModalProps) {
  const [otpMode, setOtpMode] = useState(false)
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', ''])
  const [verifying, setVerifying] = useState(false)
  const [otpError, setOtpError] = useState<string>('')
  const [otpInfo, setOtpInfo] = useState<string>('')
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [linkSent, setLinkSent] = useState(false)

  // Local storage keys to persist modal state across navigation refresh
  const LS_KEYS = {
    open: 'auth.modal.open',
    email: 'auth.email',
    linkSent: 'auth.linkSent',
    otpMode: 'auth.otpMode',
  }

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
      // Also allow URL flag ?auth=1 to auto-open (fallback when storage blocked or cleared)
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

  // Persist whenever parent toggles the modal
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
    try {
      localStorage.setItem(LS_KEYS.open, open ? '1' : '0')
    } catch {}
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

  useEffect(() => {
    // focus the first OTP box when switching to OTP mode
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
    // focus last filled
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
        setOtpInfo('Connexion réussie, redirection...')
        // Cookie de session posé par l'API, on peut rediriger
        const to = data?.redirectTo || '/'
        setTimeout(() => {
          window.location.assign(to)
        }, 600)
      }
    } catch (err) {
      setOtpError('Erreur réseau')
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
          }}
          onClick={() => {
            if (!linkSent) {
              setShowAuthModal(false)
              persistOpenState(false)
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md overflow-hidden"
            style={{
              backgroundColor: '#121214',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              borderRadius: '20px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.3), 0 0 50px rgba(139, 92, 246, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Subtle violet gradient overlay */}
            <div 
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at 30% 0%, rgba(139, 92, 246, 0.2) 0%, transparent 50%)'
              }}
            />
            
            {/* Close Button */}
            <button
              onClick={() => {
                setShowAuthModal(false)
                setLinkSent(false)
                clearPersisted()
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg transition-all"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'}
            >
              <X size={20} className="text-gray-400" />
            </button>

            {/* Content */}
            <div className="relative p-8">
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-8">
                <Image
                  src="/weoktologosvg/logo-weokto-noir-violet-orange-ouvert.svg"
                  alt="Weokto"
                  width={56}
                  height={56}
                  className="w-14 h-auto"
                />
                <span className="text-xl font-bold text-white" style={{ fontFamily: '"Manrope", sans-serif' }}>
                  Weokto
                </span>
              </div>

              {/* Title */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: '"Manrope", sans-serif' }}>
                  {authMode === 'login' ? 'Bon retour sur Weokto' : 'Bienvenue sur Weokto'}
                </h2>
                <p className="text-gray-400 text-sm">
                  {authMode === 'login' 
                    ? 'Connecte-toi pour accéder à ton compte'
                    : 'Crée ton compte et commence à gagner'}
                </p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <EnvelopeSimple 
                      size={20} 
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value)
                        persistEmail(e.target.value)
                      }}
                      placeholder="ton@email.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-white placeholder:text-gray-500 transition-all"
                      style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'
                        e.target.style.borderColor = 'rgba(139, 92, 246, 0.5)'
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)'
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                        e.target.style.boxShadow = 'none'
                      }}
                    />
                  </div>
                </div>

                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl flex items-center gap-2"
                    style={{
                      backgroundColor: 'rgba(34, 197, 94, 0.1)',
                      border: '1px solid rgba(34, 197, 94, 0.3)'
                    }}
                  >
                    <Check size={16} weight="bold" className="text-green-400" />
                    <p className="text-sm text-green-400">{successMessage}</p>
                  </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 rounded-xl"
                    style={{
                      backgroundColor: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)'
                    }}
                  >
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  onClick={async () => {
                    // mark as sent immediately to reveal OTP option and persist across refresh
                    setLinkSent(true)
                    persistLinkSent(true)
                    persistOpenState(true)
                    persistEmail(email)
                    await Promise.resolve(sendMagicLink(authMode))
                  }}
                  disabled={loadingAction !== null || !email}
                  className="relative w-full group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-violet-600 to-violet-400 rounded-xl blur opacity-60 group-hover:opacity-100 transition duration-200 disabled:opacity-30"></div>
                  <span className="relative flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-violet-600 to-violet-500 rounded-xl text-white font-semibold shadow-lg transition-all">
                    {loadingAction ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Sparkle size={20} weight="duotone" />
                        Recevoir le lien magique
                        <ArrowRight size={16} weight="bold" className="group-hover:translate-x-0.5 transition-transform" />
                      </>
                    )}
                  </span>
                </button>

                {/* OTP alternative (only after link sent) */}
                {linkSent && (
                  <div className="mt-2">
                    <button
                      onClick={() => {
                        setOtpMode((v) => {
                          persistOtpMode(!v)
                          return !v
                        })
                      }}
                      className="w-full py-2 text-sm text-violet-400 hover:text-violet-300 flex items-center justify-center gap-2"
                    >
                      <Key size={18} />
                      {otpMode ? 'Masquer le code à 6 chiffres' : 'Entrer le code à 6 chiffres'}
                    </button>
                  </div>
                )}

                {otpMode && (
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Code de vérification
                    </label>
                    <div className="flex items-center justify-between gap-2 sm:gap-3">
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
                          className="w-10 h-12 sm:w-12 sm:h-14 text-center rounded-xl text-white text-lg sm:text-2xl"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>
                    {otpError && (
                      <p className="mt-2 text-sm text-red-400">{otpError}</p>
                    )}
                    {otpInfo && (
                      <p className="mt-2 text-sm text-green-400 flex items-center gap-2">
                        <ShieldCheck size={16} /> {otpInfo}
                      </p>
                    )}
                    <button
                      onClick={verifyOtp}
                      disabled={verifying || !email}
                      className="mt-3 w-full py-3 rounded-xl text-white font-semibold disabled:opacity-50"
                      style={{ background: 'linear-gradient(90deg, #7c3aed, #8b5cf6)' }}
                    >
                      {verifying ? 'Vérification...' : 'Valider le code'}
                    </button>
                  </div>
                )}

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span 
                      className="px-4 text-gray-500"
                      style={{ backgroundColor: '#121214' }}
                    >
                      {authMode === 'login' ? 'Nouveau chez Weokto ?' : 'Déjà membre ?'}
                    </span>
                  </div>
                </div>

                {/* Switch Mode */}
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
                  className="w-full py-3 text-violet-400 hover:text-violet-300 font-medium transition-colors text-sm"
                >
                  {authMode === 'login' 
                    ? "Créer un compte gratuitement" 
                    : 'Se connecter à mon compte'}
                </button>
              </div>

              {/* Footer Text */}
              <p className="text-xs text-gray-500 text-center mt-6">
                En continuant, tu acceptes nos conditions d'utilisation et notre politique de confidentialité
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
