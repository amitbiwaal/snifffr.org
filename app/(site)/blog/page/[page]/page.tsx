import type { Metadata } from 'next'
import { notFound, permanentRedirect } from 'next/navigation'
import { CategoryBar, Pagination, PostList, paginate, POSTS_PER_PAGE } from '@/components/BlogIndex'
import { PageHero } from '@/components/PageHero'
import { getCategories, getPublishedPosts } from '@/lib/posts'
import { pageMetadata } from '@/lib/seo'

export const revalidate = 3600

export async function generateStaticParams() {
  const total = Math.ceil((await getPublishedPosts()).length / POSTS_PER_PAGE)
  return Array.from({ length: Math.max(0, total - 1) }, (_, i) => ({ page: String(i + 2) }))
}

export async function generateMetadata(props: PageProps<'/blog/page/[page]'>): Promise<Metadata> {
  const { page } = await props.params
  return pageMetadata({
    title: `Blog — Page ${page}`,
    description: `Older guides to selling feet pics online safely and anonymously, page ${page}.`,
    path: `/blog/page/${page}`,
  })
}

export default async function BlogPaginatedPage(props: PageProps<'/blog/page/[page]'>) {
  const { page: raw } = await props.params
  const page = Number(raw)
  if (!Number.isInteger(page) || page < 1 || String(page) !== raw) notFound()
  if (page === 1) permanentRedirect('/blog')

  const [posts, categories] = await Promise.all([getPublishedPosts(), getCategories()])
  const { items, totalPages } = paginate(posts, page)
  if (page > totalPages) notFound()

  return (
    <>
      <PageHero
        crumbs={[
          { name: 'Blog', path: '/blog' },
          { name: `Page ${page}`, path: `/blog/page/${page}` },
        ]}
        eyebrow="The Snifffr Blog"
        title={`Guides to Selling Feet Pics Online — Page ${page}`}
      />
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">
          <CategoryBar categories={categories} />
          <PostList posts={items} />
          <Pagination page={page} totalPages={totalPages} basePath="/blog" />
        </div>
      </section>
    </>
  )
}
