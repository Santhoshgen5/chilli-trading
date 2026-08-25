// Hero contrast check — run with `npm run check:contrast`.
//
// White-on-image is where accessibility quietly fails, because the eye reads
// the average while the standard reads the worst pixel. So this does not
// eyeball the hero: it samples the real generated image, replays the two scrim
// gradients over it exactly as the browser composites them, and reports the
// worst contrast ratio found anywhere the text block can sit — across every
// viewport width where the photograph is used.
//
// It exits non-zero if any text colour drops below its WCAG AA threshold, so a
// future change to the art or the scrim cannot silently break the hero.

import sharp from 'sharp'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const HERO = resolve(ROOT, 'public/media/hero-2000.webp')

// --- Scrim, transcribed from HeroMedia.tsx ---------------------------------
// Painted in this order over the image: horizontal first, then vertical.
const SCRIM_X = [
  { at: 0.0, rgb: [7, 12, 36], a: 1.0 },
  { at: 0.34, rgb: [7, 12, 36], a: 0.92 },
  { at: 0.62, rgb: [11, 18, 54], a: 0.68 },
  { at: 1.0, rgb: [11, 18, 54], a: 0.26 },
]
const SCRIM_Y = [
  { at: 0.0, rgb: [7, 12, 36], a: 0.85 },
  { at: 0.38, rgb: [7, 12, 36], a: 0.12 },
  { at: 1.0, rgb: [7, 12, 36], a: 0.16 },
]

// --- Text in the hero ------------------------------------------------------
// `min` is the WCAG AA threshold that applies at that element's size: 3.0 for
// large text (>=24px, or >=18.66px bold), 4.5 for everything else.
const TEXT = [
  { name: 'h1 headline (paper)', hex: '#F7F4EC', min: 3.0 },
  { name: 'subhead body (navy-200)', hex: '#D3DAEE', min: 4.5 },
  { name: 'eyebrow label (navy-300)', hex: '#A9B5D8', min: 4.5 },
  { name: 'spec label (navy-300)', hex: '#A9B5D8', min: 4.5 },
  { name: 'spec value (paper)', hex: '#F7F4EC', min: 4.5 },
]

// Viewports where the photograph is shown. Below 640px the picture falls back
// to the flat navy gradient, which needs no sampling.
const VIEWPORTS = [
  { w: 640, h: 620 },
  { w: 768, h: 700 },
  { w: 1024, h: 760 },
  { w: 1280, h: 774 },
  { w: 1440, h: 774 },
  { w: 1920, h: 800 },
]

// The text column, as a fraction of the hero box. Container is max-w-shell
// (1280px) centred with 32px gutters; the copy sits in a max-w-2xl (672px)
// block at its left edge. Generous on all sides.
const TEXT_BOX = { x0: 0.0, x1: 0.62, y0: 0.12, y1: 0.95 }

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

const { data, info } = await sharp(HERO).raw().removeAlpha().toBuffer({ resolveWithObject: true })
const IMG_W = info.width
const IMG_H = info.height

/** Replicates `object-fit: cover; object-position: center`. */
function coverSample(vw, vh, fx, fy) {
  const scale = Math.max(vw / IMG_W, vh / IMG_H)
  const drawnW = IMG_W * scale
  const drawnH = IMG_H * scale
  const offsetX = (drawnW - vw) / 2
  const offsetY = (drawnH - vh) / 2

  const ix = Math.round((fx * vw + offsetX) / scale)
  const iy = Math.round((fy * vh + offsetY) / scale)
  const x = Math.min(IMG_W - 1, Math.max(0, ix))
  const y = Math.min(IMG_H - 1, Math.max(0, iy))
  const o = (y * IMG_W + x) * 3
  return [data[o], data[o + 1], data[o + 2]]
}

const SAMPLES = 160
let failed = false
const worstOverall = new Map(TEXT.map((t) => [t.name, { ratio: Infinity, where: '' }]))

process.stdout.write('Hero text contrast — worst pixel under each text colour\n')
process.stdout.write('(image + horizontal scrim + vertical scrim, as composited)\n\n')

for (const vp of VIEWPORTS) {
  for (const text of TEXT) {
    const fg = hexToRgb(text.hex)
    let worst = Infinity

    for (let i = 0; i <= SAMPLES; i++) {
      for (let j = 0; j <= SAMPLES; j++) {
        const fx = lerp(TEXT_BOX.x0, TEXT_BOX.x1, i / SAMPLES)
        const fy = lerp(TEXT_BOX.y0, TEXT_BOX.y1, j / SAMPLES)

        let px = coverSample(vp.w, vp.h, fx, fy)
        px = over(px, sampleGradient(SCRIM_X, fx))
        px = over(px, sampleGradient(SCRIM_Y, fy))

        const ratio = contrast(fg, px)
        if (ratio < worst) worst = ratio
      }
    }

    const record = worstOverall.get(text.name)
    if (worst < record.ratio) {
      record.ratio = worst
      record.where = `${vp.w}×${vp.h}`
    }
  }
}

for (const text of TEXT) {
  const { ratio, where } = worstOverall.get(text.name)
  const ok = ratio >= text.min
  if (!ok) failed = true
  process.stdout.write(
    `  ${ok ? 'PASS' : 'FAIL'}  ${text.name.padEnd(26)} ${ratio.toFixed(2).padStart(6)}:1   ` +
      `needs ${text.min.toFixed(1)}:1   worst at ${where}\n`,
  )
}

process.stdout.write(
  failed
    ? '\nHero contrast check FAILED — darken the scrim or move the text column.\n'
    : '\nAll hero text clears WCAG AA against the worst pixel it can sit on.\n',
)

process.exit(failed ? 1 : 0)
