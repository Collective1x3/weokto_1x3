'use client'

import { useMemo, useState } from 'react'
import * as Icons from 'phosphor-react'

interface ChannelCategory {
  id: string
  name: string
  position: number
}

interface Channel {
  id: string
  name: string
  slug: string
  description?: string | null
  is_private: boolean
  position: number
  category_id: string | null
  category: {
    id: string
    name: string
    position: number
  } | null
}

interface ChannelListProps {
  channels: Channel[]
  categories: ChannelCategory[]
  selectedChannelId: string | null
  onChannelSelect: (channelId: string) => void
  typingUsers: Set<string>
}

const UNCATEGORIZED_KEY = 'uncategorized'

export default function ChannelList({
  channels,
  categories,
  selectedChannelId,
  onChannelSelect,
  typingUsers
}: ChannelListProps) {
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const sortedCategories = useMemo(
    () => [...categories].sort((a, b) => a.position - b.position),
    [categories]
  )

  const groupedChannels = useMemo(() => {
    const map = new Map<string, Channel[]>()
    channels.forEach((channel) => {
      const key = channel.category_id ?? UNCATEGORIZED_KEY
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

  const toggleSection = (key: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const renderChannelButton = (channel: Channel) => {
    const isSelected = channel.id === selectedChannelId
    const hasTyping = isSelected && typingUsers.size > 0

    return (
      <button
        key={channel.id}
        onClick={() => onChannelSelect(channel.id)}
        className={`
          w-full px-3 py-2 text-left flex items-center gap-2 transition-all
          hover:bg-[#B794F4]/10
          ${isSelected ? 'bg-[#B794F4]/20 text-white' : 'text-[#B794F4]/80'}
        `}
      >
        <Icons.Hash size={16} className={isSelected ? 'text-[#FFB000]' : 'text-[#B794F4]/60'} />
        <span className="flex-1 truncate text-sm uppercase tracking-[0.2em]">{channel.name}</span>
        {channel.is_private && <Icons.Lock size={12} className="text-[#FFB000]" />}
        {hasTyping && (
          <div className="flex gap-0.5">
            <span className="w-1 h-1 bg-[#FFB000] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-1 h-1 bg-[#FFB000] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-1 h-1 bg-[#FFB000] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </button>
    )
  }

  return (
    <div className="p-2 space-y-2">
      {sortedCategories.map((category) => {
        const key = category.id
        const sectionChannels = groupedChannels.get(key) ?? []
        const collapsed = collapsedSections[key]

        return (
          <div key={category.id} className="border border-[#B794F4]/20">
            <button
              onClick={() => toggleSection(key)}
              className="w-full flex items-center justify-between px-3 py-2 bg-black/40 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icons.CaretDown size={14} className={`transition-transform ${collapsed ? '-rotate-90' : 'rotate-0'}`} />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
                  {category.name}
                </span>
              </div>
              <span className="text-[10px] text-[#B794F4]/50 tracking-[0.3em]">
                {sectionChannels.length} channel{sectionChannels.length > 1 ? 's' : ''}
              </span>
            </button>
            {!collapsed && sectionChannels.length > 0 && (
              <div className="pt-1">
                {sectionChannels.map(renderChannelButton)}
              </div>
            )}
            {!collapsed && sectionChannels.length === 0 && (
              <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#B794F4]/40">
                Aucun channel
              </div>
            )}
          </div>
        )
      })}

      {(() => {
        const uncategorized = groupedChannels.get(UNCATEGORIZED_KEY) ?? []
        const collapsed = collapsedSections[UNCATEGORIZED_KEY]
        return (
          <div className="border border-[#B794F4]/20">
            <button
              onClick={() => toggleSection(UNCATEGORIZED_KEY)}
              className="w-full flex items-center justify-between px-3 py-2 bg-black/40 hover:bg-black/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icons.CaretDown size={14} className={`transition-transform ${collapsed ? '-rotate-90' : 'rotate-0'}`} />
                <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white">
                  Sans catégorie
                </span>
              </div>
              <span className="text-[10px] text-[#B794F4]/50 tracking-[0.3em]">
                {uncategorized.length} channel{uncategorized.length > 1 ? 's' : ''}
              </span>
            </button>
            {!collapsed && uncategorized.length > 0 && (
              <div className="pt-1">
                {uncategorized.map(renderChannelButton)}
              </div>
            )}
            {!collapsed && uncategorized.length === 0 && (
              <div className="px-3 py-2 text-[10px] uppercase tracking-[0.3em] text-[#B794F4]/40">
                Aucun channel
              </div>
            )}
          </div>
        )
      })()}
    </div>
  )
}
