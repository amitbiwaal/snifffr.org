# Snifffr Guide: Next.js website + blog CMS

Live (noindex, pre-launch): https://snifffr.org · https://snifffr-org.vercel.app

The former single-page landing page (kept in `legacy/` for reference), rebuilt as a full website with
**Next.js 16 (App Router) + React 19**, a built-in **blog CMS** with a rich-text editor, and technical SEO.

## Quick start

```bash
npm install
cp .env.example .env.local        # then fill it in (see below)
npm run hash-password -- "your-strong-password"   # paste the output into ADMIN_PASSWORD_HASH
npm run dev                       # http://localhost:3000
```

Production:

```bash
npm run build
npm start                         # or: npx next start -p 3210
```

Requires Node.js 20.9+.

### Storage (works locally and on serverless)

The app picks a storage backend from the environment, in this order:

| Data | 1st choice | 2nd choice | Fallback (local dev / VPS) |
| --- | --- | --- | --- |
| Posts and contact messages | **Turso** (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) | **Private Vercel Blob** store (`DATA_BLOB_READ_WRITE_TOKEN`) | JSON files in `content/posts`, `data/` |
| Uploaded images | **Vercel Blob** (`BLOB_READ_WRITE_TOKEN`) | | `content/uploads` |

### Deployment on Vercel (current setup)

- Vercel project **`snifffr-org`**, production domain **snifffr.org** (`www` redirects to it).
- Blob stores: `snifffr-media` (public, images) and `snifffr-data` (private, posts + messages), both connected to the project.
- Env vars set on Vercel: `NEXT_PUBLIC_SITE_URL`, `SITE_NOINDEX`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`,
  `BLOB_READ_WRITE_TOKEN`, `DATA_BLOB_READ_WRITE_TOKEN`.
- Deploy: `vercel deploy --prod` (or connect the GitHub repo in Vercel → Settings → Git for automatic deploys).
- **Switching to Turso:** in Vercel → Storage → Create Database → Turso, connect it to `snifffr-org`
  (this sets `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`), re-create posts (or copy them over), and redeploy. Turso is
  used automatically when those variables exist.
- **Going live for SEO:** set `SITE_NOINDEX=false` (or delete it) and redeploy.

### Environment variables (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonicals, sitemap, OG tags and JSON-LD (default `https://feetpicss.com`) |
| `ADMIN_EMAIL` | CMS login email |
| `ADMIN_PASSWORD_HASH` | scrypt hash from `npm run hash-password -- "..."` (the plain password is never stored) |
| `SESSION_SECRET` | 32+ random characters for signing the login cookie |
| `NEXT_PUBLIC_AFFILIATE_URL` | Optional: overrides the "Start Selling" link (default in `lib/site.ts`) |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_BING_SITE_VERIFICATION` | Optional Search Console / Bing verification codes |
| `CONTENT_DIR`, `DATA_DIR` | Optional storage locations (default `./content`, `./data`) |
| `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` | Turso database for posts + messages (optional) |
| `DATA_BLOB_READ_WRITE_TOKEN` | Private Vercel Blob store for posts + messages (optional) |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob store for uploaded images (optional) |
| `SITE_NOINDEX` | `true` = noindex the whole site (meta robots + `X-Robots-Tag`), for staging / pre-launch |

The login cookie is `Secure` in production, so serve the production site over HTTPS.

## Pages

| URL | Page |
| --- | --- |
| `/` | Home: the original landing page (same copy, H1 and FAQ) plus latest blog posts |
| `/about`, `/features`, `/how-it-works`, `/safety`, `/faq` | Content pages |
| `/blog`, `/blog/page/[n]`, `/blog/category/[slug]`, `/blog/[slug]` | Blog |
| `/search?q=` | Blog search (noindex) |
| `/contact` | Contact form; messages appear in the CMS |
| `/privacy-policy`, `/terms`, `/affiliate-disclosure` | Legal |
| `/admin` | CMS (login required) |

## The CMS (`/admin`)

- **Posts list**: filter by published, scheduled or draft; search; edit; view or preview; delete.
- **Editor** (TipTap): headings (H2–H4), bold, italic, underline, strike, code, lists, quotes, dividers,
  alignment, links (with *new tab* and *sponsored/nofollow* options), image upload with alt text,
  undo/redo, and an **HTML source mode** for pasting. Ctrl+S saves. You are warned before leaving with
  unsaved changes.
- **Publishing**: draft, publish, or schedule (future date); draft preview at `/admin/preview/[id]`.
- **SEO panel**: focus keyword, SEO title, meta description (with length counters), Google result preview,
  canonical override, noindex, plus a live **SEO checklist** (keyword placement, density, length, headings,
  links, alt text).
- **Images** are re-encoded to WebP (max 1600px wide), and **EXIF/GPS metadata is stripped**.
- **Slug changes** keep the old URL working with a 301/308 redirect.
- Saving a post instantly refreshes the home page, blog, category pages, sitemap, RSS and llms.txt.
- **Messages** inbox for contact-form submissions.

## Technical SEO

- Per-page `<title>`, meta description, self-referencing canonical, Open Graph and Twitter cards
- Generated 1200×630 social images: `/og` for the site, and `/og/[slug]` per post (uses the cover photo)
- JSON-LD: Organization, WebSite (+ SearchAction), Service, FAQPage, BreadcrumbList, BlogPosting, CollectionPage
- `sitemap.xml` (including posts, categories and images; served from `/sitemap-xml` via a rewrite so CMS saves can
  revalidate it on Vercel), `robots.txt`, RSS `feed.xml`, `llms.txt`, web manifest
- `/admin`, `/api`, `/search` are blocked in robots.txt and send `X-Robots-Tag: noindex`; the 404 page is noindex
- Affiliate links use `rel="nofollow sponsored"`
- 301/308 redirects for old URLs (`/index.html` → `/`, etc.)
- Self-hosted font (no layout shift), optimised images (AVIF/WebP via `next/image`), static pre-rendering with
  revalidation
- Mobile-first responsive layout, skip link, focus styles, reduced-motion support
- Security headers (HSTS, nosniff, frame options, referrer and permissions policies)

## Tests

End-to-end tests (Playwright, using the locally installed Microsoft Edge):

```bash
npm run build && npx next start -p 3210
E2E_ADMIN_EMAIL=you@example.com E2E_ADMIN_PASSWORD='...' npm run test:e2e

# Against the live (noindex) site:
E2E_BASE_URL=https://snifffr-org.vercel.app E2E_EXPECT_NOINDEX=1 E2E_ADMIN_EMAIL=... E2E_ADMIN_PASSWORD=... npm run test:e2e
```

They cover every public page on desktop and mobile (title, description, canonical, OG, JSON-LD, one H1, no
horizontal scroll), the mobile menu, the contact form, the SEO endpoints, and the full CMS flow: login, writing
with the toolbar, image upload with EXIF stripping, draft, preview, publish, public SEO markup, slug-change
redirect, XSS sanitising and delete.

`npm run lint` and `npm run typecheck` run ESLint and TypeScript.

## Project layout

```
app/(site)/         public pages
app/admin/          CMS (login, posts, editor, messages) + server actions
app/api/admin/      image upload API
app/og/             social image generation
components/         UI components (components/admin = CMS editor)
lib/                site config, post store, auth, SEO helpers, sanitiser
content/posts/      blog posts (one JSON file each)
content/uploads/    uploaded images
data/               private runtime data (contact messages), git-ignored
legacy/             the original static landing page
```
