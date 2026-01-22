"use client"

import * as React from "react"
import { SendHorizontal, Paperclip } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = React.useState("")
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)

  const handleSend = () => {
    if (value.trim() && !disabled) {
      onSend(value)
      setValue("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit"
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [value])

  return (
    <div className="flex flex-col gap-2 p-4 w-full max-w-4xl mx-auto">
      <div className="relative flex items-end w-full rounded-2xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring transition-shadow overflow-hidden p-2 pr-12">
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="ጥያቄዎን እዚህ ይጠይቁ..."
          className="min-h-[50px] max-h-[200px] w-full resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent py-3 px-4 font-amharic scrollbar-none"
          rows={1}
          disabled={disabled}
        />
        <Button
          size="icon"
          onClick={handleSend}
          disabled={!value.trim() || disabled}
          className="absolute right-2 bottom-2 rounded-xl transition-all"
        >
          <SendHorizontal className="size-5" />
        </Button>
      </div>
      <p className="text-[10px] text-center text-muted-foreground font-amharic px-4">
        ዝፋን በሰነዶች ላይ ተመርኩዞ መልስ ይሰጣል። ሆኖም ግን ስህተት ሊሠራ ይችላል፤ ስለዚህ ወሳኝ መረጃዎችን ደግመው ያረጋግጡ። ይህ የሕግ ምክር አይደለም።
      </p>
    </div>
  )
}
