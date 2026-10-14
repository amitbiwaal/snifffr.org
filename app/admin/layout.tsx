import type { Metadata } from 'next'
import './admin.css'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Snifffr Admin' },
  robots: { index: false, follow: false, nocache: true },
}

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>
}
