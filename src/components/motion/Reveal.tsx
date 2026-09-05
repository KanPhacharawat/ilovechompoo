import { motion, useReducedMotion } from "framer-motion"
import type { Variants } from "framer-motion"
import type { ReactNode } from "react"

import { riseIn, stagger, VIEWPORT } from "@/lib/motion"

type RevealProps = {
  children: ReactNode
  className?: string
  /** Variants for this element. Defaults to a rise + fade. */
  variants?: Variants
  /** Wait this long after entering the viewport before animating. */
  delay?: number
  /** Animate immediately on mount instead of waiting for the scroll position. */
  immediate?: boolean
}

/**
 * Reveals its children as they scroll into view (once), or straight away
 * when `immediate` is set. Honours prefers-reduced-motion by rendering the
 * final state with no movement at all.
 */
export function Reveal({
  children,
  className,
  variants = riseIn,
  delay = 0,
  immediate = false,
}: RevealProps) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: VIEWPORT })}
      transition={{ delay }}
    >
      {children}
    </motion.div>
  )
}

/**
 * Same trigger, but releases its children one by one. Children should be
 * `motion` elements using the matching variant names ("hidden"/"visible").
 */
export function RevealGroup({
  children,
  className,
  childDelay = 0.08,
  initialDelay = 0,
  immediate = false,
}: {
  children: ReactNode
  className?: string
  childDelay?: number
  initialDelay?: number
  immediate?: boolean
}) {
  const reduced = useReducedMotion()

  if (reduced) return <div className={className}>{children}</div>

  return (
    <motion.div
      className={className}
      variants={stagger(childDelay, initialDelay)}
      initial="hidden"
      {...(immediate
        ? { animate: "visible" }
        : { whileInView: "visible", viewport: VIEWPORT })}
    >
      {children}
    </motion.div>
  )
}
