import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomBytes } from 'node:crypto'
import sharp from 'sharp'
import { getSession } from '@/lib/auth'
import { CONTENT_DIR } from '@/lib/posts'
import { slugify } from '@/lib/text'

const MAX_BYTES = 10 * 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'])

/**
 * Admin image upload (Vercel Blob when BLOB_READ_WRITE_TOKEN is set, else /content/uploads).
 * Every image is re-encoded with sharp, which:
 *  - strips EXIF/GPS metadata (important for seller privacy),
 *  - auto-rotates by EXIF orientation,
 *  - caps the width at 1600px and converts to WebP.
 */
export async function POST(request: Request) {
  if (!(await getSession())) return Response.json({ error: 'Unauthorized' }, { status: 401 })

  let form: FormData
  try {
    form = await request.formData()
  } catch {
    return Response.json({ error: 'Expected multipart form data' }, { status: 400 })
  }
  const file = form.get('file')
  if (!(file instanceof File)) return Response.json({ error: 'No file uploaded' }, { status: 400 })
  if (!ALLOWED.has(file.type)) return Response.json({ error: 'Only JPG, PNG, WebP, GIF or AVIF images are allowed' }, { status: 415 })
  if (file.size > MAX_BYTES) return Response.json({ error: 'Image must be 10 MB or smaller' }, { status: 413 })

  let output
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()), { animated: false, limitInputPixels: 50_000_000 })
      .rotate()
      .resize({ width: 1600, withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true })
  } catch {
    return Response.json({ error: 'That file could not be read as an image' }, { status: 422 })
  }

  const now = new Date()
  const sub = `${now.getUTCFullYear()}/${String(now.getUTCMonth() + 1).padStart(2, '0')}`
  const base = slugify(file.name.replace(/\.[^.]+$/, '')).slice(0, 50) || 'image'
  const name = `${base}-${randomBytes(4).toString('hex')}.webp`

  let url: string
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    // Vercel Blob (serverless hosts have no writable disk).
    const { put } = await import('@vercel/blob')
    const blob = await put(`uploads/${sub}/${name}`, output.data, {
      access: 'public',
      contentType: 'image/webp',
      addRandomSuffix: false,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    })
    url = blob.url
  } else {
    const dir = path.join(CONTENT_DIR, 'uploads', ...sub.split('/'))
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, name), output.data)
    url = `/uploads/${sub}/${name}`
  }

  return Response.json({ url, width: output.info.width, height: output.info.height })
}
