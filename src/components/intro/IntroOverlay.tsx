import { useCallback, useEffect, useRef, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"

import { music, site } from "@/content/site"
import { useMusic } from "@/context/MusicContext"
import { DURATION, EASE_OUT } from "@/lib/motion"
import { cn } from "@/lib/utils"

const SESSION_KEY = "loveflix.introSeen"

/* Timings ported verbatim from the reference site's startSequence(). */
const LETTER_DELAY_MS = 300
const LETTER_STAGGER_MS = 80
const SPINNER_AT_MS = 1300
const FADE_AT_MS = 2600
const FADE_DURATION_MS = 700

function introAlreadySeen() {
  try {
    return window.sessionStorage.getItem(SESSION_KEY) === "1"
  } catch {
    return false
  }
}

export function IntroOverlay() {
  const { start } = useMusic()
  const [dismissed, setDismissed] = useState(introAlreadySeen)
  const [tapped, setTapped] = useState(false)
  const [visibleLetters, setVisibleLetters] = useState(0)
  const [showSpinner, setShowSpinner] = useState(false)
  const timers = useRef<number[]>([])
  const reduced = useReducedMotion()

  const brand = site.brand
  const [firstLetter, ...restLetters] = brand.split("")

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(window.clearTimeout)
  }, [])

  const schedule = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const handleTap = useCallback(() => {
    if (tapped) return
    setTapped(true)

    // The tap is the only moment browsers allow audio to begin.
    start(music.intro)

    restLetters.forEach((_, i) => {
      schedule(() => setVisibleLetters(i + 1), LETTER_DELAY_MS + i * LETTER_STAGGER_MS)
    })

    schedule(() => setShowSpinner(true), SPINNER_AT_MS)
    schedule(() => {
      setDismissed(true)
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1")
      } catch {
        /* ignore */
      }
    }, FADE_AT_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tapped, start])

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          key="intro"
          role="button"
          tabIndex={0}
          aria-label={site.tapHint}
          onClick={handleTap}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              handleTap()
            }
          }}
          // Curtain-up: the black screen lifts away and pulls back slightly,
          // handing off to the profile picker underneath.
          exit={
            reduced
              ? { opacity: 0 }
              : { opacity: 0, scale: 1.15, filter: "blur(8px)" }
          }
          transition={{ duration: FADE_DURATION_MS / 1000, ease: EASE_OUT }}
          className="fixed inset-0 z-50 flex cursor-pointer select-none flex-col items-center justify-center bg-black outline-none"
        >
          <div className="flex h-28 items-center justify-center text-5xl font-black uppercase tracking-tighter sm:text-7xl">
            <motion.span
              className="netflix-red inline-block"
              animate={tapped && !reduced ? { scale: [1, 1.12, 1] } : undefined}
              transition={{ duration: 0.5, ease: EASE_OUT }}
            >
              {firstLetter}
            </motion.span>
            {restLetters.map((letter, i) => (
              <span
                key={`${letter}-${i}`}
                className={cn("netflix-red rest-letter", i < visibleLetters && "show")}
              >
                {letter}
              </span>
            ))}
          </div>

          <motion.p
            animate={{ opacity: tapped ? 0 : 1 }}
            transition={{ duration: DURATION.fast }}
            className="mt-8 animate-pulse text-xs uppercase tracking-[0.3em] text-nf-text-muted"
          >
            {site.tapHint}
          </motion.p>

          <motion.div
            animate={{ opacity: showSpinner ? 1 : 0, scale: showSpinner ? 1 : 0.8 }}
            transition={{ duration: DURATION.fast, ease: EASE_OUT }}
            className="mt-8"
          >
            <div className="netflix-spinner" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
