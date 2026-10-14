import 'server-only'
import { scryptSync, timingSafeEqual } from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession, verifySession } from './session'

function cookieSecure() {
  if (process.env.COOKIE_SECURE === 'false') return false
  return process.env.NODE_ENV === 'production'
}

function safeEqual(a: Buffer, b: Buffer) {
  return a.length === b.length && timingSafeEqual(a, b)
}

/** Checks credentials against ADMIN_EMAIL and ADMIN_PASSWORD_HASH ("scrypt:<salt>:<hash>"). */
export function verifyCredentials(email: string, password: string) {
  const adminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase()
  const stored = (process.env.ADMIN_PASSWORD_HASH || '').trim()
  const [scheme, salt, hashHex] = stored.split(':')
  if (!adminEmail || scheme !== 'scrypt' || !salt || !hashHex) {
    console.error('[auth] ADMIN_EMAIL / ADMIN_PASSWORD_HASH are not configured. See .env.example.')
    return false
  }
  const expected = Buffer.from(hashHex, 'hex')
  const actual = scryptSync(password, salt, expected.length)
  // Always run the hash so timing does not reveal whether the email matched.
  const passwordOk = safeEqual(actual, expected)
  const emailOk = safeEqual(Buffer.from(email.trim().toLowerCase()), Buffer.from(adminEmail))
  return passwordOk && emailOk
}

export async function startSession(email: string) {
  const token = await signSession(email.trim().toLowerCase())
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: cookieSecure(),
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  })
}

export async function endSession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}

export async function getSession() {
  const jar = await cookies()
  return verifySession(jar.get(SESSION_COOKIE)?.value)
}

/** Use at the top of every admin page and Server Action. Proxy checks are only optimistic. */
export async function requireAdmin() {
  const session = await getSession()
  if (!session) redirect('/admin/login')
  return session
}

export async function clientIp() {
  const h = await headers()
  return h.get('x-forwarded-for')?.split(',')[0]?.trim() || h.get('x-real-ip') || 'unknown'
}
