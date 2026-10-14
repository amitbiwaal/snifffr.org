import { getPublishedPosts } from '@/lib/posts'
import { absoluteUrl, site } from '@/lib/site'

export const dynamic = 'force-static'
export const revalidate = 3600

/** llms.txt (https://llmstxt.org): a plain-text map of the site for AI assistants and LLM crawlers. */
export async function GET() {
  const posts = (await getPublishedPosts()).filter((p) => !p.seo.noindex)
  const host = site.url.replace(/^https?:\/\//, '')

  const body = `# Snifffr — Sell Feet Pics Online (${host})

> An independent affiliate guide explaining how to sell feet pics online safely and anonymously using Snifffr, a feet pics marketplace. It covers getting started, pricing, privacy, payouts and best practices for adults (18+).

## About
- Brand covered: Snifffr (snifffr.org)
- Website: ${site.url}
- Primary topic: how to sell feet pics online safely and anonymously
- Audience: adults (18+) who want flexible, anonymous income selling feet pictures, plus buyers looking for a secure marketplace

## Key pages
- [Home: Sell feet pics online safely with Snifffr](${absoluteUrl('/')})
- [How it works: 4 steps from sign-up to payout](${absoluteUrl('/how-it-works')})
- [Features: anonymous selling, secure payouts, pricing tools](${absoluteUrl('/features')})
- [Privacy & safety guide: metadata, scams, payments](${absoluteUrl('/safety')})
- [FAQ: pricing, privacy, payouts](${absoluteUrl('/faq')})
- [About this guide](${absoluteUrl('/about')})

## Blog
${posts.length ? posts.map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`).join('\n') : '- No articles yet.'}

## Disclaimer
This is an independent affiliate website for informational and promotional purposes. It is not officially affiliated with, endorsed by, or sponsored by Snifffr. The site may earn a commission from referrals. Users must be 18 or older. Full disclosure: ${absoluteUrl('/affiliate-disclosure')}
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
