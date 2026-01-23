"use client"

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
    { month: "January", total: 186, active: 80 },
    { month: "February", total: 305, active: 200 },
    { month: "March", total: 237, active: 120 },
    { month: "April", total: 73, active: 190 },
    { month: "May", total: 209, active: 130 },
    { month: "June", total: 214, active: 140 },
]

const chartConfig = {
    total: {
        label: "Total Accounts",
        color: "#94a3b8", // Slate 400 for background context
    },
    active: {
        label: "Active Users",
        color: "#2563eb", // Blue 600 for primary focus
    },
} satisfies ChartConfig

export function UserGrowthChart() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>User Growth & Activity</CardTitle>
                <CardDescription>
                    Tracking total registrations vs active sessions (Jan - June 2024)
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <AreaChart
                        accessibilityLayer
                        data={chartData}
                        margin={{
                            left: 12,
                            right: 12,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="line" />}
                        />
                        <Area
                            dataKey="total"
                            type="monotone"
                            fill="var(--color-total)"
                            fillOpacity={0.1}
                            stroke="var(--color-total)"
                            strokeWidth={2}
                        />
                        <Area
                            dataKey="active"
                            type="monotone"
                            fill="var(--color-active)"
                            fillOpacity={0.4}
                            stroke="var(--color-active)"
                            strokeWidth={3}
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
