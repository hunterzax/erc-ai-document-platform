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
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Line, LineChart, Pie, PieChart, Cell } from "recharts"
import { BarChart3, Download, FileText, CalendarIcon, Plus, Trash2, Search, PlusCircle } from "lucide-react"
import { useEffect, useState } from "react"
import { format } from "date-fns"
import { th } from "date-fns/locale"
import { AppHeader } from "@/components/header-bar"
import { useResizeDetector } from "react-resize-detector";

import { Responsive, WidthProvider, Layout } from "react-grid-layout";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
import EnergyDashboard from "./biChart"
import Dashboard from "./biChart2"
import { Input } from "@/components/ui/input"

const ResponsiveGridLayout = WidthProvider(Responsive)

const monthlyData = [
  { month: "ม.ค.", documents: 245, searches: 1250, users: 45 },
  { month: "ก.พ.", documents: 312, searches: 1580, users: 52 },
  { month: "มี.ค.", documents: 428, searches: 2100, users: 48 },
  { month: "เม.ย.", documents: 389, searches: 1890, users: 55 },
  { month: "พ.ค.", documents: 467, searches: 2350, users: 61 },
  { month: "มิ.ย.", documents: 523, searches: 2680, users: 58 },
]

// const documentTypeData = [
//   { name: "กฎหมาย", value: 45, color: "hsl(var(--chart-1))" },
//   { name: "ระเบียบ", value: 30, color: "hsl(var(--chart-2))" },
//   { name: "ประกาศ", value: 15, color: "hsl(var(--chart-3))" },
//   { name: "หนังสือเวียน", value: 10, color: "hsl(var(--chart-4))" },
// ]

// แบบมีสีสัน
const documentTypeData = [
  { name: "PDF", value: 45, color: "#3B82F6" },      // ฟ้า
  { name: "Word", value: 25, color: "#10B981" },     // เขียว
  { name: "Excel", value: 20, color: "#F59E0B" },    // ส้ม
  { name: "อื่น ๆ", value: 10, color: "#EF4444" },   // แดง
];

const performanceData = [
  { metric: "เวลาตอบสนองเฉลี่ย", value: "1.8s", target: "≤2s", status: "good" },
  { metric: "ความแม่นยำ OCR", value: "94.2%", target: "≥90%", status: "good" },
  { metric: "Uptime ระบบ", value: "99.8%", target: "≥99.5%", status: "good" },
  { metric: "การใช้งาน Storage", value: "67%", target: "≤80%", status: "good" },
]


// #region CHART
// อยากได้หน้า dashboard ที่เลียนแบบ power BI มีฟีเจอร์แบบนี้
// 1. แสดงผลพวก chart อยู่ใน card
// 2. แต่ละ card สามารถ drag and drop ย้ายตำแหน่งได้
// 3. สามารถกดเพิ่มหรือลด card ได้
// 4. ข้อมูลที่นำมาแสดงผล จะเป็น mock ทั้งหมด ข้อมูลเกี่ยวกับระบบ AI OCR และ Generative AI

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
        return <Badge className="w-auto text-[14px] bg-green-100 text-green-800">ดี</Badge>
      case "warning":
        return <Badge className="w-auto text-[14px] bg-yellow-100 text-yellow-800">เตือน</Badge>
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
        <AppHeader title={'รายงาน'} />

        <div className="flex flex-1 flex-col gap-6 p-4 anifade">

          {/* Performance Metrics */}
          {/* <Card>
            <CardHeader>
              <CardTitle>ตัวชี้วัดประสิทธิภาพของระบบ</CardTitle>
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
          </Card> */}

          {/* Charts */}
          {/* <div className="grid gap-6 md:grid-cols-2">

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">แนวโน้มการใช้งานรายเดือน</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  จำนวนเอกสาร การค้นหา และผู้ใช้งาน
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    documents: { label: "เอกสาร", color: "#3B82F6" }, // blue
                    searches: { label: "การค้นหา", color: "#10B981" }, // green
                    users: { label: "ผู้ใช้งาน", color: "#F59E0B" }, // amber
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid stroke="#E5E7EB" strokeDasharray="3 3" />

                      <XAxis
                        dataKey="month"
                        stroke="#9CA3AF"
                        tickLine={false}
                        axisLine={{ stroke: "#D1D5DB" }}
                      />
                      <YAxis stroke="#9CA3AF" tickLine={false} axisLine={{ stroke: "#D1D5DB" }} />

                      <ChartTooltip
                        content={<ChartTooltipContent />}
                      />

                      <Line
                        type="monotone"
                        dataKey="documents"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#3B82F6" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="searches"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#10B981" }}
                      />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        dot={{ r: 4, fill: "#F59E0B" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border border-gray-200 bg-white shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-lg font-semibold text-gray-800">การแจกแจงประเภทเอกสาร</CardTitle>
                <CardDescription className="text-sm text-gray-500">
                  สัดส่วนประเภทเอกสารที่อัปโหลดในระบบ
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-4">
                <ChartContainer
                  config={{
                    documents: { label: "เอกสาร" },
                  }}
                  className="h-[300px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={documentTypeData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}       // ทำ donut style
                        outerRadius={80}
                        paddingAngle={3}       // เว้นช่วงเล็ก ๆ ระหว่าง slices
                        labelLine={false}
                        // label={({ name, percent }: any) => (
                        //   <span className="text-gray-800 font-medium">{`${name} ${(percent * 100).toFixed(0)}%`}</span>
                        // )}
                        label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                        dataKey="value"
                        cornerRadius={4}       // มุมโค้งให้ Pie ดู modern
                      >
                        {documentTypeData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} stroke="#fff" strokeWidth={2} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

          </div> */}




          {/* <EnergyDashboard /> */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center gap-3">
                <div className="w-full">
                <CardTitle>ข้อมูลพลังงาน</CardTitle>
                <CardDescription>คณะกรรมการกำกับกิจการพลังงาน</CardDescription>
                </div>
                <div>
                  <PlusCircle className="hover:text-blue-500 duration-200 ease-in-out cursor-pointer"/>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 w-full">
                <Dashboard/>
              </div>
            </CardContent>
          </Card>

          {/* Recent Reports */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>รายงานล่าสุด</CardTitle>
                  <CardDescription>รายงานที่สร้างขึ้นล่าสุด</CardDescription>
                </div>
                <div className="relative w-lg">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาเอกสาร"
                    // value={searchQuery}
                    // onChange={(e) => setSearchQuery(e.target.value)}
                    // onKeyPress={handleKeyPress}
                    // className="pl-10 border border-[#dedede] placeholder:opacity-40 text-sm"
                    className="pl-10 w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:opacity-40"
                  />
                </div>
              </div>
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
                ]?.map((report, index) => (
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