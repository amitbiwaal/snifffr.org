import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'
import { CONTENT_DIR } from './posts'

export const OG_SIZE = { width: 1200, height: 630 }

let fonts: Promise<{ name: string; data: Buffer; weight: 500 | 800; style: 'normal' }[]> | null = null
function getFonts() {
  const dir = path.join(process.cwd(), 'assets', 'fonts')
  fonts ??= Promise.all(
    ([500, 800] as const).map(async (weight) => ({
      name: 'Jakarta',
      data: await fs.readFile(path.join(dir, `plus-jakarta-sans-latin-${weight}-normal.woff`)),
      weight,
      style: 'normal' as const,
    })),
  )
  return fonts
}

let brandMark: Promise<string> | null = null
function getBrandMark() {
  brandMark ??= fs
    .readFile(path.join(process.cwd(), 'public', 'brand-mark.png'))
    .then((buf) => `data:image/png;base64,${buf.toString('base64')}`)
  return brandMark
}

const BLOB_HOST = /^[a-z0-9-]+\.public\.blob\.vercel-storage\.com$/i

/** Reads an uploaded cover (local file or Vercel Blob URL). Only our own storage is fetched. */
async function readCover(src: string): Promise<Buffer | null> {
  if (src.startsWith('/uploads/')) {
    const root = path.resolve(CONTENT_DIR, 'uploads')
    const file = path.resolve(root, src.replace(/^\/uploads\//, ''))
    if (!file.startsWith(root + path.sep)) return null
    return fs.readFile(file)
  }
  const url = new URL(src)
  if (url.protocol !== 'https:' || !BLOB_HOST.test(url.hostname)) return null
  const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
  return res.ok ? Buffer.from(await res.arrayBuffer()) : null
}

/** Loads a cover as a JPEG data URL (Satori cannot decode WebP). */
async function loadCover(src: string) {
  try {
    const buf = await readCover(src)
    if (!buf) return null
    // Pass a buffer, not a path: given a path, libvips keeps the file open (and locked on Windows).
    const jpg = await sharp(buf).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80 }).toBuffer()
    return `data:image/jpeg;base64,${jpg.toString('base64')}`
  } catch {
    return null
  }
}

export async function renderOgImage({
  title,
  eyebrow = 'Snifffr Guide',
  cover,
}: {
  title: string
  eyebrow?: string
  cover?: string
}) {
  const [mark, coverData, fontList] = await Promise.all([getBrandMark(), cover ? loadCover(cover) : null, getFonts()])
  const fontSize = title.length > 80 ? 52 : title.length > 50 ? 60 : 70

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          fontFamily: 'Jakarta',
          background: 'linear-gradient(135deg, #fff7f0 0%, #ffe8d6 55%, #fed7aa 100%)',
        }}
      >
        {coverData && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverData} alt="" width={1200} height={630} style={{ position: 'absolute', inset: 0, objectFit: 'cover' }} />
        )}
        {coverData && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              background: 'linear-gradient(90deg, rgba(26,23,20,.92) 0%, rgba(26,23,20,.75) 55%, rgba(26,23,20,.35) 100%)',
            }}
          />
        )}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '64px 72px',
            width: '100%',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} alt="" width={72} height={72} style={{ borderRadius: 16 }} />
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                letterSpacing: 4,
                textTransform: 'uppercase',
                color: coverData ? '#fdba74' : '#c2410c',
              }}
            >
              {eyebrow}
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              fontSize,
              fontWeight: 800,
              lineHeight: 1.12,
              letterSpacing: -1.5,
              color: coverData ? '#ffffff' : '#1a1714',
              maxWidth: 1000,
            }}
          >
            {title}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 64, height: 8, borderRadius: 8, background: '#f97316' }} />
            <div style={{ fontSize: 26, fontWeight: 500, color: coverData ? '#e9e5df' : '#574f48' }}>Sell feet pics online, safely and anonymously</div>
          </div>
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fontList },
  )
}
