import 'server-only'
import sanitizeHtml from 'sanitize-html'
import { decodeEntities, slugify } from './text'

/**
 * Whitelist sanitiser for HTML produced by the admin editor. Runs on every save,
 * so whatever lands on disk is already safe to render.
 */
export function sanitizePostHtml(dirty: string) {
  return sanitizeHtml(dirty, {
    allowedTags: [
      'p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 's', 'a', 'ul', 'ol', 'li', 'blockquote',
      'img', 'hr', 'br', 'code', 'pre', 'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'figure', 'figcaption', 'mark', 'sub', 'sup',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'title', 'width', 'height'],
      th: ['colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      p: ['style'],
      h2: ['style'],
      h3: ['style'],
      h4: ['style'],
    },
    allowedStyles: {
      '*': { 'text-align': [/^(left|right|center|justify)$/] },
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowedSchemesByTag: { img: ['http', 'https'] },
    allowProtocolRelative: false,
    transformTags: {
      // The post title is the page's only <h1>.
      h1: 'h2',
      h5: 'h4',
      h6: 'h4',
      b: 'strong',
      i: 'em',
      strike: 's',
      del: 's',
      a: (tagName, attribs) => {
        const rel = new Set((attribs.rel || '').split(/\s+/).filter(Boolean))
        if (attribs.target === '_blank') {
          rel.add('noopener')
          rel.add('noreferrer')
        } else {
          delete attribs.target
        }
        if (rel.size) attribs.rel = [...rel].join(' ')
        else delete attribs.rel
        return { tagName, attribs }
      },
    },
    exclusiveFilter: (frame) =>
      frame.tag === 'p' && !frame.text.trim() && !(frame.mediaChildren && frame.mediaChildren.length),
  })
}

export type TocItem = { id: string; text: string; level: number }

/**
 * Adds anchor ids to h2/h3 headings (for the table of contents and deep links)
 * and lazy-loads inline images. Input must already be sanitised.
 */
export function enhancePostHtml(html: string) {
  const toc: TocItem[] = []
  const used = new Map<string, number>()

  const withIds = html.replace(/<h([23])(\s[^>]*)?>([\s\S]*?)<\/h\1>/g, (_m, level: string, attrs = '', inner: string) => {
    const text = decodeEntities(inner.replace(/<[^>]+>/g, '')).trim()
    const base = slugify(text) || 'section'
    const n = used.get(base) ?? 0
    used.set(base, n + 1)
    const id = n ? `${base}-${n + 1}` : base
    toc.push({ id, text, level: Number(level) })
    return `<h${level}${attrs} id="${id}">${inner}</h${level}>`
  })

  const withLazyImages = withIds.replace(/<img(?![^>]*\sloading=)/g, '<img loading="lazy" decoding="async"')

  return { html: withLazyImages, toc }
}
