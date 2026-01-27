import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, AlertTriangle, ShieldCheck, UserCheck } from "lucide-react"

interface LogStatsProps {
    logs: any[]
}

export function LogStats({ logs }: LogStatsProps) {
    const totalEvents = logs.length
    const securityAlerts = logs.filter(log => log.status === "Failed" || log.status === "Warning").length
    const uniqueUsers = new Set(logs.map(log => log.user_id || log.user)).size

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Session Events
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalEvents}</div>
                    <p className="text-xs text-muted-foreground">
                        Last 50 events
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Unique Identities
                    </CardTitle>
                    <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{uniqueUsers}</div>
                    <p className="text-xs text-muted-foreground">
                        Captured in logs
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Anomalies</CardTitle>
                    <AlertTriangle className={`h-4 w-4 ${securityAlerts > 0 ? "text-destructive" : "text-muted-foreground"}`} />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{securityAlerts}</div>
                    <p className="text-xs text-muted-foreground">
                        Failed/Warning status
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        System Status
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Online</div>
                    <p className="text-xs text-muted-foreground">
                        Backend reached
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
