import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

interface ChatMessage {
  id: number
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

interface ChatSession {
  id: string
  title: string
  messages: ChatMessage[]
  createdAt: string
  updatedAt: string
  model?: string
  webhookUrl?: string
}

const HISTORY_FILE_PATH = path.join(process.cwd(), 'data', 'chat-history.json')

// Load chat history from file
async function loadChatHistory(): Promise<ChatSession[]> {
  try {
    const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    return []
  }
}

// GET: Retrieve specific chat session
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    const history = await loadChatHistory()
    const session = history.find(s => s.id === sessionId)
    
    if (!session) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ session })
    
  } catch (error) {
    console.error('Failed to load chat session:', error)
    return NextResponse.json(
      { error: 'Failed to load chat session' },
      { status: 500 }
    )
  }
}

// PUT: Update specific chat session
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  try {
    const { sessionId } = await params
    const { messages, title, model, webhookUrl } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }
    
    const history = await loadChatHistory()
    const sessionIndex = history.findIndex(s => s.id === sessionId)
    
    if (sessionIndex === -1) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    const now = new Date().toISOString()
    
    // Add timestamps to messages if they don't have them
    const messagesWithTimestamps = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || now
    }))
    
    // Update session
    history[sessionIndex] = {
      ...history[sessionIndex],
      messages: messagesWithTimestamps,
      updatedAt: now,
      title: title || history[sessionIndex].title,
      model,
      webhookUrl
    }
    
    // Save updated history
    await fs.writeFile(HISTORY_FILE_PATH, JSON.stringify(history, null, 2))
    
    return NextResponse.json({
      success: true,
      session: history[sessionIndex]
    })
    
  } catch (error) {
    console.error('Failed to update chat session:', error)
    return NextResponse.json(
      { error: 'Failed to update chat session' },
      { status: 500 }
    )
  }
}
