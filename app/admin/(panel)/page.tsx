import type { Metadata } from 'next'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getAllPosts, postState } from '@/lib/posts'
import { formatDate } from '@/lib/text'
import { DeletePostButton } from './DeletePostButton'

export const metadata: Metadata = { title: 'Posts' }

type Filter = 'all' | 'published' | 'scheduled' | 'draft'

export default async function AdminDashboard(props: PageProps<'/admin'>) {
  await requireAdmin()
  const sp = await props.searchParams
  const filter = (['all', 'published', 'scheduled', 'draft'].includes(String(sp.status)) ? sp.status : 'all') as Filter
  const q = typeof sp.q === 'string' ? sp.q.trim().toLowerCase() : ''

  const posts = await getAllPosts()
  const stateOf = (p: (typeof posts)[number]) => postState(p)
  const counts = { all: posts.length, published: 0, scheduled: 0, draft: 0 }
  for (const p of posts) counts[stateOf(p)]++

  const visible = posts.filter(
    (p) => (filter === 'all' || stateOf(p) === filter) && (!q || p.title.toLowerCase().includes(q)),
  )

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Posts</h1>
          <p className="admin-muted">Write, edit and publish blog articles.</p>
        </div>
        <Link className="admin-btn primary" href="/admin/posts/new">
          + New post
        </Link>
      </header>

      {sp.deleted && <div className="admin-alert ok">Post deleted.</div>}

      <div className="admin-stats">
        {(['all', 'published', 'scheduled', 'draft'] as const).map((k) => (
          <Link key={k} href={k === 'all' ? '/admin' : `/admin?status=${k}`} className="admin-stat" aria-current={filter === k ? 'page' : undefined}>
            <strong>{counts[k]}</strong>
            <span>{k === 'all' ? 'All posts' : k[0].toUpperCase() + k.slice(1)}</span>
          </Link>
        ))}
      </div>

      <form className="admin-search" action="/admin" method="get">
        {filter !== 'all' && <input type="hidden" name="status" value={filter} />}
        <input type="search" name="q" placeholder="Search posts by title…" defaultValue={q} aria-label="Search posts" />
        <button className="admin-btn" type="submit">
          Search
        </button>
      </form>

      {visible.length === 0 ? (
        <div className="admin-empty">
          <p>No posts found.</p>
          <Link className="admin-btn primary" href="/admin/posts/new">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Category</th>
                <th>Date</th>
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {visible.map((p) => {
                const state = stateOf(p)
                return (
                  <tr key={p.id}>
                    <td data-label="Title">
                      <Link href={`/admin/posts/${p.id}`} className="admin-title-link">
                        {p.title}
                      </Link>
                      <div className="admin-muted small">/blog/{p.slug}</div>
                    </td>
                    <td data-label="Status">
                      <span className={`admin-status ${state}`}>{state}</span>
                    </td>
                    <td data-label="Category">{p.category}</td>
                    <td data-label="Date">
                      {formatDate(p.publishedAt)}
                      <div className="admin-muted small">Updated {formatDate(p.updatedAt)}</div>
                    </td>
                    <td className="admin-row-actions">
                      <Link className="admin-btn small" href={`/admin/posts/${p.id}`}>
                        Edit
                      </Link>
                      {state === 'published' ? (
                        <a className="admin-btn small ghost" href={`/blog/${p.slug}`} target="_blank" rel="noopener">
                          View
                        </a>
                      ) : (
                        <a className="admin-btn small ghost" href={`/admin/preview/${p.id}`} target="_blank" rel="noopener">
                          Preview
                        </a>
                      )}
                      <DeletePostButton id={p.id} title={p.title} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
