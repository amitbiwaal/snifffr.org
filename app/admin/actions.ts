'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { clientIp, endSession, requireAdmin, startSession, verifyCredentials } from '@/lib/auth'
import { deleteMessage, updateMessage } from '@/lib/messages'
import { deletePost, PostValidationError, savePost, type PostInput } from '@/lib/posts'
import { rateLimit, resetRateLimit } from '@/lib/rate-limit'

/* ---------------- Auth ---------------- */

export type LoginState = { error?: string }

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') || '')
  const password = String(formData.get('password') || '')
  const next = String(formData.get('next') || '')

  const key = `login:${await clientIp()}`
  const limit = rateLimit(key, 8, 15 * 60 * 1000)
  if (!limit.ok) {
    return { error: `Too many sign-in attempts. Try again in ${Math.ceil(limit.retryAfterSec / 60)} minutes.` }
  }
  if (!email || !password || !verifyCredentials(email, password)) {
    return { error: 'Incorrect email or password.' }
  }
  resetRateLimit(key)
  await startSession(email)
  // Only allow redirects back into the admin area (no open redirects).
  redirect(/^\/admin(\/[\w\-/]*)?$/.test(next) ? next : '/admin')
}

export async function logoutAction() {
  await endSession()
  redirect('/admin/login')
}

/* ---------------- Posts ---------------- */

/** Refreshes every public page that can show post data. */
function revalidatePublicSite(slugs: string[]) {
  revalidatePath('/', 'layout')
  for (const slug of new Set(slugs)) {
    revalidatePath(`/blog/${slug}`)
    revalidatePath(`/og/${slug}`)
  }
  revalidatePath('/sitemap.xml')
  revalidatePath('/feed.xml')
  revalidatePath('/llms.txt')
}

export type SavePostResult =
  | { ok: true; post: { id: string; slug: string; status: 'draft' | 'published'; publishedAt: string; updatedAt: string } }
  | { ok: false; errors: Record<string, string> }

export async function savePostAction(input: PostInput): Promise<SavePostResult> {
  await requireAdmin()
  try {
    const post = await savePost(input)
    revalidatePublicSite([post.slug, ...post.previousSlugs])
    return {
      ok: true,
      post: { id: post.id, slug: post.slug, status: post.status, publishedAt: post.publishedAt, updatedAt: post.updatedAt },
    }
  } catch (err) {
    if (err instanceof PostValidationError) return { ok: false, errors: err.fieldErrors }
    console.error('[admin] savePost failed', err)
    return { ok: false, errors: { form: 'Something went wrong while saving. Please try again.' } }
  }
}

export async function deletePostAction(formData: FormData) {
  await requireAdmin()
  const id = String(formData.get('id') || '')
  const post = await deletePost(id)
  if (post) revalidatePublicSite([post.slug, ...post.previousSlugs])
  redirect('/admin?deleted=1')
}

/* ---------------- Messages ---------------- */

export async function toggleMessageReadAction(formData: FormData) {
  await requireAdmin()
  await updateMessage(String(formData.get('id')), { read: formData.get('read') === 'true' })
  revalidatePath('/admin/messages')
}

export async function deleteMessageAction(formData: FormData) {
  await requireAdmin()
  await deleteMessage(String(formData.get('id')))
  revalidatePath('/admin/messages')
}
