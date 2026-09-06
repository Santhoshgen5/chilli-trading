import type { Variety, VarietySeo } from './types'

// Varieties are content, not code.
//
// Each one is a JSON document in `content/varieties/`, which is what the admin
// at `/admin` reads and writes. Adding a variety is adding a file there — this
// module discovers it, `scripts/gen-pages.mjs` gives it a document and an entry,
// and `scripts/prerender.mjs` renders it. Nothing here or in `src/pages` needs
// touching for a new product.
//
// Fields typed `string | null` are CLIENT-SUPPLIED PLACEHOLDERS (astaColour,
// aflatoxin). When the value is null the UI renders nothing — no filler, and no
// invented figures.

/** HSN tariff code. Site-wide, so it is not a per-variety field the CMS can desync. */
export const HSN_CODE = '09042110'

/** Shape of a `content/varieties/*.json` document, before normalisation. */
interface RawVariety {
  order?: number
  name: string
  fullName: string
  summary: string
  pungency: string
  shuMin: number
  shuMax: number
  /** Pre-formatted range. Derived from the bounds when left blank. */
  shuLabel?: string | null
  colour: string
  moisture: string
  foreignMatter: string
  form: string
  notes?: string | null
  bestSuitedFor: string
  applications: string[]
  packing: string[]
  /** Media path as the CMS stores it, e.g. `assets/products/teja.jpeg`. */
  image: string
  imageAlt: string
  astaColour?: string | null
  aflatoxin?: string | null
  seo?: Partial<VarietySeo> | null
}

const REQUIRED = [
  'name',
  'fullName',
  'summary',
  'pungency',
  'shuMin',
  'shuMax',
  'colour',
  'moisture',
  'foreignMatter',
  'form',
  'bestSuitedFor',
  'applications',
  'packing',
  'image',
  'imageAlt',
] as const satisfies readonly (keyof RawVariety)[]

const files = import.meta.glob<{ default: RawVariety }>('/content/varieties/*.json', {
  eager: true,
})

/**
 * Absent, blank or whitespace-only → null.
 *
 * A CMS form writes `""` for a field the client left empty, never `null`. The
 * UI's rule is that a null field renders nothing, so `""` has to be folded into
 * null here or an empty string reaches the page as an empty table row.
 */
function nullable(value: string | null | undefined): string | null {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

/** Drop blank entries a CMS list widget leaves behind. */
function compact(values: string[]): string[] {
  return values.map((v) => v.trim()).filter(Boolean)
}

/**
 * "80,000–100,000" from the bounds.
 *
 * Deriving it means the range under the heading cannot disagree with the range
 * the Scoville scale is drawn from. A variety needing wording the numbers
 * cannot express ("Above 100,000") can still set `shuLabel` explicitly.
 */
function shuRange(min: number, max: number): string {
  return `${min.toLocaleString('en-US')}–${max.toLocaleString('en-US')}`
}

/** `/content/varieties/teja.json` → `teja`. The filename is the URL. */
function slugFromPath(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1).replace(/\.json$/, '')
}

/**
 * `assets/products/teja.jpeg` → `teja`.
 *
 * The CMS stores a real media path because that is what its image widget knows
 * how to produce; the image pipeline and `ProductImage` both work in stems. The
 * translation happens once, here, so neither side has to know about the other.
 *
 * The name is also made URL-safe. A photograph uploaded straight off a phone
 * arrives as `IMG 2231.JPEG`, and a space in a derivative's filename would end
 * up in a `srcset`, where the space is the delimiter — the whole attribute
 * would parse wrong and no image would load.
 *
 * MIRRORED by `stemOf()` in scripts/build-images.mjs, which names the files
 * this function expects to find. The two must agree.
 */
function imageStem(value: string): string {
  const base = value.slice(value.lastIndexOf('/') + 1)
  const dot = base.lastIndexOf('.')
  const name = dot === -1 ? base : base.slice(0, dot)
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * SEO copy is optional in the document. Left blank, it is composed from the
 * specification — which is the same information a hand-written description
 * would carry, and cannot drift from the figures on the page.
 */
function resolveSeo(
  variety: Omit<Variety, 'seo'>,
  seo: Partial<VarietySeo> | null | undefined,
): VarietySeo {
  const { fullName, shuLabel, colour, moisture, bestSuitedFor } = variety
  const title = `${fullName} Dry Red Chilli — Specification | MAVEH WORLD`
  const description =
    `${fullName} dry red chilli: ${shuLabel} SHU, ${colour.toLowerCase()}, ` +
    `moisture ${moisture}. ${bestSuitedFor} HSN ${HSN_CODE}.`
  const ogDescription = `${fullName}: ${shuLabel} SHU, ${colour.toLowerCase()}.`

  return {
    title: nullable(seo?.title) ?? title,
    description: nullable(seo?.description) ?? description,
    ogDescription: nullable(seo?.ogDescription) ?? nullable(seo?.description) ?? ogDescription,
  }
}

/**
 * A malformed document fails the build rather than shipping a page with holes
 * in it. The CMS writes these files, so the failure needs to name the file and
 * the field plainly enough to fix from the admin UI.
 */
function toVariety(slug: string, raw: RawVariety): Variety {
  for (const field of REQUIRED) {
    const value = raw[field]
    if (value === undefined || value === null || value === '') {
      throw new Error(`content/varieties/${slug}.json: "${field}" is required`)
    }
  }
  if (!(raw.shuMax > raw.shuMin)) {
    throw new Error(`content/varieties/${slug}.json: shuMax must be greater than shuMin`)
  }
  if (compact(raw.applications).length === 0) {
    throw new Error(`content/varieties/${slug}.json: "applications" needs at least one entry`)
  }
  if (compact(raw.packing).length === 0) {
    throw new Error(`content/varieties/${slug}.json: "packing" needs at least one entry`)
  }

  const variety: Omit<Variety, 'seo'> = {
    slug,
    order: raw.order ?? 999,
    name: raw.name.trim(),
    fullName: raw.fullName.trim(),
    summary: raw.summary.trim(),
    pungency: raw.pungency.trim(),
    shuMin: raw.shuMin,
    shuMax: raw.shuMax,
    shuLabel: nullable(raw.shuLabel) ?? shuRange(raw.shuMin, raw.shuMax),
    colour: raw.colour.trim(),
    moisture: raw.moisture.trim(),
    foreignMatter: raw.foreignMatter.trim(),
    form: raw.form.trim(),
    notes: nullable(raw.notes),
    hsn: HSN_CODE,
    bestSuitedFor: raw.bestSuitedFor.trim(),
    applications: compact(raw.applications),
    packing: compact(raw.packing),
    image: imageStem(raw.image),
    imageAlt: raw.imageAlt.trim(),
    astaColour: nullable(raw.astaColour),
    aflatoxin: nullable(raw.aflatoxin),
  }

  return { ...variety, seo: resolveSeo(variety, raw.seo) }
}

/**
 * Every variety, in the order the client set. `order` ties are broken by name
 * so the sequence is stable between builds — an unstable order would reshuffle
 * the products grid and the footer on an unrelated deploy.
 */
export const varieties: Variety[] = Object.entries(files)
  .map(([path, mod]) => toVariety(slugFromPath(path), mod.default))
  .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name))

if (varieties.length === 0) {
  throw new Error('No varieties found in content/varieties/*.json')
}

/**
 * Top of the Scoville axis for the comparison scale.
 *
 * Derived from the hottest variety on file rather than fixed, so a chilli added
 * through the admin that out-heats Teja widens the axis instead of running off
 * the end of it.
 */
export const SHU_AXIS_MAX = Math.max(...varieties.map((v) => v.shuMax))

export function getVariety(slug: string): Variety | undefined {
  return varieties.find((v) => v.slug === slug)
}

/**
 * Pungency as a 1–3 step, for the level meter on the pungency badge.
 *
 * Derived from the variety's own SHU ceiling rather than stored as a separate
 * field, so it cannot fall out of step with the specification if a range is
 * ever revised. Teja → 3, Sannam → 2, Byadgi → 1.
 */
export function heatLevel(variety: Variety): 1 | 2 | 3 {
  const share = variety.shuMax / SHU_AXIS_MAX
  if (share >= 0.66) return 3
  if (share >= 0.33) return 2
  return 1
}
