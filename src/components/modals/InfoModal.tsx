import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { AnimatedDialog, DialogClose, DialogDescription } from "@/components/ui/dialog"
import { infoModal } from "@/content/site"
import { DURATION, EASE_OUT } from "@/lib/motion"

export function InfoModal({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <AnimatedDialog
      open={open}
      onOpenChange={onOpenChange}
      title={infoModal.title}
      // A long love note should scroll inside the panel rather than run off
      // the bottom of a phone screen.
      panelClassName="max-h-[85dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-nf-md border border-white/15 bg-nf-modal p-6 shadow-nf-modal"
    >
      {/* The note itself arrives a beat after the panel, so it reads as a reveal */}
      <motion.h3
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: DURATION.base, ease: EASE_OUT }}
        className="pr-14 text-2xl font-bold text-nf-red"
      >
        {infoModal.title}
      </motion.h3>

      <DialogDescription asChild>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: DURATION.base, ease: EASE_OUT }}
          className="mt-4 text-sm leading-relaxed text-nf-text-secondary"
        >
          {infoModal.body}
        </motion.p>
      </DialogDescription>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.26, duration: DURATION.base }}
        className="mt-6 text-right"
      >
        <DialogClose asChild>
          <Button variant="cta" size="sm">
            {infoModal.closeLabel}
          </Button>
        </DialogClose>
      </motion.div>
    </AnimatedDialog>
  )
}
