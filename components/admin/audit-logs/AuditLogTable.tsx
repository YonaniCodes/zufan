"use client"

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
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
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

export type LogEntry = {
    id: string
    action: string
    user: string
    role: "Admin" | "User" | "System"
    status: "Success" | "Failed" | "Warning"
    timestamp: string
    details: string
}

const data: LogEntry[] = [
    {
        id: "log_1",
        action: "Document Upload",
        user: "sarah.connor@firm.com",
        role: "User",
        status: "Success",
        timestamp: "2024-04-22 14:32:01",
        details: "Uploaded NDA_Alpha_Corp_v2.pdf",
    },
    {
        id: "log_2",
        action: "Login Attempt",
        user: "unknown",
        role: "System",
        status: "Failed",
        timestamp: "2024-04-22 14:30:55",
        details: "Invalid password for user admin",
    },
    {
        id: "log_3",
        action: "Vector Indexing",
        user: "System",
        role: "System",
        status: "Success",
        timestamp: "2024-04-22 14:28:12",
        details: "Batch processed 45 chunks",
    },
    {
        id: "log_4",
        action: "Settings Change",
        user: "mike.ross@firm.com",
        role: "Admin",
        status: "Warning",
        timestamp: "2024-04-22 12:15:00",
        details: "Changed retention policy to 5 years",
    },
    {
        id: "log_5",
        action: "Search Query",
        user: "jessica.pearson@firm.com",
        role: "User",
        status: "Success",
        timestamp: "2024-04-22 11:45:23",
        details: "Query: 'breach of contract damages'",
    },
]

export const columns: ColumnDef<LogEntry>[] = [
    {
        accessorKey: "timestamp",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Timestamp
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="ml-4 text-xs text-muted-foreground font-mono">{row.getValue("timestamp")}</div>,
    },
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => (
            <div className="flex flex-col">
                <span className="font-medium text-sm">{row.getValue("user")}</span>
                <span className="text-xs text-muted-foreground">{row.original.role}</span>
            </div>
        ),
    },
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ row }) => <div className="font-medium">{row.getValue("action")}</div>,
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as string
            return (
                <Badge variant={status === "Success" ? "outline" : status === "Failed" ? "destructive" : "secondary"}>
                    {status}
                </Badge>
            )
        },
    },
    {
        accessorKey: "details",
        header: "Details",
        cell: ({ row }) => <div className="text-sm text-muted-foreground truncate max-w-[300px]">{row.getValue("details")}</div>,
    },
    {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
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
                            onClick={() => navigator.clipboard.writeText(row.original.id)}
                        >
                            Copy Log ID
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]

export function AuditLogTable() {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [rowSelection, setRowSelection] = React.useState({})

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
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            rowSelection,
        },
    })

    return (
        <React.Fragment>
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Filter actions..."
                    value={(table.getColumn("action")?.getFilterValue() as string) ?? ""}
                    onChange={(event) =>
                        table.getColumn("action")?.setFilterValue(event.target.value)
                    }
                    className="max-w-sm"
                />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        {table
                            .getAllColumns()
                            .filter((column) => column.getCanHide())
                            .map((column) => {
                                return (
                                    <DropdownMenuCheckboxItem
                                        key={column.id}
                                        className="capitalize"
                                        checked={column.getIsVisible()}
                                        onCheckedChange={(value) =>
                                            column.toggleVisibility(!!value)
                                        }
                                    >
                                        {column.id}
                                    </DropdownMenuCheckboxItem>
                                )
                            })}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="rounded-md border overflow-x-auto">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
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
                                    No results.
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
        </React.Fragment>
    )
}
