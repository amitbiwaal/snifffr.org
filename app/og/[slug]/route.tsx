import { renderOgImage } from '@/lib/og'
import { getPublishedPostBySlug } from '@/lib/posts'

export const dynamic = 'force-static'
export const revalidate = 86400

/** Social-share image for a blog post: title card, using the cover photo as background when there is one. */
export async function GET(_req: Request, ctx: RouteContext<'/og/[slug]'>) {
  const { slug } = await ctx.params
  const post = await getPublishedPostBySlug(slug)
  if (!post) return new Response('Not found', { status: 404 })
  return renderOgImage({ title: post.title, eyebrow: post.category, cover: post.coverImage })
}
