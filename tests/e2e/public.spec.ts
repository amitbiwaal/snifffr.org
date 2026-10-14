import { expect, test, type Page } from '@playwright/test'

const PAGES = [
  '/',
  '/about',
  '/features',
  '/how-it-works',
  '/safety',
  '/faq',
  '/blog',
  '/contact',
  '/privacy-policy',
  '/terms',
  '/affiliate-disclosure',
]

async function jsonLd(page: Page) {
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents()
  return blocks.map((b) => JSON.parse(b) as { '@type': string })
}

for (const path of PAGES) {
  test(`SEO + layout: ${path}`, async ({ page }) => {
    const res = await page.goto(path)
    expect(res?.status()).toBe(200)

    // Exactly one H1, a sensible title and description.
    await expect(page.locator('h1')).toHaveCount(1)
    const title = await page.title()
    expect(title.length).toBeGreaterThan(10)
    expect(title.length).toBeLessThanOrEqual(65)
    const description = await page.locator('meta[name="description"]').getAttribute('content')
    expect(description?.length ?? 0).toBeGreaterThan(50)
    expect(description?.length ?? 0).toBeLessThanOrEqual(170)

    // Absolute self-referencing canonical + social tags.
    const canonical = await page.locator('link[rel="canonical"]').getAttribute('href')
    expect(canonical).toMatch(/^https:\/\/[^/]+(\/.*)?$/)
    expect(new URL(canonical!).pathname).toBe(path)
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1)
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image')
    await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute('content', /noindex/)

    // Structured data is valid JSON and always includes the organisation.
    const types = (await jsonLd(page)).map((d) => d['@type'])
    expect(types).toContain('Organization')
    if (path !== '/') expect(types).toContain('BreadcrumbList')

    // Every image has alt text; affiliate links are marked sponsored.
    for (const img of await page.locator('main img').all()) {
      expect(await img.getAttribute('alt')).not.toBeNull()
    }
    // (External affiliate URLs only, not the internal /affiliate-disclosure page.)
    for (const a of await page.locator('a[href^="http"][href*="affiliate"]').all()) {
      expect(await a.getAttribute('rel')).toContain('sponsored')
    }

    // No horizontal scrolling on any viewport.
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    expect(overflow).toBeLessThanOrEqual(1)
  })
}

test('home page keeps the original landing-page content', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Sell Feet Pics Online Safely With Snifffr')
  await expect(page).toHaveTitle('Snifffr Makes It Safe to Sell Feet Pics Online Anonymously')
  const types = (await jsonLd(page)).map((d) => d['@type'])
  expect(types).toEqual(expect.arrayContaining(['Organization', 'WebSite', 'Service', 'FAQPage']))
  await expect(page.locator('#faq details')).toHaveCount(7)
})

test('mobile menu opens, navigates and closes', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only')
  await page.goto('/')
  const toggle = page.getByRole('button', { name: 'Open menu' })
  await expect(toggle).toBeVisible()
  await expect(page.locator('#site-nav')).toBeHidden()
  await toggle.click()
  await expect(page.locator('#site-nav')).toBeVisible()
  await page.locator('#site-nav').getByRole('link', { name: 'Features' }).click()
  await expect(page).toHaveURL(/\/features$/)
  await expect(page.locator('#site-nav')).toBeHidden()
})

test('contact form validates and sends', async ({ page, isMobile }) => {
  test.skip(isMobile, 'one submission per run is enough (the form is rate-limited)')
  await page.goto('/contact')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.getByText('Please enter your name.')).toBeVisible()
  await page.getByLabel('Name').fill('Playwright Tester')
  await page.getByLabel('Email').fill('tester@example.com')
  await page.getByLabel('Subject (optional)').fill('Automated test message')
  await page.getByLabel('Message').fill('This message was sent by the automated end-to-end test suite.')
  await page.getByRole('button', { name: 'Send Message' }).click()
  await expect(page.locator('.form-status.ok')).toContainText('Your message has been sent')
})

test('technical SEO endpoints', async ({ request, isMobile }) => {
  test.skip(isMobile, 'viewport-independent')
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  expect(await robots.text()).toMatch(/Sitemap: https:\/\/.+\/sitemap\.xml/)

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  for (const p of ['/about', '/features', '/how-it-works', '/blog']) expect(xml).toContain(`${p}</loc>`)
  expect(xml).not.toContain('/admin')

  for (const [path, type] of [
    ['/feed.xml', 'application/rss+xml'],
    ['/llms.txt', 'text/plain'],
    ['/manifest.webmanifest', 'application/manifest+json'],
    ['/og', 'image/png'],
    ['/favicon.ico', 'image/'],
  ] as const) {
    const r = await request.get(path)
    expect(r.status(), path).toBe(200)
    expect(r.headers()['content-type'], path).toContain(type)
  }

  const missing = await request.get('/this-page-does-not-exist')
  expect(missing.status()).toBe(404)
  expect(await missing.text()).toContain('noindex')

  const legacy = await request.get('/index.html', { maxRedirects: 0 })
  expect(legacy.status()).toBe(308)
  expect(legacy.headers()['location']).toBe('/')

  const admin = await request.get('/admin', { maxRedirects: 0 })
  expect(admin.status()).toBe(307)
  expect(admin.headers()['x-robots-tag']).toContain('noindex')

  const upload = await request.post('/api/admin/upload')
  expect(upload.status()).toBe(401)
})
