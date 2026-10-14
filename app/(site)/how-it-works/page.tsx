import Link from 'next/link'
import { AffiliateLink } from '@/components/AffiliateLink'
import { CtaSection } from '@/components/CtaSection'
import { PageHero } from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'How Snifffr Works: Sell Feet Pics Online in 4 Steps',
  absoluteTitle: true,
  description:
    'A step-by-step guide to selling feet pics online with Snifffr: create an anonymous profile, upload sets, set prices and get paid securely.',
  path: '/how-it-works',
})

const steps = [
  {
    title: 'Create Your Anonymous Profile',
    time: '10–15 minutes',
    body: 'Pick a store name that has nothing to do with your real name, write a short, friendly bio, and choose a profile image that does not show your face. Use a separate email address that you only use for selling. Complete the age and identity verification step: it is private to the platform and is what keeps the marketplace adults-only.',
    tips: ['Use a brand-new email address', 'Avoid usernames you use elsewhere', 'Never show tattoos or birthmarks'],
  },
  {
    title: 'Shoot and Upload Your First Sets',
    time: '1–2 hours',
    body: 'Natural daylight from a window beats any ring light. Shoot against a plain background, take more photos than you need, and pick the sharpest five to ten. Remove location metadata before you upload, then group your photos into one or two themed starter sets so buyers know exactly what they are getting.',
    tips: ['Clean, plain backgrounds', 'Strip EXIF/GPS metadata', 'Group photos into themed sets'],
  },
  {
    title: 'Set Prices That Sell',
    time: '15 minutes',
    body: 'Look at what sellers in your niche charge and launch slightly below that so you can win your first reviews. Offer a bundle so buyers have a reason to spend a little more, and decide in advance what you charge for custom requests. You can change prices at any time.',
    tips: ['Launch a little below average', 'Always offer a bundle', 'Price customs at a premium'],
  },
  {
    title: 'Get Paid Securely',
    time: 'Ongoing',
    body: 'When a buyer checks out, the marketplace takes the payment and credits your balance. You request payouts through your dashboard: no swapping payment-app handles, no screenshots of “payment sent”, no chargebacks from strangers. Reply to buyers quickly and post regularly to turn first-time buyers into regulars.',
    tips: ['Keep every chat on-platform', 'Never send content before payment clears', 'Reply quickly to build loyalty'],
  },
] as const

export default function HowItWorksPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'How It Works', path: '/how-it-works' }]}
        eyebrow="How It Works"
        title="How to Sell Feet Pics Online With Snifffr"
        lede="From sign-up to your first payout in four steps. Most sellers can go from zero to their first live listing in a single afternoon."
      >
        <div className="cta-row">
          <AffiliateLink>Create My Snifffr Account</AffiliateLink>
        </div>
      </PageHero>

      <section>
        <div className="wrap-narrow">
          <ol className="steps" style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 22 }}>
            {steps.map((s) => (
              <li className="step card" key={s.title}>
                <h2 style={{ fontSize: '1.35rem', marginTop: 6 }}>{s.title}</h2>
                <p className="meta" style={{ marginBottom: 12 }}>
                  Time needed: {s.time}
                </p>
                <p>{s.body}</p>
                <ul className="checks">
                  {s.tips.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="soft">
        <div className="wrap-narrow">
          <h2>What You Need Before You Start</h2>
          <div className="grid grid-2 mt-s">
            <div>
              <h3>You will need</h3>
              <ul className="checks">
                <li>To be 18 or older</li>
                <li>A phone with a decent camera</li>
                <li>A window with natural light</li>
                <li>A separate email address</li>
              </ul>
            </div>
            <div>
              <h3>You will not need</h3>
              <ul className="checks crosses">
                <li>Professional camera gear</li>
                <li>A social media following</li>
                <li>To show your face</li>
                <li>To share your real name with buyers</li>
              </ul>
            </div>
          </div>
          <div className="notice">
            <p>
              <strong>Safety first:</strong> before uploading anything, read our{' '}
              <Link href="/safety">privacy &amp; safety guide</Link>. It covers metadata, backgrounds, scams and the red
              flags to watch for.
            </p>
          </div>
        </div>
      </section>

      <CtaSection title="Ready for Step One?" text="Create your free, anonymous seller profile and have your first set live today." button="Start Selling Feet Pics" />
    </>
  )
}
