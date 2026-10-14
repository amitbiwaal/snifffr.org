import { rmSync } from 'node:fs'
import path from 'node:path'
import { expect, test, type Page } from '@playwright/test'
import sharp from 'sharp'

// Local uploads (/uploads/...) or Vercel Blob URLs, always re-encoded to WebP.
const UPLOAD_URL = /^(\/uploads\/|https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/uploads\/).+\.webp$/
const EMAIL = process.env.E2E_ADMIN_EMAIL || ''
const PASSWORD = process.env.E2E_ADMIN_PASSWORD || ''

async function login(page: Page) {
  await page.goto('/admin/login')
  await page.getByLabel('Email').fill(EMAIL)
  await page.getByLabel('Password').fill(PASSWORD)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await expect(page).toHaveURL(/\/admin$/)
}

async function makeImage(text: string, format: 'png' | 'jpeg', exifMarker?: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1000">
    <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f97316"/><stop offset="1" stop-color="#ea580c"/></linearGradient></defs>
    <rect width="1800" height="1000" fill="url(#g)"/>
    <text x="900" y="520" font-size="90" font-family="Arial" fill="#fff" text-anchor="middle">${text}</text></svg>`
  let img = sharp(Buffer.from(svg))
  if (exifMarker) img = img.withExif({ IFD0: { Copyright: exifMarker, ImageDescription: exifMarker } })
  return format === 'png' ? img.png().toBuffer() : img.jpeg({ quality: 85 }).toBuffer()
}

test.describe.serial('CMS', () => {
  test.skip(!EMAIL || !PASSWORD, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD to run CMS tests')

  const stamp = Date.now().toString(36)
  const title = `E2E Test Post ${stamp}`
  const slug = `e2e-test-post-${stamp}`
  const renamed = `${slug}-renamed`
  const EXIF_MARKER = `SECRET-EXIF-${stamp}`
  let postId = ''
  const uploaded: string[] = []

  test('rejects a wrong password', async ({ page }) => {
    await page.goto('/admin/login')
    await page.getByLabel('Email').fill(EMAIL)
    await page.getByLabel('Password').fill('definitely-not-the-password')
    await page.getByRole('button', { name: 'Sign in' }).click()
    await expect(page.locator('.admin-alert.err')).toHaveText('Incorrect email or password.')
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('write, upload, save draft, preview and publish a post', async ({ page, request }) => {
    await login(page)
    await page.goto('/admin/posts/new')

    await page.getByTestId('post-title').fill(title)
    await expect(page.getByTestId('post-slug')).toHaveValue(slug)

    // --- Write with the visual editor toolbar ---
    const editor = page.getByTestId('editor')
    await editor.click()
    await page.keyboard.type('This introduction paragraph mentions e2e testing for the CMS.')
    await page.keyboard.press('Enter')
    await page.getByLabel('Text style').selectOption('h2')
    await page.keyboard.type('First section about e2e testing')
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Bold (Ctrl+B)' }).click()
    await page.keyboard.type('bold words')
    await page.getByRole('button', { name: 'Bold (Ctrl+B)' }).click()
    await page.keyboard.type(' and normal words.')
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Bullet list' }).click()
    await page.keyboard.type('Item one')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Item two')
    await page.keyboard.press('Enter')
    await page.keyboard.press('Enter')
    await page.getByLabel('Text style').selectOption('h2')
    await page.keyboard.type('Second section')
    await page.keyboard.press('Enter')
    await page.keyboard.type('Read the safety guide')
    await page.keyboard.press('Shift+Home')
    await page.getByRole('button', { name: 'Insert or edit link' }).click()
    await page.getByLabel('Link URL').fill('/safety')
    await page.getByRole('button', { name: 'Apply' }).click()
    await expect(editor.locator('a[href="/safety"]')).toHaveText('Read the safety guide')
    await expect(editor).toBeFocused()

    // --- Inline image upload ---
    await page.keyboard.press('End')
    await page.keyboard.press('Enter')
    await page.getByRole('button', { name: 'Insert image' }).click()
    await page.getByTestId('inline-image-file').setInputFiles({
      name: 'inline-test.png',
      mimeType: 'image/png',
      buffer: await makeImage('Inline image', 'png'),
    })
    await expect(page.getByLabel('Image URL')).toHaveValue(UPLOAD_URL)
    uploaded.push(await page.getByLabel('Image URL').inputValue())
    await page.getByLabel('Alt text', { exact: true }).fill('Orange test graphic')
    await page.getByRole('button', { name: 'Insert', exact: true }).click()
    await expect(editor.locator('img[alt="Orange test graphic"]')).toHaveCount(1)

    // --- Featured image (with EXIF that must be stripped) ---
    await page.getByTestId('cover-file').setInputFiles({
      name: 'cover-test.jpg',
      mimeType: 'image/jpeg',
      buffer: await makeImage('Cover image', 'jpeg', EXIF_MARKER),
    })
    await expect(page.locator('.cover-preview img')).toHaveAttribute('src', UPLOAD_URL)
    uploaded.push((await page.locator('.cover-preview img').getAttribute('src'))!)

    // --- Organise + SEO ---
    await page.getByTestId('post-category').fill('E2E Testing')
    await page.getByTestId('post-tags').fill('e2e, testing')
    await page.getByTestId('post-excerpt').fill('An automated test post created by the Playwright suite to verify the CMS end to end.')
    await page.getByTestId('seo-keyword').fill('e2e testing')
    await page.getByTestId('seo-description').fill(
      'Automated e2e testing post that checks the editor, image uploads, publishing, structured data and sitemap updates for the CMS.',
    )
    await expect(page.getByTestId('seo-checks')).toContainText('Focus keyword appears in a subheading')

    // --- Save draft ---
    await page.getByRole('button', { name: 'Save draft' }).click()
    await expect(page).toHaveURL(/\/admin\/posts\/[0-9a-f-]{36}\?saved=draft$/)
    await expect(page.locator('.admin-alert.ok')).toHaveText('Draft saved.')
    postId = page.url().match(/posts\/([0-9a-f-]{36})/)![1]

    // Drafts are not public, but can be previewed by an admin.
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404)
    const preview = await page.context().newPage()
    await preview.goto(`/admin/preview/${postId}`)
    await expect(preview.locator('h1')).toHaveText(title)
    await expect(preview.locator('.preview-bar')).toContainText('draft is not public yet')
    // Let background link prefetches finish: a render started before publishing could otherwise
    // land in the ISR cache after the publish revalidation (a stale-render race).
    await preview.waitForLoadState('networkidle')
    await preview.close()

    // --- Publish ---
    await page.getByRole('button', { name: 'Publish' }).click()
    await expect(page.locator('.admin-alert.ok')).toContainText('Published!')
  })

  test('published post is live with full SEO markup', async ({ page, request }) => {
    const res = await page.goto(`/blog/${slug}`)
    expect(res?.status()).toBe(200)
    await expect(page.locator('h1')).toHaveText(title)
    await expect(page).toHaveTitle(`${title} | Snifffr`)

    const prose = page.locator('.prose')
    await expect(prose.locator('h2#first-section-about-e2e-testing')).toHaveCount(1)
    await expect(prose.locator('strong')).toHaveText('bold words')
    await expect(prose.locator('ul li')).toHaveCount(2)
    await expect(prose.locator('a[href="/safety"]')).toHaveCount(1)
    const inlineImg = prose.locator('img[alt="Orange test graphic"]')
    await expect(inlineImg).toHaveAttribute('loading', 'lazy')

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', new RegExp(`/blog/${slug}$`))
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article')
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', new RegExp(`/og/${slug}$`))
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Automated e2e testing post/)
    await expect(page.locator('meta[property="article:published_time"]')).toHaveCount(1)

    const ld = (await page.locator('script[type="application/ld+json"]').allTextContents()).map((t) => JSON.parse(t))
    const article = ld.find((d) => d['@type'] === 'BlogPosting')
    expect(article.headline).toBe(title)
    expect(article.datePublished).toBeTruthy()
    expect(ld.find((d) => d['@type'] === 'BreadcrumbList').itemListElement).toHaveLength(4)

    // Uploaded images are served, re-encoded to WebP and stripped of EXIF metadata.
    const coverSrc = (await page.locator('.cover img').getAttribute('src'))!
    const coverUrl = new URL(coverSrc, page.url())
    const original = coverUrl.searchParams.get('url') || coverUrl.pathname
    const img = await request.get(original)
    expect(img.status()).toBe(200)
    expect(img.headers()['content-type']).toBe('image/webp')
    expect((await img.body()).includes(EXIF_MARKER)).toBe(false)
    const optimised = await request.get(coverSrc)
    expect(optimised.status()).toBe(200)

    // Listed everywhere it should be.
    expect(await (await request.get('/blog')).text()).toContain(title)
    expect(await (await request.get('/')).text()).toContain(title)
    expect(await (await request.get('/blog/category/e2e-testing')).text()).toContain(title)
    expect(await (await request.get('/sitemap.xml')).text()).toContain(`/blog/${slug}</loc>`)
    expect(await (await request.get('/feed.xml')).text()).toContain(title)
    expect(await (await request.get('/llms.txt')).text()).toContain(title)
    const og = await request.get(`/og/${slug}`)
    expect(og.status()).toBe(200)
    expect(og.headers()['content-type']).toBe('image/png')
    const search = await request.get(`/search?q=${encodeURIComponent(stamp)}`)
    expect(await search.text()).toContain(title)
  })

  test('renaming the slug 301-redirects the old URL, and HTML is sanitised', async ({ page, request }) => {
    await login(page)
    await page.goto(`/admin/posts/${postId}`)
    await page.getByTestId('post-slug').fill(renamed)
    await page.getByTestId('post-slug').blur()

    // Hostile HTML pasted in source mode must be neutralised on save.
    await page.getByRole('button', { name: 'HTML', exact: true }).click()
    const source = page.getByTestId('html-source')
    await source.fill(
      `${await source.inputValue()}\n<p onclick="alert(1)">Clickable?</p><script>alert('xss')</script><img src="x" onerror="alert(2)" alt="bad"><a href="javascript:alert(3)">js link</a>`,
    )
    await page.getByRole('button', { name: 'Update' }).click()
    await expect(page.locator('.admin-alert.ok')).toContainText('Published!')

    const old = await request.get(`/blog/${slug}`, { maxRedirects: 0 })
    expect(old.status()).toBe(308)
    // Next.js may repeat an identical Location header on the first (uncached) render; that is harmless.
    expect(new Set(old.headers()['location'].split(/,\s*/))).toEqual(new Set([`/blog/${renamed}`]))

    const html = await (await request.get(`/blog/${renamed}`)).text()
    expect(html).toContain(title)
    expect(html).not.toContain("alert('xss')")
    expect(html).not.toContain('onerror')
    expect(html).not.toContain('onclick')
    expect(html).not.toContain('javascript:alert')
  })

  test('deleting a post removes it from the site', async ({ page, request }) => {
    await login(page)
    page.once('dialog', (d) => d.accept())
    await page.locator('tr', { hasText: title }).getByRole('button', { name: 'Delete' }).click()
    await expect(page).toHaveURL(/\/admin\?deleted=1$/)
    await expect(page.getByText('Post deleted.')).toBeVisible()

    expect((await request.get(`/blog/${renamed}`)).status()).toBe(404)
    expect((await request.get(`/blog/${slug}`)).status()).toBe(404)
    expect(await (await request.get('/sitemap.xml')).text()).not.toContain(renamed)
  })

  // Best-effort: remove the test images when the server under test uses this checkout's content folder.
  test.afterAll(() => {
    const root = path.resolve(process.env.CONTENT_DIR || 'content', 'uploads')
    for (const url of uploaded.filter((u) => u.startsWith('/uploads/'))) rmSync(path.join(root, url.replace(/^\/uploads\//, '')), { force: true })
  })
})
