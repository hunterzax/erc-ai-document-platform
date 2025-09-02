"use client"

import type * as React from "react"
import {
  FileText,
  Upload,
  Search,
  Brain,
  BarChart3,
  Users,
  Settings,
  Home,
  ChevronUp,
  User2,
  MessageCircle,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { NavLink } from 'react-router-dom';
import { useEffect, useState } from "react"
import Image from "next/image";

// Navigation items for the AI Document Intelligence Platform
const data = {
  navMain: [
    {
      title: "แดชบอร์ด",
      url: "/",
      icon: Home,
    },
    {
      title: "อัปโหลดเอกสาร",
      url: "/upload",
      icon: Upload,
    },
    {
      title: "ค้นหาและวิเคราะห์",
      url: "/search",
      icon: Search,
    },
    {
      title: "สรุปด้วย AI",
      url: "/summarize",
      icon: Brain,
    },
    {
      title: "แชท AI",
      url: "/chat",
      icon: MessageCircle,
    },
    {
      title: "รายงาน",
      url: "/reports",
      icon: BarChart3,
    },
    {
      title: "จัดการผู้ใช้",
      url: "/users",
      icon: Users,
    },
    {
      title: "ตั้งค่า",
      url: "/settings",
      icon: Settings,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [currentPath, setCurrentPath] = useState<string>('');

  useEffect(() => {
    setCurrentPath(window.location.pathname);  // ตั้งค่า path ปัจจุบันเมื่อโหลดคอมโพเนนต์
  }, []);

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* <div className="w-64 bg-sidebar border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center">
              <FileText className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-sm">AI Document</span>
              <span className="text-xs text-muted-foreground">Intelligence Platform</span>
            </div>
          </div>
        </div>
      </div> */}
      <SidebarHeader className="border-b border-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:!bg-transparent !text-black">
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {/* <div className="w-8 h-8 bg-sidebar-primary rounded-lg flex items-center justify-center"> */}
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center">
                    {/* <FileText className="w-4 h-4 text-sidebar-primary-foreground" /> */}
                    <Image
                      src={`/icon/ERC_logo.png`}
                      width={200}
                      height={30}
                      alt={`/icon/ERC_logo.png`}
                      priority
                    />
                  </div>
                  <div className="flex flex-col">
                    {/* <span className="font-semibold text-sm">AI Document</span>
                    <span className="text-xs text-muted-foreground">Intelligence Platform</span> */}
                    <span className="font-semibold text-sm">ศูนย์ข้อมูลพลังงาน</span>
                    <span className="text-xs text-muted-foreground">AI Intelligence Platform</span>
                  </div>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>


      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>เมนูหลัก</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} className={`${currentPath == item?.url ? '!bg-blue-500 text-white' : 'bg-transparent hover:!bg-gray-200 !text-black'} px-3 py-2`}>
                      <item.icon />
                      <span className="w-full">{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-gray-100 data-[state=open]:text-black hover:bg-gray-100 hover:text-black active:bg-gray-100 focus:bg-gray-100"
                >
                  <User2 className="size-4" />
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">ผู้ดูแลระบบ</span>
                    <span className="truncate text-xs">admin@erc.go.th</span>
                  </div>
                  <ChevronUp className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <span>โปรไฟล์</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>ออกจากระบบ</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
