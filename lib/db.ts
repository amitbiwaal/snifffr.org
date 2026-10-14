import 'server-only'
import type { Client } from '@libsql/client'

/**
 * Turso (libSQL) connection. Used when TURSO_DATABASE_URL is set (e.g. on Vercel);
 * without it the app falls back to JSON files on disk (local development).
 */
export function hasDatabase() {
  return Boolean(process.env.TURSO_DATABASE_URL)
}

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS posts (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    status TEXT NOT NULL,
    published_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    data TEXT NOT NULL
  )`,
  `CREATE INDEX IF NOT EXISTS posts_published_at ON posts (published_at)`,
  `CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    created_at TEXT NOT NULL,
    read INTEGER NOT NULL DEFAULT 0,
    data TEXT NOT NULL
  )`,
]

let client: Promise<Client> | null = null

export function getDb(): Promise<Client> {
  if (!client) {
    client = (async () => {
      const url = process.env.TURSO_DATABASE_URL!
      const authToken = process.env.TURSO_AUTH_TOKEN
      // The web client is pure fetch (ideal for serverless); file: URLs need the native client.
      const { createClient } = url.startsWith('file:') ? await import('@libsql/client') : await import('@libsql/client/web')
      const db = createClient({ url, authToken })
      await db.batch(SCHEMA, 'write')
      return db
    })()
    // Let the next call retry if the connection or migration failed.
    client.catch(() => {
      client = null
    })
  }
  return client
}
