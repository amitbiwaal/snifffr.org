import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { cache } from 'react'
import { z } from 'zod'
import { sanitizePostHtml } from './html'
import { slugify, stripHtml, truncate } from './text'
import { site } from './site'

/**
 * Posts are stored as one JSON file per post in /content/posts.
 * No database needed: works on any Node host with a persistent disk (VPS, Docker, etc.).
 */
export const CONTENT_DIR = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(process.cwd(), 'content')
const POSTS_DIR = path.join(CONTENT_DIR, 'posts')

const isoDate = z.string().refine((v) => !Number.isNaN(Date.parse(v)), 'Invalid date')

export const postSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  previousSlugs: z.array(z.string()).default([]),
  title: z.string().min(1),
  excerpt: z.string().default(''),
  content: z.string().default(''),
  coverImage: z.string().default(''),
  coverAlt: z.string().default(''),
  category: z.string().default('Guides'),
  tags: z.array(z.string()).default([]),
  author: z.string().default(site.defaultAuthor),
  status: z.enum(['draft', 'published']),
  publishedAt: isoDate,
  createdAt: isoDate,
  updatedAt: isoDate,
  seo: z
    .object({
      metaTitle: z.string().default(''),
      metaDescription: z.string().default(''),
      focusKeyword: z.string().default(''),
      canonical: z.string().default(''),
      noindex: z.boolean().default(false),
    })
    .default({ metaTitle: '', metaDescription: '', focusKeyword: '', canonical: '', noindex: false }),
})

export type Post = z.infer<typeof postSchema>

/** What the admin editor sends when saving. */
export const postInputSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(200),
  slug: z.string().trim().max(80).default(''),
  excerpt: z.string().trim().max(400, 'Excerpt must be 400 characters or fewer').default(''),
  content: z.string().max(3_000_000).default(''),
  coverImage: z
    .string()
    .trim()
    .max(500)
    .refine((v) => v === '' || v.startsWith('/') || /^https:\/\//.test(v), 'Cover image must be an uploaded image or an https URL')
    .default(''),
  coverAlt: z.string().trim().max(200).default(''),
  category: z.string().trim().max(60).default('Guides'),
  tags: z.array(z.string().trim().min(1).max(40)).max(20).default([]),
  author: z.string().trim().max(80).default(''),
  status: z.enum(['draft', 'published']),
  publishedAt: z.string().default(''),
  seo: z.object({
    metaTitle: z.string().trim().max(120).default(''),
    metaDescription: z.string().trim().max(320).default(''),
    focusKeyword: z.string().trim().max(80).default(''),
    canonical: z
      .string()
      .trim()
      .max(500)
      .refine((v) => v === '' || /^https?:\/\//.test(v), 'Canonical URL must start with http(s)://')
      .default(''),
    noindex: z.boolean().default(false),
  }),
})

export type PostInput = z.input<typeof postInputSchema>

async function ensureDir() {
  await fs.mkdir(POSTS_DIR, { recursive: true })
}

function fileFor(id: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new Error('Invalid post id')
  return path.join(POSTS_DIR, `${id}.json`)
}

async function readAllFromDisk(): Promise<Post[]> {
  await ensureDir()
  const files = (await fs.readdir(POSTS_DIR)).filter((f) => f.endsWith('.json'))
  const posts = await Promise.all(
    files.map(async (file) => {
      try {
        const raw = JSON.parse(await fs.readFile(path.join(POSTS_DIR, file), 'utf8'))
        return postSchema.parse(raw)
      } catch (err) {
        console.error(`[posts] Skipping unreadable post file ${file}:`, err)
        return null
      }
    }),
  )
  return posts
    .filter((p): p is Post => p !== null)
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt))
}

/** Every post, drafts included (admin use). Deduplicated per request. */
export const getAllPosts = cache(readAllFromDisk)

export function isLive(post: Post, now = Date.now()) {
  return post.status === 'published' && Date.parse(post.publishedAt) <= now
}

export type PostState = 'published' | 'scheduled' | 'draft'

export function postState(post: Post, now = Date.now()): PostState {
  if (post.status === 'draft') return 'draft'
  return isLive(post, now) ? 'published' : 'scheduled'
}

/** Published posts whose publish date has passed, newest first. */
export async function getPublishedPosts() {
  const now = Date.now()
  return (await getAllPosts()).filter((p) => isLive(p, now))
}

export async function getPostById(id: string) {
  return (await getAllPosts()).find((p) => p.id === id) ?? null
}

export async function getPublishedPostBySlug(slug: string) {
  return (await getPublishedPosts()).find((p) => p.slug === slug) ?? null
}

/** Finds a live post that used to live at `slug`, so old URLs can 301 to the new one. */
export async function findPostByPreviousSlug(slug: string) {
  return (await getPublishedPosts()).find((p) => p.previousSlugs.includes(slug)) ?? null
}

export type Category = { name: string; slug: string; count: number }

export async function getCategories(): Promise<Category[]> {
  const map = new Map<string, Category>()
  for (const post of await getPublishedPosts()) {
    const slug = slugify(post.category)
    if (!slug) continue
    const existing = map.get(slug)
    if (existing) existing.count++
    else map.set(slug, { name: post.category, slug, count: 1 })
  }
  return [...map.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}

export async function getRelatedPosts(post: Post, limit = 3) {
  const others = (await getPublishedPosts()).filter((p) => p.id !== post.id)
  const score = (p: Post) =>
    (p.category === post.category ? 3 : 0) + p.tags.filter((t) => post.tags.includes(t)).length
  return others
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || Date.parse(b.p.publishedAt) - Date.parse(a.p.publishedAt))
    .slice(0, limit)
    .map(({ p }) => p)
}

export async function searchPosts(query: string) {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return []
  return (await getPublishedPosts()).filter((p) => {
    const haystack = `${p.title} ${p.excerpt} ${p.category} ${p.tags.join(' ')} ${stripHtml(p.content)}`.toLowerCase()
    return terms.every((t) => haystack.includes(t))
  })
}

// These collide with /blog/page/[n] and /blog/category/[slug].
const RESERVED_SLUGS = new Set(['page', 'category', 'feed', 'search'])

export class PostValidationError extends Error {
  constructor(public fieldErrors: Record<string, string>) {
    super('Post validation failed')
  }
}

async function writeAtomic(file: string, data: string) {
  const tmp = `${file}.${randomUUID()}.tmp`
  await fs.writeFile(tmp, data, 'utf8')
  await fs.rename(tmp, file)
}

export async function savePost(input: PostInput): Promise<Post> {
  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path.join('.') || 'form'
      fieldErrors[key] ??= issue.message
    }
    throw new PostValidationError(fieldErrors)
  }
  const data = parsed.data
  await ensureDir()

  // Read straight from disk: React's per-request cache could be stale inside a mutation.
  const all = await readAllFromDisk()
  const existing = data.id ? all.find((p) => p.id === data.id) : undefined
  if (data.id && !existing) throw new PostValidationError({ form: 'This post no longer exists.' })

  const slug = slugify(data.slug || data.title)
  if (!slug) throw new PostValidationError({ slug: 'Slug must contain letters or numbers.' })
  if (RESERVED_SLUGS.has(slug)) throw new PostValidationError({ slug: `"${slug}" is reserved. Please choose another slug.` })
  const clash = all.find((p) => p.id !== existing?.id && (p.slug === slug || p.previousSlugs.includes(slug)))
  if (clash) throw new PostValidationError({ slug: `The URL "/blog/${slug}" is already used by "${clash.title}".` })

  let publishedAt: string
  if (data.publishedAt && !Number.isNaN(Date.parse(data.publishedAt))) {
    publishedAt = new Date(data.publishedAt).toISOString()
  } else if (existing && existing.status === 'published') {
    publishedAt = existing.publishedAt
  } else {
    publishedAt = new Date().toISOString()
  }

  const content = sanitizePostHtml(data.content)
  const now = new Date().toISOString()
  const previousSlugs = new Set(existing?.previousSlugs ?? [])
  // Only keep a redirect for slugs that were actually public.
  if (existing && existing.slug !== slug && existing.status === 'published') previousSlugs.add(existing.slug)
  previousSlugs.delete(slug)

  const post: Post = postSchema.parse({
    id: existing?.id ?? randomUUID(),
    slug,
    previousSlugs: [...previousSlugs],
    title: data.title,
    excerpt: data.excerpt || truncate(stripHtml(content), 180),
    content,
    coverImage: data.coverImage,
    coverAlt: data.coverAlt,
    category: data.category || 'Guides',
    tags: [...new Set(data.tags)],
    author: data.author || site.defaultAuthor,
    status: data.status,
    publishedAt,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
    seo: data.seo,
  })

  await writeAtomic(fileFor(post.id), `${JSON.stringify(post, null, 2)}\n`)
  return post
}

export async function deletePost(id: string) {
  const all = await readAllFromDisk()
  const post = all.find((p) => p.id === id)
  if (!post) return null
  await fs.rm(fileFor(id), { force: true })
  return post
}
