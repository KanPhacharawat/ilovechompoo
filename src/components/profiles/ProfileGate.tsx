import { useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { useNavigate } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { music, profiles, site, type Profile } from "@/content/site"
import { useMusic } from "@/context/MusicContext"
import { useProfile } from "@/context/ProfileContext"
import { DURATION, EASE_OUT, riseIn, stagger } from "@/lib/motion"
import { placeholder } from "@/lib/utils"

/** Short "signing in" beat, matching the reference's login spinner. */
const SIGN_IN_MS = 1100

export function ProfileGate() {
  const navigate = useNavigate()
  const { selectProfile } = useProfile()
  const { crossFadeTo } = useMusic()
  const [signingIn, setSigningIn] = useState<Profile | null>(null)
  const reduced = useReducedMotion()

  function handleSelect(profile: Profile) {
    if (signingIn) return
    setSigningIn(profile)
    selectProfile(profile)
    crossFadeTo(music.home)
    window.setTimeout(() => navigate("/browse"), SIGN_IN_MS)
  }

  return (
    <AnimatePresence>
      {signingIn ? (
        /* The chosen avatar drifts to the centre and grows — a beat of
           "logging you in" instead of a hard cut to the home page. */
        <motion.div
          key="signing-in"
          className="absolute inset-0 flex flex-col items-center justify-center gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08 }}
          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
        >
          <motion.div
            layoutId={reduced ? undefined : `profile-${signingIn.id}`}
            className="h-28 w-28 overflow-hidden rounded-nf-sm sm:h-32 sm:w-32"
          >
            <ProfileImage profile={signingIn} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="netflix-spinner" />
            <p className="text-xs text-nf-text-secondary">{signingIn.name}</p>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          key="picker"
          className="absolute inset-0 flex w-full select-none flex-col items-center justify-between overflow-y-auto p-4 sm:p-6"
          variants={stagger(0.12, 0.15)}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.header variants={riseIn} className="flex w-full max-w-5xl justify-center pt-2">
            <h1 className="text-2xl font-black tracking-tighter text-nf-red sm:text-3xl">
              {site.brand}
            </h1>
          </motion.header>

          <main className="my-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
            <motion.h2
              variants={riseIn}
              className="mb-8 text-xl font-bold tracking-wide text-gray-100 sm:text-2xl"
            >
              {site.whosWatching}
            </motion.h2>

            <motion.div
              variants={stagger(0.14)}
              className="flex w-full items-center justify-center gap-6 sm:gap-10"
            >
              {profiles.map((profile) => (
                <motion.button
                  key={profile.id}
                  type="button"
                  onClick={() => handleSelect(profile)}
                  variants={riseIn}
                  whileHover={reduced ? undefined : { scale: 1.06, y: -6 }}
                  whileTap={reduced ? undefined : { scale: 0.94 }}
                  transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                  className="group flex cursor-pointer flex-col items-center bg-transparent outline-none"
                >
                  <motion.div
                    layoutId={reduced ? undefined : `profile-${profile.id}`}
                    className="h-24 w-24 overflow-hidden rounded-nf-sm border-2 border-transparent bg-nf-elevated shadow-nf-card transition-colors group-hover:border-white group-focus-visible:border-white sm:h-28 sm:w-28"
                  >
                    <ProfileImage profile={profile} />
                  </motion.div>
                  <span className="mt-2.5 text-xs font-medium text-nf-text-secondary transition-colors group-hover:text-white group-focus-visible:text-white sm:text-sm">
                    {profile.name}
                  </span>
                </motion.button>
              ))}
            </motion.div>

            <motion.div variants={riseIn} className="mt-10">
              <Button variant="outline" size="sm" className="uppercase tracking-widest">
                {site.manageProfiles}
              </Button>
            </motion.div>
          </main>

          <motion.footer
            variants={riseIn}
            className="pb-1 text-center text-[10px] text-nf-text-muted"
          >
            <p>{site.tagline}</p>
          </motion.footer>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ProfileImage({ profile }: { profile: Profile }) {
  return (
    <img
      src={profile.image}
      alt={profile.name}
      loading="eager"
      onError={(e) => {
        e.currentTarget.onerror = null
        e.currentTarget.src = placeholder(profile.fallbackLabel, profile.fallbackColor)
      }}
      className="h-full w-full object-cover"
    />
  )
}
