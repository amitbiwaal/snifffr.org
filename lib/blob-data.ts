import 'server-only'

/**
 * JSON documents in a *private* Vercel Blob store (DATA_BLOB_READ_WRITE_TOKEN).
 * Serverless fallback for posts and contact messages when no Turso database is configured:
 * one document per record, overwritten in place, always read uncached from origin.
 */
const token = () => process.env.DATA_BLOB_READ_WRITE_TOKEN

export function hasBlobData() {
  return Boolean(process.env.DATA_BLOB_READ_WRITE_TOKEN)
}

function docPath(collection: string, id: string) {
  if (!/^[a-zA-Z0-9-]+$/.test(id)) throw new Error('Invalid document id')
  return `${collection}/${id}.json`
}

export async function listDocs(collection: string): Promise<{ id: string; data: unknown }[]> {
  const { list, get } = await import('@vercel/blob')
  const pathnames: string[] = []
  let cursor: string | undefined
  do {
    const page = await list({ prefix: `${collection}/`, cursor, token: token() })
    pathnames.push(...page.blobs.map((b) => b.pathname).filter((p) => p.endsWith('.json')))
    cursor = page.hasMore ? page.cursor : undefined
  } while (cursor)

  const docs = await Promise.all(
    pathnames.map(async (pathname) => {
      const res = await get(pathname, { access: 'private', useCache: false, token: token() })
      if (!res || res.statusCode !== 200 || !res.stream) return null
      const id = pathname.slice(collection.length + 1, -'.json'.length)
      return { id, data: JSON.parse(await new Response(res.stream).text()) as unknown }
    }),
  )
  return docs.filter((d): d is { id: string; data: unknown } => d !== null)
}

export async function putDoc(collection: string, id: string, data: unknown) {
  const { put } = await import('@vercel/blob')
  await put(docPath(collection, id), JSON.stringify(data), {
    access: 'private',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'application/json',
    cacheControlMaxAge: 60,
    token: token(),
  })
}

export async function deleteDoc(collection: string, id: string) {
  const { del } = await import('@vercel/blob')
  await del(docPath(collection, id), { token: token() })
}
