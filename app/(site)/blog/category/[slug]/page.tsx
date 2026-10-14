import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CategoryBar, PostList } from '@/components/BlogIndex'
import { CtaSection } from '@/components/CtaSection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { collectionPageJsonLd, pageMetadata } from '@/lib/seo'
import { slugify } from '@/lib/text'

export const revalidate = 3600

export async function generateStaticParams() {
  return (await getCategories()).map((c) => ({ slug: c.slug }))
}

async function load(slug: string) {
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return null
  const posts = (await getPublishedPosts()).filter((p) => slugify(p.category) === slug)
  return { category, categories, posts }
}

export async function generateMetadata(props: PageProps<'/blog/category/[slug]'>): Promise<Metadata> {
  const { slug } = await props.params
  const data = await load(slug)
  if (!data) return { title: 'Category not found', robots: { index: false } }
  return pageMetadata({
    title: `${data.category.name}: Articles on Selling Feet Pics`,
    description: `All ${data.category.name.toLowerCase()} articles from the Snifffr blog: practical advice for selling feet pics online safely and anonymously.`,
    path: `/blog/category/${slug}`,
  })
}

export default async function CategoryPage(props: PageProps<'/blog/category/[slug]'>) {
  const { slug } = await props.params
  const data = await load(slug)
  if (!data) notFound()
  const { category, categories, posts } = data

  return (
    <>
      <JsonLd data={collectionPageJsonLd(`${category.name} articles`, `/blog/category/${slug}`, posts)} />
      <PageHero
        crumbs={[
          { name: 'Blog', path: '/blog' },
          { name: category.name, path: `/blog/category/${slug}` },
        ]}
        eyebrow="Category"
        title={category.name}
        lede={`${posts.length} ${posts.length === 1 ? 'article' : 'articles'} about ${category.name.toLowerCase()} for feet pic sellers.`}
      />
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">
          <CategoryBar categories={categories} active={slug} />
          <PostList posts={posts} />
        </div>
      </section>
      <CtaSection />
    </>
  )
}
