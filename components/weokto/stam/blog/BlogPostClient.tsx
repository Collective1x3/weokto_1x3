'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'

import type { BlogPost } from '@/lib/mdx-types'
import { formatDate } from '@/lib/mdx-types'
import {
  Clock,
  Hash,
  ArrowRight,
  ArrowLeft,
  TwitterLogo,
  LinkedinLogo,
  Link as LinkIcon,
  Check
} from '@phosphor-icons/react/dist/ssr'

interface Props {
  post: BlogPost
  content: React.ReactNode
  related: BlogPost[]
}

export default function StamBlogPostClient({ post, content, related }: Props) {
  const tags = useMemo(() => post.tags || [], [post.tags])
  const [readingProgress, setReadingProgress] = useState(0)
  const [copied, setCopied] = useState(false)

  // Reading progress tracker
  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (scrollTop / docHeight) * 100
      setReadingProgress(Math.min(progress, 100))
    }

    window.addEventListener('scroll', updateProgress)
    updateProgress() // Initial call
    return () => window.removeEventListener('scroll', updateProgress)
  }, [])

  const shareUrl = typeof window !== 'undefined' ? window.location.href : ''

  const copyLink = async () => {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <article className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6 md:py-12 lg:px-8">
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-stone-200">
        <div
          className="h-full bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${readingProgress}%` }}
        />
      </div>

      <div className="flex flex-col max-w-4xl mx-auto w-full">
        <motion.header
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-5"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
            {formatDate(post.publishedAt)}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-stone-900 tracking-tight leading-[1.1]">
            {post.title}
          </h1>

          {/* Author Card */}
          <div className="flex items-center gap-4 rounded-2xl border border-stone-300 bg-[#FEFDFB] p-5 shadow-xl shadow-stone-900/5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-lg font-bold text-amber-900">
              {post.author.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-stone-900">{post.author.name}</p>
              <p className="text-sm text-stone-600">{post.author.role}</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <Clock size={16} weight="duotone" className="text-amber-800" />
              <span>{post.readingTime.text}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm"
                >
                  <Hash size={12} weight="bold" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.header>

        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mt-10 h-80 w-full overflow-hidden rounded-3xl border border-stone-300 shadow-2xl shadow-stone-900/10"
          >
            <Image
              src={post.featuredImage}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 800px"
              priority
            />
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="prose prose-lg mt-12 max-w-none
            prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-stone-900
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
            prose-p:text-stone-700 prose-p:leading-relaxed prose-p:mb-6
            prose-strong:text-stone-900 prose-strong:font-bold
            prose-a:text-amber-800 prose-a:underline prose-a:underline-offset-4 prose-a:decoration-amber-300 hover:prose-a:decoration-amber-500
            prose-code:text-amber-900 prose-code:bg-amber-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-amber-200
            prose-pre:bg-stone-50 prose-pre:border prose-pre:border-stone-300 prose-pre:rounded-2xl prose-pre:shadow-lg prose-pre:shadow-stone-900/5"
        >
          {content}
        </motion.div>

        {/* Share Section */}
        <div className="mt-16 border-t border-stone-300 pt-10">
          <div className="rounded-3xl border border-stone-300 bg-gradient-to-br from-amber-50 via-stone-50 to-[#FEFDFB] p-8 shadow-xl shadow-stone-900/5">
            <h3 className="mb-6 text-lg font-bold text-stone-900">Partager cet article</h3>
            <div className="flex flex-wrap gap-3">
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-5 py-3 text-sm font-bold text-stone-900 shadow-md shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <TwitterLogo size={20} weight="fill" className="text-amber-800" />
                Twitter
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-5 py-3 text-sm font-bold text-stone-900 shadow-md shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
              >
                <LinkedinLogo size={20} weight="fill" className="text-amber-800" />
                LinkedIn
              </a>
              <button
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-[#FEFDFB] px-5 py-3 text-sm font-bold text-stone-900 shadow-md shadow-stone-900/5 transition-all duration-300 hover:scale-105 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10"
              >
                {copied ? (
                  <>
                    <Check size={20} weight="bold" className="text-amber-800" />
                    Copié !
                  </>
                ) : (
                  <>
                    <LinkIcon size={20} weight="bold" className="text-amber-800" />
                    Copier le lien
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Related Articles */}
      {related.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="w-full border-t border-stone-300 pt-12"
        >
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl md:text-3xl font-bold text-stone-900">À lire ensuite</h2>
            <Link
              href="/stam/blog"
              className="text-sm font-bold text-stone-600 hover:text-amber-800 transition"
            >
              Voir tous les articles →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={`/stam/blog/${item.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-stone-300 bg-[#FEFDFB] shadow-xl shadow-stone-900/5 transition-all duration-300 hover:border-amber-400 hover:-translate-y-2 hover:shadow-2xl hover:shadow-amber-500/10"
              >
                {item.featuredImage && (
                  <div className="relative h-48 w-full border-b border-stone-300 overflow-hidden bg-stone-50">
                    <Image
                      src={item.featuredImage}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, 400px"
                    />
                  </div>
                )}
                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.15em] text-stone-500">
                    {formatDate(item.publishedAt)}
                  </p>
                  <h3 className="mt-3 text-lg font-bold text-stone-900 leading-tight line-clamp-2 transition-colors group-hover:text-amber-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm text-stone-600 line-clamp-2">
                    {item.excerpt}
                  </p>
                  <div className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-stone-900 group-hover:gap-3 group-hover:text-amber-800 transition-all">
                    Lire l&apos;article
                    <ArrowRight size={14} weight="bold" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-stone-300 pt-8 text-sm">
        <Link
          href="/stam/blog"
          className="inline-flex items-center gap-2 text-stone-600 hover:text-stone-900 font-bold transition"
        >
          <ArrowLeft size={16} weight="bold" />
          Retour au blog
        </Link>
        <div className="flex items-center gap-4 rounded-xl border border-stone-300 bg-[#FEFDFB] px-4 py-3 shadow-lg shadow-stone-900/5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-amber-50 text-xs font-bold text-amber-900">
            {post.author.name.charAt(0)}
          </div>
          <div className="text-stone-600">
            <span className="text-stone-900 font-bold">{post.author.name}</span> — {post.author.role}
          </div>
        </div>
      </footer>
    </article>
  )
}
