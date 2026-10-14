import type { Faq } from '@/lib/seo'

export function FaqList({ faqs, openFirst = false }: { faqs: Faq[]; openFirst?: boolean }) {
  return (
    <div>
      {faqs.map((f, i) => (
        <details key={f.q} open={openFirst && i === 0}>
          <summary>{f.q}</summary>
          <p>{f.a}</p>
        </details>
      ))}
    </div>
  )
}
