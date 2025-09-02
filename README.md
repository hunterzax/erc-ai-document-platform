# ERC AI Document Platform

แพลตฟอร์มเอกสาร AI ที่ใช้ LangChain และ Ollama สำหรับการสร้าง AI Agent

## การติดตั้ง

### 1. ติดตั้ง Dependencies

```bash
npm install
```

### 2. ติดตั้ง Ollama

#### macOS
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Windows
ดาวน์โหลดจาก [ollama.ai](https://ollama.ai/download)

### 3. ดาวน์โหลด Model

```bash
# ดาวน์โหลด Llama 3.2 (แนะนำ)
ollama pull llama3.2

# หรือ model อื่นๆ
ollama pull codellama
ollama pull gemma2
ollama pull mistral
```

### 4. ตั้งค่า Environment Variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์หลัก:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### 5. รัน Ollama

```bash
ollama serve
```

### 6. รัน Development Server

```bash
npm run dev
```

## การใช้งาน

1. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000/chat`
2. เริ่มการสนทนากับ AI โดยพิมพ์ข้อความในช่อง input
3. AI จะตอบกลับโดยใช้ model ที่คุณเลือกใน Ollama

## โครงสร้างโปรเจค

```
app/
├── api/
│   └── chat/
│       └── route.ts          # LangChain API endpoint
├── chat/
│   └── page.tsx              # Chat interface
└── components/
    └── ui/                   # UI components
```

## LangChain Features

- **ChatOllama**: เชื่อมต่อกับ Ollama models
- **Message Handling**: จัดการ conversation history
- **Error Handling**: จัดการข้อผิดพลาดและ fallback
- **Streaming Support**: รองรับการตอบกลับแบบ real-time

## การปรับแต่ง

### เปลี่ยน Model

แก้ไขใน `.env.local`:

```env
OLLAMA_MODEL=codellama
```

### ปรับ Temperature

แก้ไขใน `app/api/chat/route.ts`:

```typescript
const model = new ChatOllama({
  baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
  model: process.env.OLLAMA_MODEL || 'llama3.2',
  temperature: 0.5, // ปรับค่าความสร้างสรรค์ (0.0 - 1.0)
})
```

### เพิ่ม System Prompt

```typescript
const systemMessage = new SystemMessage("You are a helpful coding assistant.")
const langchainMessages = [systemMessage, ...messages]
```

## Troubleshooting

### Ollama ไม่ตอบสนอง
- ตรวจสอบว่า `ollama serve` กำลังทำงาน
- ตรวจสอบ port 11434 ไม่ถูกใช้งานโดยโปรแกรมอื่น

### Model ไม่พบ
- ใช้ `ollama list` เพื่อดู models ที่มี
- ใช้ `ollama pull <model_name>` เพื่อดาวน์โหลด

### Performance Issues
- ลด temperature เพื่อความเร็ว
- ใช้ model ที่เล็กลง (เช่น llama3.2:3b แทน llama3.2:8b)

## การพัฒนาเพิ่มเติม

### เพิ่ม Memory
```typescript
import { BufferMemory } from "langchain/memory"
```

### เพิ่ม Tools
```typescript
import { Tool } from "langchain/tools"
```

### เพิ่ม RAG (Retrieval Augmented Generation)
```typescript
import { VectorStore } from "langchain/vectorstores"
```

## License

MIT
