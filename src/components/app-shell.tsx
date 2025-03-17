"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Sidebar } from "@/components/sidebar"
import { TopBar } from "@/components/topbar"
import { useWallpaper } from "@/hooks/use-wallpaper"
import { usePathname } from "next/navigation"
import { PlusButton } from "@/components/ui/plus-button"
import { CreateFileDialog } from "@/components/create-file-dialog"

export function AppShell({ children }: { children: React.ReactNode }) {
  const { wallpaper } = useWallpaper()
  const [mounted, setMounted] = useState(false)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <TopBar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 pt-16 md:pt-20 pl-[240px]">
          <div className="h-[calc(100vh-5rem)] bg-white/80 dark:bg-gray-900/80 rounded-l-3xl shadow-lg p-8 backdrop-blur-md border-l border-t border-white/10">
            {children}
          </div>
        </main>
      </div>

      <PlusButton onClick={() => setShowCreateDialog(true)} />
      
      <CreateFileDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={() => {
          // Handle successful file creation/upload
          // You might want to refresh data or show a notification
        }}
        mode={pathname === "/my-drive" ? "drive" : "default"}
      />
    </div>
  )
}