import type { ReactNode } from 'react'
import { PageHero } from './PageHero'
import { formatDate } from '@/lib/text'

export function LegalPage({
  title,
  path,
  updated,
  lede,
  children,
}: {
  title: string
  path: string
  updated: string
  lede?: string
  children: ReactNode
}) {
  return (
    <>
      <PageHero crumbs={[{ name: title, path }]} title={title} lede={lede} />
      <section style={{ paddingTop: 20 }}>
        <article className="wrap-narrow prose legal">
          <p className="updated">
            Last updated: <time dateTime={updated}>{formatDate(updated)}</time>
          </p>
          {children}
        </article>
      </section>
    </>
  )
}
