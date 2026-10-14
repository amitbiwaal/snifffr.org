import type { Metadata } from 'next'
import Image from 'next/image'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = { title: 'Sign in' }

export default async function LoginPage(props: PageProps<'/admin/login'>) {
  const { next } = await props.searchParams
  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <Image src="/logo.png" alt="Snifffr" width={389} height={120} style={{ height: 40, width: 'auto' }} priority />
        <h1>Sign in to the CMS</h1>
        <p className="admin-muted">Manage blog posts, pages and messages.</p>
        <LoginForm next={typeof next === 'string' ? next : ''} />
      </div>
    </div>
  )
}
