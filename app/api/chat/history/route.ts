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

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(HISTORY_FILE_PATH)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Load chat history from file
async function loadChatHistory(): Promise<ChatSession[]> {
  try {
    await ensureDataDirectory()
    const data = await fs.readFile(HISTORY_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return []
  }
}

// Save chat history to file
async function saveChatHistory(history: ChatSession[]): Promise<void> {
  await ensureDataDirectory()
  await fs.writeFile(HISTORY_FILE_PATH, JSON.stringify(history, null, 2))
}

// Generate session title from first user message
function generateSessionTitle(messages: ChatMessage[]): string {
  const firstUserMessage = messages.find(msg => msg.role === 'user')
  if (!firstUserMessage) return 'New Chat'
  
  const content = firstUserMessage.content
  if (content.length <= 50) return content
  return content.substring(0, 50) + '...'
}

// GET: Retrieve all chat sessions
export async function GET() {
  try {
    const history = await loadChatHistory()
    
    // Return sessions with basic info (without full messages)
    const sessions = history.map(session => ({
      id: session.id,
      title: session.title,
      messageCount: session.messages.length,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      lastMessage: session.messages[session.messages.length - 1]?.content || ''
    }))
    
    return NextResponse.json({ sessions })
  } catch (error) {
    console.error('Failed to load chat history:', error)
    return NextResponse.json(
      { error: 'Failed to load chat history' },
      { status: 500 }
    )
  }
}

// POST: Create new chat session or update existing
export async function POST(request: NextRequest) {
  try {
    const { sessionId, messages, title, model, webhookUrl } = await request.json()
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      )
    }

    const history = await loadChatHistory()
    const now = new Date().toISOString()
    
    // Add timestamps to messages if they don't have them
    const messagesWithTimestamps = messages.map(msg => ({
      ...msg,
      timestamp: msg.timestamp || now
    }))
    
    let session: ChatSession
    let sessionIndex = -1
    
    if (sessionId) {
      // Update existing session
      sessionIndex = history.findIndex(s => s.id === sessionId)
      if (sessionIndex === -1) {
        return NextResponse.json(
          { error: 'Session not found' },
          { status: 404 }
        )
      }
      
      session = {
        ...history[sessionIndex],
        messages: messagesWithTimestamps,
        updatedAt: now,
        title: title || history[sessionIndex].title,
        model,
        webhookUrl
      }
      
      history[sessionIndex] = session
    } else {
      // Create new session
      const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
      session = {
        id: newSessionId,
        title: title || generateSessionTitle(messagesWithTimestamps),
        messages: messagesWithTimestamps,
        createdAt: now,
        updatedAt: now,
        model,
        webhookUrl
      }
      
      history.push(session)
    }
    
    await saveChatHistory(history)
    
    return NextResponse.json({
      success: true,
      session: {
        id: session.id,
        title: session.title,
        messageCount: session.messages.length,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt
      }
    })
    
  } catch (error) {
    console.error('Failed to save chat history:', error)
    return NextResponse.json(
      { error: 'Failed to save chat history' },
      { status: 500 }
    )
  }
}

// DELETE: Delete a chat session
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')
    
    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      )
    }
    
    const history = await loadChatHistory()
    const filteredHistory = history.filter(session => session.id !== sessionId)
    
    if (filteredHistory.length === history.length) {
      return NextResponse.json(
        { error: 'Session not found' },
        { status: 404 }
      )
    }
    
    await saveChatHistory(filteredHistory)
    
    return NextResponse.json({
      success: true,
      message: 'Session deleted successfully'
    })
    
  } catch (error) {
    console.error('Failed to delete chat session:', error)
    return NextResponse.json(
      { error: 'Failed to delete chat session' },
      { status: 500 }
    )
  }
}

