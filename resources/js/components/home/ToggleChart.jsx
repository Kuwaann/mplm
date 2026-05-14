import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export function ToggleChart() {
    return (
        <ToggleGroup variant="outline" type="single" defaultValue="all">
            <ToggleGroupItem value="all">
                Total
            </ToggleGroupItem>
            <ToggleGroupItem value="missed">
                Rata-rata
            </ToggleGroupItem>
        </ToggleGroup>
    )
}
