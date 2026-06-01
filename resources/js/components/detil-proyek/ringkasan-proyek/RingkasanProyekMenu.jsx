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

export default function RingkasanProyekMenu() {
    return (
        <main className="p-12">
            <header className="flex justify-between items-center mb-3">
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3 items-center">
                        <h1 className="text-2xl font-medium">Nama Proyek</h1>
                        <Badge variant="outline">
                            <CircleIcon className={status === "Aktif" ? "text-emerald-500 fill-emerald-500" : status === "Tertunda" ? "text-amber-500 fill-amber-500" : "fill-blue-400 text-blue-400"} />
                            <span className={status === "Aktif" ? "text-emerald-500 fill-emerald-500" : status === "Tertunda" ? "text-amber-500 fill-amber-500" : "fill-blue-400 text-blue-400"}>Selesai</span>
                        </Badge>
                    </div>
                    <div className="flex gap-2 items-center">
                        <span className="text-muted-foreground text-xs flex">
                            Dibuat oleh: Muhammad Emir Rivaldy
                        </span>
                        <span>•</span>
                        <span className="text-muted-foreground text-xs">Dibuat: 28 Mei 2025</span>
                        <span>•</span>
                        <span className="text-muted-foreground text-xs">Diperbarui: 28 Mei 2025</span>
                    </div>

                </div>
                <Button variant="outline"><StarIcon /> Favorit</Button>
            </header>
            <Separator />
            <div className="flex justify-between items-start mt-12 gap-6">
                <section className="flex flex-col gap-6 flex-7">
                    <div>
                        <ProgresProyek />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <TotalProduksiKumulatif />
                        <TotalInvestasiProyek />
                        <TotalPendapatanProyek />
                        <TotalNetPresentValue />
                        <TotalIRR />
                        <TotalPaybackPeriod />
                    </div>
                    <AliranKasKumulatifChart />
                    <ProfilProduksiVsPendapatanChart />
                    <NetCashFlowTrendProyekChart />
                </section>
                <section className="flex-3 flex flex-col gap-5">
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><InfoIcon className="w-4 h-4" />  Deskripsi Proyek</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <p className="text-justify">Lorem ipsum dolor sit amet consectetur adipisicing elit. Ut deleniti quam enim reprehenderit at consequuntur, odio fuga tempora placeat veniam vero nostrum repudiandae optio eum, aut doloribus, distinctio quibusdam saepe.</p>
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><MapPinIcon className="w-4 h-4" /> Lokasi Proyek</CardTitle>
                            <CardAction className=""><Link className="text-sky-500 text-sm">Lihat di Google Maps</Link></CardAction>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-2">
                            <p className="text-justify">Blok Mahakam, Lapangan Bekapai, Selat Makassar, Kalimantan Timur, Indonesia (Koordinat: 0°55'44.2"S 117°25'11.8"E).</p>
                            <ProjectLocationMap className="h-[150px] max-h-[150px]" />
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center"><TimerIcon className="w-4 h-4" /> Jangka Waktu Proyek</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-2">
                            25 tahun
                        </CardContent>
                    </Card>
                    <Separator />
                    <Card className="bg-transparent border-none ring-0 p-0 rounded-none">
                        <CardHeader className="p-0">
                            <CardTitle className="text-sm text-muted-foreground flex gap-2 items-center">
                                <UserIcon className="w-4 h-4" /> Manajer Proyek 
                                <Badge variant="secondary">3</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">Muhammad Emir Rivaldy</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">John Doe</p>
                            </div>
                            <div className="flex gap-3 items-center">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <p className="font-medium">Jane Doe</p>
                            </div>
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    )
}