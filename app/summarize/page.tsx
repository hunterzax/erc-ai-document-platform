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
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Brain, FileText, Sparkles, Copy, Download, Loader2 } from "lucide-react"
import { useState } from "react"
import { AppHeader } from "@/components/header-bar"

const tokenURLSmall = process.env.NEXT_PUBLIC_N8N_BASE_URL_SMALL;
const tokenURLMedium = process.env.NEXT_PUBLIC_N8N_BASE_URL_MEDIUM;


export default function SummarizePage() {
  const [inputText, setInputText] = useState("")
  const [summaryType, setSummaryType] = useState("short")
  const [summary, setSummary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // reset status
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }


  const handleSummarize = async () => {
    setIsGenerating(true)


    // summaryType
    const axios = require('axios');
    let data = JSON.stringify({
      "messages": [
        {
          "id": 1,
          "role": "user",
          "timestamp": "2025-09-02T02:37:24.230Z",
          "content": inputText
        }
      ]
    });
    // console.log('data', data)

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: summaryType == 'long' ? tokenURLMedium : tokenURLSmall,
      headers: {
        // '': '',
        'Content-Type': 'application/json'
      },
      data: data
    };
    // console.log('config', config)

    let res_summary = await axios.request(config)
    // console.log('res_summary', res_summary)


    // Simulate AI processing
    setTimeout(() => {
      // const mockSummary =
      //   summaryType === "short" ? "สรุปสั้น: เอกสารนี้เกี่ยวข้องกับการจัดซื้อจัดจ้างภาครัฐ โดยเน้นหลักการโปร่งใสและประสิทธิภาพในการดำเนินงาน"
      //     : "สรุปยาว: เอกสารนี้เป็นพระราชบัญญัติที่ควบคุมการจัดซื้อจัดจ้างของหน่วยงานภาครัฐ มีวัตถุประสงค์เพื่อให้การดำเนินงานเป็นไปอย่างมีประสิทธิภาพ โปร่งใส และตรวจสอบได้ โดยกำหนดหลักเกณฑ์และวิธีการปฏิบัติที่ชัดเจน รวมถึงการกำหนดบทลงโทษสำหรับผู้ที่ฝ่าฝืน"
      const mockSummary =
        summaryType === "short" ? `สรุปสั้น: ${res_summary?.data?.output}`
          : `สรุปยาว: ${res_summary?.data?.output}`
      setSummary(mockSummary)
      setIsGenerating(false)
    }, 2000)
  }

  const handleSelectType = (e: any) => {
    // console.log('handleSelectType', e)
    setSummaryType(e)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'สรุปด้วย AI'} />

        <div className="flex flex-1 flex-col gap-6 p-4 anifade">
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Input Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  ข้อความต้นฉบับ
                </CardTitle>
                <CardDescription>วางข้อความที่ต้องการให้ AI สรุป</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="วางข้อความเอกสารที่ต้องการสรุปที่นี่..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[300px] border border-[#dedede] placeholder:opacity-40"
                />

                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ประเภทการสรุป</label>


                    {/* <Select value={summaryType} onValueChange={setSummaryType} > */}
                    <Select
                      value={summaryType}
                      onValueChange={(e: any) => handleSelectType(e)}

                    >
                      <SelectTrigger className="w-40 border border-[#dedede]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">สรุปสั้น</SelectItem>
                        <SelectItem value="long">สรุปยาว</SelectItem>
                        {/* <SelectItem value="bullet">จุดสำคัญ</SelectItem>
                        <SelectItem value="keywords">คำสำคัญ</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <Button onClick={handleSummarize} disabled={!inputText.trim() || isGenerating} className="mt-6">
                    <Brain className="h-4 w-4 mr-2" />
                    {isGenerating ? "กำลังสรุป..." : "สรุปด้วย AI"}
                  </Button> */}

                  <Button
                    onClick={handleSummarize}
                    disabled={!inputText.trim() || isGenerating}
                    className="mt-6 flex items-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        กำลังสรุป...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4" />
                        สรุปด้วย AI
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>










            {/* Output Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  ผลการสรุป
                </CardTitle>
                <CardDescription>ข้อความที่ AI สรุปแล้ว</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {summary ? (
                  <>
                    <div className="p-4 bg-muted rounded-lg min-h-[300px]">
                      <p className="text-sm leading-relaxed">{summary}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {summaryType === "short"
                          ? "สรุปสั้น"
                          : summaryType === "long"
                            ? "สรุปยาว"
                            : summaryType === "bullet"
                              ? "จุดสำคัญ"
                              : "คำสำคัญ"}
                      </Badge>
                      <Badge variant="outline">ความยาว: {summary.length} ตัวอักษร</Badge>
                    </div>

                    <div className="flex gap-2">
                      {/* <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        คัดลอก
                      </Button> */}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopy}
                        className="flex items-center gap-1"
                      >
                        <Copy className="h-4 w-4" />
                        {copied ? "คัดลอกแล้ว!" : "คัดลอก"}
                      </Button>

                      {/* <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        ดาวน์โหลด
                      </Button> */}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center min-h-[300px] text-muted-foreground">
                    <div className="text-center">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>กรอกข้อความและคลิก "สรุปด้วย AI" เพื่อเริ่มต้น</p>
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
