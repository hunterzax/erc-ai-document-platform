# ระบบอัพโหลดและประมวลผล OCR

## ภาพรวม

ระบบอัพโหลดได้รับการปรับปรุงให้มี UI แสดงผล 2 columns ตามที่ต้องการ:

- **Column 1**: แสดงภาพ/ไฟล์ที่อัพโหลด
- **Column 2**: แสดงผลการประมวลผล OCR

## ฟีเจอร์หลัก

### 1. การอัพโหลดไฟล์
- รองรับไฟล์ PDF, Word, และรูปภาพ (PNG, JPG, TIFF)
- Drag & Drop interface
- Multiple file upload
- Progress tracking

### 2. การประมวลผล OCR
- เชื่อมต่อกับ OpenTyphoon AI OCR API
- ประมวลผลอัตโนมัติหลังอัพโหลด
- แสดงผลลัพธ์แบบ real-time

### 3. UI แสดงผล 2 Columns

#### Column 1: ไฟล์ที่อัพโหลด
- รายการไฟล์ทั้งหมด
- สถานะการประมวลผล
- Progress bar
- ข้อมูลไฟล์ (ชื่อ, ขนาด, ประเภท)

#### Column 2: ผลการประมวลผล OCR
- แสดงภาพตัวอย่าง (สำหรับไฟล์รูปภาพ)
- ข้อความที่แยกได้จาก OCR
- ปุ่มคัดลอกข้อความ
- ปุ่มดาวน์โหลดผลลัพธ์
- ข้อมูลเพิ่มเติม (ภาษา, ความแม่นยำ, จำนวนคำ)

### 4. ฟีเจอร์เพิ่มเติม
- Toast notifications
- การจัดการไฟล์ (ลบ, เลือก)
- ข้อมูล metadata ของเอกสาร
- Responsive design

## การใช้งาน

### 1. อัพโหลดไฟล์
1. ลากและวางไฟล์ในพื้นที่อัพโหลด
2. หรือคลิกเพื่อเลือกไฟล์
3. ระบบจะประมวลผล OCR อัตโนมัติ

### 2. ดูผลลัพธ์
1. เลือกไฟล์ใน Column 1
2. ดูผลลัพธ์ OCR ใน Column 2
3. คัดลอกหรือดาวน์โหลดข้อความ

### 3. จัดการข้อมูล
1. กรอกข้อมูล metadata ของเอกสาร
2. เลือกประเภท, ปี, และหมวดหมู่
3. เพิ่มคำอธิบาย (ไม่บังคับ)

## API Endpoints

### POST /api/upload
- **Input**: FormData with file
- **Output**: OCR result from OpenTyphoon AI
- **Headers**: Authorization with Bearer token

## การตั้งค่า

### OCR Service Configuration
```typescript
const OCR_API_ENDPOINT = "https://api.opentyphoon.ai/v1/ocr"
const OCR_API_TOKEN = "sk-KYjuo3A5Mqk2N7v4WSX9LpeZeoLemFywBq1lDKMOC3LMxWUT"
```

### Supported File Types
- PDF: `.pdf`
- Word: `.doc`, `.docx`
- Images: `.png`, `.jpg`, `.jpeg`, `.tiff`

## การพัฒนาต่อ

### ฟีเจอร์ที่สามารถเพิ่มได้
1. Batch processing
2. OCR accuracy improvement
3. File versioning
4. Search within OCR results
5. Export to different formats
6. Integration with document management system

### การปรับปรุง UI
1. Dark mode support
2. Custom themes
3. Advanced filtering
4. Sorting options
5. Bulk operations

## การแก้ไขปัญหา

### ปัญหาที่พบบ่อย
1. **ไฟล์ไม่อัพโหลด**: ตรวจสอบขนาดไฟล์และประเภท
2. **OCR ไม่ทำงาน**: ตรวจสอบ API token และ endpoint
3. **UI ไม่แสดง**: ตรวจสอบ browser console สำหรับ errors

### การ Debug
1. เปิด Developer Tools
2. ดู Network tab สำหรับ API calls
3. ตรวจสอบ Console สำหรับ error messages
4. ตรวจสอบ Application tab สำหรับ localStorage

## การทดสอบ

### Test Cases
1. อัพโหลดไฟล์รูปภาพ
2. อัพโหลดไฟล์ PDF
3. อัพโหลดไฟล์ Word
4. ทดสอบ drag & drop
5. ทดสอบการลบไฟล์
6. ทดสอบการคัดลอกข้อความ
7. ทดสอบการดาวน์โหลดผลลัพธ์

### Performance Testing
1. ไฟล์ขนาดใหญ่
2. Multiple files
3. Network latency simulation
4. Memory usage monitoring
