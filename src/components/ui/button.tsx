import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * Netflix button set — DESIGN.md §4.
 * `play` is the deliberate colour exception: white background, black text.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-nf-sm font-bold transition-all outline-none focus-visible:ring-2 focus-visible:ring-white/70 disabled:pointer-events-none disabled:opacity-50 active:scale-95 cursor-pointer [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        play: "bg-white text-nf-bg hover:bg-white/85",
        info: "bg-[rgba(109,109,110,0.7)] text-white hover:bg-[rgba(109,109,110,0.9)]",
        cta: "bg-nf-red text-white hover:bg-nf-red-dark",
        outline:
          "border border-nf-text-muted/70 bg-transparent text-nf-text-secondary hover:text-white hover:border-white",
        ghost: "bg-transparent text-nf-text-secondary hover:text-white",
      },
      size: {
        // DESIGN.md §4: Play / More Info padding 12px 24px, UI text 14px
        default: "px-6 py-3 text-sm tracking-[0.02em]",
        sm: "px-4 py-2 text-xs tracking-[0.02em]",
        // Marketing CTA: 16px 32px
        lg: "px-8 py-4 text-base",
        icon: "h-11 w-11 p-0",
      },
    },
    defaultVariants: {
      variant: "play",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
