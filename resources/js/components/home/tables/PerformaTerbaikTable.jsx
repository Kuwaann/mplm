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


export function PerformaTerbaikTable() {
    return (
        <Card className="flex-2 flex flex-col gap-0">
            <CardHeader className="mb-4 gap-3 justify-between items-center flex flex-row">
                <CardTitle>Proyek terbaik</CardTitle>
                <CardAction>
                    <RentangWaktuSelect />
                </CardAction>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-1">
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
                <ProjectItem />
            </CardContent>
        </Card>
    )
}