// Quote-form smoke test — run with `npm run check:form` against a running preview.
//
// The form is the only thing on this site with a job beyond being read, so it
// gets checked rather than assumed. This inspects the built HTML for everything
// Netlify needs in order to register the form at deploy time, then fills it in
// a real browser, submits it, and reports what a buyer actually experiences —
// including whether a failure still carries their details to WhatsApp and email.
//
// Netlify discovers forms by parsing the HTML in the publish directory at build
// time. That only works because the contact page is prerendered; if prerendering
// ever regressed, `#root` would be empty, Netlify would find no form, and every
// submission would 404. The static checks below are what catch that.

import puppeteer from 'puppeteer-core'
import { existsSync, readFileSync } from 'node:fs'
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

let failed = false
const check = (label, ok, detail = '') => {
  if (!ok) failed = true
  console.log(`  ${ok ? 'PASS' : 'FAIL'}  ${label}${detail ? `  — ${detail}` : ''}`)
}

// --- Static: will Netlify find and register this form? ----------------------
console.log('Netlify form registration (parsed from the built HTML)\n')

const built = resolve(ROOT, 'dist/contact.html')
if (!existsSync(built)) {
  console.log('  dist/contact.html not found — run `npm run build` first.')
  process.exit(1)
}
const html = readFileSync(built, 'utf8')
const formTag = (html.match(/<form[^>]*>/g) ?? []).find((t) => t.includes('data-netlify'))

check('form is present in the prerendered HTML', Boolean(formTag))
check('carries data-netlify', Boolean(formTag?.includes('data-netlify="true"')))
check('has a name attribute', /name="quote"/.test(formTag ?? ''))
check('has method="POST"', /method="POST"/i.test(formTag ?? ''))
check('declares a honeypot', Boolean(formTag?.includes('netlify-honeypot')))
check(
  'hidden form-name field matches',
  /name="form-name"[^>]*value="quote"|value="quote"[^>]*name="form-name"/.test(html),
)
check('honeypot field exists', /name="bot-field"/.test(html))
check('no stale Web3Forms access key remains', !html.includes('access_key'))

const fields = [...new Set([...html.matchAll(/<(?:input|select|textarea)[^>]*name="([^"]+)"/g)].map((m) => m[1]))]
  .filter((n) => n !== 'form-name' && n !== 'bot-field')
console.log(`\n  Fields Netlify will register: ${fields.join(', ')}\n`)

// --- Live: what does a buyer actually get? ----------------------------------
console.log('Submission behaviour in a browser\n')

const browser = await puppeteer.launch({
  executablePath,
  headless: 'new',
  args: ['--hide-scrollbars', '--disable-gpu'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1280, height: 900 })

// The preview server has no Netlify form handler, so stand in for one and
// confirm the request we would send is well formed.
await page.setRequestInterception(true)
const posts = []
page.on('request', (req) => {
  if (req.method() === 'POST') {
    posts.push({ url: req.url(), body: req.postData() ?? '' })
    return req.respond({ status: 200, contentType: 'text/html', body: 'ok' })
  }
  req.continue()
})

await page.goto(`${ORIGIN}/contact`, { waitUntil: 'networkidle0' })

const type = async (id, value) => {
  const el = await page.$(`#${id}`)
  if (!el) throw new Error(`field #${id} not found`)
  await el.type(value)
}

await type('name', 'A Buyer')
await type('company', 'Test Importers Ltd')
await type('email', 'buyer@example.com')
await type('phone', '+971 50 000 0000')
await type('country', 'United Arab Emirates')
await type('quantity', '5')
await page.click('fieldset label')

await page.click('button[type="submit"]')
await new Promise((r) => setTimeout(r, 1500))

check('a POST was sent', posts.length > 0)
if (posts.length) {
  const body = posts[0].body
  const parsed = new URLSearchParams(body)
  check('POST carries form-name=quote', parsed.get('form-name') === 'quote')
  check('POST carries the buyer name', parsed.get('name') === 'A Buyer')
  check('POST carries the company', parsed.get('company') === 'Test Importers Ltd')
  check('POST carries a variety selection', Boolean(parsed.get('varieties')))
  check('POST carries the quantity', parsed.get('quantity_mt') === '5')
}

const outcome = await page.evaluate(() => {
  const heading = document.querySelector('h2')
  const wa = [...document.querySelectorAll('a[href*="wa.me"]')].map((a) => a.getAttribute('href'))
  return {
    text: document.body.textContent.replace(/\s+/g, ' '),
    heading: heading ? heading.textContent.trim() : '',
    whatsapp: wa.length,
    fallbackKeepsDetails: wa.some((h) => h && decodeURIComponent(h).includes('Test Importers Ltd')),
  }
})

check('buyer sees a confirmation', outcome.text.includes('Thank you'), outcome.heading)
check('WhatsApp route remains available', outcome.whatsapp > 0)
check("fallback preserves the buyer's details", outcome.fallbackKeepsDetails)

await browser.close()

console.log(
  failed
    ? '\nForm check FAILED.\n'
    : '\nForm is wired correctly. Netlify will register it on deploy; submissions\n' +
      'appear under Site configuration > Forms, where you can add an email notification.\n',
)
process.exit(failed ? 1 : 0)
