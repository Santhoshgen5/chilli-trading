# MAVEH WORLD — export marketing site

Static marketing website for **MAVEH WORLD**, a dry red chilli exporter based in
Thanjavur, Tamil Nadu. Built for bulk buyers (importers, wholesalers, food
manufacturers, distributors) ordering **1 metric tonne or more**. The site exists
to get a qualified buyer to submit an RFQ or reach WhatsApp — there is no cart,
no checkout, no accounts.

## Stack

- **React + Vite + TypeScript**
- **Tailwind CSS**
- **react-router-dom** (client-side routing)
- **react-helmet-async** (per-page meta / Open Graph)
- **Web3Forms** for the enquiry form (no backend)
- Deploy target: **Netlify** (SPA redirect included)

Fonts are self-hosted via `@fontsource` (Space Grotesk display, IBM Plex Sans
body, IBM Plex Mono for data) — no external font requests.

## Local development

```bash
npm install
cp .env.example .env      # then paste your Web3Forms key (see below)
npm run dev               # http://localhost:5173
```

Other scripts:

```bash
npm run build             # type-check + production build to dist/
npm run preview           # preview the production build locally
npm run typecheck         # type-check only
```

## Web3Forms key (enquiry form)

The **Request a Quote** form posts to [Web3Forms](https://web3forms.com). It needs
a free access key.

1. Go to web3forms.com and create an access key, entering the inbox that should
   receive enquiries (e.g. `worldofmaveh@gmail.com`).
2. Copy `.env.example` to `.env`.
3. Paste the key:

   ```
   VITE_WEB3FORMS_KEY=your-access-key-here
   ```

4. On Netlify, add the same variable under **Site settings → Environment
   variables** (Vite inlines `VITE_`-prefixed vars at build time, so it must be
   set before the build runs).

If the key is missing or the request fails, the form does **not** dead-end — it
shows the buyer a WhatsApp/email fallback prefilled with their details.

## Editing content

All product and company copy lives in `src/data/` as typed objects. **Do not edit
copy inside components** — change it here in one place.

| File | What it holds |
|---|---|
| `src/data/varieties.ts` | The three varieties: specs, SHU ranges, applications, packing, HSN. |
| `src/data/company.ts` | Contact details, address, compliance, process steps, markets, MOQ, Incoterms. |
| `src/data/types.ts` | The shapes for the above (edit only when adding a new field). |

Editing is plain data. For example, to correct Teja's colour, change the
`colour` field in `varieties.ts` — every page and the compare table update.

### Placeholders (client has not supplied these yet)

These are intentionally left empty and marked `TODO:` in the data files. The UI
**renders nothing** where they are missing (no filler). Fill in the real value
and it appears automatically:

- **ASTA colour value** per variety → `varieties.ts` → `astaColour`
- **Aflatoxin limit + testing lab** per variety → `varieties.ts` → `aflatoxin`
- **Spices Board CRES registration number** → `company.ts` → `compliance` (set `value`, `confirmed: true`)
- **FSSAI licence number** → `company.ts` → `compliance`
- **Ports of loading / transit times** → `company.ts` → `ports`
- **LinkedIn URL** → `company.ts` → `linkedin`
- **Real photography** → replace the `<Placeholder>` blocks with `<img>` once photos of product, warehouse, packing and loading are available. Placeholders are sized to the final layout.
- **Open Graph image** → `public/og-default.svg` is a branded placeholder. For best social-preview support, replace it with a 1200×630 **PNG/JPG** and update the `og:image` reference in `index.html`.

### Domain

The production domain is set to `https://www.mavehworld.com` as a placeholder in:

- `index.html` (canonical + OG)
- `src/data/company.ts` → `siteUrl` (drives per-page canonical/OG)
- `public/sitemap.xml`
- `public/robots.txt`

Update all four when the real domain is confirmed.

## Deploy to Netlify

`netlify.toml` is included with the SPA redirect (`/* → /index.html`, 200) and
asset caching headers.

**Option A — Git (recommended):** push this repo to GitHub/GitLab, then in
Netlify: **Add new site → Import an existing project**. Build settings are read
from `netlify.toml` (build `npm run build`, publish `dist`). Add the
`VITE_WEB3FORMS_KEY` environment variable, then deploy.

**Option B — CLI:**

```bash
npm i -g netlify-cli
npm run build
netlify deploy --prod --dir=dist
```

## Notes on SEO

Base meta tags and the `Organization` JSON-LD are in `index.html` (static, so
crawlers see them without running JS). Per-page `<title>`, description, canonical
and OG are set at runtime with react-helmet-async; product pages also emit
`Product` JSON-LD. Modern search crawlers render JavaScript, so this is sufficient
for indexing. If a specific crawler that does not run JS is a hard requirement, add
a prerender step (e.g. `vite-react-ssg` or a Netlify prerender plugin) — the site
is structured to allow it.

`sitemap.xml` and `robots.txt` are in `public/`.
