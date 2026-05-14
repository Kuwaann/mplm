import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ProjectItem } from "@/components/home/ProjectItem"

export function PerformaTerbaikTable() {
    return (
        <Card className="flex-2 flex flex-col gap-0">
            <CardHeader className="mb-4">
                <CardTitle>Proyek dengan performa terbaik</CardTitle>
                <CardDescription>Menampilkan 5 proyek dengan net cash flow tertinggi</CardDescription>
            </CardHeader>
            <Separator />
            <CardContent className="flex-1 flex flex-col gap-2 mt-2">
                <ProjectItem />
                <Separator />
                <ProjectItem />
                <Separator />
                <ProjectItem />
                <Separator />
                <ProjectItem />
                <Separator />
                <ProjectItem />
            </CardContent>
        </Card>
    )
}