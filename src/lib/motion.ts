import type { Transition, Variants } from "framer-motion"

/**
 * ============================================================
 *  MOTION TOKENS
 * ============================================================
 *  One place for easing and timing so every animation in the
 *  app feels like it belongs to the same product.
 *
 *  DESIGN.md §7: "Scale cards on hover with a smooth transform
 *  — it's a core interaction." Motion here is confident but
 *  quick; nothing should make her wait to see a photo.
 * ============================================================
 */

/** Expo-out. Fast off the mark, long soft landing — the streaming-UI feel. */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1]

/** Gentle in-out for things that move both ways (nav, toggles). */
export const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1]

/** Used for shared-element expands, so a poster feels physical as it opens. */
export const EXPAND_SPRING: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.8,
}

export const DURATION = {
  fast: 0.25,
  base: 0.45,
  slow: 0.7,
} as const

/* ---------- Reusable variants ---------- */

/** Rise + fade. The workhorse entrance for sections and cards. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
}

/** Same, but subtler — for text lines inside an already-moving block. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: DURATION.base, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: DURATION.fast } },
}

/** Cards popping into a row. */
export const cardIn: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
}

/**
 * Parent that releases its children one after another.
 * Pair with `riseIn` / `cardIn` on the children.
 */
export function stagger(childDelay = 0.08, initialDelay = 0): Variants {
  return {
    hidden: {},
    visible: {
      transition: {
        delayChildren: initialDelay,
        staggerChildren: childDelay,
      },
    },
    exit: {
      transition: { staggerChildren: 0.04, staggerDirection: -1 },
    },
  }
}

/** Shared viewport config: fire once, slightly before the element is centred. */
export const VIEWPORT = { once: true, margin: "0px 0px -80px 0px" } as const

/** layoutId namespace, so a card and its expanded view are the same element. */
export const posterLayoutId = (id: string) => `poster-${id}`
