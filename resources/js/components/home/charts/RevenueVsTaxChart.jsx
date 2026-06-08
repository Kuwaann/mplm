"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
    CardAction
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import RentangWaktuSelect from "@/components/RentangWaktuSelect"
import { useState, useMemo } from "react"

export const description = "A multiple bar chart"

const chartData = [
    { tahun: 2022, pendapatan: 186000000, opex: 50000000 },
    { tahun: 2023, pendapatan: 305000000, opex: 65000000 },
    { tahun: 2024, pendapatan: 237000000, opex: 55000000 },
    { tahun: 2025, pendapatan: 280000000, opex: 73000000 },
    { tahun: 2026, pendapatan: 350000000, opex: 80000000 },
]

const chartConfig = {
    pendapatan: {
        label: "Pendapatan",
        color: "#10b981",
    },
    opex: {
        label: "Opex",
        color: "#f59e0b",
    },
}

export function RevenueVsTaxChart({ data = chartData }) {
    const [timeRange, setTimeRange] = useState("5");
    const filteredData = useMemo(() => {
        const limit = parseInt(timeRange, 10);
        const startYear = data.length > 0 ? data[0].tahun : new Date().getFullYear();
        const result = [];
        for (let i = 0; i < limit; i++) {
            const targetYear = startYear + i;
            const existing = data.find(item => item.tahun === targetYear);
            if (existing) {
                result.push(existing);
            } else {
                result.push({
                    tahun: targetYear,
                    netCashFlow: 0,
                });
            }
        }
        return result;
    }, [data, timeRange]);

    return (
        <Card className="flex flex-col flex-1">
            <CardHeader>
                <CardTitle>Pendapatan vs Opex</CardTitle>
                <CardDescription>Membandingkan total pendapatan kotor dengan biaya operasional proyek sepanjang periode terpilih.</CardDescription>
                <CardAction className="flex flex-row gap-3">
                    <RentangWaktuSelect timeRange={timeRange} setTimeRange={setTimeRange} />
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <ChartContainer config={chartConfig} className="flex-1 w-full min-h-[250px]">
                    <BarChart accessibilityLayer data={filteredData}>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent indicator="dashed" />}
                        />
                        <Bar dataKey="pendapatan" fill="var(--color-pendapatan)" radius={4} />
                        <Bar dataKey="opex" fill="var(--color-opex)" radius={4} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
