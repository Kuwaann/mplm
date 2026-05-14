import { Button } from "@/components/ui/button"

export function ProjectItem() {
    return (
        <Button variant="ghost" className="flex flex-1 items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-full font-bold">
                    1
                </div>
                <div>
                    <p className="text-sm font-semibold">Proyek Mahakam A</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm font-bold text-emerald-500">$14.250 M</p>
            </div>
        </Button>
    )
}