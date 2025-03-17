"use client"

import { useState } from "react"
import { Download, Maximize2, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PDFViewerProps {
  fileUrl: string
  fileName: string
  thumbnail?: boolean
}

export function PDFViewer({ fileUrl, fileName, thumbnail = false }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // This is a placeholder for actual PDF rendering
  // In a real app, you would use a library like react-pdf or pdfjs-dist

  if (thumbnail) {
    return (
      <div className="relative w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <FileText className="h-10 w-10 text-red-500 absolute" />
        <img src={fileUrl || "/placeholder.svg"} alt={fileName} className="w-full h-full object-cover opacity-10" />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-xs text-white truncate">{fileName}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-red-500" />
          <span className="font-medium truncate max-w-[200px]">{fileName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Download className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative bg-white dark:bg-gray-900 aspect-[4/3] flex items-center justify-center">
        <FileText className="h-16 w-16 text-red-500 absolute" />
        <img
          src={fileUrl || "/placeholder.svg"}
          alt={`PDF preview of ${fileName}`}
          className="max-w-full max-h-full object-contain opacity-10"
        />
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-2 flex items-center justify-between">
        <Button variant="ghost" size="sm" disabled={currentPage <= 1}>
          <ChevronLeft className="h-4 w-4 mr-1" />
          Previous
        </Button>

        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button variant="ghost" size="sm" disabled={currentPage >= totalPages}>
          Next
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

