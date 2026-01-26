import listUsers from "@/server/user/admin/list-users"
import { UserTable } from "@/components/admin/UserTable"
import { Separator } from "@/components/ui/separator"

export default async function AdminUsersPage() {
    const { users } = await listUsers({
        query: {
            limit: 100,
            offset: 0
        }
    })

    return (
        <div className="flex flex-1 flex-col gap-4 w-full min-w-0">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold tracking-tight">User Management</h1>
            </div>
            
            <p className="text-muted-foreground">
                Manage your application users, view their status, and perform administrative actions.
            </p>

            <Separator />

            <UserTable initialData={users} />
        </div>
    )
}
