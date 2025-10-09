'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkle, Trophy, BookOpen, Megaphone } from '@phosphor-icons/react/dist/ssr'
import { useEffect } from 'react'

interface NavigationOption {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  category?: string | null
}

interface Props {
  isOpen: boolean
  onClose: () => void
  onNavigate: (category: string | null) => void
}

const navigationOptions: NavigationOption[] = [
  {
    id: 'latest',
    title: 'Derniers articles',
    description: 'Tous les derniers posts publiés',
    icon: <Sparkle size={28} weight="duotone" className="text-white" />,
    category: null
  },
  {
    id: 'success-stories',
    title: 'Success Stories',
    description: 'Cas d\'usage et réussites des membres',
    icon: <Trophy size={28} weight="duotone" className="text-white" />,
    category: 'success-stories'
  },
  {
    id: 'guides',
    title: 'Guides',
    description: 'Tutoriels et méthodes pas-à-pas',
    icon: <BookOpen size={28} weight="duotone" className="text-white" />,
    category: 'guides'
  },
  {
    id: 'annonces',
    title: 'Annonces STAM',
    description: 'Updates produit et nouvelles fonctionnalités',
    icon: <Megaphone size={28} weight="duotone" className="text-white" />,
    category: 'annonces'
  }
]

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
}

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.22, 1, 0.36, 1] as any
    }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {
      duration: 0.15,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const cardContainerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

export default function StamBlogNavigationModal({ isOpen, onClose, onNavigate }: Props) {
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  const handleNavigationClick = (category: string | null) => {
    onNavigate(category)
    onClose()

    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8">
            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              role="dialog"
              aria-modal="true"
              aria-labelledby="navigation-modal-title"
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Container */}
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent shadow-2xl shadow-black/40 backdrop-blur-xl">
                {/* Background Effects */}
                <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-white/5 blur-3xl" />

                {/* Header */}
                <div className="relative border-b border-white/10 px-6 py-5 sm:px-8 sm:py-6">
                  <h2
                    id="navigation-modal-title"
                    className="text-2xl font-semibold text-white"
                  >
                    Explorer le blog
                  </h2>
                  <p className="mt-2 text-sm text-white/70">
                    Découvrez nos contenus par catégorie
                  </p>

                  {/* Close Button */}
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-xl p-2 text-white/70 transition-all hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/30 sm:right-6"
                    aria-label="Fermer le modal"
                  >
                    <X size={24} weight="bold" />
                  </button>
                </div>

                {/* Navigation Grid */}
                <motion.div
                  variants={cardContainerVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative grid grid-cols-1 gap-4 p-6 sm:grid-cols-2 sm:gap-5 sm:p-8 lg:grid-cols-4 lg:gap-6"
                >
                  {navigationOptions.map((option) => (
                    <motion.button
                      key={option.id}
                      variants={cardVariants}
                      onClick={() => handleNavigationClick(option.category || null)}
                      whileHover={{
                        scale: 1.03,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.98 }}
                      className="group relative flex flex-col items-start gap-4 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent p-6 text-left transition-all duration-300 hover:border-white/30 hover:bg-white/[0.07] hover:shadow-xl hover:shadow-white/10 focus:outline-none focus:ring-2 focus:ring-white/30 sm:min-h-[180px]"
                    >
                      {/* Icon Container */}
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-sm transition-transform duration-300 group-hover:scale-110">
                        {option.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 space-y-2">
                        <h3 className="text-lg font-semibold text-white transition-colors group-hover:text-white/90">
                          {option.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-white/70">
                          {option.description}
                        </p>
                      </div>

                      {/* Hover Effect Gradient */}
                      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-white/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    </motion.button>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
