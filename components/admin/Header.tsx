"use client"

import * as React from "react"

import { SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import { Separator } from "@/components/ui/separator"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { usePathname } from "next/navigation"

function Breadcrumbs() {
    const pathname = usePathname()
    const segments = pathname.split("/").filter((item) => item !== "")

    const routeNameMap: Record<string, string> = {
        admin: "Knowledge Base",
        dashboard: "Dashboard",
        "vector-store": "Vector Store",
        "audit-logs": "Audit Logs",
        settings: "Settings",
    }

    const isRootAdmin = pathname === "/admin"

    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                    <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
                </BreadcrumbItem>
                {!isRootAdmin && (
                    <>
                        {segments.slice(1).map((segment, index) => {
                            const isLast = index === segments.slice(1).length - 1
                            const name = routeNameMap[segment] || segment

                            return (
                                <React.Fragment key={segment}>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        {isLast ? (
                                            <BreadcrumbPage>{name}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={`/admin/${segment}`}>{name}</BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                </React.Fragment>
                            )
                        })}
                    </>
                )}
                {isRootAdmin && (
                    <>
                        <BreadcrumbSeparator className="hidden md:block" />
                        <BreadcrumbItem>
                            <BreadcrumbPage>Knowledge Base</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}

export function AdminHeader() {
    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumbs />
            <div className="ml-auto flex items-center gap-2">
                <ModeToggle />
            </div>
        </header>
    )
}
