'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import * as Icons from 'phosphor-react'

interface MessageInputProps {
  onSend: (message: string) => void
  onTyping: () => void
  editingMessage?: {
    id: string
    content: string
  } | null
  onCancelEdit?: () => void
  onEdit?: (messageId: string, newContent: string) => void
  isDisabled?: boolean
}

export default function MessageInput({
  onSend,
  onTyping,
  editingMessage,
  onCancelEdit,
  onEdit,
  isDisabled
}: MessageInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingLastSentRef = useRef<number>(0)
  const MAX_TEXTAREA_HEIGHT = 160
  const TYPING_THROTTLE_MS = 2000 // Throttle: max 1 événement toutes les 2 secondes

  // Set edit message content
  useEffect(() => {
    if (editingMessage) {
      setMessage(editingMessage.content)
      inputRef.current?.focus()
    } else {
      setMessage('')
    }
  }, [editingMessage])

  useEffect(() => {
    if (!inputRef.current) return
    const textarea = inputRef.current
    textarea.style.height = 'auto'
    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)
    textarea.style.height = `${nextHeight}px`
  }, [message])

  // Handle typing indicator avec throttling pour réduire les événements Socket.IO
  const handleTyping = () => {
    const now = Date.now()
    const lastTypingSent = typingLastSentRef.current || 0

    // Throttle: envoyer maximum toutes les 2 secondes
    if (now - lastTypingSent > TYPING_THROTTLE_MS) {
      onTyping()
      typingLastSentRef.current = now
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Set new timeout (typing indicator will auto-clear after 3 seconds)
    typingTimeoutRef.current = setTimeout(() => {
      typingLastSentRef.current = 0 // Reset pour permettre nouvel envoi
    }, 3000)
  }

  const handleSend = () => {
    const trimmedMessage = message.trim()
    if (!trimmedMessage || isDisabled) return

    if (editingMessage && onEdit) {
      onEdit(editingMessage.id, trimmedMessage)
    } else {
      onSend(trimmedMessage)
    }

    setMessage('')
    inputRef.current?.focus()
    if (inputRef.current) {
      inputRef.current.style.height = '40px'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    } else if (e.key === 'Escape' && editingMessage) {
      onCancelEdit?.()
    }
  }

  const handleChange = (value: string) => {
    setMessage(value)
    if (!editingMessage) {
      handleTyping()
    }
  }

  return (
    <div className="p-4">
      {editingMessage && (
        <div className="flex items-center gap-2 mb-2 text-sm">
          <Icons.PencilSimple size={16} className="text-[#FFB000]" />
          <span className="text-[#B794F4]/60">Édition du message</span>
          <button
            onClick={onCancelEdit}
            className="ml-auto text-[#B794F4] hover:text-[#FFB000] text-xs"
          >
            Annuler (ESC)
          </button>
        </div>
      )}

      <div className="flex gap-2">
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? 'Sélectionnez un channel...' : 'Tapez votre message...'}
            disabled={isDisabled}
            rows={1}
            className="
              w-full px-3 py-2 bg-black border border-[#B794F4] text-white
              placeholder-[#B794F4]/30 focus:border-[#FFB000] outline-none
              resize-none min-h-[40px] max-h-[160px]
              disabled:opacity-50 disabled:cursor-not-allowed
              font-mono text-sm
            "
            style={{ overflowY: 'auto' }}
          />

          {/* Character count for long messages */}
          {message.length > 1500 && (
            <span className={`absolute bottom-2 right-2 text-xs ${
              message.length > 2000 ? 'text-red-500' : 'text-[#B794F4]/60'
            }`}>
              {message.length}/2000
            </span>
          )}
        </div>

        <button
          onClick={handleSend}
          disabled={!message.trim() || isDisabled || message.length > 2000}
          className="
            px-4 py-2 bg-[#B794F4] text-black font-bold
            hover:bg-[#FFB000] transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
            flex items-center gap-2
          "
        >
          {editingMessage ? (
            <>
              <Icons.Check size={20} weight="bold" />
              ÉDITER
            </>
          ) : (
            <>
              <Icons.PaperPlaneTilt size={20} weight="bold" />
              ENVOYER
            </>
          )}
        </button>
      </div>

      <div className="flex items-center gap-4 mt-2 text-xs text-[#B794F4]/40">
        <span>Shift+Enter pour nouvelle ligne</span>
        {editingMessage && <span>ESC pour annuler</span>}
      </div>
    </div>
  )
}
