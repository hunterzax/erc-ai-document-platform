"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, FileText, ImageIcon, X, CheckCircle, AlertCircle, Clock } from "lucide-react"
import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { AppHeader } from "@/components/header-bar"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  ocrAccuracy?: number
  extractedText?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [documentType, setDocumentType] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [documentCategory, setDocumentCategory] = useState("")
  const [description, setDescription] = useState("")

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Simulate upload and processing
    newFiles.forEach((file) => {
      simulateFileProcessing(file.id)
    })
  }, [])

  const simulateFileProcessing = (fileId: string) => {
    // Simulate upload progress
    const uploadInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "uploading") {
            const newProgress = Math.min(file.progress + Math.random() * 20, 100)
            if (newProgress >= 100) {
              clearInterval(uploadInterval)
              // Start OCR processing
              setTimeout(() => {
                setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "processing", progress: 0 } : f)))
                simulateOCRProcessing(fileId)
              }, 500)
              return { ...file, progress: 100, status: "processing" }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 200)
  }

  const simulateOCRProcessing = (fileId: string) => {
    const ocrInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((file) => {
          if (file.id === fileId && file.status === "processing") {
            const newProgress = Math.min(file.progress + Math.random() * 15, 100)
            if (newProgress >= 100) {
              clearInterval(ocrInterval)
              const accuracy = Math.floor(Math.random() * 10) + 90 // 90-99%
              return {
                ...file,
                progress: 100,
                status: "completed",
                ocrAccuracy: accuracy,
                extractedText: `ข้อความที่แยกได้จาก ${file.name} (ความแม่นยำ ${accuracy}%)`,
              }
            }
            return { ...file, progress: newProgress }
          }
          return file
        }),
      )
    }, 300)
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg", ".tiff"],
    },
    multiple: true,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "uploading":
        return "กำลังอัปโหลด..."
      case "processing":
        return "กำลังประมวลผล OCR..."
      case "completed":
        return "เสร็จสิ้น"
      case "error":
        return "เกิดข้อผิดพลาด"
      default:
        return ""
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'อัปโหลดเอกสาร'}/>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Area */}
            <Card>
              <CardHeader>
                <CardTitle>อัปโหลดเอกสาร</CardTitle>
                <CardDescription>รองรับไฟล์ PDF, Word, และรูปภาพ (PNG, JPG, TIFF)</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  {isDragActive ? (
                    <p className="text-lg font-medium">วางไฟล์ที่นี่...</p>
                  ) : (
                    <>
                      <p className="text-lg font-medium mb-2">ลากและวางไฟล์ที่นี่</p>
                      <p className="text-sm text-muted-foreground mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
                      <Button variant="outline">เลือกไฟล์</Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Metadata Form */}
            <Card>
              <CardHeader>
                <CardTitle>ข้อมูลเอกสาร</CardTitle>
                <CardDescription>กรอกข้อมูลเพิ่มเติมเพื่อช่วยในการจัดหมวดหมู่</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">ประเภทเอกสาร</Label>
                  <Select value={documentType} onValueChange={setDocumentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกประเภทเอกสาร" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="law">กฎหมาย</SelectItem>
                      <SelectItem value="regulation">ระเบียบ</SelectItem>
                      <SelectItem value="announcement">ประกาศ</SelectItem>
                      <SelectItem value="circular">หนังสือเวียน</SelectItem>
                      <SelectItem value="other">อื่นๆ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-year">ปี พ.ศ.</Label>
                  <Select value={documentYear} onValueChange={setDocumentYear}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกปี" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 10 }, (_, i) => 2567 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="document-category">หมวดหมู่</Label>
                  <Select value={documentCategory} onValueChange={setDocumentCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="เลือกหมวดหมู่" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procurement">การจัดซื้อจัดจ้าง</SelectItem>
                      <SelectItem value="finance">การเงินการคลัง</SelectItem>
                      <SelectItem value="personnel">บุคลากร</SelectItem>
                      <SelectItem value="information">ข้อมูลข่าวสาร</SelectItem>
                      <SelectItem value="intellectual">ทรัพย์สินทางปัญญา</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">คำอธิบาย (ไม่บังคับ)</Label>
                  <Textarea
                    id="description"
                    placeholder="เพิ่มคำอธิบายเกี่ยวกับเอกสาร..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Uploaded Files List */}
          {files.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>ไฟล์ที่อัปโหลด</CardTitle>
                <CardDescription>ติดตามสถานะการประมวลผลเอกสาร</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {files.map((file) => (
                    <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="flex-shrink-0">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-8 w-8 text-blue-500" />
                        ) : (
                          <FileText className="h-8 w-8 text-blue-500" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium truncate">{file.name}</p>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(file.status)}
                            <span className="text-xs text-muted-foreground">{getStatusText(file.status)}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(file.id)}
                              className="h-6 w-6 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                          <span>{formatFileSize(file.size)}</span>
                          {file.ocrAccuracy && <Badge variant="secondary">ความแม่นยำ: {file.ocrAccuracy}%</Badge>}
                        </div>

                        <Progress value={file.progress} className="h-2" />

                        {file.extractedText && (
                          <div className="mt-2 p-2 bg-muted rounded text-xs">
                            <p className="font-medium mb-1">ข้อความที่แยกได้:</p>
                            <p className="text-muted-foreground">{file.extractedText}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
