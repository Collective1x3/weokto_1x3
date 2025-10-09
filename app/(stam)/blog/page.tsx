import { Suspense } from 'react'

import StamBlogListClient from '@/components/weokto/stam/blog/BlogListClient'
import { getAllStamPosts } from '@/lib/stam-mdx'

export const metadata = {
  title: 'Blog STAM',
  description: 'Updates produit, guides formation et annonces autour du module STAM.'
}

export default async function StamBlogPage() {
  const posts = await getAllStamPosts()

  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-white/5" />}>
      <StamBlogListClient posts={posts} />
    </Suspense>
  )
}
