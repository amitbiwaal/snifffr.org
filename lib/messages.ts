import 'server-only'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { randomUUID } from 'node:crypto'

/** Contact-form submissions. Kept outside /content because they are private (and git-ignored). */
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

// Serialise writes so two submissions arriving together cannot clobber each other.
let queue: Promise<unknown> = Promise.resolve()
function withLock<T>(fn: () => Promise<T>) {
  const run = queue.then(fn, fn)
  queue = run.catch(() => undefined)
  return run
}

async function readAll(): Promise<ContactMessage[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, 'utf8')) as ContactMessage[]
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === 'ENOENT') return []
    throw err
  }
}

async function writeAll(messages: ContactMessage[]) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  const tmp = `${FILE}.${randomUUID()}.tmp`
  await fs.writeFile(tmp, JSON.stringify(messages, null, 2), 'utf8')
  await fs.rename(tmp, FILE)
}

export async function getMessages() {
  return (await readAll()).sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
}

export function addMessage(input: Omit<ContactMessage, 'id' | 'createdAt' | 'read'>) {
  return withLock(async () => {
    const messages = await readAll()
    const msg: ContactMessage = { ...input, id: randomUUID(), createdAt: new Date().toISOString(), read: false }
    messages.push(msg)
    await writeAll(messages.slice(-2000))
    return msg
  })
}

export function updateMessage(id: string, patch: Partial<Pick<ContactMessage, 'read'>>) {
  return withLock(async () => {
    const messages = await readAll()
    await writeAll(messages.map((m) => (m.id === id ? { ...m, ...patch } : m)))
  })
}

export function deleteMessage(id: string) {
  return withLock(async () => {
    const messages = await readAll()
    await writeAll(messages.filter((m) => m.id !== id))
  })
}
