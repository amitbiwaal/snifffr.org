import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { PostEditor } from '@/components/admin/PostEditor'
import { requireAdmin } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'Edit post' }

export default async function EditPostPage(props: PageProps<'/admin/posts/[id]'>) {
  await requireAdmin()
  const [{ id }, sp] = await Promise.all([props.params, props.searchParams])
  const posts = await getAllPosts()
  const post = posts.find((p) => p.id === id)
  if (!post) notFound()
  const categories = [...new Set(posts.map((p) => p.category))].sort()
  const justSaved = sp.saved === 'draft' || sp.saved === 'published' ? sp.saved : undefined
  return (
    <PostEditor
      key={post.id}
      post={post}
      categories={categories}
      defaultAuthor={site.defaultAuthor}
      siteUrl={site.url}
      justSaved={justSaved}
    />
  )
}
