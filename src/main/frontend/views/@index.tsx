"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { Navigate } from "react-router"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />
  }

  return (
   <Navigate to="/dashboard" replace={true} />
  )
}