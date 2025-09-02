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
import { Input } from "@/components/ui/input"
import { Upload, FileText, ImageIcon, X, CheckCircle, AlertCircle, Clock, Download, Copy, Search, Table, FormInput, Eye, FileDigit, Settings } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { useToast } from "@/hooks/use-toast"
import { AppHeader } from "@/components/header-bar"
import PdfViewer from "@/components/ui/pdfviewer"
import axios from "axios"
const tokenURL = process.env.NEXT_PUBLIC_N8N_BASE_URL;

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  ocrAccuracy?: number
  extractedText?: string
  fileUrl?: string
  ocrResult?: any
  extractionResults?: any
  dimensions?: {
    width: number
    height: number
    aspectRatio: number
  }
}

interface ExtractionParams {
  model: string
  task_type: string
  max_tokens: number
  temperature: number
  top_p: number
  repetition_penalty: number
  pages: (number | null)[]
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [documentType, setDocumentType] = useState("")
  const [documentYear, setDocumentYear] = useState("")
  const [documentCategory, setDocumentCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null)
  const [extractionType, setExtractionType] = useState("all")
  const [isExtracting, setIsExtracting] = useState(false)
  const [showAdvancedParams, setShowAdvancedParams] = useState(false)
  const [extractionParams, setExtractionParams] = useState<ExtractionParams>({
    model: "typhoon-ocr-preview",
    task_type: "default",
    max_tokens: 16000,
    temperature: 0.1,
    top_p: 0.6,
    repetition_penalty: 1.2,
    pages: []
  })
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])

    // Process each file
    for (const file of newFiles) {
      await processFile(file, acceptedFiles.find(f => f.name === file.name)!)
    }
  }, [])

  const processFile = async (file: UploadedFile, originalFile: File) => {
    try {

      setisLoading(true);

      console.log(">>> file", file)
      console.log(">>> originalFile", originalFile)

      let data = new FormData();
      data.append('file', originalFile);
      data.append('tags', 'กฏหมาย,กฏหมายพลังงาน');

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${tokenURL}/upload_pdf`,
        headers: {
          "content-type": "multipart/form-data",
        },
        data: data
      };

      const postOCR = await axios.request(config);
      if (postOCR?.status == 200) {
        // const newFile: any = {
        //   status: "completed",
        //   progress: 100,
        //   ocrResult: result.data.ocrResult,
        //   extractedText: result.data.ocrResult?.text || 'ไม่สามารถแยกข้อความได้',
        //   fileUrl: URL.createObjectURL(originalFile),
        //   dimensions: dimensions,
        //   size: file?.size,
        //   name: file?.name,
        //   type: file?.type
        // }

        console.log(">>> postOCR", postOCR)
        setTimeout(() => {
          getOCR(`${postOCR?.data?.pdf_name}.pdf`)
          setisLoading(false);
        }, 100);
      }

      // // Create FormData for upload
      // const formData = new FormData()
      // formData.append('file', originalFile)

      // // Upload to our API
      // const response = await fetch('/api/upload', {
      //   method: 'POST',
      //   body: formData,
      // })

      // if (!response.ok) {
      //   throw new Error('Upload failed')
      // }

      // const result = await response.json()

      // console.log(">>> result", result)

      // // Get image dimensions if it's an image file
      // let dimensions: { width: number, height: number, aspectRatio: number } | undefined
      // if (originalFile.type.startsWith('image/')) {
      //   dimensions = await getImageDimensions(originalFile)
      // }

      // const newFile: any = {
      //   id: file?.id,
      //   status: "completed",
      //   progress: 100,
      //   ocrResult: result.data.ocrResult,
      //   extractedText: result.data.ocrResult?.text || 'ไม่สามารถแยกข้อความได้',
      //   fileUrl: URL.createObjectURL(originalFile),
      //   dimensions: dimensions,
      //   size: file?.size,
      //   name: file?.name,
      //   type: file?.type
      // }
      // // Update file status to completed
      // setFiles((prev) =>
      //   prev.map((f) =>
      //     f.id === file.id
      //       ? {
      //         ...f,
      //         status: "completed",
      //         progress: 100,
      //         ocrResult: result.data.ocrResult,
      //         extractedText: result.data.ocrResult?.text || 'ไม่สามารถแยกข้อความได้',
      //         fileUrl: URL.createObjectURL(originalFile),
      //         dimensions: dimensions
      //       }
      //       : f
      //   )
      // )

      // setSelectedFile(newFile);

      // toast({
      //   title: "อัพโหลดสำเร็จ",
      //   description: `ไฟล์ ${file.name} ถูกอัพโหลดและประมวลผล OCR เรียบร้อยแล้ว`,
      // })

      // getOCR();
    } catch (error) {
      // console.error('Error processing file:', error)
      // setFiles((prev) =>
      //   prev.map((f) =>
      //     f.id === file.id
      //       ? { ...f, status: "error", progress: 0 }
      //       : f
      //   )
      // )

      // toast({
      //   title: "เกิดข้อผิดพลาด",
      //   description: `ไม่สามารถประมวลผลไฟล์ ${file.name} ได้`,
      //   variant: "destructive",
      // })
    }
  }

  // ฟังก์ชันหาขนาดภาพบน client-side
  const getImageDimensions = (file: File): Promise<{ width: number, height: number, aspectRatio: number }> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.onload = () => {
        const dimensions = {
          width: img.width,
          height: img.height,
          aspectRatio: img.width / img.height
        }
        resolve(dimensions)
      }
      img.onerror = () => {
        resolve({ width: 0, height: 0, aspectRatio: 0 })
      }
      img.src = URL.createObjectURL(file)
    })
  }

  const extractAdvancedData = async (file: UploadedFile) => {
    if (!file.fileUrl) return

    setIsExtracting(true)
    try {
      // Convert fileUrl back to File object
      const response = await fetch(file.fileUrl)
      const blob = await response.blob()
      const fileObj = new File([blob], file.name, { type: file.type })

      const formData = new FormData()
      formData.append('file', fileObj)
      formData.append('type', extractionType)

      // เพิ่ม parameters สำหรับการสกัดข้อมูล
      if (showAdvancedParams) {
        formData.append('params', JSON.stringify(extractionParams))
      }

      const extractResponse = await fetch('/api/extract', {
        method: 'POST',
        body: formData,
      })

      if (!extractResponse.ok) {
        throw new Error('Extraction failed')
      }

      const result = await extractResponse.json()

      // Update file with extraction results
      setFiles((prev) =>
        prev.map((f) =>
          f.id === file.id
            ? { ...f, extractionResults: result.data.results }
            : f
        )
      )

      setSelectedFile(prev => prev ? { ...prev, extractionResults: result.data.results } : null)

      toast({
        title: "การสกัดข้อมูลสำเร็จ",
        description: `สกัดข้อมูลจาก ${file.name} เรียบร้อยแล้ว`,
      })

    } catch (error) {
      console.error('Extraction error:', error)
      toast({
        title: "เกิดข้อผิดพลาด",
        description: `ไม่สามารถสกัดข้อมูลจาก ${file.name} ได้`,
        variant: "destructive",
      })
    } finally {
      setIsExtracting(false)
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((file) => file.id !== fileId))
    if (selectedFile?.id === fileId) {
      setSelectedFile(null)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "คัดลอกแล้ว",
        description: "ข้อความถูกคัดลอกไปยังคลิปบอร์ดแล้ว",
      })
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถคัดลอกข้อความได้",
        variant: "destructive",
      })
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "image/*": [".png", ".jpg", ".jpeg", ".tiff"],
    },
    multiple: false,
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

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4 text-blue-500" />
    } else if (fileType === "application/pdf") {
      return <FileDigit className="h-4 w-4 text-red-500" />
    } else {
      return <FileText className="h-4 w-4 text-blue-500" />
    }
  }

  const [isLoading, setisLoading] = useState<boolean>(true);

  const getOCR = async (filename: any) => {
    try {
      const getData = await axios.get(`${tokenURL}/qdrant/file_name/docs_section_single/${filename}`);

      console.log(">>> getData", getData);
    } catch (error: any) {
      // ❌ กรณีเกิดข้อผิดพลาด
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // console.error("❌ Server error:", error.response.status);
        } else if (error.request) {
          // console.error("❌ Network error: No response received.");
        } else {
          // console.error("❌ Axios config error:", error.message);
        }
      } else {
        // console.error("❌ Unexpected error:", error);
      }

      // setdataList([]);
      // setisLoading(false);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'อัปโหลดเอกสาร'} />

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* 2x2 Grid Layout */}
          <div className="grid grid-cols-4 gap-6 h-[600px]">

            {/* Top-Left: Drop files here + Progress */}
            <Card className="flex flex-col-2 col-span-3">
              <CardHeader>
                <CardTitle>อัปโหลดเอกสาร</CardTitle>
                <CardDescription>รองรับไฟล์ PDF, Word, และรูปภาพ</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div
                  {...getRootProps()}
                  className={`border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex-1 flex flex-col items-center justify-center hover:bg-blue-200/30 ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
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
                      <Button variant="outline" className="w-fit">เลือกไฟล์</Button>
                    </>
                  )}

                  {/* Progress Bar Inside Drop Zone */}
                  {files?.length > 0 && (
                    <div className="mt-6 w-full">
                      <Label className="text-sm font-medium mb-2 block text-left">Progress Upload</Label>
                      {files.map((file) => (
                        <div key={file.id} className="mb-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="truncate">{file.name}</span>
                            <span className="text-muted-foreground">{file.progress}%</span>
                          </div>
                          <Progress value={file.progress} className="h-2" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Top-Right: Document Detail */}
            <Card className="flex flex-col col-span-1">
              <CardHeader>
                <CardTitle>Document Detail</CardTitle>
                <CardDescription>ข้อมูลเอกสาร</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="document-type">ประเภทเอกสาร</Label>
                  <Select value={documentType} onValueChange={setDocumentType} disabled={selectedFile ? false : true}>
                    <SelectTrigger className="w-full border border-[#dedede]">
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
                  <Select value={documentYear} onValueChange={setDocumentYear} disabled={selectedFile ? false : true}>
                    <SelectTrigger className="w-full border border-[#dedede]">
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
                  <Select value={documentCategory} onValueChange={setDocumentCategory} disabled={selectedFile ? false : true}>
                    <SelectTrigger className="w-full border border-[#dedede]">
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
                    className="flex-1 w-full border border-[#dedede]"
                    disabled={selectedFile ? false : true}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Bottom-Left: Picture Display */}
            <Card className="flex flex-col col-span-2">
              <CardHeader>
                <CardTitle>Picture</CardTitle>
                <CardDescription>ภาพที่อัพโหลด</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="overflow-y-auto max-h-screen custom-scroll">
                  <PdfViewer pdfUrl={selectedFile ? selectedFile.fileUrl : ''} />
                </div>
                {/* {selectedFile && selectedFile.fileUrl && selectedFile.type.startsWith("image/") ? (
                  <div className="flex-1 flex items-center justify-center">
                    <img
                      src={selectedFile.fileUrl}
                      alt={selectedFile.name}
                      className="max-w-full max-h-full object-contain rounded-lg border"
                    />
                  </div>
                ) : selectedFile && selectedFile.fileUrl && selectedFile.type === "application/pdf" ? (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <FileDigit className="mx-auto h-16 w-16 mb-4 text-red-500" />
                      <p className="font-medium">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground">ไฟล์ PDF</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p>เลือกไฟล์เพื่อดูภาพ</p>
                    </div>
                  </div>
                )} */}

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4">
                    <Label className="text-sm font-medium mb-2 block">ไฟล์ที่อัพโหลด</Label>
                    <div className="space-y-2 max-h-32 overflow-y-auto">
                      {files.map((file) => (
                        <div
                          key={file.id}
                          className={`flex items-center gap-2 p-2 border rounded cursor-pointer transition-colors ${selectedFile?.id === file.id
                            ? "border-primary bg-primary/5"
                            : "border-muted-foreground/25 hover:border-primary/25"
                            }`}
                          onClick={() => setSelectedFile(file)}
                        >
                          {getFileIcon(file.type)}
                          <span className="text-xs truncate flex-1">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeFile(file.id)
                            }}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bottom-Right: OCR Detail + Advanced Extraction */}
            <Card className="flex flex-col col-span-2">
              <CardHeader>
                <CardTitle>OCR Detail</CardTitle>
                <CardDescription>
                  {selectedFile
                    ? `ผลลัพธ์จาก: ${selectedFile.name}`
                    : "เลือกไฟล์เพื่อดูผลลัพธ์ OCR"
                  }
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                {selectedFile ? (
                  <div className="flex-1 flex flex-col space-y-4">
                    {/* Advanced Extraction Controls */}
                    {(selectedFile.type.startsWith("image/") || selectedFile.type === "application/pdf") && (
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium">การสกัดข้อมูลขั้นสูง</Label>

                          {/* ปิดไว้ก่อน */}
                          {/* <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowAdvancedParams(!showAdvancedParams)}
                            className="h-6 px-2"
                          >
                            <Settings className="h-3 w-3 mr-1" />
                            {showAdvancedParams ? "ซ่อน" : "ตั้งค่า"}
                          </Button> */}
                        </div>

                        <div className="flex gap-2 h-full">
                          <Select value={extractionType} onValueChange={setExtractionType}>
                            <SelectTrigger className="w-40 border border-[#dedede]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">ทั้งหมด</SelectItem>
                              <SelectItem value="text">ข้อความ</SelectItem>
                              <SelectItem value="tables">ตาราง</SelectItem>
                              <SelectItem value="forms">ฟอร์ม</SelectItem>
                              <SelectItem value="objects">Object</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => extractAdvancedData(selectedFile)}
                            disabled={isExtracting}
                            className="flex-1 h-[36px] p-2"
                          >
                            {isExtracting ? (
                              <Clock className="h-3 w-3 mr-1 animate-spin" />
                            ) : (
                              <Search className="h-3 w-3 mr-1" />
                            )}
                            {isExtracting ? "กำลังสกัด..." : "สกัดข้อมูล"}
                          </Button>
                        </div>

                        {/* Advanced Parameters */}
                        {showAdvancedParams && (
                          <div className="space-y-2 p-3 border rounded-lg bg-muted/30">
                            <Label className="text-xs font-medium">พารามิเตอร์ขั้นสูง</Label>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              <div>
                                <Label className="text-xs">Model</Label>
                                <Input
                                  value={extractionParams.model}
                                  onChange={(e) => setExtractionParams(prev => ({ ...prev, model: e.target.value }))}
                                  className="h-6 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Max Tokens</Label>
                                <Input
                                  type="number"
                                  value={extractionParams.max_tokens}
                                  onChange={(e) => setExtractionParams(prev => ({ ...prev, max_tokens: parseInt(e.target.value) }))}
                                  className="h-6 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Temperature</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={extractionParams.temperature}
                                  onChange={(e) => setExtractionParams(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                                  className="h-6 text-xs"
                                />
                              </div>
                              <div>
                                <Label className="text-xs">Top P</Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  value={extractionParams.top_p}
                                  onChange={(e) => setExtractionParams(prev => ({ ...prev, top_p: parseFloat(e.target.value) }))}
                                  className="h-6 text-xs"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OCR Results */}
                    {selectedFile.extractedText && (
                      <div className="flex-1 flex flex-col">
                        <div className="flex items-center justify-between mb-2">
                          <Label className="text-sm font-medium">ข้อความที่แยกได้</Label>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={selectedFile?.extractedText == 'ไม่สามารถแยกข้อความได้' ? true : false}
                              onClick={() => copyToClipboard(selectedFile.extractedText!)}
                            >
                              <Copy className="h-3 w-3 mr-1" />
                              คัดลอก
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const blob = new Blob([selectedFile.extractedText!], { type: 'text/plain' })
                                const url = URL.createObjectURL(blob)
                                const a = document.createElement('a')
                                a.href = url
                                a.download = `${selectedFile.name}_ocr.txt`
                                a.click()
                                URL.revokeObjectURL(url)
                              }}
                              disabled={selectedFile?.extractedText == 'ไม่สามารถแยกข้อความได้' ? true : false}
                            >
                              <Download className="h-3 w-3 mr-1" />
                              ดาวน์โหลด
                            </Button>
                          </div>
                        </div>
                        <div className="flex-1 border rounded-lg p-3 bg-muted/30 overflow-y-auto">
                          <pre className="whitespace-pre-wrap text-xs font-mono">
                            {selectedFile.extractedText}
                          </pre>
                        </div>
                      </div>
                    )}

                    {/* Advanced Extraction Results */}
                    {selectedFile.extractionResults && (
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">ผลการสกัดข้อมูลขั้นสูง</Label>

                        {/* Tables */}
                        {selectedFile.extractionResults.tables && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Table className="h-4 w-4 text-blue-500" />
                              <span className="text-xs font-medium">ตารางที่พบ: {selectedFile.extractionResults.tables.tableCount || 0}</span>
                            </div>
                            {selectedFile.extractionResults.tables.tables?.map((table: any, index: number) => (
                              <div key={index} className="text-xs p-2 bg-blue-50 rounded border">
                                <div className="font-medium">ตาราง {index + 1}</div>
                                <div className="text-muted-foreground">ประเภท: {table.type}</div>
                                <div className="text-muted-foreground">ความแม่นยำ: {Math.round(table.confidence * 100)}%</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Forms */}
                        {selectedFile.extractionResults.forms && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <FormInput className="h-4 w-4 text-green-500" />
                              <span className="text-xs font-medium">ฟอร์มที่พบ: {selectedFile.extractionResults.forms.formCount || 0}</span>
                            </div>
                            {selectedFile.extractionResults.forms.fields?.map((field: any, index: number) => (
                              <div key={index} className="text-xs p-2 bg-green-50 rounded border">
                                <div className="font-medium">{field.label}</div>
                                <div className="text-muted-foreground">{field.value}</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Objects */}
                        {selectedFile.extractionResults.objects && (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-purple-500" />
                              <span className="text-xs font-medium">Object ที่พบ: {selectedFile.extractionResults.objects.objectCount || 0}</span>
                            </div>
                            {selectedFile.extractionResults.objects.objects?.map((obj: any, index: number) => (
                              <div key={index} className="text-xs p-2 bg-purple-50 rounded border">
                                <div className="font-medium">{obj.type}</div>
                                <div className="text-muted-foreground">ความแม่นยำ: {Math.round(obj.confidence * 100)}%</div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Metadata */}
                        {selectedFile.extractionResults.metadata && (
                          <div className="space-y-2">
                            <Label className="text-xs font-medium">ข้อมูลเพิ่มเติม</Label>
                            <div className="text-xs p-2 bg-gray-50 rounded border">
                              <div>ขนาด: {selectedFile.extractionResults.metadata.dimensions?.width || 0} x {selectedFile.extractionResults.metadata.dimensions?.height || 0}</div>
                              <div>อัตราส่วน: {selectedFile.extractionResults.metadata.dimensions?.aspectRatio?.toFixed(2) || 0}</div>
                              {selectedFile.extractionResults.metadata.pageCount && (
                                <div>จำนวนหน้า: {selectedFile.extractionResults.metadata.pageCount}</div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* OCR Metadata */}
                    {selectedFile.ocrResult && (
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">ข้อมูลเพิ่มเติม</Label>
                        <div className="border rounded-lg p-3 bg-muted/30">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="font-medium">ภาษา:</span>
                              <span className="ml-1">{selectedFile.ocrResult.language || 'ไม่ระบุ'}</span>
                            </div>
                            <div>
                              <span className="font-medium">ความแม่นยำ:</span>
                              <span className="ml-1">{selectedFile.ocrResult.confidence || 'ไม่ระบุ'}</span>
                            </div>
                            <div>
                              <span className="font-medium">จำนวนคำ:</span>
                              <span className="ml-1">{selectedFile.extractedText?.split(/\s+/).length || 0}</span>
                            </div>
                            <div>
                              <span className="font-medium">ขนาดไฟล์:</span>
                              <span className="ml-1">{formatFileSize(selectedFile.size)}</span>
                            </div>
                            {/* แสดงขนาดภาพถ้ามี */}
                            {selectedFile.dimensions && selectedFile.dimensions.width > 0 && (
                              <>
                                <div>
                                  <span className="font-medium">ขนาดภาพ:</span>
                                  <span className="ml-1">{selectedFile.dimensions.width} x {selectedFile.dimensions.height}</span>
                                </div>
                                <div>
                                  <span className="font-medium">อัตราส่วน:</span>
                                  <span className="ml-1">{selectedFile.dimensions.aspectRatio.toFixed(2)}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <FileText className="mx-auto h-16 w-16 mb-4 opacity-50" />
                      <p>เลือกไฟล์เพื่อดูผลลัพธ์ OCR</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
