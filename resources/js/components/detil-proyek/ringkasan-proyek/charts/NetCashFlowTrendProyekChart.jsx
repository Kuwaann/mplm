"use client"

import { TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"

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

export const description = "An area chart with gradient fill"

const chartData = [
  { tahun: 0, netCashFlow: -120000000 },
  { tahun: 1, netCashFlow: -120000000 },
  { tahun: 2, netCashFlow: -80000000 },
  { tahun: 3, netCashFlow: -30000000 },
  { tahun: 4, netCashFlow: 15000000 },
  { tahun: 5, netCashFlow: 45000000 },
  { tahun: 6, netCashFlow: 60000000 },
  { tahun: 7, netCashFlow: 75000000 },
  { tahun: 8, netCashFlow: 85000000 },
  { tahun: 9, netCashFlow: 90000000 },
  { tahun: 10, netCashFlow: 95000000 },
  { tahun: 11, netCashFlow: 98000000 },
  { tahun: 12, netCashFlow: 100000000 },
  { tahun: 13, netCashFlow: 102000000 },
  { tahun: 14, netCashFlow: 105000000 },
  { tahun: 15, netCashFlow: 104000000 },
  { tahun: 16, netCashFlow: 102000000 },
  { tahun: 17, netCashFlow: 100000000 },
  { tahun: 18, netCashFlow: 98000000 },
  { tahun: 19, netCashFlow: 95000000 },
  { tahun: 20, netCashFlow: 90000000 },
  { tahun: 21, netCashFlow: 85000000 },
  { tahun: 22, netCashFlow: 80000000 },
  { tahun: 23, netCashFlow: 75000000 },
  { tahun: 24, netCashFlow: 70000000 },
  { tahun: 25, netCashFlow: 65000000 },
]

const chartConfig = {
  netCashFlow: {
    label: "Net Cash Flow",
    color: "var(--chart-1)",
  },
}

export function NetCashFlowTrendProyekChart({ data }) {
  const finalData = data || chartData

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tren Net Cash Flow</CardTitle>
        <CardDescription>
          Menampilkan fluktuasi arus kas bersih proyek dari tahun ke tahun setelah dikurangi modal dan biaya operasional.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] h-[250px] w-full">
          <AreaChart
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
              tickFormatter={chartFormatRupiah}
              domain={['auto', 'auto']}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillNetCashFlow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-netCashFlow)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-netCashFlow)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              yAxisId="left"
              dataKey="netCashFlow"
              type="monotone"
              fill="url(#fillNetCashFlow)"
              fillOpacity={0.4}
              stroke="var(--color-netCashFlow)"
            />
            <ReferenceLine y={0} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
