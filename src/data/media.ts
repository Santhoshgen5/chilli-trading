// Image descriptors.
//
// Every derivative referenced here is produced by `npm run images` from the
// originals in `assets/`. Swapping in real photography later is a change to a
// source file plus this one — no component needs to know.

export interface ResponsiveImage {
  /** Path stem; widths are appended, e.g. `/media/hero` → `/media/hero-1280.avif`. */
  stem: string
  /** Widths emitted by the image pipeline, ascending. */
  widths: number[]
  /** Intrinsic size of the largest derivative — sets the aspect ratio. */
  width: number
  height: number
}

// ─── Hero ────────────────────────────────────────────────────────────────────
// Art-directed, not merely resized. The banner's usable crop is 5.7:1, which
// cannot serve both a 2.2:1 desktop hero and a 0.6:1 phone screen — letting one
// image cover both would magnify the phone version roughly threefold and leave
// a fragment of a single bowl on screen. So the pipeline composes two canvases
// from the same art and the markup switches between them at 640px.

export const heroDesktop: ResponsiveImage = {
  stem: '/media/hero',
  widths: [640, 960, 1280, 1600, 2000],
  width: 2000,
  height: 900,
}

export const heroMobile: ResponsiveImage = {
  stem: '/media/hero-mobile',
  widths: [400, 600, 800],
  width: 800,
  height: 1280,
}

/** Viewport width at which the hero switches from the portrait crop to the wide one. */
export const HERO_BREAKPOINT = 640

/**
 * Empty by design. The hero is atmosphere behind a live HTML headline, not
 * information — the headline and subhead carry the meaning, so announcing the
 * image would only add noise to a screen reader.
 */
export const HERO_ALT = ''

/** `srcset` string for one format of a responsive image. */
export function srcSet(image: ResponsiveImage, ext: 'avif' | 'webp'): string {
  return image.widths.map((w) => `${image.stem}-${w}.${ext} ${w}w`).join(', ')
}

/** Largest derivative, used as the `<img>` src. */
export function largestSrc(image: ResponsiveImage, ext: 'avif' | 'webp' = 'webp'): string {
  return `${image.stem}-${image.widths[image.widths.length - 1]}.${ext}`
}

// ─── Product photography ─────────────────────────────────────────────────────

export type ProductCrop = 'card' | 'detail'

/** Aspect ratio per crop, matching what the pipeline emits. */
export const PRODUCT_RATIO: Record<ProductCrop, { width: number; height: number }> = {
  card: { width: 4, height: 3 },
  detail: { width: 4, height: 5 },
}

/**
 * Widths emitted per format, mirroring PRODUCT_FORMAT_WIDTHS in
 * scripts/build-images.mjs.
 *
 * AVIF alone carries the 1200 tier. Dry chilli is dense, high-entropy texture:
 * WebP cannot reach the 150KB budget at that width without visible mush (still
 * 176KB at quality 30), while AVIF holds it near 130KB with quality in hand.
 * A browser with no AVIF support tops out at 768 and gets a slightly softer
 * image, which is the right trade for what is, by now, an old browser.
 */
export const PRODUCT_FORMAT_WIDTHS: Record<'avif' | 'webp' | 'jpg', number[]> = {
  avif: [480, 768, 1200],
  webp: [480, 768],
  jpg: [480, 768],
}

/** Intrinsic size to declare on the `<img>`, so the box is reserved before load. */
export function productSize(crop: ProductCrop): { width: number; height: number } {
  const ratio = PRODUCT_RATIO[crop]
  const width = 1200
  return { width, height: Math.round((width / ratio.width) * ratio.height) }
}

/** `srcset` for one variety image, crop and format. */
export function productSrcSet(
  image: string,
  crop: ProductCrop,
  format: 'avif' | 'webp' | 'jpg',
): string {
  return PRODUCT_FORMAT_WIDTHS[format]
    .map((w) => `/media/products/${image}-${crop}-${w}.${format} ${w}w`)
    .join(', ')
}

/** Fallback `src` — the widest JPEG, for browsers that understand neither source. */
export function productFallbackSrc(image: string, crop: ProductCrop): string {
  const widths = PRODUCT_FORMAT_WIDTHS.jpg
  return `/media/products/${image}-${crop}-${widths[widths.length - 1]}.jpg`
}
