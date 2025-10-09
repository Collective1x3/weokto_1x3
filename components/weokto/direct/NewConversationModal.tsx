'use client'

import { useEffect, useState } from 'react'
import * as Icons from 'phosphor-react'

interface NewConversationModalProps {
  isOpen: boolean
  onClose: () => void
  onCreate: (payload: { recipient_auth_id: string; initial_message: string; topic?: string }) => Promise<void>
}

interface SearchResult {
  authId: string
  displayName?: string | null
  email?: string | null
  publicSlug?: string | null
}

export default function NewConversationModal({ isOpen, onClose, onCreate }: NewConversationModalProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedUser, setSelectedUser] = useState<SearchResult | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      setQuery('')
      setResults([])
      setSelectedUser(null)
      setMessage('')
      setError(null)
    }
  }, [isOpen])

  const handleSearch = async (value: string) => {
    setQuery(value)
    if (value.trim().length < 2) {
      setResults([])
      return
    }

    try {
      setIsSearching(true)
      const response = await fetch(`/api/direct/users?q=${encodeURIComponent(value)}`)
      const json = await response.json()
      setResults(json.users ?? [])
    } catch (err) {
      console.error('Search failed', err)
    } finally {
      setIsSearching(false)
    }
  }

  const handleCreate = async () => {
    if (!selectedUser) {
      setError('Sélectionnez un destinataire.')
      return
    }
    if (!message.trim()) {
      setError('Écrivez un premier message pour lancer la conversation.')
      return
    }

    try {
      setError(null)
      await onCreate({
        recipient_auth_id: selectedUser.authId,
        initial_message: message.trim()
      })
      onClose()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Impossible de créer la conversation'
      setError(message)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-black border border-[#B794F4] shadow-lg">
        <div className="flex items-center justify-between border-b border-[#B794F4]/40 px-4 py-3">
          <h3 className="text-white font-semibold">Nouvelle conversation</h3>
          <button onClick={onClose} className="text-[#B794F4] hover:text-[#FFB000]">
            <Icons.X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs text-[#B794F4]/60 uppercase tracking-[0.3em]">Destinataire</label>
            <div className="relative mt-1">
              <input
                type="search"
                value={query}
                onChange={(event) => handleSearch(event.target.value)}
                placeholder="Rechercher un pseudo ou un email"
                className="w-full bg-black border border-[#B794F4]/40 text-white px-3 py-2 focus:border-[#FFB000] outline-none"
              />
              {isSearching && (
                <Icons.CircleNotch size={16} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-[#B794F4]" />
              )}
            </div>
            {results.length > 0 && (
              <ul className="mt-2 max-h-40 overflow-y-auto border border-[#B794F4]/30 divide-y divide-[#B794F4]/20">
                {results.map((result) => (
                  <li key={result.authId}>
                    <button
                      onClick={() => {
                        setSelectedUser(result)
                        setResults([])
                        setQuery(result.displayName || result.email || result.authId)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm transition ${
                        selectedUser?.authId === result.authId
                          ? 'bg-[#B794F4]/20 text-white'
                          : 'hover:bg-black/60 text-[#B794F4]/80'
                      }`}
                    >
                      <span className="font-semibold">{result.displayName || 'Utilisateur'}</span>
                      <span className="block text-xs text-[#B794F4]/50">{result.email || result.publicSlug}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="text-xs text-[#B794F4]/60 uppercase tracking-[0.3em]">Premier message</label>
            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              rows={4}
              placeholder="Présentez-vous et expliquez pourquoi vous contactez cette personne."
              className="w-full mt-1 bg-black border border-[#B794F4]/40 text-white px-3 py-2 focus:border-[#FFB000] outline-none"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs uppercase tracking-[0.3em] border border-[#B794F4]/60 text-[#B794F4] hover:text-[#FFB000] hover:border-[#FFB000]"
            >
              Annuler
            </button>
            <button
              onClick={() => {
                void handleCreate()
              }}
              className="px-4 py-2 text-xs uppercase tracking-[0.3em] bg-[#B794F4] text-black hover:bg-[#FFB000]"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
