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
  console.log('Current pathname:', pathname); // Add this for debugging
  if (!showOnPaths.some(path => pathname.startsWith(path))) return null

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  return (
    <Button
      size="icon"
      onClick={handleClick}
      className={`h-14 w-14 fixed bottom-6 right-6 rounded-full shadow-lg ${
        pathname === "/my-drive"
          ? "bg-teal-600 hover:bg-emerald-700"
          : "bg-teal-600 hover:bg-teal-700"
      }`}
    >
      <Plus className="h-6 w-6 text-white" />
    </Button>
  )
}