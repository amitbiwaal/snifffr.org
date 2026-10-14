import Link from 'next/link'
import { JsonLd } from './JsonLd'
import { breadcrumbJsonLd, type Crumb } from '@/lib/seo'

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. "Home" is added automatically. */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const crumbs: Crumb[] = [{ name: 'Home', path: '/' }, ...items]
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {crumbs.map((c, i) => (
          <li key={c.path}>
            {i === crumbs.length - 1 ? <span aria-current="page">{c.name}</span> : <Link href={c.path}>{c.name}</Link>}
          </li>
        ))}
      </ol>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </nav>
  )
}
