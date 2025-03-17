"use client"

import { useState, useEffect } from "react"
import { Bell, HeartPulse, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"

export function TopBar() {
  const { user } = useAuth()
  const [currentTime, setCurrentTime] = useState("")
  const temperature = "33.6°C"
  const steps = "12265"

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours()
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const ampm = hours >= 12 ? "PM" : "AM"
      const formattedHours = hours % 12 || 12
      setCurrentTime(`${formattedHours}:${minutes} ${ampm}`)
    }

    updateTime()
    const interval = setInterval(updateTime, 60000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-16 flex items-center justify-between px-4 z-20">
      <div className="flex items-center gap-2 ml-2">
        <div className="bg-teal-600 text-white p-2 rounded-md">
          <HeartPulse className="h-5 w-5" />
        </div>
        <h1 className="text-xl font-semibold text-teal-700 dark:text-teal-400">HealthSync</h1>
      </div>

      <div className="flex items-center gap-2">
        {user && (
          <span className="text-sm text-gray-600 dark:text-gray-300 mr-4">
            Welcome, {user.name}
          </span>
        )}

        <Button variant="outline" size="sm" className="bg-teal-600 text-white border-none hover:bg-teal-700">
          <RefreshCw className="h-4 w-4 mr-2" />
          {steps}
        </Button>

        <Button variant="outline" size="sm" className="bg-teal-600 text-white border-none hover:bg-teal-700">
          {temperature}
        </Button>

        <Button variant="outline" size="sm" className="bg-teal-600 text-white border-none hover:bg-teal-700">
          {currentTime}
        </Button>

        <Button variant="outline" size="icon" className="bg-teal-600 text-white border-none hover:bg-teal-700">
          <Bell className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
