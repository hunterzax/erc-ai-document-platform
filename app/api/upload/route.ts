import { NextRequest, NextResponse } from 'next/server'

const OCR_API_ENDPOINT = "https://api.opentyphoon.ai/v1/ocr"
const OCR_API_TOKEN = "sk-KYjuo3A5Mqk2N7v4WSX9LpeZeoLemFywBq1lDKMOC3LMxWUT"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่อัพโหลด' },
        { status: 400 }
      )
    }

    // สร้าง FormData สำหรับส่งไปยัง OCR API
    const ocrFormData = new FormData()
    ocrFormData.append('file', file)

    // ส่งไฟล์ไปยัง OCR service
    const ocrResponse = await fetch(OCR_API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OCR_API_TOKEN}`,
      },
      body: ocrFormData,
    })

    if (!ocrResponse.ok) {
      const errorText = await ocrResponse.text()
      console.error('OCR API Error:', errorText)
      return NextResponse.json(
        { error: 'เกิดข้อผิดพลาดในการประมวลผล OCR' },
        { status: ocrResponse.status }
      )
    }

    const ocrResult = await ocrResponse.json()

    // ส่งผลลัพธ์กลับไป
    return NextResponse.json({
      success: true,
      message: 'อัพโหลดและประมวลผล OCR สำเร็จ',
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        ocrResult: ocrResult
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการอัพโหลดไฟล์' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Upload API endpoint' },
    { status: 200 }
  )
}
