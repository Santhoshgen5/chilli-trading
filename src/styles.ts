// Fonts and global CSS, imported once per page entry.
//
// Self-hosted through @fontsource, so there is no third-party DNS lookup or
// connection on the critical path. Only the weights actually used are pulled
// in; the variable display face ships with unicode-range subsetting, so a
// browser fetches the latin file and nothing else.

import '@fontsource-variable/space-grotesk'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/ibm-plex-mono/latin-400.css'
import '@fontsource/ibm-plex-mono/latin-500.css'

import './index.css'
