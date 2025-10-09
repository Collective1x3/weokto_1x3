'use client'

import { useAuth } from '@/contexts/AuthContext'
import Header from './Header'
import AuthModal from './AuthModal'

interface HeaderWithAuthProps {
  currentPage?: 'home' | 'guilde' | 'competitions' | 'pearls' | 'outils' | 'revenus' | 'fournisseurs' | 'infofournisseurs'
  accentColor?: 'violet' | 'blue' | 'red'
}

export default function HeaderWithAuth({ currentPage = 'home', accentColor = 'violet' }: HeaderWithAuthProps) {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    email,
    setEmail,
    loadingAction,
    successMessage,
    errorMessage,
    handleAuth,
    sendMagicLink
  } = useAuth()

  return (
    <>
      <Header currentPage={currentPage} onAuthClick={handleAuth} accentColor={accentColor} />
      <AuthModal
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