"use client"

import {
  ChatContainerContent,
  ChatContainerRoot,
} from "@/components/ui/chat-container"
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ui/message"
import {
  PromptInput,
  PromptInputAction,
  PromptInputActions,
  PromptInputTextarea,
} from "@/components/ui/prompt-input"
import { ScrollButton } from "@/components/ui/scroll-button"
import { ResponseStream, useTextStream } from "@/components/ui/response-stream"
import { PromptSuggestion } from "@/components/ui/prompt-suggestion"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ChatHistory } from "@/components/chat-history"
import { WebhookStatus } from "@/components/webhook-status"
import { cn } from "@/lib/utils"
import {
  ArrowUp,
  Copy,
  Globe,
  Mic,
  MoreHorizontal,
  Pencil,
  Plus,
  PlusIcon,
  Search,
  ThumbsDown,
  ThumbsUp,
  Trash,
  History,
  Settings,
  MessageSquare,
  Badge,
} from "lucide-react"
import { useRef, useState, useEffect } from "react"

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp?: string
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

function ChatSidebar({ 
  onSessionSelect, 
  onNewChat, 
  currentSessionId 
}: { 
  onSessionSelect: (sessionId: string) => void
  onNewChat: () => void
  currentSessionId?: string
}) {
  return (
    <Sidebar>
      <SidebarHeader className="flex flex-row items-center justify-between gap-2 px-2 py-4">
        <div className="flex flex-row items-center gap-2 px-2">
          <div className="bg-primary/10 size-8 rounded-md"></div>
          <div className="text-md font-base text-primary tracking-tight">
            AI Chat
          </div>
        </div>
        <Button variant="ghost" className="size-8">
          <History className="size-4" />
        </Button>
      </SidebarHeader>
      <SidebarContent className="pt-4">
        <ChatHistory 
          onSessionSelect={onSessionSelect}
          onNewChat={onNewChat}
          currentSessionId={currentSessionId}
        />
      </SidebarContent>
    </Sidebar>
  )
}

function ChatContent({ 
  currentSessionId,
  onSessionUpdate 
}: { 
  currentSessionId?: string
  onSessionUpdate: (session: ChatSession) => void
}) {
  const [prompt, setPrompt] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [sessionTitle, setSessionTitle] = useState("New Chat")
  const chatContainerRef = useRef<HTMLDivElement>(null)
//   const [inputValue, setInputValue] = useState("")
  const handleSend = () => {
    if (prompt.trim()) {
      console.log("Sending:", prompt)
      setPrompt("")
    }
  }

  const { displayedText, startStreaming } = useTextStream({
    textStream: "markdownText",
    mode: "typewriter",
    speed: 30,
  })

  // Load session when currentSessionId changes
  useEffect(() => {
    if (currentSessionId) {
      loadSession(currentSessionId)
    } else {
      // New chat
      setChatMessages([])
      setSessionTitle("New Chat")
    }
    startStreaming()
  }, [currentSessionId,startStreaming])

  const loadSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/chat/history/${sessionId}`)
      if (response.ok) {
        const data = await response.json()
        const session = data.session
        setChatMessages(session.messages)
        setSessionTitle(session.title)
      }
    } catch (error) {
      console.error('Failed to load session:', error)
    }
  }

  // Generate title from messages
  const generateSessionTitle = (messages: ChatMessage[]): string => {
    const firstUserMessage = messages.find(msg => msg.role === 'user')
    if (!firstUserMessage) return 'New Chat'
    
    const content = firstUserMessage.content
    if (content.length <= 50) return content
    return content.substring(0, 50) + '...'
  }

  const saveSession = async (messages: ChatMessage[], title?: string) => {
    try {
      // Generate title automatically if not provided
      const autoTitle = title || generateSessionTitle(messages)
      
      const response = await fetch('/api/chat/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: currentSessionId,
          messages,
          title: autoTitle,
          webhookUrl: process.env.N8N_WEBHOOK_URL
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (!currentSessionId) {
          // New session created, update the current session
          window.history.replaceState(null, '', `/chat?session=${data.session.id}`)
          onSessionUpdate(data.session)
          setSessionTitle(autoTitle)
        }
      }
    } catch (error) {
      console.error('Failed to save session:', error)
    }
  }

  // Save current session before starting new chat
  const saveCurrentSession = async () => {
    if (chatMessages.length > 0) {
      await saveSession(chatMessages, sessionTitle)
    }
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    const userPrompt = prompt.trim()
    setPrompt("")
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      id: chatMessages.length + 1,
      role: "user",
      content: userPrompt,
      timestamp: new Date().toISOString()
    }

    const updatedMessages = [...chatMessages, newUserMessage]
    setChatMessages(updatedMessages)

    // Save session after user message
    await saveSession(updatedMessages)

    try {
      // Call n8n webhook API (webhook URL is configured in environment)
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to get response from AI')
      }

      const data = await response.json()
      console.log(data);
      console.log(JSON.parse(data.message));
      
      const assistantResponse: ChatMessage = {
        id: updatedMessages.length + 1,
        role: "assistant",
        content: JSON.parse(data.message).output || JSON.stringify(data.message),
        timestamp: new Date().toISOString()
      }

      const finalMessages = [...updatedMessages, assistantResponse]
      setChatMessages(finalMessages)

      // Save session after assistant response
      await saveSession(finalMessages)

    } catch (error) {
      console.error('Error calling AI API:', error)
      
      // Add error message with more helpful information
      let errorContent = "Sorry, I encountered an error. "
      
      if (error instanceof Error) {
        if (error.message.includes('webhook') && error.message.includes('not registered')) {
          errorContent += "The webhook is not registered "
        } else if (error.message.includes('Failed to fetch')) {
          errorContent += "Cannot connect to n8n. server"
        } else {
          errorContent += error.message
        }
      } else {
        errorContent += "Please make sure n8n is running and the webhook is configured correctly."
      }
      
      const errorMessage: ChatMessage = {
        id: updatedMessages.length + 1,
        role: "assistant",
        content: errorContent,
        timestamp: new Date().toISOString()
      }
      
      const finalMessages = [...updatedMessages, errorMessage]
      setChatMessages(finalMessages)
      
      // Save session after error message
      await saveSession(finalMessages)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = async () => {
    // Save current session before starting new chat
    await saveCurrentSession()
    
    // Reset for new chat
    setChatMessages([])
    setSessionTitle("New Chat")
    window.history.replaceState(null, '', '/chat')
    onSessionUpdate({
      id: '',
      title: "New Chat",
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  }

  const handleSessionSelect = async (sessionId: string) => {
    // Save current session before switching
    await saveCurrentSession()
    
    // Load selected session
    window.history.replaceState(null, '', `/chat?session=${sessionId}`)
    onSessionUpdate({
      id: sessionId,
      title: "",
      messages: [],
      createdAt: "",
      updatedAt: ""
    })
  }

  const handleSessionUpdate = (session: ChatSession) => {
    onSessionUpdate(session)
  }

  return (
    <main className="flex h-screen flex-col overflow-hidden">
      <header className="bg-background z-10 flex h-16 w-full shrink-0 items-center gap-4 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="text-foreground flex items-center gap-2">
          <span>{sessionTitle}</span>
          {currentSessionId && (
            <Badge className="text-xs bg-secondary text-secondary-foreground">
              {chatMessages.length} messages
            </Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <WebhookStatus onTestMessage={(message) => setPrompt(message)} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>
      </header>

      <div ref={chatContainerRef} className="relative flex-1 overflow-y-auto">
        <ChatContainerRoot className="h-full">
          <ChatContainerContent className="space-y-0 px-5 py-12">
            {chatMessages.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">Start a new conversation</h3>
                <p className="text-sm">Type a message below to begin chatting with AI</p>
                    <div className="flex w-full flex-col space-y-4">
                        <div className="flex flex-wrap gap-2 w-[500px] items-center">
                            <PromptSuggestion onClick={() => setPrompt("Tell me a joke")}>
                                ขอเรียกความสนใจ
                                </PromptSuggestion>

                                <PromptSuggestion onClick={() => setPrompt("How does this work?")}>
                                สวัสดีครับ
                                </PromptSuggestion>

                                <PromptSuggestion
                                onClick={() => setPrompt("สรุปคำพิพากษา คดีพิพาทหมายเลข ๓๔๔/๒๕๖ มาให้หน่อยแบบละเอียด")}
                                >
                                สรุปคำพิพากษา คดีพิพาทหมายเลข ๓๔๔/๒๕๖ มาให้หน่อยแบบละเอียด
                                </PromptSuggestion>

                                <PromptSuggestion onClick={() => setPrompt("Write a poem")}>
                                Write a poem
                                </PromptSuggestion>
                                <PromptSuggestion
                                onClick={() => setPrompt("Code a React component")}
                                >
                                Code a React component
                            </PromptSuggestion>
                        </div>
                    </div>
              </div>
            ) : (
              chatMessages.map((message, index) => {
                const isAssistant = message.role === "assistant"
                const isLastMessage = index === chatMessages.length - 1

                return (
                  <Message
                    key={`message-${message.id}-${index}`}
                    className={cn(
                      "mx-auto flex w-full max-w-3xl flex-col gap-2 px-6",
                      isAssistant ? "items-start" : "items-end"
                    )}
                  >
                    {isAssistant ? ( // ฝั้่ง Bot ตอบ
                      <div className="group flex w-full flex-col gap-0">
                        <MessageContent
                          className="text-foreground prose flex-1 rounded-lg bg-transparent p-0 text-sm"
                          markdown
                        >
                          {message.content}
                          {/* <ResponseStream
                                textStream={message.content}
                                mode="typewriter"
                                speed={20}
                                className="text-sm"
                            /> */}
                          {/* {displayedText} */}
                        </MessageContent>
                        <MessageActions
                          className={cn(
                            "-ml-2.5 flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
                            isLastMessage && "opacity-100"
                          )}
                        >
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Copy />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Upvote" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ThumbsUp />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Downvote" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <ThumbsDown />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    ) : (
                      <div className="group flex flex-col items-end gap-1">
                        <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%] text-sm">
                          {message.content}
                        </MessageContent>
                        <MessageActions
                          className={cn(
                            "flex gap-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
                          )}
                        >
                          <MessageAction tooltip="Edit" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Pencil />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Delete" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Trash />
                            </Button>
                          </MessageAction>
                          <MessageAction tooltip="Copy" delayDuration={100}>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="rounded-full"
                            >
                              <Copy />
                            </Button>
                          </MessageAction>
                        </MessageActions>
                      </div>
                    )}
                  </Message>
                )
              })
            )}
          </ChatContainerContent>
          {chatMessages.length > 0 && (
            <div className="absolute bottom-4 left-1/2 flex w-full max-w-3xl -translate-x-1/2 justify-end px-5">
              <ScrollButton className="shadow-sm" />
            </div>
          )}
        </ChatContainerRoot>
      </div>

        <div className="bg-background z-10 shrink-0 px-3 pb-3 md:px-5 md:pb-5">
            <div className="mx-auto max-w-3xl">
            
                
          <PromptInput
            isLoading={isLoading}
            value={prompt}
            onValueChange={setPrompt}
            onSubmit={handleSubmit}
            className="border-input bg-popover relative z-10 w-full rounded-3xl border-2 p-0 pt-1 shadow-xs"
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder="ป้อนคำถามมาได้...."
                className="min-h-[44px] pt-3 pl-4 leading-[1.3] sm:text-base md:text-base text-sm"
              />

              <PromptInputActions className="mt-5 flex w-full items-center justify-between gap-2 px-3 pb-3 text-sm">
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="Add a new action">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Plus size={18} />
                    </Button>
                  </PromptInputAction>

                  <PromptInputAction tooltip="Search">
                    <Button variant="outline" className="rounded-full">
                      <Globe size={18} />
                      Search
                    </Button>
                  </PromptInputAction>

                  <PromptInputAction tooltip="More actions">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <MoreHorizontal size={18} />
                    </Button>
                  </PromptInputAction>
                </div>
                <div className="flex items-center gap-2">
                  <PromptInputAction tooltip="Voice input">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-9 rounded-full"
                    >
                      <Mic size={18} />
                    </Button>
                  </PromptInputAction>

                  <Button
                    size="icon"
                    disabled={!prompt.trim() || isLoading}
                    onClick={handleSubmit}
                    className="size-9 rounded-full"
                  >
                    {!isLoading ? (
                      <ArrowUp size={18} />
                    ) : (
                      <span className="size-3 rounded-xs bg-white" />
                    )}
                  </Button>
                </div>
              </PromptInputActions>
            </div>
          </PromptInput>
        </div>
      </div>
    </main>
  )
}

export default function ChatPage() {
  const [currentSession, setCurrentSession] = useState<ChatSession>({
    id: '',
    title: "New Chat",
    messages: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const handleSessionUpdate = (session: ChatSession) => {
    setCurrentSession(session)
  }

  return (
    <SidebarProvider>
      <ChatSidebar 
        onSessionSelect={(sessionId) => {
          setCurrentSession({
            id: sessionId,
            title: "",
            messages: [],
            createdAt: "",
            updatedAt: ""
          })
        }}
        onNewChat={() => {
          setCurrentSession({
            id: '',
            title: "New Chat",
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }}
        currentSessionId={currentSession.id}
      />
      <SidebarInset>
        <ChatContent 
          currentSessionId={currentSession.id}
          onSessionUpdate={handleSessionUpdate}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}

