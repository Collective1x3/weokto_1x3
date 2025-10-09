'use client'

import { useEffect, useState } from 'react'
import * as Icons from 'phosphor-react'

interface NewConversationPanelProps {
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

export default function NewConversationPanel({ isOpen, onClose, onCreate }: NewConversationPanelProps) {
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

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div className={`
        fixed top-0 left-0 h-full w-full sm:w-96 bg-[#1e1e1e] border-r border-[#B794F4]/20 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#B794F4]/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center">
              <Icons.PencilSimple size={20} weight="duotone" className="text-purple-400" />
            </div>
            <h3 className="text-white font-semibold text-lg">Nouvelle conversation</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-200"
          >
            <Icons.X size={20} weight="bold" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search Section */}
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-2 block">
              Destinataire
            </label>
            <div className="relative">
              <Icons.MagnifyingGlass
                size={20}
                weight="bold"
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Rechercher un pseudo ou un email..."
                className="w-full bg-black/50 border border-[#B794F4]/30 rounded-lg text-white pl-10 pr-10 py-3 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all"
              />
              {isSearching && (
                <Icons.CircleNotch
                  size={20}
                  className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-purple-400"
                />
              )}
            </div>

            {/* Search Results */}
            {results.length > 0 && (
              <div className="mt-3 space-y-2 max-h-60 overflow-y-auto">
                {results.map((result) => (
                  <button
                    key={result.authId}
                    onClick={() => {
                      setSelectedUser(result)
                      setResults([])
                      setQuery(result.displayName || result.email || result.authId)
                    }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 ${
                      selectedUser?.authId === result.authId
                        ? 'bg-purple-400/20 border border-purple-400/40'
                        : 'bg-black/30 border border-[#B794F4]/20 hover:bg-purple-400/10 hover:border-purple-400/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-400/10 flex items-center justify-center">
                        <Icons.User size={20} weight="duotone" className="text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-white truncate">
                          {result.displayName || 'Utilisateur'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {result.email || result.publicSlug}
                        </p>
                      </div>
                      {selectedUser?.authId === result.authId && (
                        <Icons.Check size={20} weight="bold" className="text-purple-400 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Selected User Display */}
            {selectedUser && results.length === 0 && (
              <div className="mt-3 p-3 rounded-lg bg-purple-400/10 border border-purple-400/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-400/20 flex items-center justify-center">
                    <Icons.User size={20} weight="duotone" className="text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white truncate">
                      {selectedUser.displayName || 'Utilisateur'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {selectedUser.email || selectedUser.publicSlug}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedUser(null)
                      setQuery('')
                    }}
                    className="p-1 rounded hover:bg-purple-400/20 transition-colors"
                  >
                    <Icons.X size={16} weight="bold" className="text-gray-400" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Message Section */}
          <div>
            <label className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold mb-2 block">
              Premier message
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={6}
                placeholder="Présentez-vous et expliquez pourquoi vous contactez cette personne..."
                className="w-full bg-black/50 border border-[#B794F4]/30 rounded-lg text-white px-4 py-3 focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 outline-none transition-all resize-none"
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                {message.length} / 500
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-2">
              <Icons.WarningCircle size={20} weight="bold" className="text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#B794F4]/20 bg-[#1e1e1e]/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-semibold uppercase tracking-wider border border-[#B794F4]/40 text-gray-400 hover:text-white hover:border-purple-400 rounded-lg transition-all duration-200"
            >
              Annuler
            </button>
            <button
              onClick={() => { void handleCreate() }}
              disabled={!selectedUser || !message.trim()}
              className="flex-1 px-4 py-3 text-sm font-semibold uppercase tracking-wider bg-purple-400 text-black hover:bg-[#FFB000] rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-purple-400"
            >
              Créer
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
