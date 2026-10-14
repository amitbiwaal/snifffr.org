import Link from 'next/link'
import { CtaSection } from '@/components/CtaSection'
import { FaqList } from '@/components/FaqList'
import { JsonLd } from '@/components/JsonLd'
import { PageHero } from '@/components/PageHero'
import { faqGroups } from '@/lib/content'
import { faqJsonLd, pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'FAQ: Selling Feet Pics, Pricing, Privacy & Payouts',
  description:
    'Answers to the most common questions about selling feet pics online: age rules, pricing your sets, staying anonymous, avoiding scams and getting paid.',
  path: '/faq',
})

export default function FaqPage() {
  const all = faqGroups.flatMap((g) => g.faqs)
  return (
    <>
      <JsonLd data={faqJsonLd(all)} />
      <PageHero
        crumbs={[{ name: 'FAQ', path: '/faq' }]}
        eyebrow="FAQ"
        title="Frequently Asked Questions"
        lede="Everything new sellers ask us about getting started, pricing, privacy and payouts, answered in plain English."
      >
        <nav className="cat-bar" aria-label="FAQ topics">
          {faqGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`}>
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>

      <section>
        <div className="wrap-narrow">
          {faqGroups.map((group) => (
            <div className="faq-group" key={group.id}>
              <h2 id={group.id}>{group.title}</h2>
              <FaqList faqs={group.faqs} />
            </div>
          ))}
          <div className="notice" style={{ marginTop: 40 }}>
            <p>
              Still have a question? See the basics on our <Link href="/">home page</Link>, read the{' '}
              <Link href="/safety">safety guide</Link>, or <Link href="/contact">contact us</Link>.
            </p>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
