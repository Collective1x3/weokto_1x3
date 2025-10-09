'use client'

import { useRef, useEffect } from 'react'
import * as Icons from 'phosphor-react'
import Message from './Message'

interface MessageData {
  id: string
  channel_id: string
  user_id: string
  content: string
  reply_to_id?: string | null
  edited_at?: string
  deleted_at?: string
  created_at: string
  user?: {
    auth_id: string
    display_name?: string
    avatar_url?: string
  }
  reactions?: Array<{
    user_id: string
    emoji: string
    created_at: string
  }>
  reply_to?: {
    id: string
    content: string
    user?: {
      display_name?: string
    }
  }
}

interface MessageListProps {
  messages: MessageData[]
  currentUserId: string
  onReply: (message: MessageData) => void
  onEdit: (message: MessageData) => void
  onDelete: (messageId: string) => void
  onReaction: (messageId: string, emoji: string) => void
  onLoadMore?: () => void
  isLoading: boolean
  hasMore?: boolean
  canModerate?: boolean
  onModerate?: (payload: { userId: string; displayName?: string | null }) => void
}

export default function MessageList({
  messages,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  onLoadMore,
  isLoading,
  hasMore,
  canModerate = false,
  onModerate
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isAutoScrolling = useRef(true)
  const prevMessageCount = useRef(messages.length)

  // Auto-scroll to bottom on new messages (only if user is near bottom)
  useEffect(() => {
    if (messages.length > prevMessageCount.current && isAutoScrolling.current) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
    prevMessageCount.current = messages.length
  }, [messages])

  // Handle scroll for pagination and auto-scroll detection
  const handleScroll = () => {
    if (!containerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current

    // Check if near top for pagination
    if (scrollTop < 100 && hasMore && !isLoading && onLoadMore) {
      onLoadMore()
    }

    // Check if near bottom for auto-scroll
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
    isAutoScrolling.current = isNearBottom
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <Icons.CircleNotch size={40} className="animate-spin text-[#B794F4]" />
          <span className="text-sm text-[#B794F4]/60 font-medium">Chargement des messages...</span>
        </div>
      </div>
    )
  }

  // AMÉLIORATION: Empty state plus attrayant avec animation et style amélioré
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="relative mb-6">
            <div className="absolute inset-0 bg-[#B794F4]/10 blur-2xl rounded-full" />
            <Icons.ChatCircleText size={64} className="relative mx-auto text-[#B794F4]/40 animate-pulse" />
          </div>
          <p className="text-lg font-bold text-[#B794F4]/70 mb-2">Aucun message dans ce channel</p>
          <p className="text-sm text-[#B794F4]/50">Soyez le premier à écrire !</p>
        </div>
      </div>
    )
  }

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })

    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(message)
    return groups
  }, {} as Record<string, MessageData[]>)

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto p-4 pb-24 space-y-2"
      onScroll={handleScroll}
    >
      {/* Load more indicator - AMÉLIORATION: Style plus visible, hover feedback amélioré */}
      {hasMore && (
        <div className="text-center py-3">
          {isLoading ? (
            <Icons.CircleNotch size={24} className="animate-spin text-[#B794F4] mx-auto" />
          ) : (
            <button
              onClick={onLoadMore}
              className="text-xs font-medium text-[#B794F4]/70 hover:text-[#FFB000] transition-all duration-200 px-4 py-2 rounded-lg hover:bg-[#B794F4]/10 border border-[#B794F4]/20 hover:border-[#B794F4]/40"
            >
              Charger plus de messages
            </button>
          )}
        </div>
      )}

      {/* Messages grouped by date */}
      {Object.entries(groupedMessages).map(([date, dateMessages]) => (
        <div key={date}>
          {/* Date separator - AMÉLIORATION: Design plus riche avec gradient, badge style, ombre pour profondeur */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-[2px] bg-gradient-to-r from-transparent via-[#B794F4]/30 to-[#B794F4]/30" />
            <div className="relative">
              <div className="absolute inset-0 bg-[#FFB000]/20 blur-md rounded-full" />
              <span className="relative text-xs font-bold text-[#FFB000] px-4 py-1.5 bg-black/80 border-2 border-[#B794F4]/40 rounded-full backdrop-blur-sm shadow-lg">
                {date}
              </span>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-l from-transparent via-[#B794F4]/30 to-[#B794F4]/30" />
          </div>

          {/* Messages for this date */}
          {dateMessages.map((message, index) => {
            const prevMessage = index > 0 ? dateMessages[index - 1] : null
            const showAvatar = !prevMessage ||
              prevMessage.user_id !== message.user_id ||
              (new Date(message.created_at).getTime() - new Date(prevMessage.created_at).getTime()) > 300000 // 5 minutes

            return (
              <Message
                key={message.id}
                message={message}
                isOwn={message.user_id === currentUserId}
                showAvatar={showAvatar}
                currentUserId={currentUserId}
                onReply={() => onReply(message)}
                onEdit={() => onEdit(message)}
                onDelete={() => onDelete(message.id)}
                onReaction={(emoji) => onReaction(message.id, emoji)}
                canModerate={canModerate}
                onModerate={onModerate}
              />
            )
          })}
        </div>
      ))}

      <div ref={bottomRef} />
    </div>
  )
}
