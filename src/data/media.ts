// Image descriptors.
//
// Every derivative referenced here is produced by `npm run images` from the
// originals in `assets/`. Swapping in real product photography later is a
// change to this file plus a source file — no component needs to know.

export interface ResponsiveImage {
  /** Path stem; widths are appended, e.g. `/media/hero` → `/media/hero-1280.avif`. */
  stem: string
  /** Widths emitted by the image pipeline, ascending. */
  widths: number[]
  /** Intrinsic size of the largest derivative — sets the aspect ratio. */
  width: number
  height: number
  /**
   * Below this viewport width the crop cannot hold its composition, so the
   * plain navy gradient in `fallbackSrc` is shown instead.
   */
  minWidth: number
  fallbackSrc: string
  /**
   * Empty by design. The picture is atmosphere behind a live HTML headline,
   * not information — the headline and subhead carry the meaning, so
   * announcing the image would only add noise. Give real product photography
   * a description when it lands.
   */
  alt: string
}

export const heroImage: ResponsiveImage = {
  stem: '/media/hero',
  widths: [640, 960, 1280, 1600, 2000],
  width: 2000,
  height: 900,
  minWidth: 640,
  fallbackSrc: '/media/hero-mobile.webp',
  alt: '',
}

/** `srcset` string for one format. */
export function srcSet(image: ResponsiveImage, ext: 'avif' | 'webp'): string {
  return image.widths.map((w) => `${image.stem}-${w}.${ext} ${w}w`).join(', ')
}

/** Largest derivative, used as the `<img>` src. */
export function largestSrc(image: ResponsiveImage, ext: 'avif' | 'webp' = 'webp'): string {
  return `${image.stem}-${image.widths[image.widths.length - 1]}.${ext}`
}
