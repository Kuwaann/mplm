import {
    Card,
    CardAction,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "../ui/badge"
import { ClockAlertIcon, TrendingUpIcon } from 'lucide-react'

export default function DelayedProjects() {
    return (
        <Card className="w-xs flex-1">
            <CardHeader className="flex flex-row items-center gap-3">
                <ClockAlertIcon className="w-3 h-3 opacity-50" />
                <CardTitle className="text-sm opacity-50">Proyek tertunda</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-3xl font-medium'>0</p>
            </CardContent>
        </Card>
    )
}