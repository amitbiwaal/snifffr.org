import Image from 'next/image'
import Link from 'next/link'
import { footerNav } from '@/lib/site'

export function SiteFooter() {
  const year = new Date().getFullYear()
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-logo" aria-label="Snifffr home">
              <Image src="/logo.png" alt="Snifffr" width={389} height={120} />
            </Link>
            <p>
              An independent guide to selling feet pics online safely and anonymously: honest how-tos, privacy advice and
              marketplace tips for creators aged 18+.
            </p>
          </div>
          <nav aria-label="Explore">
            <h2>Explore</h2>
            <ul>
              {footerNav.explore.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Resources">
            <h2>Resources</h2>
            <ul>
              {footerNav.resources.map((l) => (
                <li key={l.href}>
                  {l.href.endsWith('.xml') ? <a href={l.href}>{l.label}</a> : <Link href={l.href}>{l.label}</Link>}
                </li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Legal">
            <h2>Legal</h2>
            <ul>
              {footerNav.legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer-bottom">
          <p>
            Disclaimer: This is an independent affiliate website created for informational and promotional purposes only.
            It is not the official website of, and is not affiliated with, endorsed by, or sponsored by Snifffr. All
            trademarks and brand names are the property of their respective owners. We may earn a commission if you sign
            up or make a purchase through links on this site. You must be 18 years or older to use the referenced
            services.
          </p>
          <p>© {year} Snifffr Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
