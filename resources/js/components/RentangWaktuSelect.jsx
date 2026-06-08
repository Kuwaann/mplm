import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export default function RentangWaktuSelect({ timeRange, setTimeRange }) {
    return (
        <Select defaultValue="5" value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-auto">
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
                <SelectGroup>
                    <SelectItem value="5">5 Tahun Proyeksi</SelectItem>
                    <SelectItem value="10">10 Tahun Proyeksi</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    )
}