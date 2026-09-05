import { Music, VolumeX } from "lucide-react"

import { useMusic } from "@/context/MusicContext"

export function MusicToggle() {
  const { started, muted, toggleMute } = useMusic()

  // Nothing to control until the first tap has unlocked audio.
  if (!started) return null

  return (
    <button
      type="button"
      onClick={toggleMute}
      aria-label={muted ? "Unmute music" : "Mute music"}
      aria-pressed={muted}
      className="fixed bottom-[18px] right-[18px] z-50 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border-[1.5px] border-white/25 bg-white/10 text-nf-red shadow-[0_2px_12px_rgba(0,0,0,0.25)] backdrop-blur-[12px] transition-all hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 active:scale-90 outline-none"
    >
      {muted ? <VolumeX className="h-4 w-4" /> : <Music className="h-4 w-4" />}
    </button>
  )
}
