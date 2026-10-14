'use client'

import { EditorContent, useEditor, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import ImageExt from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { CharacterCount, Placeholder } from '@tiptap/extensions'
import { useRef, useState } from 'react'
import { uploadImage } from './upload'

type Panel = null | 'link' | 'image'

/** Toolbar state derived from the editor (active marks, block type, history, counts). */
function readState(e: Editor) {
  return {
    block: e.isActive('heading', { level: 2 })
      ? 'h2'
      : e.isActive('heading', { level: 3 })
        ? 'h3'
        : e.isActive('heading', { level: 4 })
          ? 'h4'
          : 'p',
    bold: e.isActive('bold'),
    italic: e.isActive('italic'),
    underline: e.isActive('underline'),
    strike: e.isActive('strike'),
    code: e.isActive('code'),
    link: e.isActive('link'),
    bullet: e.isActive('bulletList'),
    ordered: e.isActive('orderedList'),
    quote: e.isActive('blockquote'),
    alignCenter: e.isActive({ textAlign: 'center' }),
    alignRight: e.isActive({ textAlign: 'right' }),
    canUndo: e.can().undo(),
    canRedo: e.can().redo(),
    words: e.storage.characterCount.words() as number,
    chars: e.storage.characterCount.characters() as number,
  }
}

export function RichTextEditor({
  initialHtml,
  onChange,
}: {
  initialHtml: string
  onChange: (html: string) => void
}) {
  const [mode, setMode] = useState<'visual' | 'html'>('visual')
  const [source, setSource] = useState('')
  const [panel, setPanel] = useState<Panel>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          HTMLAttributes: { target: null, rel: null },
        },
      }),
      ImageExt,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Placeholder.configure({ placeholder: 'Start writing your article… Use “Heading 2” to split it into sections.' }),
      CharacterCount,
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: 'admin-prose', 'aria-label': 'Article content', 'data-testid': 'editor' },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  const selected = useEditorState({
    editor,
    selector: ({ editor: e }) => (e ? readState(e) : null),
  })

  function switchMode(next: 'visual' | 'html') {
    if (!editor || next === mode) return
    if (next === 'html') {
      setSource(formatHtml(editor.getHTML()))
      setPanel(null)
    } else {
      editor.commands.setContent(source, { emitUpdate: false })
      onChange(editor.getHTML())
    }
    setMode(next)
  }

  // Note: do not wait for `selected` here. With immediatelyRender: false it stays null until the
  // first transaction, and that transaction can only happen once <EditorContent> is mounted.
  if (!editor) return <div className="rte rte-loading">Loading editor…</div>
  const state = selected ?? readState(editor)

  const btn = (label: string, title: string, active: boolean, run: () => void, disabled = false) => (
    <button
      type="button"
      className={`rte-btn${active ? ' active' : ''}`}
      title={title}
      aria-label={title}
      aria-pressed={active}
      disabled={disabled || mode === 'html'}
      onMouseDown={(e) => e.preventDefault()}
      onClick={run}
    >
      {label}
    </button>
  )
  const chain = () => editor.chain().focus()

  return (
    <div className="rte">
      <div className="rte-toolbar" role="toolbar" aria-label="Formatting">
        <select
          aria-label="Text style"
          value={state.block}
          disabled={mode === 'html'}
          onChange={(e) => {
            const v = e.target.value
            if (v === 'p') chain().setParagraph().run()
            else chain().setHeading({ level: Number(v.slice(1)) as 2 | 3 | 4 }).run()
          }}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 2</option>
          <option value="h3">Heading 3</option>
          <option value="h4">Heading 4</option>
        </select>
        <span className="rte-sep" />
        {btn('B', 'Bold (Ctrl+B)', state.bold, () => chain().toggleBold().run())}
        {btn('I', 'Italic (Ctrl+I)', state.italic, () => chain().toggleItalic().run())}
        {btn('U', 'Underline (Ctrl+U)', state.underline, () => chain().toggleUnderline().run())}
        {btn('S', 'Strikethrough', state.strike, () => chain().toggleStrike().run())}
        {btn('</>', 'Inline code', state.code, () => chain().toggleCode().run())}
        <span className="rte-sep" />
        {btn('• List', 'Bullet list', state.bullet, () => chain().toggleBulletList().run())}
        {btn('1. List', 'Numbered list', state.ordered, () => chain().toggleOrderedList().run())}
        {btn('❝', 'Quote', state.quote, () => chain().toggleBlockquote().run())}
        {btn('―', 'Divider', false, () => chain().setHorizontalRule().run())}
        <span className="rte-sep" />
        {btn('⇤', 'Align left', !state.alignCenter && !state.alignRight, () => chain().setTextAlign('left').run())}
        {btn('⇔', 'Align center', state.alignCenter, () => chain().setTextAlign('center').run())}
        {btn('⇥', 'Align right', state.alignRight, () => chain().setTextAlign('right').run())}
        <span className="rte-sep" />
        {btn('🔗 Link', 'Insert or edit link', state.link || panel === 'link', () => setPanel(panel === 'link' ? null : 'link'))}
        {btn('🖼 Image', 'Insert image', panel === 'image', () => setPanel(panel === 'image' ? null : 'image'))}
        <span className="rte-sep" />
        {btn('↶', 'Undo (Ctrl+Z)', false, () => chain().undo().run(), !state.canUndo)}
        {btn('↷', 'Redo (Ctrl+Shift+Z)', false, () => chain().redo().run(), !state.canRedo)}
        <span className="rte-spacer" />
        <div className="rte-mode" role="group" aria-label="Editor mode">
          <button type="button" className={mode === 'visual' ? 'active' : ''} onClick={() => switchMode('visual')}>
            Visual
          </button>
          <button type="button" className={mode === 'html' ? 'active' : ''} onClick={() => switchMode('html')}>
            HTML
          </button>
        </div>
      </div>

      {panel === 'link' && <LinkPanel editor={editor} onClose={() => setPanel(null)} />}
      {panel === 'image' && <ImagePanel editor={editor} onClose={() => setPanel(null)} />}

      {mode === 'visual' ? (
        <EditorContent editor={editor} />
      ) : (
        <textarea
          className="rte-source"
          aria-label="HTML source"
          data-testid="html-source"
          value={source}
          spellCheck={false}
          onChange={(e) => {
            setSource(e.target.value)
            onChange(e.target.value)
          }}
        />
      )}

      <div className="rte-status">
        <span>{state.words.toLocaleString()} words</span>
        <span>{state.chars.toLocaleString()} characters</span>
        <span>~{Math.max(1, Math.round(state.words / 225))} min read</span>
      </div>
    </div>
  )
}

function LinkPanel({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const attrs = editor.getAttributes('link') as { href?: string; target?: string; rel?: string }
  const [href, setHref] = useState(attrs.href ?? '')
  const [newTab, setNewTab] = useState(attrs.target === '_blank')
  const [sponsored, setSponsored] = useState(/sponsored/.test(attrs.rel ?? ''))

  function apply() {
    const url = href.trim()
    if (!url) {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return onClose()
    }
    const rel = [sponsored && 'sponsored nofollow', newTab && 'noopener noreferrer'].filter(Boolean).join(' ')
    const { empty } = editor.state.selection
    if (empty && !editor.isActive('link')) {
      // No text selected: insert the URL itself as the link text.
      editor
        .chain()
        .focus()
        .insertContent({ type: 'text', text: url, marks: [{ type: 'link', attrs: { href: url, target: newTab ? '_blank' : null, rel: rel || null } }] })
        .run()
    } else {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url, target: newTab ? '_blank' : null, rel: rel || null })
        .run()
    }
    onClose()
  }

  return (
    <div className="rte-panel">
      <input
        type="url"
        placeholder="https://… or /blog/your-post"
        value={href}
        autoFocus
        aria-label="Link URL"
        onChange={(e) => setHref(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            apply()
          }
          if (e.key === 'Escape') onClose()
        }}
      />
      <label>
        <input type="checkbox" checked={newTab} onChange={(e) => setNewTab(e.target.checked)} /> New tab
      </label>
      <label title="Adds rel=&quot;sponsored nofollow&quot; — use for affiliate links">
        <input type="checkbox" checked={sponsored} onChange={(e) => setSponsored(e.target.checked)} /> Affiliate / sponsored
      </label>
      <button type="button" className="admin-btn small primary" onClick={apply}>
        Apply
      </button>
      {editor.isActive('link') && (
        <button
          type="button"
          className="admin-btn small ghost"
          onClick={() => {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            onClose()
          }}
        >
          Remove link
        </button>
      )}
    </div>
  )
}

function ImagePanel({ editor, onClose }: { editor: Editor; onClose: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const [src, setSrc] = useState('')
  const [alt, setAlt] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onFile(file: File | undefined) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const img = await uploadImage(file)
      setSrc(img.url)
      if (!alt) setAlt(file.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setBusy(false)
    }
  }

  function insert() {
    if (!src) return setError('Upload an image or paste an image URL first.')
    if (!alt.trim()) return setError('Alt text is required: describe the image for SEO and screen readers.')
    editor.chain().focus().setImage({ src, alt: alt.trim() }).run()
    onClose()
  }

  return (
    <div className="rte-panel">
      <input ref={fileRef} type="file" accept="image/*" hidden data-testid="inline-image-file" onChange={(e) => onFile(e.target.files?.[0])} />
      <button type="button" className="admin-btn small" disabled={busy} onClick={() => fileRef.current?.click()}>
        {busy ? 'Uploading…' : 'Upload image'}
      </button>
      <span className="admin-muted small">or</span>
      <input type="url" placeholder="Image URL" value={src} aria-label="Image URL" onChange={(e) => setSrc(e.target.value)} />
      <input type="text" placeholder="Alt text (describe the image)" value={alt} aria-label="Alt text" onChange={(e) => setAlt(e.target.value)} />
      <button type="button" className="admin-btn small primary" onClick={insert} disabled={busy}>
        Insert
      </button>
      {error && <span className="field-error">{error}</span>}
    </div>
  )
}

/**
 * Puts block-level tags on their own lines so the HTML view is readable.
 * Only breaks between blocks: a newline between inline tags would become a visible space.
 */
function formatHtml(html: string) {
  return html
    .replace(/(<\/(?:p|h[1-6]|li|ul|ol|blockquote|pre|figure|table)>|<hr\s*\/?>|<(?:ul|ol|blockquote)(?:\s[^>]*)?>)/g, '$1\n')
    .replace(/\n{2,}/g, '\n')
    .trim()
}
