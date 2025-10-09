'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  User,
  EnvelopeSimple,
  PencilSimple,
  Check,
  X,
  Calendar,
  Sparkle,
  Shield,
  Crown
} from '@phosphor-icons/react/dist/ssr'
import { useUserSession } from '@/contexts/UserSessionContext'
import Link from 'next/link'

export default function StamProfilPage() {
  const { user, setUser: setSessionUser } = useUserSession()
  const [isEditingName, setIsEditingName] = useState(false)
  const [isEditingBio, setIsEditingBio] = useState(false)
  const [editedName, setEditedName] = useState(user?.displayName || '')
  const [editedBio, setEditedBio] = useState(user?.bio || '')
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveProfile = async (displayName: string, bio: string) => {
    const trimmedName = displayName.trim()
    if (!trimmedName) return false

    setIsSaving(true)
    try {
      const response = await fetch('/api/auth/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: trimmedName, bio: bio.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setSessionUser((prev) => {
          if (!prev) {
            return {
              id: data.user.id,
              email: data.user.email,
              displayName: data.user.displayName ?? null,
              bio: data.user.bio ?? null,
              publicSlug: data.user.publicSlug ?? null,
              guildId: null,
              userType: null,
              createdAt: null,
              lastLoginAt: null,
              profileSectionsOrder: null
            }
          }
          return {
            ...prev,
            displayName: data.user.displayName ?? prev.displayName,
            bio: data.user.bio ?? prev.bio,
            publicSlug: data.user.publicSlug ?? prev.publicSlug
          }
        })
        setEditedName(data.user.displayName || '')
        setEditedBio(data.user.bio || '')
        return true
      }
    } catch (error) {
      console.error('Error saving profile:', error)
    } finally {
      setIsSaving(false)
    }
    return false
  }

  const handleNameSubmit = async () => {
    const success = await handleSaveProfile(editedName, editedBio)
    if (success) setIsEditingName(false)
  }

  const handleBioSubmit = async () => {
    const success = await handleSaveProfile(editedName, editedBio)
    if (success) setIsEditingBio(false)
  }

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-600" />
          <p className="text-sm font-medium text-gray-600">Chargement du profil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-12">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6 md:py-12 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 space-y-2"
        >
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl">
            Mon profil
          </h1>
          <p className="text-base font-medium text-gray-600 md:text-lg">
            Gérez vos informations personnelles
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-black/10"
          >
            {/* Header with gradient */}
            <div className="relative h-32 overflow-hidden bg-gradient-to-br from-emerald-500 via-teal-500 to-emerald-600 md:h-40">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30" />
            </div>

            {/* Content */}
            <div className="relative px-6 pb-8 pt-4 md:px-8">
              {/* Avatar placeholder */}
              <div className="absolute -top-16 left-6 md:left-8">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-xl shadow-black/10 md:h-32 md:w-32">
                  <User size={48} weight="bold" className="text-emerald-700 md:w-16 md:h-16" />
                </div>
              </div>

              <div className="ml-0 mt-12 space-y-6 md:ml-36 md:mt-4">
                {/* Name Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                    <User size={16} weight="bold" />
                    Nom d&apos;affichage
                  </div>

                  {isEditingName ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNameSubmit()
                          if (e.key === 'Escape') {
                            setIsEditingName(false)
                            setEditedName(user.displayName || '')
                          }
                        }}
                        maxLength={100}
                        autoFocus
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="Votre nom"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleNameSubmit}
                          disabled={isSaving}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
                        >
                          <Check size={16} weight="bold" />
                          {isSaving ? 'Sauvegarde...' : 'Valider'}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingName(false)
                            setEditedName(user.displayName || '')
                          }}
                          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-50"
                        >
                          <X size={16} weight="bold" />
                          Annuler
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="group flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {user.displayName || 'Utilisateur STAM'}
                      </h2>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-emerald-600"
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>

                {/* Bio Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-500">
                    <Sparkle size={16} weight="bold" />
                    Bio
                  </div>

                  {isEditingBio ? (
                    <div className="space-y-3">
                      <textarea
                        value={editedBio}
                        onChange={(e) => setEditedBio(e.target.value)}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') handleBioSubmit()
                          if (e.key === 'Escape') {
                            setIsEditingBio(false)
                            setEditedBio(user.bio || '')
                          }
                        }}
                        rows={3}
                        maxLength={500}
                        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-gray-900 outline-none transition-all focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                        placeholder="Parlez-nous de vous..."
                      />
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">{editedBio.length}/500 caractères</span>
                        <div className="flex gap-2">
                          <button
                            onClick={handleBioSubmit}
                            disabled={isSaving}
                            className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-emerald-700 disabled:opacity-50"
                          >
                            <Check size={16} weight="bold" />
                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
                          </button>
                          <button
                            onClick={() => {
                              setIsEditingBio(false)
                              setEditedBio(user.bio || '')
                            }}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 transition-all hover:border-gray-300 hover:bg-gray-50"
                          >
                            <X size={16} weight="bold" />
                            Annuler
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="group flex items-start gap-3">
                      <p className="flex-1 text-base text-gray-600 leading-relaxed">
                        {user.bio || 'Aucune bio renseignée'}
                      </p>
                      <button
                        onClick={() => setIsEditingBio(true)}
                        className="rounded-lg p-2 text-gray-400 transition-all hover:bg-gray-100 hover:text-emerald-600"
                      >
                        <PencilSimple size={20} weight="bold" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Info Cards Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-black/5 md:p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2">
                <EnvelopeSimple size={20} weight="bold" className="text-emerald-700" />
                <span className="text-sm font-bold uppercase tracking-wide text-emerald-900">Email</span>
              </div>

              <div className="space-y-2">
                <p className="text-base font-medium text-gray-600">Adresse email</p>
                <p className="text-xl font-bold text-gray-900 break-all">{user.email}</p>
                <p className="text-sm text-gray-500">
                  Utilisée pour les connexions et notifications
                </p>
              </div>
            </motion.div>

            {/* Account Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl shadow-black/5 md:p-8"
            >
              <div className="mb-4 inline-flex items-center gap-2 rounded-xl bg-teal-50 px-3 py-2">
                <Calendar size={20} weight="bold" className="text-teal-700" />
                <span className="text-sm font-bold uppercase tracking-wide text-teal-900">Compte</span>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Type de compte</p>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-lg bg-gradient-to-br from-emerald-50 to-teal-50 px-3 py-1.5">
                    <Crown size={18} weight="fill" className="text-emerald-700" />
                    <span className="text-base font-bold text-emerald-900">
                      {user.userType === 'supplier' ? 'Créateur' : 'Membre'}
                    </span>
                  </div>
                </div>

                {user.publicSlug && (
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Profil public</p>
                    <Link
                      href={`/profil/${user.publicSlug}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-bold text-gray-900 shadow-md shadow-black/5 transition-all hover:scale-105 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
                    >
                      <Shield size={16} weight="bold" />
                      Voir mon profil
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Settings Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-xl shadow-black/5 md:p-8"
          >
            <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Paramètres avancés</h3>
                <p className="mt-1 text-sm font-medium text-gray-600">
                  Gérez votre email, sécurité et préférences
                </p>
              </div>
              <Link
                href="/stam/dashboard/settings"
                className="inline-flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition-all hover:scale-105 hover:bg-gray-800"
              >
                Accéder aux paramètres
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
