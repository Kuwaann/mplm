import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { ActivityIcon, TrendingUpIcon } from 'lucide-react'

export default function ActiveProjects() {
    return (
        <Card className="w-xs flex-1">
            <CardHeader className="flex flex-row items-center gap-3">
                <ActivityIcon className="w-3 h-3 opacity-50" />
                <CardTitle className="text-sm opacity-50">Proyek aktif</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-3xl font-medium'>24</p>
                <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
            </CardContent>
        </Card>
    )
}