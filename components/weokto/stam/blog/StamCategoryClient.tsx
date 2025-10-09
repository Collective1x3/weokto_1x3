'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import type { BlogPost } from '@/lib/mdx-types'
import { formatDate } from '@/lib/mdx-types'
import Image from 'next/image'
import {
  Hash,
  ArrowRight,
  CalendarBlank,
  Clock,
  ArrowLeft
} from '@phosphor-icons/react/dist/ssr'

interface Props {
  posts: BlogPost[]
  category: { id: string; label: string }
  allCategories: { id: string; label: string }[]
}

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

export default function StamCategoryClient({ posts, category, allCategories }: Props) {
  return (
    <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 md:space-y-10 md:px-6 md:py-12 lg:px-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <Link
          href="/stam/blog"
          className="group inline-flex items-center gap-2 text-sm font-bold text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft size={16} weight="bold" className="transition-transform group-hover:-translate-x-1" />
          Retour au blog
        </Link>

        <div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight">
            {category.label}
          </h1>
          <p className="mt-4 text-base md:text-lg text-gray-600">
            {posts.length} article{posts.length !== 1 ? 's' : ''} dans cette catégorie
          </p>
        </div>

        {/* Other Categories */}
        <div className="flex flex-wrap gap-3">
          {allCategories.filter(c => c.id !== category.id).map((cat) => (
            <Link
              key={cat.id}
              href={`/stam/blog/category/${cat.id}`}
              className="group relative overflow-hidden rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-md shadow-black/5 transition-all duration-300 hover:scale-105 hover:border-emerald-300 hover:text-emerald-900 hover:shadow-lg hover:shadow-emerald-500/10"
            >
              <span className="relative z-10">{cat.label}</span>
            </Link>
          ))}
        </div>
      </motion.header>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="relative overflow-hidden rounded-3xl border border-gray-200 bg-white p-16 text-center shadow-2xl shadow-black/10"
        >
          <h3 className="mb-4 text-2xl font-bold text-gray-900">
            Aucun article dans cette catégorie
          </h3>
          <p className="mx-auto mb-8 max-w-lg text-base leading-relaxed text-gray-600">
            Les articles arriveront bientôt. En attendant, explorez les autres catégories.
          </p>
          <Link
            href="/stam/blog"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-gray-900/20 transition-all duration-300 hover:scale-105 hover:bg-gray-800"
          >
            Retour au blog
            <ArrowRight size={16} weight="bold" />
          </Link>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-8"
        >
          {posts.map((post) => (
            <motion.article
              key={post.slug}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl shadow-black/10 transition-all duration-300 hover:border-emerald-300 hover:shadow-emerald-500/15"
            >
              {post.featuredImage && (
                <div className="relative h-56 w-full border-b border-gray-200 overflow-hidden bg-gray-50">
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
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.15em] text-gray-500">
                  <CalendarBlank size={14} weight="duotone" />
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                </div>

                <h2 className="mt-4 text-xl font-bold text-gray-900 leading-tight line-clamp-2 transition-colors group-hover:text-emerald-900">
                  {post.title}
                </h2>

                <p className="mt-4 flex-1 text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {post.excerpt}
                </p>

                {post.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700 transition-all duration-300 group-hover:border-emerald-300 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                      >
                        <Hash size={12} weight="bold" />
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 2 && (
                      <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-semibold text-gray-700">
                        +{post.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-200 pt-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={14} weight="duotone" />
                    <span>{post.readingTime.text}</span>
                  </div>
                  <Link
                    href={`/stam/blog/${post.slug}`}
                    className="group/link inline-flex items-center gap-2 text-sm font-bold text-gray-900 transition-all hover:gap-3 hover:text-emerald-700"
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
    </div>
  )
}
