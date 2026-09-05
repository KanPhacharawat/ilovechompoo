import { useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"

import { AnimatedDialog } from "@/components/ui/dialog"
import type { Memory } from "@/content/site"
import { DURATION, EASE_OUT, EXPAND_SPRING, posterLayoutId } from "@/lib/motion"
import { placeholder } from "@/lib/utils"

export function Lightbox({
  memory,
  onClose,
}: {
  memory: Memory | null
  onClose: () => void
}) {
  const reduced = useReducedMotion()

  // Hold on to the last photo so it stays on screen while the dialog
  // animates out — `memory` is already null by then.
  const lastShown = useRef<Memory | null>(null)
  if (memory) lastShown.current = memory
  const shown = memory ?? lastShown.current

  return (
    <AnimatedDialog
      open={Boolean(memory)}
      onOpenChange={(next) => !next && onClose()}
      title={shown?.caption ?? "Memory"}
      showClose={false}
      // The image drives its own motion via layoutId — a panel scale on top
      // of that would fight it.
      plainPanel
      panelClassName="flex cursor-pointer flex-col items-center"
    >
      {shown && (
        <div onClick={onClose} className="flex flex-col items-center">
          {/* Shares a layoutId with its card, so the thumbnail physically
              grows into the full photo instead of cross-fading. */}
          <motion.img
            layoutId={reduced ? undefined : posterLayoutId(shown.id)}
            transition={EXPAND_SPRING}
            src={shown.image}
            alt={shown.caption}
            onError={(e) => {
              e.currentTarget.onerror = null
              e.currentTarget.src = placeholder(shown.caption, "#2d2d2d")
            }}
            className="max-h-[75vh] max-w-full rounded-nf-md border border-white/10 object-contain shadow-nf-modal"
          />

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.15, duration: DURATION.base, ease: EASE_OUT }}
            className="mt-4 text-center text-sm font-semibold text-gray-200"
          >
            {shown.caption}
          </motion.p>
        </div>
      )}
    </AnimatedDialog>
  )
}
