import {
  productFallbackSrc,
  productSize,
  productSrcSet,
  type ProductCrop,
} from '../data/media'

interface ProductImageProps {
  /** Variety `image` stem, from the variety data. */
  image: string
  /** Alt text from the variety data — describes the pods, not the photograph. */
  alt: string
  crop: ProductCrop
  /**
   * Rendered width hint for the browser's srcset maths. Defaults to the card
   * layout: three across on desktop, two on tablet, full width on a phone.
   */
  sizes?: string
  /**
   * Set on the first image visible without scrolling. Everything else loads
   * lazily — which, on the products page, is eight of the nine images.
   */
  priority?: boolean
  className?: string
  /** Applied to the <img> itself, for the hover transform. */
  imgClassName?: string
}

const DEFAULT_SIZES = '(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw'

/**
 * A variety photograph.
 *
 * AVIF first, WebP second, JPEG as the `<img>` fallback. Width and height are
 * always declared so the box is reserved before the bytes arrive — these sit
 * above text in a card, and without them every card below would jump on load.
 *
 * PROVISIONAL IMAGERY. These illustrate what each variety looks like. They are
 * not photographs of MAVEH WORLD's own stock, warehouse, packing line or any
 * particular lot, so they carry no caption and are never placed next to a claim
 * about facilities. The facility and packing slots elsewhere on the site stay
 * empty until real photography exists.
 */
export function ProductImage({
  image,
  alt,
  crop,
  sizes = DEFAULT_SIZES,
  priority = false,
  className = '',
  imgClassName = '',
}: ProductImageProps) {
  const { width, height } = productSize(crop)

  return (
    <picture className={className}>
      <source type="image/avif" srcSet={productSrcSet(image, crop, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={productSrcSet(image, crop, 'webp')} sizes={sizes} />
      <img
        src={productFallbackSrc(image, crop)}
        srcSet={productSrcSet(image, crop, 'jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? ({ fetchpriority: 'high' } as Record<string, string>) : {})}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </picture>
  )
}
