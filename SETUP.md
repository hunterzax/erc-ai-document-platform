# 🚀 การติดตั้งและใช้งาน LangChain กับ Ollama

## ✨ สิ่งที่ได้ทำเสร็จแล้ว

### 1. ติดตั้ง Dependencies
- ✅ LangChain และ Ollama packages
- ✅ TypeScript types
- ✅ Next.js API routes

### 2. สร้าง LangChain Integration
- ✅ `lib/langchain.ts` - Utility functions สำหรับ LangChain
- ✅ `app/api/chat/route.ts` - Chat API endpoint
- ✅ `app/api/models/route.ts` - Models management API

### 3. อัปเดต Chat Interface
- ✅ Model selector component
- ✅ Real-time chat with AI
- ✅ Error handling และ fallback

## 🚀 วิธีการใช้งาน

### ขั้นตอนที่ 1: ติดตั้ง Ollama

```bash
# macOS/Linux
curl -fsSL https://ollama.ai/install.sh | sh

# Windows: ดาวน์โหลดจาก ollama.ai
```

### ขั้นตอนที่ 2: ดาวน์โหลด Model

```bash
# รัน Ollama
ollama serve

# ดาวน์โหลด model (ใน terminal อีกตัว)
ollama pull llama3.2
```

### ขั้นตอนที่ 3: ตั้งค่า Environment

สร้างไฟล์ `.env.local`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

### ขั้นตอนที่ 4: รันโปรเจค

```bash
npm run dev
```

เปิดเบราว์เซอร์ไปที่: `http://localhost:3000/chat`

## 🎯 Features ที่ใช้งานได้

### Chat Interface
- 💬 Real-time chat with AI
- 🔄 Model switching
- 📝 Message history
- ⚡ Streaming responses

### Model Management
- 📥 Download models
- 🔄 Switch between models
- 📊 Model information
- 🗑️ Remove models

### LangChain Features
- 🧠 AI conversation
- 🔧 Tool integration ready
- 📚 Memory system ready
- 🔍 RAG capabilities ready

## 🛠️ การปรับแต่ง

### เปลี่ยน Model
```typescript
// ใน .env.local
OLLAMA_MODEL=codellama

// หรือใน code
setCurrentModel("codellama")
```

### ปรับ Temperature
```typescript
// ใน lib/langchain.ts
temperature: 0.5 // 0.0 = focused, 1.0 = creative
```

### เพิ่ม System Prompt
```typescript
// ใน lib/langchain.ts
const systemPrompt = "You are a helpful coding assistant."
```

## 🔧 การพัฒนาเพิ่มเติม

### เพิ่ม Tools
```typescript
import { Tool } from "langchain/tools"

const tools = [
  new Tool({
    name: "calculator",
    description: "Calculate mathematical expressions",
    func: async (input: string) => eval(input)
  })
]
```

### เพิ่ม Memory
```typescript
import { BufferMemory } from "langchain/memory"

const memory = new BufferMemory({
  returnMessages: true,
  memoryKey: "chat_history"
})
```

### เพิ่ม RAG
```typescript
import { VectorStore } from "langchain/vectorstores"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"

const vectorstore = await VectorStore.fromTexts(
  texts,
  metadatas,
  new OpenAIEmbeddings()
)
```

## 🐛 Troubleshooting

### Ollama ไม่ตอบสนอง
```bash
# ตรวจสอบ process
ps aux | grep ollama

# รีสตาร์ท
ollama serve
```

### Model ไม่พบ
```bash
# ดู models ที่มี
ollama list

# ดาวน์โหลดใหม่
ollama pull llama3.2
```

### Build Error
```bash
# ลบ node_modules และติดตั้งใหม่
rm -rf node_modules package-lock.json
npm install
```

## 📚 Resources

- [LangChain Documentation](https://js.langchain.com/)
- [Ollama Documentation](https://ollama.ai/docs)
- [Next.js Documentation](https://nextjs.org/docs)

## 🎉 สรุป

ตอนนี้คุณมี:
- ✅ AI Chat ที่ใช้งานได้จริง
- ✅ LangChain integration
- ✅ Ollama model management
- ✅ Modern UI/UX
- ✅ TypeScript support
- ✅ Production ready

พร้อมใช้งานและพัฒนาต่อ! 🚀
