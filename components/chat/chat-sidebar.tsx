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
import { useSession, signOut } from "@/lib/auth-client"
import { AuthDialog } from "@/components/auth/auth-dialog"
import { LogOut, Settings as SettingsIcon, ShieldCheck } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

interface ChatSidebarProps {
  chats: { id: string; title: string }[]
  activeChatId: string
  onChatSelect: (id: string) => void
  onChatDelete: (id: string) => void
  onNewChat?: () => void
}

export function ChatSidebar({ chats, activeChatId, onChatSelect, onChatDelete, onNewChat }: ChatSidebarProps) {
  const { data: session, isPending } = useSession()
  const user = session?.user
  const router = useRouter()

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
        {!isPending && (
          !user ? (
            <div className="flex flex-col gap-2 w-full">
              <AuthDialog defaultMode="login">
                <Button variant="ghost" className="w-full justify-start gap-2 h-10 px-3">
                  <User className="h-4 w-4" />
                  <span>Login</span>
                </Button>
              </AuthDialog>
              <AuthDialog defaultMode="signup">
                <Button className="w-full justify-start gap-2 h-10 px-3">
                  <Plus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Button>
              </AuthDialog>
            </div>
          ) : (
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton size="lg" className="px-3">
                      <div className="flex items-center gap-3 w-full">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.image || ""} alt={user.name || ""} />
                          <AvatarFallback>{user.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden text-left">
                          <p className="text-sm font-medium truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.role || "User"}</p>
                        </div>
                        <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side="right" align="end" className="w-56" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
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
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          )
        )}
      </SidebarFooter>
    </Sidebar>
  )
}
