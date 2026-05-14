"use client"

import { TrendingUp } from "lucide-react"
import { Pie, PieChart } from "recharts"

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

export const description = "A simple pie chart"

const chartData = [
    { tipe: "Kapital", jumlah: 275, fill: "var(--color-kapital)" },
    { tipe: "Non-kapital", jumlah: 200, fill: "var(--color-nonKapital)" },
]

const chartConfig = {
    kapital: {
        label: "Kapital",
        color: "var(--chart-1)",
    },
    nonKapital: {
        label: "Non-kapital",
        color: "var(--chart-2)",
    },
}

export function AlokasiInvestasiChart() {
    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="items-center pb-0">
                <CardTitle>Alokasi investasi</CardTitle>
                <CardDescription>Perbandingan investasi kapital dan non-kapital</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[250px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={chartData} dataKey="jumlah" nameKey="tipe" />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
            </CardFooter>
        </Card>
    )
}
