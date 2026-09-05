import { useState } from "react"
import { motion } from "framer-motion"
import { Navigate } from "react-router-dom"

import { EpisodeList } from "@/components/home/EpisodeList"
import { Hero } from "@/components/home/Hero"
import { MemoryRow } from "@/components/home/MemoryRow"
import { Navbar } from "@/components/layout/Navbar"
import { Reveal } from "@/components/motion/Reveal"
import { InfoModal } from "@/components/modals/InfoModal"
import { Lightbox } from "@/components/modals/Lightbox"
import { VideoModal } from "@/components/modals/VideoModal"
import { episodes, site, type Episode, type Memory } from "@/content/site"
import { useProfile } from "@/context/ProfileContext"
import { DURATION, EASE_OUT } from "@/lib/motion"

export default function Browse() {
  const { profile } = useProfile()
  const [infoOpen, setInfoOpen] = useState(false)
  const [activeMemory, setActiveMemory] = useState<Memory | null>(null)
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null)

  // Episodes with a video open the player; ones that are still just a photo
  // open full-screen in the lightbox. Add an mp4 in site.ts to upgrade them.
  function openEpisode(episode: Episode | null) {
    if (!episode) return
    if (episode.video) {
      setActiveEpisode(episode)
      return
    }
    setActiveMemory({
      id: episode.id,
      image: episode.poster,
      caption: episode.title,
    })
  }

  // Landing directly on /browse without picking a profile: start the story properly.
  if (!profile) return <Navigate to="/" replace />

  return (
    <motion.div
      className="min-h-screen w-full overflow-x-hidden bg-nf-bg pb-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      <Navbar />

      <Hero
        onPlay={() => openEpisode(episodes[0] ?? null)}
        onMoreInfo={() => setInfoOpen(true)}
      />

      {/* -mt-6 pulls the rows up into the hero's fade, as the reference does */}
      <div className="relative z-20 -mt-6 space-y-8 px-4 sm:space-y-12 sm:px-8">
        <MemoryRow onSelect={setActiveMemory} />
        <EpisodeList onSelect={openEpisode} />
      </div>

      <Reveal>
        <footer className="mt-16 text-center text-[10px] text-nf-text-muted">
          <p>{site.tagline}</p>
        </footer>
      </Reveal>

      <InfoModal open={infoOpen} onOpenChange={setInfoOpen} />
      <Lightbox memory={activeMemory} onClose={() => setActiveMemory(null)} />
      <VideoModal
        src={activeEpisode?.video ?? null}
        title={activeEpisode?.title ?? "Episode"}
        layoutKey={activeEpisode?.id}
        onClose={() => setActiveEpisode(null)}
      />
    </motion.div>
  )
}
