"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface AttendanceTimerProps {
  startTime: Date | undefined
  status: string
}

export function AttendanceTimer({ startTime, status }: AttendanceTimerProps) {
  const [elapsedTime, setElapsedTime] = useState<string>("00:00:00")

  useEffect(() => {
    if (!startTime || status === "pendente") {
      setElapsedTime("00:00:00")
      return
    }

    // Se atendimento já foi concluído
    if (status === "concluido" || status === "avaliado") {
      return
    }

    const interval = setInterval(() => {
      const now = new Date()
      const diff = Math.floor((now.getTime() - new Date(startTime).getTime()) / 1000)

      const hours = Math.floor(diff / 3600)
      const minutes = Math.floor((diff % 3600) / 60)
      const seconds = diff % 60

      setElapsedTime(
        `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
      )
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, status])

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100">
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-medium text-muted-foreground">Tempo de atendimento</p>
            <p className="text-lg sm:text-2xl font-bold text-blue-600 font-mono">{elapsedTime}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
