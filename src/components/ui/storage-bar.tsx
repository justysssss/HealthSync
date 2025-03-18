"use client"

import { useState, useEffect } from "react"
import { storage } from "@/lib/appwrite"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"

const FREE_STORAGE_LIMIT = 500 * 1024 * 1024 // 500MB in bytes

interface StorageBarProps {
  variant?: "default" | "compact"
}

export function StorageBar({ variant = "default" }: StorageBarProps) {
  const [usedStorage, setUsedStorage] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const calculateStorageUsage = async () => {
      try {
        setIsLoading(true)
        const files = await storage.listFiles(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID || '')
        const totalSize = files.files.reduce((acc, file) => acc + file.sizeOriginal, 0)
        setUsedStorage(totalSize)
      } catch (error) {
        console.error("Failed to calculate storage usage:", error)
      } finally {
        setIsLoading(false)
      }
    }
    
    calculateStorageUsage()
  }, [])
  
  const usedPercentage = (usedStorage / FREE_STORAGE_LIMIT) * 100
  const usedInMB = Math.round(usedStorage / (1024 * 1024))
  const totalInMB = Math.round(FREE_STORAGE_LIMIT / (1024 * 1024))
  
  if (variant === "compact") {
    return (
      <div className="px-4 py-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-emerald-700 dark:text-emerald-300">Storage</span>
            {isLoading ? (
              <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">...</span>
            ) : (
              <span className="font-medium text-emerald-800 dark:text-emerald-200">{usedInMB}/{totalInMB} MB</span>
            )}
          </div>
          <Progress
            value={isLoading ? 0 : usedPercentage}
            className={`h-2.5 ${isLoading ? 'animate-pulse' : ''}`}
            style={{
              backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500 with opacity
              ['--progress-background' as string]: usedPercentage > 90
                ? 'rgb(220, 38, 38)' // red-600
                : usedPercentage > 75
                  ? 'rgb(217, 119, 6)' // amber-600
                  : 'rgb(16, 185, 129)' // emerald-500
            }}
          />
        </div>
      </div>
    )
  }

  return (
    <Card className="p-5 mb-6">
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-emerald-700 dark:text-emerald-300">Storage Used</span>
          {isLoading ? (
            <span className="text-emerald-600 dark:text-emerald-400 animate-pulse">Calculating...</span>
          ) : (
            <span className="font-medium text-emerald-800 dark:text-emerald-200">{usedInMB} MB / {totalInMB} MB</span>
          )}
        </div>
        <Progress
          value={isLoading ? 0 : usedPercentage}
          className={`h-3 ${isLoading ? 'animate-pulse' : ''}`}
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.2)', // emerald-500 with opacity
            ['--progress-background' as string]: usedPercentage > 90
              ? 'rgb(220, 38, 38)' // red-600
              : usedPercentage > 75
                ? 'rgb(217, 119, 6)' // amber-600
                : 'rgb(16, 185, 129)' // emerald-500
          }}
        />
      </div>
    </Card>
  )
}