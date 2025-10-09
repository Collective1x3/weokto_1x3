'use client'

import { useMemo, useState } from 'react'
import * as Icons from 'phosphor-react'
import { useGuild } from '@/hooks/useGuilds'
import { useChannels } from '@/hooks/useChannels'

interface ChatSettingsPanelProps {
  slug: string
  variant?: 'full' | 'embedded'
}

interface Channel {
  id: string
  guild_id: string
  category_id: string | null
  name: string
  slug: string
  description?: string | null
  is_private: boolean
  position: number
  messageCount?: number
  memberCount?: number
  category: {
    id: string
    name: string
    position: number
  } | null
}

export function ChatSettingsPanel({ slug, variant = 'full' }: ChatSettingsPanelProps) {
  const { guild } = useGuild(slug)
  const {
    channels,
    categories,
    isLoading,
    createChannel,
    updateChannel,
    deleteChannel,
    isCreating,
    isUpdating,
    isDeleting
  } = useChannels(guild?.id || null, { scope: 'admin' })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    category_id: 'uncategorized'
  })

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.position - b.position),
    [categories]
  )

  const [autoModeration, setAutoModeration] = useState(false)
  const [slowMode, setSlowMode] = useState(false)
  const [linkFilter, setLinkFilter] = useState(true)

  const containerClasses =
    variant === 'embedded'
      ? 'border border-[#B794F4]/30 bg-black/70 p-4 font-mono'
      : 'font-mono'

  const handleCreateChannel = async () => {
    if (!guild?.id || !formData.name.trim()) return
    await createChannel(
      {
        guild_id: guild.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        is_private: formData.is_private,
        category_id: formData.category_id === 'uncategorized' ? null : formData.category_id
      },
      {
        onSuccess: () => {
          setShowCreateModal(false)
          setFormData({ name: '', description: '', is_private: false, category_id: 'uncategorized' })
        }
      }
    )
  }

  const handleUpdateChannel = async () => {
    if (!editingChannel) return
    await updateChannel(
      {
        channel_id: editingChannel.id,
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        is_private: formData.is_private,
        category_id: formData.category_id === 'uncategorized' ? null : formData.category_id
      },
      {
        onSuccess: () => {
          setEditingChannel(null)
          setShowCreateModal(false)
          setFormData({ name: '', description: '', is_private: false, category_id: 'uncategorized' })
        }
      }
    )
  }

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (!confirm(`Supprimer le channel #${channelName} ?`)) return
    await deleteChannel(channelId)
  }

  const openEditModal = (channel: Channel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description || '',
      is_private: channel.is_private,
      category_id: channel.category?.id || 'uncategorized'
    })
    setShowCreateModal(true)
  }

  return (
    <section className={containerClasses}>
      <div className="flex flex-col gap-4 border-b border-[#B794F4]/20 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Paramètres du chat</h2>
          <p className="text-xs text-[#B794F4]/60">
            Configure l’automatisation, les filtres et les annonces de la guilde.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingChannel(null)
            setFormData({ name: '', description: '', is_private: false, category_id: 'uncategorized' })
            setShowCreateModal(true)
          }}
          className="inline-flex items-center gap-2 border-2 border-[#B794F4] px-4 py-2 text-xs font-bold uppercase text-[#B794F4] transition-colors hover:bg-[#B794F4]/10"
        >
          <Icons.Plus size={14} /> Créer un channel
        </button>
      </div>

      <div className="grid gap-4 py-4 lg:grid-cols-[minmax(0,360px)_1fr]">
        <div className="space-y-4">
          <div className="rounded border border-[#B794F4]/20 bg-black/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#B794F4]/60">Modération et sécurité</h3>
            <div className="space-y-2 text-xs text-[#B794F4]/70">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={autoModeration}
                  onChange={(event) => setAutoModeration(event.target.checked)}
                  className="accent-[#FFB000]"
                />
                Activer l’auto-modération
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={slowMode}
                  onChange={(event) => setSlowMode(event.target.checked)}
                  className="accent-[#FFB000]"
                />
                Activer le slow mode (15s)
              </label>
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={linkFilter}
                  onChange={(event) => setLinkFilter(event.target.checked)}
                  className="accent-[#FFB000]"
                />
                Filtrer automatiquement les liens externes
              </label>
            </div>
          </div>

          <div className="rounded border border-[#B794F4]/20 bg-black/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#B794F4]/60">Announcements</h3>
            <p className="text-xs text-[#B794F4]/60">
              Définis un channel d’annonce pour prévenir instantanément tous tes membres.
            </p>
            <select className="w-full border border-[#B794F4]/30 bg-black px-3 py-2 text-sm text-white focus:border-[#FFB000] focus:outline-none">
              <option disabled selected>
                Sélectionner un channel
              </option>
              {channels.map((channel: Channel) => (
                <option key={channel.id} value={channel.id}>
                  #{channel.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <div className="border border-[#B794F4]/20 bg-black/60">
            <div className="flex items-center justify-between border-b border-[#B794F4]/20 px-4 py-3">
              <span className="text-sm font-bold text-white">Channels de la guilde</span>
              <span className="text-xs text-[#B794F4]/60">{channels.length} channels</span>
            </div>
            <ul className="divide-y divide-[#B794F4]/20">
              {channels.map((channel: Channel) => (
                <li key={channel.id} className="flex items-center justify-between px-4 py-3 text-sm text-white">
                  <div>
                    <span className="font-semibold">#{channel.name}</span>
                    {channel.description && (
                      <span className="ml-2 text-xs text-[#B794F4]/60">{channel.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <button
                      onClick={() => openEditModal(channel)}
                      className="text-[#B794F4]/70 hover:text-[#FFB000]"
                    >
                      <Icons.PencilSimple size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteChannel(channel.id, channel.name)}
                      className="text-[#EF4444] hover:text-[#F87171]"
                    >
                      <Icons.Trash size={12} />
                    </button>
                  </div>
                </li>
              ))}
              {channels.length === 0 && (
                <li className="px-4 py-3 text-xs text-[#B794F4]/60">Aucun channel pour l’instant.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-[#B794F4]/40 bg-black p-6 font-mono">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-white">
                {editingChannel ? 'Modifier le channel' : 'Créer un channel'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingChannel(null)
                }}
                className="text-[#B794F4] hover:text-[#FFB000]"
              >
                <Icons.X size={16} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[11px] uppercase text-[#B794F4]/60">Nom</label>
                <input
                  value={formData.name}
                  onChange={(event) => setFormData((prev) => ({ ...prev, name: event.target.value }))}
                  className="mt-1 w-full border border-[#B794F4]/30 bg-black px-3 py-2 text-sm text-white focus:border-[#FFB000] focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#B794F4]/60">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(event) => setFormData((prev) => ({ ...prev, description: event.target.value }))}
                  className="mt-1 w-full border border-[#B794F4]/30 bg-black px-3 py-2 text-sm text-white focus:border-[#FFB000] focus:outline-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-[11px] uppercase text-[#B794F4]/60">Catégorie</label>
                <select
                  value={formData.category_id}
                  onChange={(event) => setFormData((prev) => ({ ...prev, category_id: event.target.value }))}
                  className="mt-1 w-full border border-[#B794F4]/30 bg-black px-3 py-2 text-sm text-white focus:border-[#FFB000] focus:outline-none"
                >
                  <option value="uncategorized">Sans catégorie</option>
                  {sortedCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <label className="flex items-center gap-2 text-[11px] uppercase text-[#B794F4]/60">
                <input
                  type="checkbox"
                  checked={formData.is_private}
                  onChange={(event) => setFormData((prev) => ({ ...prev, is_private: event.target.checked }))}
                  className="accent-[#FFB000]"
                />
                Channel privé
              </label>

              <div className="flex items-center gap-2">
                <button
                  onClick={editingChannel ? handleUpdateChannel : handleCreateChannel}
                  disabled={isCreating || isUpdating}
                  className="flex-1 border border-[#B794F4] px-3 py-2 text-xs font-bold uppercase text-[#B794F4] transition-colors hover:bg-[#B794F4]/10 disabled:opacity-50"
                >
                  {editingChannel
                    ? isUpdating
                      ? 'Mise à jour...'
                      : 'Mettre à jour'
                    : isCreating
                    ? 'Création...'
                    : 'Créer le channel'}
                </button>
                <button
                  onClick={() => {
                    setShowCreateModal(false)
                    setEditingChannel(null)
                  }}
                  className="flex-1 border border-[#B794F4]/30 px-3 py-2 text-xs font-bold uppercase text-[#B794F4]/60 hover:text-[#FFB000]"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
