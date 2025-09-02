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
import { Settings, Database, Shield, Bell, Server, AlertTriangle, CheckCircle, Bot, Save } from "lucide-react"
import { useState } from "react"
import { AppHeader } from "@/components/header-bar"

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AIConfigModal } from "@/components/byk/ai_setting_btn"

export default function SettingsPage() {


  // สร้างปุ่มกดและ modal configuration AI 
  // มีให้กำหนด parameter ดังนี้
  // 1. max token
  // 2. temperature
  // 3. Top-P
  // 4. Top-K
  // 5. Repetition Penalty

  const select_style = 'w-[130px] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
  const switch_style = "data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:data-[state=checked]:bg-blue-300 disabled:data-[state=unchecked]:bg-gray-200"

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

  // const handleBackup = async () => {

  //   console.log('asd')
  //   toast.warning('กำลังสำรองข้อมูล...', {
  //     position: 'bottom-right',
  //     autoClose: false,
  //   });

  //   const id = toast.loading("กำลังสำรองข้อมูล...")

  //   // จำลอง backup ใช้เวลา 2 วิ
  //   await new Promise((resolve) => setTimeout(resolve, 2000))

  //   // toast.update(id, {
  //   //   render: "สำรองข้อมูลเสร็จสิ้น",
  //   //   type: "success",
  //   //   isLoading: false,
  //   //   autoClose: 3000,
  //   // })
  //   toast.dismiss(); // Remove offline warning
  //   toast.success('สำรองข้อมูลเสร็จสิ้น!', {
  //     position: 'bottom-right',
  //     autoClose: 3000,
  //   });
  // }

  const handleBackup = async () => {
    // แสดง loading toast
    const id = toast.loading("กำลังสำรองข้อมูล...", {
      position: "bottom-right",
    })

    // จำลอง backup ใช้เวลา 2 วิ
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // อัปเดต toast เดิม ไม่ต้อง dismiss แล้วสร้างใหม่
    toast.update(id, {
      render: "สำรองข้อมูลเสร็จสิ้น!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
      closeOnClick: true,
      draggable: true,
    })
  }

  //อย่าเปิดถ้าไม่อยาก scroll
  const tabBackup = () => {
    return (
      <Tabs defaultValue="system" className="space-y-6">
        <ToastContainer />

        <AIConfigModal />
        {/* <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="system">ระบบ</TabsTrigger>
              <TabsTrigger value="security">ความปลอดภัย</TabsTrigger>
              <TabsTrigger value="notifications">การแจ้งเตือน</TabsTrigger>
              <TabsTrigger value="backup">สำรองข้อมูล</TabsTrigger>
              <TabsTrigger value="status">สถานะระบบ</TabsTrigger>
            </TabsList> */}

        <TabsList className="flex w-full h-[44px] justify-between rounded-xl border border-gray-200 bg-white p-1 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <TabsTrigger
            value="system"
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            ระบบ
          </TabsTrigger>

          <TabsTrigger
            value="security"
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            ความปลอดภัย
          </TabsTrigger>

          <TabsTrigger
            value="notifications"
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            การแจ้งเตือน
          </TabsTrigger>

          <TabsTrigger
            value="backup"
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            สำรองข้อมูล
          </TabsTrigger>

          <TabsTrigger
            value="status"
            className="flex-1 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-all 
               data-[state=active]:bg-blue-500 data-[state=active]:text-white 
               hover:text-gray-900 dark:text-gray-400 
               dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
          >
            สถานะระบบ
          </TabsTrigger>
        </TabsList>





        {/* System Settings */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-blue-500" />
                การตั้งค่าระบบ
              </CardTitle>
              <CardDescription className="mt-2">กำหนดค่าพื้นฐานของระบบ AI Document Intelligence</CardDescription>
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
                    className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <p className="text-xs text-muted-foreground">ระยะเวลาที่ผู้ใช้จะถูกออกจากระบบอัตโนมัติ</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">ภาษาเริ่มต้น</Label>
                  <Select defaultValue="th">
                    <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-lg shadow-md">
                      <SelectItem value="th">ไทย</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">การเชื่อมต่อ DMS</Label>
                    <p className="text-xs text-muted-foreground">ตัดการเชื่อมต่อ API</p>
                  </div>
                  <Switch className={switch_style} checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
                </div>
              </div>




              <div className="space-y-4">
                <h4 className="text-sm font-medium">
                  <div className="flex gap-2">
                    <Bot className="h-5 w-5 text-blue-500" /> {`การตั้งค่า AI`}
                  </div>
                </h4>

                <div className="grid gap-6 md:grid-cols-2">

                  <div className="space-y-2">
                    <Label htmlFor="ai-model">โมเดล AI สำหรับสรุป</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger className="w-[100%] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="เลือกโมเดล" />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg shadow-md">
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                        <SelectItem value="claude">Claude</SelectItem>
                      </SelectContent>
                    </Select>

                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="chunk-size">ขนาด Chunk สำหรับ Vector DB</Label>
                    <Select defaultValue="1000">
                      <SelectTrigger className="w-[100%] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-lg shadow-md">
                        <SelectItem value="500">500 tokens</SelectItem>
                        <SelectItem value="1000">1000 tokens</SelectItem>
                        <SelectItem value="1500">1500 tokens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">การเชื่อมต่อ DMS</Label>
                          <p className="text-xs text-muted-foreground">ตัดการเชื่อมต่อ API</p>
                        </div>
                        <Switch className={switch_style} checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
                      </div> */}


                  {/* <div className="space-y-2">
                        <Label htmlFor="chunk-size">ตัดการเชื่อมต่อ DMS</Label>
                        <Select defaultValue="1000">
                          <SelectTrigger className="w-[100%] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-md">
                            <SelectItem value="500">500 tokens</SelectItem>
                            <SelectItem value="1000">1000 tokens</SelectItem>
                            <SelectItem value="1500">1500 tokens</SelectItem>
                          </SelectContent>
                        </Select>
                      </div> */}

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
                <Shield className="h-5 w-5 text-blue-500" />
                ความปลอดภัย
              </CardTitle>
              <CardDescription className="mt-2">การตั้งค่าความปลอดภัยและการเข้าถึง</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between ">
                <div className="space-y-0.5">
                  <Label>เปิดใช้งาน Audit Log</Label>
                  <p className="text-xs text-muted-foreground">บันทึกการกระทำทั้งหมดของผู้ใช้</p>
                </div>
                <Switch className={switch_style} checked={enableAuditLog} onCheckedChange={setEnableAuditLog} />
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="password-policy">นโยบายรหัสผ่าน</Label>
                <Textarea
                  id="password-policy"
                  placeholder="กำหนดนโยบายรหัสผ่าน..."
                  defaultValue="รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                <Textarea
                  id="ip-whitelist"
                  placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                  defaultValue="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                />
                <p className="text-xs text-muted-foreground">รายการ IP ที่อนุญาตให้เข้าถึงระบบ (หนึ่ง IP ต่อบรรทัด)</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="max-login-attempts">จำนวนครั้งการเข้าสู่ระบบสูงสุด</Label>
                  {/* <Input id="max-login-attempts" type="number" defaultValue="5" /> */}

                  <Input
                    id="max-login-attempts"
                    type="number"
                    min="5"
                    max="120"
                    defaultValue="5"
                    className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />


                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockout-duration">ระยะเวลาล็อคบัญชี (นาที)</Label>
                  {/* <Input id="lockout-duration" type="number" defaultValue="30" /> */}
                  <Input
                    id="lockout-duration"
                    type="number"
                    min="5"
                    max="120"
                    defaultValue="30"
                    className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>










        {/* Notifications */}
        {/* <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    การแจ้งเตือน
                  </CardTitle>
                  <CardDescription className="mt-2">กำหนดการแจ้งเตือนและการส่งอีเมล</CardDescription>
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
            </TabsContent> */}

        <TabsContent value="notifications" className="space-y-6">
          <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                <Bell className="h-5 w-5 text-blue-500" />
                การแจ้งเตือน
              </CardTitle>
              <CardDescription  className="text-sm text-gray-500 dark:text-gray-400">
                กำหนดการแจ้งเตือนและการส่งอีเมล
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6 pt-4">
              {/* Enable Notifications */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">เปิดใช้งานการแจ้งเตือน</Label>
                  <p className="text-xs text-muted-foreground">แจ้งเตือนเหตุการณ์สำคัญผ่านอีเมล</p>
                </div>
                <Switch className={switch_style} checked={enableNotifications} onCheckedChange={setEnableNotifications} />
              </div>

              {/* Notification Types */}
              <div className="space-y-4 border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  ประเภทการแจ้งเตือน
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>การอัปโหลดเอกสารเสร็จสิ้น</Label>
                    <Switch className={switch_style} defaultChecked />
                  </div>
                  {/* <div className="flex items-center justify-between">
                        <Label>ความแม่นยำ OCR ต่ำ</Label>
                        <Switch className={switch_style} defaultChecked />
                      </div> */}
                  <div className="flex items-center justify-between">
                    <Label>ระบบขัดข้อง</Label>
                    <Switch className={switch_style} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>การเข้าสู่ระบบผิดปกติ</Label>
                    <Switch className={switch_style} defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>รายงานประจำวัน</Label>
                    <Switch className={switch_style} />
                  </div>
                </div>
              </div>

              {/* Admin Email */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="admin-email" className="text-sm font-medium">
                  อีเมลผู้ดูแลระบบ
                </Label>
                <Input
                  id="admin-email"
                  type="email"
                  defaultValue="admin@ggp.go.th"
                  placeholder="admin@ggp.go.th"
                  // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* SMTP Server */}
              <div className="space-y-2">
                <Label htmlFor="smtp-server" className="text-sm font-medium">
                  SMTP Server
                </Label>
                <Input
                  id="smtp-server"
                  defaultValue="mail.ggp.go.th"
                  // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>









        {/* Backup Settings */}
        {/* <TabsContent value="backup" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    การสำรองข้อมูล
                  </CardTitle>
                  <CardDescription className="mt-2">การตั้งค่าการสำรองข้อมูลและการกู้คืน</CardDescription>
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
            </TabsContent> */}

        <TabsContent value="backup" className="space-y-6">
          <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-4 border-b border-gray-100 dark:border-gray-800">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800 dark:text-gray-100">
                <Database className="h-5 w-5 text-blue-500" />
                การสำรองข้อมูล
              </CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                การตั้งค่าการสำรองข้อมูลและการกู้คืน
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Auto Backup Switch */}
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-sm font-medium">เปิดใช้งานการสำรองข้อมูลอัตโนมัติ</Label>
                  <p className="text-xs text-muted-foreground">สำรองข้อมูลตามกำหนดเวลาที่ตั้งไว้</p>
                </div>
                <Switch className={switch_style} checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
              </div>

              {/* Backup Frequency */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="backup-frequency" className="text-sm font-medium">
                  ความถี่ในการสำรองข้อมูล
                </Label>
                <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                  <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="เลือกความถี่" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md">
                    <SelectItem value="hourly">ทุกชั่วโมง</SelectItem>
                    <SelectItem value="daily">ทุกวัน</SelectItem>
                    <SelectItem value="weekly">ทุกสัปดาห์</SelectItem>
                    <SelectItem value="monthly">ทุกเดือน</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Retention Days */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="backup-retention" className="text-sm font-medium">
                  เก็บข้อมูลสำรอง (วัน)
                </Label>
                <Input
                  id="backup-retention"
                  type="number"
                  defaultValue="365"
                  // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-muted-foreground">จำนวนวันที่เก็บข้อมูลสำรองไว้</p>
              </div>

              {/* Backup Location */}
              <div className="space-y-2 border-t pt-4">
                <Label htmlFor="backup-location" className="text-sm font-medium">
                  ตำแหน่งการสำรองข้อมูล
                </Label>
                <Input
                  id="backup-location"
                  defaultValue="/backup/ai-document-platform"
                  // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 border-t pt-4">
                <Button
                  className="rounded-lg px-4 py-2"
                  onClick={handleBackup}
                >
                  {`สำรองข้อมูลทันที`}
                </Button>
                {/* <Button variant="outline" className="rounded-lg px-4 py-2">
                      ทดสอบการกู้คืน
                    </Button> */}
              </div>
            </CardContent>
          </Card>
        </TabsContent>











        {/* System Status */}
        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5 text-blue-500" />
                สถานะระบบ
              </CardTitle>
              <CardDescription className="mt-2">ตรวจสอบสถานะการทำงานของระบบต่างๆ</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemStatus.map((service, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
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
    )
  }

  const [menuSetting, setmenuSetting] = useState([
    {
      id: 0,
      label: 'ระบบ',
      active: true
    },
    {
      id: 1,
      label: 'ความปลอดภัย',
      active: false
    },
    {
      id: 2,
      label: 'การแจ้งเตือน',
      active: false
    },
    {
      id: 3,
      label: 'สำรองข้อมูล',
      active: false
    },
    {
      id: 4,
      label: 'สถานะระบบ',
      active: false
    },
  ])


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'ตั้งค่า'} />

        <div className="flex flex-1 flex-col gap-6 p-4">
          <div className="grid grid-cols-4 gap-6">
            <div className="flex flex-col flex-1 col-span-1 gap-3 border-r border-[#ebebeb] pr-5">
              {menuSetting?.map((item: any, index: any) => {
                return (
                  <div
                    key={`menu-setting-${index}`}
                    className={`p-2 rounded-md text-sm cursor-pointer duration-200 ease-in-out hover:bg-blue-200/20 ${item?.active == true ? '!bg-blue-500 text-white shadow-md' : 'bg-transparent'}`}
                    onClick={() => {
                      let findItem: any = menuSetting[index];
                      setmenuSetting((pre) => pre?.map((item: any) => item?.id == findItem?.id ? { ...item, active: true } : item?.active == true ? { ...item, active: false } : item))
                    }}
                  >
                    {item?.label}
                  </div>
                )
              })}
            </div>
            <div className="col-span-3">
              {menuSetting?.find((item: any) => item?.label == 'ระบบ')?.active == true &&
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Settings className="h-5 w-5 text-blue-500" />
                          การตั้งค่าระบบ
                        </CardTitle>
                        <CardDescription className="mt-2">กำหนดค่าพื้นฐานของระบบ AI Document Intelligence</CardDescription>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSettings} size="lg">
                          <Save />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </div>
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
                          className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                          className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <p className="text-xs text-muted-foreground">ระยะเวลาที่ผู้ใช้จะถูกออกจากระบบอัตโนมัติ</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="language">ภาษาเริ่มต้น</Label>
                        <Select defaultValue="th">
                          <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-md">
                            <SelectItem value="th">ไทย</SelectItem>
                            <SelectItem value="en">English</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label className="text-sm font-medium">การเชื่อมต่อ DMS</Label>
                          <p className="text-xs text-muted-foreground">ตัดการเชื่อมต่อ API</p>
                        </div>
                        <Switch className={switch_style} checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
                      </div>
                    </div>




                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">
                        <div className="flex gap-2">
                          <Bot className="h-5 w-5 text-blue-500" /> {`การตั้งค่า AI`}
                        </div>
                      </h4>

                      <div className="grid gap-6 md:grid-cols-2">

                        <div className="space-y-2">
                          <Label htmlFor="ai-model">โมเดล AI สำหรับสรุป</Label>
                          <Select defaultValue="gpt-4">
                            <SelectTrigger className="w-[100%] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue placeholder="เลือกโมเดล" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-md">
                              <SelectItem value="gpt-4">GPT-4</SelectItem>
                              <SelectItem value="gpt-3.5">GPT-3.5 Turbo</SelectItem>
                              <SelectItem value="claude">Claude</SelectItem>
                            </SelectContent>
                          </Select>

                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="chunk-size">ขนาด Chunk สำหรับ Vector DB</Label>
                          <Select defaultValue="1000">
                            <SelectTrigger className="w-[100%] bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg shadow-md">
                              <SelectItem value="500">500 tokens</SelectItem>
                              <SelectItem value="1000">1000 tokens</SelectItem>
                              <SelectItem value="1500">1500 tokens</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              }

              {menuSetting?.find((item: any) => item?.label == 'ความปลอดภัย')?.active == true &&
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Shield className="h-5 w-5 text-blue-500" />
                          ความปลอดภัย
                        </CardTitle>
                        <CardDescription className="mt-2">การตั้งค่าความปลอดภัยและการเข้าถึง</CardDescription>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSettings} size="lg">
                          <Save />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between ">
                      <div className="space-y-0.5">
                        <Label>เปิดใช้งาน Audit Log</Label>
                        <p className="text-xs text-muted-foreground">บันทึกการกระทำทั้งหมดของผู้ใช้</p>
                      </div>
                      <Switch className={switch_style} checked={enableAuditLog} onCheckedChange={setEnableAuditLog} />
                    </div>

                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="password-policy">นโยบายรหัสผ่าน</Label>
                      <Textarea
                        id="password-policy"
                        placeholder="กำหนดนโยบายรหัสผ่าน..."
                        defaultValue="รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ ตัวพิมพ์เล็ก ตัวเลข และอักขระพิเศษ"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="ip-whitelist">IP Whitelist</Label>
                      <Textarea
                        id="ip-whitelist"
                        placeholder="192.168.1.0/24&#10;10.0.0.0/8"
                        defaultValue="192.168.1.0/24&#10;10.0.0.0/8&#10;172.16.0.0/12"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"

                      />
                      <p className="text-xs text-muted-foreground">รายการ IP ที่อนุญาตให้เข้าถึงระบบ (หนึ่ง IP ต่อบรรทัด)</p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="max-login-attempts">จำนวนครั้งการเข้าสู่ระบบสูงสุด</Label>
                        {/* <Input id="max-login-attempts" type="number" defaultValue="5" /> */}

                        <Input
                          id="max-login-attempts"
                          type="number"
                          min="5"
                          max="120"
                          defaultValue="5"
                          className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />


                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lockout-duration">ระยะเวลาล็อคบัญชี (นาที)</Label>
                        {/* <Input id="lockout-duration" type="number" defaultValue="30" /> */}
                        <Input
                          id="lockout-duration"
                          type="number"
                          min="5"
                          max="120"
                          defaultValue="30"
                          className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              }

              {menuSetting?.find((item: any) => item?.label == 'การแจ้งเตือน')?.active == true &&
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Bell className="h-5 w-5 text-blue-500" />
                          การแจ้งเตือน
                        </CardTitle>
                        <CardDescription className="mt-2">กำหนดการแจ้งเตือนและการส่งอีเมล</CardDescription>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSettings} size="lg">
                          <Save />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Enable Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">เปิดใช้งานการแจ้งเตือน</Label>
                        <p className="text-xs text-muted-foreground">แจ้งเตือนเหตุการณ์สำคัญผ่านอีเมล</p>
                      </div>
                      <Switch className={switch_style} checked={enableNotifications} onCheckedChange={setEnableNotifications} />
                    </div>

                    {/* Notification Types */}
                    <div className="space-y-4 border-t pt-4">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        ประเภทการแจ้งเตือน
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label>การอัปโหลดเอกสารเสร็จสิ้น</Label>
                          <Switch className={switch_style} defaultChecked />
                        </div>
                        {/* <div className="flex items-center justify-between">
                        <Label>ความแม่นยำ OCR ต่ำ</Label>
                        <Switch className={switch_style} defaultChecked />
                      </div> */}
                        <div className="flex items-center justify-between">
                          <Label>ระบบขัดข้อง</Label>
                          <Switch className={switch_style} defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>การเข้าสู่ระบบผิดปกติ</Label>
                          <Switch className={switch_style} defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label>รายงานประจำวัน</Label>
                          <Switch className={switch_style} />
                        </div>
                      </div>
                    </div>

                    {/* Admin Email */}
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="admin-email" className="text-sm font-medium">
                        อีเมลผู้ดูแลระบบ
                      </Label>
                      <Input
                        id="admin-email"
                        type="email"
                        defaultValue="admin@ggp.go.th"
                        placeholder="admin@ggp.go.th"
                        // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* SMTP Server */}
                    <div className="space-y-2">
                      <Label htmlFor="smtp-server" className="text-sm font-medium">
                        SMTP Server
                      </Label>
                      <Input
                        id="smtp-server"
                        defaultValue="mail.ggp.go.th"
                        // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </CardContent>
                </Card>
              }


              {menuSetting?.find((item: any) => item?.label == 'สำรองข้อมูล')?.active == true &&
                <Card className="rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Database className="h-5 w-5 text-blue-500" />
                          การสำรองข้อมูล
                        </CardTitle>
                        <CardDescription className="mt-2">การตั้งค่าการสำรองข้อมูลและการกู้คืน</CardDescription>
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={handleSaveSettings} size="lg">
                          <Save />
                          บันทึกการตั้งค่า
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-6">
                    {/* Auto Backup Switch */}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-sm font-medium">เปิดใช้งานการสำรองข้อมูลอัตโนมัติ</Label>
                        <p className="text-xs text-muted-foreground">สำรองข้อมูลตามกำหนดเวลาที่ตั้งไว้</p>
                      </div>
                      <Switch className={switch_style} checked={enableAutoBackup} onCheckedChange={setEnableAutoBackup} />
                    </div>

                    {/* Backup Frequency */}
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="backup-frequency" className="text-sm font-medium">
                        ความถี่ในการสำรองข้อมูล
                      </Label>
                      <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                        <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                          <SelectValue placeholder="เลือกความถี่" />
                        </SelectTrigger>
                        <SelectContent className="rounded-lg shadow-md">
                          <SelectItem value="hourly">ทุกชั่วโมง</SelectItem>
                          <SelectItem value="daily">ทุกวัน</SelectItem>
                          <SelectItem value="weekly">ทุกสัปดาห์</SelectItem>
                          <SelectItem value="monthly">ทุกเดือน</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Retention Days */}
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="backup-retention" className="text-sm font-medium">
                        เก็บข้อมูลสำรอง (วัน)
                      </Label>
                      <Input
                        id="backup-retention"
                        type="number"
                        defaultValue="365"
                        // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <p className="text-xs text-muted-foreground">จำนวนวันที่เก็บข้อมูลสำรองไว้</p>
                    </div>

                    {/* Backup Location */}
                    <div className="space-y-2 border-t pt-4">
                      <Label htmlFor="backup-location" className="text-sm font-medium">
                        ตำแหน่งการสำรองข้อมูล
                      </Label>
                      <Input
                        id="backup-location"
                        defaultValue="/backup/ai-document-platform"
                        // className="rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 border-t pt-4">
                      <Button
                        className="rounded-lg px-4 py-2"
                        onClick={handleBackup}
                      >
                        {`สำรองข้อมูลทันที`}
                      </Button>
                      {/* <Button variant="outline" className="rounded-lg px-4 py-2">
                      ทดสอบการกู้คืน
                    </Button> */}
                    </div>
                  </CardContent>
                </Card>
              }

              {menuSetting?.find((item: any) => item?.label == 'สถานะระบบ')?.active == true &&
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Server className="h-5 w-5 text-blue-500" />
                          สถานะระบบ
                        </CardTitle>
                        <CardDescription className="mt-2">ตรวจสอบสถานะการทำงานของระบบต่างๆ</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {systemStatus.map((service, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg bg-white">
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
              }

            </div>
          </div>
          {/* Save Button */}
          {/* <div className="flex justify-end">
            <Button onClick={handleSaveSettings} size="lg">
              บันทึกการตั้งค่า
            </Button>
          </div> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

