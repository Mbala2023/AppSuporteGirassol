"use client"

import { useState } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { LoginForm } from "@/components/login-form"

export default function HomePage() {
  const [showSplash, setShowSplash] = useState(true)

  if (showSplash) {
    return <SplashScreen onContinue={() => setShowSplash(false)} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-3 sm:p-4">
      <LoginForm />
    </div>
  )
}
