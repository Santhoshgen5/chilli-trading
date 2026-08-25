// Image pipeline — run with `npm run images`.
//
// Source assets live in `assets/` (committed, unoptimised). Everything this
// script writes into `public/media/` is generated and git-ignored.
//
// The hero: the client's banner artwork is a 2000x600 warm spice photograph
// with the MAVEH WORLD wordmark and Tamil tagline baked into the pixels. Two
// wordmarks stacked (baked + live HTML h1) looks broken, so we crop the top
// 250px away and keep only the clean bottom band.
//
// That band is 2000x350 (5.7:1) — far too wide for a hero. `object-cover` on a
// ~2.2:1 hero would magnify it 1.8x and show only the middle third. So we
// composite the band into a 2000x900 (2.22:1) canvas: navy gradient on top,
// band along the bottom, dissolved into each other. The result fits the hero
// box at native resolution with the focal point centred.
//
// The band is also duotoned into the navy scale — no warm hue survives, the
// photo reads as navy texture rather than a colour photograph.

import sharp from 'sharp'
import { mkdir } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, 'public/media')

const BANNER = resolve(ROOT, 'assets/banner.png')
const LOGO = resolve(ROOT, 'assets/logo.png')

// --- Hero geometry ---------------------------------------------------------
const CROP_TOP = 250 // px of baked-in wordmark + tagline to discard
const BAND_W = 2000
const BAND_H = 600 - CROP_TOP // 350
const HERO_W = 2000
const HERO_H = 900 // 2.22:1 — matches the hero box, so cover neither crops nor upscales
const BAND_Y = HERO_H - BAND_H // 550
const FADE = 190 // px over which the band dissolves into the navy above it

// --- Duotone endpoints -----------------------------------------------------
// Shadow sits below navy-900 so the image never competes with foreground text;
// highlight carries a slight cyan lift so the texture keeps some life.
const SHADOW = [0x06, 0x0b, 0x22]
const HIGHLIGHT = [0x8f, 0xa4, 0xd6]

// Vertical navy gradient filling the area above the band.
const GRAD_TOP = [0x08, 0x0f, 0x2c]
const GRAD_BOTTOM = [0x0d, 0x17, 0x40]

const WIDTHS = [640, 960, 1280, 1600, 2000]

const lerp = (a, b, t) => a + (b - a) * t
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

/**
 * Build the composited, duotoned hero at full resolution.
 * Returns a raw RGB buffer of HERO_W x HERO_H.
 */
async function buildHero() {
  const { data: band } = await sharp(BANNER)
    .extract({ left: 0, top: CROP_TOP, width: BAND_W, height: BAND_H })
    // Lift contrast before duotoning — the source is soft and low-contrast,
    // and a flat duotone of a flat photo reads as mud.
    .normalise()
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  const out = Buffer.alloc(HERO_W * HERO_H * 3)

  for (let y = 0; y < HERO_H; y++) {
    // Base navy gradient for this row.
    const gt = y / (HERO_H - 1)
    const gr = lerp(GRAD_TOP[0], GRAD_BOTTOM[0], gt)
    const gg = lerp(GRAD_TOP[1], GRAD_BOTTOM[1], gt)
    const gb = lerp(GRAD_TOP[2], GRAD_BOTTOM[2], gt)

    // How much of the photo shows through on this row.
    const bandY = y - BAND_Y
    let alpha = 0
    if (bandY >= 0) {
      alpha = bandY < FADE ? clamp01(bandY / FADE) : 1
      // Ease the dissolve so the seam is not a visible straight line.
      alpha = alpha * alpha * (3 - 2 * alpha)
    }

    for (let x = 0; x < HERO_W; x++) {
      const o = (y * HERO_W + x) * 3
      let r = gr
      let g = gg
      let b = gb

      if (alpha > 0) {
        const bi = (bandY * BAND_W + x) * 3
        // Rec. 709 luma, then map onto the duotone ramp.
        const t =
          (0.2126 * band[bi] + 0.7152 * band[bi + 1] + 0.0722 * band[bi + 2]) / 255
        const dr = lerp(SHADOW[0], HIGHLIGHT[0], t)
        const dg = lerp(SHADOW[1], HIGHLIGHT[1], t)
        const db = lerp(SHADOW[2], HIGHLIGHT[2], t)

        r = lerp(r, dr, alpha)
        g = lerp(g, dg, alpha)
        b = lerp(b, db, alpha)
      }

      out[o] = Math.round(r)
      out[o + 1] = Math.round(g)
      out[o + 2] = Math.round(b)
    }
  }

  return out
}

async function emitHero(raw) {
  const base = sharp(raw, { raw: { width: HERO_W, height: HERO_H, channels: 3 } })

  for (const w of WIDTHS) {
    const resized = () => base.clone().resize({ width: w })
    await resized().avif({ quality: 52, effort: 6 }).toFile(`${OUT}/hero-${w}.avif`)
    await resized().webp({ quality: 74, effort: 5 }).toFile(`${OUT}/hero-${w}.webp`)
    process.stdout.write(`  hero-${w}  avif + webp\n`)
  }

  // Mobile fallback: the 2.22:1 crop cannot hold its composition in a portrait
  // hero box, so small screens get the plain navy gradient instead. Shipping it
  // as a tiny image (rather than hiding the picture) keeps the <img> valid and
  // costs well under a kilobyte.
  await sharp({
    create: {
      width: 8,
      height: 16,
      channels: 3,
      background: { r: GRAD_TOP[0], g: GRAD_TOP[1], b: GRAD_TOP[2] },
    },
  })
    .composite([
      {
        input: Buffer.from(
          `<svg width="8" height="16"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
             <stop offset="0" stop-color="rgb(${GRAD_TOP.join(',')})"/>
             <stop offset="1" stop-color="rgb(${GRAD_BOTTOM.join(',')})"/>
           </linearGradient></defs><rect width="8" height="16" fill="url(#g)"/></svg>`,
        ),
        top: 0,
        left: 0,
      },
    ])
    .webp({ quality: 80 })
    .toFile(`${OUT}/hero-mobile.webp`)
  process.stdout.write('  hero-mobile.webp\n')
}

async function emitLogo() {
  // The supplied logo is 1414x2000 and mostly empty canvas. Trim to the mark.
  const trimmed = sharp(LOGO).trim({ threshold: 12 })
  const { info } = await trimmed.clone().png().toBuffer({ resolveWithObject: true })
  process.stdout.write(`  logo trimmed to ${info.width}x${info.height}\n`)

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
  process.stdout.write('  logo-96 + logo-192  webp + png\n')
}

await mkdir(OUT, { recursive: true })
process.stdout.write('Building images…\n')
const raw = await buildHero()
await emitHero(raw)
await emitLogo()
process.stdout.write('Done.\n')
