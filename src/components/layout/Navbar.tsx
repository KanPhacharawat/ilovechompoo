import { useEffect, useState } from "react"

import { site } from "@/content/site"
import { useProfile } from "@/context/ProfileContext"
import { cn, placeholder } from "@/lib/utils"

/** Scroll distance before the navbar is allowed to hide (from the reference). */
const HIDE_THRESHOLD = 60

export function Navbar() {
  const { profile } = useProfile()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    let lastY = window.scrollY

    function onScroll() {
      const current = window.scrollY
      // Hide when scrolling down past the threshold, reveal on scroll up.
      setHidden(current > lastY && current > HIDE_THRESHOLD)
      // DESIGN.md §4: gradient at the top, solid once scrolled.
      setScrolled(current > 10)
      lastY = current
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed inset-x-0 top-0 z-40 flex items-center justify-between px-4 py-3 transition-all duration-300 sm:px-8",
        scrolled ? "bg-nf-bg" : "bg-gradient-to-b from-black/90 via-black/50 to-transparent",
        hidden ? "-translate-y-full" : "translate-y-0"
      )}
    >
      <h1 className="text-2xl font-black tracking-tighter text-nf-red">{site.brand}</h1>

      {profile && (
        <img
          src={profile.image}
          alt={profile.name}
          title={profile.name}
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = placeholder(profile.fallbackLabel, profile.fallbackColor)
          }}
          className="h-8 w-8 rounded-nf-sm border border-nf-text-muted object-cover"
        />
      )}
    </nav>
  )
}
