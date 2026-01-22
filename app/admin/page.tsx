import { StatsCards } from "@/components/admin/StatsCards"
import { UploadZone } from "@/components/admin/UploadZone"
import { DocumentTable } from "@/components/admin/DocumentTable"
import { Separator } from "@/components/ui/separator"

export default function AdminPage() {
  return (
    <div className="flex flex-1 flex-col gap-6 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Legal Knowledge Base</h1>
      </div>

      <StatsCards />

      <div className="grid gap-6">
        <UploadZone />

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">Document Index</h2>
          </div>
          <Separator />
          <DocumentTable />
        </div>
      </div>
    </div>
  )
}
