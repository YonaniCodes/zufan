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

type Embedding = {
    id: string
    source: string
    tokens: number
    created: string
}

const data: Embedding[] = [
    {
        id: "vec_8f7e6d",
        source: "NDA_Alpha_Corp_v2.pdf (Chunk 12)",
        tokens: 421,
        created: "2 mins ago",
    },
    {
        id: "vec_2a1b3c",
        source: "NDA_Alpha_Corp_v2.pdf (Chunk 13)",
        tokens: 388,
        created: "2 mins ago",
    },
    {
        id: "vec_9g8h7i",
        source: "Regulation_EU_2024_AI.pdf (Chunk 45)",
        tokens: 512,
        created: "15 mins ago",
    },
    {
        id: "vec_4j5k6l",
        source: "Smith_v_Jones_Ruling.docx (Chunk 8)",
        tokens: 256,
        created: "1 hour ago",
    },
    {
        id: "vec_7m8n9o",
        source: "Service_Agreement_Final.pdf (Chunk 1)",
        tokens: 128,
        created: "3 hours ago",
    },
]

export const columns: ColumnDef<Embedding>[] = [
    {
        accessorKey: "id",
        header: "Vector ID",
        cell: ({ row }) => <div className="font-mono text-xs">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "source",
        header: "Source Chunk",
        cell: ({ row }) => <div className="font-medium text-sm truncate max-w-[200px]">{row.getValue("source")}</div>,
    },
    {
        accessorKey: "tokens",
        header: "Tokens",
        cell: ({ row }) => <div className="text-sm">{row.getValue("tokens")}</div>,
    },
    {
        accessorKey: "created",
        header: "Indexed",
        cell: ({ row }) => <div className="text-muted-foreground text-sm">{row.getValue("created")}</div>,
    },
    {
        id: "actions",
        cell: () => {
            return (
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ArrowUpRight className="h-4 w-4" />
                    <span className="sr-only">View</span>
                </Button>
            )
        },
    },
]

export function EmbeddingsTable() {
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Embeddings</CardTitle>
                <CardDescription>Real-time feed of indexed chunks.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border">
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
