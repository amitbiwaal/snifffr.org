import type { ReactNode } from 'react'
import { site } from '@/lib/site'

/** Outbound sponsored link. rel="sponsored nofollow" keeps it compliant with Google's link guidelines. */
export function AffiliateLink({
  children,
  className = 'btn',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <a className={className} href={site.affiliateUrl} rel="nofollow sponsored noopener" target="_blank">
      {children}
    </a>
  )
}
