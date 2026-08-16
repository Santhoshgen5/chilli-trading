import type { CompanyInfo } from './types'

// Company profile. Single source of truth for contact details, compliance,
// markets, process and packaging. Edit here — components read from this object.

export const company: CompanyInfo = {
  name: 'MAVEH WORLD',
  tagline: 'Dry red chilli, specified per lot.',
  positioning:
    'MAVEH WORLD supplies dry red chilli from Tamil Nadu, India for bulk buyers — importers, wholesalers, food manufacturers and distributors. Every lot is cleaned, sorted and checked against a written specification before it is packed.',

  phones: ['+91 6380463348', '+91 7708387897'],
  email: 'worldofmaveh@gmail.com',
  // wa.me expects international format, digits only.
  whatsapp: '916380463348',

  address: {
    lines: [
      'No. 7, Seda Street',
      'Orathanadu (Taluk & Post)',
      'Thanjavur District, Tamil Nadu',
    ],
    postalCode: '614625',
    country: 'India',
  },

  // TODO: client to supply LinkedIn company page URL. Rendered only when set.
  linkedin: null,

  // TODO: confirm production domain. Used for canonical URLs, OG tags and sitemap.
  siteUrl: 'https://www.mavehworld.com',

  moqKg: 1000,
  moqLabel: '1 MT (1,000 kg)',

  // Bag / packing formats — kept deliberately separate from the MOQ above.
  packingOptions: [
    '5 kg PP bag',
    '25 kg PP bag',
    '50 kg PP bag',
    'Jute bag',
    'Vacuum pack',
  ],

  incoterms: ['FOB', 'CIF', 'CFR', 'EXW'],

  compliance: [
    { label: 'IEC', name: 'Importer-Exporter Code', value: null, confirmed: true },
    { label: 'GST', name: 'Goods & Services Tax', value: null, confirmed: true },
    { label: 'Udyam', name: 'Udyam (MSME) Registration', value: null, confirmed: true },
    // TODO: client to supply Spices Board CRES registration number.
    { label: 'Spices Board CRES', name: 'Spices Board CRES Registration', value: null, confirmed: false },
    // TODO: client to supply FSSAI licence number.
    { label: 'FSSAI', name: 'FSSAI Licence', value: null, confirmed: false },
  ],

  process: [
    { title: 'Sourcing', detail: 'Raw chilli sourced from growing regions in and around Tamil Nadu.' },
    { title: 'Machine cleaning', detail: 'Mechanical cleaning to remove dust, grit and loose matter.' },
    { title: 'Colour sorting', detail: 'Optical colour sorting to remove off-colour and damaged pods.' },
    { title: 'Metal detection', detail: 'Metal detection pass before packing.' },
    { title: 'Moisture testing', detail: 'Moisture checked and held below 12% per lot.' },
    { title: 'Quality inspection', detail: 'Specification checked against the order before dispatch.' },
    { title: 'Hygienic packing', detail: 'Packed in the agreed format under hygienic conditions.' },
  ],

  // Export destinations — reach, not a claim of completed shipments.
  markets: [
    'United Arab Emirates',
    'Saudi Arabia',
    'Vietnam',
    'China',
    'Thailand',
    'Malaysia',
    'Bangladesh',
    'United States',
    'United Kingdom',
    'Germany',
  ],

  // TODO: client to supply ports of loading and typical transit times.
  ports: null,
}
