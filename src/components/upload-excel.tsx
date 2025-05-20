

"use client"

import React, { useState, useRef } from "react"
import axios from "@/lib/axios"
import { baseUrl } from '@/env'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileSpreadsheet, Upload, X } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Progress } from "@/components/ui/progress"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from '@/AuthContext'

interface UploadExcelProps {
  orgId?: string | number;
}

interface UploadResponse {
  successCount: number;
  failedCount: number;
}

export function UploadExcel({ orgId }: UploadExcelProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { user, token } = useAuth()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return
    const validMime = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!validMime.includes(selected.type)) {
      toast({ title: "Invalid file type", description: "Please upload an Excel file (.xls or .xlsx)", variant: "destructive" })
      return
    }
    setFile(selected)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); setIsDragging(false)
    const dropped = e.dataTransfer.files?.[0]
    if (!dropped) return
    const validMime = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ]
    if (!validMime.includes(dropped.type)) {
      toast({ title: "Invalid file type", description: "Please upload an Excel file (.xls or .xlsx)", variant: "destructive" })
      return
    }
    setFile(dropped)
  }

  const handleUpload = async () => {
    if (!file || !user || !token) return
    setIsUploading(true)
    setUploadProgress(0)

    const form = new FormData()
    form.append("file", file)

    try {
      // Use the organizational ID from props or fall back to the user's ID
      const organizationId = orgId || user.id
      
      const response = await axios.post<UploadResponse>(
        `${baseUrl}/api/organization/upload/${organizationId}`,
        form,
        {
          headers: { 
            "Content-Type": "multipart/form-data", 
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`
          },
          onUploadProgress: (event: any) => {
            const percent = Math.round((event.loaded * 100) / (event.total || 1))
            setUploadProgress(percent)
          },
        }
      )

      const data = response.data
      toast({
        title: "Upload complete",
        description: `Imported ${data.successCount} users, ${data.failedCount} failed.`,
      })
    } catch (error: any) {
      console.error(error)
      toast({ 
        title: "Upload failed", 
        description: error.response?.data?.message || error.message, 
        variant: "destructive" 
      })
    } finally {
      setIsUploading(false)
      setFile(null)
      setUploadProgress(0)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the parent div's onClick
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card>
        <CardHeader>
          <CardTitle>Upload User Data</CardTitle>
          <CardDescription>Bulk import users via Excel</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-10 text-center transition-colors ${
              isDragging
                ? "border-primary bg-primary/5"
                : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
              <FileSpreadsheet className="h-12 w-12 text-primary mb-4" />
            </motion.div>

            <AnimatePresence mode="wait">
              {file ? (
                <motion.div key="file-info" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4 w-full">
                  <div className="flex items-center justify-between bg-muted/50 p-3 rounded-md">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-primary" />
                      <div className="text-left">
                        <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile} disabled={isUploading}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {isUploading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full space-y-2">
                      <Progress value={uploadProgress} className="w-full h-2" />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Uploading...</span><span>{uploadProgress}%</span>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div key="upload-prompt" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <p className="text-sm font-medium mb-1">Drag & drop or click to browse</p>
                  <p className="text-xs text-muted-foreground mb-4">.xls, .xlsx only</p>
                  <input ref={fileInputRef} type="file" accept=".xls,.xlsx" className="sr-only" onChange={handleFileChange} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.5 }} className="bg-muted/50 p-4 rounded-md">
            <h4 className="text-sm font-medium mb-2">Requirements:</h4>
            <ul className="text-sm text-muted-foreground space-y-1 ml-5 list-disc">
              <li>.xls or .xlsx</li>
              {/* <li>Columns: firstName, lastName, emailAddress</li> */}
              <li>Columns: <code>firstName</code>, <code>lastName</code>, <code>emailAddress</code></li>
              <li>Max size: 5MB</li>
              <li>Max 1000 users</li>
            </ul>
            <div className="mt-4 text-sm">
              {/* <a href="/template.xlsx" className="text-primary hover:underline">Download template</a> */}
                   <a href="/template.xlsx" className="text-primary hover:underline">Download template (firstName, lastName, emailAddress)</a>
            </div>
          </motion.div>
        </CardContent>

        <CardFooter>
          <Button onClick={handleUpload} disabled={!file || isUploading || !token} className="w-full">
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-primary-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload and Process
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  )
}