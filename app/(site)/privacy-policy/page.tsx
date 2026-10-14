import Link from 'next/link'
import { LegalPage } from '@/components/LegalPage'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How the Snifffr Guide website collects, uses and protects information when you visit or contact us.',
  path: '/privacy-policy',
})

export default function PrivacyPolicyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy-policy" updated="2026-10-14" lede="We collect as little information as possible, and we never sell it.">
      <h2>Who we are</h2>
      <p>
        This website ({site.url.replace(/^https?:\/\//, '')}) is an independent guide about selling feet pictures online.
        It is not operated by Snifffr or any marketplace we link to. In this policy “we”, “us” and “our” refer to the
        operators of this website.
      </p>

      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Contact form:</strong> when you send us a message we store your name, email address, subject and
          message so we can reply. We do not use it for marketing.
        </li>
        <li>
          <strong>Server logs:</strong> like most websites, our hosting provider may log technical information such as
          IP address, browser type and pages requested, for security and to keep the site running.
        </li>
        <li>
          <strong>Anti-abuse data:</strong> we briefly use your IP address to limit repeated form submissions. It is
          kept in memory only and is not stored with your message.
        </li>
      </ul>

      <h2>Cookies</h2>
      <p>
        The public website does not set advertising or tracking cookies. A single essential cookie is used only when site
        administrators sign in to the content management area. If we add analytics in the future we will update this
        page first.
      </p>

      <h2>Links to other websites</h2>
      <p>
        Our pages contain links to third-party marketplaces, some of which are affiliate links (see our{' '}
        <Link href="/affiliate-disclosure">affiliate disclosure</Link>). Once you leave this site, the other website’s
        privacy policy applies. Please read it before creating an account.
      </p>

      <h2>How long we keep information</h2>
      <p>
        We keep contact messages for as long as needed to answer them and for a reasonable period afterwards, and delete
        them when they are no longer needed.
      </p>

      <h2>Your rights</h2>
      <p>
        Depending on where you live, you may have the right to access, correct or delete the personal information we hold
        about you. To make a request, email <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
      </p>

      <h2>Children</h2>
      <p>This website is intended for adults aged 18 and over. We do not knowingly collect information from minors.</p>

      <h2>Changes to this policy</h2>
      <p>We may update this policy from time to time. The “last updated” date at the top shows when it last changed.</p>
    </LegalPage>
  )
}
