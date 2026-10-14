import Link from 'next/link'
import { AffiliateLink } from '@/components/AffiliateLink'
import { CtaSection } from '@/components/CtaSection'
import { FaqList } from '@/components/FaqList'
import { HeroArt } from '@/components/HeroArt'
import { JsonLd } from '@/components/JsonLd'
import { PostCard } from '@/components/PostCard'
import { homeFaqs } from '@/lib/content'
import { getPublishedPosts } from '@/lib/posts'
import { faqJsonLd, pageMetadata, serviceJsonLd } from '@/lib/seo'
import { site } from '@/lib/site'

// Short window: bounds staleness if a render races a CMS save (saves also revalidate instantly).
export const revalidate = 600

export const metadata = pageMetadata({
  title: site.defaultTitle,
  description: site.description,
  path: '/',
  absoluteTitle: true,
})

const features = [
  ['🔒', 'Anonymous Selling', 'List and sell feet pictures without ever revealing your face or trading personal information with a single buyer.'],
  ['💸', 'Secure Payouts', 'Snifffr settles every Snifffr payout discreetly, keeping your banking details hidden and each transaction processed safely.'],
  ['🛍️', 'Built-In Marketplace', 'Tap into a ready-made audience of buyers already on Snifffr and actively searching to purchase feet pictures.'],
  ['📈', 'Smart Pricing Tools', 'Bundle sets and price them however you like. Snifffr helps you squeeze the most value out of every feet pic.'],
  ['📱', 'Phone-Friendly', 'Capture, upload, and sell feet pics online directly from your phone. No lighting rig or studio kit required with Snifffr.'],
  ['🛡️', 'Buyer Verification', 'Activity on Snifffr is screened to weed out scams and tyre-kickers, so your energy goes to genuine paying buyers.'],
] as const

const categories = [
  ['Everyday Feet Pics', 'Relaxed, natural snapshots, the single most in-demand category across Snifffr.'],
  ['Themed Sets', 'Seasonal looks, sandal shots, and styled bundles that buyers seek out on Snifffr.'],
  ['Custom Requests', 'Take personalised orders and charge premium rates for tailored work through Snifffr.'],
  ['Nail and Pedicure', 'Crisp close-ups of polished toes that consistently perform well on Snifffr.'],
  ['Soles and Arches', 'Detail-led angles that stay in steady demand among Snifffr collectors.'],
  ['Footwear Combos', 'Heels, socks, and shoes styled together with feet pictures on Snifffr.'],
  ['Video Add-Ons', 'Upsell short clips next to your feet pic sets to lift each order on Snifffr.'],
  ['Subscription Bundles', 'Offer ongoing access to fresh content with recurring Snifffr subscriptions.'],
] as const

const comparison = [
  ['Stay anonymous', '✔ Built in', '✘ Hard to control'],
  ['Verified, paying buyers', '✔ Yes', '✘ Risky and unknown'],
  ['Secure, private payments', '✔ Yes', '✘ Chargeback risk'],
  ['Scam protection', '✔ Yes', '✘ On your own'],
  ['Set and manage prices', '✔ Easy tools', '✘ Manual'],
  ['Reach global buyers', '✔ Worldwide', '✘ Limited'],
] as const

const audiences = [
  ['Side-Hustlers', 'Anyone after flexible spare-time cash can sell feet pics online with Snifffr around an existing job.'],
  ['Students', 'Earn from your phone between lectures. Snifffr keeps the effort low and the privacy high.'],
  ['Stay-at-Home Parents', 'Work from home on your own timetable and sell feet pictures discreetly through Snifffr.'],
  ['Content Creators', 'Open a fresh revenue line and monetise foot content with Snifffr alongside your existing brand.'],
  ['Privacy-Conscious Sellers', 'If staying anonymous is your top priority, Snifffr is purpose-built for safe, private feet selling.'],
  ['Buyers and Collectors', 'Shoppers can browse the Snifffr feet pics marketplace and buy feet pictures with full security.'],
] as const

const tips = [
  ['Lighting Is Everything', 'Natural daylight makes feet pictures pop. Bright, clean shots sell faster on Snifffr.'],
  ['Stay Consistent', 'Upload often. Active Snifffr sellers attract repeat buyers and steadier income.'],
  ['Offer Bundles', 'Group sets together. Bundles lift your average order value across Snifffr.'],
  ['Protect Your Privacy', 'Strip backgrounds and metadata. The Snifffr anonymity tools keep you covered.'],
  ['Engage Buyers', 'Fast, friendly replies build trust and loyalty inside the Snifffr marketplace.'],
  ['Take Custom Orders', 'Premium custom requests rank among the most profitable sales on Snifffr.'],
] as const

export default async function HomePage() {
  const latest = (await getPublishedPosts()).slice(0, 3)

  return (
    <>
      <JsonLd data={[serviceJsonLd(), faqJsonLd(homeFaqs)]} />

      {/* 1. HERO */}
      <section className="hero" id="top">
        <div className="wrap">
          <span className="eyebrow">Snifffr · The Feet Pics Marketplace</span>
          <h1>Sell Feet Pics Online Safely With Snifffr</h1>
          <p className="lede">
            Snifffr is the anonymous marketplace where everyday people <strong>sell feet pics online</strong> without the
            risk. Skip the messy DMs, keep your identity hidden, and turn ordinary foot photos into a steady income you
            control from your phone.
          </p>
          <div className="cta-row">
            <AffiliateLink>Start Selling Feet Pics</AffiliateLink>
            <a className="btn btn-ghost" href="#how-it-works">
              See How Snifffr Works
            </a>
          </div>
          <p className="trust-line">
            <span className="stars" aria-hidden="true">
              ★★★★★
            </span>{' '}
            Rated 4.8/5 by 12,840+ Snifffr creators and buyers
          </p>
          <HeroArt />
        </div>
      </section>

      {/* 2. WHAT IS */}
      <section id="what-is">
        <div className="wrap">
          <span className="eyebrow">What is Snifffr</span>
          <h2>What Is Snifffr and Why Sell Feet Pics Online Here?</h2>
          <p>
            <strong>Snifffr</strong> is a purpose-built feet pics marketplace that gives regular people a safe place to{' '}
            <strong>sell feet pics online</strong> while keeping their real name and face completely private. Rather than
            chasing payment through unreliable chats, dodging fake buyers, and handing over personal contact details, you
            get a single trusted home to list your photos, set your own prices, and sell feet pictures with privacy treated
            as the starting point.
          </p>
          <p>
            Whether you are testing the waters with your very first upload or you already have an audience, Snifffr takes
            the uncertainty out of the process. If you have wondered whether Snifffr is legit, the answer shows in how it
            works: the platform pairs serious buyers with screened sellers, runs every payment discreetly, and guards your
            identity from end to end. Use the Snifffr app or the web marketplace to shoot content and grow what you earn,
            all from one place. <Link href="/about">Read more about Snifffr</Link>.
          </p>
        </div>
      </section>

      {/* 3. KEY FEATURES */}
      <section className="soft" id="features">
        <div className="wrap">
          <span className="eyebrow">Key Features</span>
          <h2>Snifffr Features That Make Selling Feet Pics Easy</h2>
          <p>
            Every tool you need to sell feet pics online lives inside Snifffr, so there are no outside apps to stitch
            together.
          </p>
          <div className="grid grid-3 mt-m">
            {features.map(([icon, title, text]) => (
              <article className="card" key={title}>
                <div className="icon" aria-hidden="true">
                  {icon}
                </div>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-m">
            <Link href="/features">Explore every Snifffr feature in detail →</Link>
          </p>
        </div>
      </section>

      {/* 4. BENEFITS */}
      <section id="benefits">
        <div className="wrap">
          <span className="eyebrow">Benefits</span>
          <h2>Why Creators Choose Snifffr to Sell Feet Pictures</h2>
          <div className="grid grid-2 mt-s">
            <ul className="checks">
              <li>
                <strong>Privacy first:</strong> Snifffr is engineered for anonymous feet selling from your very first
                listing.
              </li>
              <li>
                <strong>Flexible income:</strong> Work on your own clock and choose your own prices whenever it suits you.
              </li>
              <li>
                <strong>No upfront cost:</strong> Begin listing feet pics on Snifffr without buying any pricey equipment
                first.
              </li>
              <li>
                <strong>Real demand:</strong> Plug into a busy feet pics marketplace packed with buyers ready to pay.
              </li>
            </ul>
            <ul className="checks">
              <li>
                <strong>Full control:</strong> You alone decide which photos go public and which stay locked away on
                Snifffr.
              </li>
              <li>
                <strong>Safer than DMs:</strong> Snifffr swaps risky social media chats for one protected, purpose-built
                platform.
              </li>
              <li>
                <strong>Scales with you:</strong> Grow a casual side hustle into dependable monthly earnings using
                Snifffr&apos;s tools.
              </li>
              <li>
                <strong>Global reach:</strong> Sell feet pics online to customers around the world through the Snifffr
                marketplace.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="soft" id="how-it-works">
        <div className="wrap">
          <span className="eyebrow">How It Works</span>
          <h2>How to Sell Feet Pics Online with Snifffr in 4 Steps</h2>
          <p>Learning how to sell on Snifffr takes only a few minutes from start to first listing.</p>
          <div className="grid grid-2 steps mt-m">
            <div className="step card">
              <h3>Create Your Snifffr Profile</h3>
              <p>Register anonymously and build a seller profile. No legal name and no face are needed to get going on Snifffr.</p>
            </div>
            <div className="step card">
              <h3>Upload Your Feet Pics</h3>
              <p>Take photos on your phone, then upload and sort your feet pictures into tidy sets and bundles inside Snifffr.</p>
            </div>
            <div className="step card">
              <h3>Set Your Prices</h3>
              <p>Decide what each set is worth. The Snifffr pricing tools help you sell feet pics online for the strongest return.</p>
            </div>
            <div className="step card">
              <h3>Get Paid Securely</h3>
              <p>Once a buyer checks out, Snifffr manages the discreet payment and sends your earnings straight your way.</p>
            </div>
          </div>
          <div className="cta-row" style={{ justifyContent: 'flex-start' }}>
            <AffiliateLink>Create My Snifffr Account</AffiliateLink>
            <Link className="btn btn-ghost" href="/how-it-works">
              Read the Full Guide
            </Link>
          </div>
        </div>
      </section>

      {/* 6. CATEGORIES */}
      <section id="categories">
        <div className="wrap">
          <span className="eyebrow">What You&apos;ll Find</span>
          <h2>Categories on the Snifffr Feet Pics Marketplace</h2>
          <p>Snifffr makes room for many content styles, so every seller can stake out a niche that fits.</p>
          <div className="grid grid-4 mt-s">
            {categories.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE */}
      <section className="soft" id="why">
        <div className="wrap">
          <span className="eyebrow">Why Choose Snifffr</span>
          <h2>Why Snifffr Is the Smart Way to Sell Feet Pics Online</h2>
          <div className="grid grid-3 mt-s">
            <article className="card">
              <h3>Privacy You Can Trust</h3>
              <p>
                Snifffr was built from the ground up for anonymous feet selling, so protecting who you are is the default
                setting, never a bolt-on extra.
              </p>
            </article>
            <article className="card">
              <h3>A Real Buyer Base</h3>
              <p>
                You are not launching into an empty room. Snifffr hands you an established feet pics marketplace audience
                that is already primed to buy feet pictures.
              </p>
            </article>
            <article className="card">
              <h3>Simple, Fair, Transparent</h3>
              <p>
                There are no baffling rules to decode. Snifffr keeps selling clear and straightforward so you hold on to
                more of what your feet pics earn.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* 8. COMPARISON */}
      <section id="comparison">
        <div className="wrap">
          <span className="eyebrow">What Sets It Apart</span>
          <h2>Snifffr vs. Selling Feet Pics on Your Own</h2>
          <p>Here is why a dedicated platform like Snifffr outperforms selling feet pictures through social media DMs.</p>
          <div className="table-wrap mt-s">
            <table>
              <thead>
                <tr>
                  <th scope="col">Feature</th>
                  <th scope="col">Snifffr Marketplace</th>
                  <th scope="col">Social Media / DMs</th>
                </tr>
              </thead>
              <tbody>
                {comparison.map(([feature, yes, no]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td>
                      <span className="yes">{yes}</span>
                    </td>
                    <td>
                      <span className="no">{no}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: 16 }}>
            The takeaway is simple: Snifffr shoulders privacy, payments, and scam protection so you can get on with the
            part that matters and sell feet pics online.
          </p>
        </div>
      </section>

      {/* 9. WHO IT'S FOR */}
      <section className="soft" id="who">
        <div className="wrap">
          <span className="eyebrow">Who It&apos;s For</span>
          <h2>Who Should Use Snifffr to Sell Feet Pictures?</h2>
          <div className="grid grid-3 mt-s">
            {audiences.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 10. SOCIAL PROOF */}
      <section id="proof">
        <div className="wrap">
          <span className="eyebrow">Trusted by Thousands</span>
          <h2>Real Results From the Snifffr Community</h2>
          <div className="stats" style={{ margin: '28px 0 12px' }}>
            <div className="stat">
              <div className="num">12,840+</div>
              <div className="lab">Active Snifffr creators</div>
            </div>
            <div className="stat">
              <div className="num">4.8/5</div>
              <div className="lab">Average seller rating</div>
            </div>
            <div className="stat">
              <div className="num">$2M+</div>
              <div className="lab">Paid out to sellers</div>
            </div>
            <div className="stat">
              <div className="num">100%</div>
              <div className="lab">Anonymous by design</div>
            </div>
          </div>
          <p style={{ marginTop: 18 }}>
            Honest Snifffr reviews from creators who use the marketplace to sell feet pictures every week.
          </p>
          <div className="grid grid-3 mt-s">
            <blockquote className="quote">
              <p>
                &ldquo;Snifffr made starting out painless. I stayed totally anonymous from day one and landed my first
                sale within hours of going live.&rdquo;
              </p>
              <div className="who">— Mia R., Snifffr seller</div>
            </blockquote>
            <blockquote className="quote">
              <p>
                &ldquo;I got burned trading through DMs once. On Snifffr the buyers are real and the payouts actually
                arrive. Completely changed how I sell.&rdquo;
              </p>
              <div className="who">— Jess T., Snifffr creator</div>
            </blockquote>
            <blockquote className="quote">
              <p>
                &ldquo;As a student this is the simplest income I have come across. I shoot and sell feet pictures from
                my phone whenever I have a spare hour.&rdquo;
              </p>
              <div className="who">— Dani K., Snifffr seller</div>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 11. FAQ */}
      <section className="soft" id="faq">
        <div className="wrap">
          <span className="eyebrow">FAQ</span>
          <h2>Snifffr FAQ: Selling Feet Pics Online</h2>
          <div className="mt-s">
            <FaqList faqs={homeFaqs} openFirst />
          </div>
          <p className="mt-s">
            <Link href="/faq">See more answers about pricing, privacy and payouts →</Link>
          </p>
        </div>
      </section>

      {/* 12. GETTING STARTED */}
      <section id="get-started">
        <div className="wrap">
          <span className="eyebrow">Getting Started</span>
          <h2>Your Quick-Start Guide to Snifffr</h2>
          <p>Ready to sell feet pics online? Run through this short Snifffr checklist and launch today.</p>
          <div className="grid grid-2 mt-s">
            <ul className="checks">
              <li>Set up a free, anonymous Snifffr profile.</li>
              <li>Shoot five to ten sharp feet pictures in good light.</li>
              <li>Sort them into starter sets on Snifffr.</li>
            </ul>
            <ul className="checks">
              <li>Pick fair launch prices to pull in your first buyers.</li>
              <li>Post your availability and reply to Snifffr buyers fast.</li>
              <li>Reinvest your time and watch your earnings climb.</li>
            </ul>
          </div>
          <div style={{ marginTop: 28 }}>
            <AffiliateLink>Get Started With Snifffr</AffiliateLink>
          </div>
        </div>
      </section>

      {/* 13. TIPS */}
      <section className="soft" id="tips">
        <div className="wrap">
          <span className="eyebrow">Tips &amp; Best Practices</span>
          <h2>Pro Tips to Sell More Feet Pics on Snifffr</h2>
          <div className="grid grid-3 mt-s">
            {tips.map(([title, text]) => (
              <article className="card" key={title}>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="mt-m">
            <Link href="/safety">Read our full privacy &amp; safety guide →</Link>
          </p>
        </div>
      </section>

      {/* 14. LATEST FROM THE BLOG */}
      {latest.length > 0 && (
        <section id="latest">
          <div className="wrap">
            <span className="eyebrow">From the Blog</span>
            <h2>Latest Guides for Feet Pic Sellers</h2>
            <div className="post-grid mt-s">
              {latest.map((post) => (
                <PostCard key={post.id} post={post} headingLevel="h3" />
              ))}
            </div>
            <p className="mt-m">
              <Link href="/blog">Browse all articles →</Link>
            </p>
          </div>
        </section>
      )}

      {/* 15. FINAL CTA */}
      <CtaSection />
    </>
  )
}
