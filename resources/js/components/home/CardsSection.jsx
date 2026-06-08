import { useMemo } from "react"
import { AlokasiInvestasiChart } from "./charts/AlokasiInvestasiChart"
import { RevenueVsTaxChart } from "./charts/RevenueVsTaxChart"
import { PerformaTerbaikTable } from "./tables/PerformaTerbaikTable"
import TotalProyek from "./kpi-cards/TotalProyek"
import TotalInvestasi from "./kpi-cards/TotalInvestasi"
import TotalPendapatan from "./kpi-cards/TotalPendapatan"
import TotalNetCashFlow from "./kpi-cards/TotalNetCashFlow"
import { NetCashFlowTrendChart } from "./charts/NetCashFlowTrendChart"
import { ProfitTrendChart } from "./charts/ProfitTrendChart"
import { simulateProjectEconomics } from "@/utils/PetroleumEconomicsEngine"

export default function CardsSection({ projects = [] }) {
    // 1. Hitung performa keekonomian per proyek dari database menggunakan engine terpusat
    const computedProjects = useMemo(() => {
        return projects.map((proj) => {
            const params = proj.economic_parameters?.[0]
            if (!params) {
                return {
                    id: proj.id,
                    name: proj.name,
                    location: proj.location,
                    description: proj.description,
                    hasParameters: false,
                    duration: 0,
                    capital: 0,
                    nonCapital: 0,
                    totalInvestment: 0,
                    totalIncome: 0,
                    totalOpex: 0,
                    totalTax: 0,
                    totalNcf: 0,
                    rows: []
                }
            }

            const simulation = simulateProjectEconomics({
                duration: Number(params.duration),
                capital: Number(params.capital_investment),
                non_capital: Number(params.non_capital_investment),
                production_y1: Number(params.production_y1),
                decline_rate: Number(params.decline_rate),
                oil_price: Number(params.oil_price),
                opex_y1: Number(params.opex_y1),
                opex_growth: Number(params.opex_growth),
                tax_rate: Number(params.tax_rate),
                depreciation_method: params.depreciation_method || 'straight_line',
                deduct_investment_in_year_1: false
            })

            return {
                id: proj.id,
                name: proj.name,
                location: proj.location,
                description: proj.description,
                hasParameters: true,
                duration: Number(params.duration),
                capital: Number(params.capital_investment),
                nonCapital: Number(params.non_capital_investment),
                totalInvestment: Number(params.capital_investment) + Number(params.non_capital_investment),
                totalIncome: simulation.rows.reduce((sum, r) => sum + Number(r.income || 0), 0),
                totalOpex: simulation.rows.reduce((sum, r) => sum + Number(r.opex || 0), 0),
                totalTax: simulation.rows.reduce((sum, r) => sum + Number(r.tax || 0), 0),
                totalNcf: simulation.totals.ncf,
                rows: simulation.rows
            }
        })
    }, [projects])

    // 2. Agregasi KPI finansial global
    const totals = useMemo(() => {
        const result = {
            count: computedProjects.length,
            investasi: 0,
            pendapatan: 0,
            ncf: 0,
            capital: 0,
            nonCapital: 0
        }

        computedProjects.forEach((proj) => {
            result.investasi += proj.totalInvestment
            result.pendapatan += proj.totalIncome
            result.ncf += proj.totalNcf
            result.capital += proj.capital
            result.nonCapital += proj.nonCapital
        })

        return result;
    }, [computedProjects])

    // 3. Konsolidasi Data Tren Tahunan (Kalendar 2026 - 2036)
    const annualData = useMemo(() => {
        const maxDuration = Math.max(...computedProjects.map(p => p.duration), 5)
        const startYear = new Date().getFullYear()
        const data = []

        for (let i = 0; i <= maxDuration; i++) {
            const yearLabel = startYear + i
            let annualNcf = 0
            let annualIncome = 0
            let annualOpex = 0

            computedProjects.forEach((proj) => {
                if (proj.hasParameters) {
                    const row = proj.rows.find((r) => r.year === i)
                    if (row) {
                        annualNcf += Number(row.ncf || 0)
                        annualIncome += Number(row.income || 0)
                        annualOpex += Number(row.opex || 0)
                    }
                }
            })

            data.push({
                tahun: yearLabel,
                netCashFlow: annualNcf,
                pendapatan: annualIncome,
                opex: annualOpex,
                profit: annualIncome - annualOpex
            })
        }

        return data
    }, [computedProjects])

    return (
        <div className="flex flex-col gap-6">
            {/* KPI Cards */}
            <div className="flex gap-3">
                <TotalProyek count={totals.count} />
                <TotalInvestasi value={totals.investasi} />
                <TotalPendapatan value={totals.pendapatan} />
                <TotalNetCashFlow value={totals.ncf} />
            </div>

            {/* Trends Section */}
            <div className="flex flex-col gap-3 w-full">
                <NetCashFlowTrendChart data={annualData} />
                <div className="flex gap-3">
                    <RevenueVsTaxChart data={annualData} />
                    <ProfitTrendChart data={annualData} totalProfit={totals.ncf} />
                </div>
            </div>

            {/* Allocation & Ranking */}
            <div className="flex gap-3">
                <AlokasiInvestasiChart capital={totals.capital} nonCapital={totals.nonCapital} />
                <PerformaTerbaikTable projects={computedProjects} />
            </div>
        </div>
    )
}
