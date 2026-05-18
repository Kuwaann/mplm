import {
    Card,
    CardContent,
    CardAction,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function TotalProyek() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Total proyek</CardTitle>
                <CardAction>
                    <Button size="sm"><Settings /> Kelola</Button>
                </CardAction>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-xl font-medium'>24</p>
                <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
            </CardContent>
        </Card>
    )
}