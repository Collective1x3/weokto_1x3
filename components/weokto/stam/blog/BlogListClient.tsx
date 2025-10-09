'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { BlogPost } from '@/lib/mdx-types'
import { formatDate } from '@/lib/mdx-types'
import Image from 'next/image'
import {
  MagnifyingGlass,
  Hash,
  ArrowRight,
  CalendarBlank,
  Clock,
  BookOpen,
  X,
  Sparkle,
  Trophy,
  Megaphone,
  CaretDown,
  ArrowLeft
} from '@phosphor-icons/react/dist/ssr'

interface Props {
  posts: BlogPost[]
}

interface Category {
  id: string
  label: string
  icon: React.ReactNode
}

const categories: Category[] = [
  {
    id: 'all',
    label: 'Tous',
    icon: <Sparkle size={20} weight="duotone" />
  },
  {
    id: 'guides',
    label: 'Guides pratiques',
    icon: <BookOpen size={20} weight="duotone" />
  },
  {
    id: 'annonces',
    label: 'Annonces produit',
    icon: <Megaphone size={20} weight="duotone" />
  },
  {
    id: 'success-stories',
    label: 'Success Stories',
    icon: <Trophy size={20} weight="duotone" />
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.1,
      duration: 0.3
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

const accordionVariants = {
  collapsed: {
    height: 0,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as any
    }
  },
  expanded: {
    height: 'auto' as any,
    opacity: 1,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as any
    }
  }
}

export default function StamBlogListClient({ posts }: Props) {
  const [category, setCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())

  // Featured and recent posts for hero section
  const featuredPost = posts[0]
  const recentPosts = posts.slice(1, 5)

  // Compute category counts
  const categoryCounts = useMemo(() => {
    return categories.reduce((acc, cat) => {
      acc[cat.id] = cat.id === 'all'
        ? posts.length
        : posts.filter(p => p.category === cat.id).length
      return acc
    }, {} as Record<string, number>)
  }, [posts])

  // Enhanced filtering with search
  const filteredPosts = useMemo(() => {
    let filtered = category === 'all' ? posts : posts.filter(p => p.category === category)

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.excerpt.toLowerCase().includes(query) ||
        p.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    return filtered
  }, [posts, category, searchQuery])

  // Get posts by category for accordion sections
  const getPostsByCategory = (categoryId: string) => {
    return posts.filter(p => p.category === categoryId)
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev)
      if (next.has(categoryId)) {
        next.delete(categoryId)
      } else {
        next.add(categoryId)
      }
      return next
    })
  }

  return (
    <>
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 pb-24 md:space-y-10 md:px-6 md:py-12 md:pb-12 lg:px-8">
        {/* Header with Category Navigation */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold tracking-tight text-stone-900 md:text-5xl lg:text-6xl">
                Le journal STAM
              </h1>
              {/* Back button - Mobile only */}
              <Link
                href="/stam"
                className="md:hidden inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-4 py-2.5 text-sm font-bold text-stone-900 shadow-md shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <ArrowLeft size={16} weight="bold" />
                Retour
              </Link>
            </div>
            <p className="max-w-3xl text-base leading-relaxed text-stone-600 md:text-lg">
              Apprends, construis, progresse.
            </p>
          </div>

          {/* Category Navigation Pills - Desktop only */}
          <div className="hidden flex-wrap gap-3 md:flex">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-bold transition-all duration-300 ${
                  category === cat.id
                    ? 'bg-gradient-to-br from-stone-900 to-stone-800 text-[#FEFDFB] shadow-lg shadow-stone-900/30 scale-105'
                    : 'border border-stone-300 bg-[#FEFDFB] text-stone-900 shadow-md shadow-stone-900/5 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10'
                }`}
              >
                <span className={category === cat.id ? 'text-[#FEFDFB]' : 'text-amber-800'}>
                  {cat.icon}
                </span>
                {cat.label}
                {categoryCounts[cat.id] > 0 && (
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                    category === cat.id
                      ? 'bg-white/20 text-[#FEFDFB]'
                      : 'bg-amber-50 text-amber-800'
                  }`}>
                    {categoryCounts[cat.id]}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <MagnifyingGlass
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              weight="bold"
            />
            <input
              type="search"
              placeholder="Rechercher un article..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-stone-300 bg-white py-3.5 pl-12 pr-4 text-sm text-stone-900 placeholder:text-stone-400 shadow-sm transition-all duration-300 focus:border-amber-500 focus:shadow-lg focus:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* Active Search Indicator */}
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-stone-700 shadow-sm"
            >
              <span>
                {filteredPosts.length} résultat{filteredPosts.length !== 1 ? 's' : ''} pour
                &quot;{searchQuery}&quot;
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="ml-auto text-stone-500 transition hover:text-stone-900"
              >
                <X size={16} weight="bold" />
              </button>
            </motion.div>
          )}
        </motion.header>

        {/* Hero Section - Featured + Recent Posts */}
        {!searchQuery && category === 'all' && posts.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_450px]">
              {/* Featured Article - Left */}
              {featuredPost && (
                <Link
                  href={`/stam/blog/${featuredPost.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-stone-300 bg-[#FEFDFB] shadow-2xl shadow-stone-900/10 transition-all duration-300 hover:-translate-y-2 hover:border-amber-400 hover:shadow-amber-500/15"
                >
                  {/* Featured Badge */}
                  <div className="absolute left-6 top-6 z-10 flex items-center gap-2 rounded-full border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 px-3 py-1.5 text-xs font-bold text-amber-900 shadow-lg shadow-amber-500/20">
                    <Sparkle size={14} weight="fill" className="text-amber-700" />
                    Article à la une
                  </div>

                  {featuredPost.featuredImage && (
                    <div className="relative h-80 w-full overflow-hidden bg-stone-50 md:h-96">
                      <Image
                        src={featuredPost.featuredImage}
                        alt={featuredPost.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 60vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        priority
                      />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-3 text-xs uppercase tracking-[0.15em] text-stone-500">
                      <CalendarBlank size={14} weight="duotone" />
                      <time dateTime={featuredPost.publishedAt}>
                        {formatDate(featuredPost.publishedAt)}
                      </time>
                      <span className="text-stone-300">•</span>
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-800">
                        {categories.find(c => c.id === featuredPost.category)?.label ||
                          featuredPost.category}
                      </span>
                    </div>

                    <h2 className="mt-4 text-3xl font-bold leading-tight text-stone-900 transition-colors group-hover:text-amber-900 md:text-4xl">
                      {featuredPost.title}
                    </h2>

                    <p className="mt-5 text-base leading-relaxed text-stone-600">
                      {featuredPost.excerpt}
                    </p>

                    {featuredPost.tags.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {featuredPost.tags.slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-3 py-1.5 text-xs font-semibold text-stone-700 transition-all duration-300 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-800"
                          >
                            <Hash size={12} weight="bold" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto flex items-center justify-between gap-4 border-t border-stone-200 pt-6">
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <Clock size={14} weight="duotone" />
                        <span>{featuredPost.readingTime.text}</span>
                      </div>
                      <span className="group/link inline-flex items-center gap-2 text-sm font-bold text-stone-900 transition-all group-hover:gap-3 group-hover:text-amber-800">
                        Lire l&apos;article
                        <ArrowRight
                          size={16}
                          weight="bold"
                          className="transition-transform group-hover/link:translate-x-1"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              )}

              {/* Recent Posts - Right (Scrollable) */}
              <div className="flex flex-col gap-4 overflow-hidden rounded-3xl border border-stone-300 bg-gradient-to-br from-amber-50 via-stone-50 to-[#FEFDFB] p-6 shadow-xl shadow-stone-900/5">
                <h3 className="flex items-center gap-2 text-lg font-bold text-stone-900">
                  <Clock size={20} weight="duotone" className="text-amber-800" />
                  Articles récents
                </h3>

                <div className="custom-scrollbar flex flex-col gap-4 overflow-y-auto pr-2 lg:max-h-[600px]">
                  {recentPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/stam/blog/${post.slug}`}
                      className="group flex flex-col gap-3 rounded-2xl border border-stone-300 bg-[#FEFDFB] p-4 shadow-md shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
                    >
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <CalendarBlank size={12} weight="duotone" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>

                      <h4 className="text-base font-bold leading-snug text-stone-900 line-clamp-2 transition-colors group-hover:text-amber-900">
                        {post.title}
                      </h4>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="rounded-full bg-amber-50 px-2.5 py-1 font-bold text-amber-800">
                          {categories.find(c => c.id === post.category)?.label || post.category}
                        </span>
                        <span className="text-stone-300">•</span>
                        <span className="text-stone-500">{post.readingTime.text}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Category Accordion Sections */}
        {!searchQuery && category === 'all' && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-stone-900 md:text-3xl">Explorer par catégorie</h2>

            <div className="space-y-4">
              {categories
                .filter(cat => cat.id !== 'all' && categoryCounts[cat.id] > 0)
                .map((cat) => {
                  const categoryPosts = getPostsByCategory(cat.id)
                  const isExpanded = expandedCategories.has(cat.id)
                  const displayPosts = categoryPosts.slice(0, 8)

                  return (
                    <div
                      key={cat.id}
                      className="overflow-hidden rounded-3xl border border-stone-300 bg-[#FEFDFB] shadow-xl shadow-stone-900/5"
                    >
                      {/* Category Header */}
                      <button
                        onClick={() => toggleCategory(cat.id)}
                        className="flex w-full items-center justify-between gap-4 p-6 text-left transition-all duration-300 hover:bg-gradient-to-br hover:from-amber-50 hover:to-stone-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-amber-500"
                        aria-expanded={isExpanded}
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-50 text-amber-800">
                            {cat.icon}
                          </div>
                          <h3 className="text-xl font-bold text-stone-900">{cat.label}</h3>
                          <span className="rounded-full bg-amber-50 px-3 py-1 text-sm font-bold text-amber-800">
                            {categoryCounts[cat.id]}
                          </span>
                        </div>

                        <motion.div
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <CaretDown size={20} weight="bold" className="text-stone-700" />
                        </motion.div>
                      </button>

                      {/* Category Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            variants={accordionVariants}
                            initial="collapsed"
                            animate="expanded"
                            exit="collapsed"
                            className="overflow-hidden"
                          >
                            <div className="space-y-6 border-t border-stone-300 bg-gradient-to-br from-stone-50 to-[#FEFDFB] p-6">
                              {/* Articles Grid */}
                              <motion.div
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                                className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
                              >
                                {displayPosts.map((post) => (
                                  <motion.article
                                    key={post.slug}
                                    variants={cardVariants}
                                    whileHover={{
                                      y: -6,
                                      transition: { duration: 0.2 }
                                    }}
                                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-stone-300 bg-[#FEFDFB] shadow-lg shadow-stone-900/5 transition-all duration-300 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10"
                                  >
                                    {post.featuredImage && (
                                      <div className="relative h-40 w-full overflow-hidden bg-stone-50">
                                        <Image
                                          src={post.featuredImage}
                                          alt={post.title}
                                          fill
                                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                                          loading="lazy"
                                        />
                                      </div>
                                    )}

                                    <div className="flex flex-1 flex-col p-5">
                                      <div className="flex items-center gap-2 text-xs text-stone-500">
                                        <CalendarBlank size={12} weight="duotone" />
                                        <time dateTime={post.publishedAt}>
                                          {formatDate(post.publishedAt)}
                                        </time>
                                      </div>

                                      <h4 className="mt-3 text-base font-bold leading-tight text-stone-900 line-clamp-2 transition-colors group-hover:text-amber-900">
                                        {post.title}
                                      </h4>

                                      <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-2">
                                        {post.excerpt}
                                      </p>

                                      <div className="mt-4 flex items-center justify-between gap-3 border-t border-stone-200 pt-4">
                                        <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                          <Clock size={12} weight="duotone" />
                                          <span>{post.readingTime.text}</span>
                                        </div>
                                        <Link
                                          href={`/stam/blog/${post.slug}`}
                                          className="group/link inline-flex items-center gap-1 text-xs font-bold text-stone-900 transition-all hover:gap-2 hover:text-amber-800"
                                        >
                                          Lire
                                          <ArrowRight
                                            size={12}
                                            weight="bold"
                                            className="transition-transform group-hover/link:translate-x-0.5"
                                          />
                                        </Link>
                                      </div>
                                    </div>
                                  </motion.article>
                                ))}
                              </motion.div>

                              {/* See More Button */}
                              {categoryPosts.length > 8 && (
                                <div className="flex justify-center pt-2">
                                  <Link
                                    href={`/stam/blog/category/${cat.id}`}
                                    className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-6 py-3 text-sm font-bold text-stone-900 shadow-lg shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-500/10 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                  >
                                    Voir plus de {cat.label.toLowerCase()}
                                    <ArrowRight size={16} weight="bold" />
                                  </Link>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
            </div>
          </motion.section>
        )}

        {/* Filtered Posts Grid (when searching or category filter active) */}
        {(searchQuery || category !== 'all') && (
          <>
            {filteredPosts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="relative overflow-hidden rounded-3xl border border-stone-300 bg-[#FEFDFB] p-16 text-center shadow-2xl shadow-stone-900/10"
              >
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-amber-100 opacity-30 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-stone-200 opacity-30 blur-3xl" />

                <div className="relative">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 shadow-lg shadow-amber-500/20"
                  >
                    <BookOpen size={48} weight="duotone" className="text-amber-800" />
                  </motion.div>

                  <h3 className="mb-4 text-2xl font-bold text-stone-900">
                    {searchQuery ? 'Aucun article trouvé' : "Restez à l'écoute"}
                  </h3>
                  <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-stone-600">
                    {searchQuery
                      ? `Aucun article ne correspond à "${searchQuery}". Essayez un autre terme ou explorez nos catégories.`
                      : "Le blog s'alimentera au fil des sprints STAM. En attendant, découvrez la plateforme."}
                  </p>

                  <div className="flex flex-col justify-center gap-3 sm:flex-row">
                    {searchQuery ? (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-[#FEFDFB] shadow-lg shadow-stone-900/20 transition-all duration-300 hover:scale-105 hover:bg-stone-800"
                      >
                        Réinitialiser la recherche
                      </button>
                    ) : (
                      <>
                        <Link
                          href="/stam/login"
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-stone-900 px-6 py-3 text-sm font-bold text-[#FEFDFB] shadow-lg shadow-stone-900/20 transition-all duration-300 hover:scale-105 hover:bg-stone-800"
                        >
                          Découvrir STAM
                          <ArrowRight size={16} weight="bold" />
                        </Link>
                        <Link
                          href="/stam"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-6 py-3 text-sm font-bold text-stone-900 shadow-lg shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-amber-500/10"
                        >
                          Voir les fonctionnalités
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
              >
                {filteredPosts.map((post) => (
                  <motion.article
                    key={post.slug}
                    variants={cardVariants}
                    whileHover={{ y: -6, transition: { duration: 0.2 } }}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-stone-300 bg-[#FEFDFB] shadow-2xl shadow-stone-900/10 transition-all duration-300 hover:border-amber-400 hover:shadow-amber-500/15"
                  >
                    {post.featuredImage && (
                      <div className="relative h-56 w-full overflow-hidden border-b border-stone-300 bg-stone-50">
                        <div className="absolute left-4 top-4 z-10 rounded-full border border-amber-300 bg-gradient-to-br from-amber-50 to-amber-100 px-3 py-1 text-xs font-bold text-amber-900 shadow-lg shadow-amber-500/20">
                          {categories.find(c => c.id === post.category)?.label || post.category}
                        </div>
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1280px) 33vw, 400px"
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-7">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-stone-500">
                        <CalendarBlank size={14} weight="duotone" />
                        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                      </div>

                      <h2 className="mt-4 text-xl font-bold leading-tight text-stone-900 line-clamp-2 transition-colors group-hover:text-amber-900">
                        {post.title}
                      </h2>

                      <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600 line-clamp-3">
                        {post.excerpt}
                      </p>

                      {post.tags.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-700 transition-all duration-300 group-hover:border-amber-300 group-hover:bg-amber-50 group-hover:text-amber-800"
                            >
                              <Hash size={12} weight="bold" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="inline-flex items-center rounded-full border border-stone-200 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-700">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="mt-6 flex items-center justify-between gap-4 border-t border-stone-200 pt-6">
                        <div className="flex items-center gap-2 text-xs text-stone-500">
                          <Clock size={14} weight="duotone" />
                          <span>{post.readingTime.text}</span>
                        </div>
                        <Link
                          href={`/stam/blog/${post.slug}`}
                          className="group/link inline-flex items-center gap-2 text-sm font-bold text-stone-900 transition-all hover:gap-3 hover:text-amber-800"
                        >
                          Lire l&apos;article
                          <ArrowRight
                            size={16}
                            weight="bold"
                            className="transition-transform group-hover/link:translate-x-1"
                          />
                        </Link>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </>
        )}
      </div>

      {/* Mobile Bottom Navigation - Categories */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-300 bg-[#FEFDFB]/95 backdrop-blur-xl shadow-2xl shadow-stone-900/10 md:hidden">
        <div className="flex items-center justify-around px-2 py-2 safe-area-bottom">
          {categories.map((cat) => {
            const isActive = category === cat.id

            return (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`flex min-w-[60px] flex-col items-center gap-1 rounded-xl px-3 py-2.5 transition-all duration-300 active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-br from-amber-50 to-stone-50 text-amber-800'
                    : 'text-stone-600 active:bg-stone-50'
                }`}
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : ''}`}>
                  {cat.icon}
                </span>
                <span className={`text-[10px] font-bold leading-tight text-center ${isActive ? 'text-amber-900' : 'text-stone-700'}`}>
                  {cat.label === 'Tous' ? 'Tous' : cat.label.split(' ')[0]}
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-gradient-to-r from-amber-600 to-amber-500" />
                )}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(214, 211, 209, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(217, 119, 6, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(217, 119, 6, 0.5);
        }
      `}</style>
    </>
  )
}
