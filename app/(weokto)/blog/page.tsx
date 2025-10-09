import { getAllPosts } from '@/lib/mdx'
import BlogListClient from './BlogListClient'
import { Suspense } from 'react'

export const metadata = {
  title: 'Blog - Weokto',
  description: 'Conseils, tutoriels et success stories pour réussir dans le community building',
}

export default async function BlogPage() {
  const posts = await getAllPosts()

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      <BlogListClient posts={posts} />
    </Suspense>
  )
}