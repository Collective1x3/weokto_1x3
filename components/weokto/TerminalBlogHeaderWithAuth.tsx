'use client'

import { useAuth } from '@/contexts/AuthContext'
import BlogHeader from './BlogHeader'
import TerminalAuthModal from './TerminalAuthModal'

export default function TerminalBlogHeaderWithAuth() {
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
      <BlogHeader onAuthClick={handleAuth} />
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