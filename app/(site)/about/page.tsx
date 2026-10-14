import Link from 'next/link'
import { AffiliateLink } from '@/components/AffiliateLink'
import { CtaSection } from '@/components/CtaSection'
import { PageHero } from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'About Us: An Independent Feet Pics Selling Guide',
  description:
    'Who we are, what Snifffr is, and how this independent guide helps adults sell feet pics online safely, anonymously and profitably.',
  path: '/about',
})

const values = [
  ['Privacy before profit', 'Every recommendation we make starts with one question: does this keep the seller’s identity safe? If it does not, we do not suggest it.'],
  ['Plain, honest advice', 'No hype and no “get rich” promises. Earnings depend on effort, consistency and niche, and we say so.'],
  ['Adults only', 'Everything here is written for people aged 18 and over. We never address, and never encourage selling to, minors.'],
  ['Transparent about money', 'Some links on this site are affiliate links. We say so clearly and it never changes our safety advice.'],
] as const

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'About', path: '/about' }]}
        eyebrow="About Us"
        title="About Snifffr and This Guide"
        lede="We help everyday adults sell feet pics online without putting their identity, safety or income at risk. Here is who we are and how we work."
      />

      <section>
        <div className="wrap grid grid-2" style={{ alignItems: 'start', gap: 40 }}>
          <div>
            <h2>What Is Snifffr?</h2>
            <p>
              Snifffr is a feet pics marketplace built around one idea: sellers should never have to trade their privacy
              for an income. Creators sign up under a pseudonym, list photo sets and custom offers, and get paid through
              the platform, so buyers never see a legal name, a phone number or a bank account.
            </p>
            <p>
              Compared with selling through social media DMs, a dedicated marketplace removes the riskiest parts of the
              process: chasing payment, dealing with fake buyers, and handing personal details to strangers. You can see
              exactly how that works in our <Link href="/how-it-works">step-by-step guide</Link>.
            </p>
          </div>
          <div>
            <h2>What Is This Website?</h2>
            <p>
              This site is an independent guide. We are not Snifffr and we are not employed by Snifffr. We publish
              practical tutorials, safety checklists and pricing advice for people who want to sell feet pictures online,
              and we link to marketplaces we think do the job well.
            </p>
            <p>
              When you sign up through some of our links we may earn a commission at no extra cost to you. That is how we
              keep the guides free. You can read the details in our{' '}
              <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
            </p>
          </div>
        </div>
      </section>

      <section className="soft">
        <div className="wrap">
          <span className="eyebrow">Our Principles</span>
          <h2>How We Write and Recommend</h2>
          <div className="grid grid-4 mt-s">
            {values.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="wrap-narrow">
          <span className="eyebrow">Editorial Standards</span>
          <h2>How Our Guides Are Made</h2>
          <ul className="checks">
            <li>Every guide is written for beginners first, then checked for anything that could expose a seller’s identity.</li>
            <li>Platform features, fees and payout details change, so we review our articles regularly and show the last-updated date on each post.</li>
            <li>We do not publish explicit content, and we do not give legal or tax advice. Where rules matter, we tell you to check the law where you live.</li>
            <li>Spotted something out of date? <Link href="/contact">Tell us</Link> and we will fix it.</li>
          </ul>
          <div className="callout">
            <h3>New to selling feet pics?</h3>
            <p>
              Start with our <Link href="/safety">privacy &amp; safety guide</Link>, then read the{' '}
              <Link href="/blog">blog</Link> for pricing and photography tips. When you are ready, create your free seller
              account.
            </p>
            <AffiliateLink className="btn btn-sm">Create a Free Snifffr Account</AffiliateLink>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
