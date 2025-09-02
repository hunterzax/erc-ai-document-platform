# การทดสอบระบบอัพโหลดและ OCR

## ขั้นตอนการทดสอบ

### 1. การทดสอบการอัพโหลดไฟล์

#### 1.1 ไฟล์รูปภาพ
- อัพโหลดไฟล์ PNG ขนาดเล็ก (< 1MB)
- อัพโหลดไฟล์ JPG ขนาดกลาง (1-5MB)
- อัพโหลดไฟล์ TIFF ขนาดใหญ่ (> 5MB)

#### 1.2 ไฟล์เอกสาร
- อัพโหลดไฟล์ PDF
- อัพโหลดไฟล์ Word (.doc, .docx)

#### 1.3 การทดสอบ Drag & Drop
- ลากไฟล์จาก Desktop
- ลากไฟล์จาก File Explorer
- ลากหลายไฟล์พร้อมกัน

### 2. การทดสอบการประมวลผล OCR

#### 2.1 ตรวจสอบ API Response
```bash
curl -X POST http://localhost:3000/api/upload \
  -H "Content-Type: multipart/form-data" \
  -F "file=@test-image.png"
```

#### 2.2 ตรวจสอบ OCR Quality
- ข้อความภาษาไทย
- ข้อความภาษาอังกฤษ
- ตัวเลขและสัญลักษณ์
- ตารางและโครงสร้าง

### 3. การทดสอบ UI

#### 3.1 Column 1 - ไฟล์ที่อัพโหลด
- แสดงรายการไฟล์
- สถานะการประมวลผล
- Progress bar
- ปุ่มลบไฟล์

#### 3.2 Column 2 - ผลลัพธ์ OCR
- แสดงภาพตัวอย่าง
- แสดงข้อความที่แยกได้
- ปุ่มคัดลอก
- ปุ่มดาวน์โหลด

### 4. การทดสอบฟีเจอร์เพิ่มเติม

#### 4.1 Toast Notifications
- อัพโหลดสำเร็จ
- อัพโหลดล้มเหลว
- การคัดลอกข้อความ

#### 4.2 การจัดการไฟล์
- เลือกไฟล์
- ลบไฟล์
- ดูรายละเอียด

#### 4.3 Metadata Form
- กรอกข้อมูลเอกสาร
- เลือกประเภท
- เลือกปี
- เลือกหมวดหมู่

## ไฟล์ทดสอบที่แนะนำ

### 1. ไฟล์รูปภาพ
- `test-thai-text.png` - ข้อความภาษาไทย
- `test-english-text.jpg` - ข้อความภาษาอังกฤษ
- `test-table.tiff` - ตารางข้อมูล
- `test-mixed-content.png` - ข้อความผสม

### 2. ไฟล์เอกสาร
- `test-document.pdf` - เอกสาร PDF
- `test-report.docx` - รายงาน Word

### 3. ไฟล์ทดสอบ Edge Cases
- `large-file.tiff` - ไฟล์ขนาดใหญ่
- `corrupted-file.png` - ไฟล์เสีย
- `unsupported-file.txt` - ไฟล์ไม่รองรับ

## การตรวจสอบผลลัพธ์

### 1. ตรวจสอบ Console
```javascript
// เปิด Developer Tools > Console
// ตรวจสอบ error messages
// ตรวจสอบ API calls
```

### 2. ตรวจสอบ Network
```javascript
// เปิด Developer Tools > Network
// ตรวจสอบ upload requests
// ตรวจสอบ OCR API calls
```

### 3. ตรวจสอบ Performance
```javascript
// เปิด Developer Tools > Performance
// วัดเวลาการอัพโหลด
// วัดเวลาการประมวลผล OCR
```

## การแก้ไขปัญหา

### 1. ไฟล์ไม่อัพโหลด
- ตรวจสอบขนาดไฟล์
- ตรวจสอบประเภทไฟล์
- ตรวจสอบ network connection

### 2. OCR ไม่ทำงาน
- ตรวจสอบ API token
- ตรวจสอบ API endpoint
- ตรวจสอบ response format

### 3. UI ไม่แสดง
- ตรวจสอบ browser compatibility
- ตรวจสอบ JavaScript errors
- ตรวจสอบ CSS loading

## การทดสอบ Performance

### 1. Load Testing
- อัพโหลดไฟล์ขนาดใหญ่
- อัพโหลดหลายไฟล์พร้อมกัน
- ทดสอบ concurrent users

### 2. Memory Testing
- ตรวจสอบ memory usage
- ตรวจสอบ memory leaks
- ตรวจสอบ garbage collection

### 3. Network Testing
- ทดสอบ slow connection
- ทดสอบ network interruption
- ทดสอบ timeout scenarios

## การทดสอบ Responsiveness

### 1. Mobile Testing
- ทดสอบบน mobile devices
- ทดสอบ touch gestures
- ทดสอบ viewport sizes

### 2. Browser Testing
- Chrome
- Firefox
- Safari
- Edge

### 3. Device Testing
- Desktop
- Tablet
- Mobile
- Different screen resolutions
