import { Metadata } from 'next'
import { getPostBySlug, getAllPosts, BlogPost, formatDate } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import { compileMDX } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/weokto/mdx/MDXComponents'
import BlogFooter from '@/components/weokto/BlogFooter'
import Link from 'next/link'
import Image from 'next/image'
import remarkGfm from 'remark-gfm'
import BlogPostClient from './BlogPostClient'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts()
  return posts.map((post: BlogPost) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Article non trouvé - Blog Weokto',
      description: 'L\'article que vous recherchez n\'existe pas.'
    }
  }

  const seoTitle = post.seo?.metaTitle || `${post.title} - Blog Weokto`
  const seoDescription = post.seo?.metaDescription || post.excerpt
  const seoKeywords = post.seo?.keywords || post.tags

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: seoKeywords.join(', '),
    authors: [{ name: post.author.name }],
    openGraph: {
      title: seoTitle,
      description: seoDescription,
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
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: post.featuredImage ? [post.featuredImage] : []
    },
    alternates: {
      canonical: `/blog/post/${post.slug}`
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getPostBySlug(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  // Compile MDX content
  const { content } = await compileMDX<{ title: string }>({
    source: post.content || '',
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  })

  return <BlogPostClient post={post} content={content} />
}