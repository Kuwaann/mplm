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

export default function TotalProyek({ count = 0 }) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Total Proyek</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-xl font-medium'>{count}</p>
            </CardContent>
        </Card>
    )
}