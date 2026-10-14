import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { deleteDoc, hasBlobData, listDocs, putDoc } from './blob-data'
import { getDb, hasDatabase } from './db'

/**
 * Contact-form submissions. Stored in Turso, else the private Vercel Blob data store,
 * else a private JSON file outside /content (git-ignored).
 */
const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(process.cwd(), 'data')
const FILE = path.join(DATA_DIR, 'messages.json')

export type ContactMessage = {
  id: string
  name: string
  email: string
  subject: string
  message: string
  createdAt: string
  read: boolean
}

// Serialise file writes so two submissions arriving together cannot clobber each other.
let queue: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>) {
  const run = queue.then(fn, fn)
  queue = run.catch(() => undefined)
  return run
}

async function readFile(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as ContactMessage[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
}

async function writeFile(messages: ContactMessage[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const tmp = `${FILE}.${randomUUID()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(messages, null, 2), 'utf8')
  await fs.rename(tmp, FILE)
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (hasDatabase()) {
    const db = await getDb()
    const rs = await db.execute('SELECT data, read FROM messages ORDER BY created_at DESC LIMIT 2000')
    return rs.rows.map((row) => ({ ...(JSON.parse(String(row.data)) as ContactMessage), read: Number(row.read) === 1 }))
  }
  const all = hasBlobData() ? (await listDocs('messages')).map((d) => d.data as ContactMessage) : await readFile()
  return all.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export async function addMessage(input: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
  const msg: ContactMessage = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), read: false }
  if (hasDatabase()) {
    const db = await getDb()
    await db.execute({
      sql: 'INSERT INTO messages (id, created_at, read, data) VALUES (?, ?, 0, ?)',
      args: [msg.id, msg.createdAt, JSON.stringify(msg)],
    })
    return msg
  }
  if (hasBlobData()) {
    await putDoc('messages', msg.id, msg)
    return msg
  }
  return withLock(async () => {
    const messages = await readFile()
    messages.push(msg)
    await writeFile(messages.slice(-2000))
    return msg
  })
}

export async function updateMessage(id: string, patch: Partial<Pick<ContactMessage, 'read'>>) {
  if (hasDatabase()) {
    if (patch.read === undefined) return
    const db = await getDb()
    await db.execute({ sql: 'UPDATE messages SET read = ? WHERE id = ?', args: [patch.read ? 1 : 0, id] })
    return
  }
  if (hasBlobData()) {
    const msg = (await getMessages()).find((m) => m.id === id)
    if (msg) await putDoc('messages', id, { ...msg, ...patch })
    return
  }
  return withLock(async () => {
    const messages = await readFile()
    await writeFile(messages.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  })
}

export async function deleteMessage(id: string) {
  if (hasDatabase()) {
    const db = await getDb()
    await db.execute({ sql: 'DELETE FROM messages WHERE id = ?', args: [id] })
    return
  }
  if (hasBlobData()) return deleteDoc('messages', id)
  return withLock(async () => {
    const messages = await readFile()
    await writeFile(messages.filter((m) => m.id !== id))
  })
}
