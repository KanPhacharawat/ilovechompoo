import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { Reveal, RevealGroup } from "@/components/motion/Reveal"
import { memories, memoriesRowTitle, type Memory } from "@/content/site"
import { cardIn, DURATION, EASE_OUT, posterLayoutId } from "@/lib/motion"
import { cn, placeholder } from "@/lib/utils"

export function MemoryRow({ onSelect }: { onSelect: (memory: Memory) => void }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  // Arrows fade in on hover (or keyboard focus) rather than sitting there
  // competing with the artwork — DESIGN.md §1: the UI must recede.
  const [rowActive, setRowActive] = useState(false)

  const onSettle = useCallback(() => {
    if (!emblaApi) return
    setCanPrev(emblaApi.canScrollPrev())
    setCanNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSettle()
    emblaApi.on("select", onSettle).on("reInit", onSettle).on("settle", onSettle)
    return () => {
      emblaApi.off("select", onSettle).off("reInit", onSettle).off("settle", onSettle)
    }
  }, [emblaApi, onSettle])

  return (
    <section
      className="group/row relative"
      onMouseEnter={() => setRowActive(true)}
      onMouseLeave={() => setRowActive(false)}
      onFocus={() => setRowActive(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setRowActive(false)
        }
      }}
    >
      <Reveal>
        <h3 className="mb-3 text-base font-bold text-gray-200 sm:text-lg">
          {memoriesRowTitle}
        </h3>
      </Reveal>

      <div className="relative">
        {/* py-4 gives the hover scale room so it isn't clipped by the viewport */}
        <div className="overflow-hidden" ref={emblaRef}>
          <RevealGroup className="flex gap-3 py-4" childDelay={0.09}>
            {memories.map((memory) => (
              <MemoryCard key={memory.id} memory={memory} onSelect={onSelect} />
            ))}
          </RevealGroup>
        </div>

        <RowArrow
          side="left"
          show={canPrev && rowActive}
          enabled={canPrev}
          onClick={() => emblaApi?.scrollPrev()}
        />
        <RowArrow
          side="right"
          show={canNext && rowActive}
          enabled={canNext}
          onClick={() => emblaApi?.scrollNext()}
        />
      </div>
    </section>
  )
}

function MemoryCard({
  memory,
  onSelect,
}: {
  memory: Memory
  onSelect: (memory: Memory) => void
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(memory)}
      variants={cardIn}
      whileHover={reduced ? undefined : { scale: 1.05, y: -4 }}
      whileTap={reduced ? undefined : { scale: 0.97 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
      // DESIGN.md §8 card counts: 2 mobile → 3–4 tablet → 5–6 desktop → 6–8 TV
      className="group/card min-w-0 flex-none basis-[45%] cursor-pointer overflow-hidden rounded-nf-md bg-nf-surface text-left shadow-nf-card outline-none hover:z-10 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-white/70 sm:basis-[31%] md:basis-[23%] lg:basis-[19%] xl:basis-[16%] tv:basis-[12%]"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-nf-elevated">
        {/* Shares its layoutId with the lightbox, so tapping grows this exact
            thumbnail into the full photo. */}
        <motion.img
          layoutId={reduced ? undefined : posterLayoutId(memory.id)}
          src={memory.image}
          alt={memory.caption}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = placeholder(memory.caption, "#2d2d2d")
          }}
          className="h-full w-full object-cover"
        />
        {/* DESIGN.md §7: never put text over a thumbnail without a gradient */}
        <div className="nf-fade-bottom pointer-events-none absolute inset-x-0 bottom-0 h-1/2 opacity-70" />
      </div>
      <div className="p-2 text-xs font-semibold sm:p-3 sm:text-sm">{memory.caption}</div>
    </motion.button>
  )
}

function RowArrow({
  side,
  show,
  enabled,
  onClick,
}: {
  side: "left" | "right"
  show: boolean
  enabled: boolean
  onClick: () => void
}) {
  const Icon = side === "left" ? ChevronLeft : ChevronRight
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={!enabled}
      tabIndex={enabled ? 0 : -1}
      aria-hidden={!enabled}
      aria-label={side === "left" ? "Scroll left" : "Scroll right"}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        x: show ? 0 : side === "left" ? -8 : 8,
      }}
      style={{ pointerEvents: show ? "auto" : "none" }}
      whileHover={reduced ? undefined : { scale: 1.06 }}
      whileTap={reduced ? undefined : { scale: 0.94 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
      className={cn(
        "absolute top-1/2 z-20 hidden h-16 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-nf-sm bg-black/60 text-white hover:bg-black/80 focus-visible:ring-2 focus-visible:ring-white/70 outline-none md:flex",
        side === "left" ? "left-0" : "right-0"
      )}
    >
      <Icon className="h-6 w-6" />
    </motion.button>
  )
}
