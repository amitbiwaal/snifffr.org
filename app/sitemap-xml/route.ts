import { POSTS_PER_PAGE } from '@/components/BlogIndex'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

// Served at /sitemap.xml through a rewrite (next.config.ts). Next.js treats any route at
// /sitemap.xml as a metadata route, and on Vercel those are not purged by revalidatePath() after
// a CMS save; a normal route path is. Revalidate this destination path: '/sitemap-xml'.
export const dynamic = 'force-static'
export const revalidate = 3600

type Entry = { path: string; lastModified: Date; changeFrequency: string; priority: number; images?: string[] }

const SITE_UPDATED = new Date('2026-10-14')

const staticPages: [path: string, priority: number, changeFrequency: string][] = [
  ['/', 1, 'weekly'],
  ['/how-it-works', 0.9, 'monthly'],
  ['/features', 0.8, 'monthly'],
  ['/safety', 0.8, 'monthly'],
  ['/faq', 0.7, 'monthly'],
  ['/about', 0.6, 'yearly'],
  ['/contact', 0.4, 'yearly'],
  ['/privacy-policy', 0.2, 'yearly'],
  ['/terms', 0.2, 'yearly'],
  ['/affiliate-disclosure', 0.2, 'yearly'],
]

function xml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

export async function GET() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()])
  const lastPostDate = posts[0] ? new Date(posts[0].updatedAt) : SITE_UPDATED

  const entries: Entry[] = staticPages.map(([path, priority, changeFrequency]) => ({
    path,
    priority,
    changeFrequency,
    lastModified: path === '/' && lastPostDate > SITE_UPDATED ? lastPostDate : SITE_UPDATED,
  }))
  entries.push({ path: '/blog', lastModified: lastPostDate, changeFrequency: 'daily', priority: 0.9 })
  for (let n = 2; n <= Math.ceil(posts.length / POSTS_PER_PAGE); n++) {
    entries.push({ path: `/blog/page/${n}`, lastModified: lastPostDate, changeFrequency: 'weekly', priority: 0.4 })
  }
  for (const c of categories) {
    entries.push({ path: `/blog/category/${c.slug}`, lastModified: lastPostDate, changeFrequency: 'weekly', priority: 0.5 })
  }
  for (const p of posts.filter((p) => !p.seo.noindex && !p.seo.canonical)) {
    entries.push({
      path: `/blog/${p.slug}`,
      lastModified: new Date(p.updatedAt),
      changeFrequency: 'monthly',
      priority: 0.7,
      images: p.coverImage ? [absoluteUrl(p.coverImage)] : undefined,
    })
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries
  .map(
    (e) => `<url>
<loc>${xml(absoluteUrl(e.path))}</loc>
<lastmod>${e.lastModified.toISOString()}</lastmod>
<changefreq>${e.changeFrequency}</changefreq>
<priority>${e.priority}</priority>${(e.images ?? []).map((src) => `\n<image:image><image:loc>${xml(src)}</image:loc></image:image>`).join('')}
</url>`,
  )
  .join('\n')}
</urlset>
`
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } })
}
