import type { Variety } from './types'

// Confirmed specifications supplied by the client. Edit values here — every page
// and the compare table read from this array.
//
// Placeholder fields (astaColour, aflatoxin) are null until the client supplies
// real figures. Do NOT invent them. When null the UI renders nothing.

export const HSN_CODE = '09042110'

export const varieties: Variety[] = [
  {
    slug: 'teja',
    name: 'Teja',
    fullName: 'Teja (S17)',
    summary:
      'Very high pungency with bright red colour. The reference chilli for heat-driven products.',
    pungency: 'Very high',
    shuMin: 80000,
    shuMax: 100000,
    shuLabel: '80,000–100,000',
    colour: 'Bright red',
    moisture: '≤ 12%',
    foreignMatter: 'Max 1%',
    form: 'Stemless / with stem',
    notes: null,
    hsn: HSN_CODE,
    bestSuitedFor:
      'Best suited for hot sauce, oleoresin extraction and high-pungency spice blends.',
    applications: ['Hot sauce', 'Oleoresin', 'Pungency blends'],
    packing: ['5 kg PP bag', '25 kg PP bag', '50 kg PP bag', 'Jute bag', 'Vacuum pack'],
    image: 'teja',
    imageAlt:
      'Teja pods in bulk — long, slender and tapering, with smooth glossy skin, an even scarlet red and short pale stems still attached.',
    // TODO: client to supply ASTA colour value for Teja.
    astaColour: null,
    // TODO: client to supply aflatoxin limit + testing lab for Teja.
    aflatoxin: null,
  },
  {
    slug: 'byadgi',
    name: 'Byadgi',
    fullName: 'Byadgi',
    summary:
      'Low heat with high natural colour value. Chosen for colour rather than pungency.',
    pungency: 'Low',
    shuMin: 8000,
    shuMax: 15000,
    shuLabel: '8,000–15,000',
    colour: 'Bright red, high natural colour value',
    moisture: '≤ 12%',
    foreignMatter: 'Max 1%',
    form: 'Stemless / with stem',
    notes: 'Excellent colour retention.',
    hsn: HSN_CODE,
    bestSuitedFor:
      'Best suited for colour extraction, as a paprika substitute and for mild curry bases.',
    applications: ['Colour extraction', 'Paprika substitute', 'Mild curry bases'],
    packing: ['5 kg PP bag', '25 kg PP bag', '50 kg PP bag', 'Jute bag', 'Vacuum pack'],
    image: 'byadgi',
    imageAlt:
      'Byadgi pods in bulk — broad and deeply wrinkled along their length, a dark crimson red with a matte surface, noticeably longer than Teja.',
    // TODO: client to supply ASTA colour value for Byadgi.
    astaColour: null,
    // TODO: client to supply aflatoxin limit + testing lab for Byadgi.
    aflatoxin: null,
  },
  {
    slug: 'sannam',
    name: 'Sannam',
    fullName: 'Sannam (S4)',
    summary:
      'Medium-high heat with deep red colour. Uniform size, cleaned and machine sorted.',
    pungency: 'Medium-high',
    shuMin: 35000,
    shuMax: 50000,
    shuLabel: '35,000–50,000',
    colour: 'Deep red',
    moisture: '≤ 12%',
    foreignMatter: 'Max 1%',
    form: 'Stemless / with stem',
    notes: 'Uniform size, cleaned and machine sorted.',
    hsn: HSN_CODE,
    bestSuitedFor:
      'Best suited for general-purpose culinary use, with balanced heat and colour.',
    applications: ['General culinary', 'Balanced heat', 'Deep colour'],
    packing: ['5 kg PP bag', '25 kg PP bag', '50 kg PP bag', 'Jute bag', 'Vacuum pack'],
    image: 'sannam',
    imageAlt:
      'Sannam S4 pods in bulk — uniform medium-length pods of even thickness, bright red with a lightly ridged skin and stems attached.',
    // TODO: client to supply ASTA colour value for Sannam S4.
    astaColour: null,
    // TODO: client to supply aflatoxin limit + testing lab for Sannam S4.
    aflatoxin: null,
  },
]

/** Upper bound of the Scale device axis, in SHU. Round number above the hottest variety. */
export const SHU_AXIS_MAX = 100000

export function getVariety(slug: string): Variety | undefined {
  return varieties.find((v) => v.slug === slug)
}

/**
 * Pungency as a 1–3 step, for the level meter on the pungency badge.
 *
 * Derived from the variety's own SHU ceiling rather than stored as a separate
 * field, so it cannot fall out of step with the specification if a range is
 * ever revised. Teja → 3, Sannam → 2, Byadgi → 1.
 */
export function heatLevel(variety: Variety): 1 | 2 | 3 {
  const share = variety.shuMax / SHU_AXIS_MAX
  if (share >= 0.66) return 3
  if (share >= 0.33) return 2
  return 1
}
