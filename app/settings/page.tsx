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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Settings, Database, Shield, Bell, Server, AlertTriangle, CheckCircle } from "lucide-react"
import { useState } from "react"

export default function SettingsPage() {
  const [ocrAccuracyThreshold, setOcrAccuracyThreshold] = useState("90")
  const [maxFileSize, setMaxFileSize] = useState("50")
  const [sessionTimeout, setSessionTimeout] = useState("30")
  const [enableNotifications, setEnableNotifications] = useState(true)
  const [enableAuditLog, setEnableAuditLog] = useState(true)
  const [enableAutoBackup, setEnableAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")

  const systemStatus = [
    { service: "OCR Engine", status: "online", uptime: "99.8%" },
    { service: "Vector Database", status: "online", uptime: "99.9%" },
    { service: "Search Engine", status: "online", uptime: "99.7%" },
    { service: "AI Summarization", status: "degraded", uptime: "97.2%" },
    { service: "File Storage", status: "online", uptime: "99.9%" },
    { service: "Authentication", status: "online", uptime: "100%" },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return <Badge className="bg-green-100 text-green-800">ออนไลน์</Badge>
      case "degraded":
        return <Badge className="bg-yellow-100 text-yellow-800">ช้า</Badge>
      case "offline":
        return <Badge variant="destructive">ออฟไลน์</Badge>
      default:
        return <Badge variant="secondary">ไม่ทราบ</Badge>
    }
  }

  const handleSaveSettings = () => {
    console.log("Saving settings...")
    // Implementation for saving settings
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
                  <BreadcrumbPage>ตั้งค่า</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-4 pt-0">
          <Tabs defaultValue="system" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="system">ระบบ</TabsTrigger>
              <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
              <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
              <TabsTrigger value="backup">สำรองข้อมูล</TabsTrigger>
              <TabsTrigger value="status">สถานะระบบ</TabsTrigger>
            </TabsList>

            {/* System Settings */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    การตั้งค่าระบบ
                  </CardTitle>
                  <CardDescription>กำหนดค่าพื้นฐานของระบบ AI Document Intelligence</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="ocr-threshold">เกณฑ์ความแม่นยำ OCR (%)</Label>
                      <Input
                        id="ocr-threshold"
                        type="number"
                        min="80"
                        max="100"
                        value={ocrAccuracyThreshold}
                        onChange={(e) => setOcrAccuracyThreshold(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">เอกสารที่มีความแม่นยำต่ำกว่านี้จะถูกแจ้งเตือน</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-file-size">ขนาดไฟล์สูงสุด (MB)</Label>
                      <Input
                        id="max-file-size"
                        type="number"
                        min="1"
                        max="100"
                        value={maxFileSize}
                        onChange={(e) => setMaxFileSize(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">ขนาดไฟล์สูงสุดที่อนุญาตให้อัปโหลด</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="session-timeout">หมดเวลาเซสชัน (นาที)</Label>
                      <Input
                        id="session-timeout"
                        type="number"
                        min="5"
                        max="120"
                        value={sessionTimeout}
                        onChange={(e) => setSessionTimeout(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">ระยะเวลาที่ผู้ใช้จะถูกออกจากระบบอัตโนมัติ</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="language">ภาษาเริ่มต้น</Label>
                      <Select defaultValue="th">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="th">ไทย</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">การตั้งค่า AI</h4>
                    <div className="space-y-2">
                      <Label htmlFor="ai-model">โมเดล AI สำหรับสรุป</Label>
                      <Select defaultValue="gpt-4">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="gpt-4">GPT-4</SelectItem>
                          <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                          <SelectItem value="claude">Claude</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="chunk-size">ขนาด Chunk สำหรับ Vector DB</Label>
                      <Select defaultValue="1000">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="500">500 tokens</SelectItem>
                          <SelectItem value="1000">1000 tokens</SelectItem>
                          <SelectItem value="1500">1500 tokens</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    ความปลอดภัย
                  </CardTitle>
                  <CardDescription>การตั้งค่าความปลอดภัยและการเข้าถึง</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>เปิดใช้งาน Audit Log</Label>
                      <p className="text-xs text-muted-foreground">บันทึกการกระทำทั้งหมดของผู้ใช้</p>
                    </div>
                    <Switch checked={enableAuditLog} onCheckedChange={setEnableAuditLog} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-policy">นโยบายรหัสผ่าน</Label>
                    <Textarea
                      id="password-policy"
                      placeholder="กำหนดนโยบายรหัสผ่าน..."
                      defaultValue="รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                    <Textarea
                      id="ip-whitelist"
                      placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                      defaultValue="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                    />
                    <p className="text-xs text-muted-foreground">รายการ IP ที่อนุญาตให้เข้าถึงระบบ (หนึ่ง IP ต่อบรรทัด)</p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="max-login-attempts">จำนวนครั้งการเข้าสู่ระบบสูงสุด</Label>
                      <Input id="max-login-attempts" type="number" defaultValue="5" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lockout-duration">ระยะเวลาล็อคบัญชี (นาที)</Label>
                      <Input id="lockout-duration" type="number" defaultValue="30" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    การแจ้งเตือน
                  </CardTitle>
                  <CardDescription>กำหนดการแจ้งเตือนและการส่งอีเมล</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>เปิดใช้งานการแจ้งเตือน</Label>
                      <p className="text-xs text-muted-foreground">แจ้งเตือนเหตุการณ์สำคัญผ่านอีเมล</p>
                    </div>
                    <Switch checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">ประเภทการแจ้งเตือน</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>การอัปโหลดเอกสารเสร็จสิ้น</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>ความแม่นยำ OCR ต่ำ</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>ระบบขัดข้อง</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>การเข้าสู่ระบบผิดปกติ</Label>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label>รายงานประจำวัน</Label>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-email">อีเมลผู้ดูแลระบบ</Label>
                    <Input id="admin-email" type="email" defaultValue="admin@ggp.go.th" placeholder="admin@ggp.go.th" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtp-server">SMTP Server</Label>
                    <Input id="smtp-server" defaultValue="mail.ggp.go.th" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Backup Settings */}
            <TabsContent value="backup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    การสำรองข้อมูล
                  </CardTitle>
                  <CardDescription>การตั้งค่าการสำรองข้อมูลและการกู้คืน</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>เปิดใช้งานการสำรองข้อมูลอัตโนมัติ</Label>
                      <p className="text-xs text-muted-foreground">สำรองข้อมูลตามกำหนดเวลาที่ตั้งไว้</p>
                    </div>
                    <Switch checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-frequency">ความถี่ในการสำรองข้อมูล</Label>
                    <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">ทุกชั่วโมง</SelectItem>
                        <SelectItem value="daily">ทุกวัน</SelectItem>
                        <SelectItem value="weekly">ทุกสัปดาห์</SelectItem>
                        <SelectItem value="monthly">ทุกเดือน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-retention">เก็บข้อมูลสำรอง (วัน)</Label>
                    <Input id="backup-retention" type="number" defaultValue="365" />
                    <p className="text-xs text-muted-foreground">จำนวนวันที่เก็บข้อมูลสำรองไว้</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backup-location">ตำแหน่งการสำรองข้อมูล</Label>
                    <Input id="backup-location" defaultValue="/backup/ai-document-platform" />
                  </div>

                  <div className="flex gap-2">
                    <Button>สำรองข้อมูลทันที</Button>
                    <Button variant="outline">ทดสอบการกู้คืน</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Status */}
            <TabsContent value="status" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Server className="h-5 w-5" />
                    สถานะระบบ
                  </CardTitle>
                  <CardDescription>ตรวจสอบสถานะการทำงานของระบบต่างๆ</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {systemStatus.map((service, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {service.status === "online" ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : service.status === "degraded" ? (
                              <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-red-500" />
                            )}
                            <span className="font-medium">{service.service}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-muted-foreground">Uptime: {service.uptime}</span>
                          {getStatusBadge(service.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              บันทึกการตั้งค่า
            </Button>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
