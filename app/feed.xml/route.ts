import { getPublishedPosts } from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

export const dynamic = 'force-static'
export const revalidate = 3600

function xml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

/** RSS 2.0 feed of the 30 latest posts. */
export async function GET() {
  const posts = (await getPublishedPosts()).filter((p) => !p.seo.noindex).slice(0, 30)
  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`)
      return `    <item>
      <title>${xml(p.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
      <category>${xml(p.category)}</category>
      <dc:creator>${xml(p.author)}</dc:creator>
      <description>${xml(p.excerpt)}</description>
      <content:encoded><![CDATA[${p.content.replace(/]]>/g, ']]]]><![CDATA[>')}]]></content:encoded>
    </item>`
    })
    .join('\n')

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xml(site.siteName)} Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <atom:link href="${absoluteUrl('/feed.xml')}" rel="self" type="application/rss+xml" />
    <description>${xml('Guides to selling feet pics online safely and anonymously.')}</description>
    <language>en</language>
    <lastBuildDate>${new Date(posts[0]?.updatedAt ?? Date.now()).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`
  return new Response(body, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  })
}
