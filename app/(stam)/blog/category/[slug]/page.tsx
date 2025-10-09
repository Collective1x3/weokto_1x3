import { Suspense } from 'react'
import { notFound } from 'next/navigation'
import { getAllStamPosts } from '@/lib/stam-mdx'
import StamCategoryClient from '@/components/weokto/stam/blog/StamCategoryClient'

interface Props {
  params: Promise<{ slug: string }>
}

const categories = [
  { id: 'guides', label: 'Guides pratiques' },
  { id: 'annonces', label: 'Annonces produit' },
  { id: 'success-stories', label: 'Success Stories' }
]

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const category = categories.find(c => c.id === slug)

  if (!category) {
    return {
      title: 'Catégorie non trouvée',
      description: 'Cette catégorie n\'existe pas.'
    }
  }

  return {
    title: `${category.label} - Blog STAM`,
    description: `Tous les articles de la catégorie ${category.label}`
  }
}

export default async function StamBlogCategoryPage({ params }: Props) {
  const { slug } = await params
  const category = categories.find(c => c.id === slug)

  if (!category) {
    notFound()
  }

  const allPosts = await getAllStamPosts()
  const categoryPosts = allPosts.filter(post => post.category === slug)

  return (
    <Suspense fallback={<div className="min-h-[50vh] bg-white/5" />}>
      <StamCategoryClient
        posts={categoryPosts}
        category={category}
        allCategories={categories}
      />
    </Suspense>
  )
}
