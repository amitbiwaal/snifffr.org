'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function AdminNav({ unread }: { unread: number }) {
  const pathname = usePathname()
  const items = [
    { href: '/admin', label: 'All posts', active: pathname === '/admin' || (pathname.startsWith('/admin/posts/') && pathname !== '/admin/posts/new') },
    { href: '/admin/posts/new', label: '+ New post', active: pathname === '/admin/posts/new' },
    { href: '/admin/messages', label: 'Messages', active: pathname.startsWith('/admin/messages'), badge: unread },
  ]
  return (
    <nav className="admin-nav" aria-label="Admin">
      {items.map((i) => (
        <Link key={i.href} href={i.href} aria-current={i.active ? 'page' : undefined}>
          {i.label}
          {!!i.badge && <span className="admin-badge">{i.badge}</span>}
        </Link>
      ))}
    </nav>
  )
}
