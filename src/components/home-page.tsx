"use client"

import { useState, useEffect } from "react"
import {
  Search,
  MoreVertical,
  FileText,
  Download,
  Trash,
  Edit,
  Folder,
  Loader2,
  Grid,
  List,
  ImageIcon,
  Calendar,
  Bell,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/context/AuthContext"
import {
  listAppointments,
  listFiles,
  type AppointmentDocument,
  type FileDocument,
  storage,
  databases,
  downloadFile,
} from "@/lib/appwrite"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function HomePage() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<AppointmentDocument[]>([])
  const [files, setFiles] = useState<FileDocument[]>([])
  const [wellnessMessageIndex, setWellnessMessageIndex] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")

  const wellnessMessages = [
    "Have you taken your medications today?",
    "Remember to stay hydrated!",
    "Time for a quick stretch?",
    "How are you feeling today?",
    "Don't forget your vitamins!",
  ]

  useEffect(() => {
    // Fetch data
    const fetchData = async () => {
      try {
        const [apptsData, filesData] = await Promise.all([listAppointments(), listFiles()])
        setAppointments(apptsData)
        setFiles(filesData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()

    // Rotate wellness messages
    const interval = setInterval(() => {
      setWellnessMessageIndex((prev) => (prev + 1) % wellnessMessages.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 5) return "Good Night"
    if (hour < 12) return "Good Morning"
    if (hour < 18) return "Good Afternoon"
    if (hour < 22) return "Good Evening"
    return "Good Night"
  }

  const displayName = user?.prefs?.nickname || user?.name || "User"
  const greeting = getGreeting()
  const upcomingAppointments = appointments
    .filter((apt) => new Date(apt.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  // Separate files and folders
  const folders = files.filter((file) => file.type === "folder" && !file.parentId)
  const recentFiles = files.filter((file) => file.type === "file" && !file.parentId).slice(0, 4)

  const getFileIcon = (file: FileDocument) => {
    if (file.type === "folder") return <Folder className="text-teal-500" size={16} />
    if (file.mimeType?.startsWith("image/")) return <ImageIcon className="text-purple-500" size={16} />
    return <FileText className="text-blue-500" size={16} />
  }

  const getFilePreview = (file: FileDocument) => {
    if (!file.fieldId) return null
    if (file.mimeType?.startsWith("image/")) {
      return storage.getFilePreview(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
        file.fieldId,
        480, // Larger preview size for better quality
        270, // Maintain 16:9 aspect ratio
      )
    }
    return null
  }

  const handleFileAction = async (file: FileDocument, action: string) => {
    try {
      switch (action) {
        case "open":
          if (file.type === "folder") {
            window.location.href = `/my-drive?folder=${file.$id}`
          } else if (file.fieldId) {
            const url = storage.getFileView(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!, file.fieldId)
            window.open(url, "_blank")
          }
          break

        case "download":
          if (file.fieldId) {
            setIsLoading(true)
            const url = await downloadFile(file)
            const link = document.createElement("a")
            link.href = url
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setIsLoading(false)
          }
          break

        case "delete":
          if (window.confirm(`Are you sure you want to delete "${file.name}"?`)) {
            setIsLoading(true)
            if (file.fieldId) {
              await storage.deleteFile(process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!, file.fieldId)
            }
            await databases.deleteDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
              file.$id,
            )
            const updatedFiles = files.filter((f) => f.$id !== file.$id)
            setFiles(updatedFiles)
            setIsLoading(false)
          }
          break
      }
    } catch (error) {
      console.error("Error performing file action:", error)
      setIsLoading(false)
    }
  }

  const handleAppointmentDelete = async (apt: AppointmentDocument) => {
    if (window.confirm(`Are you sure you want to delete the appointment with Dr. ${apt.doctor}?`)) {
      try {
        setIsLoading(true)
        await databases.deleteDocument(
          process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
          process.env.NEXT_PUBLIC_APPWRITE_APPOINTMENTS_COLLECTION_ID!,
          apt.$id,
        )
        const updatedAppointments = appointments.filter((a) => a.$id !== apt.$id)
        setAppointments(updatedAppointments)
      } catch (error) {
        console.error("Error deleting appointment:", error)
        alert("Failed to delete appointment. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
    else return (bytes / 1048576).toFixed(2) + " MB"
  }

  const getTimeRemaining = (dateStr: string) => {
    const appointmentDate = new Date(dateStr)
    const now = new Date()
    const diffTime = appointmentDate.getTime() - now.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Tomorrow"
    if (diffDays < 7) return `${diffDays} days`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`
    return `${Math.floor(diffDays / 30)} months`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950 dark:to-emerald-950">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-teal-700 dark:text-teal-400 flex items-center gap-2">
              {greeting}, <span className="text-teal-600">{displayName}</span>
            </h1>
            <p className="text-teal-600 dark:text-teal-500 text-sm transition-opacity duration-500 flex items-center gap-2">
              <Bell size={14} className="text-teal-500" />
              {wellnessMessages[wellnessMessageIndex]}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-500" size={16} />
              <Input
                placeholder="Search files and folders..."
                className="pl-10 py-2 h-10 text-sm bg-white dark:bg-gray-800 border-teal-200 dark:border-teal-800 rounded-full focus-visible:ring-teal-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as "grid" | "list")} className="w-auto">
              <TabsList className="bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-800">
                <TabsTrigger value="grid" title="Grid view">
                  <Grid size={16} aria-label="Grid view" />
                </TabsTrigger>
                <TabsTrigger value="list" title="List view">
                  <List size={16} aria-label="List view" />
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="hidden md:flex items-center gap-2 text-sm text-teal-700 dark:text-teal-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full border border-teal-200 dark:border-teal-800">
              <Clock size={14} />
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Files & Folders */}
          <div className="lg:col-span-2 space-y-6">
            {/* Folders Section */}
            <Card className="overflow-hidden border-teal-200 dark:border-teal-800 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-teal-500/10 to-emerald-500/10 dark:from-teal-800/20 dark:to-emerald-800/20 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-teal-800 dark:text-teal-300 flex items-center gap-2">
                    <Folder className="h-5 w-5" /> Recent Folders
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div
                  className={`grid gap-3 ${
                    viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1"
                  }`}
                >
                  {folders.slice(0, 3).map((folder) => (
                    <div
                      key={folder.$id}
                      className="group flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-teal-100 dark:border-teal-900 hover:border-teal-300 dark:hover:border-teal-700 hover:shadow-md transition-all cursor-pointer"
                      onClick={() => handleFileAction(folder, "open")}
                    >
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-teal-100 dark:bg-teal-900 flex items-center justify-center">
                        <Folder className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{folder.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Folder</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileAction(folder, "open")
                            }}
                          >
                            <Folder className="h-4 w-4 mr-2" />
                            Open
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleFileAction(folder, "delete")
                            }}
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
                {folders.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <p>No folders found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-teal-500/5 to-emerald-500/5 dark:from-teal-900/10 dark:to-emerald-900/10 py-2 px-4 border-t border-teal-100 dark:border-teal-900">
                <a href="/my-drive">
                  <Button variant="ghost" size="sm" className="ml-auto text-teal-700 dark:text-teal-400 text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </CardFooter>
            </Card>

            {/* Files Section */}
            <Card className="overflow-hidden border-teal-200 dark:border-teal-800 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-800/20 dark:to-indigo-800/20 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-blue-800 dark:text-blue-300 flex items-center gap-2">
                    <FileText className="h-5 w-5" /> Recent Files
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"}`}>
                  {recentFiles.map((file) => (
                    <Card
                      key={file.$id}
                      className="group overflow-hidden border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
                    >
                      <CardHeader className="p-3 bg-white dark:bg-gray-800 flex flex-row items-center space-y-0 gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                          {getFileIcon(file)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200 truncate">{file.name}</h4>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleFileAction(file, "open")}>
                              <FileText className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleFileAction(file, "download")}>
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600 dark:text-red-400"
                              onClick={() => handleFileAction(file, "delete")}
                            >
                              <Trash className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </CardHeader>

                      {viewMode === "grid" && file.mimeType?.startsWith("image/") && (
                        <div className="aspect-video relative overflow-hidden bg-gray-100 dark:bg-gray-800">
                          <img
                            src={getFilePreview(file)! || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}

                      {viewMode === "grid" && !file.mimeType?.startsWith("image/") && (
                        <div className="aspect-video flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                          <FileText size={48} className="text-gray-400" />
                        </div>
                      )}

                      <CardFooter className="p-3 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between w-full text-xs text-gray-500 dark:text-gray-400">
                          <span>{file.size ? formatFileSize(file.size) : "Unknown size"}</span>
                          <span>{new Date(file.$createdAt).toLocaleDateString()}</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
                {recentFiles.length === 0 && (
                  <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                    <p>No files found</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-blue-500/5 to-indigo-500/5 dark:from-blue-900/10 dark:to-indigo-900/10 py-2 px-4 border-t border-blue-100 dark:border-blue-900">
                <a href="/my-drive">
                  <Button variant="ghost" size="sm" className="ml-auto text-blue-700 dark:text-blue-400 text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </CardFooter>
            </Card>
          </div>

          {/* Right Column - Appointments */}
          <div className="space-y-6">
            {/* User Stats Card */}
            <Card className="overflow-hidden border-teal-200 dark:border-teal-800 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-teal-200 dark:border-teal-700">
                    <AvatarImage src="/placeholder.svg" alt={displayName} />
                    <AvatarFallback className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300">
                      {displayName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200">{displayName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Health Profile</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge
                        variant="outline"
                        className="bg-teal-50 dark:bg-teal-900 text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-700"
                      >
                        {upcomingAppointments.length} Appointments
                      </Badge>
                      <Badge
                        variant="outline"
                        className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700"
                      >
                        {files.length} Files
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Appointments Section */}
            <Card className="overflow-hidden border-teal-200 dark:border-teal-800 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-800/20 dark:to-pink-800/20 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
                    <Calendar className="h-5 w-5" /> Upcoming Appointments
                  </CardTitle>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-purple-700 dark:text-purple-400">
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add Appointment</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {upcomingAppointments.map((apt) => (
                    <Card
                      key={apt.$id}
                      className="overflow-hidden border-l-4 border-l-purple-500 dark:border-l-purple-600 hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300">
                                  {apt.doctor.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-200">
                                  Dr. {apt.doctor}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <Badge
                                    variant="outline"
                                    className="text-[10px] px-1 py-0 h-4 bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-700"
                                  >
                                    {apt.speciality}
                                  </Badge>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(apt.date).toLocaleDateString()} at {apt.time}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">{apt.location}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <Badge className="bg-purple-100 hover:bg-purple-200 text-purple-700 border-none">
                              {getTimeRemaining(apt.date)}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    window.location.href = `/medkit?tab=appointments&edit=${apt.$id}`
                                  }}
                                >
                                  <Edit className="h-3.5 w-3.5 mr-2" />
                                  Edit
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => handleAppointmentDelete(apt)}
                                >
                                  <Trash className="h-3.5 w-3.5 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Calendar className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                      <p>No upcoming appointments</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Schedule Appointment
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-gradient-to-r from-purple-500/5 to-pink-500/5 dark:from-purple-900/10 dark:to-pink-900/10 py-2 px-4 border-t border-purple-100 dark:border-purple-900">
                <a href="/medkit?tab=appointments">
                  <Button variant="ghost" size="sm" className="ml-auto text-purple-700 dark:text-purple-400 text-xs">
                    View All <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </a>
              </CardFooter>
            </Card>

            {/* Health Tips Card */}
            <Card className="overflow-hidden border-teal-200 dark:border-teal-800 shadow-sm">
              <CardHeader className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 dark:from-emerald-800/20 dark:to-teal-800/20 py-4">
                <CardTitle className="text-lg font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
                  <Bell className="h-5 w-5" /> Health Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {wellnessMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        index === wellnessMessageIndex
                          ? "bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800"
                          : "bg-white dark:bg-gray-800"
                      }`}
                    >
                      <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black/10 dark:bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-lg flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Loading...</p>
          </div>
        </div>
      )}
    </div>
  )
}

