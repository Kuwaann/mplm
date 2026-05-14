import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleRentangWaktu() {
    return (
        <ToggleGroup variant="outline" type="single" defaultValue="all">
            <ToggleGroupItem value="all">
                5Y
            </ToggleGroupItem>
            <ToggleGroupItem value="missed">
                10Y
            </ToggleGroupItem>
            <ToggleGroupItem value="missed">
                Max
            </ToggleGroupItem>
        </ToggleGroup>
    )
}
