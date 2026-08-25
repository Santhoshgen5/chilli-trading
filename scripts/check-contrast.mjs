// Hero contrast check — run with `npm run check:contrast`.
//
// Text on imagery is where accessibility quietly fails, because the eye reads
// the average while the standard reads the worst pixel. So this does not
// eyeball the hero: it samples the real generated images, replays the scrim
// gradients over them exactly as the browser composites them, and reports the
// worst contrast ratio found anywhere the copy can sit.
//
// Both art-directed crops are checked — the wide one served from 640px up, and
// the portrait one served to phones — each against the scrim that actually sits
// over it, at the viewports where it is used.
//
// Exits non-zero if any text colour drops below its WCAG AA threshold, so a
// future change to the art or the scrim cannot silently break the hero.

import sharp from 'sharp'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const NAVY_950 = [7, 12, 36]
const NAVY_900 = [11, 18, 54]

// Scrims transcribed from HeroMedia.tsx. Layers are listed in paint order.
const CROPS = [
  {
    name: 'wide (>= 640px)',
    file: resolve(ROOT, 'public/media/hero-2000.webp'),
    viewports: [
      { w: 640, h: 620 },
      { w: 768, h: 700 },
      { w: 1024, h: 760 },
      { w: 1280, h: 774 },
      { w: 1440, h: 774 },
      { w: 1920, h: 800 },
    ],
    // Copy sits in a left-hand column: container is max-w-shell (1280px)
    // centred, copy in a max-w-2xl block at its left edge. Generous on all sides.
    box: { x0: 0.0, x1: 0.62, y0: 0.12, y1: 0.95 },
    layers: [
      {
        axis: 'x',
        stops: [
          { at: 0.0, rgb: NAVY_950, a: 1.0 },
          { at: 0.34, rgb: NAVY_950, a: 0.92 },
          { at: 0.62, rgb: NAVY_900, a: 0.68 },
          { at: 1.0, rgb: NAVY_900, a: 0.26 },
        ],
      },
      {
        axis: 'y',
        stops: [
          { at: 0.0, rgb: NAVY_950, a: 0.85 },
          { at: 0.38, rgb: NAVY_950, a: 0.12 },
          { at: 1.0, rgb: NAVY_950, a: 0.16 },
        ],
      },
    ],
  },
  {
    name: 'portrait (< 640px)',
    file: resolve(ROOT, 'public/media/hero-mobile-800.webp'),
    viewports: [
      { w: 360, h: 700 },
      { w: 390, h: 780 },
      { w: 414, h: 820 },
      { w: 600, h: 900 },
    ],
    // On a phone the copy runs the full width, so the whole frame is in play.
    // Copy stops at the spec strip; the band below it carries no text, which
    // is why the scrim may taper there.
    box: { x0: 0.0, x1: 1.0, y0: 0.1, y1: 0.9 },
    // No horizontal weighting below 640px — two vertical passes instead.
    layers: [
      {
        axis: 'y',
        stops: [
          { at: 0.0, rgb: NAVY_950, a: 0.92 },
          { at: 0.45, rgb: NAVY_950, a: 0.8 },
          { at: 0.88, rgb: NAVY_950, a: 0.66 },
          { at: 1.0, rgb: NAVY_950, a: 0.3 },
        ],
      },
      {
        axis: 'y',
        stops: [
          { at: 0.0, rgb: NAVY_950, a: 0.55 },
          { at: 0.38, rgb: NAVY_950, a: 0.1 },
          { at: 1.0, rgb: NAVY_950, a: 0.1 },
        ],
      },
    ],
  },
]

// `min` is the WCAG AA threshold for that element's size: 3.0 for large text
// (>=24px, or >=18.66px bold), 4.5 for everything else.
const TEXT = [
  { name: 'h1 headline (paper)', hex: '#F7F4EC', min: 3.0 },
  { name: 'subhead body (navy-200)', hex: '#D3DAEE', min: 4.5 },
  { name: 'eyebrow label (navy-300)', hex: '#A9B5D8', min: 4.5 },
  { name: 'spec label (navy-300)', hex: '#A9B5D8', min: 4.5 },
  { name: 'spec value (paper)', hex: '#F7F4EC', min: 4.5 },
]

const SAMPLES = 140

const lerp = (a, b, t) => a + (b - a) * t

function sampleGradient(stops, t) {
  if (t <= stops[0].at) return stops[0]
  const last = stops[stops.length - 1]
  if (t >= last.at) return last
  for (let i = 0; i < stops.length - 1; i++) {
    const a = stops[i]
    const b = stops[i + 1]
    if (t >= a.at && t <= b.at) {
      const k = (t - a.at) / (b.at - a.at)
      return {
        rgb: [0, 1, 2].map((c) => lerp(a.rgb[c], b.rgb[c], k)),
        a: lerp(a.a, b.a, k),
      }
    }
  }
  return last
}

/** Source-over composite of an RGBA layer onto an opaque RGB base. */
function over(base, layer) {
  return [0, 1, 2].map((c) => layer.rgb[c] * layer.a + base[c] * (1 - layer.a))
}

function relLuminance([r, g, b]) {
  const f = (v) => {
    const s = v / 255
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
}

function contrast(a, b) {
  const l1 = relLuminance(a)
  const l2 = relLuminance(b)
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1]
  return (hi + 0.05) / (lo + 0.05)
}

const hexToRgb = (hex) => hex.replace('#', '').match(/../g).map((h) => parseInt(h, 16))

/** Replicates `object-fit: cover; object-position: center`. */
function makeSampler(data, imgW, imgH) {
  return (vw, vh, fx, fy) => {
    const scale = Math.max(vw / imgW, vh / imgH)
    const offsetX = (imgW * scale - vw) / 2
    const offsetY = (imgH * scale - vh) / 2
    const ix = Math.round((fx * vw + offsetX) / scale)
    const iy = Math.round((fy * vh + offsetY) / scale)
    const x = Math.min(imgW - 1, Math.max(0, ix))
    const y = Math.min(imgH - 1, Math.max(0, iy))
    const o = (y * imgW + x) * 3
    return [data[o], data[o + 1], data[o + 2]]
  }
}

let failed = false

process.stdout.write('Hero text contrast — worst pixel under each text colour\n')
process.stdout.write('(real image + scrim layers, composited as the browser would)\n')

for (const crop of CROPS) {
  const { data, info } = await sharp(crop.file)
    .raw()
    .removeAlpha()
    .toBuffer({ resolveWithObject: true })
  const sample = makeSampler(data, info.width, info.height)

  process.stdout.write(`\n  ${crop.name}  ${info.width}x${info.height}\n`)

  for (const text of TEXT) {
    const fg = hexToRgb(text.hex)
    let worst = Infinity
    let where = ''

    for (const vp of crop.viewports) {
      for (let i = 0; i <= SAMPLES; i++) {
        for (let j = 0; j <= SAMPLES; j++) {
          const fx = lerp(crop.box.x0, crop.box.x1, i / SAMPLES)
          const fy = lerp(crop.box.y0, crop.box.y1, j / SAMPLES)

          let px = sample(vp.w, vp.h, fx, fy)
          for (const layer of crop.layers) {
            px = over(px, sampleGradient(layer.stops, layer.axis === 'x' ? fx : fy))
          }

          const ratio = contrast(fg, px)
          if (ratio < worst) {
            worst = ratio
            where = `${vp.w}x${vp.h}`
          }
        }
      }
    }

    const ok = worst >= text.min
    if (!ok) failed = true
    process.stdout.write(
      `    ${ok ? 'PASS' : 'FAIL'}  ${text.name.padEnd(26)} ${worst.toFixed(2).padStart(6)}:1   ` +
        `needs ${text.min.toFixed(1)}:1   worst at ${where}\n`,
    )
  }
}

process.stdout.write(
  failed
    ? '\nHero contrast check FAILED — darken the scrim or move the text column.\n'
    : '\nAll hero text clears WCAG AA against the worst pixel it can sit on.\n',
)

process.exit(failed ? 1 : 0)
