"use client"

import * as React from "react"
import { StatsCards } from "@/components/admin/StatsCards"
import { UploadZone } from "@/components/admin/UploadZone"
import { DocumentTable } from "@/components/admin/DocumentTable"
import { Separator } from "@/components/ui/separator"
import { api, DocumentStats } from "@/lib/api"
import { Loader2 } from "lucide-react"

export default function AdminPage() {
  const [documents, setDocuments] = React.useState<DocumentStats[]>([])
  const [isLoading, setIsLoading] = React.useState(true)

  const fetchDocuments = React.useCallback(async () => {
    try {
      const data = await api.getDocuments()
      setDocuments(data)
    } catch (error) {
      console.error("Failed to fetch documents:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  return (
    <div className="flex flex-1 flex-col gap-4 w-full min-w-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Legal Knowledge Base</h1>
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
      </div>

      <StatsCards documents={documents} />

      <UploadZone onUploadSuccess={fetchDocuments} />

      <div className="flex flex-col gap-4 w-full min-w-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Document Index</h2>
        </div>
        <Separator />
        <DocumentTable documents={documents} onRefresh={fetchDocuments} isLoading={isLoading} />
      </div>
    </div>
  )
}
