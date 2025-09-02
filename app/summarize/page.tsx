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
import { Brain, FileText, Sparkles, Copy, Download } from "lucide-react"
import { useState } from "react"

export default function SummarizePage() {
  const [inputText, setInputText] = useState("")
  const [summaryType, setSummaryType] = useState("short")
  const [summary, setSummary] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  const handleSummarize = async () => {
    setIsGenerating(true)
    // Simulate AI processing
    setTimeout(() => {
      const mockSummary =
        summaryType === "short"
          ? "สรุปสั้น: เอกสารนี้เกี่ยวข้องกับการจัดซื้อจัดจ้างภาครัฐ โดยเน้นหลักการโปร่งใสและประสิทธิภาพในการดำเนินงาน"
          : "สรุปยาว: เอกสารนี้เป็นพระราชบัญญัติที่ควบคุมการจัดซื้อจัดจ้างของหน่วยงานภาครัฐ มีวัตถุประสงค์เพื่อให้การดำเนินงานเป็นไปอย่างมีประสิทธิภาพ โปร่งใส และตรวจสอบได้ โดยกำหนดหลักเกณฑ์และวิธีการปฏิบัติที่ชัดเจน รวมถึงการกำหนดบทลงโทษสำหรับผู้ที่ฝ่าฝืน"
      setSummary(mockSummary)
      setIsGenerating(false)
    }, 2000)
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/">AI Document Intelligence Platform</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>สรุปด้วย AI</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
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
                  className="min-h-[300px]"
                />

                <div className="flex items-center gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ประเภทการสรุป</label>
                    <Select value={summaryType} onValueChange={setSummaryType}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short">สรุปสั้น</SelectItem>
                        <SelectItem value="long">สรุปยาว</SelectItem>
                        <SelectItem value="bullet">จุดสำคัญ</SelectItem>
                        <SelectItem value="keywords">คำสำคัญ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleSummarize} disabled={!inputText.trim() || isGenerating} className="mt-6">
                    <Brain className="h-4 w-4 mr-2" />
                    {isGenerating ? "กำลังสรุป..." : "สรุปด้วย AI"}
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
                      <Button variant="outline" size="sm">
                        <Copy className="h-4 w-4 mr-2" />
                        คัดลอก
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        ดาวน์โหลด
                      </Button>
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
