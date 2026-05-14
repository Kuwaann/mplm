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
                        <CardTitle className="">Total proyek</CardTitle>
                        <CardAction>
                            <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="mt-auto ">
                        <p className='text-xl font-medium'>24</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="">Total produksi kumulatif</CardTitle>
                        <CardAction>
                            <Badge variant="outline"><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <p className='text-xl font-medium'>0 Mbbl</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="">Total pendapatan</CardTitle>
                        <CardAction>
                            <Badge variant="outline"><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <p className='text-sm font-medium'>Rp 0,00</p>
                    </CardContent>
                </Card>
                <Card className="flex-1">
                    <CardHeader>
                        <CardTitle className="">Total Net Cash Flow</CardTitle>
                        <CardAction>
                            <Badge variant="outline"><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
                        </CardAction>
                    </CardHeader>
                    <CardContent className="mt-auto">
                        <p className='text-sm font-medium'>Rp 0,00</p>
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

