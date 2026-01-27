"use client"

import * as React from "react"
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

import { api, DocumentStats } from "@/lib/api"
import { Loader2 } from "lucide-react"

export type Embedding = {
    id: string
    source: string
    tokens: number
    created: string
}

export function EmbeddingsTable() {
    const [documents, setDocuments] = React.useState<any[]>([])
    const [isLoading, setIsLoading] = React.useState(true)

    React.useEffect(() => {
        api.getDocuments()
            .then(docs => {
                console.log("Fetched documents for embeddings table:", docs)
                setDocuments(docs)
            })
            .catch(err => console.error("Failed to fetch documents:", err))
            .finally(() => setIsLoading(false))
    }, [])

    const data: Embedding[] = React.useMemo(() => {
        console.log("Mapping documents to embeddings:", documents)
        return documents.map((doc: any, i) => ({
            id: `doc_${i}`,
            source: doc.name || doc.id || doc.filename || "Unknown",
            tokens: Math.round((doc.total_chars || 0) / 4), // Rough token estimate
            created: "Indexed",
        }))
    }, [documents])

    const columns: ColumnDef<Embedding>[] = [
        {
            accessorKey: "source",
            header: "Source Document",
            cell: ({ row }) => <div className="font-medium text-sm truncate max-w-[200px]">{row.getValue("source")}</div>,
        },
        {
            accessorKey: "tokens",
            header: "Est. Tokens",
            cell: ({ row }) => <div className="text-sm">{row.getValue("tokens")}</div>,
        },
        {
            accessorKey: "created",
            header: "Status",
            cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("created")}</div>,
        },
    ]

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    if (isLoading) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center p-8">
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Embeddings</CardTitle>
                <CardDescription>Real-time feed of indexed chunks.</CardDescription>
            </CardHeader>
            <CardContent>
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
            </CardContent>
        </Card>
    )
}
