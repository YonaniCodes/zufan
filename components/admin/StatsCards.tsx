import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { FileText, Database, Clock, HardDrive } from "lucide-react"
import { DocumentStats } from "@/lib/api"

interface StatsCardsProps {
    documents: DocumentStats[]
}

export function StatsCards({ documents }: StatsCardsProps) {
    const totalDocs = documents.length
    const totalChunks = documents.reduce((acc, doc) => acc + (doc.chunks || 0), 0)
    const totalChars = documents.reduce((acc, doc) => acc + (doc.total_chars || 0), 0)

    // Estimate size (roughly 1 char = 1 byte)
    const totalSizeMB = (totalChars / (1024 * 1024)).toFixed(2)

    return (
        <div className="grid gap-4 w-full min-w-0 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Documents
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalDocs.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Files indexed in knowledge base
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Vector Embeddings
                    </CardTitle>
                    <Database className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalChunks.toLocaleString()}</div>
                    <p className="text-xs text-muted-foreground">
                        Total chunks across all documents
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Character Count</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{(totalChars / 1000).toFixed(1)}k</div>
                    <p className="text-xs text-muted-foreground">
                        Total Amharic characters
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Estimated Usage
                    </CardTitle>
                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{totalSizeMB} MB</div>
                    <p className="text-xs text-muted-foreground">
                        Vector store storage impact
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
