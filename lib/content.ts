import type { Faq } from './seo'

/** FAQ shown (and marked up) on the home page — unchanged from the original landing page. */
export const homeFaqs: Faq[] = [
  {
    q: 'Is it legal to sell feet pics online?',
    a: 'Yes. In most regions, selling feet pictures is perfectly legal once you are over 18 and you own every image you list.',
  },
  {
    q: 'How much can I earn selling feet pics with Snifffr?',
    a: 'Earnings vary widely because you set every price yourself. New Snifffr sellers often start with a handful of dollars per set, while consistent creators who post regularly and offer bundles or subscriptions build that into a meaningful monthly income.',
  },
  {
    q: 'Can I stay anonymous on Snifffr?',
    a: 'Yes. Anonymity is the default rather than an upgrade. You can register without your legal name, you never have to show your face, and your banking details stay hidden from the people buying your photos.',
  },
  {
    q: 'How do I get paid when I sell feet pictures?',
    a: 'When a buyer purchases one of your sets, Snifffr processes the transaction and routes your Snifffr payout to you through its discreet system. You never swap payment app handles or bank information directly with a customer, which removes one of the biggest risks of selling through social media DMs and keeps your financial identity protected.',
  },
  {
    q: 'Do I need professional equipment to start?',
    a: 'No. A modern phone camera is enough to begin.',
  },
  {
    q: 'Is Snifffr safe for buyers too?',
    a: 'Yes. Buyers browse a marketplace where activity is screened to cut down on scams and fake listings, and payments are handled inside the platform instead of through unverified third parties.',
  },
  {
    q: 'How do I get started on Snifffr today?',
    a: 'Create a free anonymous profile, photograph five to ten clear shots, group them into starter sets, and set fair launch prices. Once your listings are live you can share your availability, reply to interested buyers, and begin selling feet pics online within the same day.',
  },
]

/**
 * Extended FAQ for /faq. Deliberately different questions from the home page:
 * Google asks that the same Q&A is only marked up once per site.
 */
export const faqGroups: { title: string; id: string; faqs: Faq[] }[] = [
  {
    title: 'Getting Started',
    id: 'getting-started',
    faqs: [
      {
        q: 'How old do I have to be to sell feet pics?',
        a: 'You must be at least 18 years old (or the age of majority where you live, if that is higher). Reputable marketplaces verify age before you can receive payouts, and you should never buy from or sell to anyone under 18.',
      },
      {
        q: 'How long does it take to set up a seller profile?',
        a: 'Most people finish in under fifteen minutes: choose a pseudonym, write a short bio, pick a profile image that does not show your face, and complete the platform’s verification step. Verification itself can take a little longer while it is reviewed.',
      },
      {
        q: 'How many photos should I upload at the start?',
        a: 'Aim for five to ten sharp, well-lit images grouped into one or two starter sets. That is enough for buyers to judge your style without you spending days preparing before you know what sells.',
      },
      {
        q: 'Do I have to show my face?',
        a: 'No. Feet content sells on its own, and keeping your face, tattoos and other identifying marks out of frame is one of the simplest ways to protect your anonymity.',
      },
    ],
  },
  {
    title: 'Pricing & Earnings',
    id: 'pricing',
    faqs: [
      {
        q: 'What should I charge for my first sets?',
        a: 'Start a little below what established sellers in your niche charge so you can collect your first reviews, then raise prices once you have repeat buyers. Bundles of several photos usually sell better than single images.',
      },
      {
        q: 'Are custom requests worth it?',
        a: 'Often, yes. Custom content takes more effort, so it should be priced higher than ready-made sets. Agree on the details and the price inside the platform before you start, and decline anything you are not comfortable with.',
      },
      {
        q: 'Do I have to pay tax on what I earn?',
        a: 'In most countries income from selling content is taxable. Keep a simple record of your sales and payouts and check the rules where you live, or ask a local tax professional.',
      },
    ],
  },
  {
    title: 'Privacy & Safety',
    id: 'privacy',
    faqs: [
      {
        q: 'Can a photo reveal where I live?',
        a: 'It can. Many phones store GPS coordinates in a photo’s EXIF metadata, and backgrounds can show recognisable details. Remove metadata before uploading, shoot against plain backgrounds, and avoid windows, mail and anything with your name on it.',
      },
      {
        q: 'Should I use my personal email address?',
        a: 'No. Create a separate email address used only for selling. It keeps your real identity separate from your seller account and makes it easier to spot phishing messages.',
      },
      {
        q: 'What are the most common scams to watch out for?',
        a: 'Buyers who ask to move the conversation and payment off-platform, “overpayments” that ask you to send money back, requests for free samples in bulk, and fake payment screenshots. Keep every conversation and payment inside the marketplace.',
      },
    ],
  },
  {
    title: 'Payments & Payouts',
    id: 'payments',
    faqs: [
      {
        q: 'Why is it safer to get paid through a marketplace than by payment app?',
        a: 'Payment apps can expose your real name and allow chargebacks after you have delivered the content. A marketplace sits between you and the buyer, so neither side sees the other’s financial details.',
      },
      {
        q: 'How often are payouts made?',
        a: 'Payout schedules depend on the platform and the payout method you choose. Check the payout section of your seller dashboard for current minimums, fees and processing times before you make your first sale.',
      },
    ],
  },
]
