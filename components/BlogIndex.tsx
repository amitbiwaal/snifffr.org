import Link from 'next/link'
import { PostCard } from './PostCard'
import type { Category, Post } from '@/lib/posts'

export const POSTS_PER_PAGE = 9

export function paginate<T>(items: T[], page: number) {
  const totalPages = Math.max(1, Math.ceil(items.length / POSTS_PER_PAGE))
  const start = (page - 1) * POSTS_PER_PAGE
  return { items: items.slice(start, start + POSTS_PER_PAGE), totalPages }
}

export function CategoryBar({ categories, active }: { categories: Category[]; active?: string }) {
  if (!categories.length) return null
  return (
    <nav className="cat-bar" aria-label="Blog categories">
      <Link href="/blog" aria-current={!active ? 'page' : undefined}>
        All articles
      </Link>
      {categories.map((c) => (
        <Link key={c.slug} href={`/blog/category/${c.slug}`} aria-current={active === c.slug ? 'page' : undefined}>
          {c.name} ({c.count})
        </Link>
      ))}
    </nav>
  )
}

export function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form className="search-form" action="/search" method="get" role="search">
      <label htmlFor="blog-search" className="sr-only">
        Search articles
      </label>
      <input id="blog-search" type="search" name="q" placeholder="Search articles…" defaultValue={defaultValue} />
      <button className="btn btn-sm" type="submit">
        Search
      </button>
    </form>
  )
}

export function PostList({ posts, featureFirst = false }: { posts: Post[]; featureFirst?: boolean }) {
  if (!posts.length) {
    return (
      <div className="empty-state">
        <h2 style={{ fontSize: '1.3rem' }}>No articles here yet</h2>
        <p>New guides are on the way. In the meantime, read our privacy &amp; safety guide.</p>
        <Link className="btn btn-sm" href="/safety">
          Read the Safety Guide
        </Link>
      </div>
    )
  }
  const [first, ...rest] = posts
  return (
    <>
      {featureFirst && (
        <div style={{ marginBottom: 24 }}>
          <PostCard post={first} featured />
        </div>
      )}
      <div className="post-grid">
        {(featureFirst ? rest : posts).map((p) => (
          <PostCard key={p.id} post={p} />
        ))}
      </div>
    </>
  )
}

export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null
  const href = (n: number) => (n === 1 ? basePath : `${basePath}/page/${n}`)
  return (
    <nav className="pagination" aria-label="Pagination">
      {page > 1 && (
        <Link href={href(page - 1)} rel="prev">
          ← Newer
        </Link>
      )}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) =>
        n === page ? (
          <span key={n} aria-current="page">
            {n}
          </span>
        ) : (
          <Link key={n} href={href(n)}>
            {n}
          </Link>
        ),
      )}
      {page < totalPages && (
        <Link href={href(page + 1)} rel="next">
          Older →
        </Link>
      )}
    </nav>
  )
}
