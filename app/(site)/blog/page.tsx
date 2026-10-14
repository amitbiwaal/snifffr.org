import { CategoryBar, Pagination, PostList, SearchForm, paginate } from '@/components/BlogIndex'
import { CtaSection } from '@/components/CtaSection'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { collectionPageJsonLd, pageMetadata } from '@/lib/seo'

export const revalidate = 3600

export const metadata = pageMetadata({
  title: 'Blog: Guides to Selling Feet Pics Online Safely',
  description:
    'Practical guides on how to sell feet pics online: pricing, photography, privacy, avoiding scams and growing a steady income on Snifffr.',
  path: '/blog',
})

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()])
  const { items, totalPages } = paginate(posts, 1)

  return (
    <>
      <JsonLd data={collectionPageJsonLd('Snifffr Blog', '/blog', items)} />
      <PageHero
        crumbs={[{ name: 'Blog', path: '/blog' }]}
        eyebrow="The Snifffr Blog"
        title="Guides to Selling Feet Pics Online"
        lede="Step-by-step tutorials, pricing advice and privacy checklists for creators who want to earn safely and anonymously."
      >
        <SearchForm />
      </PageHero>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">
          <CategoryBar categories={categories} />
          <PostList posts={items} featureFirst />
          <Pagination page={1} totalPages={totalPages} basePath="/blog" />
        </div>
      </section>
      <CtaSection />
    </>
  )
}
