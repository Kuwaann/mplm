import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ProjectItem } from "@/components/home/ProjectItem"
import RentangWaktuSelect from "@/components/RentangWaktuSelect"


export function PerformaTerbaikTable({ projects = [] }) {
    // Urutkan proyek berdasarkan Net Cash Flow tertinggi
    const sortedProjects = [...projects].sort((a, b) => b.totalNcf - a.totalNcf);
    const maxNcf = sortedProjects[0]?.totalNcf || 1;

    return (
        <Card className="flex-2 flex flex-col gap-0 pb-0 min-w-[320px]">
            <CardHeader className="mb-4 gap-3 justify-between items-center flex flex-row px-6">
                <div>
                    <CardTitle>Proyek Terbaik</CardTitle>
                    <CardDescription>Menampilkan proyek dengan Net Cash Flow tertinggi.</CardDescription>
                </div>
            </CardHeader>
            <CardContent className={sortedProjects.length === 0 ? "flex-1 flex flex-col gap-1 p-0 pb-6 justify-center" : "flex-1 flex flex-col gap-1 p-0 pb-6"}>
                {sortedProjects.slice(0, 5).map((proj) => (
                    <ProjectItem
                        key={proj.id}
                        name={proj.name}
                        ncf={proj.totalNcf}
                        percent={maxNcf > 0 ? Math.round((proj.totalNcf / maxNcf) * 100) : 0}
                    />
                ))}
                {sortedProjects.length === 0 && (
                    <p className="text-center py-6 text-sm text-muted-foreground">Belum ada data proyek berparameter</p>
                )}
            </CardContent>
        </Card>
    )
}