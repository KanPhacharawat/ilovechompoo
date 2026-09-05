import type { ReactNode } from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { DURATION, EASE_OUT } from "@/lib/motion"

const DialogClose = DialogPrimitive.Close
const DialogTitle = DialogPrimitive.Title
const DialogDescription = DialogPrimitive.Description

type AnimatedDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** Read out by screen readers; also the accessible name of the dialog. */
  title: string
  children: ReactNode
  /** Classes for the panel that actually animates in. */
  panelClassName?: string
  /** Clicking the dimmed area around the panel closes the dialog. */
  closeOnBackdropClick?: boolean
  /** Show the round ✕ in the top-right of the panel. */
  showClose?: boolean
  /**
   * Skip the panel's own scale/fade — use when the content animates itself,
   * e.g. a poster morphing out of its card via `layoutId`.
   */
  plainPanel?: boolean
}

/**
 * A Radix dialog that animates both in AND out.
 *
 * Radix unmounts its content the moment `open` flips to false, which kills
 * exit animations — so the portal is `forceMount`ed and AnimatePresence owns
 * the unmount instead, waiting for the exit transition to finish.
 */
export function AnimatedDialog({
  open,
  onOpenChange,
  title,
  children,
  panelClassName,
  closeOnBackdropClick = true,
  showClose = true,
  plainPanel = false,
}: AnimatedDialogProps) {
  const reduced = useReducedMotion()

  const panelMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.94, y: 12 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 8 },
        transition: { duration: DURATION.fast, ease: EASE_OUT },
      }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <DialogPrimitive.Portal forceMount key="dialog">
            <DialogPrimitive.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-[2px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: DURATION.fast, ease: EASE_OUT }}
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content asChild forceMount>
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
                onClick={(e) => {
                  // Only the backdrop itself, not a click that bubbled up
                  // from the panel's own content.
                  if (closeOnBackdropClick && e.target === e.currentTarget) {
                    onOpenChange(false)
                  }
                }}
              >
                <DialogTitle className="sr-only">{title}</DialogTitle>

                <motion.div
                  className={cn("relative", panelClassName)}
                  {...(plainPanel ? {} : panelMotion)}
                >
                  {children}

                  {showClose && (
                    <DialogPrimitive.Close
                      aria-label="Close"
                      className="absolute right-3 top-3 z-10 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-black/60 text-nf-text-secondary transition-colors hover:bg-nf-red hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 outline-none"
                    >
                      <X className="h-4 w-4" />
                    </DialogPrimitive.Close>
                  )}
                </motion.div>
              </div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  )
}

export { DialogClose, DialogTitle, DialogDescription }
