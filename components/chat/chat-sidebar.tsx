"use client"

import * as React from "react"
import { Plus, MessageSquare, Search, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

interface ChatSidebarProps {
  className?: string
}

export function ChatSidebar({ className }: ChatSidebarProps) {
  // Mock history for now
  const history = [
    { id: "1", title: "የውል ሕግ ጥያቄ", date: "ዛሬ" },
    { id: "2", title: "የንግድ ምዝገባ ሂደት", date: "ትናንት" },
    { id: "3", title: "የሥራ ውል ስምምነት", date: "ባለፈው ሳምንት" },
  ]

  return (
    <div className={cn("flex flex-col h-full bg-sidebar border-r", className)}>
      <div className="p-4 flex items-center gap-2">
        <Button variant="outline" className="flex-1 justify-start gap-2 border-dashed bg-transparent" size="lg">
          <Plus className="size-4" />
          አዲስ ውይይት
        </Button>
        <ModeToggle />
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="flex flex-col gap-2 py-2">
          {history.map((item) => (
            <button
              key={item.id}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm text-left rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors group"
            >
              <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
              <span className="truncate flex-1 font-amharic">{item.title}</span>
              <MoreHorizontal className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-sidebar-accent cursor-pointer transition-colors font-amharic">
          <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">
            ዩ
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">ዮናስ</p>
            <p className="text-xs text-muted-foreground truncate">pro account</p>
          </div>
        </div>
      </div>
    </div>
  )
}
