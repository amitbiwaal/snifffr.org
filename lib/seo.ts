import type { Metadata } from 'next'
import { absoluteUrl, site } from './site'
import type { Post } from './posts'

type PageMetaInput = {
  title: string
  description: string
  path: string
  /** Use the title as-is instead of applying the "| Snifffr" template. */
  absoluteTitle?: boolean
  noindex?: boolean
  type?: 'website' | 'article'
  /** Social image; defaults to the generated site card at /og. */
  image?: { url: string; width?: number; height?: number; alt?: string }
}

export const DEFAULT_OG_IMAGE = { url: '/og', width: 1200, height: 630, alt: site.defaultTitle }

/** Consistent title/description/canonical/OG/Twitter tags for a page. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  noindex,
  type = 'website',
  image = DEFAULT_OG_IMAGE,
}: PageMetaInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path,
      types: { 'application/rss+xml': [{ url: '/feed.xml', title: `${site.siteName} Blog` }] },
    },
    openGraph: {
      title,
      description,
      url: path,
      siteName: site.siteName,
      locale: site.locale,
      type,
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  }
}

const ORG_ID = `${site.url}/#organization`
const WEBSITE_ID = `${site.url}/#website`

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': ORG_ID,
    name: site.name,
    url: `${site.url}/`,
    logo: { '@type': 'ImageObject', url: absoluteUrl('/icon-512.png'), width: 512, height: 512 },
    description:
      'Snifffr is a trusted feet pics marketplace where creators can sell feet pics online safely and buyers can purchase feet pictures anonymously.',
    sameAs: site.brandSameAs.filter((u) => u.replace(/\/$/, '') !== site.url),
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: 'Snifffr — Sell Feet Pics Online',
    url: `${site.url}/`,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
    potentialAction: {
      '@type': 'SearchAction',
      target: { '@type': 'EntryPoint', urlTemplate: `${site.url}/search?q={search_term_string}` },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function serviceJsonLd() {
  // No aggregateRating here on purpose: Google treats self-published ratings on your own
  // Service/Organization as self-serving review markup, which is not eligible and risks a manual action.
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Sell Feet Pics Online with Snifffr',
    serviceType: 'Feet pics marketplace',
    provider: { '@id': ORG_ID },
    areaServed: 'Worldwide',
    url: `${site.url}/`,
    description:
      'Snifffr lets creators sell feet pics online safely and anonymously while connecting them with verified buyers in a trusted feet pics marketplace.',
  }
}

export type Crumb = { name: string; path: string }

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  }
}

export type Faq = { q: string; a: string }

export function faqJsonLd(faqs: Faq[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function blogPostingJsonLd(post: Post, wordCount: number) {
  const url = absoluteUrl(`/blog/${post.slug}`)
  const image = absoluteUrl(post.coverImage || `/og/${post.slug}`)
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${url}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    headline: post.title,
    description: post.seo.metaDescription || post.excerpt,
    image: [image],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { '@type': 'Person', name: post.author, url: absoluteUrl('/about') },
    publisher: { '@id': ORG_ID },
    articleSection: post.category,
    keywords: [post.seo.focusKeyword, ...post.tags].filter(Boolean).join(', '),
    wordCount,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
  }
}

export function collectionPageJsonLd(name: string, path: string, posts: Post[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name,
    url: absoluteUrl(path),
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: absoluteUrl(`/blog/${p.slug}`),
        name: p.title,
      })),
    },
  }
}
