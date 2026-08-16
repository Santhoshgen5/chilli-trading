import { Helmet } from 'react-helmet-async'
import { company } from '../data/company'

interface SeoProps {
  title: string
  description: string
  /** Route path beginning with "/", e.g. "/products/teja". */
  path: string
  /** Optional JSON-LD object injected as a <script type="application/ld+json">. */
  jsonLd?: Record<string, unknown>
}

/**
 * Per-page document head. Base tags live statically in index.html so crawlers
 * see them without executing JS; these override title/description/canonical/OG
 * once React mounts. (Modern crawlers render JS; a prerender step can be added
 * later for hosts that don't — see README.)
 */
export function Seo({ title, description, path, jsonLd }: SeoProps) {
  const url = `${company.siteUrl}${path}`
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />

      {jsonLd && (
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      )}
    </Helmet>
  )
}
