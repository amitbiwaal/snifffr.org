import Link from 'next/link'
import { AffiliateLink } from '@/components/AffiliateLink'
import { CtaSection } from '@/components/CtaSection'
import { PageHero } from '@/components/PageHero'
import { pageMetadata } from '@/lib/seo'

export const metadata = pageMetadata({
  title: 'How to Sell Feet Pics Anonymously: Safety Guide',
  description:
    'How to sell feet pics online without revealing your identity: remove photo metadata, avoid common scams, protect your payments and spot red-flag buyers.',
  path: '/safety',
})

const redFlags = [
  'Asks to move the chat to another app, or to pay you by gift card or payment app',
  'Sends a “payment screenshot” instead of paying through the platform',
  'Overpays and asks you to refund the difference',
  'Wants lots of free samples before buying anything',
  'Asks for your face, your location, your real name or your other social accounts',
  'Pressures you with urgency, guilt or threats',
]

export default function SafetyPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: 'Privacy & Safety', path: '/safety' }]}
        eyebrow="Privacy & Safety"
        title="How to Sell Feet Pics Online Without Revealing Who You Are"
        lede="Anonymity is not one setting. It is a handful of simple habits. Follow this checklist before your first upload and you will avoid the mistakes most new sellers make."
      />

      <section>
        <div className="wrap-narrow">
          <nav className="card" aria-label="On this page" style={{ marginBottom: 36 }}>
            <strong>On this page</strong>
            <ul className="checks" style={{ marginTop: 8 }}>
              <li><a href="#identity">Separate your seller identity</a></li>
              <li><a href="#photos">Make your photos anonymous</a></li>
              <li><a href="#payments">Keep payments on-platform</a></li>
              <li><a href="#scams">Spot scams and red-flag buyers</a></li>
              <li><a href="#boundaries">Set boundaries and stick to them</a></li>
            </ul>
          </nav>

          <h2 id="identity">1. Separate Your Seller Identity</h2>
          <p>
            Your seller identity should share nothing with your real life. That means a store name you have never used
            anywhere else, a dedicated email address, and a profile picture that does not include your face. If you use
            the same username on Instagram or Reddit, a curious buyer can connect the two in seconds.
          </p>
          <ul className="checks">
            <li>Create a new email address used only for selling.</li>
            <li>Choose a pseudonym that is not linked to any other account.</li>
            <li>Use a password manager and turn on two-factor authentication.</li>
          </ul>

          <h2 id="photos">2. Make Your Photos Anonymous</h2>
          <p>
            Photos give away more than most people realise. Many phones save the exact GPS location in each image’s{' '}
            <strong>EXIF metadata</strong>, and backgrounds can reveal your home, your workplace or even your city.
          </p>
          <ul className="checks">
            <li>Turn off location tagging in your camera settings, and strip metadata before uploading.</li>
            <li>Shoot against plain backgrounds: sheets, towels, a blank wall or a rug.</li>
            <li>Keep mail, windows with views, mirrors, photos and jewellery out of frame.</li>
            <li>Cover or avoid distinctive tattoos, scars and birthmarks.</li>
          </ul>
          <div className="notice">
            <p>
              <strong>Tip:</strong> take a screenshot of a photo and upload the screenshot instead. On most phones this
              drops the original metadata, though dedicated metadata-removal apps are more reliable.
            </p>
          </div>

          <h2 id="payments">3. Keep Payments On-Platform</h2>
          <p>
            The single biggest risk when selling through DMs is payment. Payment apps can show your legal name, and a buyer
            can reverse a payment after you have already delivered the content. A marketplace like Snifffr takes payment
            first and pays you out separately, so neither side sees the other’s financial details.
          </p>
          <ul className="checks">
            <li>Never deliver content until the platform confirms the payment.</li>
            <li>Never share payment-app handles, bank details or crypto wallets with buyers.</li>
            <li>Keep records of your sales and payouts for tax purposes.</li>
          </ul>

          <h2 id="scams">4. Spot Scams and Red-Flag Buyers</h2>
          <p>Most scams follow the same handful of patterns. Walk away when a buyer:</p>
          <ul className="checks crosses">
            {redFlags.map((r) => (
              <li key={r}>{r}</li>
            ))}
          </ul>
          <p>
            Use the platform’s block and report tools freely. Blocking a time-waster costs you nothing, and reporting helps
            keep the marketplace safer for everyone.
          </p>

          <h2 id="boundaries">5. Set Boundaries and Stick to Them</h2>
          <p>
            Decide what you will and will not create before a buyer asks. Write it in your profile so you do not have to
            explain it in every chat. A clear “no” is a complete answer: genuine buyers respect it, and the ones who do not
            are not worth your time.
          </p>

          <div className="callout">
            <h3>Sell with privacy built in</h3>
            <p>
              Snifffr is designed for anonymous selling: pseudonymous profiles, on-platform payments and screened buyers.
              Read <Link href="/how-it-works">how it works</Link> or create your free account now.
            </p>
            <AffiliateLink className="btn btn-sm">Create a Free Anonymous Account</AffiliateLink>
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  )
}
