import { getAllPosts, BlogPost } from '@/lib/mdx'

export async function GET() {
  const posts = await getAllPosts()
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://weokto.com'

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Blog Weokto</title>
    <link>${siteUrl}/blog</link>
    <description>Conseils, tutoriels et success stories pour réussir dans le community building</description>
    <language>fr</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    ${posts.map((post: BlogPost) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/post/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/post/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <author>${post.author.name}</author>
      <category>${post.category}</category>
      ${post.tags.map((tag: string) => `<category>${tag}</category>`).join('\n      ')}
      ${post.featuredImage ? `<enclosure url="${post.featuredImage}" type="image/jpeg"/>` : ''}
    </item>`).join('\n')}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}