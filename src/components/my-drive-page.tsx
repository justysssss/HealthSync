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
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { listFiles, type FileDocument, storage, databases, downloadFile } from "@/lib/appwrite"

export function MyDrivePage() {
  const [files, setFiles] = useState<FileDocument[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentFolder, setCurrentFolder] = useState<string | null>(null)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [showRenameDialog, setShowRenameDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState<FileDocument | null>(null)
  const [newFileName, setNewFileName] = useState("")

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
          } else if (file.fieldId && !isLoading) {
            try {
              setIsLoading(true);
              const url = storage.getFileView(
                process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
                file.fieldId
              );
              window.open(url, '_blank');
            } catch (error) {
              console.error('Error opening file:', error);
              alert('Failed to open file. Please try again later.');
            } finally {
              setIsLoading(false);
            }
          }
          break;

        case 'download':
          if (file.fieldId) {
            try {
              setIsLoading(true);
              const url = await downloadFile(file);
              const link = document.createElement('a');
              link.href = url;
              link.download = file.name;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            } catch (error) {
              console.error('Error downloading file:', error);
              alert('Failed to download file. Please try again later.');
            } finally {
              setIsLoading(false);
            }
          }
          break;

        case 'rename':
          setSelectedFile(file);
          setNewFileName(file.name);
          setShowRenameDialog(true);
          break;

        case 'delete':
          setSelectedFile(file);
          setShowDeleteDialog(true);
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
    if (!file.fieldId) return null;
    if (file.mimeType?.startsWith('image/')) {
      return storage.getFilePreview(
        process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
        file.fieldId
      );
    }
    return null;
  }

  const renderFilePreview = (file: FileDocument) => {
    if (!file.fieldId || file.type === 'folder') return null
    if (file.mimeType?.startsWith('image/')) {
      return (
        <div className="relative w-full h-full">
          <img
            src={getPreviewUrl(file)!}
            alt={file.name}
            className="absolute inset-0 w-full h-full object-contain"
          />
        </div>
      )
    }
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400">
        <FileText size={32} />
      </div>
    )
  }

  const renderFileItem = (file: FileDocument) => {
    const isFolder = file.type === "folder"

    return (
      <Card
        key={file.$id}
        className={`group overflow-hidden hover:shadow-md transition-shadow relative ${isFolder ? "border-teal-100 dark:border-teal-800" : ""
          }`}
      >
        <CardContent className="p-0">
          {/* Header */}
          <div className={`flex items-center justify-between p-2 ${isFolder ? "bg-teal-50/70 dark:bg-teal-900/30" : "bg-gray-50 dark:bg-gray-800"
            } border-b`}>
            <button
              className="flex items-center gap-2 flex-1 min-w-0 hover:bg-gray-100/70 dark:hover:bg-gray-700/70 p-1 rounded-md transition-colors"
              onClick={() => handleFileAction(file, 'open')}
            >
              <div className={`p-1 rounded ${isFolder
                  ? "bg-teal-100 text-teal-600 dark:bg-teal-800 dark:text-teal-300"
                  : "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                }`}>
                {getFileIcon(file)}
              </div>
              <span className="font-medium text-sm truncate">{file.name}</span>
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0"
                >
                  <MoreVertical className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {isFolder ? (
                  <DropdownMenuItem
                    onClick={() => handleFileAction(file, 'open')}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Folder className="h-4 w-4 mr-2" />
                    )}
                    Open
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleFileAction(file, 'open')}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <FileText className="h-4 w-4 mr-2" />
                      )}
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleFileAction(file, 'download')}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="h-4 w-4 mr-2" />
                      )}
                      Download
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuItem
                  onClick={(e) => handleFileAction(file, 'rename', e)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Edit className="h-4 w-4 mr-2" />
                  )}
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600"
                  onClick={(e) => handleFileAction(file, 'delete', e)}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash className="h-4 w-4 mr-2" />
                  )}
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content area with file details and preview */}
          <div className={`${isFolder ? "p-1" : "p-3"}`}>
            {!isFolder && file.size && (
              <div className="text-xs text-gray-500">
                <p>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            )}

            {viewMode === 'grid' && !isFolder && (
              <div className="mt-2 aspect-video relative overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                {renderFilePreview(file)}
              </div>
            )}
          </div>
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
              <div className={`grid gap-3 ${viewMode === 'grid'
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
              <div className={`grid gap-4 ${viewMode === 'grid'
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

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Item</DialogTitle>
          </DialogHeader>
          <Input
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            placeholder="Enter new name"
          />
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowRenameDialog(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={!newFileName || newFileName === selectedFile?.name || isLoading}
              onClick={async () => {
                if (!selectedFile || !newFileName) return;
                try {
                  setIsLoading(true);
                  await databases.updateDocument(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
                    selectedFile.$id,
                    { name: newFileName }
                  );
                  await loadFiles();
                  setShowRenameDialog(false);
                } catch (error) {
                  console.error('Error renaming file:', error);
                  alert('Failed to rename file. Please try again later.');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Rename'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{selectedFile?.name}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              onClick={async () => {
                if (!selectedFile) return;
                try {
                  setIsLoading(true);
                  if (selectedFile.fieldId) {
                    await storage.deleteFile(
                      process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
                      selectedFile.fieldId
                    );
                  }
                  await databases.deleteDocument(
                    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
                    process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
                    selectedFile.$id
                  );
                  await loadFiles();
                  setShowDeleteDialog(false);
                } catch (error) {
                  console.error('Error deleting file:', error);
                  alert('Failed to delete item. Please try again later.');
                } finally {
                  setIsLoading(false);
                }
              }}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}