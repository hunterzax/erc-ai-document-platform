"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Trash2,
  MessageSquare,
  Clock,
  Plus,
  Search,
  Edit3,
  Calendar,
  User,
  Bot,
  RefreshCw,
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ChatSession {
  id: string
  title: string
  messageCount: number
  createdAt: string
  updatedAt: string
  lastMessage: string
}

interface ChatHistoryProps {
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
  currentSessionId?: string
  refreshTrigger?: number // Add this to trigger refresh
}

export function ChatHistory({ onSessionSelect, onNewChat, currentSessionId, refreshTrigger }: ChatHistoryProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [editingTitle, setEditingTitle] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => {
    loadChatHistory()
  }, [])

  // Refresh when refreshTrigger changes
  useEffect(() => {
    if (refreshTrigger) {
      loadChatHistory()
    }
  }, [refreshTrigger])

  const loadChatHistory = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/chat/history')
      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error('Failed to load chat history:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this chat session?')) return

    try {
      const response = await fetch(`/api/chat/history?sessionId=${sessionId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setSessions(prev => prev.filter(s => s.id !== sessionId))
      }
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const updateSessionTitle = async (sessionId: string, newTitle: string) => {
    try {
      const session = sessions.find(s => s.id === sessionId)
      if (!session) return

      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          title: newTitle,
          messages: [] // We'll update this when we have the actual messages
        })
      })

      if (response.ok) {
        setSessions(prev => prev.map(s =>
          s.id === sessionId ? { ...s, title: newTitle } : s
        ))
        setEditingTitle(null)
      }
    } catch (error) {
      console.error('Failed to update session title:', error)
    }
  }

  const filteredSessions = sessions.filter(session =>
    session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    session.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const startEditing = (session: ChatSession) => {
    setEditingTitle(session.id)
    setEditValue(session.title)
  }

  const handleEditSubmit = (sessionId: string) => {
    if (editValue.trim()) {
      updateSessionTitle(sessionId, editValue.trim())
    }
  }

  const handleEditCancel = () => {
    setEditingTitle(null)
    setEditValue('')
  }

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return 'Unknown'
    }
  }

  const truncateText = (text: string, maxLength: number = 50) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-semibold">Chat History</h2>
          <div className="flex items-center gap-2">
            <Button
              onClick={loadChatHistory}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0"
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={onNewChat} size="sm" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Chat
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border border-[#dedede] placeholder:opacity-40"
          />
        </div>
      </div>

      {/* Sessions List */}
      <ScrollArea className="flex-1 p-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {searchTerm ? 'No chats found' : 'No chat history yet'}
          </div>
        ) : (
          <div className="space-y-2">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className={`group relative p-3 rounded-lg border cursor-pointer transition-colors ${currentSessionId === session.id
                  ? 'bg-primary/10 border-primary'
                  : 'hover:bg-muted/50 border-border'
                  }`}
                onClick={() => onSessionSelect(session.id)}
              >
                {/* Title */}
                <div className="flex items-start justify-between mb-2">
                  {editingTitle === session.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleEditSubmit(session.id)
                          if (e.key === 'Escape') handleEditCancel()
                        }}
                        className="flex-1 h-8 text-sm"
                        autoFocus
                      />
                      <Button size="sm" onClick={() => handleEditSubmit(session.id)}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleEditCancel}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className='flex justify-between w-full'>
                      <h3 className="font-medium text-sm">
                        {truncateText(session.title, 25)}
                      </h3>
                      {/* Actions */}
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            startEditing(session)
                          }}
                          className="h-6 w-6 p-0"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteSession(session.id)
                          }}
                          className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  )}

                </div>

                {/* Last Message */}
                {session.lastMessage && (
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {truncateText(session.lastMessage, 80)}
                  </p>
                )}

                {/* Meta Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-3 w-3" />
                    <span>{session.messageCount} messages</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatDate(session.updatedAt)}</span>
                  </div>
                </div>

                {/* Created Date */}
                {/* <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3 inline mr-1" />
                  {formatDate(session.createdAt)}
                </div> */}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t text-xs text-muted-foreground text-center">
        {sessions.length} chat{sessions.length !== 1 ? 's' : ''} total
      </div>
    </div>
  )
}
