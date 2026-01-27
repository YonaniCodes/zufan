"use client"

import * as React from "react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Database, Layers, Zap, HardDrive, Loader2 } from "lucide-react"
import { api, VectorStats as ApiVectorStats } from "@/lib/api"

export function VectorStats() {
    const [stats, setStats] = React.useState<ApiVectorStats | null>(null)
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        api.getVectorStats()
            .then(setStats)
            .catch(err => console.error("Failed to fetch vector stats:", err))
            .finally(() => setIsLoading(false))
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        )
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Vectors
                    </CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.total_vectors.toLocaleString() || "0"}</div>
                    <p className="text-xs text-muted-foreground">
                        Across all indexed documents
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Index Size
                    </CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats?.index_size || "0 MB"}</div>
                    <p className="text-xs text-muted-foreground">
                        MongoDB Atlas Vector Search
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Embedding Model</CardTitle>
                    <Layers className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold truncate text-sm" title={stats?.model_info}>
                        {stats?.model_info?.split('/').pop() || "Gemini Native"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Vector dimensions: 768
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Search Status
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Active</div>
                    <p className="text-xs text-muted-foreground">
                        p99 query time: ~45ms
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
