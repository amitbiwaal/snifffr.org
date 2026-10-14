import type { Metadata } from 'next'
import { requireAdmin } from '@/lib/auth'
import { getMessages } from '@/lib/messages'
import { deleteMessageAction, toggleMessageReadAction } from '../../actions'

export const metadata: Metadata = { title: 'Messages' }

export default async function MessagesPage() {
  await requireAdmin()
  const messages = await getMessages()

  return (
    <div className="admin-page">
      <header className="admin-page-head">
        <div>
          <h1>Messages</h1>
          <p className="admin-muted">Submissions from the contact form.</p>
        </div>
      </header>
      {messages.length === 0 ? (
        <div className="admin-empty">
          <p>No messages yet.</p>
        </div>
      ) : (
        <div className="admin-messages">
          {messages.map((m) => (
            <article key={m.id} className={`admin-card admin-message${m.read ? '' : ' unread'}`}>
              <header>
                <div>
                  <strong>{m.subject || '(no subject)'}</strong>
                  <div className="admin-muted small">
                    {m.name} · <a href={`mailto:${m.email}`}>{m.email}</a> ·{' '}
                    {new Date(m.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
                  </div>
                </div>
                <div className="admin-row-actions">
                  <form action={toggleMessageReadAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <input type="hidden" name="read" value={String(!m.read)} />
                    <button className="admin-btn small" type="submit">
                      Mark {m.read ? 'unread' : 'read'}
                    </button>
                  </form>
                  <form action={deleteMessageAction}>
                    <input type="hidden" name="id" value={m.id} />
                    <button className="admin-btn small danger" type="submit">
                      Delete
                    </button>
                  </form>
                </div>
              </header>
              <p style={{ whiteSpace: 'pre-wrap' }}>{m.message}</p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
