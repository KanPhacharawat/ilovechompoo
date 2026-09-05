import { useRef } from "react"
import type { CSSProperties } from "react"
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion"
import { Info, Play } from "lucide-react"

import { Button } from "@/components/ui/button"
import { hero } from "@/content/site"
import { DURATION, EASE_OUT, riseIn, stagger } from "@/lib/motion"

export function Hero({
  onPlay,
  onMoreInfo,
}: {
  onPlay: () => void
  onMoreInfo: () => void
}) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const reduced = useReducedMotion()

  // Parallax: the artwork drifts slower than the page and dims as you scroll
  // away, so the billboard feels like it sits behind the rows.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  })
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  return (
    <section
      ref={sectionRef}
      className="relative flex h-[65vh] w-full items-end justify-start overflow-hidden p-6 sm:h-[75vh] sm:p-12"
    >
      {/* The photo lives in its own layer so it can move independently */}
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-cover bg-position-(--hero-pos-mobile) sm:bg-position-(--hero-pos-desktop)"
        style={
          {
            backgroundImage: [
              // DESIGN.md §9: the dark gradient overlays are core to the look.
              "linear-gradient(to top, #141414 5%, transparent 60%)",
              "linear-gradient(to right, rgba(0,0,0,0.8), transparent 60%)",
              `url('${hero.backgroundImage}')`,
            ].join(","),
            "--hero-pos-mobile": hero.backgroundPosition.mobile,
            "--hero-pos-desktop": hero.backgroundPosition.desktop,
            ...(reduced ? {} : { y: bgY, scale: bgScale }),
          } as CSSProperties
        }
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: DURATION.slow, ease: EASE_OUT }}
      />

      <motion.div
        className="z-10 max-w-xl space-y-3"
        variants={stagger(0.09, 0.25)}
        initial={reduced ? false : "hidden"}
        animate="visible"
        style={reduced ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <motion.div variants={riseIn} className="flex items-center gap-2">
          <span className="rounded-nf-sm bg-nf-red px-1.5 py-0.5 text-[10px] font-black tracking-widest text-white">
            {hero.badge}
          </span>
          <span className="text-xs font-semibold uppercase tracking-widest text-nf-text-secondary">
            {hero.kicker}
          </span>
        </motion.div>

        <motion.h2
          variants={riseIn}
          className="text-3xl font-black leading-tight tracking-tight drop-shadow-md sm:text-5xl"
        >
          {hero.title}
        </motion.h2>

        <motion.div
          variants={riseIn}
          className="flex flex-wrap items-center gap-3 text-xs font-medium text-nf-text-secondary"
        >
          <span className="font-bold text-nf-match">{hero.match}</span>
          <span className="border border-nf-text-muted px-1 text-[10px]">{hero.rating}</span>
          <span>{hero.seasons}</span>
          <span className="rounded-nf-sm border border-nf-text-secondary px-1 text-[10px]">
            {hero.quality}
          </span>
        </motion.div>

        <motion.p
          variants={riseIn}
          className="line-clamp-3 text-xs leading-relaxed text-nf-text-secondary sm:text-sm"
        >
          {hero.synopsis}
        </motion.p>

        <motion.div variants={riseIn} className="flex items-center gap-3 pt-2">
          <Button variant="play" size="sm" onClick={onPlay} className="sm:px-6 sm:py-3 sm:text-sm">
            <Play className="h-4 w-4 fill-current" />
            <span>Play</span>
          </Button>
          <Button
            variant="info"
            size="sm"
            onClick={onMoreInfo}
            className="sm:px-6 sm:py-3 sm:text-sm"
          >
            <Info className="h-4 w-4" />
            <span>More Info</span>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}
