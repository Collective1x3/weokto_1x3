'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import ConversationList from './ConversationList'
import RequestsList from './RequestsList'
import DirectMessageList from './DirectMessageList'
import DirectMessageInput from './DirectMessageInput'
import NewConversationPanel from './NewConversationPanel'
import { useDirectInbox } from '@/hooks/useDirectInbox'
import { useDirectConversation } from '@/hooks/useDirectConversation'
import { useAuth } from '@/hooks/useAuth'
import * as Icons from 'phosphor-react'
import type { DirectConversationParticipant } from '@/lib/direct/types'

export default function DirectMessagesLayout() {
  const { user } = useAuth()
  const {
    conversations,
    requests,
    isLoading: inboxLoading,
    startConversation,
    acceptRequest,
    declineRequest,
    markConversationRead,
    refresh
  } = useDirectInbox()

  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isRequestsOpen, setIsRequestsOpen] = useState(false)
  const [isRequestsCollapsed, setIsRequestsCollapsed] = useState(false)
  const [isNewConversationOpen, setIsNewConversationOpen] = useState(false)

  useEffect(() => {
    if (!selectedConversationId && conversations.length > 0) {
      setSelectedConversationId(conversations[0].id)
    }
  }, [conversations, selectedConversationId])

  const {
    messages,
    isLoading: messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    typingUsers,
    sendMessage,
    isMessageSending,
    sendTypingIndicator,
    toggleReaction,
    deleteMessage,
    markConversationRead: markReadViaSocket
  } = useDirectConversation({ conversationId: selectedConversationId, enabled: Boolean(selectedConversationId) })

  // Auto-refresh messages every 3 seconds for active conversation
  useEffect(() => {
    if (!selectedConversationId) return

    const interval = setInterval(() => {
      refresh()
    }, 3000)

    return () => clearInterval(interval)
  }, [selectedConversationId, refresh])

  useEffect(() => {
    if (selectedConversationId) {
      void markConversationRead(selectedConversationId)
      void markReadViaSocket()
    }
  }, [selectedConversationId, markConversationRead, markReadViaSocket])

  const selectedConversation = useMemo(
    () => conversations.find((convo) => convo.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  )

  const handleSendMessage = async (content: string) => {
    try {
      await sendMessage(content)
      await refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible d\'envoyer le message'
      setActionError(message)
    }
  }

  const handleDeleteMessage = async (messageId: string) => {
    try {
      await deleteMessage(messageId)
      await refresh()
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de supprimer le message'
      setActionError(message)
    }
  }

  const handleToggleReaction = async (messageId: string, emoji: string) => {
    try {
      await toggleReaction(messageId, emoji)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de mettre à jour la réaction'
      setActionError(message)
    }
  }

  const handleStartConversation = async (payload: { recipient_auth_id: string; initial_message: string }) => {
    const conversation = await startConversation(payload)
    setSelectedConversationId(conversation.id)
    await refresh()
  }

  const isDisabled = !selectedConversation || inboxLoading

  const handleConversationSelect = useCallback((id: string) => {
    setSelectedConversationId(id)
    setActionError(null)
    setIsSidebarOpen(false)
    setIsRequestsOpen(false)
  }, [])

  return (
    <div className="flex h-[calc(100vh-120px)] mt-4 sm:mt-6 rounded-xl sm:rounded-2xl border border-[#B794F4] bg-[#1e1e1e] overflow-hidden relative">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden absolute top-3 left-3 z-50 p-2 rounded-lg bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200"
      >
        <Icons.List size={20} weight="bold" />
      </button>

      {/* Mobile Requests Button */}
      <button
        onClick={() => setIsRequestsOpen(!isRequestsOpen)}
        className="lg:hidden absolute top-3 right-3 z-50 p-2 rounded-lg bg-purple-400/10 text-purple-400 hover:bg-purple-400/20 transition-all duration-200 flex items-center gap-1"
      >
        <Icons.UserPlus size={20} weight="bold" />
        {requests.length > 0 && (
          <span className="bg-purple-400 text-white text-[10px] rounded-full px-1.5 py-0.5 min-w-[18px] text-center font-semibold">
            {requests.length}
          </span>
        )}
      </button>

      {/* Conversations Sidebar - Desktop & Mobile */}
      <div className={`
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        absolute lg:relative
        w-full sm:w-80 lg:w-80
        h-full
        z-40
        transition-transform duration-300 ease-in-out
        bg-[#1e1e1e] lg:bg-transparent
        border-r border-[#B794F4]/20
      `}>
        <ConversationList
          conversations={conversations}
          currentUserAuthId={user?.id ?? null}
          selectedConversationId={selectedConversationId}
          onSelect={handleConversationSelect}
          onCompose={() => setIsNewConversationOpen(true)}
        />
      </div>

      {/* Requests Panel - Desktop & Mobile */}
      <div className={`
        ${isRequestsOpen ? 'translate-x-0' : 'translate-x-full'}
        lg:translate-x-0
        absolute lg:relative
        right-0 lg:right-auto
        w-full sm:w-80 lg:w-80
        h-full
        z-40
        transition-transform duration-300 ease-in-out
        border-l lg:border-l-0 lg:border-r border-[#B794F4]/20
        bg-[#1e1e1e] lg:bg-[#1e1e1e]/50
        p-3 sm:p-4
        space-y-4
        overflow-y-auto
      `}>
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold">
              Demandes {requests.length > 0 && `(${requests.length})`}
            </h3>
            <button
              onClick={() => setIsRequestsCollapsed(!isRequestsCollapsed)}
              className="p-1.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-200"
              title={isRequestsCollapsed ? 'Développer' : 'Réduire'}
            >
              <Icons.CaretDown
                size={16}
                weight="bold"
                className={`transform transition-transform duration-200 ${isRequestsCollapsed ? '-rotate-90' : ''}`}
              />
            </button>
          </div>
          {!isRequestsCollapsed && (
            <RequestsList
              requests={requests}
              currentUserAuthId={user?.id ?? null}
              onAccept={async (conversationId) => {
                try {
                  await acceptRequest(conversationId)
                  setSelectedConversationId(conversationId)
                  setIsRequestsOpen(false)
                  await refresh()
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'Impossible d\'accepter la demande'
                  setActionError(message)
                }
              }}
              onDecline={async (conversationId) => {
                try {
                  await declineRequest(conversationId)
                  await refresh()
                } catch (error) {
                  const message = error instanceof Error ? error.message : 'Impossible de refuser la demande'
                  setActionError(message)
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {(isSidebarOpen || isRequestsOpen) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => {
            setIsSidebarOpen(false)
            setIsRequestsOpen(false)
          }}
        />
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat Header */}
        <div className="p-3 sm:p-4 lg:p-6 border-b border-[#B794F4]/20 flex items-center justify-between bg-[#1e1e1e]/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 pl-12 lg:pl-0">
            <div className="hidden sm:flex w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-purple-400/10 items-center justify-center flex-shrink-0">
              <Icons.ChatCircle size={18} weight="duotone" className="text-purple-400 sm:w-5 sm:h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-semibold truncate text-sm sm:text-base">
                {selectedConversation ? (
                  selectedConversation.is_group
                    ? selectedConversation.topic || 'Conversation de groupe'
                    : selectedConversation.participants.find(
                        (participant: DirectConversationParticipant) =>
                          participant.auth_id !== user?.id
                      )?.display_name || 'Conversation'
                ) : (
                  'Sélectionnez une conversation'
                )}
              </h2>
              {selectedConversation && selectedConversation.unread_count > 0 && (
                <p className="text-xs text-gray-500">
                  {selectedConversation.unread_count} message{selectedConversation.unread_count > 1 ? 's' : ''} non lu{selectedConversation.unread_count > 1 ? 's' : ''}
                </p>
              )}
            </div>
          </div>

          {selectedConversationId && (
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <button
                onClick={() => refresh()}
                className="p-1.5 sm:p-2 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-200"
                title="Actualiser"
              >
                <Icons.ArrowsClockwise size={18} weight="bold" className="sm:w-5 sm:h-5" />
              </button>
              {selectedConversation && selectedConversation.unread_count > 0 && (
                <button
                  onClick={() => selectedConversationId && markConversationRead(selectedConversationId)}
                  className="hidden sm:flex px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs uppercase tracking-wider text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all duration-200 font-semibold"
                  disabled={!selectedConversationId}
                >
                  Marquer lu
                </button>
              )}
            </div>
          )}
        </div>

        {/* Error Display */}
        {actionError && (
          <div className="px-3 sm:px-4 py-2 sm:py-3 bg-red-500/10 text-xs sm:text-sm text-red-400 border-b border-red-500/20 flex items-center justify-between backdrop-blur-sm">
            <span className="flex items-center gap-2 min-w-0">
              <Icons.WarningCircle size={16} weight="bold" className="flex-shrink-0" />
              <span className="truncate">{actionError}</span>
            </span>
            <button
              onClick={() => setActionError(null)}
              className="text-red-400 hover:text-red-300 transition-colors p-1 rounded hover:bg-red-500/10 flex-shrink-0 ml-2"
            >
              <Icons.X size={16} weight="bold" />
            </button>
          </div>
        )}

        {/* Messages Area */}
        <DirectMessageList
          messages={messages}
          currentUserId={user?.id ?? null}
          onDelete={handleDeleteMessage}
          onReaction={handleToggleReaction}
          onLoadMore={hasNextPage ? fetchNextPage : undefined}
          isLoading={messagesLoading || inboxLoading}
          hasMore={hasNextPage}
          typingUsers={typingUsers}
        />

        {/* Input Area */}
        <div className="border-t border-[#B794F4]/20 bg-[#1e1e1e]/80 backdrop-blur-sm">
          <DirectMessageInput
            onSend={(content) => handleSendMessage(content)}
            onTyping={sendTypingIndicator}
            isDisabled={isDisabled || isMessageSending}
          />
        </div>
      </div>

      {/* New Conversation Panel */}
      <NewConversationPanel
        isOpen={isNewConversationOpen}
        onClose={() => setIsNewConversationOpen(false)}
        onCreate={async (payload) => {
          await handleStartConversation(payload)
          setIsNewConversationOpen(false)
        }}
      />
    </div>
  )
}
