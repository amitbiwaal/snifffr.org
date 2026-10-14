'use server'

import { z } from 'zod'
import { clientIp } from '@/lib/auth'
import { addMessage } from '@/lib/messages'
import { rateLimit } from '@/lib/rate-limit'

export type ContactState = {
  status: 'idle' | 'ok' | 'error'
  message?: string
  errors?: Partial<Record<'name' | 'email' | 'subject' | 'message', string>>
}

const schema = z.object({
  name: z.string().trim().min(2, 'Please enter your name.').max(80),
  email: z.string().trim().max(160).pipe(z.email('Please enter a valid email address.')),
  subject: z.string().trim().max(120).default(''),
  message: z.string().trim().min(10, 'Your message should be at least 10 characters.').max(4000),
})

export async function sendContactMessage(_prev: ContactState, formData: FormData): Promise<ContactState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get('website') || '').trim()) {
    return { status: 'ok', message: 'Thanks! Your message has been sent.' }
  }

  const ip = await clientIp()
  const limit = rateLimit(`contact:${ip}`, 5, 60 * 60 * 1000)
  if (!limit.ok) {
    return { status: 'error', message: 'Too many messages from your connection. Please try again later.' }
  }

  const parsed = schema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    subject: formData.get('subject') ?? '',
    message: formData.get('message'),
  })
  if (!parsed.success) {
    const errors: ContactState['errors'] = {}
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ContactState['errors']>
      errors[key] ??= issue.message
    }
    return { status: 'error', message: 'Please fix the highlighted fields.', errors }
  }

  await addMessage(parsed.data)
  return { status: 'ok', message: 'Thanks! Your message has been sent. We usually reply within 2 business days.' }
}
