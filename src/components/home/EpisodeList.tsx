import { motion, useReducedMotion } from "framer-motion"
import { Play } from "lucide-react"

import { Reveal, RevealGroup } from "@/components/motion/Reveal"
import { episodes, episodesRowTitle, type Episode } from "@/content/site"
import { DURATION, EASE_OUT, posterLayoutId, riseIn } from "@/lib/motion"
import { placeholder } from "@/lib/utils"

export function EpisodeList({ onSelect }: { onSelect: (episode: Episode) => void }) {
  return (
    <section>
      <Reveal>
        <h3 className="mb-3 text-base font-bold text-gray-200 sm:text-lg">
          {episodesRowTitle}
        </h3>
      </Reveal>

      <RevealGroup className="max-w-3xl space-y-3" childDelay={0.12}>
        {episodes.map((episode) => (
          <EpisodeRow key={episode.id} episode={episode} onSelect={onSelect} />
        ))}
      </RevealGroup>
    </section>
  )
}

function EpisodeRow({
  episode,
  onSelect,
}: {
  episode: Episode
  onSelect: (episode: Episode) => void
}) {
  const reduced = useReducedMotion()

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(episode)}
      variants={riseIn}
      whileHover={reduced ? undefined : { x: 6, backgroundColor: "#2d2d2d" }}
      whileTap={reduced ? undefined : { scale: 0.99 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
      className="group flex w-full cursor-pointer items-center gap-4 rounded-nf-md border border-white/10 bg-nf-surface p-3 text-left focus-visible:ring-2 focus-visible:ring-white/70 outline-none"
    >
      <span className="w-4 text-lg font-bold text-nf-text-muted">{episode.number}</span>

      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-nf-sm bg-black">
        {/* Same layoutId trick as the memory cards: this thumbnail is what
            grows into the player (or the full photo, if there's no video). */}
        <motion.div
          layoutId={reduced ? undefined : posterLayoutId(episode.id)}
          className="h-full w-full"
        >
          {episode.video ? (
            /* Silent looping preview, exactly like the reference row */
            <video
              src={episode.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              className="h-full w-full object-cover"
            />
          ) : (
            <img
              src={episode.poster}
              alt={episode.title}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = placeholder(String(episode.number), "#2d2d2d")
              }}
              className="h-full w-full object-cover"
            />
          )}
        </motion.div>

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          <Play className="h-4 w-4 fill-white text-white" />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h4 className="text-sm font-bold">{episode.title}</h4>
        <p className="line-clamp-1 text-xs text-nf-text-secondary">{episode.description}</p>
      </div>
    </motion.button>
  )
}
