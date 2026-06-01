"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import chartFormatRupiah from "@/utils/chartFormatRupiah"

const chartData = [
    { tahun: 0, arusKas: 0 },
    { tahun: 1, arusKas: 0 },
    { tahun: 2, arusKas: 0 },
    { tahun: 3, arusKas: 0 },
    { tahun: 4, arusKas: 0 },
    { tahun: 5, arusKas: 0 },
    { tahun: 6, arusKas: 0 },
    { tahun: 7, arusKas: 0 },
    { tahun: 8, arusKas: 0 },
    { tahun: 9, arusKas: 0 },
    { tahun: 10, arusKas: 0 },
    { tahun: 11, arusKas: 0 },
    { tahun: 12, arusKas: 0 },
    { tahun: 13, arusKas: 0 },
    { tahun: 14, arusKas: 0 },
    { tahun: 15, arusKas: 0 },
    { tahun: 16, arusKas: 0 },
    { tahun: 17, arusKas: 0 },
    { tahun: 18, arusKas: 0 },
    { tahun: 19, arusKas: 0 },
    { tahun: 20, arusKas: 0 },
    { tahun: 21, arusKas: 0 },
    { tahun: 22, arusKas: 0 },
    { tahun: 23, arusKas: 0 },
    { tahun: 24, arusKas: 0 },
    { tahun: 25, arusKas: 0 },
]

const chartConfig = {
    arusKas: {
        label: "Arus Kas",
        color: "var(--chart-1)",
    },
}

export function AliranKasKumulatifChart({ data }) {
    const finalData = data || chartData

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Aliran Kas Kumulatif</CardTitle>
                <CardDescription>Visualisasi akumulasi kas masuk dan keluar proyek dari waktu ke waktu.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] w-full min-h-[200px]">
                    <LineChart
                        accessibilityLayer
                        data={finalData}
                        margin={{ right: 50, left: 25, top: 10 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            tickCount={5}
                            domain={['auto', 'auto']}
                            tickFormatter={chartFormatRupiah}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            yAxisId="left"
                            dataKey="arusKas"
                            type="natural"
                            stroke="var(--color-arusKas)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
