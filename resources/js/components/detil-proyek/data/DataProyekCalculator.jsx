import { useEffect, useMemo, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { CircleIcon, Save } from "lucide-react"

const STORAGE_KEY = "mplm-data-proyek-parameters"

const defaultManualProductions = [175, 201, 217, 198]

const defaultParameters = {
    reserve: 4320,
    manualProductionYears: 4,
    manualProductions: defaultManualProductions,
    declineRate: 3,
    capitalCost: 13000,
    nonCapitalCost: 8000,
    initialOpex: 180,
    fixedUntilYear: 3,
    opexGrowthRate: 2.5,
    oilPrice: 32,
    taxRate: 51,
    projectLife: 10,
    depreciationMethod: "straight_line",
}

export default function DataProyekCalculator({ project }) {
    const [reserve, setReserve] = useState(defaultParameters.reserve)
    const [manualProductionYears, setManualProductionYears] = useState(defaultParameters.manualProductionYears)
    const [manualProductions, setManualProductions] = useState(defaultParameters.manualProductions)
    const [declineRate, setDeclineRate] = useState(defaultParameters.declineRate)
    const [capitalCost, setCapitalCost] = useState(defaultParameters.capitalCost)
    const [nonCapitalCost, setNonCapitalCost] = useState(defaultParameters.nonCapitalCost)
    const [initialOpex, setInitialOpex] = useState(defaultParameters.initialOpex)
    const [fixedUntilYear, setFixedUntilYear] = useState(defaultParameters.fixedUntilYear)
    const [opexGrowthRate, setOpexGrowthRate] = useState(defaultParameters.opexGrowthRate)
    const [oilPrice, setOilPrice] = useState(defaultParameters.oilPrice)
    const [taxRate, setTaxRate] = useState(defaultParameters.taxRate)
    const [projectLife, setProjectLife] = useState(defaultParameters.projectLife)
    const [depreciationMethod, setDepreciationMethod] = useState(defaultParameters.depreciationMethod)
    const [savedStatus, setSavedStatus] = useState("")

    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY)
            if (!raw) return

            const parsed = JSON.parse(raw)

            setReserve(parsed.reserve ?? defaultParameters.reserve)
            setManualProductionYears(parsed.manualProductionYears ?? defaultParameters.manualProductionYears)
            setManualProductions(Array.isArray(parsed.manualProductions) ? parsed.manualProductions : defaultManualProductions)
            setDeclineRate(parsed.declineRate ?? defaultParameters.declineRate)
            setCapitalCost(parsed.capitalCost ?? defaultParameters.capitalCost)
            setNonCapitalCost(parsed.nonCapitalCost ?? defaultParameters.nonCapitalCost)
            setInitialOpex(parsed.initialOpex ?? defaultParameters.initialOpex)
            setFixedUntilYear(parsed.fixedUntilYear ?? defaultParameters.fixedUntilYear)
            setOpexGrowthRate(parsed.opexGrowthRate ?? defaultParameters.opexGrowthRate)
            setOilPrice(parsed.oilPrice ?? defaultParameters.oilPrice)
            setTaxRate(parsed.taxRate ?? defaultParameters.taxRate)
            setProjectLife(parsed.projectLife ?? defaultParameters.projectLife)
            setDepreciationMethod(parsed.depreciationMethod ?? defaultParameters.depreciationMethod)
        } catch {
            // abaikan jika data localStorage rusak
        }
    }, [])

    useEffect(() => {
        const years = Math.max(1, Math.min(25, Number(manualProductionYears) || 1))

        setManualProductions((prev) => {
            const next = [...prev.slice(0, years)]
            while (next.length < years) {
                next.push("")
            }
            return next
        })
    }, [manualProductionYears])

    const formatNumber = (value) => {
        if (value === "" || value === null || value === undefined) return "-"
        return new Intl.NumberFormat("en-US", {
            maximumFractionDigits: 2,
        }).format(Number(value))
    }

    const handleSaveParameters = () => {
        const payload = {
            reserve,
            manualProductionYears,
            manualProductions,
            declineRate,
            capitalCost,
            nonCapitalCost,
            initialOpex,
            fixedUntilYear,
            opexGrowthRate,
            oilPrice,
            taxRate,
            projectLife,
            depreciationMethod,
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
        setSavedStatus("Parameter tersimpan")
        setTimeout(() => setSavedStatus(""), 2000)
    }

    const rows = useMemo(() => {
        const life = Math.max(1, Math.min(25, Number(projectLife) || 1))
        const fixedYearLimit = Math.max(0, Number(fixedUntilYear) || 0)
        const reserveLimit = Number(reserve) || 0
        const price = Number(oilPrice) || 0
        const taxPct = Number(taxRate) || 0
        const decline = Number(declineRate) || 0
        const opexBase = Number(initialOpex) || 0
        const opexGrowth = Number(opexGrowthRate) || 0

        const result = []
        let cumulativeProduction = 0
        let bookValue = Number(capitalCost) + Number(nonCapitalCost)

        result.push({
            year: 0,
            production: "",
            income: "",
            capital: Number(capitalCost),
            nonCapital: Number(nonCapitalCost),
            opex: "",
            depreciation: "",
            taxableIncome: "",
            tax: "",
            ncf: -(Number(capitalCost) + Number(nonCapitalCost)),
        })

        let lastProduction = 0
        let lastOpex = opexBase

        for (let year = 1; year <= life; year++) {
            let production = 0

            if (year <= Number(manualProductionYears)) {
                production = Number(manualProductions[year - 1]) || 0
            } else {
                production = lastProduction * (1 - decline / 100)
            }

            const remainingReserve = Math.max(reserveLimit - cumulativeProduction, 0)
            production = Math.min(production, remainingReserve)

            let opex = opexBase
            if (year <= fixedYearLimit) {
                opex = opexBase
            } else if (year === fixedYearLimit + 1) {
                opex = opexBase * (1 + opexGrowth / 100)
            } else {
                opex = lastOpex * (1 + opexGrowth / 100)
            }

            let depreciation = 0
            if (depreciationMethod === "straight_line") {
                depreciation = (Number(capitalCost) + Number(nonCapitalCost)) / life
            } else if (depreciationMethod === "declining_balance") {
                const dbRate = 2 / life
                depreciation = bookValue * dbRate
            } else if (depreciationMethod === "sum_of_years_digits") {
                const syd = (life * (life + 1)) / 2
                depreciation = ((Number(capitalCost) + Number(nonCapitalCost)) * (life - year + 1)) / syd
            } else if (depreciationMethod === "unit_of_production") {
                depreciation = reserveLimit > 0 ? (Number(capitalCost) + Number(nonCapitalCost)) * (production / reserveLimit) : 0
            }

            depreciation = Math.min(depreciation, bookValue)

            const income = production * price
            const taxableIncome = income - opex - depreciation
            const tax = taxableIncome > 0 ? taxableIncome * (taxPct / 100) : 0
            const ncf = income - opex - depreciation - tax

            cumulativeProduction += production
            bookValue = Math.max(bookValue - depreciation, 0)

            result.push({
                year,
                production,
                income,
                capital: "",
                nonCapital: "",
                opex,
                depreciation,
                taxableIncome,
                tax,
                ncf,
            })

            lastProduction = production
            lastOpex = opex
        }

        return result
    }, [
        projectLife,
        reserve,
        capitalCost,
        nonCapitalCost,
        manualProductionYears,
        manualProductions,
        declineRate,
        initialOpex,
        fixedUntilYear,
        opexGrowthRate,
        oilPrice,
        taxRate,
        depreciationMethod,
    ])

    const totals = useMemo(() => {
        return rows.reduce(
            (acc, row) => {
                acc.income += Number(row.income || 0)
                acc.opex += Number(row.opex || 0)
                acc.depreciation += Number(row.depreciation || 0)
                acc.taxableIncome += Number(row.taxableIncome || 0)
                acc.tax += Number(row.tax || 0)
                acc.ncf += Number(row.ncf || 0)
                return acc
            },
            {
                income: 0,
                opex: 0,
                depreciation: 0,
                taxableIncome: 0,
                tax: 0,
                ncf: 0,
            }
        )
    }, [rows])

    const handleProductionChange = (index, value) => {
        setManualProductions((prev) => {
            const next = [...prev]
            next[index] = value === "" ? "" : Number(value)
            return next
        })
    }

    return (
        <main className="p-12">
            <header className="mb-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-medium">{project?.name || "Gunung Bakaran"}</h1>
                    <Badge variant="outline" className="gap-1">
                        <CircleIcon className="size-3 fill-emerald-500 text-emerald-500" />
                        Kalkulator proyek
                    </Badge>
                </div>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span>Durasi: {projectLife} tahun</span>
                    <span>•</span>
                    <span>Depresiasi: {depreciationMethod.replaceAll("_", " ")}</span>
                    <span>•</span>
                    <span>Pajak: {taxRate}%</span>
                </div>
            </header>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Parameter Proyek</CardTitle>
                </CardHeader>

                <CardContent className="space-y-8">
                    <div className="rounded-xl border p-4">
                        <div className="mb-4 flex items-center justify-between gap-3">
                            <h3 className="text-sm font-medium">Reservoir & Production</h3>
                            <Button type="button" variant="outline" onClick={handleSaveParameters}>
                                <Save className="size-4" />
                                Simpan parameter
                            </Button>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                                <Label htmlFor="reserve">Cadangan minyak (Mbbl)</Label>
                                <Input
                                    id="reserve"
                                    type="number"
                                    value={reserve}
                                    onChange={(e) => setReserve(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="manual-years">Jumlah tahun produksi manual</Label>
                                <Input
                                    id="manual-years"
                                    type="number"
                                    min="1"
                                    max="25"
                                    value={manualProductionYears}
                                    onChange={(e) => setManualProductionYears(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="declineRate">Decline rate (%)</Label>
                                <Input
                                    id="declineRate"
                                    type="number"
                                    value={declineRate}
                                    onChange={(e) => setDeclineRate(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="oilPrice">Oil price (USD/bbl)</Label>
                                <Input
                                    id="oilPrice"
                                    type="number"
                                    value={oilPrice}
                                    onChange={(e) => setOilPrice(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>
                        </div>

                        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            {manualProductions.map((value, index) => (
                                <div className="space-y-2" key={index}>
                                    <Label htmlFor={`production-${index}`}>
                                        Produksi tahun {index + 1}
                                    </Label>
                                    <Input
                                        id={`production-${index}`}
                                        type="number"
                                        value={value}
                                        onChange={(e) => handleProductionChange(index, e.target.value)}
                                    />
                                </div>
                            ))}
                        </div>

                        {savedStatus ? (
                            <p className="mt-3 text-sm text-emerald-600">{savedStatus}</p>
                        ) : null}
                    </div>

                    <div className="rounded-xl border p-4">
                        <h3 className="mb-4 text-sm font-medium">Investment</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="capitalCost">Capital cost (USD)</Label>
                                <Input
                                    id="capitalCost"
                                    type="number"
                                    value={capitalCost}
                                    onChange={(e) => setCapitalCost(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="nonCapitalCost">Non capital cost (USD)</Label>
                                <Input
                                    id="nonCapitalCost"
                                    type="number"
                                    value={nonCapitalCost}
                                    onChange={(e) => setNonCapitalCost(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="totalInvestment">Total investment (USD)</Label>
                                <Input
                                    id="totalInvestment"
                                    value={formatNumber(Number(capitalCost) + Number(nonCapitalCost))}
                                    readOnly
                                    className="bg-muted"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-4">
                        <h3 className="mb-4 text-sm font-medium">OPEX</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="initialOpex">Initial OPEX (USD/year)</Label>
                                <Input
                                    id="initialOpex"
                                    type="number"
                                    value={initialOpex}
                                    onChange={(e) => setInitialOpex(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="fixedUntilYear">Fixed until year</Label>
                                <Input
                                    id="fixedUntilYear"
                                    type="number"
                                    min="0"
                                    value={fixedUntilYear}
                                    onChange={(e) => setFixedUntilYear(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="opexGrowthRate">OPEX growth rate (%)</Label>
                                <Input
                                    id="opexGrowthRate"
                                    type="number"
                                    value={opexGrowthRate}
                                    onChange={(e) => setOpexGrowthRate(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border p-4">
                        <h3 className="mb-4 text-sm font-medium">Economic Parameters</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className="space-y-2">
                                <Label htmlFor="taxRate">Tax rate (%)</Label>
                                <Input
                                    id="taxRate"
                                    type="number"
                                    value={taxRate}
                                    onChange={(e) => setTaxRate(e.target.value === "" ? "" : Number(e.target.value))}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="depreciationMethod">Depreciation method</Label>
                                <Select value={depreciationMethod} onValueChange={setDepreciationMethod}>
                                    <SelectTrigger id="depreciationMethod">
                                        <SelectValue placeholder="Pilih metode" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="straight_line">Straight Line</SelectItem>
                                            <SelectItem value="declining_balance">Declining Balance</SelectItem>
                                            <SelectItem value="sum_of_years_digits">Sum of Years Digits</SelectItem>
                                            <SelectItem value="unit_of_production">Unit of Production</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Data proyek</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="overflow-auto rounded-xl border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead rowSpan={2} className="min-w-[80px] align-middle text-center">
                                        Tahun
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[110px] align-middle text-center">
                                        Produksi
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[120px] align-middle text-center">
                                        Income
                                    </TableHead>
                                    <TableHead colSpan={2} className="text-center">
                                        Investasi
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[110px] align-middle text-center">
                                        Opex
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[90px] align-middle text-center">
                                        Di
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[140px] align-middle text-center">
                                        Taxable Income
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[100px] align-middle text-center">
                                        Tax
                                    </TableHead>
                                    <TableHead rowSpan={2} className="min-w-[160px] align-middle text-center">
                                        NCF Undiscounted
                                    </TableHead>
                                </TableRow>
                                <TableRow>
                                    <TableHead className="min-w-[120px] text-center">Capital</TableHead>
                                    <TableHead className="min-w-[130px] text-center">Non Capital</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {rows.map((row) => (
                                    <TableRow key={row.year}>
                                        <TableCell className="text-center font-medium">{row.year}</TableCell>
                                        <TableCell className="text-center">
                                            {row.production === "" ? "-" : formatNumber(row.production)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.income === "" ? "-" : formatNumber(row.income)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.capital === "" ? "-" : formatNumber(row.capital)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.nonCapital === "" ? "-" : formatNumber(row.nonCapital)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.opex === "" ? "-" : formatNumber(row.opex)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.depreciation === "" ? "-" : formatNumber(row.depreciation)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.taxableIncome === "" ? "-" : formatNumber(row.taxableIncome)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.tax === "" ? "-" : formatNumber(row.tax)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {row.ncf === "" ? "-" : formatNumber(row.ncf)}
                                        </TableCell>
                                    </TableRow>
                                ))}

                                <TableRow className="font-medium">
                                    <TableCell colSpan={2} className="text-right">
                                        Total NCF
                                    </TableCell>
                                    <TableCell className="text-center">{formatNumber(totals.income)}</TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell className="text-center">{formatNumber(totals.opex)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(totals.depreciation)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(totals.taxableIncome)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(totals.tax)}</TableCell>
                                    <TableCell className="text-center">{formatNumber(totals.ncf)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}