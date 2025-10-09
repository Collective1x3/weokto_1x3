import { getAllPosts, getCategories, BlogPost } from '@/lib/mdx'

export async function GET() {
  const posts = await getAllPosts()
  const categories = await getCategories()
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://weokto.com'

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Blog Home -->
  <url>
    <loc>${siteUrl}/blog</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>

  <!-- Categories -->
  ${categories.map(({ name }) => `
  <url>
    <loc>${siteUrl}/blog/category/${name}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}

  <!-- Blog Posts -->
  ${posts.map((post: BlogPost) => `
  <url>
    <loc>${siteUrl}/blog/post/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.publishedAt}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}