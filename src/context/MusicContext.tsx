import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import type { ReactNode } from "react"

type MusicContextValue = {
  /** True once the user's first tap has unlocked audio playback. */
  started: boolean
  muted: boolean
  /** Must be called from inside a user gesture — browsers block autoplay otherwise. */
  start: (src: string) => void
  /** Fades the current track out, swaps the source, and fades the new one in. */
  crossFadeTo: (src: string) => void
  toggleMute: () => void
}

const MusicContext = createContext<MusicContextValue | null>(null)

const FADE_STEP = 0.05
const FADE_INTERVAL_MS = 100

export function MusicProvider({ children }: { children: ReactNode }) {
  // A single <audio> element owned by the provider, so music keeps
  // playing uninterrupted across route changes.
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const fadeTimerRef = useRef<number | null>(null)
  const [started, setStarted] = useState(false)
  const [muted, setMuted] = useState(false)

  const stopFade = useCallback(() => {
    if (fadeTimerRef.current !== null) {
      window.clearInterval(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
  }, [])

  useEffect(() => stopFade, [stopFade])

  const fadeIn = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    stopFade()
    audio.volume = 0
    fadeTimerRef.current = window.setInterval(() => {
      const el = audioRef.current
      if (!el) return stopFade()
      const next = Math.min(el.volume + FADE_STEP, 1)
      el.volume = next
      if (next >= 1) stopFade()
    }, FADE_INTERVAL_MS)
  }, [stopFade])

  const start = useCallback(
    (src: string) => {
      const audio = audioRef.current
      if (!audio || started) return
      audio.src = src
      audio.loop = true
      audio.volume = 1
      // If the file is missing or the browser still refuses, fail silently —
      // the site is fully usable without sound.
      audio.play().catch(() => {})
      setStarted(true)
    },
    [started]
  )

  const crossFadeTo = useCallback(
    (src: string) => {
      const audio = audioRef.current
      if (!audio) return
      stopFade()

      const swap = () => {
        const el = audioRef.current
        if (!el) return
        el.src = src
        el.loop = true
        el.play().catch(() => {})
        fadeIn()
      }

      if (!started || audio.paused) {
        swap()
        setStarted(true)
        return
      }

      // Fade the outgoing track down first, then swap.
      fadeTimerRef.current = window.setInterval(() => {
        const el = audioRef.current
        if (!el) return stopFade()
        const next = Math.max(el.volume - FADE_STEP * 2, 0)
        el.volume = next
        if (next <= 0) {
          stopFade()
          swap()
        }
      }, FADE_INTERVAL_MS / 2)
    },
    [fadeIn, started, stopFade]
  )

  const toggleMute = useCallback(() => {
    setMuted((prev) => {
      const next = !prev
      if (audioRef.current) audioRef.current.muted = next
      return next
    })
  }, [])

  const value = useMemo(
    () => ({ started, muted, start, crossFadeTo, toggleMute }),
    [started, muted, start, crossFadeTo, toggleMute]
  )

  return (
    <MusicContext.Provider value={value}>
      <audio ref={audioRef} preload="auto" />
      {children}
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const ctx = useContext(MusicContext)
  if (!ctx) throw new Error("useMusic must be used within a MusicProvider")
  return ctx
}
