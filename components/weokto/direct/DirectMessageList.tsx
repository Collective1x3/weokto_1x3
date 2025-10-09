'use client'

import { useEffect, useRef } from 'react'
import * as Icons from 'phosphor-react'
import type { DirectMessagePayload } from '@/lib/direct/types'
import DirectMessageItem from './DirectMessageItem'

interface DirectMessageListProps {
  messages: DirectMessagePayload[]
  currentUserId: string | null
  onDelete: (messageId: string) => void
  onReaction: (messageId: string, emoji: string) => void
  onLoadMore?: () => void
  isLoading: boolean
  hasMore?: boolean
  typingUsers: Set<string>
}

export default function DirectMessageList({
  messages,
  currentUserId,
  onDelete,
  onReaction,
  onLoadMore,
  isLoading,
  hasMore,
  typingUsers
}: DirectMessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const prevMessageCount = useRef(messages.length)
  const isAutoScrolling = useRef(true)

  useEffect(() => {
    if (messages.length > prevMessageCount.current && isAutoScrolling.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessageCount.current = messages.length
  }, [messages])

  const handleScroll = () => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current

    if (scrollTop < 100 && hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }

    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    isAutoScrolling.current = isNearBottom
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-transparent to-[#1e1e1e]/50">
        <div className="text-center">
          <Icons.CircleNotch size={32} className="animate-spin text-purple-400 mx-auto mb-3" />
          <p className="text-sm text-gray-500">Chargement des messages...</p>
        </div>
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-gradient-to-b from-transparent to-[#1e1e1e]/50">
        <div className="text-center p-8">
          <div className="w-20 h-20 rounded-full bg-purple-400/10 flex items-center justify-center mx-auto mb-4">
            <Icons.ChatCircleDots size={40} weight="duotone" className="text-purple-400/50" />
          </div>
          <h3 className="text-white font-semibold mb-2">Commencez la conversation</h3>
          <p className="text-gray-500 text-sm">Envoyez un message pour démarrer</p>
        </div>
      </div>
    )
  }

  const grouped = messages.reduce<Record<string, DirectMessagePayload[]>>((acc, message) => {
    const date = new Date(message.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
    if (!acc[date]) acc[date] = []
    acc[date].push(message)
    return acc
  }, {})

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 lg:p-6 pb-24 space-y-4 custom-scrollbar bg-gradient-to-b from-transparent to-[#1e1e1e]/30"
      onScroll={handleScroll}
    >
      {hasMore && (
        <div className="text-center py-3">
          {isLoading ? (
            <Icons.CircleNotch size={20} className="animate-spin text-purple-400 mx-auto" />
          ) : (
            <button
              onClick={onLoadMore}
              className="px-4 py-2 text-xs text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200 font-semibold uppercase tracking-wider"
            >
              Charger plus de messages
            </button>
          )}
        </div>
      )}

      {Object.entries(grouped).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B794F4]/20 to-transparent" />
            <span className="text-xs text-gray-500 px-3 py-1 bg-[#1e1e1e]/50 rounded-full font-medium">
              {date}
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#B794F4]/20 to-transparent" />
          </div>

          {dateMessages.map((message, index) => {
            const previous = index > 0 ? dateMessages[index - 1] : null
            const showAvatar =
              !previous ||
              previous.sender_auth_id !== message.sender_auth_id ||
              new Date(message.created_at).getTime() - new Date(previous.created_at).getTime() > 300000

            return (
              <DirectMessageItem
                key={message.id}
                message={message}
                isOwn={message.sender_auth_id === currentUserId}
                showAvatar={showAvatar}
                currentUserId={currentUserId}
                onDelete={() => onDelete(message.id)}
                onReaction={(emoji) => onReaction(message.id, emoji)}
              />
            )
          })}
        </div>
      ))}

      {typingUsers.size > 0 && (
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-400/10 border border-purple-400/20 animate-pulse">
          <Icons.DotsThreeOutline size={20} weight="bold" className="text-purple-400" />
          <span className="text-sm text-purple-400 font-medium">
            {Array.from(typingUsers).length > 1
              ? 'Plusieurs personnes écrivent...'
              : 'Une personne écrit...'}
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
