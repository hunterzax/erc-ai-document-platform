# 🚀 การติดตั้งและใช้งาน n8n แทน Ollama

## ✨ สิ่งที่ได้เปลี่ยนแล้ว

### 1. เปลี่ยนจาก Ollama เป็น n8n
- ✅ สร้าง `lib/n8n.ts` - n8n client utility
- ✅ อัปเดต `app/api/chat/route.ts` - ใช้ n8n แทน Ollama
- ✅ สร้าง `app/api/workflows/route.ts` - จัดการ n8n workflows
- ✅ สร้าง `components/workflow-selector.tsx` - เลือก workflow/webhook
- ✅ อัปเดต `app/chat/page.tsx` - ใช้ WorkflowSelector

## 🚀 วิธีการติดตั้ง n8n

### ขั้นตอนที่ 1: ติดตั้ง n8n

#### ใช้ Docker (แนะนำ)
```bash
# สร้าง docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    container_name: n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=password123
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - N8N_USER_MANAGEMENT_DISABLED=false
      - N8N_EMAIL_MODE=smtp
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n
volumes:
  n8n_data:
EOF

# รัน n8n
docker-compose up -d
```

#### ติดตั้งแบบ Local
```bash
# ใช้ npm
npm install -g n8n

# รัน n8n
n8n start
```

### ขั้นตอนที่ 2: เข้าถึง n8n
เปิดเบราว์เซอร์ไปที่: `http://localhost:5678`

- **Username**: admin
- **Password**: password123

### ขั้นตอนที่ 3: สร้าง Workflow
1. คลิก "Create new workflow"
2. Import workflow จาก `examples/n8n-workflow.json`
3. หรือสร้าง workflow ใหม่ตามขั้นตอนด้านล่าง

## 🔧 การสร้าง Workflow สำหรับ AI Chat

### 1. สร้าง Webhook Trigger
1. คลิก "+" เพื่อเพิ่ม node
2. เลือก "Webhook"
3. คลิก "Add trigger"
4. คัดลอก Webhook URL

### 2. เพิ่ม Code Node
1. เพิ่ม "Code" node
2. เชื่อมต่อกับ Webhook
3. ใส่ code สำหรับประมวลผลข้อความ

### 3. เพิ่ม Respond Node
1. เพิ่ม "Respond to Webhook" node
2. เชื่อมต่อกับ Code node
3. ตั้งค่า response format เป็น JSON

## 📝 ตัวอย่าง Code Node

```javascript
// Extract messages from webhook data
const messages = $input.first().json.messages || [];
const systemPrompt = $input.first().json.systemPrompt || 'You are a helpful AI assistant.';

// Create a simple response based on the last user message
const lastMessage = messages[messages.length - 1];
let response = '';

if (lastMessage && lastMessage.role === 'user') {
  const userInput = lastMessage.content;
  
  // Simple response logic - you can replace this with actual AI integration
  if (userInput.toLowerCase().includes('hello') || userInput.toLowerCase().includes('hi')) {
    response = 'Hello! How can I help you today?';
  } else if (userInput.toLowerCase().includes('help')) {
    response = 'I\'m here to help! What would you like to know?';
  } else if (userInput.toLowerCase().includes('code') || userInput.toLowerCase().includes('programming')) {
    response = 'I can help you with programming questions! What specific language or problem are you working on?';
  } else {
    response = `I received your message: "${userInput}". This is a sample response from n8n. You can integrate with actual AI services like OpenAI, Claude, or other LLMs here.`;
  }
}

// Return the response
return {
  response: response,
  timestamp: new Date().toISOString(),
  messageCount: messages.length,
  systemPrompt: systemPrompt
};
```

## 🔗 การเชื่อมต่อกับ AI Services

### OpenAI Integration
```javascript
// ใน Code node
const { Configuration, OpenAIApi } = require('openai');

const configuration = new Configuration({
  apiKey: $env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const completion = await openai.createChatCompletion({
  model: "gpt-3.5-turbo",
  messages: messages,
});

return {
  response: completion.data.choices[0].message.content
};
```

### Claude Integration
```javascript
// ใน Code node
const response = await fetch('https://api.anthropic.com/v1/messages', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-api-key': $env.ANTHROPIC_API_KEY,
    'anthropic-version': '2023-06-01'
  },
  body: JSON.stringify({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1000,
    messages: messages
  })
});

const data = await response.json();
return {
  response: data.content[0].text
};
```

## ⚙️ การตั้งค่า Environment

สร้างไฟล์ `.env.local`:

```env
# n8n Configuration
N8N_BASE_URL=http://localhost:5678
N8N_API_KEY=your_api_key_here

# AI Service API Keys (ถ้าใช้)
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key
```

## 🧪 การทดสอบ

### 1. ทดสอบ n8n Connection
```bash
curl http://localhost:5678/api/v1/health
```

### 2. ทดสอบ Workflow API
```bash
curl http://localhost:3000/api/workflows
```

### 3. ทดสอบ Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ],
    "webhookUrl": "http://localhost:5678/webhook/your-webhook-id"
  }'
```

## 🎯 Features ที่ใช้งานได้

### Workflow Mode
- 🔄 Execute workflows by ID
- 📊 Monitor execution status
- 📝 View workflow results

### Webhook Mode
- 🌐 Direct webhook execution
- ⚡ Real-time responses
- 🔗 External service integration

### Connection Management
- ✅ Connection status monitoring
- 🔄 Auto-reconnection
- 📊 Workflow discovery

## 🐛 Troubleshooting

### n8n ไม่ตอบสนอง
```bash
# ตรวจสอบ Docker container
docker ps | grep n8n

# ดู logs
docker logs n8n

# รีสตาร์ท
docker-compose restart
```

### Workflow ไม่ทำงาน
1. ตรวจสอบว่า workflow active
2. ตรวจสอบ webhook URL
3. ดู execution logs ใน n8n

### API Error
```bash
# ตรวจสอบ environment variables
echo $N8N_BASE_URL
echo $N8N_API_KEY

# ตรวจสอบ n8n logs
docker logs n8n
```

## 🚀 การพัฒนาเพิ่มเติม

### เพิ่ม AI Services
- OpenAI GPT
- Anthropic Claude
- Google Gemini
- Local LLMs

### เพิ่ม Tools
- File operations
- Database queries
- API integrations
- Custom functions

### เพิ่ม Memory
- Conversation history
- User preferences
- Context management

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io/)
- [n8n Community](https://community.n8n.io/)
- [n8n GitHub](https://github.com/n8n-io/n8n)

## 🎉 สรุป

ตอนนี้คุณมี:
- ✅ AI Chat ที่เชื่อมต่อกับ n8n
- ✅ Workflow execution capabilities
- ✅ Webhook integration
- ✅ Extensible AI service integration
- ✅ Modern UI/UX

พร้อมใช้งานและพัฒนาต่อ! 🚀

