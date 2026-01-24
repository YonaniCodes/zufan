import { DocumentDistributionChart } from "@/components/admin/dashboard/DocumentDistributionChart"
import { RecentActivity } from "@/components/admin/dashboard/RecentActivity"
import { UserGrowthChart } from "@/components/admin/UserGrowthChart"

export default function DashboardPage() {
    return (
        <div className="flex flex-1 flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">System Dashboard</h1>
            </div>

            <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                    <UserGrowthChart />
                </div>
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <DocumentDistributionChart />
                </div>
            </div>

            <div className="grid gap-6 grid-cols-1 lg:grid-cols-3">
                <RecentActivity />
            </div>
        </div>
    )
}
