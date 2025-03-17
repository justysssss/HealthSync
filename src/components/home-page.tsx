"use client"

import { useState } from "react"
import { Search, MoreVertical, Calendar, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function HomePage() {
  const [username, setUsername] = useState("Yumi")
  const greeting = getGreeting()

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    return "Good Evening"
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">
        {greeting}, {username}
      </h1>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search your files..."
            className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
          />
        </div>

        <Button variant="outline" className="flex items-center gap-2 bg-white dark:bg-gray-800">
          <Calendar size={16} />
          <span>Date</span>
        </Button>
      </div>

      <div className="space-y-6">
        <section>
          <h2 className="text-lg font-medium text-teal-700 dark:text-teal-400 mb-3">Recent Folders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="bg-teal-500/90 text-white hover:bg-teal-600/90 transition-colors cursor-pointer">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-2 rounded">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3 5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path d="M3 9H21" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span>MRI Test</span>
                </div>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <MoreVertical size={18} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>

        <section>
          <h2 className="text-lg font-medium text-teal-700 dark:text-teal-400 mb-3">Recent Files</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="h-32 bg-gray-100 dark:bg-gray-800 relative flex items-center justify-center">
                  <FileText className="h-10 w-10 text-red-500 absolute" />
                  <img
                    src="/placeholder.svg?height=200&width=150"
                    alt="PDF thumbnail"
                    className="w-full h-full object-cover opacity-10"
                  />
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm">Efficiency form.pdf</p>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Mar 5, 2023</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">2.4 MB</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}

