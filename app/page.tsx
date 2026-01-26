"use client"

import * as React from "react"
import { ChatSidebar } from "@/components/chat/chat-sidebar"
import { ChatMessage } from "@/components/chat/chat-message"
import { ChatInput } from "@/components/chat/chat-input"
import { ScrollArea } from "@/components/ui/scroll-area"
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

export default function HomePage() {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const router = useRouter()

  const initialMessage: Message = {
    role: "assistant",
    content: "ጤና ይስጥልኝ! እኔ ዝፋን ነኝ። በኢትዮጵያ የሕግ ጉዳዮች ላይ የተዘጋጁ ሰነዶችን መሠረት አድርጌ ጥያቄዎችዎን ለመመለስ ዝግጁ ነኝ። እንዴት ልርዳዎት?",
  }

  const [chats, setChats] = React.useState<Chat[]>([
    { id: "1", title: "ውይይት 1", messages: [initialMessage] }
  ])
  const [activeChatId, setActiveChatId] = React.useState<string>("1")

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0]
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async (content: string) => {
    // Add user message to active chat
    const newUserMessage: Message = { role: "user", content }

    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        return { ...chat, messages: [...chat.messages, newUserMessage] }
      }
      return chat
    }))

    // Mock assistant response
    setTimeout(() => {
      const assistantResponse: Message = {
        role: "assistant",
        content: `ለጥያቄዎ: "${content}" አመሰግናለሁ። በኢትዮጵያ የፍትሐ ብሔር ሕግ መሠረት ይህ ጉዳይ በውል ሕግ ሥር ይካተታል። ተጨማሪ ዝርዝር መረጃዎችን ከሕጉ ጠቅሼ ማቅረብ እችላለሁ።`,
        citations: [
          {
            source: "የኢትዮጵያ ፍትሐ ብሔር ሕግ ቁጥር 1675",
            content: "ውል ማለት በሁለት ወይም ከዚያ በላይ በሆኑ ሰዎች መካከል መብትንና ግዴታን ለመፍጠር፣ ለመለወጥ ወይም ለማጥፋት የሚደረግ ስምምነት ነው።",
          },
        ],
      }

      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...chat.messages, assistantResponse] }
        }
        return chat
      }))
    }, 1000)
  }

  const handleNewChat = () => {
    const newId = Date.now().toString()
    const newChat: Chat = {
      id: newId,
      title: `ውይይት ${chats.length + 1}`,
      messages: [initialMessage]
    }
    setChats(prev => [...prev, newChat])
    setActiveChatId(newId)
  }

  const handleDeleteChat = (id: string) => {
    setChats(prev => {
      const filtered = prev.filter(c => c.id !== id)

      // If we deleted the active chat, switch to another one
      if (id === activeChatId) {
        if (filtered.length > 0) {
          setActiveChatId(filtered[0].id)
        } else {
          // If no chats left, create a new one
          const newId = Date.now().toString()
          const newChat: Chat = {
            id: newId,
            title: "ውይይት 1",
            messages: [initialMessage]
          }
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
  }, [activeChat.messages])

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
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
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
        </ScrollArea>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-background via-background/90 to-transparent pt-10">
          <ChatInput onSend={handleSend} />
        </div>
      </SidebarInset>
    </div>
  )
}
