"use client"

import * as React from "react"
import { AuditLogTable } from "@/components/admin/audit-logs/AuditLogTable"
import { LogStats } from "@/components/admin/audit-logs/LogStats"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Trash2, RefreshCw } from "lucide-react"
import { toast } from "sonner"

export default function AuditLogsPage() {
    const [logs, setLogs] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    const fetchLogs = React.useCallback(async () => {
        setIsLoading(true)
        try {
            const data = await api.getAuditLogs()
            setLogs(data)
        } catch (error) {
            console.error("Failed to fetch logs:", error)
            toast.error("Failed to load audit logs")
        } finally {
            setIsLoading(false)
        }
    }, [])

    const handleClearLogs = async () => {
        if (!confirm("Are you sure you want to clear all audit logs?")) return
        try {
            await api.clearAuditLogs()
            toast.success("Audit logs cleared")
            fetchLogs()
        } catch (error) {
            toast.error("Failed to clear logs")
        }
    }

    React.useEffect(() => {
        fetchLogs()
    }, [fetchLogs])

    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={fetchLogs} disabled={isLoading}>
                        <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleClearLogs}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Clear Logs
                    </Button>
                </div>
            </div>

            <LogStats logs={logs} />

            <div className="grid gap-6">
                <AuditLogTable logs={logs} isLoading={isLoading} onRefresh={fetchLogs} />
            </div>
        </div>
    )
}
