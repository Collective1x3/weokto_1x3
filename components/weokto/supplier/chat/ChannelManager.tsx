'use client'

import { useMemo, useState, type FormEvent } from 'react'
import * as Icons from 'phosphor-react'
import { useGuild } from '@/hooks/useGuilds'
import { useChannels } from '@/hooks/useChannels'

interface ChannelManagerProps {
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
    slug?: string
    position: number
  } | null
}

export function ChannelManager({ slug, variant = 'full' }: ChannelManagerProps) {
  const { guild } = useGuild(slug)
  const {
    channels,
    categories,
    isLoading,
    createChannel,
    updateChannel,
    deleteChannel,
    reorderChannels,
    reorderCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreating,
    isUpdating,
    isDeleting,
    isReordering,
    isCreatingCategory,
    isUpdatingCategory,
    isDeletingCategory,
    isReorderingCategory
  } = useChannels(guild?.id || null, { scope: 'admin' })

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingChannel, setEditingChannel] = useState<Channel | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_private: false,
    category_id: 'uncategorized'
  })

  const [newCategoryName, setNewCategoryName] = useState('')
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null)
  const [categoryDraftName, setCategoryDraftName] = useState('')

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.position - b.position),
    [categories]
  )

  const channelsByCategory = useMemo(() => {
    const map = new Map<string | null, Channel[]>()
    channels.forEach((channel: Channel) => {
      const key = channel.category_id
      const list = map.get(key) ?? []
      list.push(channel)
      map.set(key, list)
    })
    for (const [key, list] of map.entries()) {
      list.sort((a, b) => a.position - b.position)
      map.set(key, list)
    }
    return map
  }, [channels])

  const uncategorizedChannels = channelsByCategory.get(null) ?? []

  const handleMoveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const currentOrder = [...sortedCategories]
    const index = currentOrder.findIndex((category) => category.id === categoryId)
    if (index === -1) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= currentOrder.length) return

    const reordered = [...currentOrder]
    const [category] = reordered.splice(index, 1)
    reordered.splice(swapIndex, 0, category)

    await reorderCategories(
      reordered.map((item, position) => ({ id: item.id, position }))
    )
  }

  const handleMoveChannel = async (channel: Channel, direction: 'up' | 'down') => {
    const key = channel.category_id
    const group = [...(channelsByCategory.get(key) ?? [])]
    const index = group.findIndex((item) => item.id === channel.id)
    if (index === -1) return

    const swapIndex = direction === 'up' ? index - 1 : index + 1
    if (swapIndex < 0 || swapIndex >= group.length) return

    const reorderedGroup = [...group]
    const [item] = reorderedGroup.splice(index, 1)
    reorderedGroup.splice(swapIndex, 0, item)

    await reorderChannels(
      reorderedGroup.map((entry, position) => ({
        id: entry.id,
        position,
        category_id: key
      }))
    )
  }

  const handleChannelCategoryChange = async (channel: Channel, nextCategoryId: string) => {
    await updateChannel({
      channel_id: channel.id,
      category_id: nextCategoryId === 'uncategorized' ? null : nextCategoryId
    })
  }

  const handleCreateCategorySubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!guild?.id || !newCategoryName.trim()) return
    await createCategory({ guild_id: guild.id, name: newCategoryName.trim() })
    setNewCategoryName('')
  }

  const handleStartCategoryEdit = (categoryId: string, currentName: string) => {
    setEditingCategoryId(categoryId)
    setCategoryDraftName(currentName)
  }

  const handleSaveCategoryEdit = async (categoryId: string) => {
    if (!categoryDraftName.trim()) return
    await updateCategory({ category_id: categoryId, name: categoryDraftName.trim() })
    setEditingCategoryId(null)
    setCategoryDraftName('')
  }

  const handleDeleteCategoryClick = async (categoryId: string) => {
    if (!confirm('Supprimer cette catégorie ? Les channels resteront accessibles sans catégorie.')) return
    await deleteCategory(categoryId)
  }

  const [formError, setFormError] = useState<string | null>(null)

  const handleCreateChannel = async () => {
    if (!guild?.id || !formData.name.trim()) return

    try {
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
            setFormError(null)
          }
        }
      )
    } catch (error: any) {
      setFormError(error?.message ?? "Impossible de créer le channel")
    }
  }

  const handleUpdateChannel = async () => {
    if (!editingChannel) return

    try {
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
            setFormData({ name: '', description: '', is_private: false, category_id: 'uncategorized' })
            setFormError(null)
          }
        }
      )
    } catch (error: any) {
      setFormError(error?.message ?? "Impossible de mettre à jour le channel")
    }
  }

  const handleDeleteChannel = async (channelId: string, channelName: string) => {
    if (!confirm(`Supprimer définitivement le channel #${channelName} ?`)) return
    await deleteChannel(channelId)
  }

  const startEdit = (channel: Channel) => {
    setEditingChannel(channel)
    setFormData({
      name: channel.name,
      description: channel.description || '',
      is_private: channel.is_private,
      category_id: channel.category?.id || 'uncategorized'
    })
    setShowCreateModal(true)
  }

  const containerClasses =
    variant === 'embedded'
      ? 'border border-[#B794F4]/30 bg-black/70 p-4 font-mono'
      : 'font-mono'

  return (
    <section className={containerClasses}>
      <div className="flex flex-col gap-4 border-b border-[#B794F4]/20 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Channels & catégories</h2>
          <p className="text-xs text-[#B794F4]/60">
            Structure tes espaces de discussion et ajuste leur visibilité en un clin d’œil.
          </p>
        </div>
        <button
          onClick={() => {
            setEditingChannel(null)
            setFormData({ name: '', description: '', is_private: false, category_id: 'uncategorized' })
            setShowCreateModal(true)
            setFormError(null)
          }}
          className="inline-flex items-center gap-2 border-2 border-[#B794F4] px-4 py-2 text-xs font-bold uppercase text-[#B794F4] transition-colors hover:bg-[#B794F4]/10"
        >
          <Icons.Plus size={14} /> Nouveau channel
        </button>
      </div>

      <div className="grid gap-4 py-4 lg:grid-cols-[minmax(0,340px)_1fr]">
        <div className="space-y-4">
          <form onSubmit={handleCreateCategorySubmit} className="rounded border border-[#B794F4]/20 bg-black/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#B794F4]/60">Créer une catégorie</h3>
            <input
              value={newCategoryName}
              onChange={(event) => setNewCategoryName(event.target.value)}
              className="w-full border border-[#B794F4]/30 bg-black px-3 py-2 text-sm text-white focus:border-[#FFB000] focus:outline-none"
              placeholder="Nom de la catégorie"
            />
            <button
              type="submit"
              disabled={isCreatingCategory}
              className="w-full border border-[#B794F4] px-3 py-2 text-xs font-bold uppercase text-[#B794F4] transition-colors hover:bg-[#B794F4]/10 disabled:opacity-50"
            >
              {isCreatingCategory ? 'Création...' : 'Ajouter la catégorie'}
            </button>
          </form>

          <div className="rounded border border-[#B794F4]/20 bg-black/60 p-4 space-y-3">
            <h3 className="text-xs font-bold uppercase text-[#B794F4]/60">Catégories</h3>
            <div className="space-y-2">
              {sortedCategories.map((category) => (
                <div key={category.id} className="rounded border border-[#B794F4]/30 bg-black/40 p-3 text-sm text-white">
                  <div className="flex items-center justify-between gap-2">
                    {editingCategoryId === category.id ? (
                      <input
                        value={categoryDraftName}
                        onChange={(event) => setCategoryDraftName(event.target.value)}
                        className="flex-1 border border-[#B794F4]/30 bg-black px-2 py-1 text-xs text-white focus:border-[#FFB000] focus:outline-none"
                      />
                    ) : (
                      <span className="font-semibold">{category.name}</span>
                    )}

                    <div className="flex items-center gap-2 text-xs">
                      <button
                        onClick={() => handleMoveCategory(category.id, 'up')}
                        className="text-[#B794F4]/70 hover:text-[#FFB000]"
                        type="button"
                        title="Monter"
                      >
                        <Icons.ArrowUp size={12} />
                      </button>
                      <button
                        onClick={() => handleMoveCategory(category.id, 'down')}
                        className="text-[#B794F4]/70 hover:text-[#FFB000]"
                        type="button"
                        title="Descendre"
                      >
                        <Icons.ArrowDown size={12} />
                      </button>
                      {editingCategoryId === category.id ? (
                        <button
                          onClick={() => handleSaveCategoryEdit(category.id)}
                          className="text-[#10B981] hover:text-[#34D399]"
                          type="button"
                        >
                          <Icons.Check size={12} />
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStartCategoryEdit(category.id, category.name)}
                          className="text-[#B794F4]/70 hover:text-[#FFB000]"
                          type="button"
                        >
                          <Icons.PencilSimple size={12} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteCategoryClick(category.id)}
                        className="text-[#EF4444] hover:text-[#F87171]"
                        type="button"
                      >
                        <Icons.Trash size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedCategories.map((category) => {
            const categoryChannels = channelsByCategory.get(category.id) ?? []
            return (
              <div key={category.id} className="border border-[#B794F4]/20 bg-black/60">
                <div className="flex items-center justify-between border-b border-[#B794F4]/20 px-4 py-3">
                  <span className="text-sm font-bold text-white">{category.name}</span>
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        description: '',
                        is_private: false,
                        category_id: category.id
                      })
                      setShowCreateModal(true)
                    }}
                    className="text-xs uppercase text-[#B794F4] hover:text-[#FFB000]"
                  >
                    <Icons.Plus size={12} /> Ajouter un channel
                  </button>
                </div>

                <ul className="divide-y divide-[#B794F4]/20">
                  {categoryChannels.map((channel) => (
                    <li key={channel.id} className="flex items-center justify-between px-4 py-3 text-sm text-white">
                      <div className="flex flex-col">
                        <span className="font-semibold">#{channel.name}</span>
                        {channel.description && (
                          <span className="text-xs text-[#B794F4]/60">{channel.description}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <select
                          value={channel.category_id ?? 'uncategorized'}
                          onChange={(event) => handleChannelCategoryChange(channel, event.target.value)}
                          className="border border-[#B794F4]/30 bg-black px-2 py-1 text-xs text-white focus:border-[#FFB000] focus:outline-none"
                        >
                          <option value="uncategorized">Sans catégorie</option>
                          {sortedCategories.map((categoryOption) => (
                            <option key={categoryOption.id} value={categoryOption.id}>
                              {categoryOption.name}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleMoveChannel(channel, 'up')}
                          className="text-[#B794F4]/60 hover:text-[#FFB000]"
                          type="button"
                          title="Monter"
                        >
                          <Icons.ArrowUp size={12} />
                        </button>
                        <button
                          onClick={() => handleMoveChannel(channel, 'down')}
                          className="text-[#B794F4]/60 hover:text-[#FFB000]"
                          type="button"
                          title="Descendre"
                        >
                          <Icons.ArrowDown size={12} />
                        </button>
                        <button
                          onClick={() => startEdit(channel)}
                          className="text-[#B794F4]/70 hover:text-[#FFB000]"
                          type="button"
                        >
                          <Icons.PencilSimple size={12} />
                        </button>
                        <button
                          onClick={() => handleDeleteChannel(channel.id, channel.name)}
                          className="text-[#EF4444] hover:text-[#F87171]"
                          type="button"
                        >
                          <Icons.Trash size={12} />
                        </button>
                      </div>
                    </li>
                  ))}
                  {categoryChannels.length === 0 && (
                    <li className="px-4 py-3 text-xs text-[#B794F4]/60">Aucun channel dans cette catégorie.</li>
                  )}
                </ul>
              </div>
            )
          })}

          <div className="border border-[#B794F4]/20 bg-black/60">
            <div className="flex items-center justify-between border-b border-[#B794F4]/20 px-4 py-3">
              <span className="text-sm font-bold text-white">Sans catégorie</span>
            </div>
            <ul className="divide-y divide-[#B794F4]/20">
              {uncategorizedChannels.map((channel) => (
                <li key={channel.id} className="flex items-center justify-between px-4 py-3 text-sm text-white">
                  <div className="flex flex-col">
                    <span className="font-semibold">#{channel.name}</span>
                    {channel.description && (
                      <span className="text-xs text-[#B794F4]/60">{channel.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <select
                      value={channel.category_id ?? 'uncategorized'}
                      onChange={(event) => handleChannelCategoryChange(channel, event.target.value)}
                      className="border border-[#B794F4]/30 bg-black px-2 py-1 text-xs text-white focus:border-[#FFB000] focus:outline-none"
                    >
                      <option value="uncategorized">Sans catégorie</option>
                      {sortedCategories.map((categoryOption) => (
                        <option key={categoryOption.id} value={categoryOption.id}>
                          {categoryOption.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => startEdit(channel)}
                      className="text-[#B794F4]/70 hover:text-[#FFB000]"
                      type="button"
                    >
                      <Icons.PencilSimple size={12} />
                    </button>
                    <button
                      onClick={() => handleDeleteChannel(channel.id, channel.name)}
                      className="text-[#EF4444] hover:text-[#F87171]"
                      type="button"
                    >
                      <Icons.Trash size={12} />
                    </button>
                  </div>
                </li>
              ))}
              {uncategorizedChannels.length === 0 && (
                <li className="px-4 py-3 text-xs text-[#B794F4]/60">Aucun channel sans catégorie.</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg border border-[#B794F4]/40 bg-black p-6 font-mono">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase text-white">
                {editingChannel ? 'Modifier le channel' : 'Nouveau channel'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setEditingChannel(null)
                  setFormError(null)
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
                  placeholder="ex : général"
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

              {formError && <p className="text-xs text-[#EF4444]">{formError}</p>}

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
                    setFormError(null)
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
