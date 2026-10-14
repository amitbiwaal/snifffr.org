import type { MetadataRoute } from 'next'
import { POSTS_PER_PAGE } from '@/components/BlogIndex'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

const staticPages: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'] }[] = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/how-it-works', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/features', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/safety', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/faq', priority: 0.7, changeFrequency: 'monthly' },
  { path: '/about', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/contact', priority: 0.4, changeFrequency: 'yearly' },
  { path: '/privacy-policy', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/terms', priority: 0.2, changeFrequency: 'yearly' },
  { path: '/affiliate-disclosure', priority: 0.2, changeFrequency: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()])
  const indexable = posts.filter((p) => !p.seo.noindex && !p.seo.canonical)
  const lastPostDate = posts[0] ? new Date(posts[0].updatedAt) : new Date('2026-10-14')
  const siteUpdated = new Date('2026-10-14')

  const pages: MetadataRoute.Sitemap = staticPages.map((p) => ({
    url: absoluteUrl(p.path),
    lastModified: p.path === '/' && lastPostDate > siteUpdated ? lastPostDate : siteUpdated,
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }))

  const blogIndex: MetadataRoute.Sitemap = [
    { url: absoluteUrl('/blog'), lastModified: lastPostDate, changeFrequency: 'daily', priority: 0.9 },
  ]
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE)
  for (let n = 2; n <= totalPages; n++) {
    blogIndex.push({ url: absoluteUrl(`/blog/page/${n}`), lastModified: lastPostDate, changeFrequency: 'weekly', priority: 0.4 })
  }

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/blog/category/${c.slug}`),
    lastModified: lastPostDate,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const postPages: MetadataRoute.Sitemap = indexable.map((p) => ({
    url: absoluteUrl(`/blog/${p.slug}`),
    lastModified: new Date(p.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
    images: p.coverImage ? [absoluteUrl(p.coverImage)] : undefined,
  }))

  return [...pages, ...blogIndex, ...categoryPages, ...postPages]
}
