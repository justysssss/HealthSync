"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallpaper } from "@/hooks/use-wallpaper"

const wallpaperOptions = [
  {
    value: "forest",
    label: "Forest",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "mountains",
    label: "Mountains",
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "ocean",
    label: "Ocean",
    url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "cityscape",
    label: "Cityscape",
    url: "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "minimal",
    label: "Minimal",
    url: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1920&q=80",
  },
]

export function SettingsPage() {
  const { wallpaper, setWallpaper } = useWallpaper()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const found = wallpaperOptions.find((option) => option.url === wallpaper)
    return found ? found.value : "forest"
  })

  const handleWallpaperChange = (value: string) => {
    setSelectedWallpaper(value)
    const selected = wallpaperOptions.find((option) => option.value === value)
    if (selected) {
      setWallpaper(selected.url)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">Settings</h1>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="bg-white dark:bg-gray-800 mb-4">
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Wallpaper</CardTitle>
              <CardDescription>Choose a background wallpaper for your application</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={selectedWallpaper}
                onValueChange={handleWallpaperChange}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {wallpaperOptions.map((option) => (
                  <div key={option.value} className="relative">
                    <RadioGroupItem value={option.value} id={`wallpaper-${option.value}`} className="sr-only" />
                    <Label htmlFor={`wallpaper-${option.value}`} className="cursor-pointer">
                      <div
                        className="overflow-hidden rounded-md border-2 transition-all hover:border-teal-400 hover:shadow-md"
                        style={{
                          borderColor: selectedWallpaper === option.value ? "hsl(var(--primary))" : "transparent",
                        }}
                      >
                        <img
                          src={option.url || "/placeholder.svg"}
                          alt={option.label}
                          className="h-32 w-full object-cover"
                        />
                        <div className="p-2 bg-white dark:bg-gray-800 flex justify-between items-center">
                          <span>{option.label}</span>
                          {selectedWallpaper === option.value && <Check className="h-4 w-4 text-teal-600" />}
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" checked={darkMode} onCheckedChange={setDarkMode} />
                <Label htmlFor="dark-mode">Dark Mode</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Update your account details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue="Yumi Tanaka" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="yumi@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Cancel</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Configure how you want to receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Medication Reminders</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications for medication schedules</p>
                </div>
                <Switch checked={notifications} onCheckedChange={setNotifications} />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Appointment Alerts</Label>
                  <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Health Tips</Label>
                  <p className="text-sm text-muted-foreground">Receive weekly health tips and advice</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="mt-0 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Manage your privacy preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">Allow sharing of anonymized health data for research</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="space-y-2">
                <Label>Data Export</Label>
                <p className="text-sm text-muted-foreground">Download a copy of your personal data</p>
                <Button variant="outline" className="mt-2">
                  Export Data
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

