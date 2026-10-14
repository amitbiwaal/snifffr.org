import type { Metadata } from 'next'
import { PostEditor } from '@/components/admin/PostEditor'
import { requireAdmin } from '@/lib/auth'
import { getAllPosts } from '@/lib/posts'
import { site } from '@/lib/site'

export const metadata: Metadata = { title: 'New post' }

export default async function NewPostPage() {
  await requireAdmin()
  const categories = [...new Set((await getAllPosts()).map((p) => p.category))].sort()
  return <PostEditor categories={categories} defaultAuthor={site.defaultAuthor} siteUrl={site.url} />
}
