import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { TrendingUpIcon, Settings } from 'lucide-react'
import { AlokasiInvestasiChart } from "./charts/AlokasiInvestasiChart"
import { TrenProduksiIncomeChart } from "./charts/TrenProduksiIncomeChart"
import { OpexVsTaxChart } from "./charts/OpexVsTaxChart"
import { PerformaTerbaikTable } from "./tables/PerformaTerbaikTable"

export default function CardsSection() {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex gap-3">
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-xs opacity-50">Total proyek</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-row gap-3 items-center">
                        <p className='text-xl font-medium'>24</p>
                        <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-xs opacity-50">Total produksi kumulatif</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-row gap-3 items-center">
                        <p className='text-xl font-medium'>0 Mbbl</p>
                        <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-xs opacity-50">Total pendapatan</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-row gap-3 items-center">
                        <p className='text-xl font-medium'>Rp 0,00</p>
                        <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="text-xs opacity-50">Total Net Cash Flow</CardTitle>
                    </CardHeader>
                    <CardContent className="mt-auto flex flex-row gap-3 items-center">
                        <p className='text-xl font-medium'>Rp 0,00</p>
                        <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>

                    </CardContent>
                </Card>
            </div>
            <div className="flex gap-3 w-full">
                <TrenProduksiIncomeChart />
                <PerformaTerbaikTable />
            </div>
            <div className="flex gap-3 ">
                <AlokasiInvestasiChart />
                <OpexVsTaxChart />
            </div>
        </div>
    )
}

