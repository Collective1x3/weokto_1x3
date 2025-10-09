import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import { getAllStamPosts, getStamPostBySlug } from '@/lib/stam-mdx'
import type { BlogPost } from '@/lib/mdx-types'
import { mdxComponents } from '@/components/mdx/MDXComponents'
import StamBlogPostClient from '@/components/weokto/stam/blog/BlogPostClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllStamPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getStamPostBySlug(slug)

  if (!post) {
    return {
      title: 'Article STAM introuvable',
      description: "Le contenu demandé n'existe plus."
    }
  }

  const title = post.seo?.metaTitle || `${post.title} – Blog STAM`
  const description = post.seo?.metaDescription || post.excerpt
  const keywords = post.seo?.keywords || post.tags

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : []
    }
  }
}

export default async function StamBlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getStamPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const { content } = await compileMDX({
    source: post.content || '',
    components: mdxComponents,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  })

  const allPosts = await getAllStamPosts()
  const related = allPosts
    .filter((item) => item.slug !== post.slug)
    .filter((item) => item.category === post.category || item.tags.some((tag) => post.tags.includes(tag)))
    .slice(0, 2)

  return <StamBlogPostClient post={post} content={content} related={related} />
}
