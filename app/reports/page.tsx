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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { BarChart3, Download, FileText, CalendarIcon } from "lucide-react"
import { useState } from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { AppHeader } from "@/components/header-bar"

const monthlyData = [
  { month: "ม.ค.", documents: 245, searches: 1250, users: 45 },
  { month: "ก.พ.", documents: 312, searches: 1580, users: 52 },
  { month: "มี.ค.", documents: 428, searches: 2100, users: 48 },
  { month: "เม.ย.", documents: 389, searches: 1890, users: 55 },
  { month: "พ.ค.", documents: 467, searches: 2350, users: 61 },
  { month: "มิ.ย.", documents: 523, searches: 2680, users: 58 },
]

const documentTypeData = [
  { name: "กฎหมาย", value: 45, color: "#8AC42D" },
  { name: "ระเบียบ", value: 30, color: "#27A9F5" },
  { name: "ประกาศ", value: 15, color: "#E3902D" },
  { name: "หนังสือเวียน", value: 10, color: "#E34E2D" },
]

const performanceData = [
  { metric: "เวลาตอบสนองเฉลี่ย", value: "1.8s", target: "≤2s", status: "good" },
  { metric: "ความแม่นยำ OCR", value: "94.2%", target: "≥90%", status: "good" },
  { metric: "Uptime ระบบ", value: "99.8%", target: "≥99.5%", status: "good" },
  { metric: "การใช้งาน Storage", value: "67%", target: "≤80%", status: "good" },
]

export default function ReportsPage() {
  const [reportType, setReportType] = useState("monthly")
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  const generateReport = (format: string) => {
    console.log(`Generating ${reportType} report in ${format} format`)
    // Implementation for report generation
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "good":
        return <Badge className="bg-green-100 text-green-800">ดี</Badge>
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-800">เตือน</Badge>
      case "critical":
        return <Badge variant="destructive">วิกฤต</Badge>
      default:
        return <Badge variant="secondary">ไม่ทราบ</Badge>
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'รายงาน'}/>

        <div className="flex flex-1 flex-col gap-6 p-4">
          {/* Report Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                สร้างรายงาน
              </CardTitle>
              <CardDescription>เลือกประเภทรายงานและช่วงเวลาที่ต้องการ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-5">
                <div className="space-y-2 col-span-1">
                  <label className="text-sm font-medium">ประเภทรายงาน</label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger className="w-full border border-[#dedede]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">รายงานประจำเดือน</SelectItem>
                      <SelectItem value="quarterly">รายงานประจำไตรมาส</SelectItem>
                      <SelectItem value="yearly">รายงานประจำปี</SelectItem>
                      <SelectItem value="usage">รายงานการใช้งาน</SelectItem>
                      <SelectItem value="performance">รายงานประสิทธิภาพ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 col-span-1">
                  <label className="text-sm font-medium">หน่วยงาน</label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger className="w-full border border-[#dedede]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">ทุกหน่วยงาน</SelectItem>
                      <SelectItem value="secretary">สำนักงานเลขาธิการ</SelectItem>
                      <SelectItem value="legal">กองกฎหมาย</SelectItem>
                      <SelectItem value="academic">กองวิชาการ</SelectItem>
                      <SelectItem value="admin">กองบริหาร</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 grid grid-cols-1 col-span-1">
                  <label className="text-sm font-medium mb-1">วันที่</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent border border-[#dedede]">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange ? format(dateRange, "PPP", { locale: th }) : "เลือกวันที่"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex gap-2 col-span-2 items-end justify-end">
                  <Button onClick={() => generateReport("pdf")}>
                    <Download className="h-4 w-4 mr-2" />
                    PDF
                  </Button>
                  <Button variant="outline" onClick={() => generateReport("excel")}>
                    <Download className="h-4 w-4 mr-2" />
                    Excel
                  </Button>
                  <Button variant="outline" onClick={() => generateReport("word")}>
                    <Download className="h-4 w-4 mr-2" />
                    Word
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle>ตัวชี้วัดประสิทธิภาพ</CardTitle>
              <CardDescription>ภาพรวมประสิทธิภาพของระบบในเดือนปัจจุบัน</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {performanceData.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg shadow-sm hover:shadow-md duration-200 ease-in-out">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{item.metric}</span>
                      {getStatusBadge(item.status)}
                    </div>
                    <div className="text-2xl font-bold">{item.value}</div>
                    <div className="text-xs text-muted-foreground">เป้าหมาย: {item.target}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Charts */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>แนวโน้มการใช้งานรายเดือน</CardTitle>
                <CardDescription>จำนวนเอกสาร การค้นหา และผู้ใช้งาน</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    documents: {
                      label: "เอกสาร",
                      color: "hsl(var(--chart-1))",
                    },
                    searches: {
                      label: "การค้นหา",
                      color: "hsl(var(--chart-2))",
                    },
                    users: {
                      label: "ผู้ใช้งาน",
                      color: "hsl(var(--chart-3))",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="documents" stroke="#E3C22D" strokeWidth={2} fill="#E3C22D"/>
                      <Line type="monotone" dataKey="searches" stroke="#2DACE3" strokeWidth={2} fill="#2DACE3"/>
                      <Line type="monotone" dataKey="users" stroke="#E34E2D" strokeWidth={2} fill="#E34E2D"/>
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>การแจกแจงประเภทเอกสาร</CardTitle>
                <CardDescription>สัดส่วนประเภทเอกสารที่อัปโหลดในระบบ</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    documents: {
                      label: "เอกสาร",
                    },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentTypeData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {documentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <CardTitle>รายงานล่าสุด</CardTitle>
              <CardDescription>รายงานที่สร้างขึ้นล่าสุด</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "รายงานประจำเดือน มิถุนายน 2567",
                    type: "รายเดือน",
                    date: "2024-07-01",
                    size: "2.4 MB",
                    format: "PDF",
                  },
                  {
                    name: "รายงานประสิทธิภาพระบบ Q2/2567",
                    type: "ประสิทธิภาพ",
                    date: "2024-06-30",
                    size: "1.8 MB",
                    format: "Excel",
                  },
                  {
                    name: "รายงานการใช้งานกองกฎหมาย",
                    type: "การใช้งาน",
                    date: "2024-06-28",
                    size: "956 KB",
                    format: "Word",
                  },
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md duration-200 ease-in-out">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-blue-500" />
                      <div>
                        <p className="font-medium">{report.name}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>{report.type}</span>
                          <span>{report.date}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{report.format}</Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        ดาวน์โหลด
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
