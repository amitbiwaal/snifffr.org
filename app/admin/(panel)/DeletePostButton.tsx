'use client'

import { deletePostAction } from '../actions'

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deletePostAction}
      onSubmit={(e) => {
        if (!confirm(`Delete “${title}”? This cannot be undone.`)) e.preventDefault()
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="admin-btn small danger">
        Delete
      </button>
    </form>
  )
}
