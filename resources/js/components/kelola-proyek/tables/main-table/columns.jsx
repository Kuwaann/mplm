import { Badge } from "@/components/ui/badge"
import { CircleIcon } from "lucide-react"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { calculateProjectProgress } from "@/components/detil-proyek/ringkasan-proyek/ProgresProyek"
export const columns = [
    {
        accessorKey: "nama_proyek",
        header: "Nama Proyek",
    },
    {
        accessorKey: "lokasi",
        header: "Lokasi Proyek",
    },
    {
        accessorKey: "umur_proyek",
        header: "Umur Proyek",
        cell: ({ row }) => {
            const umurProyek = row.getValue("umur_proyek")
            const project = row.original.project
            const { progress } = calculateProjectProgress(project)
            return (
                <div className="flex flex-col gap-1">
                    {umurProyek}
                    <Field className="w-full max-w-sm">
                        <FieldLabel htmlFor="progress-upload">
                            <span className="text-xs text-muted-foreground">Progres proyek</span>
                            <span className="ml-auto">{progress}%</span>
                        </FieldLabel>
                        <Progress value={progress} id="progress-upload" />
                    </Field>
                </div>
            )
        }
    },
    {
        accessorKey: "net_cash_flow",
        header: "Net Cash Flow"
    },
    {
        accessorKey: "status_proyek",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status_proyek")
            return (
                <Badge
                    variant="outline"
                    className=""
                >
                    <CircleIcon className={status === "Aktif" ? "text-emerald-500 fill-emerald-500" : status === "Tertunda" ? "text-amber-500 fill-amber-500" : "fill-blue-400 text-blue-400"} />
                    {status}
                </Badge>
            )
        },
    },
]