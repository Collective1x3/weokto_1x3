'use client'

import { useState, useMemo, useEffect, useRef } from 'react'
import HeaderBlog from '@/components/weokto/HeaderBlog'
import BlogFooterWithAuth from '@/components/weokto/BlogFooterWithAuth'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { BlogPost, formatDate } from '@/lib/mdx-types'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'

interface BlogListClientProps {
  posts: BlogPost[]
}

export default function BlogListClient({ posts }: BlogListClientProps) {
  const searchParams = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'success-stories' | 'tutoriels' | 'annonces' | 'guides'>('all')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set category from URL on mount and when URL changes
  useEffect(() => {
    const categoryParam = searchParams?.get('category')
    if (categoryParam && ['success-stories', 'tutoriels', 'annonces', 'guides'].includes(categoryParam)) {
      setSelectedCategory(categoryParam as any)
    }
  }, [searchParams])

  // Matrix rain effect - Purple version
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const columns = Math.floor(canvas.width / 20)
    const drops: number[] = Array(columns).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#B794F4'
      ctx.font = '15px monospace'

      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96)
        ctx.fillText(text, i * 20, drops[i] * 20)

        if (drops[i] * 20 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)
    return () => clearInterval(interval)
  }, [])

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return posts
    return posts.filter(post => post.category === selectedCategory)
  }, [posts, selectedCategory])

  const categories = [
    { id: 'all', label: '[TOUS]', symbol: '◆' },
    { id: 'success-stories', label: '[SUCCESS_STORIES]', symbol: '★' },
    { id: 'tutoriels', label: '[TUTORIELS]', symbol: '▲' },
    { id: 'annonces', label: '[ANNONCES]', symbol: '!' },
    { id: 'guides', label: '[GUIDES]', symbol: '◈' }
  ]

  return (
    <div className="min-h-screen bg-black text-[#B794F4] font-mono relative overflow-hidden">
      {/* Matrix Rain Background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 opacity-10 pointer-events-none"
      />

      {/* Scanlines */}
      <div className="fixed inset-0 pointer-events-none opacity-50">
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(183, 148, 244, 0.03) 2px, rgba(183, 148, 244, 0.03) 4px)',
          animation: 'scanlines 8s linear infinite'
        }} />
      </div>

      {/* CRT Screen Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(183,148,244,0.01)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(255,0,0,0.01)] to-transparent" />
      </div>

      <HeaderBlog />

      <main className="relative z-10 pt-20 sm:pt-24">
        {/* Hero Section */}
        <section className="relative py-8 sm:py-16 px-3 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 sm:mb-12">
              {/* ASCII Art Header - Responsive size */}
              <div className="w-full overflow-x-auto">
                <pre className="text-[#B794F4] text-[6px] sm:text-xs md:text-sm mb-6 sm:mb-8 inline-block text-left">
{`
██╗    ██╗███████╗ ██████╗ ██╗  ██╗████████╗ ██████╗     ██████╗ ██╗      ██████╗  ██████╗
██║    ██║██╔════╝██╔═══██╗██║ ██╔╝╚══██╔══╝██╔═══██╗    ██╔══██╗██║     ██╔═══██╗██╔════╝
██║ █╗ ██║█████╗  ██║   ██║█████╔╝    ██║   ██║   ██║    ██████╔╝██║     ██║   ██║██║  ███╗
██║███╗██║██╔══╝  ██║   ██║██╔═██╗    ██║   ██║   ██║    ██╔══██╗██║     ██║   ██║██║   ██║
╚███╔███╔╝███████╗╚██████╔╝██║  ██╗   ██║   ╚██████╔╝    ██████╔╝███████╗╚██████╔╝╚██████╔╝
 ╚══╝╚══╝ ╚══════╝ ╚═════╝ ╚═╝  ╚═╝   ╚═╝    ╚═════╝     ╚═════╝ ╚══════╝ ╚═════╝  ╚═════╝
`}
                </pre>
              </div>
            </div>

            {/* Categories Filter - Terminal Style */}
            <div className="border sm:border-2 border-[#B794F4] bg-black/90 p-3 sm:p-4 mb-8 sm:mb-12 max-w-3xl mx-auto">
              <div className="text-xs mb-2 sm:mb-3 text-white">{'> SÉLECTIONNER CATÉGORIE:'}</div>
              <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id as any)}
                    className={`px-2 py-1.5 sm:px-3 sm:py-2 text-xs transition-all ${
                      selectedCategory === category.id
                        ? 'bg-[#B794F4] text-black font-bold'
                        : 'border border-[#B794F4] hover:bg-[#B794F4] hover:text-black'
                    }`}
                  >
                    <span className="mr-2">{category.symbol}</span>
                    {category.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Message when no posts */}
            {filteredPosts.length === 0 ? (
              <div className="border sm:border-2 border-[#B794F4] bg-black/90 p-6 sm:p-8 text-center max-w-2xl mx-auto">
                <pre className="text-white text-xs mb-6">
{`
╔════════════════════════════╗
║   AUCUNE DONNÉE DISPONIBLE ║
║   REVENEZ PLUS TARD        ║
╚════════════════════════════╝
`}
                </pre>
                <Link
                  href="/"
                  className="inline-block px-3 py-2 sm:px-4 bg-[#B794F4] text-black hover:bg-[#B794F4]/80 transition-all text-xs sm:text-sm font-bold"
                >
                  [RETOUR_ACCUEIL]
                </Link>
              </div>
            ) : (
              /* Posts Grid - Terminal Style with Images */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.slug}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * Math.min(index, 10) }}
                    className="h-full"
                  >
                    <Link href={`/blog/post/${post.slug}`} className="block group h-full">
                      <div className="border border-[#B794F4] bg-black/80 hover:bg-black/90 transition-all hover:border-[#FFB000] overflow-hidden flex flex-col h-full">
                        {/* Featured Image */}
                        {post.featuredImage && (
                          <div className="relative h-40 sm:h-48 w-full border-b border-[#B794F4]/30">
                            <Image
                              src={post.featuredImage}
                              alt={post.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            {/* Category Badge */}
                            <div className="absolute top-3 left-3">
                              <span className="px-2 py-1 bg-[#B794F4] text-black text-xs font-bold">
                                [{post.category.replace('-', '_').toUpperCase()}]
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Content */}
                        <div className="p-3 sm:p-4 flex-1 flex flex-col">
                          {/* Date */}
                          <div className="text-xs text-[#B794F4]/60 mb-2">
                            {formatDate(post.publishedAt)}
                          </div>

                          {/* Title */}
                          <h2 className="text-xs sm:text-sm font-bold mb-2 sm:mb-3 group-hover:text-[#FFB000] transition-colors line-clamp-2 uppercase">
                            {'> '}{post.title}
                          </h2>

                          {/* Excerpt */}
                          <p className="text-xs mb-3 sm:mb-4 line-clamp-3 text-[#B794F4]/80 flex-1">
                            {post.excerpt}
                          </p>

                          {/* Footer with Author and Reading Time */}
                          <div className="flex items-center justify-between text-xs mt-auto pt-3 border-t border-[#B794F4]/20">
                            <div className="flex items-center gap-2">
                              {post.author.avatar && (
                                <div className="w-6 h-6 rounded-full overflow-hidden border border-[#B794F4]">
                                  <Image
                                    src={post.author.avatar}
                                    alt={post.author.name}
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <div>
                                <span className="text-white block">{post.author.name}</span>
                                <span className="text-[#B794F4]/50 text-[10px]">{post.author.role}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-white">
                                [{Math.ceil(post.readingTime.minutes)}MIN]
                              </span>
                              <span className="group-hover:translate-x-1 transition-transform inline-block text-[#FFB000]">
                                {'>>'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      <BlogFooterWithAuth />

      <style jsx>{`
        @keyframes scanlines {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 0 10px;
          }
        }
      `}</style>
    </div>
  )
}