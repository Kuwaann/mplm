"use client"

import { Bar, CartesianGrid, XAxis, Line, YAxis, ComposedChart } from "recharts"

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
    { tahun: 0, produksi: 100, pendapatan: 100 },
    { tahun: 1, produksi: 200, pendapatan: 200 },
    { tahun: 2, produksi: 300, pendapatan: 300 },
    { tahun: 3, produksi: 400, pendapatan: 400 },
    { tahun: 4, produksi: 500, pendapatan: 500 },
    { tahun: 5, produksi: 600, pendapatan: 600 },
    { tahun: 6, produksi: 0, pendapatan: 0 },
    { tahun: 7, produksi: 0, pendapatan: 0 },
    { tahun: 8, produksi: 0, pendapatan: 0 },
    { tahun: 9, produksi: 0, pendapatan: 0 },
    { tahun: 10, produksi: 0, pendapatan: 0 },
    { tahun: 11, produksi: 0, pendapatan: 0 },
    { tahun: 12, produksi: 0, pendapatan: 0 },
    { tahun: 13, produksi: 0, pendapatan: 0 },
    { tahun: 14, produksi: 0, pendapatan: 0 },
    { tahun: 15, produksi: 0, pendapatan: 0 },
    { tahun: 16, produksi: 0, pendapatan: 0 },
    { tahun: 17, produksi: 0, pendapatan: 0 },
    { tahun: 18, produksi: 0, pendapatan: 0 },
    { tahun: 19, produksi: 0, pendapatan: 0 },
    { tahun: 20, produksi: 0, pendapatan: 0 },
    { tahun: 21, produksi: 0, pendapatan: 0 },
    { tahun: 22, produksi: 0, pendapatan: 0 },
    { tahun: 23, produksi: 0, pendapatan: 0 },
    { tahun: 24, produksi: 0, pendapatan: 0 },
    { tahun: 25, produksi: 0, pendapatan: 0 },
]

const chartConfig = {
    produksi: {
        label: "Produksi",
        color: "var(--chart-1)",
    },
    pendapatan: {
        label: "Pendapatan",
        color: "var(--chart-2)"
    }
}

export function ProfilProduksiVsPendapatanChart() {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Profil Produksi Vs Pendapatan Chart</CardTitle>
                <CardDescription>Perbandingan kinerja tahunan volume produksi vs pendapatan.</CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="h-[250px] min-h-[200px] w-full">
                    <ComposedChart data={chartData} margin={{ right: 50, left: 25, top: 10 }}>

                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="tahun"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                        />
                        <YAxis
                            yAxisId="left"
                            orientation="left"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                            domain={['dataMin', 'dataMax']}
                        />
                        <YAxis
                            yAxisId="right"
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickCount={5}
                            tickFormatter={chartFormatRupiah}
                            domain={['dataMin', 'dataMax']}
                            width={60}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar yAxisId="left" dataKey="produksi" fill="var(--color-produksi)" radius={8} />
                        <Line
                            yAxisId="right"
                            dataKey="pendapatan"
                            type="monotone"
                            stroke="var(--color-pendapatan)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </ComposedChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
