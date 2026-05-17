import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "../ui/button"
import { PlusCircleIcon, FilterIcon } from "lucide-react"
import { Separator } from "../ui/separator"
import SearchBox from "../SearchBox"
import { DataTable } from "./tables/main-table/DataTable"
import { columns } from "./tables/main-table/columns"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { Field, FieldLabel } from "@/components/ui/field"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
const dummyData = [
    {
        id: "proj-001",
        no: 1,
        nama_proyek: "Blok Mahakam A",
        lokasi: "Kalimantan Timur",
        umur_proyek: "5 Tahun",
        net_cash_flow: "Rp 12.500.000.000",
        status_proyek: "Aktif",
    },
    {
        id: "proj-002",
        no: 2,
        nama_proyek: "Sumur Rokan B",
        lokasi: "Riau",
        umur_proyek: "12 Tahun",
        net_cash_flow: "Rp 8.200.000.000",
        status_proyek: "Tertunda",
    },
    {
        id: "proj-003",
        no: 3,
        nama_proyek: "Kilang Balikpapan",
        lokasi: "Kalimantan Timur",
        umur_proyek: "8 Tahun",
        net_cash_flow: "Rp 45.000.000.000",
        status_proyek: "Selesai",
    },
    {
        id: "proj-004",
        no: 4,
        nama_proyek: "Fasilitas Cepu",
        lokasi: "Jawa Tengah",
        umur_proyek: "3 Tahun",
        net_cash_flow: "Rp 5.100.000.000",
        status_proyek: "Aktif",
    }
]

export default function MainSection() {
    return (
        <Card className="">
            <CardHeader className="pb-0">
                <CardTitle>
                    Daftar proyek
                </CardTitle>
                <CardDescription>
                    Menampilkan semua proyek yang tersedia
                </CardDescription>
                <CardAction className="flex flex-row gap-4">
                    <div className="flex flex-row gap-2">
                        <SearchBox className="w-[250px]" />
                        <Button variant="outline"><FilterIcon /></Button>
                    </div>
                    <Button className="py-4"><PlusCircleIcon />Tambah proyek</Button>
                </CardAction>
            </CardHeader>
            <Separator />
            <CardContent className="">
                <DataTable columns={columns} data={dummyData} />
                <div className="flex justify-center items-center gap-3">
                    <Field orientation="horizontal" className="w-fit">
                        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                        <Select defaultValue="25">
                            <SelectTrigger className="w-20" id="select-rows-per-page">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent align="start">
                                <SelectGroup>
                                    <SelectItem value="10">10</SelectItem>
                                    <SelectItem value="25">25</SelectItem>
                                    <SelectItem value="50">50</SelectItem>
                                    <SelectItem value="100">100</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </Field>
                    <Pagination className="w-fit mx-0">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious href="#" />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">1</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#" isActive>
                                    2
                                </PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationLink href="#">3</PaginationLink>
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </CardContent>
        </Card>
    )
}