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

export default function HomePage() {
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "ጤና ይስጥልኝ! እኔ ዝፋን ነኝ። በኢትዮጵያ የሕግ ጉዳዮች ላይ የተዘጋጁ ሰነዶችን መሠረት አድርጌ ጥያቄዎችዎን ለመመለስ ዝግጁ ነኝ። እንዴት ልርዳዎት?",
    },
  ])
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true)
  const scrollRef = React.useRef<HTMLDivElement>(null)

  const handleSend = async (content: string) => {
    // Add user message
    const newUserMessage: Message = { role: "user", content }
    setMessages((prev) => [...prev, newUserMessage])

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
      setMessages((prev) => [...prev, assistantResponse])
    }, 1000)
  }

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages])

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      {/* Desktop Sidebar */}
      <ChatSidebar 
        className={`${isSidebarOpen ? "w-72" : "w-0"} transition-all duration-300 ease-in-out shrink-0 overflow-hidden hidden md:flex`} 
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative min-w-0">
        {/* Header */}
        <header className="h-14 border-b flex items-center px-4 justify-between bg-background z-10">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:flex hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="size-5" />
            </Button>
            <h2 className="font-bold text-lg font-amharic">ዝፋን</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-1 rounded bg-muted text-[10px] font-bold tracking-wider">LITE</div>
          </div>
        </header>

        {/* Messages */}
        <ScrollArea className="flex-1" ref={scrollRef}>
          <div className="flex flex-col w-full max-w-4xl mx-auto pb-32">
            {messages.map((message, i) => (
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
      </main>
    </div>
  )
}
