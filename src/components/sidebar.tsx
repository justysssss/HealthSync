"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, HardDrive, Briefcase, Bell, Plus, Settings, LogOut, HelpCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/my-drive", label: "My Drive", icon: HardDrive },
    { href: "/medkit", label: "Medkit", icon: Briefcase },
    { href: "/reminders", label: "Reminders", icon: Bell },
    { href: "#", label: "Add-Ons", icon: Plus },
  ]

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-[210px] pt-16 flex flex-col z-10 bg-white/10 dark:bg-gray-950/10 backdrop-blur-md">
      <div className="flex-1 flex flex-col gap-1 p-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-md transition-all",
              "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
              pathname === item.href
                ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 shadow-sm"
                : "hover:bg-emerald-50/50 dark:hover:bg-emerald-950/50",
            )}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-auto p-4 space-y-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="h-16 bg-emerald-50/50 dark:bg-emerald-950/50 rounded-lg flex items-center justify-center">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=48&width=48" />
              <AvatarFallback>{user?.name?.substring(0, 2) || 'U'}</AvatarFallback>
            </Avatar>
          </div>
          
          <Link href="/settings" className="block h-16">
            <Button
              variant="ghost"
              className="w-full h-full bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50"
            >
              <Settings className="h-9 w-9" />
            </Button>
          </Link>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/50"
          >
            <HelpCircle size={20} />
            <span className="sr-only">Help</span>
          </Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex-1 bg-emerald-100/50 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 hover:bg-red-500/20 dark:hover:bg-red-500/20 hover:text-red-600 dark:hover:text-red-400 flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  )
}
