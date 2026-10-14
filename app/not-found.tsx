import type { Metadata } from 'next'
import Link from 'next/link'
import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

export const metadata: Metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <>
      <SiteHeader />
      <main id="main">
        <section className="not-found">
          <div className="wrap">
            <div className="code">404</div>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.2rem)' }}>We couldn’t find that page</h1>
            <p>It may have moved, or the link may be out of date. Try one of these instead:</p>
            <div className="cta-row">
              <Link className="btn" href="/">
                Go to the Home Page
              </Link>
              <Link className="btn btn-ghost" href="/blog">
                Read the Blog
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  )
}
