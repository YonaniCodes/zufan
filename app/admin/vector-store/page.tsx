import { EmbeddingsTable } from "@/components/admin/vector-store/EmbeddingsTable"
import { VectorSearchTest } from "@/components/admin/vector-store/VectorSearchTest"
import { VectorStats } from "@/components/admin/vector-store/VectorStats"

export default function VectorStorePage() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">Vector Store Management</h1>
            </div>

            <VectorStats />

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <EmbeddingsTable />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <VectorSearchTest />
                </div>
            </div>
        </div>
    )
}
