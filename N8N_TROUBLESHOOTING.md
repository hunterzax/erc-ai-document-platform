# 🔧 N8N Troubleshooting Guide - แก้ไขปัญหาการเชื่อมต่อ n8n

## 🚨 ปัญหาที่พบบ่อยและวิธีแก้ไข

### 1. **Webhook Not Found (404 Error)**

#### อาการ:
```
Webhook not found (404). The webhook "39e434db-15ca-4ad7-8757-cad84e629907" is not registered in n8n.
```

#### สาเหตุ:
- n8n ไม่ได้รันอยู่
- Workflow ไม่ได้เปิดใช้งาน (inactive)
- Webhook node ไม่ได้เปิดใช้งาน
- Webhook URL ไม่ถูกต้อง

#### วิธีแก้ไข:

##### ขั้นตอนที่ 1: ตรวจสอบว่า n8n รันอยู่หรือไม่
```bash
# ตรวจสอบ Docker containers
docker ps | grep n8n

# หรือตรวจสอบ port 5678
curl http://localhost:5678/api/v1/health
```

##### ขั้นตอนที่ 2: เริ่ม n8n (ถ้ายังไม่ได้รัน)
```bash
# ใช้ Docker Compose
cd /path/to/your/project
docker-compose up -d

# หรือรัน n8n โดยตรง
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

##### ขั้นตอนที่ 3: ตรวจสอบ Workflow
1. เปิด n8n ในเบราว์เซอร์: `http://localhost:5678`
2. ไปที่ **Workflows**
3. ตรวจสอบว่า workflow ที่มี webhook เปิดใช้งานอยู่ (Active = ON)
4. คลิกที่ workflow เพื่อดูรายละเอียด

##### ขั้นตอนที่ 4: ตรวจสอบ Webhook Node
1. ใน workflow editor คลิกที่ **Webhook Trigger** node
2. ตรวจสอบว่า **Active** = ON
3. คัดลอก **Webhook URL** ที่แสดง
4. อัปเดต `.env.local`:

```bash
N8N_WEBHOOK_URL=http://localhost:5678/webhook/39e434db-15ca-4ad7-8757-cad84e629907
```

### 2. **Connection Refused Error**

#### อาการ:
```
Cannot connect to n8n. Please make sure n8n is running on http://localhost:5678
```

#### สาเหตุ:
- n8n ไม่ได้รันอยู่
- Port 5678 ถูกใช้งานโดยโปรแกรมอื่น
- Firewall บล็อกการเชื่อมต่อ

#### วิธีแก้ไข:

##### ตรวจสอบ Port Usage:
```bash
# ตรวจสอบว่า port 5678 ถูกใช้งานหรือไม่
lsof -i :5678

# หรือใช้ netstat
netstat -tulpn | grep 5678
```

##### เปลี่ยน Port (ถ้าจำเป็น):
```bash
# ใน docker-compose.yml
environment:
  - N8N_PORT=5679

# หรือรัน n8n ด้วย port อื่น
docker run -it --rm \
  --name n8n \
  -p 5679:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

##### ตรวจสอบ Firewall:
```bash
# macOS
sudo pfctl -s all

# Linux
sudo ufw status
sudo iptables -L
```

### 3. **Hostname Not Found Error**

#### อาการ:
```
Cannot resolve n8n hostname. Please check your network connection and n8n URL.
```

#### สาเหตุ:
- URL ไม่ถูกต้อง
- DNS resolution problem
- Network configuration issue

#### วิธีแก้ไข:

##### ตรวจสอบ URL:
```bash
# ใช้ IP address แทน hostname
N8N_BASE_URL=http://127.0.0.1:5678
N8N_WEBHOOK_URL=http://127.0.0.1:5678/webhook/39e434db-15ca-4ad7-8757-cad84e629907
```

##### ตรวจสอบ DNS:
```bash
# ตรวจสอบ localhost
ping localhost
nslookup localhost

# ตรวจสอบ 127.0.0.1
ping 127.0.0.1
```

### 4. **Server Error (500)**

#### อาการ:
```
Webhook server error (500). There was an error processing your request in the n8n workflow.
```

#### สาเหตุ:
- Error ใน workflow logic
- Node configuration problem
- Data format issue

#### วิธีแก้ไข:

##### ตรวจสอบ Workflow Execution:
1. เปิด n8n ในเบราว์เซอร์
2. ไปที่ **Executions** tab
3. ดู error details ใน execution ที่ล้มเหลว

##### ตรวจสอบ Node Configuration:
1. เปิด workflow editor
2. ตรวจสอบ configuration ของแต่ละ node
3. ตรวจสอบ data format ที่ส่งเข้าไป

##### Test Workflow Step by Step:
1. เปิด **Execute Workflow** mode
2. รันทีละ node เพื่อหาจุดที่มีปัญหา
3. ตรวจสอบ data ที่ส่งระหว่าง nodes

## 🛠️ การตั้งค่า n8n ที่ถูกต้อง

### 1. **สร้าง Workflow พื้นฐาน**

#### ขั้นตอนที่ 1: สร้าง Workflow ใหม่
1. คลิก **+ New Workflow**
2. ตั้งชื่อ: "AI Chat Webhook"

#### ขั้นตอนที่ 2: เพิ่ม Webhook Trigger
1. ค้นหา "Webhook" ใน node library
2. ลาก **Webhook Trigger** มาวาง
3. ตั้งค่า:
   - **HTTP Method**: POST
   - **Path**: `/webhook/39e434db-15ca-4ad7-8757-cad84e629907`
   - **Response Mode**: Respond to Webhook

#### ขั้นตอนที่ 3: เพิ่ม Code Node
1. ค้นหา "Code" ใน node library
2. ลาก **Code** node มาวาง
3. เชื่อมต่อกับ Webhook Trigger
4. ใส่ code:

```javascript
// รับข้อมูลจาก webhook
const messages = $input.all()[0].json.messages;
const systemPrompt = $input.all()[0].json.systemPrompt || 'You are a helpful AI assistant.';

// สร้าง AI response (ตัวอย่างง่ายๆ)
let aiResponse = '';
if (messages && messages.length > 0) {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    aiResponse = `I received your message: "${lastMessage.content}". This is a test response from n8n workflow.`;
  }
}

// ส่งกลับ response
return {
  aiResponse: aiResponse,
  role: 'assistant',
  timestamp: new Date().toISOString(),
  metadata: {
    workflowId: $workflow.id,
    executionId: $execution.id
  }
};
```

#### ขั้นตอนที่ 4: เพิ่ม Respond to Webhook
1. ค้นหา "Respond to Webhook" ใน node library
2. ลากมาวางและเชื่อมต่อกับ Code node
3. ตั้งค่า:
   - **Response Code**: 200
   - **Response Body**: `{{ $json }}`

### 2. **เปิดใช้งาน Workflow**
1. คลิก **Active** toggle ใน workflow header
2. ตรวจสอบว่า status เป็น **Active**
3. คัดลอก webhook URL จาก Webhook Trigger node

### 3. **อัปเดต Environment Variables**
```bash
# .env.local
N8N_BASE_URL=http://localhost:5678
N8N_WEBHOOK_URL=http://localhost:5678/webhook/39e434db-15ca-4ad7-8757-cad84e629907
N8N_API_KEY=your_api_key_if_needed
```

## 🔍 การ Debug และ Troubleshooting

### 1. **ตรวจสอบ Logs**

#### Docker Logs:
```bash
# ดู n8n logs
docker logs n8n

# หรือใช้ docker-compose
docker-compose logs n8n

# ติดตาม logs แบบ real-time
docker logs -f n8n
```

#### n8n Logs:
1. เปิด n8n ในเบราว์เซอร์
2. ไปที่ **Settings** → **Logs**
3. ดู error logs และ execution logs

### 2. **ทดสอบ Webhook โดยตรง**

#### ใช้ curl:
```bash
# ทดสอบ webhook
curl -X POST http://localhost:5678/webhook/39e434db-15ca-4ad7-8757-cad84e629907 \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Hello, this is a test message"
      }
    ],
    "systemPrompt": "You are a helpful AI assistant."
  }'
```

#### ใช้ Postman:
1. สร้าง POST request
2. URL: `http://localhost:5678/webhook/39e434db-15ca-4ad7-8757-cad84e629907`
3. Headers: `Content-Type: application/json`
4. Body: JSON payload

### 3. **ตรวจสอบ Network**

#### Port Scan:
```bash
# ตรวจสอบ port ที่เปิดอยู่
nmap localhost -p 5678

# หรือใช้ telnet
telnet localhost 5678
```

#### Network Interface:
```bash
# ตรวจสอบ network interfaces
ifconfig

# หรือใช้ ip
ip addr show
```

## 📋 Checklist การแก้ไขปัญหา

### ✅ ขั้นตอนพื้นฐาน:
- [ ] n8n รันอยู่และ accessible
- [ ] Workflow เปิดใช้งาน (Active)
- [ ] Webhook node เปิดใช้งาน
- [ ] Environment variables ถูกต้อง
- [ ] Port 5678 ไม่ถูกบล็อก

### ✅ การทดสอบ:
- [ ] n8n health check สำเร็จ
- [ ] Webhook URL accessible
- [ ] Workflow execution สำเร็จ
- [ ] Response format ถูกต้อง

### ✅ การตั้งค่า:
- [ ] Webhook path ถูกต้อง
- [ ] HTTP method เป็น POST
- [ ] Response mode เป็น "Respond to Webhook"
- [ ] Code node logic ถูกต้อง

## 🆘 หากยังแก้ไขไม่ได้

### 1. **ตรวจสอบ n8n Version**
```bash
# ตรวจสอบ version
docker run --rm n8nio/n8n --version

# หรือดูใน n8n UI
Settings → About
```

### 2. **Restart n8n**
```bash
# Restart container
docker restart n8n

# หรือใช้ docker-compose
docker-compose restart n8n
```

### 3. **Clear n8n Data**
```bash
# ลบ volume และเริ่มใหม่
docker-compose down -v
docker-compose up -d
```

### 4. **ตรวจสอบ System Resources**
```bash
# ตรวจสอบ memory และ CPU
docker stats n8n

# ตรวจสอบ disk space
df -h
```

## 📞 การขอความช่วยเหลือ

หากยังแก้ไขปัญหาไม่ได้ กรุณาเตรียมข้อมูลต่อไปนี้:

1. **Error Message** ที่ได้รับ
2. **n8n Version** ที่ใช้งาน
3. **Workflow Configuration** (screenshot)
4. **Environment Variables** ที่ตั้งค่า
5. **Logs** จาก n8n และ Docker
6. **Steps to Reproduce** ปัญหา

---

**หมายเหตุ**: ระบบนี้ใช้ n8n เป็น AI agent backend หากมีปัญหาการเชื่อมต่อ กรุณาตรวจสอบตามขั้นตอนข้างต้นก่อนครับ 😊

