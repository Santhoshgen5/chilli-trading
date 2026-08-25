/** @type {import('tailwindcss').Config} */

// Design tokens. Nothing in the markup should carry a raw hex value — if a
// colour, radius, shadow or duration is needed, it gets a name here first.
//
// Contrast is part of the token, not an afterthought. Every value below is
// annotated with its measured ratio against the surface it is meant to sit on,
// so a step cannot be reached for in the wrong place by accident:
//
//   navy 50–300   surfaces and borders only — never text
//   navy 400      3.64:1 on paper — large text and UI furniture only
//   navy 500      7.63:1 on paper — muted body text
//   navy 600–950  body text and headings
//
// gold and cyan are both too light for body text on paper (2.20:1 and 2.52:1).
// They are decoration on light surfaces, and only become text on navy.

export default {
  content: ['./*.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F5F7FC', //  surface tint
          100: '#E8ECF7', //  border on navy surfaces
          200: '#D3DAEE', //  divider on dark / border
          300: '#A9B5D8', //  8.92:1 on navy-900 — muted text on dark
          400: '#6E7DB4', //  3.64:1 on paper — UI furniture, large text only
          500: '#3B4A85', //  7.63:1 on paper — muted body text
          600: '#26356E', // 10.52:1 on paper — body text
          700: '#0F1A4A', // 15.08:1 on paper — brand mid, solid fills
          800: '#0D1540', //  gradient partner
          900: '#0B1236', //  brand deep, dark band ground
          950: '#070C24', //  gradient floor
        },
        gold: {
          300: '#E0BC4A', //  9.93:1 on navy-900 — accent text on dark
          500: '#C9A227', //  brand gold — hairlines and marks on light, text on dark
          600: '#B08D1C',
          700: '#8A6D12', //  4.47:1 on paper — the only gold safe as text on light
        },
        cyan: {
          300: '#5CC8E0', //  9.35:1 on navy-900 — focus ring on dark
          500: '#1CA9C9', //  brand cyan — 6.56:1 on navy-900
          600: '#127E95', //  4.30:1 on paper — focus ring on light (needs 3:1)
          700: '#107285', //  5.07:1 on paper — links and interactive text on light
        },
        paper: {
          DEFAULT: '#F7F4EC', //  page ground
          50: '#FDFCF8', //  raised card surface
          100: '#EFEADC', //  recessed surface
          line: '#E4DFD2', //  hairline border
          'line-strong': '#D8D2C2', //  emphasised border
        },
      },

      fontFamily: {
        // Display: technical grotesque with spine. Body: institutional workhorse.
        // Data: mono with tabular figures for every spec number and SHU range.
        display: ['"Space Grotesk Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },

      // Display scale — larger and tighter than the body scale.
      fontSize: {
        'display-sm': ['2.25rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['3rem', { lineHeight: '1.05', letterSpacing: '-0.025em' }],
        'display-lg': ['3.75rem', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-xl': ['4.5rem', { lineHeight: '0.98', letterSpacing: '-0.035em' }],
        'display-2xl': ['5.5rem', { lineHeight: '0.95', letterSpacing: '-0.04em' }],
      },

      letterSpacing: {
        label: '0.14em',
      },

      // Navy-tinted, never black — a neutral shadow on a warm paper ground
      // reads as dirt.
      boxShadow: {
        hairline: '0 0 0 1px rgba(11, 18, 54, 0.06)',
        card: '0 1px 2px rgba(11, 18, 54, 0.05), 0 6px 16px -4px rgba(11, 18, 54, 0.10)',
        lift: '0 2px 4px rgba(11, 18, 54, 0.05), 0 14px 32px -8px rgba(11, 18, 54, 0.16)',
        tile: '0 1px 2px rgba(11, 18, 54, 0.05), 0 8px 24px -6px rgba(11, 18, 54, 0.08)',
        header: '0 1px 0 rgba(11, 18, 54, 0.06), 0 8px 24px -16px rgba(11, 18, 54, 0.28)',
        'inset-line': 'inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },

      borderRadius: {
        card: '0.75rem',
        tile: '1rem',
        pill: '9999px',
      },

      maxWidth: {
        prose: '68ch',
        shell: '80rem',
      },

      transitionTimingFunction: {
        out: 'cubic-bezier(0.16, 1, 0.3, 1)',
      },

      keyframes: {
        // Hero scroll cue: a gold tick travelling down a hairline.
        'scroll-cue': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '35%': { opacity: '1' },
          '100%': { transform: 'translateY(250%)', opacity: '0' },
        },
      },

      backgroundImage: {
        // Single hue, single direction, used everywhere a dark band appears.
        'navy-band': 'linear-gradient(160deg, #0F1A4A 0%, #0B1236 55%, #070C24 100%)',
        'navy-tile': 'linear-gradient(160deg, #0D1540 0%, #070C24 100%)',
        // SHU bars — same hue, running left to right along the axis.
        'navy-bar': 'linear-gradient(90deg, #26356E 0%, #0B1236 100%)',
        'navy-bar-dark': 'linear-gradient(90deg, #6E7DB4 0%, #A9B5D8 100%)',
        // Gold hairline — the one accent rule.
        'gold-rule': 'linear-gradient(90deg, #C9A227 0%, rgba(201, 162, 39, 0) 100%)',
      },
    },
  },
  plugins: [],
}
