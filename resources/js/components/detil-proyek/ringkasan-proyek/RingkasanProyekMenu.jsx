import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { StarIcon, InfoIcon, MapPinIcon, ActivityIcon, TimerIcon } from "lucide-react"
import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "@inertiajs/react"
import { ProjectLocationMap } from "@/components/detil-proyek/ringkasan-proyek/ProjectLocationMap"
import { Badge } from "@/components/ui/badge"
import { CircleIcon, UserIcon } from "lucide-react"
import TotalProduksiKumulatif from "@/components/detil-proyek/ringkasan-proyek/kpi-cards/TotalProduksiKumulatif"
import TotalInvestasiProyek from "@/components/detil-proyek/ringkasan-proyek/kpi-cards/TotalInvestasiProyek"
import { Separator } from "@/components/ui/separator"
import ProgresProyek from "./ProgresProyek"
import TotalPendapatanProyek from "./kpi-cards/TotalPendapatanProyek"
import TotalNetPresentValue from "./kpi-cards/TotalNetPresentValue"
import TotalIRR from "./kpi-cards/TotalIRR"
import TotalPaybackPeriod from "./kpi-cards/TotalPaybackPeriod"
import { AliranKasKumulatifChart } from "./charts/AliranKasKumulatifChart"
import { ProfilProduksiVsPendapatanChart } from "./charts/ProfilProduksiVsPendapatanChart"
import { NetCashFlowTrendProyekChart } from "./charts/NetCashFlowTrendProyekChart"
import { simulateProjectEconomics } from "../../../utils/PetroleumEconomicsEngine"
import { useState } from "react"

export default function RingkasanProyekMenu({ project }) {
    const [isFavorite, setIsFavorite] = useState(false);
    const activeProject = project

    if (!activeProject) {
        return (
            <main className="p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Belum ada proyek yang dibuat.</p>
            </main>
        )
    }

    const params = activeProject.economic_parameters?.[0]
    const hasParams = !!params
    const status = activeProject.status || "Aktif"

    let latVal = -0.9122
    let lonVal = 117.2511
    let lokasiDisplay = activeProject.location || "Kalimantan Timur"

    try {
        if (activeProject.location && activeProject.location.trim().startsWith('{')) {
            const locObj = JSON.parse(activeProject.location)
            lokasiDisplay = [locObj.city, locObj.province, locObj.country].filter(Boolean).join(", ")
            if (locObj.lat !== undefined && locObj.lon !== undefined) {
                latVal = Number(locObj.lat)
                lonVal = Number(locObj.lon)
            }
        }
    } catch (e) { }

    let simulation = null
    let totals = null
    let indicators = null
    let kasKumulatifData = []
    let netCashFlowData = []
    let produksiVsPendapatanData = []

    if (hasParams) {
        // Jalankan kalkulator petroleum economics
        simulation = simulateProjectEconomics({
            duration: Number(params.duration),
            capital: Number(params.capital_investment),
            non_capital: Number(params.non_capital_investment),
            production_y1: Number(params.production_y1),
            decline_rate: Number(params.decline_rate),
            oil_price: Number(params.oil_price),
            opex_y1: Number(params.opex_y1),
            opex_growth: Number(params.opex_growth || 0),
            tax_rate: Number(params.tax_rate),
            depreciation_method: params.depreciation_method || 'straight_line',
            deduct_investment_in_year_1: true,
            total_reserve: Number(params.total_reserve || 0),
            initial_production_years: Number(params.initial_production_years || 0),
            production_data: params.production_data,
        })

        totals = simulation.totals
        indicators = simulation.indicators

        // Siapkan data grafik dari baris-baris simulasi
        kasKumulatifData = simulation.rows.map(row => ({
            tahun: `Thn ${row.year}`,
            arusKas: row.cumulative_ncf
        }))

        netCashFlowData = simulation.rows.map(row => ({
            tahun: `Thn ${row.year}`,
            netCashFlow: row.ncf
        }))

        produksiVsPendapatanData = simulation.rows.filter(row => row.year > 0).map(row => ({
            tahun: `Thn ${row.year}`,
            produksi: row.production,
            pendapatan: row.income
        }))
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        const date = new Date(dateStr)
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(date)
    }

    const handleFavorite = () => {
        setIsFavorite(!isFavorite)
    }

    return (
        <main className="p-12">
            <header className="flex justify-between items-center mb-3">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-2xl font-medium">{activeProject.name}</h1>
                        <Badge variant="outline">
                            <CircleIcon className={status === "Aktif" ? "text-emerald-500 fill-emerald-500" : status === "Tertunda" ? "text-amber-500 fill-amber-500" : "fill-blue-400 text-blue-400"} />
                            <span className={status === "Aktif" ? "text-emerald-500 ml-1" : status === "Tertunda" ? "text-amber-500 ml-1" : "text-blue-400 ml-1"}>
                                {status}
                            </span>
                        </Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-muted-foreground text-xs flex">
                            Dibuat oleh: Muhammad Emir Rivaldy
                        </span>
                        <span>•</span>
                        <span className="text-muted-foreground text-xs">Dibuat: {formatDate(activeProject.created_at)}</span>
                        <span>•</span>
                        <span className="text-muted-foreground text-xs">Diperbarui: {formatDate(activeProject.updated_at)}</span>
                    </div>
                </div>
                <Button variant="outline" onClick={handleFavorite}><StarIcon className={isFavorite ? 'fill-amber-500 text-amber-500' : ''} /> {isFavorite ? 'Hapus dari Favorit' : 'Tambah ke Favorit'}</Button>
            </header>
            <Separator />
            <div className="flex justify-between items-start mt-12 gap-6">
                <section className="flex flex-col gap-6 flex-7 w-2/3">
                    <div>
                        <ProgresProyek project={activeProject} />
                    </div>
                    {hasParams ? (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <TotalProduksiKumulatif value={totals.production} />
                                <TotalInvestasiProyek value={totals.capital + totals.non_capital} />
                                <TotalPendapatanProyek value={totals.income} />
                                <TotalNetPresentValue value={indicators.npv} />
                                <TotalIRR value={indicators.irr ? (indicators.irr * 100) : 0} />
                                <TotalPaybackPeriod value={indicators.payback_period ?? 0} />
                            </div>
                            <AliranKasKumulatifChart data={kasKumulatifData} />
                            <ProfilProduksiVsPendapatanChart data={produksiVsPendapatanData} />
                            <NetCashFlowTrendProyekChart data={netCashFlowData} />
                        </>
                    ) : (
                        <Card className="border border-dashed border-muted-foreground/30 p-12 text-center flex flex-col items-center justify-center gap-4 bg-muted/5 rounded-2xl">
                            <div className="p-4 bg-amber-500/10 rounded-full text-amber-550 dark:text-amber-400">
                                <InfoIcon className="size-8" />
                            </div>
                            <div className="max-w-md">
                                <h3 className="text-lg font-semibold mb-1 text-foreground">Parameter Ekonomi Belum Diatur</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Proyek baru ini belum memiliki parameter data keekonomian. Untuk melihat analisis kelayakan, grafik arus kas kumulatif, dan metrik NPV/IRR, silakan tambahkan data parameter terlebih dahulu.
                                </p>
                            </div>
                            <Button asChild className="mt-2 bg-emerald-600 hover:bg-emerald-500 text-white gap-2 transition-colors duration-200 shadow-md">
                                <Link href={`/detil-proyek/${activeProject.id}/data`}>
                                    Atur Parameter Sekarang
                                </Link>
                            </Button>
                        </Card>
                    )}
                </section>
                <section className="flex-3 flex flex-col gap-5 w-1/3">
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><InfoIcon className="w-4 h-4" />  Deskripsi Proyek</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 mt-2">
                            <p className="text-justify text-sm leading-relaxed">{activeProject.description || "Tidak ada deskripsi."}</p>
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><MapPinIcon className="w-4 h-4" /> Lokasi Proyek</CardTitle>
                            <CardAction className=""><a href={`https://www.google.com/maps/search/?api=1&query=${latVal},${lonVal}`} target="_blank" rel="noopener noreferrer" className="text-sky-500 text-sm">Lihat di Google Maps</a></CardAction>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-2 mt-2">
                            <p className="text-justify text-sm leading-relaxed">{lokasiDisplay}</p>
                            <ProjectLocationMap lat={latVal} lon={lonVal} className="h-[150px] max-h-[150px] mt-2 rounded-md" />
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><TimerIcon className="w-4 h-4" /> Jangka Waktu Proyek</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-2 mt-2 text-sm">
                            {hasParams ? `${params.duration} tahun` : "Belum diatur"}
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center">
                                <UserIcon className="w-4 h-4" /> Manajer Proyek
                                <Badge variant="secondary" className="ml-2">3</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-3 mt-3">
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>MR</AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-sm">Muhammad Emir Rivaldy</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-sm">John Doe</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>JD</AvatarFallback>
                                </Avatar>
                                <p className="font-medium text-sm">Jane Doe</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    )
}