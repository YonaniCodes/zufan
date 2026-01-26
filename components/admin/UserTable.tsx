"use client"


import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { updateUserPassword } from "@/server/user/admin/update-password"
import { setUserRole } from "@/server/user/admin/set-role"
import * as React from "react"
import {
    ColumnDef,

    ColumnFiltersState,
    SortingState,
    VisibilityState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, Search, User, Ban, ShieldCheck, Trash, Key, UserCog } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { UserType } from "@/types/user"
import { toast } from "sonner"
import { banUser } from "@/server/user/admin/ban-user"
import { unbanUser } from "@/server/user/admin/unban-user"
import { removeUser } from "@/server/user/admin/remove-user"

interface UserTableProps {
    initialData: UserType[]
}

export function UserTable({ initialData }: UserTableProps) {
    const [data, setData] = React.useState<UserType[]>(initialData)
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})

    const [passwordDialogOpen, setPasswordDialogOpen] = React.useState(false)
    const [roleDialogOpen, setRoleDialogOpen] = React.useState(false)
    const [selectedUser, setSelectedUser] = React.useState<UserType | null>(null)
    const [newPassword, setNewPassword] = React.useState("")
    const [newRole, setNewRole] = React.useState<"admin" | "user">("user")

    const handlePasswordUpdate = async () => {
        if (!selectedUser || !newPassword) return;
        try {
            const result = await updateUserPassword(selectedUser.id, newPassword);
            if (result.success) {
                toast.success(`Password updated for ${selectedUser.name}`);
                setPasswordDialogOpen(false);
                setNewPassword("");
                setSelectedUser(null);
            } else {
                toast.error(result.error || "Failed to update password");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    const handleRoleUpdate = async () => {
        if (!selectedUser || !newRole) return;
        try {
            const result = await setUserRole(selectedUser.id, newRole);
            if (result.success) {
                toast.success(`Role updated for ${selectedUser.name}`);
                setData(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
                setRoleDialogOpen(false);
                setSelectedUser(null);
            } else {
                toast.error(result.error || "Failed to update role");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    const handleBan = async (user: UserType) => {
        try {
            const result = await banUser(user.id);
            if (result.success) {
                toast.success(`User ${user.name} banned successfully`);
                setData(prev => prev.map(u => u.id === user.id ? { ...u, banned: true } : u));
            } else {
                toast.error("Failed to ban user");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    const handleUnban = async (user: UserType) => {
        try {
            const result = await unbanUser(user.id);
            if (result.success) {
                toast.success(`User ${user.name} unbanned successfully`);
                setData(prev => prev.map(u => u.id === user.id ? { ...u, banned: false } : u));
            } else {
                toast.error("Failed to unban user");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    const handleDelete = async (user: UserType) => {
        if (!confirm(`Are you sure you want to delete ${user.name}? This action cannot be undone.`)) return;
        try {
            const result = await removeUser(user.id);
            if (result.success) {
                toast.success(`User ${user.name} deleted successfully`);
                setData(prev => prev.filter(u => u.id !== user.id));
            } else {
                toast.error("Failed to delete user");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    }

    const columns: ColumnDef<UserType>[] = [
        {
            accessorKey: "name",
            header: ({ column }) => (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            ),
            cell: ({ row }) => (
                <div className="ml-4 flex items-center gap-2 font-medium">
                    <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <User className="h-4 w-4 text-muted-foreground" />
                    </div>
                    {row.getValue("name")}
                </div>
            ),
        },
        {
            accessorKey: "email",
            header: "Email",
            cell: ({ row }) => <div className="lowercase text-muted-foreground">{row.getValue("email")}</div>,
        },
        {
            accessorKey: "role",
            header: "Role",
            cell: ({ row }) => (
                <Badge variant={row.getValue("role") === "admin" ? "default" : "secondary"}>
                    {row.getValue("role")}
                </Badge>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ row }) => {
                const banned = row.original.banned
                return (
                    <Badge variant={banned ? "destructive" : "outline"} className="gap-1">
                        {banned ? <Ban className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
                        {banned ? "Banned" : "Active"}
                    </Badge>
                )
            },
        },
        {
            id: "actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() => navigator.clipboard.writeText(user.id)}
                            >
                                Copy User ID
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {user.banned ? (
                                <DropdownMenuItem onClick={() => handleUnban(user)}>
                                    <ShieldCheck className="mr-2 h-4 w-4" /> Unban User
                                </DropdownMenuItem>
                            ) : (
                                <DropdownMenuItem className="text-destructive" onClick={() => handleBan(user)}>
                                    <Ban className="mr-2 h-4 w-4" /> Ban User
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuItem className="text-destructive font-medium" onClick={() => handleDelete(user)}>
                                <Trash className="mr-2 h-4 w-4" /> Delete User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setNewPassword("");
                                setPasswordDialogOpen(true);
                            }}>
                                <Key className="mr-2 h-4 w-4" /> Reset Password
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                                setSelectedUser(user);
                                setNewRole(user.role as "admin" | "user");
                                setRoleDialogOpen(true);
                            }}>
                                <UserCog className="mr-2 h-4 w-4" /> Change Role
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
        },
    })

    return (
        <div className="w-full">
            <div className="flex items-center py-4">
                <div className="relative max-w-sm">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Filter users..."
                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                        onChange={(event) =>
                            table.getColumn("name")?.setFilterValue(event.target.value)
                        }
                        className="pl-8"
                    />
                </div>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No users found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <div className="space-x-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        Next
                    </Button>
                </div>
            </div>
            <Dialog open={passwordDialogOpen} onOpenChange={setPasswordDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reset Password</DialogTitle>
                        <DialogDescription>
                            Enter a new password for {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="new-password">New Password</Label>
                            <Input
                                id="new-password"
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setPasswordDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handlePasswordUpdate}>Update Password</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={roleDialogOpen} onOpenChange={setRoleDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change User Role</DialogTitle>
                        <DialogDescription>
                            Select a new role for {selectedUser?.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={newRole} onValueChange={(value: "admin" | "user") => setNewRole(value)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRoleDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleRoleUpdate}>Update Role</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
