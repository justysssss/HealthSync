"use client"

import type React from "react"
import { useEffect } from "react"
import { WallpaperProvider } from "@/hooks/use-wallpaper"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider, useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"

// Wrapper component to handle auth redirects
function AuthRedirectWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      const publicPages = ['/login', '/sign-up', '/'];
      const isPublicPage = publicPages.includes(pathname);

      if (!user && !isPublicPage) {
        // Not logged in and trying to access protected page
        router.push('/login');
      } else if (user && isPublicPage) {
        // Logged in and trying to access public page
        router.push('/dashboard');
      }
    }
  }, [user, loading, pathname, router]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
    </div>;
  }

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={true}
        storageKey="healthsync-theme"
      >
        <WallpaperProvider>
          <AuthRedirectWrapper>{children}</AuthRedirectWrapper>
        </WallpaperProvider>
      </ThemeProvider>
    </AuthProvider>
  )
}