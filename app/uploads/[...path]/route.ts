import { promises as fs } from 'node:fs'
import path from 'node:path'
import { CONTENT_DIR } from '@/lib/posts'

const TYPES: Record<string, string> = {
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
}

/**
 * Serves images uploaded through the CMS. They live in /content/uploads rather than /public
 * because Next.js only serves files that were in /public at build time.
 */
export async function GET(_req: Request, ctx: RouteContext<'/uploads/[...path]'>) {
  const { path: parts } = await ctx.params
  const root = path.resolve(CONTENT_DIR, 'uploads')
  const file = path.resolve(root, ...parts)
  const type = TYPES[path.extname(file).toLowerCase()]
  if (!file.startsWith(root + path.sep) || !type) return new Response('Not found', { status: 404 })

  try {
    const data = await fs.readFile(file)
    return new Response(new Uint8Array(data), {
      headers: {
        'Content-Type': type,
        // File names contain a random suffix, so they never change.
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return new Response('Not found', { status: 404 })
  }
}
