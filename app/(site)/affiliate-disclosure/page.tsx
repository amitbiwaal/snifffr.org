import Link from 'next/link'
import { LegalPage } from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Affiliate Disclosure',
  description: 'How this independent guide is funded, and how affiliate links work on the Snifffr Guide website.',
  path: '/affiliate-disclosure',
})

export default function AffiliateDisclosurePage() {
  return (
    <LegalPage title="Affiliate Disclosure" path="/affiliate-disclosure" updated="2026-10-14" lede="Plain-English transparency about how this site makes money.">
      <h2>We are independent</h2>
      <p>
        This is an independent affiliate website created for informational and promotional purposes. It is not the
        official website of, and is not affiliated with, endorsed by, or sponsored by Snifffr. All trademarks and brand
        names are the property of their respective owners.
      </p>

      <h2>How affiliate links work</h2>
      <p>
        Some links on this site, including most “Start Selling” and “Join” buttons, are affiliate links. If you sign up or
        make a purchase after clicking one, we may earn a commission. It costs you nothing extra.
      </p>
      <p>
        Affiliate links are marked with <code>rel=&quot;sponsored&quot;</code> in our code, in line with search-engine
        guidelines, and open in a new tab so you always know you are leaving our site.
      </p>

      <h2>Our editorial promise</h2>
      <ul>
        <li>Commissions never change our safety and privacy advice.</li>
        <li>We do not accept payment to publish positive reviews.</li>
        <li>If a feature or policy changes, we update our guides, including when the change is not in a partner’s favour.</li>
      </ul>

      <h2>Age requirement</h2>
      <p>You must be 18 years or older to use the services referenced on this site.</p>

      <h2>Questions</h2>
      <p>
        If you have any questions about this disclosure, please <Link href="/contact">contact us</Link>.
      </p>
    </LegalPage>
  )
}
