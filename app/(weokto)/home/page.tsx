'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

function HomePageContent() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [unlinking, setUnlinking] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for status messages in URL
    const error = searchParams.get('error')
    const success = searchParams.get('success')
    const info = searchParams.get('info')
    
    if (error) {
      const messages: Record<string, string> = {
        'auth_denied': 'Autorisation Whop refusée',
        'whop_already_linked': 'Ce compte Whop est déjà lié à un autre utilisateur',
        'exchange_failed': 'Échec de la connexion avec Whop',
        'server_error': 'Erreur serveur lors de la liaison',
        'invalid_user_type': 'Type d\'utilisateur invalide pour cette action'
      }
      setMessage({ type: 'error', text: messages[error] || 'Une erreur est survenue' })
    } else if (success === 'whop_linked') {
      setMessage({ type: 'success', text: 'Compte Whop connecté avec succès!' })
    } else if (info === 'already_linked') {
      setMessage({ type: 'info', text: 'Votre compte Whop est déjà connecté' })
    }
    
    // Fetch real user data from auth endpoint
    fetchUser()
  }, [searchParams])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        // Not authenticated, redirect to login
        router.push('/')
      }
    } catch (error) {
      console.error('Error fetching user:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleConnectWhop = () => {
    // Redirect to Whop OAuth for account linking
    // This allows AFFILIATE users to track their sales
    window.location.href = '/api/auth/whop/link'
  }
  
  const handleDisconnectWhop = async () => {
    if (!confirm('Êtes-vous sûr de vouloir déconnecter votre compte Whop?')) {
      return
    }
    
    setUnlinking(true)
    try {
      const response = await fetch('/api/auth/whop/unlink', { method: 'POST' })
      if (response.ok) {
        setMessage({ type: 'success', text: 'Compte Whop déconnecté' })
        // Refresh user data
        await fetchUser()
      } else {
        setMessage({ type: 'error', text: 'Erreur lors de la déconnexion' })
      }
    } catch (error) {
      console.error('Unlink error:', error)
      setMessage({ type: 'error', text: 'Erreur lors de la déconnexion' })
    } finally {
      setUnlinking(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
          
          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.type === 'error' ? 'bg-red-50 text-red-700' :
              message.type === 'success' ? 'bg-green-50 text-green-700' :
              'bg-blue-50 text-blue-700'
            }`}>
              {message.text}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold mb-2">Informations du profil</h2>
              <div className="text-gray-600 space-y-1">
                <p>Email: {loading ? 'Chargement...' : user?.email}</p>
                <p>Nom: {loading ? 'Chargement...' : (user?.displayName || 'Non défini')}</p>
                <p>IP de connexion: {loading ? 'Chargement...' : user?.sessionIp}</p>
                <p>Dernière connexion: {loading ? 'Chargement...' : (
                  user?.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('fr-FR') : 'Première connexion'
                )}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-2">Connexion Whop</h2>
              {user?.whopUserId ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-green-500 rounded-full"></span>
                    <span className="text-green-600">Connecté</span>
                    <span className="text-gray-500 text-sm">(ID: {user.whopUserId})</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Votre compte Whop est lié. Vous pouvez maintenant tracker vos ventes et commissions.
                  </p>
                  <button
                    onClick={handleDisconnectWhop}
                    disabled={unlinking}
                    className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                  >
                    {unlinking ? 'Déconnexion...' : 'Déconnecter le compte Whop'}
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-full"></span>
                    <span className="text-yellow-600">Non connecté</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Connectez votre compte Whop pour tracker vos ventes d'affiliation.
                  </p>
                  <button
                    onClick={handleConnectWhop}
                    className="bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Connecter mon compte Whop
                  </button>
                </div>
              )}
            </div>

            <div className="pt-4 border-t">
              <button
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700"
              >
                Se déconnecter
              </button>
            </div>

            <div className="pt-4">
              <a
                href="/supplier"
                className="inline-block bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Accéder à l'espace Supplier
              </a>
            </div>
            <div className="pt-4">
              <a
                href="/testcheckout"
                className="inline-block bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Accéder au Test Checkout
              </a>
            </div>
            <div className="pt-4">
              <a
                href="/webhooks-test"
                className="inline-block bg-primary-600 text-black px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Accéder au Test Webhooks
              </a>
            </div>
          </div>
        </div>

        {/* TODO: Phase 2 - Add more dashboard features for affiliates */}
        {/* Current focus: AFFILIATE authentication only */}
        {/* CLIENT (buyer) authentication deferred to Phase 2 */}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
        <div className="text-white">Chargement...</div>
      </div>
    }>
      <HomePageContent />
    </Suspense>
  )
}