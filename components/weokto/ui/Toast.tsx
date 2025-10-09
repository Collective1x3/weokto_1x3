'use client'

import { useEffect, useState } from 'react'
import { X, CheckCircle, Warning, Info, XCircle } from 'phosphor-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
  onClose: (id: string) => void
}

export function Toast({ id, type, title, message, duration = 5000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Animation d'entrée
    const timer = setTimeout(() => setIsVisible(true), 10)

    // Auto-close après duration
    const closeTimer = duration > 0
      ? setTimeout(() => handleClose(), duration)
      : undefined

    return () => {
      clearTimeout(timer)
      if (closeTimer) clearTimeout(closeTimer)
    }
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(() => {
      onClose(id)
    }, 300)
  }

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={20} weight="fill" className="text-green-400" />
      case 'error':
        return <XCircle size={20} weight="fill" className="text-red-400" />
      case 'warning':
        return <Warning size={20} weight="fill" className="text-amber-400" />
      case 'info':
        return <Info size={20} weight="fill" className="text-blue-400" />
    }
  }

  const getStyles = () => {
    const base = 'rounded-lg border backdrop-blur-sm shadow-xl'
    switch (type) {
      case 'success':
        return `${base} border-green-400/20 bg-green-900/90`
      case 'error':
        return `${base} border-red-400/20 bg-red-900/90`
      case 'warning':
        return `${base} border-amber-400/20 bg-amber-900/90`
      case 'info':
        return `${base} border-blue-400/20 bg-blue-900/90`
    }
  }

  return (
    <div
      className={`${getStyles()} p-4 min-w-[320px] max-w-md transition-all duration-300 ${
        isVisible && !isLeaving
          ? 'translate-x-0 opacity-100'
          : 'translate-x-full opacity-0'
      }`}
    >
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white">{title}</h4>
          {message && (
            <p className="mt-1 text-xs text-gray-300">{message}</p>
          )}
        </div>
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-white transition-colors"
          aria-label="Fermer"
        >
          <X size={16} weight="bold" />
        </button>
      </div>
    </div>
  )
}

// Container pour les toasts
interface ToastContainerProps {
  toasts: ToastData[]
  removeToast: (id: string) => void
}

export interface ToastData {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

export function ToastContainer({ toasts, removeToast }: ToastContainerProps) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={removeToast}
        />
      ))}
    </div>
  )
}

// Hook pour gérer les toasts
export function useToast() {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const addToast = (toast: Omit<ToastData, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    setToasts(prev => [...prev, { ...toast, id }])
    return id
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }

  const showSuccess = (title: string, message?: string) => {
    return addToast({ type: 'success', title, message, duration: 4000 })
  }

  const showError = (title: string, message?: string) => {
    return addToast({ type: 'error', title, message, duration: 6000 })
  }

  const showWarning = (title: string, message?: string) => {
    return addToast({ type: 'warning', title, message, duration: 5000 })
  }

  const showInfo = (title: string, message?: string) => {
    return addToast({ type: 'info', title, message, duration: 5000 })
  }

  return {
    toasts,
    addToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}