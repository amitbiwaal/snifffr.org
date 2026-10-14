'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import { savePostAction } from '@/app/admin/actions'
import type { Post } from '@/lib/posts'
import { slugify } from '@/lib/text'
import { RichTextEditor } from './RichTextEditor'
import { runSeoChecks } from './seo-checks'
import { uploadImage } from './upload'

type FormState = {
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  category: string
  tags: string
  author: string
  status: 'draft' | 'published'
  publishedAt: string // datetime-local value
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  canonical: string
  noindex: boolean
}

const isFutureDate = (value: string) => !!value && Date.parse(value) > Date.now()

function toLocalInput(iso: string) {
  const d = new Date(iso)
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
}

function initialState(post: Post | undefined, defaultAuthor: string): FormState {
  return {
    title: post?.title ?? '',
    slug: post?.slug ?? '',
    excerpt: post?.excerpt ?? '',
    content: post?.content ?? '',
    coverImage: post?.coverImage ?? '',
    coverAlt: post?.coverAlt ?? '',
    category: post?.category ?? 'Guides',
    tags: post?.tags.join(', ') ?? '',
    author: post?.author ?? defaultAuthor,
    status: post?.status ?? 'draft',
    publishedAt: post ? toLocalInput(post.publishedAt) : '',
    metaTitle: post?.seo.metaTitle ?? '',
    metaDescription: post?.seo.metaDescription ?? '',
    focusKeyword: post?.seo.focusKeyword ?? '',
    canonical: post?.seo.canonical ?? '',
    noindex: post?.seo.noindex ?? false,
  }
}

export function PostEditor({
  post,
  categories,
  defaultAuthor,
  siteUrl,
  justSaved,
}: {
  post?: Post
  categories: string[]
  defaultAuthor: string
  siteUrl: string
  /** Set after the first save of a new post, which navigates from /new to /[id]. */
  justSaved?: 'draft' | 'published'
}) {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(() => initialState(post, defaultAuthor))
  const [saved, setSaved] = useState(() => ({ id: post?.id, slug: post?.slug, status: post?.status }))
  const [slugTouched, setSlugTouched] = useState(Boolean(post))
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notice, setNotice] = useState<{ type: 'ok' | 'err'; text: string } | null>(() =>
    justSaved ? { type: 'ok', text: justSaved === 'draft' ? 'Draft saved.' : 'Published! The post is live.' } : null,
  )
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)
  const [coverBusy, setCoverBusy] = useState(false)
  const coverInput = useRef<HTMLInputElement>(null)
  const formRef = useRef(form)
  useEffect(() => {
    formRef.current = form
  }, [form])
  // The SEO checklist needs DOMParser, so it only renders in the browser.
  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  )

  const siteHost = siteUrl.replace(/^https?:\/\//, '')

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => {
      const next = { ...f, [key]: value }
      if (key === 'title' && !slugTouched) next.slug = slugify(String(value))
      return next
    })
    setDirty(true)
  }, [slugTouched])

  const onContentChange = useCallback((html: string) => {
    setForm((f) => ({ ...f, content: html }))
    setDirty(true)
  }, [])

  const save = useCallback(
    async (status: 'draft' | 'published') => {
      const f = formRef.current
      setSaving(true)
      setNotice(null)
      setErrors({})
      const res = await savePostAction({
        id: saved.id,
        title: f.title,
        slug: f.slug,
        excerpt: f.excerpt,
        content: f.content,
        coverImage: f.coverImage,
        coverAlt: f.coverAlt,
        category: f.category,
        tags: f.tags.split(',').map((t) => t.trim()).filter(Boolean),
        author: f.author,
        status,
        publishedAt: f.publishedAt ? new Date(f.publishedAt).toISOString() : '',
        seo: {
          metaTitle: f.metaTitle,
          metaDescription: f.metaDescription,
          focusKeyword: f.focusKeyword,
          canonical: f.canonical,
          noindex: f.noindex,
        },
      }).catch(() => ({ ok: false as const, errors: { form: 'Could not reach the server. Check your connection and try again.' } }))
      setSaving(false)

      if (!res.ok) {
        setErrors(res.errors)
        setNotice({ type: 'err', text: res.errors.form || 'Please fix the highlighted fields.' })
        return
      }
      setDirty(false)
      setSlugTouched(true)
      setForm((cur) => ({ ...cur, status: res.post.status, slug: res.post.slug, publishedAt: toLocalInput(res.post.publishedAt) }))
      setSaved({ id: res.post.id, slug: res.post.slug, status: res.post.status })
      const scheduled = res.post.status === 'published' && isFutureDate(res.post.publishedAt)
      setNotice({
        type: 'ok',
        text:
          res.post.status === 'draft'
            ? 'Draft saved.'
            : scheduled
              ? `Scheduled for ${new Date(res.post.publishedAt).toLocaleString()}.`
              : 'Published! The post is live.',
      })
      if (!saved.id) router.replace(`/admin/posts/${res.post.id}?saved=${res.post.status}`)
      else router.refresh()
    },
    [router, saved.id],
  )

  // Ctrl/Cmd+S saves with the current status.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        if (!saving) save(formRef.current.status)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [save, saving])

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const seo = useMemo(
    () =>
      !isClient
        ? null
        : runSeoChecks({
            title: form.title,
            metaTitle: form.metaTitle,
            metaDescription: form.metaDescription,
            slug: form.slug,
            focusKeyword: form.focusKeyword,
            html: form.content,
            coverImage: form.coverImage,
            coverAlt: form.coverAlt,
            siteHost,
          }),
    [form, siteHost, isClient],
  )

  async function onCoverFile(file: File | undefined) {
    if (!file) return
    setCoverBusy(true)
    try {
      const img = await uploadImage(file)
      update('coverImage', img.url)
      if (!form.coverAlt) update('coverAlt', form.title || file.name.replace(/\.[^.]+$/, ''))
    } catch (err) {
      setNotice({ type: 'err', text: (err as Error).message })
    } finally {
      setCoverBusy(false)
      if (coverInput.current) coverInput.current.value = ''
    }
  }

  const serpTitle = form.metaTitle || (form.title ? `${form.title} | Snifffr` : 'Post title | Snifffr')
  const serpDesc = form.metaDescription || form.excerpt || 'Add a meta description to control how this post appears in Google.'
  const isScheduled = isFutureDate(form.publishedAt)
  const liveUrl = saved.status === 'published' && saved.slug ? `/blog/${saved.slug}` : null
  const err = (k: string) => errors[k] && <p className="field-error">{errors[k]}</p>

  return (
    <div className="admin-page editor-page">
      <header className="admin-page-head">
        <div>
          <h1>{post ? 'Edit post' : 'New post'}</h1>
          <p className="admin-muted">
            {saved.status === 'published' ? 'Published' : saved.id ? 'Draft' : 'Not saved yet'}
            {dirty && ' · Unsaved changes'}
            {' · '}Press Ctrl+S to save
          </p>
        </div>
        <div className="admin-row-actions">
          {saved.id && (
            <a className="admin-btn ghost" href={liveUrl ?? `/admin/preview/${saved.id}`} target="_blank" rel="noopener">
              {liveUrl ? 'View post ↗' : 'Preview ↗'}
            </a>
          )}
          <button type="button" className="admin-btn" disabled={saving} onClick={() => save('draft')}>
            {saving ? 'Saving…' : saved.status === 'published' ? 'Switch to draft' : 'Save draft'}
          </button>
          <button type="button" className="admin-btn primary" disabled={saving} onClick={() => save('published')}>
            {saving ? 'Saving…' : saved.status === 'published' ? 'Update' : isScheduled ? 'Schedule' : 'Publish'}
          </button>
        </div>
      </header>

      {notice && (
        <div className={`admin-alert ${notice.type}`} role={notice.type === 'err' ? 'alert' : 'status'}>
          {notice.text}
          {notice.type === 'ok' && liveUrl && (
            <>
              {' '}
              <a href={liveUrl} target="_blank" rel="noopener">
                View it →
              </a>
            </>
          )}
        </div>
      )}

      <div className="editor-grid">
        <div className="editor-main">
          <label className="admin-field">
            <span className="sr-only">Title</span>
            <textarea
              className="title-input"
              rows={2}
              placeholder="Post title"
              value={form.title}
              onChange={(e) => update('title', e.target.value.replace(/\s*\n\s*/g, ' '))}
              onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
              aria-label="Post title"
              data-testid="post-title"
            />
            {err('title')}
          </label>
          <div className="slug-row">
            <span className="admin-muted small">{siteHost}/blog/</span>
            <input
              type="text"
              value={form.slug}
              aria-label="URL slug"
              data-testid="post-slug"
              onChange={(e) => {
                setSlugTouched(true)
                update('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))
              }}
              onBlur={() => update('slug', slugify(form.slug || form.title))}
            />
          </div>
          {err('slug')}

          <RichTextEditor initialHtml={form.content} onChange={onContentChange} />
          {err('content')}

          <section className="admin-card">
            <h2>Excerpt</h2>
            <p className="admin-muted small">Shown on blog cards and used as the meta description if you leave that empty.</p>
            <textarea
              rows={3}
              value={form.excerpt}
              maxLength={400}
              onChange={(e) => update('excerpt', e.target.value)}
              aria-label="Excerpt"
              data-testid="post-excerpt"
            />
            <Counter value={form.excerpt.length} min={120} max={200} />
            {err('excerpt')}
          </section>
        </div>

        <aside className="editor-side">
          <section className="admin-card">
            <h2>Publish</h2>
            <label className="admin-field">
              <span>Publish date</span>
              <input type="datetime-local" value={form.publishedAt} onChange={(e) => update('publishedAt', e.target.value)} />
            </label>
            <p className="admin-muted small">Leave empty to use “now”. A future date schedules the post.</p>
            <label className="admin-field">
              <span>Author</span>
              <input type="text" value={form.author} onChange={(e) => update('author', e.target.value)} />
            </label>
          </section>

          <section className="admin-card">
            <h2>Featured image</h2>
            {form.coverImage ? (
              <div className="cover-preview">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={form.coverImage} alt={form.coverAlt} />
                <button type="button" className="admin-btn small ghost" onClick={() => update('coverImage', '')}>
                  Remove
                </button>
              </div>
            ) : (
              <p className="admin-muted small">Recommended: 1600×900 px or larger, landscape.</p>
            )}
            <input ref={coverInput} type="file" accept="image/*" hidden data-testid="cover-file" onChange={(e) => onCoverFile(e.target.files?.[0])} />
            <button type="button" className="admin-btn small" disabled={coverBusy} onClick={() => coverInput.current?.click()}>
              {coverBusy ? 'Uploading…' : form.coverImage ? 'Replace image' : 'Upload image'}
            </button>
            <label className="admin-field" style={{ marginTop: 10 }}>
              <span>Featured image alt text</span>
              <input type="text" value={form.coverAlt} onChange={(e) => update('coverAlt', e.target.value)} placeholder="Describe the image" />
            </label>
            {err('coverImage')}
          </section>

          <section className="admin-card">
            <h2>Organise</h2>
            <label className="admin-field">
              <span>Category</span>
              <input type="text" list="category-options" value={form.category} onChange={(e) => update('category', e.target.value)} data-testid="post-category" />
              <datalist id="category-options">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
            <label className="admin-field">
              <span>Tags (comma separated)</span>
              <input type="text" value={form.tags} onChange={(e) => update('tags', e.target.value)} placeholder="privacy, pricing, beginners" data-testid="post-tags" />
            </label>
          </section>

          <section className="admin-card">
            <h2>SEO</h2>
            <div className="serp" aria-label="Google search preview">
              <div className="serp-url">
                {siteHost} › blog › {form.slug || 'post-url'}
              </div>
              <div className="serp-title">{serpTitle.length > 62 ? `${serpTitle.slice(0, 60)}…` : serpTitle}</div>
              <div className="serp-desc">{serpDesc.length > 160 ? `${serpDesc.slice(0, 158)}…` : serpDesc}</div>
            </div>
            <label className="admin-field">
              <span>Focus keyword</span>
              <input type="text" value={form.focusKeyword} onChange={(e) => update('focusKeyword', e.target.value)} placeholder="e.g. sell feet pics online" data-testid="seo-keyword" />
            </label>
            <label className="admin-field">
              <span>SEO title</span>
              <input type="text" value={form.metaTitle} onChange={(e) => update('metaTitle', e.target.value)} placeholder={form.title ? `${form.title} | Snifffr` : 'Defaults to the post title'} data-testid="seo-title" />
              <Counter value={(form.metaTitle || serpTitle).length} min={30} max={60} />
              {err('seo.metaTitle')}
            </label>
            <label className="admin-field">
              <span>Meta description</span>
              <textarea rows={3} value={form.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} placeholder="Defaults to the excerpt" data-testid="seo-description" />
              <Counter value={form.metaDescription.length} min={120} max={160} />
              {err('seo.metaDescription')}
            </label>
            <details className="admin-advanced">
              <summary>Advanced</summary>
              <label className="admin-field">
                <span>Canonical URL (only if this post is a copy of another page)</span>
                <input type="url" value={form.canonical} onChange={(e) => update('canonical', e.target.value)} placeholder="https://…" />
                {err('seo.canonical')}
              </label>
              <label className="admin-check">
                <input type="checkbox" checked={form.noindex} onChange={(e) => update('noindex', e.target.checked)} /> Hide from search engines (noindex)
              </label>
            </details>
          </section>

          {seo && (
            <section className="admin-card">
              <h2>
                SEO checklist <span className={`seo-score ${seo.score >= 80 ? 'good' : seo.score >= 50 ? 'ok' : 'bad'}`}>{seo.score}/100</span>
              </h2>
              <ul className="seo-checks" data-testid="seo-checks">
                {seo.checks.map((c) => (
                  <li key={c.label} className={c.ok ? 'ok' : c.warn ? 'warn' : 'bad'}>
                    {c.label}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
    </div>
  )
}

function Counter({ value, min, max }: { value: number; min: number; max: number }) {
  const cls = value === 0 ? '' : value < min ? 'warn' : value > max ? 'bad' : 'ok'
  return (
    <span className={`char-count ${cls}`}>
      {value} / {max}
    </span>
  )
}
