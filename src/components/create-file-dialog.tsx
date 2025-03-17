"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FolderPlus, Upload } from "lucide-react"
import { uploadFile, createFolder } from "@/lib/appwrite"

interface CreateFileDialogProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  mode?: "default" | "drive"
  currentFolder?: string | null
}

export function CreateFileDialog({ isOpen, onClose, onSuccess, mode = "default", currentFolder }: CreateFileDialogProps) {
  const [activeTab, setActiveTab] = useState<'folder' | 'file'>(mode === "drive" ? 'folder' : 'file')
  const [isLoading, setIsLoading] = useState(false)
  const [folderName, setFolderName] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState<string>("file-input-1") // Add key for input reset
  const handleCreateFolder = async () => {
    if (!folderName) return
    setIsLoading(true)
    try {
      await createFolder(folderName, currentFolder)
      onSuccess()
      onClose()
      setFolderName("")
    } catch (error) {
      console.error("Error creating folder:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile) return
    setIsLoading(true)
    try {
      await uploadFile(selectedFile, currentFolder || null)
      onSuccess()
      onClose()
      setSelectedFile(null)
      // Reset the file input by changing its key
      setFileInputKey(`file-input-${Date.now()}`)
    } catch (error) {
      console.error("Error uploading file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setFolderName("")
    setSelectedFile(null)
    setFileInputKey(`file-input-${Date.now()}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
        </DialogHeader>

        {mode === "drive" && (
          <div className="grid grid-cols-2 gap-2 mb-6">
            <Button
              variant={activeTab === 'folder' ? 'default' : 'outline'}
              onClick={() => setActiveTab('folder')}
            >
              Folder
            </Button>
            <Button
              variant={activeTab === 'file' ? 'default' : 'outline'}
              onClick={() => setActiveTab('file')}
            >
              File
            </Button>
          </div>
        )}

        {(mode === "drive" ? activeTab === 'folder' : false) ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="folder-name">Folder Name</Label>
              <Input
                id="folder-name"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
            <Button
              className="w-full bg-emerald-500 hover:bg-emerald-600"
              onClick={handleCreateFolder}
              disabled={!folderName || isLoading}
            >
              <FolderPlus className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="file">Select File</Label>
              <Input
                key={fileInputKey} // Add key to force re-render
                id="file"
                type="file"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              />
            </div>
            <Button
              className={`w-full ${
                mode === "drive"
                  ? "bg-emerald-500 hover:bg-emerald-600"
                  : "bg-teal-600 hover:bg-teal-700"
              }`}
              onClick={handleFileUpload}
              disabled={!selectedFile || isLoading}
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload File
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}