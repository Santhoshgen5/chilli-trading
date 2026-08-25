// Image pipeline — run with `npm run images`.
//
// Source art lives in `assets/` (committed, unoptimised). Everything this
// script writes into `public/media/` is generated and git-ignored, so a
// derivative is never edited by hand and never drifts from its source.
//
// Outputs:
//   media/hero-*            desktop hero, duotoned banner art
//   media/hero-mobile-*     portrait recomposition of the same art
//   media/products/*        the three variety photographs
//   media/wordmark-*        the horizontal MAVEH WORLD lockup, two tones
//   media/logo-*            the stacked lockup, for the footer

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/media')

const BANNER = resolve(ROOT, 'assets/banner.png')
const LOGO = resolve(ROOT, 'assets/logo.png')
const WORDMARK = resolve(ROOT, 'assets/wordmark.png')

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

// ─── Hero ────────────────────────────────────────────────────────────────────
// The client's banner has MAVEH WORLD and the Tamil tagline baked into the
// pixels. Two wordmarks stacked (baked + live HTML h1) looks broken, so the top
// 250px is discarded and only the clean spice band is kept.
//
// That band is 2000x350 — 5.7:1, far wider than any hero box. Rather than let
// `object-cover` magnify it and show only the middle third, the band is
// composited into a canvas that matches the hero's own proportions, with a navy
// gradient above it and the seam dissolved. Desktop and mobile get their own
// canvas, because one crop cannot serve both 2.2:1 and 0.6:1.
//
// The band is duotoned into the navy scale on the way: no warm hue survives,
// and the photograph reads as navy texture rather than a colour photo.

const CROP_TOP = 250
const BAND_W = 2000
const BAND_H = 600 - CROP_TOP // 350

const SHADOW = [0x06, 0x0b, 0x22]
const HIGHLIGHT = [0x8f, 0xa4, 0xd6]
const GRAD_TOP = [0x08, 0x0f, 0x2c]
const GRAD_BOTTOM = [0x0d, 0x17, 0x40]

/** Duotoned, contrast-lifted spice band as raw RGB. */
async function loadBand(sliceWidth, targetWidth) {
  // Two stages, via an intermediate buffer: sharp cannot chain two `extract`
  // calls in one pipeline without a resize between them.
  const band = await sharp(BANNER)
    .extract({ left: 0, top: CROP_TOP, width: BAND_W, height: BAND_H })
    // The source is soft and low-contrast; a flat duotone of a flat photo
    // reads as mud.
    .normalise()
    .png()
    .toBuffer()

  const left = Math.round((BAND_W - sliceWidth) / 2)
  const pipeline = sharp(band).extract({ left, top: 0, width: sliceWidth, height: BAND_H })
  if (targetWidth !== sliceWidth) pipeline.resize({ width: targetWidth })

  const { data, info } = await pipeline
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  return { data, width: info.width, height: info.height }
}

/**
 * Composite a duotoned band onto a navy gradient canvas.
 * Returns raw RGB of `width` x `height`.
 */
function compose(band, width, height, fade) {
  const out = Buffer.alloc(width * height * 3)
  const bandY = height - band.height

  for (let y = 0; y < height; y++) {
    const gt = y / (height - 1)
    const gr = lerp(GRAD_TOP[0], GRAD_BOTTOM[0], gt)
    const gg = lerp(GRAD_TOP[1], GRAD_BOTTOM[1], gt)
    const gb = lerp(GRAD_TOP[2], GRAD_BOTTOM[2], gt)

    const inBand = y - bandY
    let alpha = 0
    if (inBand >= 0) {
      alpha = inBand < fade ? clamp01(inBand / fade) : 1
      // Smoothstep, so the seam is not a visible straight line.
      alpha = alpha * alpha * (3 - 2 * alpha)
    }

    for (let x = 0; x < width; x++) {
      const o = (y * width + x) * 3
      let r = gr
      let g = gg
      let b = gb

      if (alpha > 0) {
        const bi = (inBand * band.width + Math.min(x, band.width - 1)) * 3
        const t =
          (0.2126 * band.data[bi] +
            0.7152 * band.data[bi + 1] +
            0.0722 * band.data[bi + 2]) /
          255
        r = lerp(r, lerp(SHADOW[0], HIGHLIGHT[0], t), alpha)
        g = lerp(g, lerp(SHADOW[1], HIGHLIGHT[1], t), alpha)
        b = lerp(b, lerp(SHADOW[2], HIGHLIGHT[2], t), alpha)
      }

      out[o] = Math.round(r)
      out[o + 1] = Math.round(g)
      out[o + 2] = Math.round(b)
    }
  }
  return out
}

async function emitVariants(raw, width, height, stem, widths) {
  const base = sharp(raw, { raw: { width, height, channels: 3 } })
  for (const w of widths) {
    await base
      .clone()
      .resize({ width: w })
      .avif({ quality: 52, effort: 6 })
      .toFile(`${OUT}/${stem}-${w}.avif`)
    await base
      .clone()
      .resize({ width: w })
      .webp({ quality: 74, effort: 5 })
      .toFile(`${OUT}/${stem}-${w}.webp`)
  }
  process.stdout.write(`  ${stem}  ${widths.join('/')}  avif + webp\n`)
}

async function heroDesktop() {
  // 2000x900 = 2.22:1, matching the hero box, so cover neither crops nor upscales.
  const band = await loadBand(BAND_W, BAND_W)
  const raw = compose(band, 2000, 900, 190)
  await emitVariants(raw, 2000, 900, 'hero', [640, 960, 1280, 1600, 2000])
}

async function heroMobile() {
  // A portrait hero cannot use the wide crop — cover would magnify it roughly
  // 3x and leave a few centimetres of one bowl on screen. So a narrower slice
  // of the same band is recomposed at 0.63:1, keeping the spice imagery legible
  // on a phone at close to native resolution.
  const band = await loadBand(700, 800)
  const raw = compose(band, 800, 1280, 220)
  await emitVariants(raw, 800, 1280, 'hero-mobile', [400, 600, 800])
}

// ─── Product photography ─────────────────────────────────────────────────────
// Provisional images, used to illustrate the varieties only. Two crops per
// variety: 4:3 for the card lead-in, 4:5 for the sticky column on the detail
// page. JPEG is emitted alongside AVIF and WebP as a last-resort fallback.

const PRODUCTS = ['teja', 'byadgi', 'sannam']
const PRODUCT_WIDTHS = [480, 768, 1200]
const CROPS = [
  { name: 'card', ratio: 4 / 3 },
  { name: 'detail', ratio: 4 / 5 },
]

// A heap of dry chillies is dense, high-entropy texture that compresses badly.
// Two consequences, both handled here rather than in the markup:
//
//  · Quality falls as width rises. The wide tiers are only ever served to
//    high-DPR screens, where the extra device pixels hide the loss.
//  · The 1200w tier is AVIF only. WebP cannot reach the 150KB budget at that
//    size without visible mush — it is still 176KB at quality 30. AVIF holds
//    it at ~110KB with quality to spare, so AVIF carries the widest tier and
//    the legacy formats stop at 768. A browser without AVIF support is, in
//    2026, an old browser on a slow connection; a slightly softer image is the
//    right trade for it anyway.
const PRODUCT_QUALITY = {
  480: { avif: 54, webp: 74, jpeg: 76 },
  768: { avif: 46, webp: 60, jpeg: 66 },
  1200: { avif: 42 },
}

/** Widths emitted per format. Mirrored by `productSrcSet()` in src/data/media.ts. */
export const PRODUCT_FORMAT_WIDTHS = {
  avif: [480, 768, 1200],
  webp: [480, 768],
  jpg: [480, 768],
}

async function emitProducts() {
  await mkdir(`${OUT}/products`, { recursive: true })

  for (const slug of PRODUCTS) {
    const src = resolve(ROOT, `assets/products/${slug}.jpeg`)
    for (const crop of CROPS) {
      for (const w of PRODUCT_WIDTHS) {
        const h = Math.round(w / crop.ratio)
        // `attention` picks the busiest region, which on a heap of chillies is
        // the produce rather than the sacking or the background.
        const base = () =>
          sharp(src).resize({
            width: w,
            height: h,
            fit: 'cover',
            position: sharp.strategy.attention,
          })

        const q = PRODUCT_QUALITY[w]
        const stem = `${OUT}/products/${slug}-${crop.name}-${w}`
        await base().avif({ quality: q.avif, effort: 6 }).toFile(`${stem}.avif`)
        if (q.webp) await base().webp({ quality: q.webp, effort: 5 }).toFile(`${stem}.webp`)
        if (q.jpeg) await base().jpeg({ quality: q.jpeg, mozjpeg: true }).toFile(`${stem}.jpg`)
      }
    }
    process.stdout.write(
      `  products/${slug}  card + detail  ${PRODUCT_WIDTHS.join('/')}  avif + webp + jpg\n`,
    )
  }
}

// ─── Wordmark ────────────────────────────────────────────────────────────────

/**
 * Recolour for dark surfaces: near-neutral pixels (the black lettering) become
 * paper, while saturated pixels (the red aircraft, the globe) are left alone.
 * A blanket invert would turn the aircraft cyan; flattening to a white
 * silhouette would throw the brand colours away entirely.
 */
async function wordmarkLight(input) {
  const { data, info } = await sharp(input)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const PAPER = [0xf7, 0xf4, 0xec]

  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue
    const r = data[i]
    const g = data[i + 1]
    const b = data[i + 2]
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const saturation = max === 0 ? 0 : (max - min) / max
    if (saturation < 0.25) {
      // Preserve the stroke's own shading so edges stay smooth.
      const lift = 1 - max / 255
      data[i] = Math.round(lerp(max, PAPER[0], lift))
      data[i + 1] = Math.round(lerp(max, PAPER[1], lift))
      data[i + 2] = Math.round(lerp(max, PAPER[2], lift))
    }
  }

  return sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png()
    .toBuffer()
}

async function emitWordmark() {
  // The supplied file is rotated a quarter turn and heavily padded.
  const straightened = await sharp(WORDMARK).rotate(90).trim({ threshold: 5 }).png().toBuffer()
  const meta = await sharp(straightened).metadata()
  const light = await wordmarkLight(straightened)

  for (const h of [64, 128]) {
    await sharp(straightened)
      .resize({ height: h })
      .webp({ quality: 92 })
      .toFile(`${OUT}/wordmark-dark-${h}.webp`)
    await sharp(straightened)
      .resize({ height: h })
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/wordmark-dark-${h}.png`)
    await sharp(light)
      .resize({ height: h })
      .webp({ quality: 92 })
      .toFile(`${OUT}/wordmark-light-${h}.webp`)
    await sharp(light)
      .resize({ height: h })
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/wordmark-light-${h}.png`)
  }

  const w64 = Math.round((meta.width / meta.height) * 64)
  process.stdout.write(
    `  wordmark  ${meta.width}x${meta.height} source, ${w64}x64 at 1x, two tones\n`,
  )
}

async function emitLogo() {
  // The stacked lockup is 1414x2000 and mostly empty canvas. Trim to the mark.
  for (const h of [96, 192]) {
    await sharp(LOGO)
      .trim({ threshold: 12 })
      .resize({ height: h })
      .webp({ quality: 92 })
      .toFile(`${OUT}/logo-${h}.webp`)
    await sharp(LOGO)
      .trim({ threshold: 12 })
      .resize({ height: h })
      .png({ compressionLevel: 9 })
      .toFile(`${OUT}/logo-${h}.png`)
  }
  process.stdout.write('  logo  96/192  webp + png\n')
}

await mkdir(OUT, { recursive: true })
process.stdout.write('Building images…\n')
await heroDesktop()
await heroMobile()
await emitProducts()
await emitWordmark()
await emitLogo()
process.stdout.write('Done.\n')
