'use client'

import * as Icons from 'phosphor-react'

interface ConversationListProps {
  conversations: Array<{
    id: string
    status: string
    is_group: boolean
    topic?: string | null
    last_message_at?: string | null
    unread_count: number
    participants: Array<{
      auth_id: string
      display_name?: string | null
    }>
  }>
  currentUserAuthId: string | null
  selectedConversationId: string | null
  onSelect: (conversationId: string) => void
  onCompose: () => void
}

function getConversationTitle(
  conversation: ConversationListProps['conversations'][number],
  currentUserAuthId: string | null
) {
  if (conversation.is_group) {
    return conversation.topic || 'Conversation de groupe'
  }

  const other = conversation.participants.find((participant) => participant.auth_id !== currentUserAuthId)
  return other?.display_name || 'Conversation'
}

export default function ConversationList({
  conversations,
  currentUserAuthId,
  selectedConversationId,
  onSelect,
  onCompose
}: ConversationListProps) {
  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]/50">
      <div className="p-4 lg:p-6 border-b border-[#B794F4]/20 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold">Messages</p>
          <h2 className="text-white font-semibold text-lg">Conversations</h2>
        </div>
        <button
          onClick={onCompose}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs uppercase tracking-wider border border-[#B794F4]/40 text-purple-400 hover:text-white hover:bg-purple-400/10 hover:border-[#B794F4] transition-all duration-200 font-semibold"
        >
          <Icons.Plus size={16} weight="bold" />
          Nouveau
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <Icons.ChatCircleDots size={48} weight="duotone" className="mx-auto mb-3 text-purple-400/30" />
            <p className="text-sm text-gray-500">Aucune conversation</p>
            <p className="text-xs text-gray-600 mt-1">Commencez une nouvelle conversation</p>
          </div>
        ) : (
          <ul className="p-2">
            {conversations.map((conversation) => {
              const isSelected = conversation.id === selectedConversationId
              const title = getConversationTitle(conversation, currentUserAuthId)
              const hasUnread = conversation.unread_count > 0
              const lastMessageDate = conversation.last_message_at
                ? new Date(conversation.last_message_at).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short'
                  })
                : null

              return (
                <li key={conversation.id} className="mb-1">
                  <button
                    onClick={() => onSelect(conversation.id)}
                    className={`w-full text-left px-3 py-3 rounded-lg flex items-center gap-3 transition-all duration-200 group relative ${
                      isSelected
                        ? 'bg-purple-400/20 text-white border-l-2 border-purple-400'
                        : 'hover:bg-purple-400/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                      isSelected ? 'bg-purple-400/30' : 'bg-[#1e1e1e] group-hover:bg-purple-400/20'
                    }`}>
                      {conversation.is_group ? (
                        <Icons.Users size={20} weight="duotone" className="text-purple-400" />
                      ) : (
                        <Icons.User size={20} weight="duotone" className="text-purple-400" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-semibold text-sm truncate">{title}</span>
                        {lastMessageDate && (
                          <span className="text-xs text-gray-500 ml-2">{lastMessageDate}</span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className={`text-xs truncate ${
                          conversation.status === 'PENDING' ? 'text-orange-400' : 'text-gray-500'
                        }`}>
                          {conversation.status === 'PENDING' ? '⏳ En attente' : '✓ Actif'}
                        </span>
                        {hasUnread && (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-purple-400 text-white font-bold animate-pulse">
                            {conversation.unread_count}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Arrow indicator for selected */}
                    {isSelected && (
                      <Icons.CaretRight size={16} weight="bold" className="text-purple-400 absolute right-2" />
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
