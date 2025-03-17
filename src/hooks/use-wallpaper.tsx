"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

type WallpaperContextType = {
  wallpaper: string
  setWallpaper: (url: string) => void
}

const defaultWallpaper = "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80"

const WallpaperContext = createContext<WallpaperContextType>({
  wallpaper: defaultWallpaper,
  setWallpaper: () => {},
})

export function WallpaperProvider({ children }: { children: React.ReactNode }) {
  const [wallpaper, setWallpaperState] = useState<string>(defaultWallpaper)

  useEffect(() => {
    const savedWallpaper = localStorage.getItem("healthsync-wallpaper")
    if (savedWallpaper) {
      setWallpaperState(savedWallpaper)
    }
  }, [])

  const setWallpaper = (url: string) => {
    setWallpaperState(url)
    localStorage.setItem("healthsync-wallpaper", url)
  }

  return <WallpaperContext.Provider value={{ wallpaper, setWallpaper }}>{children}</WallpaperContext.Provider>
}

export function useWallpaper() {
  return useContext(WallpaperContext)
}
