import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { AlokasiInvestasiChart } from "./charts/AlokasiInvestasiChart"
import { TrenProduksiIncomeChart } from "./charts/TrenProduksiIncomeChart"
import { RevenueVsTaxChart } from "./charts/RevenueVsTaxChart"
import { PerformaTerbaikTable } from "./tables/PerformaTerbaikTable"
import TotalProyek from "./kpi-cards/TotalProyek"
import TotalInvestasi from "./kpi-cards/TotalInvestasi"
import TotalPendapatan from "./kpi-cards/TotalPendapatan"
import TotalNetCashFlow from "./kpi-cards/TotalNetCashFlow"
import { NetCashFlowTrendChart } from "./charts/NetCashFlowTrendChart"
import { ProfitTrendChart } from "./charts/ProfitTrendChart"

export default function CardsSection() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex gap-3">
                <TotalProyek />
                <TotalInvestasi />
                <TotalPendapatan />
                <TotalNetCashFlow />
            </div>
            <div className="flex flex-col gap-3 w-full">
                <NetCashFlowTrendChart />
                <div className="flex gap-3">
                    <RevenueVsTaxChart />
                    <ProfitTrendChart />
                </div>
            </div>
            <div className="flex gap-3 ">
                <AlokasiInvestasiChart />
                <PerformaTerbaikTable />
            </div>
        </div>
    )
}

