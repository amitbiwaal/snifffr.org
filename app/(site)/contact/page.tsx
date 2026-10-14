import Link from 'next/link'
import { PageHero } from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo'
import { site } from '@/lib/site'
import { ContactForm } from './ContactForm'

export const metadata = pageMetadata({
  title: 'Contact Us',
  description: 'Questions, corrections or partnership ideas? Get in touch with the Snifffr Guide team.',
  path: '/contact',
})

export default function ContactPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Contact', path: '/contact' }]}
        eyebrow="Contact"
        title="Get in Touch"
        lede="Found something out of date, have a question about a guide, or want to work with us? Send a message and we will get back to you."
      />
      <section>
        <div className="wrap grid grid-2" style={{ gap: 40, alignItems: 'start' }}>
          <ContactForm />
          <div>
            <h2 style={{ fontSize: '1.4rem' }}>Before you write</h2>
            <ul className="checks">
              <li>
                We are an independent guide, <strong>not Snifffr support</strong>. For account, payout or verification
                problems, contact the marketplace directly from your dashboard.
              </li>
              <li>Please never send us passwords, ID documents or payment details.</li>
              <li>
                Quick answers to common questions are in our <Link href="/faq">FAQ</Link>.
              </li>
            </ul>
            <p style={{ marginTop: 18 }}>
              Prefer email? Write to <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
