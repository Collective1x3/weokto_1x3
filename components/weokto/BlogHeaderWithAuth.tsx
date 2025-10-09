'use client'

import { useAuth } from '@/contexts/AuthContext'
import BlogHeader from './BlogHeader'
import AuthModal from './AuthModal'

export default function BlogHeaderWithAuth() {
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
      <BlogHeader onAuthClick={handleAuth} />
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


