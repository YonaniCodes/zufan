"use client"

import * as React from "react"
import { Bot, User, Quote } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Citation {
  source: string
  content: string
}

interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
  citations?: Citation[]
}

export function ChatMessage({ role, content, citations }: ChatMessageProps) {
  const isAssistant = role === "assistant"

  return (
    <div className={cn("flex gap-4 p-6 transition-colors", isAssistant ? "bg-muted/30" : "bg-transparent")}>
      <Avatar className="size-8 rounded-lg shrink-0 border bg-background">
        {isAssistant ? (
          <>
            <Bot className="size-5 m-auto text-primary" />
            <AvatarFallback>ቦት</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="text-sm font-semibold">B</AvatarFallback>
          </>
        )}
      </Avatar>

      <div className="flex-1 space-y-4 overflow-hidden">
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <p className="leading-relaxed whitespace-pre-wrap font-amharic text-[15px]">
            {content}
          </p>
        </div>

        {citations && citations.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {citations.map((citation, i) => (
              <div
                key={i}
                className="flex items-center gap-2 px-2 py-1 rounded-md border bg-background text-[11px] text-muted-foreground hover:bg-muted transition-colors cursor-help group relative"
                title={citation.content}
              >
                <Quote className="size-3" />
                <span className="truncate max-w-[120px] font-amharic">ምንጭ: {citation.source}</span>

                {/* Tooltip-like expanded content on hover */}
                <div className="invisible group-hover:visible absolute bottom-full left-0 mb-2 w-64 p-3 rounded-lg border bg-popover text-popover-foreground shadow-lg z-50 pointer-events-none">
                  <p className="font-amharic text-xs leading-normal">
                    {citation.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
