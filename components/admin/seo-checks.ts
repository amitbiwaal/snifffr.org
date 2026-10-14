export type SeoInput = {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  focusKeyword: string
  html: string
  coverImage: string
  coverAlt: string
  siteHost: string
}

export type SeoCheck = { ok: boolean; warn?: boolean; label: string }

const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim()

/** Lightweight on-page SEO checklist (runs in the browser while you type). */
export function runSeoChecks(i: SeoInput): { checks: SeoCheck[]; score: number; words: number } {
  const doc = new DOMParser().parseFromString(i.html || '', 'text/html')
  const text = norm(doc.body.textContent || '')
  const words = text ? text.split(' ').length : 0
  const kw = norm(i.focusKeyword)
  const seoTitle = i.metaTitle || i.title
  const headings = [...doc.querySelectorAll('h2, h3')].map((h) => norm(h.textContent || ''))
  const h2Count = doc.querySelectorAll('h2').length
  const links = [...doc.querySelectorAll('a[href]')].map((a) => a.getAttribute('href') || '')
  const internal = links.filter((h) => h.startsWith('/') || h.includes(i.siteHost))
  const external = links.filter((h) => /^https?:\/\//.test(h) && !h.includes(i.siteHost))
  const imgs = [...doc.querySelectorAll('img')]
  const firstPara = norm([...doc.querySelectorAll('p')].slice(0, 2).map((p) => p.textContent).join(' '))
  const kwCount = kw ? text.split(kw).length - 1 : 0
  const density = kw && words ? ((kwCount * kw.split(' ').length) / words) * 100 : 0
  const slugKw = kw.replace(/[^a-z0-9]+/g, '-')

  const checks: SeoCheck[] = [
    { ok: !!kw, label: kw ? `Focus keyword: “${i.focusKeyword}”` : 'Set a focus keyword' },
    { ok: !!kw && norm(seoTitle).includes(kw), label: 'Focus keyword appears in the SEO title' },
    { ok: !!kw && norm(i.metaDescription).includes(kw), label: 'Focus keyword appears in the meta description' },
    { ok: !!kw && i.slug.includes(slugKw), label: 'Focus keyword appears in the URL slug' },
    { ok: !!kw && firstPara.includes(kw), label: 'Focus keyword appears in the introduction' },
    { ok: !!kw && headings.some((h) => h.includes(kw)), label: 'Focus keyword appears in a subheading (H2/H3)' },
    {
      ok: density >= 0.5 && density <= 3,
      warn: density > 3,
      label: kw ? `Keyword density ${density.toFixed(1)}% (aim for 0.5–3%)` : 'Keyword density (needs a focus keyword)',
    },
    {
      ok: seoTitle.length >= 30 && seoTitle.length <= 60,
      warn: seoTitle.length > 60,
      label: `SEO title is ${seoTitle.length} characters (aim for 30–60)`,
    },
    {
      ok: i.metaDescription.length >= 120 && i.metaDescription.length <= 160,
      warn: i.metaDescription.length > 160,
      label: `Meta description is ${i.metaDescription.length} characters (aim for 120–160)`,
    },
    { ok: words >= 600, warn: words >= 300 && words < 600, label: `${words} words (aim for 600+)` },
    { ok: h2Count >= 2, label: `${h2Count} H2 subheadings (use at least 2)` },
    { ok: internal.length > 0, label: `${internal.length} internal link(s) to other pages on this site` },
    { ok: external.length > 0, label: `${external.length} outbound link(s)` },
    { ok: imgs.every((img) => (img.getAttribute('alt') || '').trim()), label: imgs.length ? 'All images have alt text' : 'No inline images (optional)' },
    { ok: !!i.coverImage && !!i.coverAlt.trim(), label: 'Featured image with alt text' },
  ]
  const score = Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)
  return { checks, score, words }
}
