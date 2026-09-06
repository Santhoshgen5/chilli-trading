// Quote-form smoke test — run with `npm run check:form` against a running preview.
//
// The form is the only thing on this site that has a job beyond being read, so
// it gets checked rather than assumed. This fills it, submits it, and reports
// what actually happened — including whether a buyer who hits a failure still
// has a way to reach the company with their details intact.
//
// It also reports whether VITE_WEB3FORMS_KEY was present at build time. Vite
// inlines that value into the bundle, so an unset key is baked in as an empty
// string and no amount of runtime configuration will fix it — the variable has
// to be set before `npm run build` runs.

import puppeteer from 'puppeteer-core'
import { existsSync, readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const CHROME_CANDIDATES = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/usr/bin/google-chrome',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
]
const executablePath = CHROME_CANDIDATES.find((p) => existsSync(p))
if (!executablePath) {
  console.error('No Chrome or Edge binary found — edit CHROME_CANDIDATES.')
  process.exit(1)
}

const ORIGIN = process.env.PREVIEW_ORIGIN ?? 'http://localhost:4173'

// --- Is a key baked into the build at all? ----------------------------------
const assetsDir = resolve(ROOT, 'dist/assets')
let keyState = 'unknown (no dist build found)'
if (existsSync(assetsDir)) {
  const bundle = readdirSync(assetsDir)
    .filter((f) => f.endsWith('.js'))
    .map((f) => readFileSync(resolve(assetsDir, f), 'utf8'))
    .find((s) => s.includes('web3forms'))
  if (bundle) {
    const match = bundle.match(/name:"access_key",value:"([^"]*)"/)
    keyState = match && match[1] ? `set (${match[1].slice(0, 4)}…)` : 'EMPTY — no key was set at build time'
  }
}

console.log(`Web3Forms key in build: ${keyState}\n`)

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })

// Never let a smoke test post real data to a third party.
await page.setRequestInterception(true)
const attempts = []
page.on('request', (req) => {
  if (req.url().includes('web3forms.com')) {
    attempts.push({ method: req.method(), body: req.postData() ?? '' })
    // Answer as the API would for a rejected key, so we exercise the failure path.
    return req.respond({
      status: 400,
      contentType: 'application/json',
      body: JSON.stringify({ success: false, message: 'Invalid access key (simulated)' }),
    })
  }
  req.continue()
})

await page.goto(`${ORIGIN}/contact`, { waitUntil: 'networkidle0' })

const field = async (id, value) => {
  const el = await page.$(`#${id}`)
  if (!el) throw new Error(`field #${id} not found`)
  await el.type(value)
}

await field('name', 'A Buyer')
await field('company', 'Test Importers Ltd')
await field('email', 'buyer@example.com')
await field('phone', '+971 50 000 0000')
await field('country', 'United Arab Emirates')
await field('quantity', '5')
await page.click('label[for="variety-teja"], fieldset label')

await page.click('button[type="submit"]')
await new Promise((r) => setTimeout(r, 1500))

const outcome = await page.evaluate(() => {
  const alert = document.querySelector('[role="alert"]')
  const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute('href'))
  const mail = [...document.querySelectorAll('a[href^="mailto:"]')].map((a) => a.getAttribute('href'))
  return {
    alertText: alert ? alert.textContent.replace(/\s+/g, ' ').trim().slice(0, 180) : null,
    whatsappLinks: wa.length,
    // Does the fallback carry what the buyer typed?
    fallbackKeepsDetails: wa.some(
      (h) => h && decodeURIComponent(h).includes('Test Importers Ltd'),
    ),
    mailtoLinks: mail.length,
  }
})

console.log(`Requests attempted to Web3Forms: ${attempts.length}`)
if (attempts.length) {
  const body = attempts[0].body
  const hasKey = /"access_key"\s*:\s*"[^"]+"/.test(body)
  console.log(`  payload carries a non-empty access_key: ${hasKey ? 'yes' : 'NO'}`)
}
console.log(`Error shown to the buyer: ${outcome.alertText ? 'yes' : 'no'}`)
if (outcome.alertText) console.log(`  "${outcome.alertText}"`)
console.log(`WhatsApp fallback offered: ${outcome.whatsappLinks > 0 ? 'yes' : 'NO'}`)
console.log(`Fallback preserves the buyer's details: ${outcome.fallbackKeepsDetails ? 'yes' : 'NO'}`)
console.log(`Email fallback offered: ${outcome.mailtoLinks > 0 ? 'yes' : 'no'}`)

await browser.close()
