import * as React from "react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu"
import { Button } from "../ui/button"
import { FilterIcon } from "lucide-react"

export default function ProyekFilter() {
    const [lokasi, setLokasi] = React.useState("")
    const [status, setStatus] = React.useState("")

    function handleLokasiChange(value) {
        setLokasi(lokasi === value ? "" : value);
    }

    function handleStatusChange(value) {
        setStatus(status === value ? "" : value);
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline"><FilterIcon /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-auto">
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Lokasi proyek</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={lokasi} onValueChange={handleLokasiChange}>
                        <DropdownMenuRadioItem value="Kalimantan Timur">Kalimantan Timur</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Jawa Tengah">Jawa Tengah</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Riau">Riau</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                    <DropdownMenuLabel>Status proyek</DropdownMenuLabel>
                    <DropdownMenuRadioGroup value={status} onValueChange={handleStatusChange}>
                        <DropdownMenuRadioItem value="Aktif">Aktif</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Tertunda">Tertunda</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="Selesai">Selesai</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}