import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function RentangWaktuSelect() {
    return (
        <Select defaultValue="5y">
            <SelectTrigger className="w-auto">
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectGroup>
                    <SelectItem value="5y">5 tahun terakhir</SelectItem>
                    <SelectItem value="10y">10 tahun terakhir</SelectItem>
                    <SelectItem value="all">Semua waktu</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}