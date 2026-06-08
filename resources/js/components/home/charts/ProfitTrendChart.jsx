"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import { Badge } from "@/components/ui/badge"
import { TrendingUpIcon, Settings } from 'lucide-react'
import { useState, useMemo } from "react"

export const description = "An area chart with gradient fill"

const chartData = [
    { tahun: 2022, profit: 186 },
    { tahun: 2023, profit: 305 },
    { tahun: 2024, profit: 237 },
    { tahun: 2025, profit: 73 },
    { tahun: 2026, profit: 209 },
]

const chartConfig = {
    profit: {
        label: "Keuntungan",
        color: "#10b981"
    }
}

export function ProfitTrendChart({ data = chartData, totalProfit = 0 }) {
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

    const formatCurrency = (num) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    return (
        <Card className="flex flex-col flex-1">
            <CardHeader>
                <CardTitle>Tren Keuntungan</CardTitle>
                <CardDescription>
                    Menampilkan perkembangan keuntungan bersih (laba) proyek dari waktu ke waktu.
                </CardDescription>
                <CardAction className="flex flex-row gap-3">
                    <RentangWaktuSelect timeRange={timeRange} setTimeRange={setTimeRange} />
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                    <p className="text-3xl font-medium">
                        <span className="text-muted-foreground mr-1">$</span>
                        {formatCurrency(totalProfit)} M
                    </p>
                </div>
                <ChartContainer config={chartConfig} className="w-full flex-1 min-h-[200px]">
                    <AreaChart
                        accessibilityLayer
                        data={filteredData}
                        margin={{
                            right: 25,
                            left: 25,
                            top: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickCount={5}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            domain={[2022, 2026]}
                        />
                        <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                        <defs>
                            <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="var(--color-profit)"
                                    stopOpacity={0.8}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="var(--color-profit)"
                                    stopOpacity={0.1}
                                />
                            </linearGradient>
                        </defs>
                        <Area
                            dataKey="profit"
                            type="natural"
                            fill="url(#fillProfit)"
                            fillOpacity={0.4}
                            stroke="var(--color-profit)"
                            stackId="a"
                        />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
