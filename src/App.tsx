import { AnimatePresence } from "framer-motion"
import { Navigate, Route, Routes, useLocation } from "react-router-dom"

import { MusicToggle } from "@/components/layout/MusicToggle"
import { MusicProvider } from "@/context/MusicContext"
import { ProfileProvider } from "@/context/ProfileContext"
import Browse from "@/routes/Browse"
import Landing from "@/routes/Landing"

function AnimatedRoutes() {
  const location = useLocation()

  return (
    // `mode="wait"` lets the profile screen finish leaving before the home
    // page arrives, so the two never overlap mid-transition.
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Landing />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <MusicProvider>
      <ProfileProvider>
        <AnimatedRoutes />
        <MusicToggle />
      </ProfileProvider>
    </MusicProvider>
  )
}
