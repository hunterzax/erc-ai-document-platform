import { NextRequest, NextResponse } from 'next/server'

const OCR_API_ENDPOINT = "https://api.opentyphoon.ai/v1/ocr"
const OCR_API_TOKEN = "sk-KYjuo3A5Mqk2N7v4WSX9LpeZeoLemFywBq1lDKMOC3LMxWUT"

// API endpoints สำหรับการสกัดข้อมูลขั้นสูง
const EXTRACTION_APIS = {
  // OCR สำหรับข้อความ
  text: {
    endpoint: "https://api.opentyphoon.ai/v1/ocr",
    token: OCR_API_TOKEN
  },
  // Object detection (ถ้ามี)
  objects: {
    endpoint: "https://api.opentyphoon.ai/v1/detect", // ตัวอย่าง endpoint
    token: OCR_API_TOKEN
  },
  // Table extraction
  tables: {
    endpoint: "https://api.opentyphoon.ai/v1/extract-tables",
    token: OCR_API_TOKEN
  },
  // Form fields extraction
  forms: {
    endpoint: "https://api.opentyphoon.ai/v1/extract-forms",
    token: OCR_API_TOKEN
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const extractionType = formData.get('type') as string || 'all'
    const params = formData.get('params') as string

    if (!file) {
      return NextResponse.json(
        { error: 'ไม่พบไฟล์ที่อัพโหลด' },
        { status: 400 }
      )
    }

    // ตรวจสอบประเภทไฟล์
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'รองรับเฉพาะไฟล์รูปภาพและ PDF' },
        { status: 400 }
      )
    }

    const results: any = {}
    const errors: string[] = []

    // สกัดข้อความ (OCR) - ปรับปรุงตามรูปแบบใหม่
    if (extractionType === 'all' || extractionType === 'text') {
      try {
        const ocrResult = await extractTextAdvanced(file, params)
        results.text = ocrResult
      } catch (error) {
        errors.push('การสกัดข้อความล้มเหลว')
        console.error('OCR Error:', error)
      }
    }

    // สกัดตาราง
    if (extractionType === 'all' || extractionType === 'tables') {
      try {
        const tableResult = await extractTables(file)
        results.tables = tableResult
      } catch (error) {
        errors.push('การสกัดตารางล้มเหลว')
        console.error('Table Extraction Error:', error)
      }
    }

    // สกัดฟอร์ม
    if (extractionType === 'all' || extractionType === 'forms') {
      try {
        const formResult = await extractForms(file)
        results.forms = formResult
      } catch (error) {
        errors.push('การสกัดฟอร์มล้มเหลว')
        console.error('Form Extraction Error:', error)
      }
    }

    // สกัด object detection
    if (extractionType === 'all' || extractionType === 'objects') {
      try {
        const objectResult = await detectObjects(file)
        results.objects = objectResult
      } catch (error) {
        errors.push('การตรวจจับ object ล้มเหลว')
        console.error('Object Detection Error:', error)
      }
    }

    // สกัดข้อมูลเพิ่มเติม
    if (extractionType === 'all') {
      try {
        const metadataResult = await extractMetadata(file)
        results.metadata = metadataResult
      } catch (error) {
        console.error('Metadata Extraction Error:', error)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'การสกัดข้อมูลเสร็จสิ้น',
      data: {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        extractionType: extractionType,
        results: results,
        errors: errors,
        timestamp: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: 'เกิดข้อผิดพลาดในการสกัดข้อมูล' },
      { status: 500 }
    )
  }
}

// ฟังก์ชันสกัดข้อความขั้นสูง (ปรับปรุงตามรูปแบบใหม่)
async function extractTextAdvanced(file: File, params?: string) {
  const formData = new FormData()
  formData.append('file', file)
  
  // ใช้ parameters ที่ส่งมา หรือใช้ค่า default
  let extractionParams
  if (params) {
    try {
      extractionParams = JSON.parse(params)
    } catch (e) {
      console.warn('Invalid params JSON, using default values')
      extractionParams = getDefaultParams()
    }
  } else {
    extractionParams = getDefaultParams()
  }
  
  // แก้ไขปัญหา pages parameter - ใช้ [] แทน [null]
  if (extractionParams.pages && extractionParams.pages.includes(null)) {
    extractionParams.pages = [] // ส่ง array ว่างเพื่อประมวลผลทุกหน้า
  }
  
  // เพิ่ม parameters ลงใน formData
  formData.append('params', JSON.stringify(extractionParams))

  const response = await fetch(EXTRACTION_APIS.text.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EXTRACTION_APIS.text.token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error('OCR API Error:', response.status, errorText)
    throw new Error(`OCR API error: ${response.status}`)
  }

  const result = await response.json()
  
  // ประมวลผลผลลัพธ์ตามรูปแบบใหม่
  return processOCRResult(result, file.name)
}

// ฟังก์ชันประมวลผลผลลัพธ์ OCR
function processOCRResult(result: any, filename: string) {
  try {
    const extractedTexts: string[] = []
    const errors: string[] = []
    
    // ตรวจสอบว่ามี results array หรือไม่
    if (result.results && Array.isArray(result.results)) {
      // ประมวลผลแต่ละหน้า
      for (const pageResult of result.results) {
        if (pageResult.success && pageResult.message) {
          try {
            let content = pageResult.message.choices[0].message.content
            
            // ลอง parse เป็น JSON ถ้าเป็น structured output
            try {
              const parsedContent = JSON.parse(content)
              content = parsedContent.natural_text || content
            } catch (e) {
              // ใช้ content เป็นข้อความธรรมดาถ้าไม่ใช่ JSON
            }
            
            extractedTexts.push(content)
          } catch (e) {
            console.error(`Error processing page content: ${e}`)
            errors.push(`ไม่สามารถประมวลผลเนื้อหาหน้า: ${e}`)
          }
        } else if (!pageResult.success) {
          const errorMsg = `Error processing ${pageResult.filename || filename}: ${pageResult.error || 'Unknown error'}`
          console.error(errorMsg)
          errors.push(errorMsg)
        }
      }
    } else if (result.text) {
      // กรณีที่ API ส่งกลับ text โดยตรง
      extractedTexts.push(result.text)
    } else {
      // กรณีอื่นๆ
      console.warn('Unexpected OCR result format:', result)
      if (result.message) {
        extractedTexts.push(result.message)
      }
    }
    
    const finalText = extractedTexts.join('\n')
    
    return {
      text: finalText,
      confidence: result.confidence || 0,
      language: result.language || 'unknown',
      words: finalText ? finalText.split(/\s+/) : [],
      wordCount: finalText ? finalText.split(/\s+/).length : 0,
      pageCount: result.results ? result.results.length : 1,
      errors: errors,
      rawResult: result
    }
    
  } catch (error) {
    console.error('Error processing OCR result:', error)
    throw new Error(`Failed to process OCR result: ${error}`)
  }
}

// ฟังก์ชันสร้าง default parameters
function getDefaultParams() {
  return {
    model: "typhoon-ocr-preview",
    task_type: "default",
    max_tokens: 16000,
    temperature: 0.1,
    top_p: 0.6,
    repetition_penalty: 1.2,
    pages: [] // ใช้ array ว่างแทน [null] เพื่อประมวลผลทุกหน้า
  }
}

// ฟังก์ชันสกัดข้อความแบบเดิม (fallback)
async function extractText(file: File) {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(EXTRACTION_APIS.text.endpoint, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${EXTRACTION_APIS.text.token}`,
    },
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`OCR API error: ${response.status}`)
  }

  const result = await response.json()
  return {
    text: result.text || '',
    confidence: result.confidence || 0,
    language: result.language || 'unknown',
    words: result.text ? result.text.split(/\s+/) : [],
    wordCount: result.text ? result.text.split(/\s+/).length : 0
  }
}

// ฟังก์ชันสกัดตาราง
async function extractTables(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(EXTRACTION_APIS.tables.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EXTRACTION_APIS.tables.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      // ถ้า API ไม่มี ให้ใช้ fallback method
      return await extractTablesFallback(file)
    }

    const result = await response.json()
    return {
      tables: result.tables || [],
      tableCount: result.tables ? result.tables.length : 0,
      cells: result.cells || [],
      headers: result.headers || []
    }
  } catch (error) {
    // ใช้ fallback method
    return await extractTablesFallback(file)
  }
}

// Fallback method สำหรับการสกัดตาราง
async function extractTablesFallback(file: File) {
  // ใช้ OCR เพื่อหาตารางในข้อความ
  const ocrResult = await extractText(file)
  const text = ocrResult.text
  
  // ค้นหาตารางโดยใช้ regex patterns
  const tablePatterns = [
    /(\d+)\s+(\d+)\s+(\d+)/g, // ตัวเลขเรียงกัน
    /([^\n]+)\s+\|\s+([^\n]+)/g, // ใช้ | แยกคอลัมน์
    /([^\n]+)\s+(\d+\.?\d*)/g // ข้อความ + ตัวเลข
  ]

  const tables: any[] = []
  
  tablePatterns.forEach((pattern, index) => {
    const matches = text.match(pattern)
    if (matches && matches.length > 2) {
      tables.push({
        type: `pattern_${index + 1}`,
        matches: matches,
        confidence: 0.7
      })
    }
  })

  return {
    tables: tables,
    tableCount: tables.length,
    cells: [],
    headers: [],
    method: 'fallback'
  }
}

// ฟังก์ชันสกัดฟอร์ม
async function extractForms(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(EXTRACTION_APIS.forms.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EXTRACTION_APIS.forms.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      return await extractFormsFallback(file)
    }

    const result = await response.json()
    return {
      forms: result.forms || [],
      formCount: result.forms ? result.forms.length : 0,
      fields: result.fields || []
    }
  } catch (error) {
    return await extractFormsFallback(file)
  }
}

// Fallback method สำหรับการสกัดฟอร์ม
async function extractFormsFallback(file: File) {
  const ocrResult = await extractText(file)
  const text = ocrResult.text
  
  // ค้นหาฟิลด์ฟอร์มโดยใช้ keywords
  const formKeywords = [
    'ชื่อ', 'นามสกุล', 'ที่อยู่', 'เบอร์โทร', 'อีเมล',
    'Name', 'Address', 'Phone', 'Email', 'Date'
  ]
  
  const fields: any[] = []
  
  formKeywords.forEach(keyword => {
    const regex = new RegExp(`${keyword}[\\s:]*([^\\n]+)`, 'gi')
    const matches = text.match(regex)
    if (matches) {
      fields.push({
        label: keyword,
        value: matches[0].replace(keyword, '').replace(/[:\s]+/, '').trim(),
        confidence: 0.6
      })
    }
  })

  return {
    forms: [],
    formCount: 0,
    fields: fields,
    method: 'fallback'
  }
}

// ฟังก์ชันตรวจจับ object
async function detectObjects(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await fetch(EXTRACTION_APIS.objects.endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${EXTRACTION_APIS.objects.token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      return await detectObjectsFallback(file)
    }

    const result = await response.json()
    return {
      objects: result.objects || [],
      objectCount: result.objects ? result.objects.length : 0,
      boundingBoxes: result.bounding_boxes || []
    }
  } catch (error) {
    return await detectObjectsFallback(file)
  }
}

// Fallback method สำหรับการตรวจจับ object
async function detectObjectsFallback(file: File) {
  // ใช้ OCR เพื่อหาข้อความที่เป็น object
  const ocrResult = await extractText(file)
  const text = ocrResult.text
  
  // ค้นหา object โดยใช้ keywords
  const objectKeywords = [
    'รูปภาพ', 'ไอคอน', 'โลโก้', 'กราฟ', 'แผนภูมิ',
    'Image', 'Icon', 'Logo', 'Graph', 'Chart'
  ]
  
  const objects: any[] = []
  
  objectKeywords.forEach(keyword => {
    if (text.includes(keyword)) {
      objects.push({
        type: keyword,
        confidence: 0.5,
        method: 'keyword_detection'
      })
    }
  })

  return {
    objects: objects,
    objectCount: objects.length,
    boundingBoxes: [],
    method: 'fallback'
  }
}

// ฟังก์ชันสกัด metadata
async function extractMetadata(file: File) {
  try {
    const metadata: any = {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      lastModified: new Date(file.lastModified).toISOString(),
      colorSpace: 'RGB',
      compression: 'JPEG/PNG/PDF'
    }

    // ถ้าเป็นรูปภาพ ให้หาขนาดภาพ
    if (file.type.startsWith('image/')) {
      try {
        const dimensions = await getImageDimensions(file)
        metadata.dimensions = dimensions
      } catch (error) {
        console.warn('Could not get image dimensions:', error)
        metadata.dimensions = { width: 0, height: 0, aspectRatio: 0 }
      }
    }

    // ถ้าเป็น PDF
    if (file.type === 'application/pdf') {
      metadata.documentType = 'PDF'
      metadata.pageCount = 'Unknown' // ต้องใช้ PDF library เพื่อหาจำนวนหน้า
    }

    return metadata
  } catch (error) {
    console.error('Metadata extraction error:', error)
    return {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      error: 'Metadata extraction failed'
    }
  }
}

// ฟังก์ชันหาขนาดภาพ (ปรับปรุงให้ปลอดภัยสำหรับ server-side)
async function getImageDimensions(file: File) {
  return new Promise((resolve) => {
    try {
      // ใน server-side ไม่สามารถใช้ Image constructor ได้
      // ให้ส่งกลับค่า default และให้ client-side จัดการ
      console.warn('Image dimensions cannot be extracted on server-side')
      resolve({ 
        width: 0, 
        height: 0, 
        aspectRatio: 0,
        note: 'Dimensions will be extracted on client-side'
      })
    } catch (error) {
      console.warn('Image dimension extraction failed:', error)
      resolve({ width: 0, height: 0, aspectRatio: 0 })
    }
  })
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'Advanced Image & PDF Extraction API',
      supportedTypes: ['text', 'tables', 'forms', 'objects', 'all'],
      supportedFileTypes: ['image/*', 'application/pdf'],
      endpoints: Object.keys(EXTRACTION_APIS),
      defaultParams: getDefaultParams()
    },
    { status: 200 }
  )
}
