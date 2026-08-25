import type { ReactNode } from 'react'
import { heroImage, srcSet, type ResponsiveImage } from '../data/media'

/**
 * Full-bleed hero backdrop: image layer, scrim, content.
 *
 * The image is a prop, so replacing the client's banner with real product
 * photography later is a one-line change at the call site (plus a source file
 * and `npm run images`).
 *
 * Three things about the picture are settled in the build, not here:
 *
 *  - The supplied banner has MAVEH WORLD and the Tamil tagline baked into the
 *    pixels. `scripts/build-images.mjs` crops that band away, so the live <h1>
 *    below is the only wordmark on screen.
 *  - The photograph is duotoned into the navy scale — it reads as navy texture
 *    rather than a colour photograph, and no warm hue survives to fight the
 *    palette.
 *  - The 5.7:1 crop is composited into a 2.22:1 canvas that matches this box,
 *    so `object-cover` neither magnifies it nor crops the composition.
 *
 * Below `image.minWidth` the crop cannot hold its composition in a portrait
 * box, so the media query stops matching and the plain navy gradient is used
 * instead — the banner is never squeezed to fit.
 */

interface HeroMediaProps {
  children: ReactNode
  image?: ResponsiveImage
  /** Marks this as the LCP image: preloaded, eagerly fetched, high priority. */
  priority?: boolean
  className?: string
}

export function HeroMedia({
  children,
  image = heroImage,
  priority = true,
  className = '',
}: HeroMediaProps) {
  const media = `(min-width: ${image.minWidth}px)`

  return (
    <div className={`surface-dark relative isolate overflow-hidden bg-navy-950 ${className}`}>
      {/* Image layer */}
      <picture>
        <source media={media} type="image/avif" srcSet={srcSet(image, 'avif')} sizes="100vw" />
        <source media={media} type="image/webp" srcSet={srcSet(image, 'webp')} sizes="100vw" />
        <img
          src={image.fallbackSrc}
          alt={image.alt}
          width={image.width}
          height={image.height}
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
        Measured against the brightest pixel the text can overlap — see
        `npm run check:contrast`.
      */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#070C24_0%,rgba(7,12,36,0.92)_34%,rgba(11,18,54,0.68)_62%,rgba(11,18,54,0.26)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,12,36,0.85)_0%,rgba(7,12,36,0.12)_38%,rgba(7,12,36,0.16)_100%)]"
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
