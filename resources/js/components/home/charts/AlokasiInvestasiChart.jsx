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
import { ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Separator } from "@/components/ui/separator"

export const description = "A donut chart"

const chartData = [
    { tipe: "kapital", jumlah: 100, fill: "var(--color-kapital)" },
    { tipe: "nonKapital", jumlah: 100, fill: "var(--color-nonKapital)" },
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
                <CardDescription>Perbandingan alokasi investasi kapital dan non-kapital.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <div className="flex justify-center items-center gap-5">
                    <div className="flex items-start justify-center gap-2">
                        <div className="w-1 rounded-full h-4 bg-[-chart-1]"></div>
                        <div>
                            <h3 className="text-muted-foreground text-md">Kapital</h3>
                            <p className="text-xl font-medium"><span className="text-muted-foreground">Rp</span> 0,00</p>
                        </div>

                    </div>
                    <div className="flex items-start justify-center gap-2">
                        <div className="w-1 rounded-full h-4 bg-[-chart-2]"></div>
                        <div>
                            <h3 className="text-muted-foreground text-md">Non-Kapital</h3>
                            <p className="text-xl font-medium"><span className="text-muted-foreground">Rp</span> 0,00</p>
                        </div>

                    </div>
                </div>
                <ChartContainer
                    config={chartConfig}
                    className="aspect-square h-full w-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <ChartLegend content={<ChartLegendContent nameKey="tipe" />} />
                        <Pie
                            data={chartData}
                            dataKey="jumlah"
                            nameKey="tipe"
                            innerRadius={60}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card >
    )
}
