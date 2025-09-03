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
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  UserPlus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Shield,
  ShieldCheck,
  Eye,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react"
import { useState } from "react"
import { AppHeader } from "@/components/header-bar"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "analyst" | "viewer"
  department: string
  status: "active" | "inactive" | "suspended"
  lastLogin: string
  createdAt: string
  loginCount: number
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "นายสมชาย ใจดี",
    email: "somchai@ggp.go.th",
    role: "admin",
    department: "สำนักงานเลขาธิการ",
    status: "active",
    lastLogin: "2024-01-15 14:30",
    createdAt: "2023-06-01",
    loginCount: 245,
  },
  {
    id: "2",
    name: "นางสาวสุดา รักงาน",
    email: "suda@ggp.go.th",
    role: "analyst",
    department: "กองกฎหมาย",
    status: "active",
    lastLogin: "2024-01-15 09:15",
    createdAt: "2023-08-15",
    loginCount: 189,
  },
  {
    id: "3",
    name: "นายประเสริฐ ขยันดี",
    email: "prasert@ggp.go.th",
    role: "viewer",
    department: "กองวิชาการ",
    status: "active",
    lastLogin: "2024-01-14 16:45",
    createdAt: "2023-09-20",
    loginCount: 156,
  },
  {
    id: "4",
    name: "นางมาลี สบายใจ",
    email: "malee@ggp.go.th",
    role: "analyst",
    department: "กองกฎหมาย",
    status: "inactive",
    lastLogin: "2024-01-10 11:20",
    createdAt: "2023-07-10",
    loginCount: 98,
  },
  {
    id: "5",
    name: "นายวิชัย มั่นคง",
    email: "wichai@ggp.go.th",
    role: "viewer",
    department: "กองบริหาร",
    status: "suspended",
    lastLogin: "2024-01-05 08:30",
    createdAt: "2023-10-05",
    loginCount: 67,
  },
]

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "viewer" as const,
    department: "",
  })

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesRole && matchesStatus
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="h-4 w-4" />
      case "analyst":
        return <Shield className="h-4 w-4" />
      case "viewer":
        return <Eye className="h-4 w-4" />
      default:
        return null
    }
  }

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "destructive",
      analyst: "default",
      viewer: "secondary",
    } as const

    const labels = {
      admin: "ผู้ดูแลระบบ",
      analyst: "นักวิเคราะห์",
      viewer: "ผู้ใช้งานทั่วไป",
    }

    return (
      <Badge variant={variants[role as keyof typeof variants]}>
        {getRoleIcon(role)}
        <span className="ml-1">{labels[role as keyof typeof labels]}</span>
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            ใช้งาน
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary">
            <Clock className="h-3 w-3 mr-1" />
            ไม่ใช้งาน
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            ระงับ
          </Badge>
        )
      default:
        return null
    }
  }

  const handleAddUser = () => {
    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      status: "active",
      lastLogin: "-",
      createdAt: new Date().toISOString().split("T")[0],
      loginCount: 0,
    }
    setUsers([...users, user])
    setNewUser({ name: "", email: "", role: "viewer", department: "" })
    setIsAddUserOpen(false)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserOpen(true)
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(users.map((user) => (user.id === selectedUser.id ? selectedUser : user)))
      setIsEditUserOpen(false)
      setSelectedUser(null)
    }
  }

  const handleDeleteUser = (userId: string) => {
    setUsers(users.filter((user) => user.id !== userId))
  }

  const handleStatusChange = (userId: string, newStatus: User["status"]) => {
    setUsers(users.map((user) => (user.id === userId ? { ...user, status: newStatus } : user)))
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'จัดการผู้ใช้'} />

        <div className="flex flex-1 flex-col gap-6 p-4 anifade">

          {/* User Statistics */}
          {/* <div className="grid gap-4 md:grid-cols-4">
            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 ">
                <CardTitle className="text-xl font-semibold">ผู้ใช้ทั้งหมด</CardTitle>
                <Users className="h-7 w-7 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-[40px] font-bold">{users.length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-semibold">ผู้ใช้ที่ใช้งาน</CardTitle>
                <CheckCircle className="h-7 w-7 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-[40px] font-bold">{users.filter((u) => u.status === "active").length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-semibold">ผู้ดูแลระบบ</CardTitle>
                <ShieldCheck className="h-7 w-7 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-[40px] font-bold">{users.filter((u) => u.role === "admin").length}</div>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-xl font-semibold">นักวิเคราะห์</CardTitle>
                <Shield className="h-7 w-7 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-[40px] font-bold">{users.filter((u) => u.role === "analyst").length}</div>
              </CardContent>
            </Card>
          </div> */}

          <div className="grid gap-4 md:grid-cols-4">
            {/** Users Card */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">ผู้ใช้ทั้งหมด</CardTitle>
                <Users className="h-7 w-7 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">{users.length}</div>
              </CardContent>
            </Card>

            {/** Active Users Card */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">ผู้ใช้ที่ใช้งาน</CardTitle>
                <CheckCircle className="h-7 w-7 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">{users.filter((u) => u.status === "active").length}</div>
              </CardContent>
            </Card>

            {/** Admin Card */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">ผู้ดูแลระบบ</CardTitle>
                <ShieldCheck className="h-7 w-7 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">{users.filter((u) => u.role === "admin").length}</div>
              </CardContent>
            </Card>

            {/** Analyst Card */}
            <Card className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold text-gray-800">นักวิเคราะห์</CardTitle>
                <Shield className="h-7 w-7 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-gray-900">{users.filter((u) => u.role === "analyst").length}</div>
              </CardContent>
            </Card>
          </div>






          {/* User Management */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>รายการผู้ใช้</CardTitle>
                  <CardDescription>จัดการผู้ใช้และสิทธิ์การเข้าถึงระบบ</CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      เพิ่มผู้ใช้
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>เพิ่มผู้ใช้ใหม่</DialogTitle>
                      <DialogDescription>กรอกข้อมูลผู้ใช้ใหม่และกำหนดสิทธิ์การเข้าถึง</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">ชื่อ-นามสกุล</Label>
                        <Input
                          id="name"
                          value={newUser.name}
                          onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                          placeholder="นายสมชาย ใจดี"
                          className="w-full border border-[#dedede] placeholder:opacity-40"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">อีเมล</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          placeholder="somchai@ggp.go.th"
                          className="w-full border border-[#dedede] placeholder:opacity-40"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="role">บทบาท</Label>
                        <Select
                          value={newUser?.role}
                          onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}
                        >
                          <SelectTrigger className="w-full border border-[#dedede] placeholder:opacity-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="rounded-lg shadow-md">
                            <SelectItem value="viewer">ผู้ใช้งานทั่วไป</SelectItem>
                            <SelectItem value="analyst">นักวิเคราะห์</SelectItem>
                            <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="department">หน่วยงาน</Label>
                        <Input
                          id="department"
                          value={newUser.department}
                          onChange={(e) => setNewUser({ ...newUser, department: e.target.value })}
                          placeholder="สำนักงานเลขาธิการ"
                          className="w-full border border-[#dedede] placeholder:opacity-40"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="outline" className="hover:bg-transparent hover:text-black" onClick={() => setIsAddUserOpen(false)}>
                        ยกเลิก
                      </Button>
                      <Button onClick={handleAddUser}>เพิ่มผู้ใช้</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาผู้ใช้..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border border-[#dedede] placeholder:opacity-40"
                  />
                </div>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="w-40 border border-[#dedede]">
                    <SelectValue placeholder="บทบาท" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md">
                    <SelectItem value="all">ทุกบทบาท</SelectItem>
                    <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                    <SelectItem value="analyst">นักวิเคราะห์</SelectItem>
                    <SelectItem value="viewer">ผู้ดู</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40 border border-[#dedede]">
                    <SelectValue placeholder="สถานะ" />
                  </SelectTrigger>
                  <SelectContent className="rounded-lg shadow-md">
                    <SelectItem value="all">ทุกสถานะ</SelectItem>
                    <SelectItem value="active">ใช้งาน</SelectItem>
                    <SelectItem value="inactive">ไม่ใช้งาน</SelectItem>
                    <SelectItem value="suspended">ระงับ</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <div className="border rounded-lg">
                <Table className="bg-white rounded-lg">
                  <TableHeader>
                    <TableRow>
                      <TableHead>ผู้ใช้</TableHead>
                      <TableHead>บทบาท</TableHead>
                      <TableHead>หน่วยงาน</TableHead>
                      <TableHead>สถานะ</TableHead>
                      <TableHead>เข้าสู่ระบบล่าสุด</TableHead>
                      <TableHead className="text-center">จำนวนครั้ง</TableHead>
                      <TableHead className="text-center w-[130px]">การดำเนินการ</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center h-full">
                            {getRoleBadge(user.role)}
                          </div>
                        </TableCell>
                        <TableCell>{user.department}</TableCell>
                        <TableCell>
                          <div className="flex justify-center items-center h-full">
                            {getStatusBadge(user.status)}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">{user.lastLogin}</TableCell>
                        <TableCell className="text-center">{user.loginCount}</TableCell>
                        <TableCell className="text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                <Edit className="mr-2 h-4 w-4" />
                                แก้ไข
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              {user.status === "active" ? (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "suspended")}>
                                  <XCircle className="mr-2 h-4 w-4" />
                                  ระงับการใช้งาน
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => handleStatusChange(user.id, "active")}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  เปิดใช้งาน
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" />
                                ลบ
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Edit User Dialog */}
          <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
                <DialogDescription>แก้ไขข้อมูลและสิทธิ์การเข้าถึงของผู้ใช้</DialogDescription>
              </DialogHeader>
              {selectedUser && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name">ชื่อ-นามสกุล</Label>
                    <Input
                      id="edit-name"
                      value={selectedUser.name}
                      onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                      className="w-full border border-[#dedede]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email">อีเมล</Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                      className="w-full border border-[#dedede]"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-role">บทบาท</Label>
                    <Select
                      value={selectedUser.role}
                      onValueChange={(value: any) => setSelectedUser({ ...selectedUser, role: value })}
                    >
                      <SelectTrigger className="w-full border border-[#dedede]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="viewer">ผู้ใช้งานทั่วไป</SelectItem>
                        <SelectItem value="analyst">นักวิเคราะห์</SelectItem>
                        <SelectItem value="admin">ผู้ดูแลระบบ</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="edit-department">หน่วยงาน</Label>
                    <Input
                      id="edit-department"
                      value={selectedUser.department}
                      onChange={(e) => setSelectedUser({ ...selectedUser, department: e.target.value })}
                      className="w-full border border-[#dedede]"
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button variant="outline" className="hover:bg-transparent hover:text-black" onClick={() => setIsEditUserOpen(false)}>
                  ยกเลิก
                </Button>
                <Button onClick={handleUpdateUser}>บันทึก</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
