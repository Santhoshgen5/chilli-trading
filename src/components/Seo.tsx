import { Helmet } from 'react-helmet-async'
import { company } from '../data/company'

interface SeoProps {
  title: string
  description: string
  /** Route path beginning with "/", e.g. "/products/teja". */
  path: string
  /** Optional JSON-LD object injected as a <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>
  /** Open Graph type. Defaults to 'website'. */
  ogType?: 'website' | 'product'
  /** When true, emit robots noindex and omit the canonical (e.g. the 404 page). */
  noindex?: boolean
}

/**
 * Per-page document head. index.html holds only the global tags Helmet does NOT
 * set (site_name, og:image, twitter:card) plus a fallback <title>; everything
 * page-specific is emitted here so each route has exactly one canonical /
 * description / OG set (no duplicates against the static HTML).
 *
 * Note: these run after React mounts (client-side). Modern search crawlers render
 * JS, so indexing is fine; a prerender step can be added for non-JS scrapers
 * (see README).
 */
export function Seo({ title, description, path, jsonLd, ogType = 'website', noindex = false }: SeoProps) {
  const url = `${company.siteUrl}${path}`
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex ? (
        <meta name="robots" content="noindex,follow" />
      ) : (
        <link rel="canonical" href={url} />
      )}

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={ogType} />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
