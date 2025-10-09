'use client'

import { useEffect, useRef, useState } from 'react'
import { CreditCard, Lock, CheckCircle, X, Warning } from 'phosphor-react'

interface PCIVaultIframeProps {
  iframeUrl: string
  sessionId: string
  onSuccess: (paymentMethodId: string) => void
  onError: (error: string) => void
  onCancel?: () => void
}

type MessageStatus = 'ready' | 'capture_started' | 'capture_completed' | 'capture_failed' | 'cancelled'

interface PCIVaultMessage {
  type: MessageStatus
  payload?: {
    paymentMethodId?: string
    error?: string
    message?: string
  }
}

export default function PCIVaultIframe({
  iframeUrl,
  sessionId,
  onSuccess,
  onError,
  onCancel
}: PCIVaultIframeProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [status, setStatus] = useState<MessageStatus>('ready')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // Vérifier l'origine du message (devrait être l'URL du PCI Vault)
      // En production, vérifier event.origin === PCI_VAULT_DOMAIN

      try {
        const data = event.data as PCIVaultMessage

        console.log('[PCIVaultIframe] Message reçu:', data)

        switch (data.type) {
          case 'ready':
            setLoading(false)
            setStatus('ready')
            break

          case 'capture_started':
            setLoading(true)
            setStatus('capture_started')
            setError(null)
            break

          case 'capture_completed':
            setStatus('capture_completed')
            setLoading(false)

            // Appeler l'API pour stocker le payment method
            if (data.payload?.paymentMethodId) {
              try {
                const response = await fetch('/api/payment-methods', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    sessionId,
                    paymentMethodToken: data.payload.paymentMethodId,
                    isDefault: true
                  })
                })

                if (!response.ok) {
                  const errorData = await response.json()
                  throw new Error(errorData.error || 'Erreur lors de l\'enregistrement de la carte')
                }

                const result = await response.json()
                onSuccess(result.paymentMethodId)
              } catch (err) {
                console.error('[PCIVaultIframe] Erreur API:', err)
                setError(err instanceof Error ? err.message : 'Erreur lors de l\'enregistrement')
                onError(err instanceof Error ? err.message : 'Erreur inconnue')
              }
            }
            break

          case 'capture_failed':
            setStatus('capture_failed')
            setLoading(false)
            const errorMsg = data.payload?.error || 'Échec de la capture de la carte'
            setError(errorMsg)
            onError(errorMsg)
            break

          case 'cancelled':
            setStatus('cancelled')
            setLoading(false)
            onCancel?.()
            break

          default:
            console.warn('[PCIVaultIframe] Type de message non géré:', data.type)
        }
      } catch (err) {
        console.error('[PCIVaultIframe] Erreur lors du traitement du message:', err)
      }
    }

    window.addEventListener('message', handleMessage)

    return () => {
      window.removeEventListener('message', handleMessage)
    }
  }, [sessionId, onSuccess, onError, onCancel])

  // Envoyer un message initial à l'iframe quand elle est prête
  useEffect(() => {
    if (!loading && iframeRef.current) {
      const iframe = iframeRef.current
      // Envoyer les données de session à l'iframe
      iframe.contentWindow?.postMessage({
        type: 'init',
        payload: { sessionId }
      }, '*') // En production, remplacer '*' par le domaine PCI Vault
    }
  }, [loading, sessionId])

  const getStatusIcon = () => {
    switch (status) {
      case 'capture_completed':
        return <CheckCircle size={24} weight="fill" className="text-green-400" />
      case 'capture_failed':
        return <Warning size={24} weight="fill" className="text-red-400" />
      case 'cancelled':
        return <X size={24} weight="fill" className="text-gray-400" />
      default:
        return <CreditCard size={24} weight="regular" className="text-purple-400" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case 'ready':
        return 'Entrez vos informations de paiement'
      case 'capture_started':
        return 'Traitement en cours...'
      case 'capture_completed':
        return 'Carte enregistrée avec succès'
      case 'capture_failed':
        return error || 'Échec de l\'enregistrement'
      case 'cancelled':
        return 'Paiement annulé'
      default:
        return 'Chargement...'
    }
  }

  return (
    <div className="space-y-4">
      {/* Header avec statut */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div>
            <h3 className="text-sm font-semibold text-white">Paiement sécurisé</h3>
            <p className="text-xs text-gray-400">{getStatusText()}</p>
          </div>
        </div>
        <Lock size={20} weight="fill" className="text-gray-500" />
      </div>

      {/* Iframe container */}
      <div className="relative">
        {loading && status === 'ready' && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1e1e1e] rounded-lg">
            <div className="space-y-3 text-center">
              <div className="animate-spin h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto" />
              <p className="text-sm text-gray-400">Chargement du module de paiement...</p>
            </div>
          </div>
        )}

        <iframe
          ref={iframeRef}
          src={iframeUrl}
          className={`w-full h-[400px] rounded-lg border ${
            error ? 'border-red-400/40' : 'border-[#B794F4]/40'
          } bg-[#1e1e1e] ${loading && status === 'ready' ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          title="Secure Payment Frame"
          allow="payment *"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>

      {/* Messages d'erreur */}
      {error && (
        <div className="rounded-lg border border-red-400/20 bg-red-900/10 p-3">
          <div className="flex items-start gap-2">
            <Warning size={20} weight="fill" className="text-red-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-400">{error}</p>
              <p className="text-xs text-gray-400 mt-1">
                Vérifiez vos informations de carte et réessayez
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Message de succès */}
      {status === 'capture_completed' && (
        <div className="rounded-lg border border-green-400/20 bg-green-900/10 p-3">
          <div className="flex items-start gap-2">
            <CheckCircle size={20} weight="fill" className="text-green-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-green-400">Carte enregistrée avec succès!</p>
              <p className="text-xs text-gray-400 mt-1">
                Vous allez être redirigé...
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Informations de sécurité */}
      <div className="rounded-lg border border-[#B794F4]/20 bg-[#1e1e1e]/50 p-3">
        <div className="flex items-start gap-2">
          <Lock size={16} weight="fill" className="text-gray-500 mt-0.5" />
          <div className="text-xs text-gray-400">
            <p>Paiement sécurisé par PCI Vault</p>
            <p className="mt-1">
              Vos données de carte sont chiffrées et ne transitent jamais par nos serveurs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}