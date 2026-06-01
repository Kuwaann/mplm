import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { CircleIcon, PlusCircle } from "lucide-react"
import { Link } from "@inertiajs/react"

export default function DataProyekCalculator() {
    const [duration, setDuration] = useState(10)
    const [capital, setCapital] = useState(13000)
    const [nonCapital, setNonCapital] = useState(8000)
    const [productionYear1, setProductionYear1] = useState(175)
    const [declineRate, setDeclineRate] = useState(8)
    const [oilPrice, setOilPrice] = useState(32)
    const [opex, setOpex] = useState(180)
    const [taxRate, setTaxRate] = useState(51)

    const formatNumber = (value) => {
        if (value === "" || value === null || value === undefined) return "-"
        return Number(value).toLocaleString("en-US", {
            maximumFractionDigits: 2,
        })
    }

    const rows = useMemo(() => {
        const result = []

        const totalInvestment = Number(capital) + Number(nonCapital)
        const depreciation = totalInvestment / Number(duration)

        result.push({
            year: 0,
            production: "",
            income: "",
            capital,
            nonCapital,
            opex: "",
            depreciation: "",
            taxableIncome: "",
            tax: "",
            ncf: -totalInvestment,
        })

        let production = Number(productionYear1)

        for (let year = 1; year <= Number(duration); year++) {
            if (year > 1) {
                production = production * (1 - Number(declineRate) / 100)
            }

            const income = production * Number(oilPrice)
            const taxableIncome = income - Number(opex) - depreciation
            const tax = taxableIncome > 0 ? taxableIncome * Number(taxRate) / 100 : 0
            const ncf = income - Number(opex) - depreciation - tax

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
        }

        return result
    }, [
        duration,
        capital,
        nonCapital,
        productionYear1,
        declineRate,
        oilPrice,
        opex,
        taxRate,
    ])

    const totals = rows.reduce(
        (acc, row) => {
            acc.income += Number(row.income || 0)
            acc.tax += Number(row.tax || 0)
            acc.ncf += Number(row.ncf || 0)
            return acc
        },
        {
            income: 0,
            tax: 0,
            ncf: 0,
        }
    )

    return (
        <main className="p-12">
            <header className="mb-6">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-medium">Nama Proyek</h1>
                        <Badge variant="outline" className="gap-1">
                            <CircleIcon className="size-3 fill-emerald-500 text-emerald-500" />
                            Data proyek
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Durasi: {duration} tahun</span>
                        <span>•</span>
                        <span>Metode depresiasi: Straight Line</span>
                        <span>•</span>
                        <span>Pajak: {taxRate}%</span>
                    </div>
                </div>

                <div className="mt-4">
                    <Button asChild className="rounded-xl">
                        <Link href="/detil-proyek/data/tambah">
                            <PlusCircle className="size-4" />
                            Tambah data
                        </Link>
                    </Button>
                </div>
            </header>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>Parameter Proyek</CardTitle>
                    <CardDescription>
                        Isi parameter untuk menghitung data tahun ke-0 sampai tahun akhir secara otomatis.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label htmlFor="duration">Jangka waktu proyek</Label>
                            <Input
                                id="duration"
                                type="number"
                                min="1"
                                max="25"
                                value={duration}
                                onChange={(e) => setDuration(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capital">Capital Investment</Label>
                            <Input
                                id="capital"
                                type="number"
                                value={capital}
                                onChange={(e) => setCapital(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nonCapital">Non Capital Investment</Label>
                            <Input
                                id="nonCapital"
                                type="number"
                                value={nonCapital}
                                onChange={(e) => setNonCapital(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="productionYear1">Produksi tahun ke-1</Label>
                            <Input
                                id="productionYear1"
                                type="number"
                                value={productionYear1}
                                onChange={(e) => setProductionYear1(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="declineRate">Laju penurunan produksi (%)</Label>
                            <Input
                                id="declineRate"
                                type="number"
                                value={declineRate}
                                onChange={(e) => setDeclineRate(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="oilPrice">Harga rata-rata minyak per tahun</Label>
                            <Input
                                id="oilPrice"
                                type="number"
                                value={oilPrice}
                                onChange={(e) => setOilPrice(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="opex">Opex</Label>
                            <Input
                                id="opex"
                                type="number"
                                value={opex}
                                onChange={(e) => setOpex(Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Pajak (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-3">
                    <CardTitle>Data proyek per tahun</CardTitle>
                    <CardDescription>
                        Tabel mengikuti format tahun ke-0, tahun ke-1, dan seterusnya seperti contoh perhitungan.
                    </CardDescription>
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
                                    <TableHead rowSpan={2} className="min-w-[150px] align-middle text-center">
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
                                        <TableCell className="text-center font-medium">
                                            {row.year}
                                        </TableCell>
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
                                        Total
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formatNumber(totals.income)}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell />
                                    <TableCell className="text-center">
                                        {formatNumber(totals.tax)}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {formatNumber(totals.ncf)}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </main>
    )
}