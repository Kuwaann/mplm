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

export const description = "A line chart"

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

export function NetCashFlowTrendChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Tren Net Cash Flow</CardTitle>
                <CardDescription>Menampilkan fluktuasi arus kas bersih proyek sepanjang periode terpilih.</CardDescription>
                <CardAction className="flex flex-row gap-3">
                    <BandingkanDropdown />
                    <RentangWaktuSelect />
                </CardAction>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full">
                    <LineChart
                        accessibilityLayer
                        data={chartData}
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
                        <ReferenceLine y={0}/>
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
