// Layout + accessibility spot-check against a running preview server.
//
//   npm run preview            # in one terminal
//   npm run audit              # in another
//   npm run audit -- /products # a specific route
//
// Checks, at each breakpoint:
//   · horizontal overflow, and which element causes it — the failure mode that
//     is invisible on a desktop monitor and obvious on a phone;
//   · headings arriving in order, with exactly one h1;
//   · images missing width/height, or missing alt entirely (alt="" is fine and
//     deliberate for decorative art);
//   · links and buttons with no accessible name.

import puppeteer from 'puppeteer-core'
import { existsSync } from 'node:fs'

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]

const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chrome or Edge binary found — edit CHROME_CANDIDATES in scripts/audit.mjs.')
  process.exit(1)
}

const ORIGIN = process.env.PREVIEW_ORIGIN ?? 'http://localhost:4173'

// Git Bash on Windows rewrites bare `/products` arguments into Windows paths,
// so `--route=/products` is the form that survives there.
const argv = process.argv.slice(2)
const paths = [
  ...argv.filter((a) => a.startsWith('--route=')).map((a) => a.slice('--route='.length)),
  ...argv.filter((a) => a.startsWith('/')),
].filter((p) => !/^[A-Za-z]:/.test(p))
const ROUTES = paths.length ? paths : ['/']

const VIEWPORTS = [
  { name: 'mobile', width: 390, height: 844 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1440, height: 900 },
]

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})

let problems = 0

for (const route of ROUTES) {
  for (const vp of VIEWPORTS) {
    const page = await browser.newPage()
    await page.setViewport({ width: vp.width, height: vp.height, deviceScaleFactor: 1 })
    await page.goto(ORIGIN + route, { waitUntil: 'networkidle0' })

    const result = await page.evaluate(() => {
      const docW = document.documentElement.clientWidth
      const scrollW = document.documentElement.scrollWidth

      const describe = (el) => ({
        tag: el.tagName.toLowerCase(),
        cls: (el.getAttribute('class') || '').slice(0, 70),
        text: (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 46),
      })

      // Only report the outermost offenders — a wide parent reports every child.
      const rawOffenders = [...document.querySelectorAll('body *')].filter((el) => {
        const r = el.getBoundingClientRect()
        if (!r.width && !r.height) return false
        if (getComputedStyle(el).position === 'fixed') return false
        return r.right > docW + 1
      })
      const offenders = rawOffenders
        .filter((el) => !rawOffenders.some((o) => o !== el && o.contains(el)))
        .slice(0, 6)
        .map((el) => {
          const r = el.getBoundingClientRect()
          return { ...describe(el), right: Math.round(r.right), width: Math.round(r.width) }
        })

      const headings = [...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].map((h) => ({
        level: Number(h.tagName[1]),
        text: (h.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 46),
      }))
      const h1Count = headings.filter((h) => h.level === 1).length
      const skips = []
      for (let i = 1; i < headings.length; i++) {
        if (headings[i].level - headings[i - 1].level > 1) {
          skips.push(`h${headings[i - 1].level} → h${headings[i].level} at "${headings[i].text}"`)
        }
      }

      const imgIssues = [...document.querySelectorAll('img')]
        .filter((img) => !img.hasAttribute('alt') || !img.width || !img.height)
        .map((img) => ({
          src: img.getAttribute('src'),
          missingAlt: !img.hasAttribute('alt'),
          missingSize: !img.width || !img.height,
        }))

      const nameless = [...document.querySelectorAll('a,button')]
        .filter((el) => {
          const name =
            (el.getAttribute('aria-label') || '').trim() ||
            (el.textContent || '').trim() ||
            [...el.querySelectorAll('img')].map((i) => i.getAttribute('alt') || '').join('').trim()
          return !name
        })
        .map(describe)

      return {
        overflow: scrollW - docW,
        offenders,
        h1Count,
        skips,
        imgIssues,
        nameless,
        headings,
      }
    })

    const label = `${route} @ ${vp.name} (${vp.width}px)`
    const issues = []
    if (result.overflow > 1) issues.push(`overflows by ${result.overflow}px`)
    if (result.h1Count !== 1) issues.push(`${result.h1Count} <h1> (expected 1)`)
    if (result.skips.length) issues.push(`heading skip: ${result.skips.join('; ')}`)
    if (result.imgIssues.length) issues.push(`${result.imgIssues.length} image(s) missing alt/size`)
    if (result.nameless.length) issues.push(`${result.nameless.length} control(s) with no accessible name`)

    if (issues.length) {
      problems += issues.length
      console.log(`\nFAIL  ${label}`)
      for (const issue of issues) console.log(`      · ${issue}`)
      for (const o of result.offenders) {
        console.log(`        overflowing: <${o.tag}> right=${o.right} w=${o.width} "${o.text}"`)
        console.log(`                     class="${o.cls}"`)
      }
      for (const i of result.imgIssues) console.log(`        image: ${JSON.stringify(i)}`)
      for (const n of result.nameless) console.log(`        control: <${n.tag}> class="${n.cls}"`)
    } else {
      console.log(`PASS  ${label}`)
    }

    await page.close()
  }
}

await browser.close()
console.log(problems ? `\n${problems} problem(s) found.` : '\nNo problems found.')
process.exit(problems ? 1 : 0)
