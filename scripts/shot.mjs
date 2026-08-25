// Screenshot helper for reviewing pages against a running preview server.
//
//   npm run preview
//   npm run shot -- /            1440x900
//   npm run shot -- / 390 844    a specific viewport
//   npm run shot -- / 1440 900 --scroll=900   after scrolling (frosted header)
//   npm run shot -- / 1440 900 --full         whole page
//
// Writes into `.shots/`, which is git-ignored.

import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = resolve(ROOT, '.shots')

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chrome or Edge binary found — edit CHROME_CANDIDATES in scripts/shot.mjs.')
  process.exit(1)
}

const args = process.argv.slice(2)
const flags = args.filter((a) => a.startsWith('--'))
const positional = args.filter((a) => !a.startsWith('--'))

// Git Bash on Windows rewrites a bare `/` or `/products` argument into a
// Windows path before Node ever sees it, so `--route=/products` is the reliable
// form there. Positional routes still work in PowerShell and on Unix.
const routeFlag = flags.find((f) => f.startsWith('--route='))
const rawRoute = routeFlag ? routeFlag.slice('--route='.length) : positional[0]
const route = !rawRoute || /^[A-Za-z]:/.test(rawRoute) ? '/' : rawRoute

const numbers = positional.filter((p) => /^\d+$/.test(p))
const width = Number(numbers[0] ?? 1440)
const height = Number(numbers[1] ?? 900)
const scrollY = Number((flags.find((f) => f.startsWith('--scroll=')) ?? '=0').split('=')[1]) || 0
const fullPage = flags.includes('--full')
const reducedMotion = flags.includes('--reduced-motion')
// Proves the prerendered HTML stands on its own: no hydration, no reveal
// animations, nothing but the document the server sent.
const noJs = flags.includes('--no-js')

const ORIGIN = process.env.PREVIEW_ORIGIN ?? 'http://localhost:4173'

mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})
const page = await browser.newPage()
if (noJs) await page.setJavaScriptEnabled(false)
await page.setViewport({ width, height, deviceScaleFactor: 2 })
if (reducedMotion) {
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }])
}
await page.goto(ORIGIN + route, { waitUntil: noJs ? 'load' : 'networkidle0' })

if (scrollY) {
  await page.evaluate((y) => window.scrollTo(0, y), scrollY)
}

// Let scroll reveals settle before capturing.
await new Promise((r) => setTimeout(r, 1400))

const slug =
  (route === '/' ? 'home' : route.replace(/\//g, '-').replace(/^-/, '')) +
  `-${width}` +
  (scrollY ? `-s${scrollY}` : '') +
  (fullPage ? '-full' : '') +
  (reducedMotion ? '-rm' : '') +
  (noJs ? '-nojs' : '')

const file = resolve(OUT, `${slug}.png`)
await page.screenshot({ path: file, fullPage })
console.log(file)

await browser.close()
