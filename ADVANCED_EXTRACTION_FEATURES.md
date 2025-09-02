# ฟีเจอร์การสกัดข้อมูลขั้นสูงจากภาพ

## ภาพรวม

ระบบได้รับการปรับปรุงให้มีฟีเจอร์การสกัดข้อมูลขั้นสูงจากภาพ โดยสามารถสกัดได้หลายประเภทข้อมูลพร้อมกัน

## API Endpoints ใหม่

### 1. `/api/extract` - Image Extraction API

#### **POST /api/extract**
- **Input**: FormData with file + type
- **Output**: Advanced extraction results
- **Supported Types**: text, tables, forms, objects, all

#### **Parameters**
- `file`: ไฟล์รูปภาพ (PNG, JPG, JPEG, TIFF)
- `type`: ประเภทการสกัดข้อมูล
  - `all`: สกัดทุกประเภท
  - `text`: ข้อความเท่านั้น
  - `tables`: ตารางเท่านั้น
  - `forms`: ฟอร์มเท่านั้น
  - `objects`: Object detection เท่านั้น

## ประเภทการสกัดข้อมูล

### 1. **Text Extraction (OCR)**
- สกัดข้อความจากภาพ
- รองรับหลายภาษา
- แสดงความแม่นยำ
- นับจำนวนคำ

### 2. **Table Extraction**
- สกัดตารางจากภาพ
- ตรวจจับโครงสร้างตาราง
- แยกคอลัมน์และแถว
- Fallback method ด้วย regex patterns

### 3. **Form Fields Extraction**
- สกัดฟิลด์ฟอร์ม
- ตรวจจับ labels และ values
- รองรับฟอร์มภาษาไทยและอังกฤษ
- Keywords detection

### 4. **Object Detection**
- ตรวจจับ object ในภาพ
- รองรับรูปภาพ, ไอคอน, โลโก้
- กราฟและแผนภูมิ
- Bounding boxes (ถ้า API รองรับ)

### 5. **Metadata Extraction**
- ขนาดภาพ (width x height)
- อัตราส่วนภาพ
- ประเภทไฟล์
- ข้อมูลเพิ่มเติม

## การทำงานของระบบ

### 1. **Primary API Calls**
- เชื่อมต่อกับ OpenTyphoon AI APIs
- ส่งไฟล์ไปยัง endpoint ที่เหมาะสม
- ประมวลผลผลลัพธ์

### 2. **Fallback Methods**
- ใช้เมื่อ API หลักไม่ทำงาน
- ใช้ OCR + regex patterns
- Keywords detection
- Pattern matching

### 3. **Error Handling**
- จัดการ API failures
- แสดงข้อผิดพลาดที่ชัดเจน
- Graceful degradation

## การใช้งานใน UI

### 1. **Advanced Extraction Controls**
- Dropdown เลือกประเภทการสกัด
- ปุ่ม "สกัดข้อมูล" พร้อม loading state
- แสดงสถานะการประมวลผล

### 2. **Results Display**
- แสดงผลลัพธ์แยกตามประเภท
- Icons สำหรับแต่ละประเภท
- ความแม่นยำและข้อมูลเพิ่มเติม
- Color-coded sections

### 3. **Interactive Elements**
- เลือกประเภทการสกัด
- ดูผลลัพธ์แบบ real-time
- Export ผลลัพธ์

## ตัวอย่างการใช้งาน

### 1. **สกัดข้อมูลทั้งหมด**
```javascript
const formData = new FormData()
formData.append('file', imageFile)
formData.append('type', 'all')

const response = await fetch('/api/extract', {
  method: 'POST',
  body: formData
})
```

### 2. **สกัดเฉพาะตาราง**
```javascript
formData.append('type', 'tables')
```

### 3. **ผลลัพธ์ที่ได้**
```json
{
  "success": true,
  "data": {
    "results": {
      "text": { "text": "...", "confidence": 0.95 },
      "tables": { "tableCount": 2, "tables": [...] },
      "forms": { "formCount": 1, "fields": [...] },
      "objects": { "objectCount": 3, "objects": [...] },
      "metadata": { "dimensions": {...} }
    }
  }
}
```

## การตั้งค่า

### 1. **API Configuration**
```typescript
const EXTRACTION_APIS = {
  text: { endpoint: "https://api.opentyphoon.ai/v1/ocr" },
  tables: { endpoint: "https://api.opentyphoon.ai/v1/extract-tables" },
  forms: { endpoint: "https://api.opentyphoon.ai/v1/extract-forms" },
  objects: { endpoint: "https://api.opentyphoon.ai/v1/detect" }
}
```

### 2. **Fallback Patterns**
- Table detection patterns
- Form field keywords
- Object type keywords

## การทดสอบ

### 1. **Functional Testing**
- ✅ Text extraction
- ✅ Table extraction
- ✅ Form extraction
- ✅ Object detection
- ✅ Metadata extraction

### 2. **API Testing**
- ✅ Primary API calls
- ✅ Fallback methods
- ✅ Error handling
- ✅ Response formatting

### 3. **UI Testing**
- ✅ Extraction controls
- ✅ Results display
- ✅ Loading states
- ✅ Error messages

## การพัฒนาต่อ

### 1. **ฟีเจอร์ที่สามารถเพิ่มได้**
- Batch processing
- Custom extraction patterns
- Export to different formats
- Integration with external services

### 2. **การปรับปรุง Performance**
- Caching results
- Background processing
- Progress indicators
- Batch operations

### 3. **การปรับปรุง Accuracy**
- Machine learning models
- Custom training data
- Multiple API providers
- Result validation

## การแก้ไขปัญหา

### 1. **ปัญหาที่พบบ่อย**
- **API ไม่ตอบสนอง**: ใช้ fallback methods
- **ผลลัพธ์ไม่แม่นยำ**: ปรับ patterns และ keywords
- **ไฟล์ไม่รองรับ**: ตรวจสอบประเภทไฟล์

### 2. **การ Debug**
- ตรวจสอบ API responses
- ดู fallback method results
- ตรวจสอบ error logs
- ทดสอบกับไฟล์ตัวอย่าง

## สรุป

ระบบการสกัดข้อมูลขั้นสูงได้รับการพัฒนาอย่างสมบูรณ์:

1. **✅ Multiple Extraction Types** - ข้อความ, ตาราง, ฟอร์ม, Object
2. **✅ Fallback Methods** - ทำงานได้แม้ API หลักไม่ทำงาน
3. **✅ User-friendly UI** - ควบคุมง่าย แสดงผลชัดเจน
4. **✅ Error Handling** - จัดการข้อผิดพลาดอย่างเหมาะสม
5. **✅ Extensible Architecture** - เพิ่มฟีเจอร์ใหม่ได้ง่าย

ระบบพร้อมใช้งานและสามารถพัฒนาต่อได้ในอนาคต! 🚀
