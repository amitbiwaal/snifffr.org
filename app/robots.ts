import type { MetadataRoute } from 'next'
import { site } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Noindex mode: crawling stays allowed so search engines can see the noindex tags/headers
  // (a robots.txt block would hide them); the sitemap is simply not advertised.
  if (site.noindex) return { rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api/'] } }

  const disallow = ['/admin', '/api/', '/search']
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow },
      // AI / LLM crawlers are welcome (same rules as everyone else).
      { userAgent: ['GPTBot', 'ChatGPT-User', 'OAI-SearchBot', 'ClaudeBot', 'Claude-SearchBot', 'Google-Extended', 'PerplexityBot'], allow: '/', disallow },
    ],
    sitemap: `${site.url}/sitemap.xml`,
  }
}
