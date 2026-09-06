# MAVEH WORLD — export marketing site

Static marketing website for **MAVEH WORLD**, a dry red chilli exporter based in
Thanjavur, Tamil Nadu. Built for bulk buyers (importers, wholesalers, food
manufacturers, distributors) ordering **1 metric tonne or more**. The site exists
to get a qualified buyer to submit an RFQ or reach WhatsApp — there is no cart,
no checkout, no accounts.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS** — all design tokens live in `tailwind.config.js`
- **framer-motion** — scroll triggers and counters, imported per component
- **Web3Forms** for the quote form (no backend)
- **Sveltia CMS** at `/admin` for products — Git-backed, so still no backend and
  no database: a save is a commit, and the commit is what publishes
- Deploy target: **Netlify**

Fonts are self-hosted via `@fontsource` (Space Grotesk display, IBM Plex Sans
body, IBM Plex Mono for data) — no external font requests.

## Architecture — a real multi-page site

There is **no client-side router**. Every route is its own HTML document:

- One `.html` file per page in the project root. `vite.config.ts` picks them all
  up automatically — adding a page means adding a file, not registering one.
- `scripts/prerender.mjs` runs after the build, renders each page's React tree
  to a string, and writes it into that page's `#root`. So each document ships
  complete HTML: it works with JavaScript disabled, and it indexes without a
  crawler having to execute anything.
- The same components then hydrate on top of that markup. There is no second
  copy of the markup anywhere.
- Navigation is plain `<a href>`.

There are two kinds of page.

**Static pages** are discovered by convention: a route key in `src/lib/routes.ts`
maps to `src/pages/<Key>.tsx`. Routes with no page file yet are skipped with a
note, so the build stays green while pages are still being added.

| URL | Entry | Page component |
|---|---|---|
| `/` | `index.html` | `src/pages/Home.tsx` |
| `/products` | `products.html` | `src/pages/Products.tsx` |
| `/quality` | `quality.html` | `src/pages/Quality.tsx` |
| `/packaging` | `packaging.html` | `src/pages/Packaging.tsx` |
| `/about` | `about.html` | `src/pages/About.tsx` |
| `/markets` | `markets.html` | `src/pages/Markets.tsx` |
| `/contact` | `contact.html` | `src/pages/Contact.tsx` |

**Product pages** have no component and no route entry of their own. Each one is
a JSON document in `content/varieties/`, and everything else is derived from it:

```
content/varieties/teja.json          the product — edited here or at /admin
        │
        ├─ npm run pages   →  teja.html                 document + JSON-LD
        │                     src/entries/teja.tsx      hydration entry
        ├─ npm run images  →  public/media/products/…   image derivatives
        └─ prerender       →  VarietyPage bound to the data, written into #root
```

So adding a product is adding a content file and a photograph. Its page, its
card in the products grid, its link in the footer, its place on the Scoville
scale, its sitemap entry and its cross-links from the other products all follow.
No code changes, no route to register. Deleting the file removes all of it —
`npm run pages` prunes the generated document and entry.

`teja.html` and `src/entries/teja.tsx` are **generated**, marked `@generated`,
and rewritten on every build. They are committed so a fresh clone can run
`npm run dev` without a build first — but never edit them; edit the JSON.

Because animations must never hide content from a reader without JS, scroll
reveals keep their *start* state in CSS under `html.js-reveal` — a class set by
a short inline script in each page's head, only when JS is running and reduced
motion has not been requested. See `src/lib/motion.ts`.

## Local development

```bash
npm install
cp .env.example .env      # then paste your Web3Forms key (see below)
npm run images            # generate image derivatives from assets/ (once)
npm run dev               # http://localhost:5173
```

Other scripts:

```bash
npm run build             # images + pages + type-check + build + prerender → dist/
npm run preview           # preview the production build locally
npm run typecheck         # type-check only
npm run images            # rebuild image derivatives from assets/
npm run pages             # regenerate product documents from content/varieties/

# Checks — run these against a running `npm run preview`
npm run audit                       # every route, three breakpoints
npm run audit -- --route=/contact   # one route
npm run check:contrast              # hero text vs the real composited pixels
npm run shot -- --route=/ 1440 900 [--full] [--no-js] [--reduced-motion]
```

`audit` checks each route at 390 / 768 / 1440px for horizontal overflow (and
names the element causing it), heading order, a single `h1`, images missing
`alt` or intrinsic size, and controls with no accessible name.

> **Git Bash on Windows** rewrites arguments that look like paths — including
> the value after `--route=` — into Windows paths. Prefix the command with
> `MSYS_NO_PATHCONV=1`, or run it from PowerShell.

### Measured on the current build

| | Result |
|---|---|
| Lighthouse (mobile, throttled) | performance 96–98, accessibility 100, best practices 100, SEO 100 |
| Largest Contentful Paint | 2.2–2.4s |
| Cumulative Layout Shift | 0–0.005 |
| JS per page, gzipped | 82.5KB worst case (budget 150KB) |
| CSS, gzipped | 7.2KB |

Re-check with `npm run audit`, `npm run check:contrast`, and Lighthouse against
`npm run preview` after any change to the art, the tokens or the scrim.

## Images

Source art lives in `assets/` (committed). Everything in `public/media/` is
generated by `npm run images` and git-ignored — never edit it by hand.

The hero deserves a note. The client's banner is a warm spice photograph with
`MAVEH WORLD` and the Tamil tagline baked into the pixels. The pipeline crops
that band away (so the live `<h1>` is the only wordmark on screen), duotones the
rest into the navy scale, and composites it into a hero-proportioned canvas so
`object-cover` neither magnifies it nor crops the composition. Below 640px the
crop cannot hold, so the hero falls back to the flat navy gradient.

Swapping in real product photography later is a change to `src/data/media.ts`
plus a source file — `<HeroMedia>` takes the image as a prop.

## Quote form

The form on `/contact` uses **Netlify Forms**. There is no API key, no
third-party account and no environment variable to set — it works as soon as
the site is deployed to Netlify.

Netlify discovers forms by parsing the HTML in the publish directory at deploy
time. That only works here because the contact page is *prerendered*: the form
markup is really in `dist/contact.html`, not assembled by JavaScript at runtime.
If prerendering ever regressed, Netlify would find no form and submissions would
404 — which is what `npm run check:form` exists to catch.

One POST serves both paths. With JavaScript, the page sends it and shows a
confirmation in place; without it, the browser posts natively and Netlify
returns the reader to `?sent=1`, which renders the same confirmation. If the
send fails either way, the reader is offered WhatsApp and email links prefilled
with everything they typed, so an enquiry is never lost.

**To receive submissions by email:** Netlify → **Site configuration → Forms →
Form notifications → Add notification → Email notification**, pointed at
`worldofmaveh@gmail.com`. Submissions are also listed in that panel regardless.
The free tier covers 100 submissions per month.

If form detection is switched off for the site, enable it under **Site
configuration → Forms** and redeploy.

```bash
npm run check:form    # verifies registration + what a buyer actually experiences
```

## The admin — adding and editing products

The site has a content admin at **`/admin`**, running
[Sveltia CMS](https://sveltiacms.app). It is Git-backed: there is no database
and no server to run or pay for.

Signing in with GitHub and saving a product writes
`content/varieties/<slug>.json` and commits the photograph to
`assets/products/`. Netlify sees the commit, runs `npm run build`, and the build
publishes the page. So:

- every change has an author, a timestamp and a one-click revert;
- a save is **not instant** — the page appears when the build finishes, usually
  one to two minutes;
- the client never touches code, and nothing about the prerendering or the SEO
  is given up to get that.

### One-time setup: GitHub sign-in

The admin needs an OAuth app so the client can sign in. Netlify hosts the OAuth
side, so there is nothing to deploy.

1. **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.**
   - Homepage URL: the site's URL.
   - Authorization callback URL: `https://api.netlify.com/auth/done`
   - Note the **Client ID** and generate a **Client Secret**.
2. **Netlify → Site configuration → Access control → OAuth → Install provider.**
   Choose GitHub and paste the Client ID and Secret.
3. Give the client **write access to the repository** (`Santhoshgen5/chilli-trading`).
   Repository access *is* admin access — there is no separate user list.
4. Visit `/admin` and sign in.

If the repository is ever renamed or moved, update `repo:` in
`public/admin/config.yml`.

### Editing content in code

Company copy still lives in `src/data/` as typed objects. **Do not edit copy
inside components** — change it here in one place.

| File | What it holds |
|---|---|
| `content/varieties/*.json` | One file per product. Owned by the admin; editable by hand. |
| `src/data/varieties.ts` | Loads, validates and normalises those files. Holds `HSN_CODE`. |
| `src/data/company.ts` | Contact details, address, compliance, process steps, markets, MOQ, Incoterms. |
| `src/data/types.ts` | The shapes for the above (edit only when adding a new field). |

A few product fields are **derived, not stored**, so they cannot drift:

- `hsn` — one site-wide constant in `varieties.ts`, not a per-product field.
- `shuLabel` — written from `shuMin`/`shuMax` unless explicitly set, so the
  printed range always matches the range the heat scale is drawn from.
- the Scoville axis — the top of the scale is the hottest product on file, so a
  new product hotter than Teja widens the axis instead of overflowing it.
- `<title>` and meta description — composed from the specification unless the
  `seo` fields are filled in.

A malformed content file **fails the build** with the filename and the field
named, rather than publishing a page with holes in it.

### Placeholders (client has not supplied these yet)

These are intentionally left empty and marked `TODO:` in the data files. The UI
**renders nothing** where they are missing (no filler). Fill in the real value
and it appears automatically:

- **ASTA colour value** per variety → the product's `astaColour` field (in `/admin`, or `content/varieties/<slug>.json`)
- **Aflatoxin limit + testing lab** per variety → the product's `aflatoxin` field
- **Spices Board CRES registration number** → `company.ts` → `compliance` (set `value`, `confirmed: true`)
- **FSSAI licence number** → `company.ts` → `compliance`
- **Ports of loading / transit times** → `company.ts` → `ports`
- **LinkedIn URL** → `company.ts` → `linkedin`
- **Real photography** → for products, upload it in `/admin` (or drop a file into `assets/products/` — the pipeline discovers whatever is there). For the hero and other art, drop source files into `assets/`, add a descriptor to `src/data/media.ts` and run `npm run images`; `<HeroMedia>` takes its image as a prop.
- **Facility, warehouse and packing photography** → there is no slot standing empty for it. The dashed placeholder blocks on About, Quality and Packaging were removed; add a figure to those sections when real photographs exist.
- **Open Graph image** → `public/og-default.svg` is a branded placeholder. For best social-preview support, replace it with a 1200×630 **PNG/JPG** and update the `og:image` reference in `index.html`.

### Domain

The production domain is set to `https://www.mavehworld.com` as a placeholder in:

- each hand-written `.html` entry (canonical + OG)
- `src/data/company.ts` → `siteUrl`
- `public/robots.txt`
- `public/admin/config.yml` → `site_url`, `display_url`

Update these when the real domain is confirmed. The generated product documents
take their canonical and OG URLs from `siteUrl`, so they need no edit. `sitemap.xml` is generated
at build time from `siteUrl` and the pages that actually rendered, so it needs
no edit — and cannot drift out of step with the routes.

## Deploy to Netlify

`netlify.toml` sets the build command and asset caching headers. Note there is
**no SPA redirect** — a catch-all rewrite to `index.html` would hand every URL
the homepage. Netlify serves `products.html` at `/products` on its own, and the
dev and preview servers are taught the same trick in `vite.config.ts`.

**Option A — Git (required if the admin is used):** push this repo to GitHub,
then in Netlify: **Add new site → Import an existing project**. Build settings
are read from `netlify.toml` (build `npm run build`, publish `dist`). Deploy — no environment
variables are required. Finish with the OAuth
step under [The admin](#the-admin--adding-and-editing-products) so the client
can sign in at `/admin`.

This has to be the Git deploy: the admin publishes by committing, so a site
deployed from the CLI would never rebuild when the client saves a product.

**Option B — CLI:**

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Notes on SEO

Every page's `<title>`, description, canonical, Open Graph tags and JSON-LD are
static in its own HTML file — nothing is written at runtime, so nothing depends
on a crawler executing JavaScript. Page content is prerendered into the document
too (see Architecture above).

`robots.txt` is in `public/`. `sitemap.xml` is generated into `dist/` by the
build.
