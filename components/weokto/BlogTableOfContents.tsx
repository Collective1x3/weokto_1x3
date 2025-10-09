'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'

interface TOCItem {
  id: string
  text: string
  level: number
}

interface BlogTableOfContentsProps {
  content?: string
  className?: string
}

export default function BlogTableOfContents({ content, className = '' }: BlogTableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')
  const [headings, setHeadings] = useState<TOCItem[]>([])
  const tocRef = useRef<HTMLDivElement>(null)

  // Extract headings from content or DOM
  useEffect(() => {
    const extractHeadings = () => {
      // Try to get headings from DOM first (more reliable for rendered content)
      const contentElement = document.querySelector('.prose')
      if (contentElement) {
        const headingElements = contentElement.querySelectorAll('h2, h3')
        const items: TOCItem[] = Array.from(headingElements).map((heading) => {
          // Create ID if it doesn't exist
          if (!heading.id) {
            const id = heading.textContent
              ?.toLowerCase()
              .replace(/[^a-z0-9]+/g, '-')
              .replace(/^-+|-+$/g, '') || ''
            heading.id = id
          }

          return {
            id: heading.id,
            text: heading.textContent || '',
            level: parseInt(heading.tagName[1])
          }
        })
        setHeadings(items)
      } else if (content) {
        // Fallback: Extract from markdown content
        const regex = /^(#{2,3})\s+(.+)$/gm
        const matches = Array.from(content.matchAll(regex))
        const items: TOCItem[] = matches.map((match) => {
          const level = match[1].length
          const text = match[2]
          const id = text
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '')

          return { id, text, level }
        })
        setHeadings(items)
      }
    }

    // Wait for DOM to be ready and extract headings
    const timer = setTimeout(extractHeadings, 200)

    // Also re-extract if DOM changes
    const observer = new MutationObserver(() => {
      extractHeadings()
    })

    const contentEl = document.querySelector('.prose')
    if (contentEl) {
      observer.observe(contentEl, { childList: true, subtree: true })
    }

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [content])

  // Set up scroll listener to highlight active section
  useEffect(() => {
    if (headings.length === 0) return

    const updateActiveHeading = () => {
      const scrollY = window.scrollY
      const windowHeight = window.innerHeight
      const docHeight = document.documentElement.scrollHeight

      // Check if we're at the bottom of the page
      if (scrollY + windowHeight >= docHeight - 10) {
        setActiveId(headings[headings.length - 1]?.id || '')
        return
      }

      // Find the currently visible heading
      let currentActiveId = ''
      const offset = 150 // Offset for fixed header and some padding

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const element = document.getElementById(heading.id)

        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + scrollY

          // Check if this heading has passed the offset point
          if (elementTop <= scrollY + offset) {
            currentActiveId = heading.id
            break
          }
        }
      }

      // If no heading found (we're at the top), use the first heading
      if (!currentActiveId && headings.length > 0) {
        currentActiveId = headings[0].id
      }

      setActiveId(currentActiveId)
    }

    // Initial update
    updateActiveHeading()

    // Throttled scroll handler
    let rafId: number | null = null
    const handleScroll = () => {
      if (rafId === null) {
        rafId = window.requestAnimationFrame(() => {
          updateActiveHeading()
          rafId = null
        })
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', updateActiveHeading, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', updateActiveHeading)
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId)
      }
    }
  }, [headings])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 100
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (headings.length === 0) return null

  return (
    <nav className={`${className}`}>
      <div ref={tocRef} className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto border border-[#B794F4] bg-black/95 backdrop-blur-sm p-4 lg:p-5 scrollbar-thin scrollbar-thumb-[#B794F4]/30 scrollbar-track-transparent">
        {/* Header */}
        <div className="text-xs sm:text-sm text-[#FFB000] mb-4 font-bold tracking-wider">
          {'> CHAPITRES'}
        </div>

        {/* TOC Items */}
        <div className="space-y-2">
          {headings.map((heading) => {
            const isActive = activeId === heading.id
            const isH3 = heading.level === 3

            return (
              <motion.button
                key={heading.id}
                id={`toc-${heading.id}`}
                onClick={() => handleClick(heading.id)}
                className={`
                  block w-full text-left text-xs sm:text-sm transition-all py-1
                  ${isH3 ? 'pl-4' : 'pl-0'}
                  ${isActive
                    ? 'text-[#FFB000] font-bold'
                    : 'text-[#B794F4]/80 hover:text-white'
                  }
                `}
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[#B794F4]/40">
                    {isH3 ? '└─' : '▸'}
                  </span>
                  <span className="line-clamp-2 leading-tight">
                    {heading.text}
                  </span>
                </span>
              </motion.button>
            )
          })}
        </div>

        {/* Progress indicator */}
        <div className="mt-4 pt-4 border-t border-[#B794F4]/30">
          <div className="text-[10px] text-[#B794F4]/60 mb-2">PROGRESSION</div>
          <div className="h-1 bg-[#B794F4]/20 rounded overflow-hidden">
            <motion.div
              className="h-full bg-[#FFB000]"
              initial={{ width: '0%' }}
              animate={{
                width: headings.length > 0
                  ? `${((headings.findIndex(h => h.id === activeId) + 1) / headings.length) * 100}%`
                  : '0%'
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            />
          </div>
        </div>
      </div>
    </nav>
  )
}