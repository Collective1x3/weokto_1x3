'use client'

import { useAuth } from '@/contexts/AuthContext'
import Header from './Header'
import TerminalAuthModal from './TerminalAuthModal'

interface TerminalHeaderWithAuthProps {
  currentPage?: 'home' | 'guilde' | 'competitions' | 'pearls' | 'outils' | 'revenus' | 'fournisseurs' | 'infofournisseurs'
  accentColor?: 'violet' | 'blue' | 'red'
}

export default function TerminalHeaderWithAuth({ currentPage = 'home', accentColor = 'violet' }: TerminalHeaderWithAuthProps) {
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

  const handleAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode)
    setShowAuthModal(true)
  }

  return (
    <>
      <Header currentPage={currentPage} onAuthClick={handleAuth} accentColor={accentColor} />
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
    </>
  )
}