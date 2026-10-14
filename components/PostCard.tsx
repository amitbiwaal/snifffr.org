import Image from 'next/image'
import Link from 'next/link'
import type { Post } from '@/lib/posts'
import { formatDate, readingMinutes, slugify } from '@/lib/text'

export function PostCard({
  post,
  featured = false,
  headingLevel = 'h2',
}: {
  post: Post
  featured?: boolean
  headingLevel?: 'h2' | 'h3'
}) {
  const Heading = headingLevel
  const href = `/blog/${post.slug}`
  return (
    <article className={`post-card${featured ? ' featured-post' : ''}`}>
      <div className="thumb">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || post.title}
            fill
            sizes={featured ? '(max-width: 880px) 100vw, 600px' : '(max-width: 560px) 100vw, (max-width: 880px) 50vw, 360px'}
            priority={featured}
          />
        ) : (
          <span className="thumb-fallback" aria-hidden="true">
            👣
          </span>
        )}
      </div>
      <div className="body">
        <div>
          <Link className="chip" href={`/blog/category/${slugify(post.category)}`}>
            {post.category}
          </Link>
        </div>
        <Heading>
          <Link href={href}>{post.title}</Link>
        </Heading>
        <p>{post.excerpt}</p>
        <div className="meta">
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          <span className="dot">{readingMinutes(post.content)} min read</span>
        </div>
      </div>
    </article>
  )
}
