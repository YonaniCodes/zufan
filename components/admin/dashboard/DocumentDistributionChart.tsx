"use client"

import * as React from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
    { type: "contracts", count: 450, fill: "#3b82f6" }, // Blue 500
    { type: "caseLines", count: 320, fill: "#10b981" }, // Emerald 500
    { type: "statutes", count: 210, fill: "#f59e0b" }, // Amber 500
    { type: "pleadings", count: 180, fill: "#ef4444" }, // Red 500
    { type: "memos", count: 124, fill: "#8b5cf6" }, // Violet 500
]

const chartConfig = {
    contracts: {
        label: "Contracts",
        color: "#3b82f6",
    },
    caseLines: {
        label: "Case Law",
        color: "#10b981",
    },
    statutes: {
        label: "Statutes",
        color: "#f59e0b",
    },
    pleadings: {
        label: "Pleadings",
        color: "#ef4444",
    },
    memos: {
        label: "Legal Memos",
        color: "#8b5cf6",
    },
} satisfies ChartConfig

export function DocumentDistributionChart() {
    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Document Types</CardTitle>
                <CardDescription>Current Index Breakdown</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="count"
                            nameKey="type"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                        </Pie>
                        <ChartLegend content={<ChartLegendContent />} />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
