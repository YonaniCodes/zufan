import { AuditLogTable } from "@/components/admin/audit-logs/AuditLogTable"
import { LogStats } from "@/components/admin/audit-logs/LogStats"

export default function AuditLogsPage() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
            </div>

            <LogStats />

            <div className="grid gap-6">
                <AuditLogTable />
            </div>
        </div>
    )
}
