import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { FileText, Users, Clock, CheckCircle, Upload, Search, Brain, BarChart3, Settings, Home, MessageCircle, User2, ChevronUp } from "lucide-react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { AppHeader } from "@/components/header-bar"

const documentTrendData = [
  { month: "ม.ค.", documents: 245, processed: 230 },
  { month: "ก.พ.", documents: 312, processed: 298 },
  { month: "มี.ค.", documents: 428, processed: 415 },
  { month: "เม.ย.", documents: 389, processed: 378 },
  { month: "พ.ค.", documents: 467, processed: 452 },
  { month: "มิ.ย.", documents: 523, processed: 510 },
]

const searchActivityData = [
  { day: "จ.", searches: 145 },
  { day: "อ.", searches: 167 },
  { day: "พ.", searches: 189 },
  { day: "พฤ.", searches: 203 },
  { day: "ศ.", searches: 178 },
  { day: "ส.", searches: 134 },
  { day: "อา.", searches: 98 },
]

const topSearchQueries = [
  { query: "พระราชบัญญัติการจัดซื้อจัดจ้าง", count: 89 },
  { query: "กฎหมายสิทธิบัตร", count: 67 },
  { query: "ระเบียบการเงินการคลัง", count: 54 },
  { query: "พรบ.ข้อมูลข่าวสารของราชการ", count: 43 },
  { query: "กฎหมายแรงงาน", count: 38 },
]

const navItems = [
  { title: "แดชบอร์ด", url: "/", icon: Home, active: true },
  { title: "อัปโหลดเอกสาร", url: "/upload", icon: Upload },
  { title: "ค้นหาและวิเคราะห์", url: "/search", icon: Search },
  { title: "สรุปด้วย AI", url: "/summarize", icon: Brain },
  { title: "แชท AI", url: "/chat", icon: MessageCircle },
  { title: "รายงาน", url: "/reports", icon: BarChart3 },
  { title: "จัดการผู้ใช้", url: "/users", icon: Users },
  { title: "ตั้งค่า", url: "/settings", icon: Settings },
]

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'แดชบอร์ด'}/>
        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="flex-1 overflow-auto">
            <div className="flex flex-col gap-6">
              {/* KPI Cards Section */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">เอกสารทั้งหมด</CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">2,364</div>
                    <p className="text-xs text-muted-foreground">
                      <span className="text-green-600">+12.5%</span> จากเดือนที่แล้ว
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ความแม่นยำ OCR</CardTitle>
                    <CheckCircle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">94.2%</div>
                    <Progress value={94.2} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">เป้าหมาย: ≥90%</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">ผู้ใช้งานออนไลน์</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">127</div>
                    <p className="text-xs text-muted-foreground">จาก 500 ผู้ใช้ทั้งหมด</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">เวลาตอบสนองเฉลี่ย</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">1.8s</div>
                    <p className="text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-xs">
                        SLA: ≤2s
                      </Badge>
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Information Section */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-3">
                  <CardHeader>
                    <CardTitle>คำค้นหายอดนิยม</CardTitle>
                    <CardDescription>คำค้นหาที่ใช้บ่อยที่สุดในระบบ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {topSearchQueries.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="text-sm font-medium leading-none">{item.query}</p>
                          </div>
                          <Badge variant="secondary">{item.count}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-4">
                  <CardHeader>
                    <CardTitle>สถานะระบบ</CardTitle>
                    <CardDescription>ภาพรวมสถานะการทำงานของระบบต่างๆ</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">OCR Engine</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Vector Database</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Search Engine</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">AI Summarization</span>
                          <Badge className="bg-yellow-100 text-yellow-800">ช้า</Badge>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">API Gateway</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Authentication</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">File Storage</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Backup System</span>
                          <Badge className="bg-green-100 text-green-800">ปกติ</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
