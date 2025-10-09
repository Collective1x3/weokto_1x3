'use client'

import { useState } from 'react'
import * as Icons from 'phosphor-react'
import type { DirectMessagePayload } from '@/lib/direct/types'

interface DirectMessageItemProps {
  message: DirectMessagePayload
  isOwn: boolean
  showAvatar: boolean
  currentUserId: string | null
  onDelete: () => void
  onReaction: (emoji: string) => void
}

const QUICK_REACTIONS = ['👍', '❤️', '🔥', '😂', '👏']

export default function DirectMessageItem({
  message,
  isOwn,
  showAvatar,
  currentUserId,
  onDelete,
  onReaction
}: DirectMessageItemProps) {
  const [showActions, setShowActions] = useState(false)
  const [showReactions, setShowReactions] = useState(false)

  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  const displayName = message.sender?.display_name || (isOwn ? 'Vous' : 'Membre')

  const reactionsGrouped = (message.reactions || []).reduce<Record<string, string[]>>((acc, reaction) => {
    if (!acc[reaction.emoji]) acc[reaction.emoji] = []
    acc[reaction.emoji].push(reaction.auth_id)
    return acc
  }, {})

  const isDeleted = Boolean(message.deleted_at)

  return (
    <div
      className={`group flex gap-3 px-2 py-1 -mx-2 rounded transition-colors ${
        isOwn ? 'flex-row-reverse text-right hover:bg-[#FFB000]/10' : 'hover:bg-[#B794F4]/10'
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false)
        setShowReactions(false)
      }}
    >
      {showAvatar && (
        <div className="w-8 h-8 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#B794F4]/20 border border-[#B794F4] flex items-center justify-center">
            <span className="text-[#FFB000] text-sm font-bold">{displayName?.[0]?.toUpperCase() || '?'}</span>
          </div>
        </div>
      )}

      <div className={`flex-1 min-w-0 flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse text-right' : ''}`}>
          <span className="font-semibold text-[#FFB000] text-sm">{displayName}</span>
          <span className="text-xs text-[#B794F4]/40">{time}</span>
          {message.edited_at && <span className="text-xs text-[#B794F4]/40">(édité)</span>}
        </div>

        {message.reply_to && (
          <div className={`flex items-center gap-2 text-xs text-[#B794F4]/60 mb-1 ${isOwn ? 'justify-end flex-row-reverse' : ''}`}>
            <Icons.ArrowBendUpLeft size={12} />
            <span>@{message.reply_to.sender_auth_id.slice(0, 6)}</span>
            <span className="truncate max-w-xs opacity-60">{message.reply_to.content}</span>
          </div>
        )}

        <div
          className={`max-w-[75%] rounded-lg border px-3 py-2 whitespace-pre-wrap ${
            isOwn
              ? 'bg-[#FFB000]/15 border-[#FFB000]/40 text-white'
              : 'bg-black/60 border-[#B794F4]/20 text-white'
          }`}
        >
          {isDeleted ? (
            <span className="text-xs text-[#B794F4]/50 italic">
              {message.deleted_by_auth_id === currentUserId
                ? 'Vous avez supprimé ce message'
                : "L'utilisateur a supprimé ce message"}
            </span>
          ) : (
            message.content
          )}
        </div>

        {Object.keys(reactionsGrouped).length > 0 && (
          <div className={`flex flex-wrap gap-1 mt-2 ${isOwn ? 'justify-end' : ''}`}>
            {Object.entries(reactionsGrouped).map(([emoji, users]) => (
              <button
                key={emoji}
                onClick={() => onReaction(emoji)}
                className={`px-2 py-0.5 text-xs rounded-full border transition ${
                  users.includes(currentUserId || '')
                    ? 'bg-[#B794F4]/20 border-[#B794F4] text-[#FFB000]'
                    : 'bg-black/50 border-[#B794F4]/30 text-white hover:border-[#B794F4]'
                }`}
              >
                {emoji} <span className="ml-1">{users.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {showActions && !isDeleted && (
        <div className={`flex items-start gap-1 ${isOwn ? 'flex-row' : 'flex-row-reverse'}`}>
          <div className="relative">
            <button
              onClick={() => setShowReactions((prev) => !prev)}
              className="p-1 text-[#B794F4]/60 hover:text-[#FFB000]"
              aria-label="Ajouter une réaction"
            >
              <Icons.Smiley size={16} />
            </button>
            {showReactions && (
              <div
                className={`absolute z-20 bg-black border border-[#B794F4] rounded-lg p-2 flex gap-1 shadow-xl ${
                  isOwn ? 'right-0 top-full mt-2' : 'left-0 top-full mt-2'
                }`}
              >
                {QUICK_REACTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction(emoji)
                      setShowReactions(false)
                    }}
                    className="w-8 h-8 hover:bg-[#B794F4]/20 rounded flex items-center justify-center transition text-lg"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          {isOwn && (
            <button
              onClick={onDelete}
              className="p-1 text-red-500/60 hover:text-red-400"
              aria-label="Supprimer"
            >
              <Icons.Trash size={16} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
