import Link from 'next/link'
import { AffiliateLink } from '@/components/AffiliateLink'
import { CtaSection } from '@/components/CtaSection'
import { PageHero } from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'Snifffr Features: Anonymous Selling & Secure Payouts',
  absoluteTitle: true,
  description:
    'A detailed look at the Snifffr features that make it easier to sell feet pics online: anonymous profiles, secure payouts, pricing tools, buyer screening and more.',
  path: '/features',
})

const features = [
  {
    icon: '🔒',
    title: 'Anonymous Seller Profiles',
    text: 'Sign up with a pseudonym and a profile image that never needs to show your face. Buyers see your store name and your content, nothing else.',
    points: ['No legal name on your public profile', 'No face required, ever', 'Contact details stay private'],
  },
  {
    icon: '💸',
    title: 'Secure, Discreet Payouts',
    text: 'Buyers pay the marketplace, and the marketplace pays you. You never exchange payment-app handles or bank details with a customer.',
    points: ['Protects your financial identity', 'Removes off-platform chargeback scams', 'Clear payout history in your dashboard'],
  },
  {
    icon: '🛍️',
    title: 'A Built-In Buyer Audience',
    text: 'Instead of building a following from scratch on social media, your listings appear in a marketplace where people are already looking to buy.',
    points: ['Search and browse discovery', 'Repeat buyers can follow your store', 'Worldwide reach'],
  },
  {
    icon: '📈',
    title: 'Flexible Pricing Tools',
    text: 'Price single photos, bundles, custom requests and subscriptions however you like, and adjust any time as demand grows.',
    points: ['Bundles to lift order value', 'Premium pricing for customs', 'Recurring subscription income'],
  },
  {
    icon: '📱',
    title: 'Phone-First Workflow',
    text: 'Shoot, upload and manage everything from your phone. A modern phone camera and natural light are all you need to start.',
    points: ['Mobile uploads', 'Manage sets on the go', 'Reply to buyers quickly'],
  },
  {
    icon: '🛡️',
    title: 'Buyer Screening & Moderation',
    text: 'Marketplace activity is screened to reduce scams, fake accounts and time-wasters, so your effort goes to genuine customers.',
    points: ['Fewer fake buyers', 'Report and block tools', 'Clear content rules'],
  },
] as const

export default function FeaturesPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Features', path: '/features' }]}
        eyebrow="Features"
        title="Snifffr Features That Keep Sellers Safe and Paid"
        lede="Everything you need to sell feet pics online lives in one place. Here is what each feature does and why it matters for your privacy and your income."
      >
        <div className="cta-row">
          <AffiliateLink>Start Selling Feet Pics</AffiliateLink>
          <Link className="btn btn-ghost" href="/how-it-works">
            How It Works
          </Link>
        </div>
      </PageHero>

      <section>
        <div className="wrap">
          <div className="grid grid-3">
            {features.map((f) => (
              <article className="card" key={f.title}>
                <div className="icon" aria-hidden="true">
                  {f.icon}
                </div>
                <h2 style={{ fontSize: '1.2rem', marginTop: 12 }}>{f.title}</h2>
                <p>{f.text}</p>
                <ul className="checks">
                  {f.points.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="soft">
        <div className="wrap">
          <span className="eyebrow">Side by Side</span>
          <h2>Marketplace vs. DMs vs. Your Own Website</h2>
          <p>There are three common ways to sell feet pictures. Here is how they compare on the things that matter most.</p>
          <div className="table-wrap mt-s">
            <table>
              <thead>
                <tr>
                  <th scope="col">What matters</th>
                  <th scope="col">Snifffr marketplace</th>
                  <th scope="col">Social media DMs</th>
                  <th scope="col">Your own website</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Anonymity</td>
                  <td><span className="yes">✔ Built in</span></td>
                  <td><span className="no">✘ Hard to control</span></td>
                  <td>Depends on setup</td>
                </tr>
                <tr>
                  <td>Ready-made buyers</td>
                  <td><span className="yes">✔ Yes</span></td>
                  <td><span className="no">✘ You find them</span></td>
                  <td><span className="no">✘ You find them</span></td>
                </tr>
                <tr>
                  <td>Payment protection</td>
                  <td><span className="yes">✔ Handled for you</span></td>
                  <td><span className="no">✘ Chargeback risk</span></td>
                  <td>You set it up</td>
                </tr>
                <tr>
                  <td>Scam screening</td>
                  <td><span className="yes">✔ Yes</span></td>
                  <td><span className="no">✘ On your own</span></td>
                  <td><span className="no">✘ On your own</span></td>
                </tr>
                <tr>
                  <td>Time to first sale</td>
                  <td><span className="yes">✔ Same day possible</span></td>
                  <td>Weeks of audience building</td>
                  <td>Weeks to months</td>
                </tr>
                <tr>
                  <td>Upfront cost</td>
                  <td><span className="yes">✔ Free to start</span></td>
                  <td><span className="yes">✔ Free</span></td>
                  <td><span className="no">✘ Hosting &amp; domain</span></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className="wrap-narrow">
          <h2>Which Features Matter Most When You Start?</h2>
          <p>
            If you are brand new, focus on two things: <strong>anonymity</strong> and <strong>payment protection</strong>.
            They are the hardest to fix after something goes wrong. Pricing tools and subscriptions become more useful once
            you have a few regular buyers.
          </p>
          <p>
            Our <Link href="/safety">privacy &amp; safety guide</Link> walks through the settings and habits that protect
            you from day one, and the <Link href="/blog">blog</Link> covers pricing and photography in more depth.
          </p>
        </div>
      </section>

      <CtaSection title="Try Every Feature Free" button="Create My Free Account" />
    </>
  )
}
