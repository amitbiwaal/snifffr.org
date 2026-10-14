import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Article } from '@/components/Article'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'
import { requireAdmin } from '@/lib/auth'
import { getPostById, isLive } from '@/lib/posts'

export const metadata: Metadata = { title: 'Preview', robots: { index: false, follow: false } }

/** Lets editors see drafts and scheduled posts exactly as they will look on the site. */
export default async function PreviewPage(props: PageProps<'/admin/preview/[id]'>) {
  await requireAdmin()
  const { id } = await props.params
  const post = await getPostById(id)
  if (!post) notFound()

  return (
    <>
      <div className="preview-bar">
        <strong>Preview</strong> — this {isLive(post) ? 'post is live' : post.status === 'draft' ? 'draft is not public yet' : 'post is scheduled'}.{' '}
        <Link href={`/admin/posts/${post.id}`}>Back to editor</Link>
      </div>
      <SiteHeader />
      <main id="main">
        <Article post={post} related={[]} />
      </main>
      <SiteFooter />
    </>
  )
}
