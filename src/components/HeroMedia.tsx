import type { ReactNode } from 'react'
import {
  HERO_ALT,
  HERO_BREAKPOINT,
  heroDesktop,
  heroMobile,
  largestSrc,
  srcSet,
  type ResponsiveImage,
} from '../data/media'

/**
 * Full-bleed hero backdrop: image layer, scrim, content.
 *
 * The artwork is art-directed rather than merely resized. The banner's usable
 * crop is 5.7:1; a phone hero is around 0.6:1. Letting one file serve both
 * would magnify the phone version roughly threefold and leave a fragment of a
 * single bowl on screen. So the pipeline composes two canvases from the same
 * art — 2000x900 and 800x1280 — and the `<picture>` swaps between them at
 * 640px. Both are duotoned into the navy scale, so the photograph reads as
 * navy texture rather than a colour photo, and the baked-in wordmark and Tamil
 * tagline are cropped away so the live <h1> is the only wordmark on screen.
 *
 * Images are props, so replacing the banner with real product photography is a
 * change at the call site plus a source file.
 */

interface HeroMediaProps {
  children: ReactNode
  desktop?: ResponsiveImage
  mobile?: ResponsiveImage
  alt?: string
  /** Marks this as the LCP image: preloaded, eagerly fetched, high priority. */
  priority?: boolean
  className?: string
}

export function HeroMedia({
  children,
  desktop = heroDesktop,
  mobile = heroMobile,
  alt = HERO_ALT,
  priority = true,
  className = '',
}: HeroMediaProps) {
  const wide = `(min-width: ${HERO_BREAKPOINT}px)`

  return (
    <div className={`surface-dark relative isolate overflow-hidden bg-navy-950 ${className}`}>
      <picture>
        {/* Wide crop, for anything tablet-sized and up. */}
        <source media={wide} type="image/avif" srcSet={srcSet(desktop, 'avif')} sizes="100vw" />
        <source media={wide} type="image/webp" srcSet={srcSet(desktop, 'webp')} sizes="100vw" />
        {/* Portrait crop, for phones. */}
        <source type="image/avif" srcSet={srcSet(mobile, 'avif')} sizes="100vw" />
        <source type="image/webp" srcSet={srcSet(mobile, 'webp')} sizes="100vw" />
        <img
          src={largestSrc(mobile, 'webp')}
          alt={alt}
          width={mobile.width}
          height={mobile.height}
          decoding={priority ? 'sync' : 'async'}
          loading={priority ? 'eager' : 'lazy'}
          // React 18 has no typed `fetchPriority` prop — it passes the camelCase
          // spelling through as a custom attribute and warns while doing it.
          // The lowercase attribute is what the HTML spec asks for anyway.
          {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
          className="absolute inset-0 -z-10 h-full w-full object-cover object-center"
        />
      </picture>

      {/*
        Scrim. Two passes, both single-hue:
          · horizontal, weighted to the left, so the headline column sits on
            near-solid navy while the right side keeps the photograph;
          · vertical, to seat the band against the header above and the page
            ground below.
        On a phone the copy runs the full width, so the horizontal pass is
        replaced by a stronger vertical one — verified by `npm run check:contrast`,
        which samples both crops.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,12,36,0.92)_0%,rgba(7,12,36,0.80)_45%,rgba(7,12,36,0.66)_88%,rgba(7,12,36,0.30)_100%)] sm:bg-[linear-gradient(90deg,#070C24_0%,rgba(7,12,36,0.92)_34%,rgba(11,18,54,0.68)_62%,rgba(11,18,54,0.26)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,12,36,0.55)_0%,rgba(7,12,36,0.10)_38%,rgba(7,12,36,0.10)_100%)] sm:bg-[linear-gradient(180deg,rgba(7,12,36,0.85)_0%,rgba(7,12,36,0.12)_38%,rgba(7,12,36,0.16)_100%)]"
      />

      {/* The single gold accent, seating the band against what follows. */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(90deg,rgba(201,162,39,0.8)_0%,rgba(201,162,39,0.15)_45%,rgba(201,162,39,0)_100%)]"
      />

      {children}
    </div>
  )
}
