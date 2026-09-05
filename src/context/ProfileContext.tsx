import { createContext, useCallback, useContext, useMemo, useState } from "react"
import type { ReactNode } from "react"

import { profiles, type Profile } from "@/content/site"

const STORAGE_KEY = "loveflix.profile"

type ProfileContextValue = {
  profile: Profile | null
  selectProfile: (profile: Profile) => void
  clearProfile: () => void
}

const ProfileContext = createContext<ProfileContextValue | null>(null)

function readStoredProfile(): Profile | null {
  try {
    const id = window.sessionStorage.getItem(STORAGE_KEY)
    return profiles.find((p) => p.id === id) ?? null
  } catch {
    // Private browsing / blocked storage — just start fresh.
    return null
  }
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  // sessionStorage-backed so a refresh on /browse doesn't bounce you
  // back to the profile picker, but a new tab starts the story over.
  const [profile, setProfile] = useState<Profile | null>(readStoredProfile)

  const selectProfile = useCallback((next: Profile) => {
    setProfile(next)
    try {
      window.sessionStorage.setItem(STORAGE_KEY, next.id)
    } catch {
      /* storage unavailable — in-memory state still works */
    }
  }, [])

  const clearProfile = useCallback(() => {
    setProfile(null)
    try {
      window.sessionStorage.removeItem(STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }, [])

  const value = useMemo(
    () => ({ profile, selectProfile, clearProfile }),
    [profile, selectProfile, clearProfile]
  )

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
}

export function useProfile() {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error("useProfile must be used within a ProfileProvider")
  return ctx
}
