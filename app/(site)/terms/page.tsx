import Link from 'next/link'
import { LegalPage } from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Terms of Use',
  description: 'The terms that apply when you use the Snifffr Guide website and its content.',
  path: '/terms',
})

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="2026-10-14">
      <h2>Acceptance of these terms</h2>
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>

      <h2>Adults only</h2>
      <p>
        This website and the services it refers to are intended only for people aged 18 or older (or the age of majority
        where you live, if higher). By using the site you confirm that you meet this requirement.
      </p>

      <h2>Information only, not professional advice</h2>
      <p>
        Our guides are general information. They are not legal, tax or financial advice. Laws about online content,
        income and taxes differ between countries, and you are responsible for following the rules that apply to you.
      </p>

      <h2>No guarantee of earnings</h2>
      <p>
        Examples, figures and testimonials describe individual experiences and are not a promise of results. What you earn
        depends on many factors, including your effort, niche, pricing and the platform you use.
      </p>

      <h2>Third-party websites</h2>
      <p>
        We link to marketplaces and other sites we do not control. We are not responsible for their content, policies or
        services, and your use of them is governed by their own terms. Some links are affiliate links; see our{' '}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
      </p>

      <h2>Intellectual property</h2>
      <p>
        The text, design and graphics on this site belong to us or our licensors. You may share links to our pages and
        quote short extracts with attribution, but you may not republish whole articles without permission. All
        trademarks belong to their respective owners.
      </p>

      <h2>Acceptable use</h2>
      <p>
        Do not misuse the site, for example by attempting to gain unauthorised access, submitting spam through our forms,
        or scraping it in a way that harms its performance.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        The site is provided “as is”. To the fullest extent permitted by law, we are not liable for any loss arising from
        your use of the site or of any third-party service it links to.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a> or use our{' '}
        <Link href="/contact">contact form</Link>.
      </p>
    </LegalPage>
  )
}
