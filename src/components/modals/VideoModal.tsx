import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { AnimatedDialog } from "@/components/ui/dialog"
import { EXPAND_SPRING, posterLayoutId } from "@/lib/motion"

export function VideoModal({
  src,
  title,
  /** Episode id, so the player can grow out of that row's thumbnail. */
  layoutKey,
  onClose,
}: {
  src: string | null
  title: string
  layoutKey?: string
  onClose: () => void
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reduced = useReducedMotion()

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (src) {
      video.load()
      video.play().catch(() => {})
      return
    }

    // Closing: stop playback so audio doesn't keep running in the background.
    video.pause()
    video.removeAttribute("src")
    video.load()
  }, [src])

  return (
    <AnimatedDialog
      open={Boolean(src)}
      onOpenChange={(next) => !next && onClose()}
      title={title}
      plainPanel={Boolean(layoutKey) && !reduced}
      panelClassName="w-full max-w-3xl"
    >
      <motion.div
        layoutId={reduced || !layoutKey ? undefined : posterLayoutId(layoutKey)}
        transition={EXPAND_SPRING}
        className="overflow-hidden rounded-nf-md border border-white/10 bg-black shadow-nf-modal"
      >
        <video
          ref={videoRef}
          key={src ?? "empty"}
          src={src ?? undefined}
          controls
          muted
          playsInline
          className="aspect-video w-full bg-black"
        />
      </motion.div>
    </AnimatedDialog>
  )
}
