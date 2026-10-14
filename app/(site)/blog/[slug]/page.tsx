import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { Article } from '@/components/Article'
import { CtaSection } from '@/components/CtaSection'
import { JsonLd } from '@/components/JsonLd'
import {
  findPostByPreviousSlug,
  getPublishedPostBySlug,
  getPublishedPosts,
  getRelatedPosts,
} from '@/lib/posts'
import { blogPostingJsonLd, pageMetadata } from '@/lib/seo'
import { countWords, stripHtml } from '@/lib/text'

// Hourly re-render lets scheduled posts appear; saves in the CMS revalidate instantly.
export const revalidate = 3600

export async function generateStaticParams() {
  return (await getPublishedPosts()).map((p) => ({ slug: p.slug }))
}

export async function generateMetadata(props: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return { title: 'Article not found', robots: { index: false } }

  const title = post.seo.metaTitle || post.title
  const description = post.seo.metaDescription || post.excerpt
  const base = pageMetadata({
    title,
    description,
    path: `/blog/${post.slug}`,
    absoluteTitle: Boolean(post.seo.metaTitle),
    type: 'article',
    image: { url: `/og/${post.slug}`, width: 1200, height: 630, alt: post.title },
  })

  return {
    ...base,
    alternates: { ...base.alternates, canonical: post.seo.canonical || `/blog/${post.slug}` },
    authors: [{ name: post.author }],
    keywords: [post.seo.focusKeyword, ...post.tags].filter(Boolean),
    category: post.category,
    openGraph: {
      ...base.openGraph,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author],
      section: post.category,
      tags: post.tags,
    },
    ...(post.seo.noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

export default async function BlogPostPage(props: PageProps<'/blog/[slug]'>) {
  const { slug } = await props.params
  const post = await getPublishedPostBySlug(slug)
  if (!post) {
    const moved = await findPostByPreviousSlug(slug)
    if (moved) permanentRedirect(`/blog/${moved.slug}`)
    notFound()
  }
  const related = await getRelatedPosts(post)

  return (
    <>
      <JsonLd data={blogPostingJsonLd(post, countWords(stripHtml(post.content)))} />
      <Article post={post} related={related} />
      <CtaSection />
    </>
  )
}
