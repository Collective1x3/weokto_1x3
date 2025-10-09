'use client'

import { useState } from 'react'
import * as Icons from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'

interface PartnerFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function PartnerFormModal({ isOpen, onClose }: PartnerFormModalProps) {
  const [formStep, setFormStep] = useState(1)
  const maxSteps = 3
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const [formData, setFormData] = useState({
    // Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    companyName: '',
    website: '',
    // Business
    communitiesCount: '',
    mrrRange: '',
    teamSize: '',
    businessModel: '',
    // Experience
    yearsOperating: '',
    mainPlatform: '',
    contentType: '',
    averageTicket: '',
    // Motivation
    whyPartner: '',
    growthGoals: '',
    biggestChallenge: '',
    // Additional
    referralSource: '',
    additionalNotes: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Format d\'email invalide')
      setIsSubmitting(false)
      return
    }

    try {
      const response = await fetch('/api/partner-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setErrorMessage(data.error || 'Une erreur est survenue')
        setIsSubmitting(false)
        return
      }

      setShowSuccessMessage(true)
      setTimeout(() => {
        onClose()
        setShowSuccessMessage(false)
        setFormStep(1)
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          companyName: '',
          website: '',
          communitiesCount: '',
          mrrRange: '',
          teamSize: '',
          businessModel: '',
          yearsOperating: '',
          mainPlatform: '',
          contentType: '',
          averageTicket: '',
          whyPartner: '',
          growthGoals: '',
          biggestChallenge: '',
          referralSource: '',
          additionalNotes: ''
        })
      }, 5000)

    } catch (error) {
      console.error('Error submitting form:', error)
      setErrorMessage('Erreur de connexion. Veuillez réessayer.')
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (formStep < maxSteps) setFormStep(formStep + 1)
  }

  const prevStep = () => {
    if (formStep > 1) setFormStep(formStep - 1)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose()
          }}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto border-2 border-[#B794F4] bg-black"
          >
            {/* Terminal Header */}
            <div className="border-b-2 border-[#B794F4] p-3 flex items-center justify-between bg-black">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#FF5F56]" />
                <div className="w-3 h-3 bg-[#FFBD2E]" />
                <div className="w-3 h-3 bg-[#27C93F]" />
              </div>
              <div className="text-xs font-mono text-[#FFB000]">PARTNER_APPLICATION</div>
              <button
                onClick={onClose}
                className="px-2 py-1 text-xs font-mono text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all"
              >
                [X]
              </button>
            </div>

            {/* Header with progress */}
            <div className="p-6 border-b border-[#B794F4]/30">
              <h2 className="text-xl font-mono font-bold text-[#FFB000] mb-2">
                {'>'} DEVENIR PARTENAIRE WEOKTO
              </h2>
              <p className="text-xs font-mono text-gray-400 mb-4">
                REJOIGNEZ L'ÉCOSYSTÈME DES MEILLEURS FOURNISSEURS
              </p>

              {/* Progress bar */}
              <div className="flex gap-2">
                {[...Array(maxSteps)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 transition-colors ${
                      i < formStep ? 'bg-[#FFB000]' : 'bg-gray-700'
                    }`}
                  />
                ))}
              </div>
              <div className="text-xs font-mono text-[#B794F4] mt-2">
                ÉTAPE {formStep}/{maxSteps}
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {showSuccessMessage ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                    className="text-6xl mb-6 text-[#FFB000]"
                  >
                    ✓
                  </motion.div>
                  <h3 className="text-xl font-mono font-bold text-[#FFB000] mb-4">
                    [CANDIDATURE ENVOYÉE]
                  </h3>
                  <p className="text-sm font-mono text-white mb-6 max-w-md mx-auto">
                    NOUS AVONS BIEN REÇU VOTRE CANDIDATURE.
                    <br />
                    NOTRE ÉQUIPE VOUS CONTACTERA SOUS 48H.
                  </p>
                  <div className="border border-[#B794F4]/50 bg-[#B794F4]/10 p-4 max-w-md mx-auto">
                    <p className="text-xs font-mono text-[#B794F4]">
                      {'>'} PRÉPAREZ VOS MÉTRIQUES POUR NOTRE APPEL
                    </p>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Step 1: Contact & Company */}
                  {formStep === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="text-sm font-mono font-bold text-[#FFB000] mb-4">
                          {'>'} INFORMATIONS DE CONTACT
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">PRÉNOM *</label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">NOM *</label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">EMAIL *</label>
                            <input
                              type="email"
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                              pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">TÉLÉPHONE</label>
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                              placeholder="+33..."
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-mono font-bold text-[#FFB000] mb-4">
                          {'>'} VOTRE ENTREPRISE
                        </h3>

                        <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">NOM DE L'ENTREPRISE *</label>
                            <input
                              type="text"
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">SITE WEB</label>
                            <input
                              type="url"
                              name="website"
                              value={formData.website}
                              onChange={handleInputChange}
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                              placeholder="https://..."
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Business Metrics */}
                  {formStep === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-mono font-bold text-[#FFB000] mb-4">
                        {'>'} MÉTRIQUES BUSINESS
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            NOMBRE DE COMMUNAUTÉS *
                          </label>
                          <input
                            type="number"
                            name="communitiesCount"
                            value={formData.communitiesCount}
                            onChange={handleInputChange}
                            required
                            min="0"
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">MRR ACTUEL *</label>
                          <select
                            name="mrrRange"
                            value={formData.mrrRange}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm focus:outline-none focus:border-[#B794F4]"
                          >
                            <option value="">[SÉLECTIONNER]</option>
                            <option value="0-50k">€0 - €50K</option>
                            <option value="50k-100k">€50K - €100K</option>
                            <option value="100k-250k">€100K - €250K</option>
                            <option value="250k-500k">€250K - €500K</option>
                            <option value="500k-1M">€500K - €1M</option>
                            <option value="1M+">€1M+</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">TAILLE DE L'ÉQUIPE *</label>
                          <select
                            name="teamSize"
                            value={formData.teamSize}
                            onChange={handleInputChange}
                            required
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm focus:outline-none focus:border-[#B794F4]"
                          >
                            <option value="">[SÉLECTIONNER]</option>
                            <option value="1">SOLO</option>
                            <option value="2-5">2-5 PERSONNES</option>
                            <option value="6-10">6-10 PERSONNES</option>
                            <option value="11-25">11-25 PERSONNES</option>
                            <option value="26-50">26-50 PERSONNES</option>
                            <option value="50+">50+ PERSONNES</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">MODÈLE ÉCONOMIQUE *</label>
                          <input
                            type="text"
                            name="businessModel"
                            value={formData.businessModel}
                            onChange={handleInputChange}
                            required
                            placeholder="ABONNEMENT, FORMATION, HYBRIDE..."
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">ANNÉES D'ACTIVITÉ</label>
                            <input
                              type="number"
                              name="yearsOperating"
                              value={formData.yearsOperating}
                              onChange={handleInputChange}
                              min="0"
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">TICKET MOYEN</label>
                            <input
                              type="text"
                              name="averageTicket"
                              value={formData.averageTicket}
                              onChange={handleInputChange}
                              placeholder="€XXX"
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">PLATEFORME</label>
                            <input
                              type="text"
                              name="mainPlatform"
                              value={formData.mainPlatform}
                              onChange={handleInputChange}
                              placeholder="STAN, WHOP..."
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-mono text-[#B794F4] mb-2">TYPE DE CONTENU *</label>
                            <input
                              type="text"
                              name="contentType"
                              value={formData.contentType}
                              onChange={handleInputChange}
                              required
                              placeholder="TRADING, CRYPTO..."
                              className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Motivation */}
                  {formStep === 3 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-6"
                    >
                      <h3 className="text-sm font-mono font-bold text-[#FFB000] mb-4">
                        {'>'} VOS OBJECTIFS
                      </h3>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            POURQUOI WEOKTO ? *
                          </label>
                          <textarea
                            name="whyPartner"
                            value={formData.whyPartner}
                            onChange={handleInputChange}
                            required
                            rows={3}
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4] resize-none"
                            placeholder="QU'EST-CE QUI VOUS ATTIRE..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            OBJECTIFS 12 MOIS
                          </label>
                          <textarea
                            name="growthGoals"
                            value={formData.growthGoals}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4] resize-none"
                            placeholder="OÙ VOULEZ-VOUS ÊTRE..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            DÉFI PRINCIPAL
                          </label>
                          <textarea
                            name="biggestChallenge"
                            value={formData.biggestChallenge}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4] resize-none"
                            placeholder="VOS BLOCAGES ACTUELS..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            SOURCE
                          </label>
                          <input
                            type="text"
                            name="referralSource"
                            value={formData.referralSource}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4]"
                            placeholder="COMMENT NOUS AVEZ-VOUS TROUVÉ..."
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-mono text-[#B794F4] mb-2">
                            NOTES
                          </label>
                          <textarea
                            name="additionalNotes"
                            value={formData.additionalNotes}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-3 py-2 bg-black border border-[#B794F4]/30 text-white font-mono text-sm placeholder-gray-600 focus:outline-none focus:border-[#B794F4] resize-none"
                            placeholder="INFORMATIONS COMPLÉMENTAIRES..."
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <div className="flex justify-between items-center pt-4 border-t border-[#B794F4]/30">
                    <button
                      type="button"
                      onClick={prevStep}
                      className={`px-4 py-2 text-xs font-mono text-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all ${
                        formStep === 1 ? 'invisible' : ''
                      }`}
                    >
                      [← RETOUR]
                    </button>

                    {formStep < maxSteps ? (
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-4 py-2 bg-[#FFB000] text-black text-xs font-mono font-bold hover:bg-[#FFB000]/80 transition-all"
                      >
                        [SUIVANT →]
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-[#FFB000] text-black text-xs font-mono font-bold hover:bg-[#FFB000]/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? '[ENVOI...]' : '[ENVOYER CANDIDATURE]'}
                      </button>
                    )}
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-3 border border-red-500/50 bg-red-500/10"
                    >
                      <p className="text-xs font-mono text-red-400">
                        {'>'} ERREUR: {errorMessage}
                      </p>
                    </motion.div>
                  )}
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}