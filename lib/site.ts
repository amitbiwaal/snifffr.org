const rawUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://feetpicss.com'

export const site = {
  name: 'Snifffr',
  siteName: 'Snifffr Guide',
  url: rawUrl.replace(/\/+$/, ''),
  locale: 'en_US',
  defaultTitle: 'Snifffr Makes It Safe to Sell Feet Pics Online Anonymously',
  description:
    'Sell feet pics online with Snifffr, the anonymous feet pics marketplace. Keep your identity private, get secure payouts, and reach verified buyers. Start free.',
  tagline: 'The safe, anonymous way to sell feet pics online',
  brandSameAs: ['https://snifffr.org'],
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'hello@feetpicss.com',
  defaultAuthor: 'Snifffr Guide Team',
  /** Every call-to-action on the site points here. Change it in one place. */
  affiliateUrl:
    process.env.NEXT_PUBLIC_AFFILIATE_URL ||
    'https://app.feetfinder.com/affiliate/link?af_id=97c365207f4d8-615933c06e600f70fe8-024240575f3229cc-1909bce247abe2cc48',
  themeColor: '#f97316',
} as const

export const mainNav = [
  { href: '/about', label: 'About' },
  { href: '/features', label: 'Features' },
  { href: '/how-it-works', label: 'How It Works' },
  { href: '/safety', label: 'Safety' },
  { href: '/blog', label: 'Blog' },
  { href: '/faq', label: 'FAQ' },
] as const

export const footerNav = {
  explore: [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Snifffr' },
    { href: '/features', label: 'Features' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/safety', label: 'Privacy & Safety Guide' },
  ],
  resources: [
    { href: '/blog', label: 'Blog' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
    { href: '/feed.xml', label: 'RSS Feed' },
  ],
  legal: [
    { href: '/privacy-policy', label: 'Privacy Policy' },
    { href: '/terms', label: 'Terms of Use' },
    { href: '/affiliate-disclosure', label: 'Affiliate Disclosure' },
  ],
} as const

export function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path
  return `${site.url}${path.startsWith('/') ? path : `/${path}`}`
}
