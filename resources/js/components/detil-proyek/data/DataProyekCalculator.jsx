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
import { CheckCircle2, CircleIcon, Loader2, PlusCircle, Save } from "lucide-react"
import { Link, usePage, router } from "@inertiajs/react"
import { simulateProjectEconomics } from "@/utils/PetroleumEconomicsEngine"

export default function DataProyekCalculator({ project }) {
    const { props } = usePage()
    const flash = props.flash
    const [isSaving, setIsSaving] = useState(false)

    const params = project?.economic_parameters?.[0]

    const [duration, setDuration] = useState(params ? params.duration : "")
    const [capital, setCapital] = useState(params ? params.capital_investment : "")
    const [nonCapital, setNonCapital] = useState(params ? params.non_capital_investment : "")
    const [productionYear1, setProductionYear1] = useState(params ? params.production_y1 : "")
    const [declineRate, setDeclineRate] = useState(params ? Math.round(params.decline_rate * 100) : "")
    const [oilPrice, setOilPrice] = useState(params ? params.oil_price : "")
    const [opex, setOpex] = useState(params ? params.opex_y1 : "")
    const [taxRate, setTaxRate] = useState(params ? Math.round(params.tax_rate * 100) : "")

    const handleSave = () => {
        if (!project?.id) return

        setIsSaving(true)
        router.post(
            `/detil-proyek/${project.id}/parameter`,
            {
                duration: duration === "" ? 0 : Number(duration),
                capital_investment: capital === "" ? 0 : Number(capital),
                non_capital_investment: nonCapital === "" ? 0 : Number(nonCapital),
                production_y1: productionYear1 === "" ? 0 : Number(productionYear1),
                decline_rate: declineRate === "" ? 0 : Number(declineRate),
                oil_price: oilPrice === "" ? 0 : Number(oilPrice),
                opex_y1: opex === "" ? 0 : Number(opex),
                tax_rate: taxRate === "" ? 0 : Number(taxRate),
            },
            {
                onFinish: () => setIsSaving(false),
            }
        )
    }

    const formatNumber = (value) => {
        if (value === "" || value === null || value === undefined) return "-"
        return Number(value).toLocaleString("en-US", {
            maximumFractionDigits: 2,
        })
    }

    const rows = useMemo(() => {
        // Menggunakan engine terpusat untuk simulasi keekonomian proyek
        const simulation = simulateProjectEconomics({
            duration: Number(duration),
            capital: Number(capital),
            non_capital: Number(nonCapital),
            production_y1: Number(productionYear1),
            decline_rate: Number(declineRate) / 100,
            oil_price: Number(oilPrice),
            opex_y1: Number(opex),
            opex_growth: 0, // Belum ada parameter growth di UI
            tax_rate: Number(taxRate) / 100,
            depreciation_method: 'straight_line',
            deduct_investment_in_year_1: false // Investasi di tahun ke-0 sesuai behavior UI
        })

        // Map hasil simulasi ke struktur data yang dibutuhkan UI
        return simulation.rows.map((row) => ({
            year: row.year,
            production: row.year === 0 ? "" : row.production,
            income: row.year === 0 ? "" : row.income,
            capital: row.year === 0 ? row.capital : "",
            nonCapital: row.year === 0 ? row.non_capital : "",
            opex: row.year === 0 ? "" : row.opex,
            depreciation: row.year === 0 ? "" : row.depreciation,
            taxableIncome: row.year === 0 ? "" : row.taxable_income,
            tax: row.year === 0 ? "" : row.tax,
            ncf: row.ncf,
        }))
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
            {flash?.success && (
                <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium">{flash.success}</span>
                </div>
            )}

            <header className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-medium">{project?.name || "Nama Proyek"}</h1>
                        <Badge variant="outline" className="gap-1">
                            <CircleIcon className="size-3 fill-emerald-500 text-emerald-500" />
                            Data proyek
                        </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                        <span>Durasi: {duration || "-"} tahun</span>
                        <span>•</span>
                        <span>Metode depresiasi: Straight Line</span>
                        <span>•</span>
                        <span>Pajak: {taxRate || "-"}%</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/detil-proyek/data/tambah">
                            <PlusCircle className="size-4" />
                            Tambah data
                        </Link>
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white gap-2 transition-colors duration-200"
                    >
                        {isSaving ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        Simpan Parameter
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
                                onChange={(e) => setDuration(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capital">Capital Investment</Label>
                            <Input
                                id="capital"
                                type="number"
                                value={capital}
                                onChange={(e) => setCapital(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nonCapital">Non Capital Investment</Label>
                            <Input
                                id="nonCapital"
                                type="number"
                                value={nonCapital}
                                onChange={(e) => setNonCapital(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="productionYear1">Produksi tahun ke-1</Label>
                            <Input
                                id="productionYear1"
                                type="number"
                                value={productionYear1}
                                onChange={(e) => setProductionYear1(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="declineRate">Laju penurunan produksi (%)</Label>
                            <Input
                                id="declineRate"
                                type="number"
                                value={declineRate}
                                onChange={(e) => setDeclineRate(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="oilPrice">Harga rata-rata minyak per tahun</Label>
                            <Input
                                id="oilPrice"
                                type="number"
                                value={oilPrice}
                                onChange={(e) => setOilPrice(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="opex">Opex</Label>
                            <Input
                                id="opex"
                                type="number"
                                value={opex}
                                onChange={(e) => setOpex(e.target.value === "" ? "" : Number(e.target.value))}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="taxRate">Pajak (%)</Label>
                            <Input
                                id="taxRate"
                                type="number"
                                value={taxRate}
                                onChange={(e) => setTaxRate(e.target.value === "" ? "" : Number(e.target.value))}
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