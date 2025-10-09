'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'
import { useGuildChat } from '@/hooks/useGuildChat'
import { useChannels } from '@/hooks/useChannels'
import { useAuth } from '@/hooks/useAuth'
import { useGuildModeration } from '@/hooks/useGuildModeration'
import { useGuildSelfRestrictions } from '@/hooks/useGuildSelfRestrictions'
import ChannelList from './chat/ChannelList'
import MessageList from './chat/MessageList'
import MessageInput from './chat/MessageInput'
import OnlineUsers from './chat/OnlineUsers'
import ModerationPanel from './chat/ModerationPanel'
import * as Icons from 'phosphor-react'

export interface GuildChatProps {
  guildId: string
  guildName: string
  viewerRole?: 'MEMBER' | 'SUPPORT' | 'COACH' | 'MODERATOR' | 'ADMIN'
}

export default function GuildChat({ guildId, guildName, viewerRole = 'MEMBER' }: GuildChatProps) {
  const { user } = useAuth()
  const [selectedChannelId, setSelectedChannelId] = useState<string | null>(null)
  const [replyToMessage, setReplyToMessage] = useState<any | null>(null)
  const [editingMessage, setEditingMessage] = useState<any | null>(null)
  const [showSidebar, setShowSidebar] = useState(true)
  const [moderationTarget, setModerationTarget] = useState<{ userId: string; displayName?: string | null } | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const { channels, categories, isLoading: channelsLoading } = useChannels(guildId)
  const canModerate = useMemo(
    () => ['COACH', 'MODERATOR', 'ADMIN'].includes(viewerRole),
    [viewerRole]
  )

  const {
    restrictions,
    applyRestriction,
    liftRestriction
  } = useGuildModeration(guildId)

  const {
    restrictions: selfRestrictions,
    platformBan,
    flags: selfFlags
  } = useGuildSelfRestrictions(guildId)

  const {
    messages,
    isLoading: messagesLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    onlineUsers,
    typingUsers,
    sendMessage,
    isMessageSending,
    sendTypingIndicator,
    toggleReaction,
    editMessage,
    deleteMessage
  } = useGuildChat({
    guildId,
    channelId: selectedChannelId,
    enabled: !!selectedChannelId && !selfFlags.isBlind && !selfFlags.isBanned
  })

  useEffect(() => {
    if (channels.length > 0 && !selectedChannelId) {
      setSelectedChannelId(channels[0].id)
    }
  }, [channels, selectedChannelId])

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!selectedChannelId || !content.trim()) return
      if (selfFlags.isBanned) {
        setErrorMessage('Vous ne pouvez pas envoyer de messages car vous êtes banni.')
        return
      }
      if (selfFlags.isBlind) {
        setErrorMessage('Vous ne pouvez pas envoyer de messages car vous êtes aveuglé dans cette guilde.')
        return
      }
      if (selfFlags.isMuted) {
        setErrorMessage('Vous ne pouvez pas envoyer de messages car vous êtes muet dans cette guilde.')
        return
      }

      void sendMessage(
        {
          content: content.trim(),
          replyToId: replyToMessage?.id
        },
        {
          onSuccess: () => {
            setReplyToMessage(null)
            setErrorMessage(null)
          },
          onError: (err) => {
          setErrorMessage(err.message || "Impossible d'envoyer le message")
          }
        }
      )
    },
    [selectedChannelId, replyToMessage, sendMessage, selfFlags.isBanned, selfFlags.isBlind, selfFlags.isMuted]
  )

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (selfFlags.isBanned || selfFlags.isBlind) {
        setErrorMessage('Action non autorisée dans votre état actuel.')
        return
      }
      void editMessage(messageId, newContent)
        .then(() => {
          setEditingMessage(null)
          setErrorMessage(null)
        })
        .catch((err) => {
          setErrorMessage(err.message || "Impossible de modifier le message")
        })
    },
    [editMessage, selfFlags.isBanned, selfFlags.isBlind]
  )

  const handleDeleteMessage = useCallback(
    (messageId: string) => {
      if (!confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) return
      if (selfFlags.isBanned || selfFlags.isBlind) return
      void deleteMessage(messageId)
        .then(() => {
          setErrorMessage(null)
        })
        .catch((err) => {
          setErrorMessage(err.message || "Impossible de supprimer le message")
        })
    },
    [deleteMessage, selfFlags.isBanned, selfFlags.isBlind]
  )

  const handleModerateRequest = useCallback(
    (payload: { userId: string; displayName?: string | null }) => {
      if (!canModerate) return
      if (payload.userId === user?.id) return
      setModerationTarget(payload)
    },
    [canModerate, user?.id]
  )

  const handleToggleReaction = useCallback(
    (messageId: string, emoji: string) => {
      if (selfFlags.isBanned || selfFlags.isBlind) {
        setErrorMessage('Réactions indisponibles pour votre statut actuel.')
        return
      }
      void toggleReaction(messageId, emoji).catch((err) => {
        setErrorMessage(err instanceof Error ? err.message : 'Impossible de mettre à jour la réaction')
      })
    },
    [selfFlags.isBanned, selfFlags.isBlind, toggleReaction]
  )

  const handleApplyRestriction = useCallback(
    async ({ type, duration_minutes, reason }: { type: 'MUTE' | 'BLIND' | 'BAN'; duration_minutes?: number | null; reason?: string | null }) => {
      if (!moderationTarget) return
      try {
        await applyRestriction({
          target_auth_id: moderationTarget.userId,
          type,
          duration_minutes: duration_minutes ?? undefined,
          reason: reason ?? undefined
        })
      } catch (error) {
        console.error('Failed to apply restriction', error)
        alert("Impossible d'appliquer la sanction. Vérifiez vos droits.")
      }
    },
    [applyRestriction, moderationTarget]
  )

  const handleLiftRestriction = useCallback(
    async ({ type }: { type: 'MUTE' | 'BLIND' | 'BAN' }) => {
      if (!moderationTarget) return
      try {
        await liftRestriction({
          target_auth_id: moderationTarget.userId,
          type
        })
      } catch (error) {
        console.error('Failed to lift restriction', error)
        alert('Impossible de lever la sanction.')
      }
    },
    [liftRestriction, moderationTarget]
  )

  const selectedChannel = channels.find((channel) => channel.id === selectedChannelId)

  const typingNames = useMemo(() => {
    if (typingUsers.size === 0) return [] as string[]

    const names: string[] = []

    Array.from(typingUsers).forEach((userId) => {
      const presence = onlineUsers.get(userId)
      let name: string | undefined = presence?.display_name || presence?.user_metadata?.display_name

      if (!name) {
        const recentMessage = [...messages].reverse().find((message) => message.user_id === userId)
        name = recentMessage?.user?.display_name
      }

      if (!name) {
        name = "Quelqu'un"
      }

      if (!names.includes(name)) {
        names.push(name)
      }
    })

    return names
  }, [typingUsers, onlineUsers, messages])

  const targetRestrictions = useMemo(
    () =>
      moderationTarget
        ? restrictions.filter((item) => item.target_auth_id === moderationTarget.userId)
        : [],
    [moderationTarget, restrictions]
  )

  const guildBan = useMemo(
    () => selfRestrictions.find((item) => item.type === 'BAN'),
    [selfRestrictions]
  )

  const muteRestriction = useMemo(
    () => selfRestrictions.find((item) => item.type === 'MUTE'),
    [selfRestrictions]
  )

  const blindRestriction = useMemo(
    () => selfRestrictions.find((item) => item.type === 'BLIND'),
    [selfRestrictions]
  )

  const statusBanners = useMemo(() => {
    const banners: Array<{ tone: 'error' | 'warning'; message: string }> = []

    if (platformBan) {
      banners.push({
        tone: 'error',
        message: platformBan.reason
          ? `Bannissement plateforme actif. Raison : ${platformBan.reason}`
          : 'Bannissement plateforme actif.'
      })
    }

    if (guildBan) {
      banners.push({
        tone: 'error',
        message: guildBan.reason
          ? `Bannissement guilde actif. Raison : ${guildBan.reason}`
          : 'Bannissement guilde actif.'
      })
    }

    if (!platformBan && !guildBan && selfFlags.isMuted && muteRestriction) {
      banners.push({
        tone: 'warning',
        message: muteRestriction.reason
          ? `Vous êtes actuellement muet. Raison : ${muteRestriction.reason}`
          : 'Vous êtes actuellement muet dans cette guilde.'
      })
    }

    if (!platformBan && selfFlags.isBlind && blindRestriction) {
      banners.push({
        tone: 'warning',
        message: blindRestriction.reason
          ? `Lecture impossible. Raison : ${blindRestriction.reason}`
          : 'Vous ne pouvez pas lire les messages de cette guilde.'
      })
    }

    return banners
  }, [platformBan, guildBan, muteRestriction, blindRestriction, selfFlags.isMuted, selfFlags.isBlind])

  if (channelsLoading) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <Icons.CircleNotch size={32} className="animate-spin text-[#B794F4]" />
      </div>
    )
  }

  if (channels.length === 0) {
    return (
      <div className="flex h-[calc(100vh-120px)] items-center justify-center">
        <div className="text-center">
          <Icons.ChatCircle size={64} className="mx-auto mb-4 text-[#B794F4]/30" />
          <p className="text-[#B794F4]/60 mb-2">Aucun channel disponible</p>
          <p className="text-xs text-[#B794F4]/40">Demandez à un admin de créer des channels</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-120px)] border-2 border-[#B794F4] bg-black/90 relative">
      {showSidebar && (
        <div className="w-64 border-r border-[#B794F4] flex flex-col">
          <div className="p-4 border-b border-[#B794F4]">
            <div className="flex items-center justify-between">
              <h2 className="text-[#FFB000] font-bold text-sm truncate flex items-center gap-2">
                <Icons.Shield size={16} />
                {guildName}
              </h2>
              {canModerate && (
                <Link
                  href={`/supplier/guilds/${guildId}/channels`}
                  className="text-[10px] uppercase tracking-[0.3em] text-[#B794F4] hover:text-[#FFB000]"
                >
                  Gérer
                </Link>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            <ChannelList
              channels={channels}
              categories={categories}
              selectedChannelId={selectedChannelId}
              onChannelSelect={setSelectedChannelId}
              typingUsers={typingUsers}
            />
          </div>
          <div className="border-t border-[#B794F4]">
            <OnlineUsers
              users={onlineUsers}
              canModerate={canModerate}
              onModerate={({ userId }) => handleModerateRequest({ userId })}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-[#B794F4] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="text-[#B794F4] hover:text-[#FFB000] transition-colors"
            >
              <Icons.List size={24} weight="bold" />
            </button>

            {selectedChannel && (
              <div className="flex items-center gap-2">
                <Icons.Hash size={20} className="text-[#FFB000]" />
                <h3 className="text-white font-bold">{selectedChannel.name}</h3>
                {selectedChannel.is_private && (
                  <Icons.Lock size={16} className="text-[#FFB000]" />
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {typingNames.length > 0 && (
              <span className="text-xs text-[#B794F4]/60">
                {(() => {
                  const limited = typingNames.slice(0, 3)
                  const extra = typingNames.length - limited.length
                  const namesText = limited.join(', ') + (extra > 0 ? ` et ${extra} autre${extra > 1 ? 's' : ''}` : '')
                  return `${namesText} ${typingNames.length > 1 ? "sont en train d'écrire..." : "est en train d'écrire..."}`
                })()}
              </span>
            )}
          </div>
        </div>

        {statusBanners.length > 0 && (
          <div className="px-4 space-y-3 mt-4">
            {statusBanners.map((banner, index) => (
              <div
                key={`${banner.message}-${index}`}
                className={`p-3 border text-sm ${
                  banner.tone === 'error'
                    ? 'border-red-500/60 bg-red-500/10 text-red-400'
                    : 'border-[#FFB000]/60 bg-[#FFB000]/10 text-[#FFB000]'
                }`}
              >
                {banner.message}
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {selfFlags.isBlind ? (
            <div className="flex h-full items-center justify-center text-[#B794F4]/60">
              <div className="text-center space-y-2">
                <Icons.EyeSlash size={48} className="mx-auto text-[#FFB000]" />
                <p>{blindRestriction?.reason ? `Accès lecture bloqué : ${blindRestriction.reason}` : 'Vous ne pouvez pas consulter les messages de cette guilde.'}</p>
              </div>
            </div>
          ) : selfFlags.isBanned ? (
            <div className="flex h-full items-center justify-center text-[#EF4444]">
              <div className="text-center space-y-2">
                <Icons.ShieldWarning size={48} className="mx-auto" />
                <p>{guildBan?.reason || platformBan?.reason || 'Vous êtes banni de cette guilde.'}</p>
              </div>
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentUserId={user?.id || ''}
              onReply={setReplyToMessage}
              onEdit={setEditingMessage}
              onDelete={handleDeleteMessage}
              onReaction={handleToggleReaction}
              onLoadMore={() => hasNextPage && !isFetchingNextPage && fetchNextPage()}
              isLoading={messagesLoading}
              hasMore={hasNextPage}
              canModerate={canModerate}
              onModerate={handleModerateRequest}
            />
          )}
        </div>

        <div className="border-t border-[#B794F4]">
          {replyToMessage && (
            <div className="px-4 py-2 bg-black/50 border-b border-[#B794F4]/30 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <Icons.ArrowBendUpLeft size={16} className="text-[#FFB000]" />
                <span className="text-[#B794F4]/60">Réponse à</span>
                <span className="text-white font-bold">{replyToMessage.user?.display_name}</span>
                <span className="text-[#B794F4]/40 truncate max-w-xs">
                  {replyToMessage.content}
                </span>
              </div>
              <button
                onClick={() => setReplyToMessage(null)}
                className="text-[#B794F4] hover:text-[#FFB000]"
              >
                <Icons.X size={16} />
              </button>
            </div>
          )}

          {errorMessage && (
            <div className="px-4 py-2 text-sm text-red-400 bg-red-500/10 border-b border-red-400/30">
              {errorMessage}
            </div>
          )}

          <MessageInput
            onSend={handleSendMessage}
            onTyping={sendTypingIndicator}
            editingMessage={editingMessage}
            onCancelEdit={() => setEditingMessage(null)}
            onEdit={handleEditMessage}
            isDisabled={
              !selectedChannelId ||
              isMessageSending ||
              selfFlags.isMuted ||
              selfFlags.isBlind ||
              selfFlags.isBanned
            }
          />
        </div>
      </div>

      <ModerationPanel
        isOpen={canModerate && Boolean(moderationTarget)}
        onClose={() => setModerationTarget(null)}
        target={moderationTarget}
        restrictions={targetRestrictions.map((restriction) => ({
          id: restriction.id,
          type: restriction.type,
          scope: restriction.scope,
          expires_at: restriction.expires_at,
          created_at: restriction.created_at,
          reason: restriction.reason ?? undefined
        }))}
        onApply={handleApplyRestriction}
        onLift={handleLiftRestriction}
      />
    </div>
  )
}
