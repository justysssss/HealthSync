"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

interface PlusButtonProps {
  onClick: () => void
}

export function PlusButton({ onClick }: PlusButtonProps) {
  const pathname = usePathname()
  
  // Only show on medkit, reminders, and my-drive pages
  const showOnPaths = ["/medkit", "/reminders", "/my-drive"]
  if (!showOnPaths.includes(pathname)) return null

  // Hide button when not on the active page
  if (typeof window !== 'undefined' && window.location.pathname !== pathname) return null;

  return (
    <Button
      size="icon"
      onClick={onClick}
      className={`h-14 w-14 fixed bottom-6 right-6 rounded-full shadow-lg ${
        pathname === "/my-drive"
          ? "bg-emerald-500 hover:bg-emerald-600"
          : "bg-teal-600 hover:bg-teal-700"
      }`}
    >
      <Plus className="h-6 w-6 text-white" />
    </Button>
  )
}