'use client'

import { useActionState } from 'react'
import { loginAction, type LoginState } from '../actions'

export function LoginForm({ next }: { next: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})
  return (
    <form action={action} className="admin-form">
      {state.error && (
        <div className="admin-alert err" role="alert">
          {state.error}
        </div>
      )}
      <input type="hidden" name="next" value={next} />
      <label className="admin-field">
        <span>Email</span>
        <input name="email" type="email" autoComplete="username" required autoFocus />
      </label>
      <label className="admin-field">
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button className="admin-btn primary block" type="submit" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
