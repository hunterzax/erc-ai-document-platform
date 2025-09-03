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
import { Upload, FileText, ImageIcon, X, CheckCircle, AlertCircle, Clock, Download, Copy, Image as ImagexIcon, Table, FormInput, Eye, FileDigit, Settings, CheckCheck, ScanSearch, ListChecks, List, ArrowBigDownDash, Logs } from "lucide-react"
import { useState, useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { useToast } from "@/hooks/use-toast"
import { toast as toastColor } from "react-toastify"
import { AppHeader } from "@/components/header-bar"
import PdfViewer from "@/components/ui/pdfviewer"
import axios from "axios"
import { mock_data_ocr_1, mock_data_ocr_2 } from "./mockDataK"
import AIConfig from "@/components/byk/ai_setting_btn"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import dayjs from 'dayjs'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { copyText } from "@/components/functions/copy"

interface ImageItem {
  source: string;
  typhoon_ocr: string;
}

interface ImageWithHex {
  hex: string; // หรือ base64 string
  typhoon_ocr: string;
  file_name: string;
}


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





  // #region IMAGE state
  const [imagesWithHex, setImagesWithHex] = useState<ImageWithHex[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<ImageWithHex | null>(null);
  const [selectedImg, setSelectedImg] = useState<any>(null);
  const [loadedImages, setLoadedImages] = useState<number>(0); // 0 นับจำนวนภาพที่โหลดแล้ว
  const [successRender, setsuccessRender] = useState(false)


  // #region processFile
  const processFile = async (file: UploadedFile, originalFile: File) => {
    try {

      setisLoading(true);
      setNumber(0)

      let data = new FormData();
      let option: any = AIOption;

      data.append('file', originalFile);
      data.append('tags', 'กฏหมาย,กฏหมายพลังงาน');

      //for setting ai
      data.append('max_tokens', option?.max_tokens);
      data.append('temperature', option?.temperature);
      data.append('top_p', option?.top_p);
      data.append('repetition_penalty', option?.repetition_penalty);

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
        setLoading(true); // ของ image show

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


        setTimeout(async () => {

          // step 2 data 
          // ส่ง postOCR?.data?.pdf_name
          // เอาชื่อไฟล์ใน res.images
          //http://10.100.92.20:4600/qdrant/file_name/docs_section_single/ตัวอย่างใบเสร็จ.pdf
          // console.log(">>> postOCR", postOCR)
          // console.log(">>> postOCR", postOCR?.data?.pdf_name)
          const res_step_1 = await getOCR(`${postOCR?.data?.pdf_name}.pdf`)
          // console.log('res_step_1', res_step_1)

          // วนลูปส่ง res_step_1_k.images.source ไปที่ getImageOfPage 
          // ซึ่ง response จาก getImageOfPage จะได้เป็นรูป เราน่าจะเอา hexcode มาเก็บไว้ได้
          // หลังจากนั้นต้องเก็บ res_step_1_k.images.typhoon_ocr ไว้คู่กับแต่ละรูป จะใช้ state ก็ได้ 
          // แล้วนำไปแสดงผลใน card ทุกรูป เมื่อกดรูปนั้น ๆ แสดง modal ด้านซ้ายเป็นรูป ด้านขวาเป็นข้อความจาก res_step_1_k.images.typhoon_ocr
          // ระหว่างวนลูปทำ loading ไว้ก็ดี

          let res_step_1_k = {
            "ok": true,
            "error": null,
            "file_name": "หนังสือเชิญ NMS.pdf",
            "id": "2040bf92-f18e-47b4-8d7c-5ce0ac295d5f",
            "vectors": null,
            "images": [
              {
                "source": "หนังสือเชิญ NMS_page_1.png",
                "typhoon_ocr": 'content'
              },
              {
                "source": "หนังสือเชิญ NMS_page_2.png",
                "typhoon_ocr": 'content'
              },
              {
                "source": "หนังสือเชิญ NMS_page_3.png",
                "typhoon_ocr": 'content'
              }
            ]
          }


          // step 4 เอาภาพแต่ละเพจ
          // const results: ImageWithHex[] = [];
          // for (const img of res_step_1.images) {
          //   try {
          //     const hex: any = await getImageOfPage(img.source); // สมมติได้ hex/base64 กลับมา
          //     results.push({ hex, typhoon_ocr: img.typhoon_ocr });
          //   } catch (err) {
          //     console.error("Failed to fetch image:", img.source, err);
          //   }
          // }
          // setImagesWithHex(results);

          // step 4 เอาภาพแต่ละเพจ
          for (const img of res_step_1.images) {
            try {
              // const hex: any = await getImageOfPage(img.source);
              // console.log('hex', hex)

              // ${tokenURL}/raw_docs_files_images/${pageName}
              // setImagesWithHex((prev: any) => [...prev, { hex: hex?.data, typhoon_ocr: img.typhoon_ocr }]);
              setImagesWithHex((prev: any) => [...prev, { hex: `${tokenURL}/raw_docs_files_images/${img.source}`, typhoon_ocr: img.typhoon_ocr, file_name: img.source }]);
              setsuccessRender(true);
            } catch (err) {
              console.error("Failed to fetch image:", img.source, err);
            }
          }

          setLoading(false); // ของ image show

          // step 4 เอาภาพแต่ละเพจ
          // await getImageOfPage(res_step_1_k?.images?.source)

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

  // #region โหลดดิ้งแบบเหลี่ยมจัด
  useEffect(() => {
    const loadImages = async () => {
      for (let i = 0; i < imagesWithHex.length; i++) {
        // เพิ่ม delay 1 วิ
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoadedImages(i + 1); // อัพเดท state ทีละภาพ
      }
    };

    loadImages();
  }, [imagesWithHex]);

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

  // #region step 2
  // step 2
  const getOCR = async (filename: any) => {
    try {
      const getData = await axios.get(`${tokenURL}/qdrant/file_name/docs_section_single/${filename}`);
      // console.log(">>> getData", getData);

      return getData?.data
    } catch (error: any) {
      // ❌ กรณีเกิดข้อผิดพลาด
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // console.error("❌ Server error:", error.response.status);
          return {}
        } else if (error.request) {
          // console.error("❌ Network error: No response received.");
          return {}
        } else {
          // console.error("❌ Axios config error:", error.message);
          return {}
        }
      } else {
        // console.error("❌ Unexpected error:", error);
        return {}
      }

      // setdataList([]);
      // setisLoading(false);
    }
  }

  // #region step 4
  // step 4
  const getImageOfPage = async (pageName?: any) => {
    try {
      const res_get_image = await axios.get(`${tokenURL}/raw_docs_files_images/${pageName}`);
      return res_get_image
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // console.error("❌ Server error:", error.response.status);
          return {}
        } else if (error.request) {
          // console.error("❌ Network error: No response received.");
          return {}
        } else {
          // console.error("❌ Axios config error:", error.message);
          return {}
        }
      } else {
        // console.error("❌ Unexpected error:", error);
        return {}
      }

      // setdataList([]);
      // setisLoading(false);
    }
  }

  const [number, setNumber] = useState<any>(null);

  useEffect(() => {
    if (number == 0) {
      countWithDelay(setNumber);
    }
  }, [number]);

  function countWithDelay(callback: any) {
    let i = 1;
    const interval = setInterval(() => {
      callback(i);
      if (i === 99) {
        clearInterval(interval);
      }
      i++;
    }, 2000);
  }

  const [AIOption, setAIOption] = useState<any>({
    'max_tokens': 8000,
    'temperature': 0.0,
    'top_p': 1.0,
    'repetition_penalty': 1.0,
  });

  const settingAI = (result: any) => {
    setAIOption(result);

    toast({
      title: "บันทึก Configuration AI เรียบร้อยแล้ว!",
      variant: "success",
    });
  }

  const [dataList, setdataList] = useState<any>();
  const [dataOriginal, setdataOriginal] = useState<any>();

  const [tabmenu, settabmenu] = useState<any>('upload');

  const [dialogOpen, setdialogOpen] = useState<boolean>(false);
  const [dialogData, setdialogData] = useState<any>();

  const handleSearch = (txt: any) => {
    setisLoading(true);
    const result = dataOriginal?.filter((item: any) => {
      return (
        txt ? item?.title?.replace(/\s+/g, '').toLowerCase().trim().includes(txt?.replace(/\s+/g, '').toLowerCase().trim()) : true
      )
    })

    setTimeout(() => {
      setdataList(result);
    }, 500);

  }

  const dialogCtrl = async (file_name: any) => {
    const getData = await axios.get(`${tokenURL}/raw_docs_file_name/${file_name}`);

    if (getData?.status == 200) {
      await setdialogData({
        title: getData?.data?.title,
        content: getData?.data?.context,
        file_name: getData?.data?.file_name,
        url: `${tokenURL}/raw_docs_pdf/${file_name}`
      });

      setdialogOpen(true);
    }
  }

  useEffect(() => {
    if (!dataList && tabmenu == 'upload-list') {
      getOCRList();
    }
  }, [tabmenu])

  const getOCRList: any = async () => {
    try {
      const getData = await axios.get(`http://10.100.92.20:4600/raw_docs?limit=200&offset=0`);

      if (getData?.status == 200) {
        setdataList(getData?.data?.items)
        setdataOriginal(getData?.data?.items)
        setisLoading(false);
      } else {
        setdataList([]);
        setisLoading(false);
      }
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

      setdataList([]);
      setisLoading(false);
    }
  }

  const downloadPDF = async (file_name: any) => {
    try {
      const response = await axios.get(`http://10.100.92.20:4600/raw_docs_pdf/${file_name}`, {
        responseType: 'blob', // 👈 สำคัญมาก!
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data); // ใช้ response.data ตรงๆ
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file_name}.pdf`; // ชื่อไฟล์ที่จะดาวน์โหลด
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // ♻️ free memory
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  async function handleCopy(text: string) {
    const success = await copyText(text)
    if (success) {
      toast({
        title: "คัดลอกข้อความแล้ว ✅",
        variant: "success",
      });
    } else {
      toast({
        title: "คัดลอกไม่สำเร็จ ❌",
        variant: "destructive",
      });
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'อัปโหลดเอกสาร'} />

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* 2x2 Grid Layout */}
          <Tabs defaultValue="upload" className="space-y-6">
            <TabsList className="flex w-xl h-[44px] justify-between rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <TabsTrigger
                value="upload"
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                onClick={() => settabmenu("upload")}
              >
                <div className="flex gap-2 items-center">
                  <Upload size={16} />
                  อัปโหลดเอกสาร
                </div>
              </TabsTrigger>

              <TabsTrigger
                value="upload-list"
                className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
                onClick={() => settabmenu("upload-list")}
              >
                <div className="flex gap-2 items-center">
                  <Logs size={16} />
                  ข้อมูลรายการเอกสาร
                </div>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-6" asChild>
              <div className="grid grid-cols-4 gap-6 anifade">

                {/* Top-Left: Drop files here + Progress */}
                <Card className="flex flex-col-2 col-span-3">
                  <CardHeader>
                    <CardTitle>อัปโหลดเอกสาร</CardTitle>
                    <CardDescription>รองรับไฟล์ PDF, Word, และรูปภาพ</CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-3 gap-5">
                    <div
                      {...getRootProps()}
                      className={`col-span-2 border border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors flex-1 flex flex-col items-center justify-center hover:bg-blue-200/30 ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
                        }`}
                    >
                      <input {...getInputProps()} />
                      {files?.length == 0 ?
                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        : files?.length > 0 && successRender == false ?
                          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                          : files?.length > 0 && successRender == true &&
                          <CheckCheck className="mx-auto h-12 w-12 text-green-600 mb-4" />
                      }
                      {files?.length == 0 ?
                        isDragActive ? (
                          <p className="text-lg font-medium">วางไฟล์ที่นี่...</p>
                        ) : (
                          <>
                            <p className="text-lg font-medium mb-2">ลากและวางไฟล์ที่นี่</p>
                            <p className="text-sm text-muted-foreground mb-4">หรือคลิกเพื่อเลือกไฟล์</p>
                            <Button variant="outline" className="w-fit">เลือกไฟล์</Button>
                          </>
                        )
                        : files?.length > 0 && successRender == false ?
                          <>
                            <p className="text-lg font-medium mb-2 animate-pulse">กำลังประมวลผล</p>
                            <p className="text-sm text-muted-foreground mb-4 animate-pulse">กรุณารอสักครู่</p>
                          </>
                          : files?.length > 0 && successRender == true &&
                          <>
                            <p className="text-lg font-medium mb-2">ประมวลผลเสร็จสิ้น</p>
                            {/* <p className="text-sm text-muted-foreground mb-4 animate-pulse">กรุณารอสักครู่</p> */}
                          </>
                      }

                      {/* Progress Bar Inside Drop Zone */}
                      {files?.length > 0 && (
                        <div className="mt-6 w-full">
                          <Label className="text-sm font-medium mb-2 block text-left">Progress Upload</Label>
                          {files.map((file) => (
                            <div key={file.id} className="mb-3">
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="truncate">{file.name}</span>

                                {/* <span className="text-muted-foreground">{file.progress}%</span> */}
                                <span className="text-muted-foreground">{!successRender ? number : 100}%</span>
                              </div>
                              {/* <Progress value={file.progress} className="h-2" /> */}
                              <Progress value={!successRender ? number : 100} className="h-2" color={!successRender ? '#278BF5' : '#2FBA2D'} />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div>
                      <AIConfig mode='form' returnResult={(e: any) => settingAI(e)} />
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

                {/* 3 working */}
                <Card className={`flex flex-col col-span-4 bg-white min-h-[320px] h-auto ${imagesWithHex?.length > 0 && 'h-[800px]'} overflow-y-auto`}>
                  {/* <Card className={`flex flex-col col-span-4 bg-white min-h-[320px] h-[800px] ${imagesWithHex?.length > 0 && 'h-[800px]'} overflow-y-auto`}> */}
                  <CardHeader>
                    <CardTitle>ผลลัพธ์</CardTitle>
                    <CardDescription>ข้อมูลผลลัพธ์ที่ได้จาก AI OCR {!loading && imagesWithHex?.length > 0 && `(${imagesWithHex?.length} Pages)`}</CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1 overflow-auto p-2 space-y-6 custom-scroll">
                    {/* {loading && <div>Loading images...</div>} */}
                    {loading && (
                      <div className="flex gap-3 items-center justify-center py-10 space-y-4">
                        {/* Spinner */}
                        <div className="w-7 h-7 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>

                        {/* Loading text */}
                        <p className="text-gray-600 text-sm font-medium animate-pulse mb-3">
                          กำลังโหลดรูปภาพ OCR ...
                        </p>
                      </div>
                    )
                    }

                    {
                      !loading && imagesWithHex?.length <= 0 && files?.length == 0 ?
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <FileText className="mx-auto h-16 w-16 mb-4 opacity-50" />
                            <p>เลือกไฟล์เพื่อดูผลลัพธ์ OCR</p>
                          </div>
                        </div>
                        :
                        !loading && files?.length > 0 && imagesWithHex?.length <= 0 &&
                        <div className="flex-1 flex items-center justify-center text-muted-foreground gap-3 h-full">
                          <div className="w-7 h-7 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                          <p className="animate-pulse">กำลังรออัพโหลด OCR</p>
                        </div>
                    }

                    {imagesWithHex?.map((img, idx) => (
                      // {mock_data_ocr_2.map((img, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col border rounded shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition pb-5 bg-gray-100 anifade"
                      >
                        {/* Page number */}
                        <div className="bg-gray-100 px-4 py-1 text-md text-gray-700 font-medium">
                          Page {idx + 1}
                        </div>

                        {/* Content */}
                        <div className="flex h-[600px]">
                          {/* Left: PDF image */}
                          <div
                            className="w-1/2 bg-gray-100 flex justify-center items-center p-2 cursor-zoom-in"
                            onClick={() => setSelectedImg(img.hex)}
                          >
                            {idx < loadedImages ? (
                              <img
                                src={img.hex}
                                alt={`page-${idx}`}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              // Loading animation
                              // <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
                              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                            )}
                          </div>

                          {/* Right: OCR text */}
                          <div className="w-1/2 p-4 overflow-auto bg-white flex flex-col rounded-lg custom-scroll-gray">
                            {idx < loadedImages ? (<>
                              <pre
                                className="whitespace-pre-wrap break-words pb-2"
                                style={{ fontSize: "0.80rem", lineHeight: "1.1rem" }}
                              >
                                {img.typhoon_ocr}
                              </pre>

                              {/* <div className="w-full bg-blue-400">
                            <span className="w-full p-2 text-[14px] font-light"> ข้อมูลเอกสาร | จำนวนตัวอักษร: {img.typhoon_ocr.length} | ชื่อไฟล์: {img.file_name} </span>
                          </div> */}

                              <div className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg">
                                <div className="flex items-center justify-between px-4 py-2 text-sm">
                                  {/* Left */}
                                  <div className="flex items-center space-x-4">
                                    <span className="flex items-center space-x-1">
                                      <span className="font-semibold">📑 ข้อมูลเอกสาร</span>
                                    </span>
                                    <span className="flex items-center space-x-1">
                                      <span className="opacity-80">✍️ ตัวอักษร:</span>
                                      <span className="font-medium">{img.typhoon_ocr.length}</span>
                                    </span>
                                  </div>

                                  {/* Right */}
                                  <div className="flex items-center space-x-1">
                                    <span className="opacity-80">📂 ไฟล์:</span>
                                    <span className="font-medium truncate max-w-[200px]">{img.file_name}</span>
                                  </div>
                                </div>
                              </div>

                            </>
                            ) : (
                              <div className="animate-pulse h-full w-full bg-gray-200 rounded"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>

                  {/* Modal แสดงเฉพาะรูปใหญ่ */}
                  {selectedImg && (
                    <div className="fixed inset-0 bg-black/50 bg-opacity-30 flex items-center justify-center z-50 p-4">
                      <div className="relative bg-white rounded shadow-lg max-w-[90%] max-h-[90%] overflow-y-auto custom-scroll anifade">
                        <img
                          src={selectedImg}
                          alt="expanded"
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                      <div className="relative h-full">
                        <button
                          className="absolute top-6 -right-6 px-3 py-3 bg-red-500 text-white rounded-xl cursor-pointer"
                          onClick={() => setSelectedImg(null)}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="upload-list" className="space-y-6" asChild>
              <div className="px-4 flex flex-col justify-between items-center anifade">
                <div className="flex justify-between gap-3 w-full">
                  <div>
                    <div className="font-bold text-md flex gap-3 items-center"><ListChecks size={18} /> {'รายการ Upload'}</div>
                    <div className="text-sm flex gap-3 items-center">{'รายการเอกสารภายในระบบ'}</div>
                  </div>
                  <div className="border border-[#dedede] rounded-md bg-white flex justify-between items-center px-2 w-[600px] gap-2">
                    <input className="h-10 rounded-md outline-none p-2 font-normal w-full" placeholder="กรอกชื่อข้อมูลที่ต้องการค้นหา.." onChange={(e: any) => {
                      let txt: any = e?.target?.value;
                      handleSearch(txt);
                    }} />
                    <ScanSearch size={18} />
                  </div>
                </div>
                <div className="flex flex-col gap-2 overflow-y-auto min-h-0 w-full h-full">
                  {dataList?.length > 0 ? dataList?.map((item: any, index: any) => {
                    return (
                      <div
                        key={index}
                        className="border border-[#dedede] p-2 rounded-md cursor-pointer hover:shadow-md duration-200 ease-in-out hover:border-[#0b41f3] hover:bg-[#f5f5f5] anifade"
                        onClick={() => dialogCtrl(item?.file_name)}
                      >
                        <p className="flex gap-3 items-center"><List size={16} /> {item?.title}</p>
                        <p className="text-sm text-blue-500 mb-3 italic">{item?.file_name}</p>
                        <p className="text-sm opacity-50">{"วันที่: " + dayjs(item?.created_at).format('DD/MM/YYYY')}</p>
                      </div>
                    )
                  })
                    : dataList?.length == 0 &&
                    <div className="flex flex-col  min-h-0 w-full justify-center items-center gap-5 anifade mt-10">
                      {'ไม่พบข้อมูล'}
                    </div>
                  }
                </div>
              </div>
            </TabsContent>
          </Tabs>


          <Dialog open={dialogOpen} onOpenChange={(e: any) => setdialogOpen(e)}>
            <DialogContent className="max-w-screen-2xl w-full h-[90vh] max-h-[90vh] overflow-hidden">
              <DialogHeader>
                <DialogTitle className="font-bold text-xl">{dialogData && dialogData?.title}</DialogTitle>
                <DialogDescription asChild>
                  <div className="h-[calc(90vh-150px)] overflow-hidden px-0 py-10 anifade">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-[#292929] rounded-t-md">
                        <div className="h-[50px] text-white flex justify-start items-center p-3 gap-2">
                          <div><ImagexIcon /></div>
                          <div>{'Original Image'}</div>
                        </div>
                      </div>

                      <div className="bg-[#292929] rounded-t-md">
                        <div className="h-[50px] text-white flex justify-between items-center p-3 gap-2">
                          <div className="flex gap-2 items-center">
                            <div><Eye /></div>
                            <div>{'Extracted Text'}</div>
                          </div>
                          <div><Copy size={16} className=" cursor-pointer" onClick={() => handleCopy(dialogData ? dialogData?.content : '')} /></div>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 h-full pb-2">
                      <div className="overflow-y-auto max-h-screen h-[calc(90vh-240px)] custom-scroll-gray bg-[#292929]">
                        <PdfViewer key={'pdf-view'} pdfUrl={dialogData ? dialogData?.url : ''} />
                      </div>

                      <div>
                        <Textarea value={dialogData ? dialogData?.content : ''} readOnly
                          className="w-full h-[calc(90vh-240px)] !outline-none !shadow-none !border-none bg-[#f0f0f0] text-[#2c2c2c] resize-none px-4 py-6 custom-scroll-gray" />
                      </div>
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <button
                  className="bg-blue-500 p-2 rounded-md flex items-center gap-2 text-white"
                  onClick={() => downloadPDF(dialogData && dialogData?.file_name)}
                >
                  <ArrowBigDownDash />
                  <span>{'ดาวน์โหลด PDF'}</span>
                </button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
