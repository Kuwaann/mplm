"use client"

import { PieChartIcon } from "lucide-react"
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
        color: "var(--color-emerald-500)",
    },
    nonKapital: {
        label: "Non-kapital",
        color: "var(--color-amber-500)",
    },
}

export function AlokasiInvestasiChart({ capital = 0, nonCapital = 0 }) {
    const hasData = capital > 0 || nonCapital > 0;
    const chartData = [
        { tipe: "kapital", jumlah: hasData ? capital : 0, fill: "var(--color-kapital)" },
        { tipe: "nonKapital", jumlah: hasData ? nonCapital : 0, fill: "var(--color-nonKapital)" },
    ];

    const formatCurrency = (num) => {
        return new Intl.NumberFormat("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num);
    };

    return (
        <Card className="flex flex-col flex-1">
            <CardHeader className="items-center pb-0">
                <CardTitle>Alokasi Investasi</CardTitle>
                <CardDescription>Perbandingan alokasi investasi kapital dan non-kapital.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pb-0">
                <div className="flex justify-center items-center gap-5">
                    <div className="flex items-start justify-center gap-2">
                        <div className="w-1 rounded-full h-4 bg-emerald-500"></div>
                        <div>
                            <h3 className="text-muted-foreground text-md">Kapital</h3>
                            <p className="text-xl font-medium"><span className="text-muted-foreground mr-1">$</span>{formatCurrency(capital)} M</p>
                        </div>

                    </div>
                    <div className="flex items-start justify-center gap-2">
                        <div className="w-1 rounded-full h-4 bg-amber-500"></div>
                        <div>
                            <h3 className="text-muted-foreground text-md">Non-Kapital</h3>
                            <p className="text-xl font-medium"><span className="text-muted-foreground mr-1">$</span>{formatCurrency(nonCapital)} M</p>
                        </div>

                    </div>
                </div>
                {hasData ? (
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
                ) :
                    (
                        <div className="flex-1 flex flex-col py-20 justify-center items-center gap-3 px-10">
                            <PieChartIcon className="text-muted-foreground w-10 h-10" />
                            <p className="text-center text-muted-foreground">Grafik akan muncul setelah kamu menginput data alokasi investasi.</p>
                        </div>
                    )}

            </CardContent>
        </Card >
    )
}
