import React, { useState, useMemo, useEffect } from "react"
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
import TambahProyekDialog from "./TambahProyekDialog"
import ProyekFilter from "./ProyekFilter"
import { simulateProjectEconomics } from "../../utils/PetroleumEconomicsEngine"

export default function MainSection({ projects = [] }) {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(25)

    // Reset current page when projects prop changes (due to searching/filtering)
    useEffect(() => {
        setCurrentPage(1)
    }, [projects])

    const tableData = useMemo(() => {
        return projects.map((proj, idx) => {
            const params = proj.economic_parameters?.[0]
            let ncfVal = 0
            let durationText = "- Tahun"

            if (params) {
                const simulation = simulateProjectEconomics({
                    duration: params.duration,
                    capital: params.capital_investment,
                    non_capital: params.non_capital_investment,
                    production_y1: params.production_y1,
                    decline_rate: params.decline_rate,
                    oil_price: params.oil_price,
                    opex_y1: params.opex_y1,
                    opex_growth: params.opex_growth,
                    tax_rate: params.tax_rate,
                    depreciation_method: params.depreciation_method,
                    deduct_investment_in_year_1: true
                })
                ncfVal = simulation.totals.ncf
                durationText = `${params.duration} Tahun`
            }

            const formatCurrency = (num) => {
                return new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(num)
            }

            return {
                id: proj.id,
                no: idx + 1,
                nama_proyek: proj.name,
                lokasi: (() => {
                    if (!proj.location) return "Kalimantan Timur";
                    try {
                        if (proj.location.trim().startsWith("{")) {
                            const parsed = JSON.parse(proj.location);
                            return [parsed.city, parsed.province].filter(Boolean).join(", ") || parsed.country || "Kalimantan Timur";
                        }
                    } catch (e) {}
                    return proj.location;
                })(),
                umur_proyek: durationText,
                net_cash_flow: formatCurrency(ncfVal),
                status_proyek: "Aktif",
                project: proj,
            }
        })
    }, [projects])

    const totalItems = tableData.length
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    // Slice data for pagination
    const paginatedData = useMemo(() => {
        const startIdx = (currentPage - 1) * pageSize
        return tableData.slice(startIdx, startIdx + pageSize)
    }, [tableData, currentPage, pageSize])

    const renderPaginationItems = () => {
        const items = [];
        
        // Previous Button
        items.push(
            <PaginationItem key="prev">
                <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );

        // Page Numbers (1, 2, 3, 4, 5...)
        for (let i = 1; i <= totalPages; i++) {
            items.push(
                <PaginationItem key={i}>
                    <PaginationLink 
                        href="#" 
                        isActive={currentPage === i}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(i);
                        }}
                        className="cursor-pointer"
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>
            );
        }

        // Next Button
        items.push(
            <PaginationItem key="next">
                <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                        e.preventDefault();
                        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
            </PaginationItem>
        );

        return items;
    };

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
                        <ProyekFilter />
                    </div>
                    <TambahProyekDialog />
                </CardAction>
            </CardHeader>
            <Separator />
            <CardContent className="">
                <DataTable columns={columns} data={paginatedData} />
                <div className="flex justify-center items-center gap-3">
                    <Field orientation="horizontal" className="w-fit">
                        <FieldLabel htmlFor="select-rows-per-page">Rows per page</FieldLabel>
                        <Select 
                            value={String(pageSize)} 
                            onValueChange={(val) => {
                                setPageSize(Number(val));
                                setCurrentPage(1);
                            }}
                        >
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
                    {totalPages > 1 && (
                        <Pagination className="w-fit mx-0">
                            <PaginationContent>
                                {renderPaginationItems()}
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}