'use client'

import { useState, useRef, useEffect, memo, useMemo } from 'react'
import * as Icons from 'phosphor-react'
import DOMPurify from 'isomorphic-dompurify'

interface MessageProps {
  message: {
    id: string
    user_id: string
    content: string
    user?: {
      auth_id: string
      display_name?: string
      avatar_url?: string
    }
    created_at: string
    edited_at?: string
    reactions?: Array<{
      user_id: string
      emoji: string
    }>
    reply_to?: {
      content: string
      user?: {
        display_name?: string
      }
    }
  }
  isOwn: boolean
  showAvatar: boolean
  currentUserId: string
  onReply: () => void
  onEdit: () => void
  onDelete: () => void
  onReaction: (emoji: string) => void
  canModerate?: boolean
  onModerate?: (payload: { userId: string; displayName?: string | null }) => void
}

// Réduit à 5 emojis comme demandé
const QUICK_REACTIONS = ['👍', '❤️', '😂', '🔥', '👀']

const Message = memo(function Message({
  message,
  isOwn,
  showAvatar,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onReaction,
  canModerate,
  onModerate
}: MessageProps) {
  const [showActions, setShowActions] = useState(false)
  const [showReactionPicker, setShowReactionPicker] = useState(false)
  // Ref pour calculer la position intelligente du picker de réactions
  const reactionButtonRef = useRef<HTMLButtonElement>(null)
  const [reactionPickerPosition, setReactionPickerPosition] = useState<'top' | 'bottom'>('top')

  const time = new Date(message.created_at).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit'
  })

  // Calcul intelligent de la position du picker de réactions
  // Évite qu'il sorte de l'écran en haut ou en bas
  useEffect(() => {
    if (showReactionPicker && reactionButtonRef.current) {
      const buttonRect = reactionButtonRef.current.getBoundingClientRect()
      const pickerHeight = 48 // Hauteur approximative du picker (p-2 + h-8 des boutons)
      const spaceAbove = buttonRect.top
      const spaceBelow = window.innerHeight - buttonRect.bottom

      // Si pas assez d'espace en haut (< 60px), on affiche en bas
      if (spaceAbove < 60 && spaceBelow > pickerHeight) {
        setReactionPickerPosition('bottom')
      } else {
        setReactionPickerPosition('top')
      }
    }
  }, [showReactionPicker])

  // Group reactions by emoji - Mémorisé pour éviter recalculs inutiles
  const reactionGroups = useMemo(() => {
    return message.reactions?.reduce((acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = []
      }
      acc[reaction.emoji].push(reaction.user_id)
      return acc
    }, {} as Record<string, string[]>) || {}
  }, [message.reactions])

  const spacingClass = showAvatar ? '' : isOwn ? 'pr-14' : 'pl-14'
  // AMÉLIORATION: Hover plus visible (5% -> 8%), padding augmenté pour respiration, transition fluide sur toutes propriétés
  const wrapperClasses = `group flex gap-3 hover:bg-[#B794F4]/8 px-3 py-2 -mx-3 rounded-lg transition-all duration-200 ${spacingClass} ${isOwn ? 'flex-row-reverse text-right' : ''}`
  const displayName = message.user?.display_name || (isOwn ? 'Vous' : 'Membre')
  const showHeader = showAvatar || isOwn
  // AMÉLIORATION: Contraste amélioré, padding augmenté, ombre subtile pour profondeur, bordure réactive au hover
  const bubbleClasses = `max-w-[75%] rounded-xl border-2 px-4 py-3 whitespace-pre-wrap shadow-sm transition-all duration-200 ${
    isOwn
      ? 'bg-[#FFB000]/20 border-[#FFB000]/50 text-white group-hover:border-[#FFB000]/70 group-hover:shadow-[#FFB000]/10 group-hover:shadow-md'
      : 'bg-black/70 border-[#B794F4]/30 text-white group-hover:border-[#B794F4]/50 group-hover:shadow-[#B794F4]/10 group-hover:shadow-md'
  }`

  return (
    <div
      className={wrapperClasses}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => {
        setShowActions(false)
        setShowReactionPicker(false)
      }}
    >
      {/* Avatar - AMÉLIORATION: Bordure plus épaisse, ombre pour profondeur, transition au hover */}
      {showAvatar && (
        <div className="w-10 h-10 flex-shrink-0">
          {message.user?.avatar_url ? (
            <img
              src={message.user.avatar_url}
              alt={message.user.display_name}
              className="w-10 h-10 rounded-full border-2 border-[#B794F4]/60 shadow-lg shadow-[#B794F4]/20 transition-transform duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#B794F4]/25 border-2 border-[#B794F4]/60 flex items-center justify-center shadow-lg shadow-[#B794F4]/20 transition-transform duration-200 group-hover:scale-105">
              <span className="text-[#FFB000] font-bold text-sm">
                {message.user?.display_name?.[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className={`flex-1 min-w-0 flex flex-col gap-1 ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Header - AMÉLIORATION: Hiérarchie visuelle renforcée (nom plus grand), métadonnées plus lisibles (40% -> 60%) */}
        {showHeader && (
          <div className={`flex items-baseline gap-2.5 mb-1.5 ${isOwn ? 'flex-row-reverse text-right' : ''}`}>
            <span className="font-bold text-[#FFB000] text-[15px] tracking-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-[#B794F4]/60 font-mono">{time}</span>
            {message.edited_at && (
              <span className="text-[11px] text-[#B794F4]/50 italic">(édité)</span>
            )}
          </div>
        )}

        {/* Reply indicator - AMÉLIORATION: Background pour meilleure visibilité, padding, bordure subtile */}
        {message.reply_to && (
          <div className={`flex items-center gap-2 text-xs text-[#B794F4]/70 mb-2 px-3 py-1.5 rounded-lg bg-[#B794F4]/5 border border-[#B794F4]/20 ${isOwn ? 'justify-end flex-row-reverse' : ''}`}>
            <Icons.ArrowBendUpLeft size={12} className="text-[#FFB000]" />
            <span className="font-medium">@{message.reply_to.user?.display_name}</span>
            <span className="truncate max-w-xs opacity-70">
              {message.reply_to.content}
            </span>
          </div>
        )}

        {/* Message content - Sanitisé contre XSS avec DOMPurify */}
        <div
          className={bubbleClasses}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(message.content, {
              ALLOWED_TAGS: [], // Texte brut uniquement, aucun HTML
              ALLOWED_ATTR: [],
              KEEP_CONTENT: true
            })
          }}
        />

        {/* Reactions - AMÉLIORATION: Taille minimale 44x44px (WCAG), gap augmenté, hover plus visible, scale au hover */}
        {Object.keys(reactionGroups).length > 0 && (
          <div className={`flex flex-wrap gap-2 mt-2 ${isOwn ? 'justify-end' : ''}`}>
            {Object.entries(reactionGroups).map(([emoji, userIds]) => (
              <button
                key={emoji}
                onClick={() => onReaction(emoji)}
                className={`
                  min-w-[44px] min-h-[44px] px-3 py-2 text-sm rounded-full border-2 transition-all duration-200
                  flex items-center justify-center gap-1.5 font-medium
                  hover:scale-110 active:scale-95 shadow-sm
                  ${userIds.includes(currentUserId)
                    ? 'bg-[#B794F4]/25 border-[#B794F4] text-[#FFB000] hover:bg-[#B794F4]/35 hover:shadow-[#B794F4]/20 hover:shadow-md'
                    : 'bg-black/60 border-[#B794F4]/30 text-white hover:border-[#B794F4]/60 hover:bg-black/70 hover:shadow-[#B794F4]/10 hover:shadow-md'}
                `}
                aria-label={`Réaction ${emoji} : ${userIds.length} personne${userIds.length > 1 ? 's' : ''}`}
              >
                <span className="text-base leading-none">{emoji}</span>
                <span className="text-xs leading-none">{userIds.length}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Actions - AMÉLIORATION: Transition plus fluide, boutons plus grands (44x44px), hover plus visible */}
      {/* Positionnées intelligemment selon isOwn */}
      {/* Pour messages propres (droite) : actions à droite du message */}
      {/* Pour messages des autres (gauche) : actions à gauche du message */}
      {showActions && (
        <div
          className={`flex items-start gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 ${
            isOwn ? 'flex-row' : 'flex-row-reverse'
          }`}
        >
          {/* Quick reactions */}
          <div className="relative">
            <button
              ref={reactionButtonRef}
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="w-8 h-8 flex items-center justify-center text-[#B794F4]/60 hover:text-[#FFB000] hover:bg-[#B794F4]/10 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95"
              aria-label="Ajouter une réaction"
            >
              <Icons.Smiley size={18} weight={showReactionPicker ? "fill" : "regular"} />
            </button>

            {/* Picker de réactions - AMÉLIORATION: Ombre plus prononcée, backdrop blur, animation d'apparition */}
            {/* Position adaptative : en haut par défaut, en bas si trop proche du haut de l'écran */}
            {showReactionPicker && (
              <div
                className={`
                  absolute z-20 bg-black/95 backdrop-blur-sm border-2 border-[#B794F4]/60 rounded-xl p-2.5 flex gap-2
                  shadow-2xl shadow-[#B794F4]/30 animate-in fade-in slide-in-from-top-2 duration-200
                  ${reactionPickerPosition === 'top'
                    ? 'bottom-full mb-2'
                    : 'top-full mt-2'
                  }
                  ${isOwn ? 'right-0' : 'left-0'}
                `}
                style={{
                  // S'assure que le picker reste dans le viewport
                  minWidth: 'fit-content'
                }}
              >
                {QUICK_REACTIONS.map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      onReaction(emoji)
                      setShowReactionPicker(false)
                    }}
                    className="w-10 h-10 hover:bg-[#B794F4]/25 rounded-lg flex items-center justify-center transition-all duration-150 text-xl hover:scale-125 active:scale-95"
                    aria-label={`Réagir avec ${emoji}`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={onReply}
            className="w-8 h-8 flex items-center justify-center text-[#B794F4]/60 hover:text-[#FFB000] hover:bg-[#B794F4]/10 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95"
            aria-label="Répondre"
          >
            <Icons.ArrowBendUpLeft size={18} />
          </button>

          {/* Actions spécifiques aux messages propres */}
          {isOwn && (
            <>
              <button
                onClick={onEdit}
                className="w-8 h-8 flex items-center justify-center text-[#B794F4]/60 hover:text-[#FFB000] hover:bg-[#B794F4]/10 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95"
                aria-label="Éditer"
              >
                <Icons.PencilSimple size={18} />
              </button>
              <button
                onClick={onDelete}
                className="w-8 h-8 flex items-center justify-center text-red-500/60 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95"
                aria-label="Supprimer"
              >
                <Icons.Trash size={18} />
              </button>
            </>
          )}

          {/* Action de modération pour les messages des autres */}
          {!isOwn && canModerate && onModerate && (
            <button
              onClick={() => onModerate({ userId: message.user_id, displayName: message.user?.display_name })}
              className="w-8 h-8 flex items-center justify-center text-[#B794F4]/60 hover:text-[#FFB000] hover:bg-[#B794F4]/10 rounded-lg transition-all duration-150 hover:scale-110 active:scale-95"
              aria-label="Modérer"
            >
              <Icons.Shield size={18} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  // Comparaison personnalisée pour éviter re-renders inutiles
  return (
    prevProps.message.id === nextProps.message.id &&
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.edited_at === nextProps.message.edited_at &&
    JSON.stringify(prevProps.message.reactions) === JSON.stringify(nextProps.message.reactions) &&
    prevProps.isOwn === nextProps.isOwn &&
    prevProps.showAvatar === nextProps.showAvatar &&
    prevProps.currentUserId === nextProps.currentUserId &&
    prevProps.canModerate === nextProps.canModerate
  )
})

export default Message
