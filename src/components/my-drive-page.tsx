"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Grid,
  List,
  FileText,
  Folder,
  Loader2,
  MoreVertical,
  Download,
  Edit,
  Trash,
  ChevronLeft,
  Image as ImageIcon
} from "lucide-react"
import { CreateFileDialog } from "@/components/create-file-dialog"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusButton } from "@/components/ui/plus-button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listFiles, type FileDocument, storage, databases } from "@/lib/appwrite"

export function MyDrivePage() {
  const [files, setFiles] = useState<FileDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  
  const loadFiles = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const documents = await listFiles()
      setFiles(documents)
    } catch (err) {
      setError('Failed to load files')
      console.error('Error loading files:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFiles()
  }, [])

  const handleFileAction = async (file: FileDocument, action: string, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation()
    }

    try {
      switch (action) {
        case 'open':
          if (file.type === 'folder') {
            setCurrentFolder(file.$id)
          } else if (file.storageId) {
            window.open(`https://cloud.appwrite.io/v1/storage/files/${file.storageId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`)
          }
          break;

        case 'download':
          if (file.storageId) {
            const link = document.createElement('a')
            link.href = `https://cloud.appwrite.io/v1/storage/files/${file.storageId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
            link.download = file.name
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
          break;

        case 'rename':
          const newName = window.prompt('Enter new name', file.name)
          if (newName && newName !== file.name) {
            await databases.updateDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
              file.$id,
              { name: newName }
            )
            loadFiles()
          }
          break;

        case 'delete':
          if (window.confirm('Are you sure you want to delete this item?')) {
            await databases.deleteDocument(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
              file.$id
            )
            if (file.storageId) {
              await storage.deleteFile(
                process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
                file.storageId
              )
            }
            loadFiles()
          }
          break;
      }
    } catch (error) {
      console.error('Error performing file action:', error)
      // You might want to show an error message to the user here
    }
  }

  const getFileIcon = (file: FileDocument) => {
    if (file.type === 'folder') return <Folder size={20} />
    if (file.mimeType?.startsWith('image/')) return <ImageIcon size={20} />
    return <FileText size={20} />
  }

  const getPreviewUrl = (file: FileDocument) => {
    if (!file.storageId) return null
    if (file.mimeType?.startsWith('image/')) {
      return `https://cloud.appwrite.io/v1/storage/files/${file.storageId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    }
    return null
  }

  const renderFilePreview = (file: FileDocument) => {
    if (!file.storageId || file.type === 'folder') return null
    if (file.mimeType?.startsWith('image/')) {
      return (
        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800">
          <img
            src={getPreviewUrl(file)!}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        </div>
      )
    }
    return null
  }

  const renderFileItem = (file: FileDocument) => {
    const isFolder = file.type === "folder"
    
    return (
      <Card 
        key={file.$id} 
        className="group overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative h-auto"
        onClick={() => handleFileAction(file, 'open')}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <div className={`p-2 rounded ${isFolder ? "bg-teal-100 text-teal-600" : "bg-red-100 text-red-600"}`}>
                {getFileIcon(file)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm truncate">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
                {file.size && (
                  <p className="text-xs text-gray-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                )}
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                <button 
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded"
                  title="More options"
                  aria-label="More options"
                >
                  <MoreVertical className="h-5 w-5 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isFolder ? (
                  <DropdownMenuItem onClick={() => handleFileAction(file, 'open')}>
                    <Folder className="h-4 w-4 mr-2" />
                    Open
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => handleFileAction(file, 'open')}>
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleFileAction(file, 'download')}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); console.log('rename') }}>
                  <Edit className="h-4 w-4 mr-2" />
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-red-600"
                  onClick={(e) => { e.stopPropagation(); console.log('delete') }}
                >
                  <Trash className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {viewMode === 'grid' && renderFilePreview(file)}
        </CardContent>
      </Card>
    )
  }

  // Separate files and folders
  const folders = files.filter(file => file.type === 'folder' && file.parentId === currentFolder)
  const nonFolders = files.filter(file => file.type === 'file' && file.parentId === currentFolder)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentFolder && (
            <button
              onClick={() => setCurrentFolder(null)}
              className="p-1 hover:bg-gray-100 rounded"
              title="Go back"
              aria-label="Go back to parent folder"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          <h1 className="text-2xl font-semibold text-teal-700 dark:text-teal-400">
            {currentFolder ? folders.find(f => f.$id === currentFolder)?.name || 'My Drive' : 'My Drive'}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search files and folders..."
              className="pl-10 bg-white dark:bg-gray-800 border-teal-100 dark:border-gray-700"
            />
          </div>
          
          <Tabs value={viewMode} onValueChange={value => setViewMode(value as 'grid' | 'list')} className="w-auto">
            <TabsList className="bg-white dark:bg-gray-800">
              <TabsTrigger value="grid" title="Grid view">
                <Grid size={16} aria-label="Grid view" />
              </TabsTrigger>
              <TabsTrigger value="list" title="List view">
                <List size={16} aria-label="List view" />
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        </div>
      )}

      {error && (
        <div className="text-center text-red-500 py-4">
          {error}
        </div>
      )}

      {!isLoading && !error && (
        <>
          {folders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Folders</h2>
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {folders.map(renderFileItem)}
              </div>
            </div>
          )}

          {nonFolders.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Files</h2>
              <div className={`grid gap-4 ${
                viewMode === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                  : 'grid-cols-1'
              }`}>
                {nonFolders.map(renderFileItem)}
              </div>
            </div>
          )}
        </>
      )}

      <PlusButton onClick={() => setShowCreateDialog(true)} />
      
      <CreateFileDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSuccess={loadFiles}
        mode="drive"
      />
    </div>
  )
}
