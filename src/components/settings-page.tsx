"use client"

import { useState } from "react"
import { Check, HeartPulse, Shield, Bell, User, Palette, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StorageBar } from "@/components/ui/storage-bar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useWallpaper } from "@/hooks/use-wallpaper"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const wallpaperOptions = [
  {
    value: "medical",
    label: "Medical",
    url: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "wellness",
    label: "Wellness",
    url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "nature",
    label: "Nature",
    url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "minimal",
    label: "Minimal",
    url: "https://images.unsplash.com/photo-1497250681960-ef046c08a56e?auto=format&fit=crop&w=1920&q=80",
  },
  {
    value: "abstract",
    label: "Abstract",
    url: "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?auto=format&fit=crop&w=1920&q=80",
  },
]

export function SettingsPage() {
  const { wallpaper, setWallpaper } = useWallpaper()
  const { user, logout } = useAuth()
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const found = wallpaperOptions.find((option) => option.url === wallpaper)
    return found ? found.value : "medical"
  })

  // Form states for account information
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [phone, setPhone] = useState(user?.prefs?.phone || "")
  const [gender, setGender] = useState(user?.prefs?.gender || "")
  const [birthdate, setBirthdate] = useState(user?.prefs?.birthdate || "")
  const [nickname, setNickname] = useState(user?.prefs?.nickname || "")
  const [isSaving, setIsSaving] = useState(false)

  const handleWallpaperChange = (value: string) => {
    setSelectedWallpaper(value)
    const selected = wallpaperOptions.find((option) => option.value === value)
    if (selected) {
      setWallpaper(selected.url)
    }
  }

  const handleSaveChanges = () => {
    setIsSaving(true)
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false)
    }, 1000)
  }

  // Get user initials for avatar
  const getInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    }
    return user?.email?.substring(0, 2).toUpperCase() || "HS"
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-8 w-8 text-cyan-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
        </div>
        <Button variant="outline" onClick={logout}>
          Sign Out
        </Button>
      </div>

      <StorageBar />

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Profile Summary Card */}
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user?.prefs?.avatarUrl || ""} alt={user?.name || "User"} />
                  <AvatarFallback className="text-xl bg-cyan-100 text-cyan-800">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="text-center space-y-1">
                  <h2 className="text-xl font-semibold">{user?.name || "User"}</h2>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                  <div className="flex items-center justify-center mt-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                      {user?.prefs?.isEmailVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <Separator className="my-2" />
            <CardFooter className="flex justify-center py-4">
              <Button variant="outline" size="sm" className="w-full">
                Edit Profile Picture
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-1">
              <Button variant="ghost" className="justify-start" size="sm">
                <Shield className="mr-2 h-4 w-4" />
                Security Settings
              </Button>
              <Button variant="ghost" className="justify-start" size="sm">
                <Bell className="mr-2 h-4 w-4" />
                Notification Preferences
              </Button>
              <Button variant="ghost" className="justify-start" size="sm">
                <Lock className="mr-2 h-4 w-4" />
                Privacy Controls
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Settings Area */}
        <div className="space-y-6">
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="bg-white dark:bg-gray-800 mb-6 grid grid-cols-4 w-full max-w-xl">
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Account</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">Appearance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden sm:inline">Privacy</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="account" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your account details and personal information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name || user?.name || ""}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nickname">Nickname (Optional)</Label>
                      <Input
                        id="nickname"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="How you'd like to be called"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email || user?.email || ""}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Birth Date</Label>
                      <Input
                        id="birthdate"
                        type="date"
                        value={birthdate}
                        onChange={(e) => setBirthdate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger id="gender">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                          <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-6">
                  <Button variant="outline">Cancel</Button>
                  <Button onClick={handleSaveChanges} disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <span className="animate-spin mr-2">⟳</span>
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input id="new-password" type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input id="confirm-password" type="password" />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Update Password</Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Wallpaper</CardTitle>
                  <CardDescription>Choose a background wallpaper for your dashboard</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <RadioGroup
                    value={selectedWallpaper}
                    onValueChange={handleWallpaperChange}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {wallpaperOptions.map((option) => (
                      <div key={option.value} className="relative">
                        <RadioGroupItem value={option.value} id={`wallpaper-${option.value}`} className="sr-only" />
                        <Label htmlFor={`wallpaper-${option.value}`} className="cursor-pointer">
                          <div
                            className="overflow-hidden rounded-md border-2 transition-all hover:border-cyan-400 hover:shadow-md"
                            style={{
                              borderColor: selectedWallpaper === option.value ? "rgb(8 145 178)" : "transparent",
                            }}
                          >
                            <img
                              src={option.url || "/placeholder.svg"}
                              alt={option.label}
                              className="h-32 w-full object-cover"
                            />
                            <div className="p-2 bg-white dark:bg-gray-800 flex justify-between items-center">
                              <span>{option.label}</span>
                              {selectedWallpaper === option.value && <Check className="h-4 w-4 text-cyan-600" />}
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

              <Card>
                <CardHeader>
                  <CardTitle>Accessibility</CardTitle>
                  <CardDescription>Customize your viewing experience</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="high-contrast" />
                    <Label htmlFor="high-contrast">High Contrast Mode</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="larger-text" />
                    <Label htmlFor="larger-text">Larger Text</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="reduce-motion" />
                    <Label htmlFor="reduce-motion">Reduce Motion</Label>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Configure how you want to receive notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Medication Reminders</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications for medication schedules</p>
                    </div>
                    <Switch checked={notifications} onCheckedChange={setNotifications} />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Appointment Alerts</Label>
                      <p className="text-sm text-muted-foreground">Get notified about upcoming appointments</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Health Tips</Label>
                      <p className="text-sm text-muted-foreground">Receive weekly health tips and advice</p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Lab Results</Label>
                      <p className="text-sm text-muted-foreground">Get notified when new lab results are available</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save Preferences</Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Communication Channels</CardTitle>
                  <CardDescription>Choose how you want to be contacted</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via text message</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications on your device</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="privacy" className="mt-0 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Manage your privacy preferences</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Data Sharing</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow sharing of anonymized health data for research
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">Control who can see your profile information</p>
                    </div>
                    <Select defaultValue="private">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select visibility" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="contacts">Contacts Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Control your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Data Export</Label>
                    <p className="text-sm text-muted-foreground">Download a copy of your personal data</p>
                    <Button variant="outline" className="mt-2">
                      Export Data
                    </Button>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label className="text-destructive">Danger Zone</Label>
                    <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                    <Button variant="destructive" className="mt-2">
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

