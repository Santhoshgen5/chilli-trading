// Motion tokens.
//
// Two rules govern everything here:
//
//  1. Animation follows arrival, it never gates it. The server-rendered HTML is
//     visible as it stands. The hidden starting state is applied by CSS only
//     once an inline script has confirmed JS is running AND that the reader has
//     not asked for reduced motion (see the `js-reveal` class in index.css and
//     the head script in each HTML entry). If the bundle never loads, a failsafe
//     timeout drops the class and the page is simply static.
//
//  2. `prefers-reduced-motion: reduce` collapses every duration to zero rather
//     than substituting a different animation. Call `useMotionPrefs()` and pass
//     its `duration`/`delay` through — do not hand-roll a second code path.

import { useReducedMotion } from 'framer-motion'
import type { Transition } from 'framer-motion'

/** Distance, in px, that revealed content rises through. */
export const RISE = 14

/** Stagger between siblings, in seconds. ~60ms reads as one gesture. */
export const STAGGER = 0.06

/** Longest stagger delay we will ever apply — keeps late items from lagging. */
const MAX_STAGGER_DELAY = 0.42

export const EASE_OUT = [0.16, 1, 0.3, 1] as const

export interface MotionPrefs {
  /** True when the reader has asked for reduced motion. */
  reduced: boolean
  /** Base transition for reveals — zero-duration when reduced. */
  transition: (delay?: number) => Transition
  /** Stagger delay for the nth sibling — always 0 when reduced. */
  stagger: (index: number) => number
  /** Offset to rise from — 0 when reduced, so nothing moves. */
  rise: number
}

/**
 * Motion configuration for a component. Everything collapses to instant when
 * the reader prefers reduced motion.
 */
export function useMotionPrefs(): MotionPrefs {
  const reduced = useReducedMotion() ?? false

  return {
    reduced,
    transition: (delay = 0): Transition =>
      reduced
        ? { duration: 0, delay: 0 }
        : { duration: 0.55, delay, ease: EASE_OUT },
    stagger: (index: number) =>
      reduced ? 0 : Math.min(index * STAGGER, MAX_STAGGER_DELAY),
    rise: reduced ? 0 : RISE,
  }
}

/** Viewport options shared by every scroll-triggered animation. */
export const VIEWPORT = {
  once: true,
  /** Fire a little before the element is fully on screen. */
  margin: '0px 0px -12% 0px',
} as const
