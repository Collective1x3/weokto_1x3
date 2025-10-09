'use client'

import { useState, useEffect, useRef } from 'react'
import HeaderBlog from '@/components/weokto/HeaderBlog'
import BlogFooterWithAuth from '@/components/weokto/BlogFooterWithAuth'
import BlogTableOfContents from '@/components/weokto/BlogTableOfContents'
import Link from 'next/link'
import Image from 'next/image'
import { BlogPost, formatDate } from '@/lib/mdx-types'
import { useAuth } from '@/contexts/AuthContext'
import TerminalAuthModal from '@/components/weokto/TerminalAuthModal'

interface BlogPostClientProps {
  post: BlogPost
  content: React.ReactNode
}

export default function BlogPostClient({ post, content }: BlogPostClientProps) {
  const [showMobileToc, setShowMobileToc] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Check if TOC should be shown
  const showToc = post.toc === true || (typeof post.toc === 'object' && post.toc?.enabled !== false)

  // Auth context
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    setAuthMode,
    email,
    setEmail,
    sendMagicLink,
    loadingAction,
    successMessage,
    errorMessage
  } = useAuth()

  const handleStartClick = () => {
    setAuthMode('signup')
    setShowAuthModal(true)
  }

  // Matrix rain effect
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

      <main className="relative z-10 pt-16 sm:pt-20 lg:pt-24">
        <article className="max-w-[1600px] mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-12">
          {/* Back Link and Mobile TOC Toggle */}
          <div className="mb-4 sm:mb-6 flex items-center justify-between">
            <Link
              href="/blog"
              className="inline-block px-2 py-1.5 sm:px-3 sm:py-2 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-xs"
            >
              {'<< [RETOUR AU BLOG]'}
            </Link>
            {showToc && (
              <button
                onClick={() => setShowMobileToc(!showMobileToc)}
                className="xl:hidden px-3 py-2 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-sm"
              >
                {showMobileToc ? '[X] FERMER CHAPITRES' : '[☰] VOIR CHAPITRES'}
              </button>
            )}
          </div>

          {/* Mobile TOC */}
          {showToc && showMobileToc && (
            <div className="xl:hidden mb-6 fixed inset-x-0 top-20 z-50 bg-black/95 backdrop-blur-sm border-b border-[#B794F4] max-h-[60vh] overflow-y-auto">
              <div className="max-w-2xl mx-auto px-4">
                <BlogTableOfContents content={post.content} className="relative" />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Main Content - Left Side - Much Wider */}
            <div className="lg:col-span-9">
              {/* Title */}
              <div className="mb-6 sm:mb-8">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-6 uppercase tracking-wide lg:tracking-wider text-white leading-tight">
                  {post.title}
                </h1>
                <p className="text-sm sm:text-base md:text-lg lg:text-xl text-[#B794F4]/80 leading-relaxed max-w-4xl">{post.excerpt}</p>
              </div>

              {/* Featured Image */}
              {post.featuredImage && (
                <div className="relative aspect-video mb-6 sm:mb-8 border sm:border-2 border-[#B794F4] overflow-hidden">
                  <Image
                    src={post.featuredImage}
                    alt={post.title}
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 75vw"
                  />
                </div>
              )}

              {/* Content */}
              <div className="border border-[#B794F4]/30 bg-black/80 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 sm:mb-8">
                <div className={`prose prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg
                  prose-p:text-gray-300 prose-p:text-sm sm:prose-p:text-base lg:prose-p:text-lg prose-p:leading-relaxed prose-p:mb-3 sm:prose-p:mb-4
                  prose-headings:text-white prose-headings:font-bold prose-headings:tracking-wide
                  prose-h2:text-xl sm:prose-h2:text-2xl md:prose-h2:text-3xl lg:prose-h2:text-4xl prose-h2:border-b prose-h2:border-[#B794F4]/30 prose-h2:pb-2 sm:prose-h2:pb-3 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h2:mt-6 sm:prose-h2:mt-8 lg:prose-h2:mt-10
                  prose-h3:text-lg sm:prose-h3:text-xl md:prose-h3:text-2xl lg:prose-h3:text-3xl prose-h3:mb-3 sm:prose-h3:mb-4 prose-h3:mt-4 sm:prose-h3:mt-6 lg:prose-h3:mt-8
                  prose-a:text-[#FFB000] prose-a:underline hover:prose-a:text-[#B794F4]
                  prose-strong:text-white prose-strong:font-bold
                  prose-code:text-[#FFB000] prose-code:bg-black/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
                  prose-pre:bg-black prose-pre:border prose-pre:border-[#B794F4]/50 prose-pre:p-4
                  prose-blockquote:border-l-4 prose-blockquote:border-[#B794F4] prose-blockquote:pl-4 prose-blockquote:text-gray-400 prose-blockquote:italic
                  prose-ul:text-base prose-ul:text-gray-300 prose-li:mb-2
                  prose-ol:text-base prose-ol:text-gray-300
                  prose-img:border prose-img:border-[#B794F4]/30`}>
                  {content}
                </div>
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="border border-[#B794F4]/30 bg-black/80 p-3 sm:p-4 mb-6 sm:mb-8">
                  <div className="text-xs sm:text-sm text-white mb-2 sm:mb-3">{'> TAGS'}</div>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Link
                        key={tag}
                        href={`/blog/tag/${tag}`}
                        className="px-2 py-1 sm:px-3 border border-[#B794F4] hover:bg-[#B794F4] hover:text-black transition-all text-xs uppercase"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-3">
              <div className="sticky top-24 space-y-6">
                {/* Author Info */}
                <div className="border border-[#B794F4] bg-black/90 p-4">
                  <div className="text-xs text-[#FFB000] mb-3">{'> AUTEUR'}</div>
                  <div className="flex items-center gap-3 mb-3">
                    {post.author.avatar && (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#B794F4]">
                        <Image
                          src={post.author.avatar}
                          alt={post.author.name}
                          width={48}
                          height={48}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <div className="text-white font-bold text-sm">{post.author.name}</div>
                      <div className="text-[#B794F4]/60 text-xs">{post.author.role}</div>
                    </div>
                  </div>
                </div>

                {/* Article Meta */}
                <div className="border border-[#B794F4] bg-black/90 p-4">
                  <div className="text-xs text-[#FFB000] mb-3">{'> INFOS ARTICLE'}</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#B794F4]/60">CATÉGORIE:</span>
                      <span className="text-white">[{post.category.replace('-', '_').toUpperCase()}]</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B794F4]/60">PUBLIÉ:</span>
                      <span className="text-white">{formatDate(post.publishedAt)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#B794F4]/60">LECTURE:</span>
                      <span className="text-white">{Math.ceil(post.readingTime.minutes)} MIN</span>
                    </div>
                  </div>
                </div>

                {/* Table of Contents - Below Article Info */}
                {showToc && (
                  <div className="hidden lg:block">
                    <BlogTableOfContents content={post.content} />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-12 border-2 border-[#FFB000] bg-black/90 p-8 text-center">
            <h3 className="text-2xl font-bold mb-4 text-white">PRÊT À REJOINDRE WEOKTO ?</h3>
            <p className="text-base mb-6 text-[#B794F4]">Commence à générer des revenus passifs dès aujourd'hui</p>
            <button
              onClick={handleStartClick}
              className="inline-block px-8 py-4 bg-[#FFB000] text-black hover:bg-[#FFB000]/80 transition-all text-base font-bold cursor-pointer"
            >
              [COMMENCER MAINTENANT]
            </button>
          </div>
        </article>
      </main>

      <BlogFooterWithAuth />

      <TerminalAuthModal
        showAuthModal={showAuthModal}
        setShowAuthModal={setShowAuthModal}
        authMode={authMode}
        setAuthMode={setAuthMode}
        email={email}
        setEmail={setEmail}
        sendMagicLink={sendMagicLink}
        loadingAction={loadingAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
      />

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