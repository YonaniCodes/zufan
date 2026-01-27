"use client"

import * as React from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: "user" | "assistant"
  content: string
  citations?: { source: string; content: string }[]
}

interface Chat {
  id: string
  title: string
  messages: Message[]
}

import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import { useSession, signOut } from "@/lib/auth-client"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { api, Message as ApiMessage } from "@/lib/api"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, User as UserIcon, Settings as SettingsIcon, ShieldCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const router = useRouter()

  const initialMessage: Message = {
    role: "assistant",
    content: "ጤና ይስጥልኝ! እኔ ዝፋን ነኝ። በኢትዮጵያ የሕግ ጉዳዮች ላይ የተዘጋጁ ሰነዶችን መሠረት አድርጌ ጥያቄዎችዎን ለመመለስ ዝግጁ ነኝ። እንዴት ልርዳዎት?",
  }

  const [chats, setChats] = React.useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = React.useState<string>("")
  const [isStreaming, setIsStreaming] = React.useState(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  // 1. Initial Load from Database or LocalStorage
  React.useEffect(() => {
    async function loadData() {
      if (user) {
        try {
          // If user is logged in, fetch from DB
          const dbSessions = await api.getChatSessions()
          if (dbSessions.length > 0) {
            // Fetch the full content for the current active chat or the first one
            const savedActiveId = localStorage.getItem("zufan_activeChatId")
            const targetId = dbSessions.find(s => s.id === savedActiveId)?.id || dbSessions[0].id

            const fullChats = await Promise.all(dbSessions.map(async (s) => {
              if (s.id === targetId) {
                const fullSession = await api.getChatSession(s.id)
                return {
                  id: fullSession.id,
                  title: fullSession.title,
                  messages: fullSession.messages.length > 0 ? fullSession.messages : [initialMessage]
                }
              }
              return { id: s.id, title: s.title, messages: [initialMessage] }
            }))

            setChats(fullChats)
            setActiveChatId(targetId)
          } else {
            // New user with no DB sessions, create first one in DB
            const firstId = Date.now().toString()
            await api.createChatSession(firstId, "ውይይት 1")
            const firstChat = { id: firstId, title: "ውይይት 1", messages: [initialMessage] }
            setChats([firstChat])
            setActiveChatId(firstId)
          }
        } catch (error) {
          console.error("Failed to load from DB:", error)
          // Fallback to localStorage if DB fails
          const savedChats = localStorage.getItem("zufan_chats")
          if (savedChats) setChats(JSON.parse(savedChats))
        }
      } else {
        // Guest user, use localStorage
        const savedChats = localStorage.getItem("zufan_chats")
        const savedActiveId = localStorage.getItem("zufan_activeChatId")
        if (savedChats) {
          try {
            const parsed = JSON.parse(savedChats)
            if (parsed.length > 0) {
              setChats(parsed)
              setActiveChatId(savedActiveId || parsed[0].id)
            } else {
              setChats([{ id: "1", title: "ውይይት 1", messages: [initialMessage] }])
              setActiveChatId("1")
            }
          } catch (e) {
            setChats([{ id: "1", title: "ውይይት 1", messages: [initialMessage] }])
            setActiveChatId("1")
          }
        } else {
          setChats([{ id: "1", title: "ውይይት 1", messages: [initialMessage] }])
          setActiveChatId("1")
        }
      }
      setIsInitialized(true)
    }
    loadData()
  }, [user])

  // Fetch full messages when switching chats (for authenticated users)
  React.useEffect(() => {
    if (user && activeChatId && isInitialized) {
      const chat = chats.find(c => c.id === activeChatId)
      if (chat && chat.messages.length === 1 && chat.messages[0].content === initialMessage.content) {
        api.getChatSession(activeChatId).then(fullSession => {
          setChats(prev => prev.map(c =>
            c.id === activeChatId
              ? { ...c, messages: fullSession.messages.length > 0 ? fullSession.messages : [initialMessage] }
              : c
          ))
        })
      }
    }
  }, [activeChatId, user, isInitialized])

  // 2. Save to LocalStorage for offline/guest persistence
  React.useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("zufan_chats", JSON.stringify(chats))
      localStorage.setItem("zufan_activeChatId", activeChatId)
    }
  }, [chats, activeChatId, isInitialized])

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0]
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async (content: string) => {
    if (!content.trim() || isStreaming) return

    // Limit check for guest users
    if (!user) {
      const userMessages = activeChat.messages.filter(m => m.role === "user")
      if (userMessages.length >= 20) { // increased for better dev exp
        toast.error("Sign in to continue chatting", {
          description: "Guest users are limited. Create an account for unlimited access.",
          duration: 5000,
        })
        return
      }
    }

    const userMsgId = Date.now().toString()
    const newUserMessage: Message = { role: "user", content }

    // 1. Add user message locally
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, newUserMessage] }
      }
      return chat
    }))

    // 2. Persist user message to DB if authenticated
    if (user) {
      api.addChatMessage(activeChatId, userMsgId, "user", content).catch(e => console.error("DB save error:", e))
    }

    // 3. Prepare assistant placeholder
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, { role: "assistant", content: "" }]
        }
      }
      return chat
    }))

    setIsStreaming(true)

    try {
      let accumulatedResponse = ""
      const history: ApiMessage[] = activeChat.messages
        .filter(m => m.role !== 'assistant' || m.content !== "")
        .concat(newUserMessage)
        .map(m => ({ role: m.role, content: m.content }))

      await api.chatStream({
        messages: history,
        sessionId: activeChatId,
        userId: user?.id
      }, (chunk) => {
        accumulatedResponse += chunk
        setChats(prev => prev.map(chat => {
          if (chat.id === activeChatId) {
            const newMessages = [...chat.messages]
            const lastMsg = newMessages[newMessages.length - 1]
            if (lastMsg.role === "assistant") {
              lastMsg.content = accumulatedResponse
            }
            return { ...chat, messages: newMessages }
          }
          return chat
        }))
      })

      // 4. Persist assistant final response to DB
      if (user) {
        const assistantMsgId = (Date.now() + 1).toString()
        api.addChatMessage(activeChatId, assistantMsgId, "assistant", accumulatedResponse).catch(e => console.error("DB save error:", e))
      }

    } catch (error) {
      console.error("Chat error:", error)
      const errorContent = "ይቅርታ፣ ምላሽ ለመስጠት ችግር አጋጥሞኛል። እባክዎ ትንሽ ቆይተው እንደገና ይሞክሩ።"
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          const newMessages = [...chat.messages]
          const lastMsg = newMessages[newMessages.length - 1]
          if (lastMsg.role === "assistant" && lastMsg.content === "") {
            lastMsg.content = errorContent
          }
          return { ...chat, messages: newMessages }
        }
        return chat
      }))

      if (user) {
        api.addChatMessage(activeChatId, (Date.now() + 1).toString(), "assistant", errorContent).catch(e => console.error("DB save error:", e))
      }
    } finally {
      setIsStreaming(false)
    }
  }

  const handleNewChat = async () => {
    const newId = Date.now().toString()
    const title = `ውይይት ${chats.length + 1}`

    if (user) {
      try {
        await api.createChatSession(newId, title)
      } catch (e) {
        toast.error("Failed to create chat in database")
        return
      }
    }

    const newChat: Chat = {
      id: newId,
      title: title,
      messages: [initialMessage]
    }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newId)
  }

  const handleDeleteChat = async (id: string) => {
    if (user) {
      try {
        await api.deleteChatSession(id)
      } catch (e) {
        toast.error("Failed to delete chat from database")
        return
      }
    }

    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id)
      if (id === activeChatId) {
        if (filtered.length > 0) {
          setActiveChatId(filtered[0].id)
        } else {
          const newId = Date.now().toString()
          const newChat: Chat = {
            id: newId,
            title: "ውይይት 1",
            messages: [initialMessage]
          }
          if (user) api.createChatSession(newId, "ውይይት 1").catch(console.error)
          setActiveChatId(newId)
          return [newChat]
        }
      }
      return filtered
    })
  }

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [activeChat?.messages])

  if (!isInitialized || !activeChat) {
    return null
  }

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <ChatSidebar
        chats={chats.map(c => ({ id: c.id, title: c.title }))}
        activeChatId={activeChatId}
        onChatSelect={setActiveChatId}
        onNewChat={handleNewChat}
        onChatDelete={handleDeleteChat}
      />

      <SidebarInset className="flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-4 justify-between bg-background z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <h2 className="font-bold text-lg font-amharic">ዝፋን</h2>
            <div className="px-2 py-1 rounded bg-muted text-[10px] font-bold tracking-wider">LITE</div>
          </div>
          {!isPending && (
            user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-10 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.image || ""} alt={user.name || ""} />
                      <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        <span>Admin Panel</span>
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={async () => {
                      await signOut()
                      router.refresh()
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out {session?.user?.name} </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <AuthDialog defaultMode="login">
                  <Button variant="outline" className="h-10">
                    Login
                  </Button>
                </AuthDialog>
                <AuthDialog defaultMode="signup">
                  <Button className="h-10">Sign Up</Button>
                </AuthDialog>
              </div>
            )
          )}
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto" ref={scrollRef}>
          <div className="flex flex-col w-full max-w-4xl mx-auto pb-32">
            {activeChat.messages.map((message, i) => (
              <ChatMessage
                key={i}
                role={message.role}
                content={message.content}
                citations={message.citations}
              />
            ))}
          </div>
        </div>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10">
          <ChatInput onSend={handleSend} />
        </div>
      </SidebarInset>
    </div>
  )
}
