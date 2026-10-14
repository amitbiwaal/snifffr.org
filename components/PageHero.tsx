import type { ReactNode } from 'react'
import { Breadcrumbs } from './Breadcrumbs'
import type { Crumb } from '@/lib/seo'

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  children,
}: {
  eyebrow?: string
  title: string
  lede?: ReactNode
  crumbs: Crumb[]
  children?: ReactNode
}) {
  return (
    <section className="page-hero">
      <div className="wrap">
        <Breadcrumbs items={crumbs} />
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {lede && <p className="lede">{lede}</p>}
        {children}
      </div>
    </section>
  )
}
