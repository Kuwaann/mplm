"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, ReferenceLine } from "recharts"

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
import { BandingkanDropdown } from "../BandingkanDropdown"
import chartFormatRupiah from "@/utils/chartFormatRupiah"
import { useState, useMemo } from "react"

const chartData = [
    { tahun: 2022, netCashFlow: 186000000 },
    { tahun: 2023, netCashFlow: 305000000 },
    { tahun: 2024, netCashFlow: 237000000 },
    { tahun: 2025, netCashFlow: -73000000 },
    { tahun: 2026, netCashFlow: 209000000 },
]

const chartConfig = {
    netCashFlow: {
        label: "Net Cash Flow",
        color: "var(--chart-1)",
    },
}

export function NetCashFlowTrendChart({ data = chartData }) {
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
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Tren Net Cash Flow</CardTitle>
                <CardDescription>Menampilkan fluktuasi arus kas bersih proyek sepanjang periode terpilih.</CardDescription>
                <CardAction className="flex flex-row gap-3">
                    <RentangWaktuSelect timeRange={timeRange} setTimeRange={setTimeRange} />
                </CardAction>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={filteredData}
                        margin={{
                            right: 50,
                            left: 25,
                            top: 10,
                        }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            tickCount={5}
                            tickFormatter={chartFormatRupiah}
                            domain={['auto', 'auto']}
                            width={70}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="netCashFlow"
                            type="natural"
                            stroke="var(--color-netCashFlow)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <ReferenceLine y={0} />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
