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
  MessageCircle,
  SeparatorHorizontal,
  ArrowBigDownDash,
} from "lucide-react"
import { useRef, useState, useEffect } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/header-bar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@radix-ui/react-separator"
import { Textarea } from "@/components/ui/textarea"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import axios from "axios"
const tokenURL = process.env.NEXT_PUBLIC_N8N_BASE_URL;

interface ChatMessage {
  id: number
  role: "user" | "assistant"
  content: string
  timestamp?: string,
  ref?: any
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
    <div className="w-full h-[calc(100dvh-65px)] overflow-hidden border-r border-[#dedede]">
      <div className="flex flex-row items-center justify-between gap-2 px-2 py-4">
        <div className="flex flex-row items-center gap-2 px-2">
          <div className="bg-blue-500 size-8 rounded-md flex items-center justify-center text-white">
            <MessageCircle size={16} />
          </div>
          <div className="text-md font-base text-primary tracking-tight">
            AI Chat
          </div>
        </div>
        {/* <Button variant="ghost" className="size-8">
          <History className="size-4" />
        </Button> */}
      </div>
      <div className="overflow-x-auto h-[calc(100dvh-135px)] custom-scroll">
        <ChatHistory
          onSessionSelect={onSessionSelect}
          onNewChat={onNewChat}
          currentSessionId={currentSessionId}
        />
      </div>
    </div>
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

  const [triggertyp, settriggertyp] = useState(false);

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
  }, [currentSessionId, startStreaming])

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
    settriggertyp(false); //trigger last chat for new chat

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
      // console.log(data);
      // console.log(JSON.parse(data.message));

      const assistantResponse: ChatMessage = {
        id: updatedMessages.length + 1,
        role: "assistant",
        content: JSON.parse(data.message).output || JSON.stringify(data.message),
        ref: JSON.parse(data?.message)?.reference,
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
      settriggertyp(true);
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

  const downloadPDF = async (file_name: any) => {
    try {
      const response = await axios.get(`${tokenURL}/raw_docs_pdf/${file_name}`, {
        responseType: 'blob', // 👈 สำคัญมาก!
      });

      if (response.status === 200) {
        const url = window.URL.createObjectURL(response.data); // ใช้ response.data ตรงๆ
        const link = document.createElement('a');
        link.href = url;
        link.download = `${file_name}.pdf`; // ชื่อไฟล์ที่จะดาวน์โหลด
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url); // ♻️ free memory
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  }

  const typingMessage: any = (txt: any) => {
    return (
      <div className="w-full min-w-full">
        <ResponseStream
          textStream={txt}
          mode="typewriter"
          speed={20}
          className="text-sm leading-[2]"
        />
      </div>
    )
  }

  return (
    <main className="flex h-[calc(100dvh-70px)] flex-col overflow-hidden">
      <header className="bg-background z-10 flex h-16 w-full shrink-0 items-center gap-4 border-b px-4">
        <div className="text-foreground flex items-center gap-2">
          <span>{sessionTitle}</span>
          {currentSessionId && (
            <Badge className="text-xs bg-blue-500 rounded-xl text-secondary-foreground">
              {chatMessages?.length} messages
            </Badge>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <WebhookStatus onTestMessage={(message) => setPrompt(message)} />
          {/* <Button
            variant="outline"
            size="sm"
            onClick={handleNewChat}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button> */}
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
                <div className="flex w-full flex-col space-y-4 items-center pt-5">
                  <div className="flex flex-wrap gap-2 w-[500px] items-center justify-center">
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
              chatMessages?.map((message, index) => {
                const isAssistant = message?.role === "assistant"
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
                      <div className="group flex w-full flex-col gap-0 text-sm">
                        {isLastMessage && triggertyp ? typingMessage(message?.content)
                          :
                          <MessageContent
                            className="text-foreground prose flex-1 rounded-lg bg-transparent p-0 text-sm leading-[2]"
                            markdown
                          >
                            {message?.content}
                          </MessageContent>
                        }
                        {message?.ref && message?.ref?.raw_document?.context && (
                          <div className="pt-5">
                            <div className="text-sm mb-5 border-t border-[#eeeeee] pt-5">
                              <div className="mb-3">{'อ้างอิงจาก'}</div>
                              {/* <a href="#" className="hover:text-blue-400 duration-200 ease-in-out italic">{message?.ref?.raw_document?.file_name}</a> */}
                              <Accordion
                                type="single"
                                collapsible
                                className="w-full"
                              >
                                <AccordionItem value={`itemx`} key={index} className="group">
                                  <AccordionTrigger
                                    className="p-2 bg-transparent
                                    data-[state='open']:!bg-[#dfdfdf] rounded-none data-[state='open']:!rounded-t-lg text-sm italic 
                                    flex justify-start items-center text-left hover:text-blue-500"
                                  >
                                    {message?.ref?.raw_document?.file_name}
                                  </AccordionTrigger>
                                  <AccordionContent className="flex flex-col gap-4 text-balance p-4 bg-[#eeeeee] italic shadow-lg rounded-b-lg">
                                    <textarea
                                      data-slot="textarea"
                                      className={cn(
                                        "placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base border-none shadow-none outline-none md:text-sm focus-visible:outline-none focus-visible:ring-0 focus:outline-none focus:!shadow-none disabled:cursor-text disabled:!text-gray-600 disabled:opacity-100",

                                      )}
                                      disabled
                                      value={message?.ref?.raw_document?.context}
                                      readOnly

                                    />
                                    <div className="flex justify-end">
                                      <button
                                        className="bg-[#117bf5] p-2 rounded-md flex items-center gap-2 text-white"
                                        onClick={() => downloadPDF(message?.ref?.raw_document?.file_name)}
                                      >
                                        <ArrowBigDownDash />
                                        <span>{'ดาวน์โหลด PDF'}</span>
                                      </button>
                                    </div>
                                  </AccordionContent>
                                </AccordionItem>
                              </Accordion>
                              {/* <div className="bg-[#e7e7e7] rounded-md text-[#696969]">
                                <textarea
                                  data-slot="textarea"
                                  className={cn(
                                    "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none md:text-sm focus-visible:outline-none focus-visible:ring-0 disabled:opacity-50 focus:outline-none focus:!shadow-none disabled:cursor-pointer",
                                    
                                  )}
                                  disabled
                                  value={message?.ref?.raw_document?.context}
                                  readOnly
                                  
                                />
                              </div> */}
                            </div>
                          </div>
                        )}
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
                        <MessageContent className="bg-muted text-primary max-w-[85%] rounded-3xl px-5 py-2.5 sm:max-w-[75%] text-sm leading-[2]">
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

            {isLoading &&
              <div className="mx-auto flex w-full max-w-3xl flex-col gap-2 px-6 anifade">
                <div className="flex gap-3 justify-start ">
                  <Skeleton className="w-5 h-5 rounded-full mt-1 bg-gray-500" />
                  <div className="space-y-2 w-full">
                    <Skeleton className="h-2 w-3/4 bg-gray-500" />
                    <Skeleton className="h-2 w-3/5 bg-gray-500" />
                    <Skeleton className="h-2 w-1/2 bg-gray-500" />
                  </div>
                </div>
              </div>
            }
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
            className="bg-popover relative z-10 w-full rounded-3xl border border-gray-200 p-0 pt-1 shadow-xs"
          >
            <div className="flex flex-col">
              <PromptInputTextarea
                placeholder="ป้อนคำถามมาได้...."
                className="min-h-[44px] pt-3 pl-4 leading-[1.3] sm:text-base md:text-base text-sm placeholder:opacity-40"
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
      <AppSidebar />
      <SidebarInset>
        <AppHeader title={'แชท AI'} />
        <div className="grid grid-cols-[300px_calc(100vw-560px)] overflow-hidden">
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
          <ChatContent
            currentSessionId={currentSession.id}
            onSessionUpdate={handleSessionUpdate}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )

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

