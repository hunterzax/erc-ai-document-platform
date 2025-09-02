# การทดสอบ Ollama และ LangChain

## ขั้นตอนการทดสอบ

### 1. ตรวจสอบ Ollama

```bash
# ตรวจสอบว่า Ollama ทำงานอยู่
curl http://localhost:11434/api/tags

# ควรได้ response แบบนี้:
{
  "models": [
    {
      "name": "llama3.2",
      "size": 1234567890,
      "modified_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. ทดสอบ LangChain API

```bash
# ทดสอบ chat API
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "modelName": "llama3.2"
  }'

# ควรได้ response แบบนี้:
{
  "message": "Hello! I'm doing well, thank you for asking...",
  "role": "assistant"
}
```

### 3. ทดสอบ Models API

```bash
# ดู models ที่มี
curl http://localhost:3000/api/models

# ดาวน์โหลด model ใหม่
curl -X POST http://localhost:3000/api/models \
  -H "Content-Type: application/json" \
  -d '{"name": "codellama"}'
```

## การแก้ไขปัญหา

### ปัญหา: Ollama ไม่ตอบสนอง

```bash
# ตรวจสอบ process
ps aux | grep ollama

# รีสตาร์ท Ollama
ollama serve

# ตรวจสอบ port
lsof -i :11434
```

### ปัญหา: Model ไม่พบ

```bash
# ดู models ที่มี
ollama list

# ดาวน์โหลด model
ollama pull llama3.2

# ตรวจสอบ disk space
df -h
```

### ปัญหา: API Error

```bash
# ดู logs
npm run dev

# ตรวจสอบ environment variables
echo $OLLAMA_BASE_URL
echo $OLLAMA_MODEL
```

## การปรับแต่ง Performance

### ลด Memory Usage

```bash
# ใช้ model ที่เล็กลง
ollama pull llama3.2:3b

# ตั้งค่า environment
export OLLAMA_MODEL=llama3.2:3b
```

### เพิ่ม Speed

```bash
# ลด temperature
# แก้ไขใน lib/langchain.ts
temperature: 0.3

# ใช้ GPU acceleration
export OLLAMA_HOST=0.0.0.0
```

## การ Monitor

### ดู Resource Usage

```bash
# CPU และ Memory
top -p $(pgrep ollama)

# Network
netstat -an | grep 11434
```

### ดู Logs

```bash
# Ollama logs
ollama logs

# Application logs
npm run dev
```
