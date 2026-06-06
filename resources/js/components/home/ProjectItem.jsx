import { Progress } from "@/components/ui/progress"

export function ProjectItem({ name = "Proyek Tanpa Nama", ncf = 0, percent = 0 }) {
    const formatCurrency = (num) => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(num)
    }

    return (
        <div className="flex flex-initial items-center justify-between gap-10 px-6 py-3 hover:bg-muted/30 transition-colors">
            <div className="flex flex-1 flex-col justify-center items-start gap-1.5">
                <div>
                    <p className="text-sm font-medium">{name}</p>
                </div>
                <div className="w-full space-y-1">
                    <div className="flex text-xs text-muted-foreground justify-between">
                        <span>Kontribusi portofolio</span>
                        <span>{percent}%</span>
                    </div>
                    <Progress value={percent} className="h-1.5" />
                </div>
            </div>
            <div className="text-right min-w-[120px]">
                <p className="text-sm font-medium text-emerald-500">
                    <span className="text-xs mr-0.5">Rp</span>
                    {formatCurrency(ncf)} M
                </p>
            </div>
        </div>
    )
}