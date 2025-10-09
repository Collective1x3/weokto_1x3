import Image from 'next/image'
import Link from 'next/link'
import CodeBlockClient from './CodeBlockClient'

import { ReactNode } from 'react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'success' | 'error' | 'tip'
  children: ReactNode
}

export function Callout({ type = 'info', children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400',
    warning: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    tip: 'bg-violet-500/10 border-violet-500/30 text-violet-400'
  }

  const emojiByType: Record<NonNullable<CalloutProps['type']>, string> = {
    info: 'ℹ️',
    warning: '⚠️',
    success: '✅',
    error: '❌',
    tip: '💡'
  }

  return (
    <div className={`rounded-lg border p-4 my-6 ${styles[type]}`}>
      <div className="flex gap-3">
        <span className="flex-shrink-0 mt-0.5" aria-hidden>{emojiByType[type]}</span>
        <div className="prose-sm">{children}</div>
      </div>
    </div>
  )
}

const CodeBlock = CodeBlockClient

interface VideoEmbedProps {
  url: string
  title?: string
}

export function VideoEmbed({ url, title = 'Vidéo' }: VideoEmbedProps) {
  // Support YouTube and other platforms
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.match(/(?:v=|\/)([\w-]{11})/)?.[1]
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  }

  return (
    <div className="relative aspect-video my-8 rounded-xl overflow-hidden bg-black">
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  )
}

interface CTABoxProps {
  title: string
  description: string
  buttonText: string
  buttonHref: string
  variant?: 'primary' | 'secondary'
}

export function CTABox({
  title,
  description,
  buttonText,
  buttonHref,
  variant = 'primary'
}: CTABoxProps) {
  return (
    <div className={`rounded-xl p-6 my-8 ${
      variant === 'primary'
        ? 'bg-gradient-to-r from-violet-600/20 to-violet-500/20 border border-violet-500/30'
        : 'bg-white/5 border border-white/10'
    }`}>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <Link
        href={buttonHref}
        className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
          variant === 'primary'
            ? 'bg-violet-600 hover:bg-violet-700 text-white'
            : 'bg-white/10 hover:bg-white/20 text-white'
        }`}
      >
        {buttonText}
        <span>→</span>
      </Link>
    </div>
  )
}

// MDX components mapping
export const mdxComponents = {
  // HTML elements
  a: ({ href, children, ...props }: any) => {
    const isExternal = href?.startsWith('http')
    return (
      <Link
        href={href || '#'}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'nofollow noopener noreferrer' : undefined}
        className="text-violet-400 hover:text-violet-300 underline underline-offset-4"
        {...props}
      >
        {children}
      </Link>
    )
  },
  img: ({ src, alt, ...props }: any) => (
    <Image
      src={src}
      alt={alt || ''}
      width={800}
      height={400}
      className="rounded-lg my-6"
      {...props}
    />
  ),
  pre: CodeBlock,

  // Custom components
  Callout,
  VideoEmbed,
  CTABox,
  Image,
  Link,

  // Typography styles
  h1: ({ children, ...props }: any) => (
    <h1 className="text-4xl font-bold text-white mb-6 mt-8" style={{ fontFamily: '"Manrope", sans-serif' }} {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: any) => (
    <h2 className="text-3xl font-bold text-white mb-4 mt-8" style={{ fontFamily: '"Manrope", sans-serif' }} {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: any) => (
    <h3 className="text-2xl font-bold text-white mb-3 mt-6" style={{ fontFamily: '"Manrope", sans-serif' }} {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }: any) => (
    <p className="text-gray-300 mb-4 leading-relaxed" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }: any) => (
    <ul className="list-disc list-inside text-gray-300 mb-4 space-y-2" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }: any) => (
    <ol className="list-decimal list-inside text-gray-300 mb-4 space-y-2" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }: any) => (
    <li className="text-gray-300" {...props}>
      {children}
    </li>
  ),
  blockquote: ({ children, ...props }: any) => (
    <blockquote className="border-l-4 border-violet-500 pl-4 my-6 italic text-gray-400" {...props}>
      {children}
    </blockquote>
  ),
  code: ({ children, ...props }: any) => (
    <code className="bg-white/10 px-2 py-1 rounded text-violet-400 font-mono text-sm" {...props}>
      {children}
    </code>
  ),
  hr: (props: any) => (
    <hr className="border-white/10 my-8" {...props} />
  ),
  table: ({ children, ...props }: any) => (
    <div className="overflow-x-auto my-6">
      <table className="w-full text-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ children, ...props }: any) => (
    <th className="text-left font-bold text-white p-2 border-b border-white/20" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }: any) => (
    <td className="p-2 border-b border-white/10" {...props}>
      {children}
    </td>
  ),
}