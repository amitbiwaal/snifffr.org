'use client'

import { useActionState } from 'react'
import { sendContactMessage, type ContactState } from './actions'

const initial: ContactState = { status: 'idle' }

export function ContactForm() {
  const [state, action, pending] = useActionState(sendContactMessage, initial)
  const err = state.errors ?? {}

  if (state.status === 'ok') {
    return (
      <div className="form-status ok" role="status">
        {state.message}
      </div>
    )
  }

  return (
    <form action={action} className="form-grid card" noValidate>
      {state.status === 'error' && state.message && (
        <div className="form-status err" role="alert">
          {state.message}
        </div>
      )}
      <div className="form-row">
        <div className="field">
          <label htmlFor="c-name">Name</label>
          <input id="c-name" name="name" type="text" autoComplete="name" required aria-invalid={!!err.name} aria-describedby={err.name ? 'c-name-err' : undefined} />
          {err.name && <p className="field-error" id="c-name-err">{err.name}</p>}
        </div>
        <div className="field">
          <label htmlFor="c-email">Email</label>
          <input id="c-email" name="email" type="email" autoComplete="email" required aria-invalid={!!err.email} aria-describedby={err.email ? 'c-email-err' : undefined} />
          {err.email && <p className="field-error" id="c-email-err">{err.email}</p>}
        </div>
      </div>
      <div className="field">
        <label htmlFor="c-subject">Subject (optional)</label>
        <input id="c-subject" name="subject" type="text" maxLength={120} />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={6} required aria-invalid={!!err.message} aria-describedby={err.message ? 'c-message-err' : undefined} />
        {err.message && <p className="field-error" id="c-message-err">{err.message}</p>}
      </div>
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="c-website">Leave this empty</label>
        <input id="c-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <button className="btn" type="submit" disabled={pending}>
          {pending ? 'Sending…' : 'Send Message'}
        </button>
      </div>
    </form>
  )
}
