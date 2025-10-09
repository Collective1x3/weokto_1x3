'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import * as Icons from 'phosphor-react'

interface DirectMessageInputProps {
  onSend: (message: string) => Promise<void> | void
  onTyping: () => void
  isDisabled?: boolean
}

export default function DirectMessageInput({ onSend, onTyping, isDisabled }: DirectMessageInputProps) {
  const [message, setMessage] = useState('')
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const typingLastSentRef = useRef<number>(0)
  const MAX_TEXTAREA_HEIGHT = 160
  const TYPING_THROTTLE_MS = 2000

  useEffect(() => {
    if (!inputRef.current) return
    const textarea = inputRef.current
    textarea.style.height = 'auto'
    const nextHeight = Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)
    textarea.style.height = `${nextHeight}px`
  }, [message])

  const handleTyping = () => {
    const now = Date.now()
    const lastTypingSent = typingLastSentRef.current || 0

    if (now - lastTypingSent > TYPING_THROTTLE_MS) {
      onTyping()
      typingLastSentRef.current = now
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      typingLastSentRef.current = 0
    }, 3000)
  }

  const handleSend = async () => {
    const trimmed = message.trim()
    if (!trimmed || isDisabled) return

    await onSend(trimmed)
    setMessage('')
    inputRef.current?.focus()
    if (inputRef.current) {
      inputRef.current.style.height = '40px'
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void handleSend()
    }
  }

  const handleChange = (value: string) => {
    setMessage(value)
    handleTyping()
  }

  return (
    <div className="p-3 lg:p-4">
      <div className="flex gap-2 items-end">
        {/* Attachment Button */}
        <button
          className="p-2.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-200 mb-1"
          disabled={isDisabled}
          title="Joindre un fichier"
        >
          <Icons.Paperclip size={20} weight="bold" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDisabled ? 'Sélectionnez une conversation...' : 'Tapez votre message...'}
            disabled={isDisabled}
            rows={1}
            className="w-full px-4 py-2.5 bg-[#1e1e1e] rounded-lg border border-[#B794F4]/40 text-white placeholder-gray-500 focus:border-[#B794F4] outline-none resize-none min-h-[44px] max-h-[160px] transition-colors duration-200 text-sm"
            style={{ overflowY: 'auto' }}
          />

          {message.length > 1500 && (
            <span className={`absolute bottom-2 right-2 text-xs font-medium ${
              message.length > 2000 ? 'text-red-400' : 'text-gray-500'
            }`}>
              {message.length}/2000
            </span>
          )}
        </div>

        {/* Emoji Button */}
        <button
          className="p-2.5 rounded-lg text-gray-500 hover:text-purple-400 hover:bg-purple-400/10 transition-all duration-200 mb-1"
          disabled={isDisabled}
          title="Ajouter un emoji"
        >
          <Icons.Smiley size={20} weight="bold" />
        </button>

        {/* Send Button */}
        <button
          onClick={() => {
            void handleSend()
          }}
          disabled={!message.trim() || isDisabled || message.length > 2000}
          className="px-4 py-2.5 rounded-lg bg-purple-400 text-white font-semibold hover:bg-purple-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg shadow-purple-400/20 mb-1"
        >
          <Icons.PaperPlaneTilt size={18} weight="fill" />
          <span className="hidden lg:inline">Envoyer</span>
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <Icons.Command size={12} weight="bold" />
          <span>+ Enter pour envoyer</span>
        </span>
        {message.length > 0 && (
          <span className="text-gray-500">
            {message.trim().split(/\s+/).length} mot{message.trim().split(/\s+/).length > 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  )
}
