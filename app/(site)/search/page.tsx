import type { Metadata } from 'next'
import { PostList, SearchForm } from '@/components/BlogIndex'
import { PageHero } from '@/components/PageHero'
import { searchPosts } from '@/lib/posts'

// Search result pages are thin, near-duplicate content: keep them out of the index.
export const metadata: Metadata = {
  title: 'Search',
  robots: { index: false, follow: true },
  alternates: { canonical: '/search' },
}

export default async function SearchPage(props: PageProps<'/search'>) {
  const { q } = await props.searchParams
  const query = (Array.isArray(q) ? q[0] : q)?.trim().slice(0, 100) ?? ''
  const results = query ? await searchPosts(query) : []

  return (
    <>
      <PageHero
        crumbs={[{ name: 'Search', path: '/search' }]}
        title={query ? `Search results for “${query}”` : 'Search the blog'}
        lede={query ? `${results.length} ${results.length === 1 ? 'article' : 'articles'} found.` : 'Find guides on pricing, privacy, photography and more.'}
      >
        <SearchForm defaultValue={query} />
      </PageHero>
      <section style={{ paddingTop: 36 }}>
        <div className="wrap">{query && <PostList posts={results} />}</div>
      </section>
    </>
  )
}
