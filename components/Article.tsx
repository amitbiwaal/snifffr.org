import Image from 'next/image'
import Link from 'next/link'
import { AffiliateLink } from './AffiliateLink'
import { Breadcrumbs } from './Breadcrumbs'
import { PostCard } from './PostCard'
import { enhancePostHtml } from '@/lib/html'
import type { Post } from '@/lib/posts'
import { formatDate, readingMinutes, slugify } from '@/lib/text'

export function Article({ post, related }: { post: Post; related: Post[] }) {
  const { html, toc: allHeadings } = enhancePostHtml(post.content)
  // Long articles: list only the main (H2) sections so the contents box stays scannable.
  const toc = allHeadings.length > 12 ? allHeadings.filter((h) => h.level === 2) : allHeadings
  const categorySlug = slugify(post.category)
  const updated = post.updatedAt.slice(0, 10) !== post.publishedAt.slice(0, 10)
  const initials = post.author
    .split(/\s+/)
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <article>
      <header className="article-header">
        <div className="wrap">
          <div className="article-head-inner">
            <Breadcrumbs
              items={[
                { name: 'Blog', path: '/blog' },
                { name: post.category, path: `/blog/category/${categorySlug}` },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
            <Link className="chip" href={`/blog/category/${categorySlug}`}>
              {post.category}
            </Link>
            <h1>{post.title}</h1>
            {post.excerpt && <p className="lede">{post.excerpt}</p>}
            <div className="byline">
              <span className="avatar" aria-hidden="true">
                {initials}
              </span>
              <div>
                <strong>{post.author}</strong>
                <div className="meta">
                  <span>
                    Published <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </span>
                  {updated && (
                    <span className="dot">
                      Updated <time dateTime={post.updatedAt}>{formatDate(post.updatedAt)}</time>
                    </span>
                  )}
                  <span className="dot">{readingMinutes(post.content)} min read</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className={`wrap article-layout${toc.length >= 3 ? '' : ' no-toc'}`}>
        {post.coverImage && (
          <figure className="cover">
            <Image
              src={post.coverImage}
              alt={post.coverAlt || post.title}
              fill
              priority
              sizes="(max-width: 960px) 100vw, 780px"
            />
          </figure>
        )}
        <div className="article-body">
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

          <aside className="callout" aria-label="Start selling">
            <h2 style={{ fontSize: '1.35rem' }}>Ready to start selling feet pics safely?</h2>
            <p>
              Create a free, anonymous Snifffr account: no face, no real name and payouts handled for you. Most sellers
              list their first set the same day.
            </p>
            <AffiliateLink className="btn btn-sm">Start Selling on Snifffr</AffiliateLink>
          </aside>

          {post.tags.length > 0 && (
            <ul className="tag-list" aria-label="Tags">
              {post.tags.map((t) => (
                <li key={t}>#{t}</li>
              ))}
            </ul>
          )}
        </div>

        {toc.length >= 3 && (
          <div className="toc-wrap">
            <nav className="toc" aria-label="Table of contents">
              <details open>
                <summary>On this page</summary>
                <ol>
                  {toc.map((item) => (
                    <li key={item.id} className={`lvl-${item.level}`}>
                      <a href={`#${item.id}`}>{item.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            </nav>
          </div>
        )}
      </div>

      {related.length > 0 && (
        <section className="soft" aria-labelledby="related-heading">
          <div className="wrap">
            <h2 id="related-heading">Keep Reading</h2>
            <div className="post-grid mt-s">
              {related.map((p) => (
                <PostCard key={p.id} post={p} headingLevel="h3" />
              ))}
            </div>
          </div>
        </section>
      )}
    </article>
  )
}
