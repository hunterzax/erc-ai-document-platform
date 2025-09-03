"use client"

import type React from "react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Download, FileText, Calendar, Tag, Brain, Eye, Clock, Star, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { AppHeader } from "@/components/header-bar"
import { Label } from "@/components/ui/label"

const axios = require('axios');

const URL_SEARCH = process.env.NEXT_PUBLIC_N8N_BASE_URL_SEARCH;
const URL_RAW_DOC = process.env.NEXT_PUBLIC_RAW_DOC;

interface SearchResult {
  id: string
  title: string
  type: string
  year: string
  category: string
  relevanceScore: number
  summary: string
  content: string
  lastModified: string
  tags: string[]
}

const mockSearchResults: SearchResult[] = [
  {
    id: "1",
    title: "พระราชบัญญัติการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560",
    type: "กฎหมาย",
    year: "2560",
    category: "การจัดซื้อจัดจ้าง",
    relevanceScore: 95,
    summary: "กฎหมายที่ควบคุมการจัดซื้อจัดจ้างของหน่วยงานภาครัฐ เพื่อให้เกิดความโปร่งใสและประสิทธิภาพ",
    content: "พระราชบัญญัตินี้มีวัตถุประสงค์เพื่อให้การจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐเป็นไปอย่างมีประสิทธิภาพ...",
    lastModified: "2024-01-15",
    tags: ["จัดซื้อ", "จัดจ้าง", "ภาครัฐ", "โปร่งใส"],
  },
  {
    id: "2",
    title: "ระเบียบกระทรวงการคลังว่าด้วยการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ พ.ศ. 2560",
    type: "ระเบียบ",
    year: "2560",
    category: "การจัดซื้อจัดจ้าง",
    relevanceScore: 88,
    summary: "ระเบียบปฏิบัติสำหรับการดำเนินการจัดซื้อจัดจ้างตามพระราชบัญญัติ",
    content: "ระเบียบนี้กำหนดหลักเกณฑ์และวิธีการปฏิบัติในการจัดซื้อจัดจ้างและการบริหารพัสดุภาครัฐ...",
    lastModified: "2024-01-10",
    tags: ["ระเบียบ", "ปฏิบัติ", "จัดซื้อ"],
  },
  {
    id: "3",
    title: "พระราชบัญญัติข้อมูลข่าวสารของราชการ พ.ศ. 2540",
    type: "กฎหมาย",
    year: "2540",
    category: "ข้อมูลข่าวสาร",
    relevanceScore: 76,
    summary: "กฎหมายเกี่ยวกับสิทธิของประชาชนในการเข้าถึงข้อมูลข่าวสารของราชการ",
    content: "พระราชบัญญัตินี้มีวัตถุประสงค์เพื่อให้ประชาชนมีสิทธิในการรับรู้ข้อมูลข่าวสารของราชการ...",
    lastModified: "2024-01-08",
    tags: ["ข้อมูล", "ข่าวสาร", "สิทธิ", "ประชาชน"],
  },
]

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchType, setSearchType] = useState("all")
  const [documentType, setDocumentType] = useState("all")
  const [documentYear, setDocumentYear] = useState("all")
  const [documentCategory, setDocumentCategory] = useState("all")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchClick, setIsSearchClick] = useState(false)
  const [activeTab, setActiveTab] = useState("keyword")
  const [sourceData, setSourceData] = useState<any>([])
  const [sourceDataSelect, setSourceDataSelect] = useState<any>("")
  const [thresholdSelect, setThresholdSelect] = useState<any>("0.9")

  const handleSearch = async () => {
    setIsSearching(true)
    setIsSearchClick(true)

    // search?q=กรรมการนโยบายพลังงานแห่งชาติ&source=ตัวอย่างใบคำพิพากษา.pdf&limit=100
    // http://10.100.92.20:4600/qdrant/search?q=ราคา&source=ตัวอย่างใบคำพิพากษา.pdf&limit=100&score_threshold=0.9

    // summaryType
    let config = {
      method: 'get',
      maxBodyLength: Infinity,
      // url: `${URL_SEARCH}?q=${searchQuery}&limit=100&score_threshold=0.9`,
      url: `${URL_SEARCH}?q=${searchQuery}&limit=100&score_threshold=${thresholdSelect}&source=${sourceDataSelect}`,
      headers: {}
    };

    let res_search_result = await axios.request(config)
    // console.log('res_search_result', res_search_result)

    // กรอง source ซ้ำออก
    const uniqueBySource = res_search_result?.data?.items?.filter((item: any, index: any, self: any) => index === self.findIndex((t: any) => t.source === item.source));

    // Simulate search delay
    setTimeout(() => {
      if (searchQuery.trim()) {
        // setSearchResults(mockSearchResults)

        setSearchResults(res_search_result?.data?.items)
        // setSearchResults(uniqueBySource)
      } else {
        setSearchResults([])
      }
      setIsSearching(false)
    }, 1000)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  useEffect(() => {
    if (searchQuery == '') {
      setIsSearchClick(false)
    }
  }, [searchQuery])


  const fetchData = async () => {
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        // url: `${URL_SEARCH}?q=${searchQuery}&limit=100&score_threshold=0.9`,
        url: `${URL_RAW_DOC}`,
        headers: {}
      };

      let res_all_docs_result = await axios?.request(config)
      // console.log('res_all_docs_result', res_all_docs_result)

      // ลบซ้ำ
      const seen = new Set<string>();
      const uniqueDocs2 = res_all_docs_result?.data?.items?.filter((doc: any) => {
        if (seen.has(doc.file_name)) return false;
        seen.add(doc.file_name);
        return true;
      });

      // setSourceData(res_all_docs_result?.data?.items)
      setSourceData(uniqueDocs2)
    } catch (error) {
      console.log(">>>> error")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // #region copy to clipboard
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const handleCopy = async (text: string, id: number) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500) // reset state หลัง 1.5 วิ
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text
    const regex = new RegExp(`(${query})`, "gi")
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>')
  }

  const exportResults = (format: string) => {
    console.log(`Exporting results as ${format}`)
    // Implementation for export functionality
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'ค้นหาและวิเคราะห์'} />

        <div className="flex flex-1 flex-col gap-6 p-4 anifade">
          {/* Search Interface */}
          <Card>
            <CardHeader>
              <CardTitle>ค้นหาเอกสาร</CardTitle>
              <CardDescription>ค้นหาเอกสารกฎหมายและระเบียบด้วย AI และ Semantic Search</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Main Search Bar */}
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="ค้นหาเอกสาร เช่น 'การจัดซื้อจัดจ้าง' หรือ 'สิทธิบัตร'..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleKeyPress}
                      // className="pl-10 border border-[#dedede] placeholder:opacity-40 text-sm"
                      className="pl-10 w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder:opacity-40"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching}>
                    {isSearching ? "กำลังค้นหา..." : "ค้นหา"}
                  </Button>
                </div>




                <div className="grid gap-6 md:grid-cols-2">

                  <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="backup-frequency" className="text-sm font-medium">
                      ข้อมูลเอกสารที่ต้องการค้นหา
                    </Label>
                    <Select value={sourceDataSelect} onValueChange={setSourceDataSelect}>
                      <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="เลือกเอกสาร" />
                      </SelectTrigger>

                      <SelectContent className="rounded-lg shadow-md">
                        {sourceData?.map((item: any, index: any) => (
                          <SelectItem key={index} value={item?.file_name}>{item.title}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>


                  <div className="space-y-2 border-t pt-4">
                    <Label htmlFor="backup-frequency" className="text-sm font-medium">
                      ความละเอียดในการค้นหา
                    </Label>
                    <Select value={thresholdSelect} onValueChange={setThresholdSelect}>
                      <SelectTrigger className="w-full bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                        <SelectValue placeholder="ระบุ threshold" />
                      </SelectTrigger>

                      <SelectContent className="rounded-lg shadow-md">
                        <SelectItem value="0.1">0.1</SelectItem>
                        <SelectItem value="0.2">0.2</SelectItem>
                        <SelectItem value="0.3">0.3</SelectItem>
                        <SelectItem value="0.4">0.4</SelectItem>
                        <SelectItem value="0.5">0.5</SelectItem>
                        <SelectItem value="0.6">0.6</SelectItem>
                        <SelectItem value="0.7">0.7</SelectItem>
                        <SelectItem value="0.8">0.8</SelectItem>
                        <SelectItem value="0.9">0.9</SelectItem>
                      </SelectContent>

                    </Select>
                  </div>
                </div>






                {/* Filters */}
                {/* <div className="grid gap-4 md:grid-cols-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">ประเภทเอกสาร</label>
                    <Select value={documentType} onValueChange={setDocumentType}>
                      <SelectTrigger className="w-full border border-[#dedede]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        <SelectItem value="law">กฎหมาย</SelectItem>
                        <SelectItem value="regulation">ระเบียบ</SelectItem>
                        <SelectItem value="announcement">ประกาศ</SelectItem>
                        <SelectItem value="circular">หนังสือเวียน</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">ปี พ.ศ.</label>
                    <Select value={documentYear} onValueChange={setDocumentYear}>
                      <SelectTrigger className="w-full border border-[#dedede]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        {Array.from({ length: 20 }, (_, i) => 2567 - i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">หมวดหมู่</label>
                    <Select value={documentCategory} onValueChange={setDocumentCategory}>
                      <SelectTrigger className="w-full border border-[#dedede]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">ทั้งหมด</SelectItem>
                        <SelectItem value="procurement">การจัดซื้อจัดจ้าง</SelectItem>
                        <SelectItem value="finance">การเงินการคลัง</SelectItem>
                        <SelectItem value="personnel">บุคลากร</SelectItem>
                        <SelectItem value="information">ข้อมูลข่าวสาร</SelectItem>
                        <SelectItem value="intellectual">ทรัพย์สินทางปัญญา</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-end">
                    <Button variant="outline" className="w-full bg-transparent">
                      <Filter className="h-4 w-4 mr-2" />
                      ตัวกรองเพิ่มเติม
                    </Button>
                  </div>
                </div> */}



              </div>
            </CardContent>
          </Card>








          {/* Search Results */}
          {/* {searchResults.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>ผลการค้นหา</CardTitle>
                    <CardDescription>พบ {searchResults.length} เอกสารที่เกี่ยวข้อง</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => exportResults("pdf")}>
                      <Download className="h-4 w-4 mr-2" />
                      PDF
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportResults("excel")}>
                      <Download className="h-4 w-4 mr-2" />
                      Excel
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => exportResults("word")}>
                      <Download className="h-4 w-4 mr-2" />
                      Word
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="keyword">Keyword Search</TabsTrigger>
                    <TabsTrigger value="semantic">Semantic Search</TabsTrigger>
                    <TabsTrigger value="summary">AI Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="keyword" className="space-y-4 mt-4">
                    {searchResults.map((result) => (
                      <Card key={result.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold mb-2 text-balance">{result.title}</h3>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  {result.type}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  พ.ศ. {result.year}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Tag className="h-4 w-4" />
                                  {result.category}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {result.lastModified}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">
                                <Star className="h-3 w-3 mr-1" />
                                {result.relevanceScore}%
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 text-pretty">{result.summary}</p>

                          <div className="flex items-center justify-between">
                            <div className="flex flex-wrap gap-1">
                              {result.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                ดูเอกสาร
                              </Button>
                              <Button variant="outline" size="sm">
                                <Brain className="h-4 w-4 mr-2" />
                                สรุปด้วย AI
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="semantic" className="space-y-4 mt-4">
                    <div className="text-center py-8">
                      <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Semantic Search</h3>
                      <p className="text-muted-foreground">ค้นหาด้วยความหมายและบริบท ไม่เพียงแค่คำที่ตรงกัน</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="summary" className="space-y-4 mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Brain className="h-5 w-5" />
                          สรุปผลการค้นหาด้วย AI
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">สรุปเนื้อหาหลัก</h4>
                            <p className="text-sm text-muted-foreground text-pretty">
                              จากการค้นหาเกี่ยวกับ "{searchQuery}" พบเอกสารที่เกี่ยวข้องกับการจัดซื้อจัดจ้างภาครัฐ
                              ซึ่งครอบคลุมทั้งกฎหมายหลักและระเบียบปฏิบัติ โดยมุ่งเน้นความโปร่งใสและประสิทธิภาพ
                              ในการดำเนินงานของหน่วยงานภาครัฐ
                            </p>
                          </div>

                          <div className="p-4 bg-muted rounded-lg">
                            <h4 className="font-semibold mb-2">ประเด็นสำคัญ</h4>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              <li>• กฎหมายหลักคือ พรบ.การจัดซื้อจัดจ้าง พ.ศ. 2560</li>
                              <li>• มีระเบียบปฏิบัติที่เกี่ยวข้องจากกระทรวงการคลัง</li>
                              <li>• เน้นหลักการโปร่งใสและตรวจสอบได้</li>
                              <li>• มีกระบวนการที่ชัดเจนสำหรับการดำเนินงาน</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )} */}







          {
            searchQuery && searchResults.length > 0 && !isSearching && (
              <div className="w-full space-y-4">
                {searchResults.map((item: any, idx) => (
                  <Card key={item.id} className="w-full shadow-sm hover:shadow-md transition rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <CardTitle className="text-base">{item.source}</CardTitle>
                      </div>


                      {/* <CardDescription className="text-sm text-gray-500">
                        คะแนน: {item.score.toFixed(3)} | หน้า: {item.pages?.join(", ") || "-"}
                      </CardDescription> */}


                      <div className="flex items-center gap-3">
                        <CardDescription className="text-sm text-gray-500">
                          คะแนน: {item.score.toFixed(3)} | หน้า: {item.pages?.join(", ") || "-"}
                        </CardDescription>

                        {/* <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCopy(item.content, item.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedId === item.id ? "คัดลอกแล้ว" : "คัดลอก"}
                        </Button> */}

                        <Button
                          variant={copiedId === item.id ? "default" : "outline"}
                          size="sm"
                          className={copiedId === item.id ? "bg-[#87B14B] hover:bg-green-600 text-white" : ""}
                          onClick={() => handleCopy(item.content, item.id)}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          {copiedId === item.id ? "คัดลอกแล้ว" : "คัดลอก"}
                        </Button>
                      </div>
                    </CardHeader>

                    <CardContent className="p-4">
                      <pre className="whitespace-pre-wrap break-words text-sm text-gray-800 max-h-40 overflow-y-auto">
                        {item.content}
                      </pre>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          }





          {/* No Results */}
          {searchResults.length === 0 && isSearchClick && (
            <Card>
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">ไม่พบผลการค้นหา</h3>
                <p className="text-muted-foreground">ลองใช้คำค้นหาอื่น หรือปรับเปลี่ยนตัวกรองการค้นหา</p>
              </CardContent>
            </Card>
          )}







        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
