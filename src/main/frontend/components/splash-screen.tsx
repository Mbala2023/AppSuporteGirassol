"use client"

import { useState } from "react"
import { SunflowerLogo } from "./sunflower-logo"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"

interface SplashScreenProps {
  onContinue: () => void
}

export function SplashScreen({ onContinue }: SplashScreenProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleContinue = () => {
    setIsLoading(true)
    setTimeout(() => {
      onContinue()
    }, 500)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-amber-50 to-green-50 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center">
            <SunflowerLogo />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-4xl sm:text-5xl font-bold text-amber-900 dark:text-amber-100">ServiçoApp</h1>
            <p className="text-lg sm:text-xl text-green-700 dark:text-green-400 font-medium">Gestão de Atendimentos</p>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 shadow-lg">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Atendimento Eficiente</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Conecte técnicos e clientes em tempo real</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Chat Integrado</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comunicação segura e rastreável</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 rounded-full bg-amber-500 dark:bg-amber-600 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">Avaliações Transparentes</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Sistema de pontuação justo e objetivo</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="space-y-3">
          <Button
            onClick={handleContinue}
            disabled={isLoading}
            className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800 text-white rounded-xl transition-all duration-200 group"
          >
            <span>Começar</span>
            <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            Sistema robusto para gestão de atendimentos técnicos
          </p>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-500">
            © 2025 ServiçoApp. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
