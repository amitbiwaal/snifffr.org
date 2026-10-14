import Image from 'next/image'
import Link from 'next/link'
import { requireAdmin } from '@/lib/auth'
import { getMessages } from '@/lib/messages'
import { logoutAction } from '../actions'
import { AdminNav } from './AdminNav'

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAdmin()
  const unread = (await getMessages()).filter((m) => !m.read).length

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-logo">
          <Image src="/logo.png" alt="Snifffr" width={389} height={120} style={{ height: 30, width: 'auto' }} />
          <span>CMS</span>
        </Link>
        <AdminNav unread={unread} />
        <div className="admin-sidebar-foot">
          <a href="/" target="_blank" rel="noopener">
            View site ↗
          </a>
          <span className="admin-muted" title={session.sub}>
            {session.sub}
          </span>
          <form action={logoutAction}>
            <button type="submit" className="admin-btn ghost small">
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  )
}
