"use client"

import * as React from "react"
import { Plus, MessageSquare, MoreHorizontal, User, Trash2 } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
  SidebarMenuAction,
} from "@/components/ui/sidebar"

interface ChatSidebarProps {
  chats: { id: string; title: string }[]
  activeChatId: string
  onChatSelect: (id: string) => void
  onChatDelete: (id: string) => void
  onNewChat?: () => void
}

export function ChatSidebar({ chats, activeChatId, onChatSelect, onChatDelete, onNewChat }: ChatSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="p-4 flex-row items-center gap-2">
        <SidebarMenuButton
          variant="outline"
          className="flex-1 justify-start gap-2 border-dashed bg-transparent h-11"
          onClick={onNewChat}
        >
          <Plus className="size-4" />
          <span className="font-amharic">አዲስ ውይይት</span>
        </SidebarMenuButton>
        <ModeToggle />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.map((chat) => (
                <SidebarMenuItem key={chat.id}>
                  <SidebarMenuButton
                    className="group"
                    isActive={activeChatId === chat.id}
                    onClick={() => onChatSelect(chat.id)}
                  >
                    <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                    <span className="truncate flex-1 font-amharic">{chat.title}</span>
                  </SidebarMenuButton>
                  <SidebarMenuAction
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      onChatDelete(chat.id)
                    }}
                  >
                    <Trash2 className="size-4 text-muted-foreground hover:text-destructive" />
                  </SidebarMenuAction>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="px-3">
              <div className="flex items-center gap-3 w-full">
                <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold shrink-0">
                  ተጠቃሚ
                </div>
                <div className="flex-1 overflow-hidden text-left">
                  <p className="text-sm font-medium truncate font-amharic">ዮናስ</p>
                  <p className="text-xs text-muted-foreground truncate">pro account</p>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
