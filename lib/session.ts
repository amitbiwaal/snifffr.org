import { SignJWT, jwtVerify } from 'jose'

// Kept free of next/headers so proxy.ts can import it too.

export const SESSION_COOKIE = 'snf_admin'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

function secretKey() {
  const secret = process.env.SESSION_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('SESSION_SECRET is missing or shorter than 32 characters. Set it in .env.local.')
  }
  return new TextEncoder().encode(secret)
}

export type SessionPayload = { sub: string; role: 'admin' }

export async function signSession(email: string) {
  return new SignJWT({ role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(email)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(secretKey())
}

export async function verifySession(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, secretKey(), { algorithms: ['HS256'] })
    if (payload.role !== 'admin' || typeof payload.sub !== 'string') return null
    return { sub: payload.sub, role: 'admin' }
  } catch {
    return null
  }
}
