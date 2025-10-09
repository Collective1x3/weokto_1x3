'use client'

import { FormEvent, useState } from 'react'
import { motion } from 'framer-motion'
import {
  EnvelopeSimple,
  ChatCircleDots,
  PaperPlaneTilt,
  CheckCircle,
  Sparkle,
  Lightning,
  Users
} from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'

const contactReasons = [
  {
    icon: Lightning,
    title: 'Questions produit',
    description: 'Découvre comment STAM peut transformer ton approche éducative'
  },
  {
    icon: Users,
    title: 'Intégration entreprise',
    description: 'Besoin d\'un onboarding dédié ou d\'une intégration personnalisée'
  },
  {
    icon: ChatCircleDots,
    title: 'Support & assistance',
    description: 'Une question technique ou besoin d\'aide sur la plateforme'
  }
]

export default function StamContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('sending')

    // Placeholder: brancher sur API dédiée plus tard
    setTimeout(() => {
      setStatus('sent')
    }, 1200)
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-12 px-4 py-8 pb-24 md:px-6 md:py-12 md:pb-12 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-6 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 shadow-sm">
          <Sparkle size={16} weight="bold" className="text-emerald-700" />
          <span className="text-sm font-bold text-emerald-900">Parlons de ton projet</span>
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
          Contacte{' '}
          <span className="text-emerald-700">
            l&apos;équipe STAM
          </span>
        </h1>

        <p className="mx-auto max-w-3xl text-lg font-medium text-gray-600 leading-relaxed md:text-xl">
          Une question sur STAM, une intégration à discuter ou un besoin d&apos;onboarding ?
          On revient vers toi sous 24h.
        </p>
      </motion.header>

      {/* Contact Reasons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid gap-6 md:grid-cols-3"
      >
        {contactReasons.map((reason, index) => (
          <motion.div
            key={reason.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-lg shadow-black/5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/10"
          >
            <div className="mb-4 inline-flex rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50 p-3 shadow-sm transition-transform duration-300 group-hover:scale-110">
              <reason.icon size={28} weight="bold" className="text-emerald-700" />
            </div>
            <h3 className="mb-2 text-lg font-bold text-gray-900">{reason.title}</h3>
            <p className="text-sm font-medium text-gray-600 leading-relaxed">{reason.description}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Form Section */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Side - Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <form onSubmit={handleSubmit} className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-2xl shadow-black/10 sm:p-10">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/30 via-transparent to-teal-50/20 pointer-events-none" />

            <div className="relative space-y-6">
              <div className="space-y-3">
                <label htmlFor="email" className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <EnvelopeSimple size={20} weight="bold" className="text-emerald-700" />
                  Adresse email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10"
                  placeholder="prenom@entreprise.com"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="subject" className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <ChatCircleDots size={20} weight="bold" className="text-emerald-700" />
                  Sujet
                </label>
                <input
                  id="subject"
                  type="text"
                  required
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10"
                  placeholder="Intégration STAM + guilde"
                />
              </div>

              <div className="space-y-3">
                <label htmlFor="message" className="flex items-center gap-2 text-base font-bold text-gray-900">
                  <PaperPlaneTilt size={20} weight="bold" className="text-emerald-700" />
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={6}
                  className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 text-base text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-emerald-300 focus:ring-4 focus:ring-emerald-500/10 focus:shadow-lg focus:shadow-emerald-500/10 resize-none"
                  placeholder="Raconte-nous ton use case et tes besoins..."
                />
              </div>

              {status === 'sent' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border border-emerald-700/20 bg-emerald-50 px-5 py-4"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle size={24} weight="bold" className="mt-0.5 flex-shrink-0 text-emerald-700" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-emerald-900">Message envoyé !</p>
                      <p className="mt-1 text-sm font-medium text-emerald-800">
                        On revient vers toi sous 24h
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={status === 'sending' || status === 'sent'}
                className="group w-full rounded-2xl bg-gray-900 px-6 py-4 text-center text-base font-bold text-white shadow-2xl shadow-gray-900/20 transition-all duration-300 ease-out hover:scale-[1.02] hover:bg-gray-800 hover:shadow-gray-900/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  {status === 'sent' ? (
                    <>
                      <CheckCircle size={20} weight="bold" />
                      Message transmis
                    </>
                  ) : status === 'sending' ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      Envoyer le message
                      <PaperPlaneTilt size={20} weight="bold" className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </div>
          </form>
        </motion.div>

        {/* Right Side - Contact Info & CTA */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="space-y-6"
        >
          {/* Quick Links Card */}
          <div className="rounded-3xl border border-gray-200 bg-gradient-to-br from-emerald-50 via-teal-50 to-white p-8 shadow-xl shadow-black/5">
            <h3 className="mb-6 text-2xl font-bold text-gray-900">Besoin d&apos;aide rapide ?</h3>
            <div className="space-y-4">
              <Link
                href="/stam/blog"
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-md shadow-black/5 transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
                  <ChatCircleDots size={24} weight="bold" className="text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Centre d&apos;aide</p>
                  <p className="text-xs font-medium text-gray-600">Guides et tutoriels</p>
                </div>
              </Link>

              <Link
                href="/stam"
                className="group flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-md shadow-black/5 transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-500/10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-50">
                  <Sparkle size={24} weight="bold" className="text-emerald-700" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Découvrir STAM</p>
                  <p className="text-xs font-medium text-gray-600">En savoir plus</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl shadow-black/5">
            <h3 className="mb-6 text-lg font-bold text-gray-900">Ils nous font confiance</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-3xl font-bold text-gray-900">200+</div>
                <div className="text-sm font-medium text-gray-600">Créateurs actifs</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-emerald-700">10k+</div>
                <div className="text-sm font-medium text-gray-600">Membres</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
