// Shared content types. All product + company copy lives in the data files that
// use these shapes — components read from data, nothing is hardcoded in JSX.
//
// Fields typed `string | null` are CLIENT-SUPPLIED PLACEHOLDERS. When the value
// is null the UI renders nothing (no filler). See TODO markers in the data files.

export type VarietySlug = 'teja' | 'byadgi' | 'sannam'

export interface Variety {
  slug: VarietySlug
  /** Display name, e.g. "Teja" */
  name: string
  /** Full label used in titles, e.g. "Teja (S17)" */
  fullName: string
  /** One-line plain-English summary from the buyer's side. */
  summary: string

  // --- Confirmed specifications ---
  pungency: string
  /** Lower bound of the Scoville range, in SHU. Drives the Scale device. */
  shuMin: number
  /** Upper bound of the Scoville range, in SHU. */
  shuMax: number
  /** Pre-formatted range for display, e.g. "80,000–100,000". */
  shuLabel: string
  colour: string
  moisture: string
  foreignMatter: string
  form: string
  /** Variety-specific note, or null where none applies. */
  notes: string | null
  /** HSN tariff code — same for all varieties. */
  hsn: string

  // --- Buyer-facing application guidance ---
  /** Sentence: what this variety is best suited for, written for the buyer. */
  bestSuitedFor: string
  /** Short tags for the application chips. */
  applications: string[]
  /** Available packing formats for this variety. */
  packing: string[]

  // --- Placeholders: client has not supplied these yet ---
  /** ASTA colour value. TODO: client to supply. */
  astaColour: string | null
  /** Aflatoxin limit + testing lab. TODO: client to supply. */
  aflatoxin: string | null
}

export interface ComplianceItem {
  /** Short label, e.g. "IEC" */
  label: string
  /** Full name, e.g. "Importer-Exporter Code" */
  name: string
  /**
   * Registration/licence number, or null if not yet supplied.
   * When null AND `confirmed` is false the item is not rendered.
   */
  value: string | null
  /** True when the registration itself is confirmed (badge shown even without a number). */
  confirmed: boolean
}

export interface ProcessStep {
  title: string
  detail: string
}

export interface CompanyInfo {
  name: string
  tagline: string
  /** Positioning statement — plain, factual, no history claims. */
  positioning: string
  phones: string[]
  email: string
  /** WhatsApp number in international format, digits only (for wa.me links). */
  whatsapp: string
  address: {
    lines: string[]
    postalCode: string
    country: string
  }
  /** LinkedIn profile URL, or null if not supplied. */
  linkedin: string | null
  /** Canonical site origin, used for OG/canonical/sitemap. TODO: confirm domain. */
  siteUrl: string

  /** Minimum order quantity in kilograms. */
  moqKg: number
  moqLabel: string

  /** Bag / packing formats available — kept separate from MOQ. */
  packingOptions: string[]
  incoterms: string[]

  compliance: ComplianceItem[]
  process: ProcessStep[]
  /** Export destinations — reach, not a history claim. */
  markets: string[]

  /** Ports of loading + transit times. TODO: client to supply. */
  ports: string | null
}
