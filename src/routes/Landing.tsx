import { motion } from "framer-motion"

import { IntroOverlay } from "@/components/intro/IntroOverlay"
import { ProfileGate } from "@/components/profiles/ProfileGate"
import { DURATION, EASE_OUT } from "@/lib/motion"

export default function Landing() {
  return (
    <motion.div
      className="relative min-h-[100dvh] w-full bg-black"
      exit={{ opacity: 0 }}
      transition={{ duration: DURATION.fast, ease: EASE_OUT }}
    >
      <ProfileGate />
      <IntroOverlay />
    </motion.div>
  )
}
