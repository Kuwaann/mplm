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

export const description = "An area chart with gradient fill"

const chartData = [
    { month: "January", profit: 186 },
    { month: "February", profit: 305 },
    { month: "March", profit: 237 },
    { month: "April", profit: 73 },
    { month: "May", profit: 209 },
    { month: "June", profit: 214 },
]

const chartConfig = {
    profit: {
        label: "Keuntungan",
        color: "#10b981"
    }
}

export function ProfitTrendChart() {
    return (
        <Card className="flex flex-col flex-1">
            <CardHeader>
                <CardTitle>Tren keuntungan</CardTitle>
                <CardDescription>
                    Menampilkan perkembangan keuntungan bersih (laba) proyek dari waktu ke waktu
                </CardDescription>
                <CardAction className="flex flex-row gap-3">
                    <RentangWaktuSelect />
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <p className="text-3xl font-medium"><span className="text-muted-foreground">Rp</span> 0,00 </p>
                    <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">0,00%</p></Badge>
                </div>
                <ChartContainer config={chartConfig} className="w-full flex-1 min-h-[200px]">
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
