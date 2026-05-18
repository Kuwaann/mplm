import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, Settings } from 'lucide-react'
import { Badge } from "@/components/ui/badge"

export default function TotalInvestasi() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Total investasi</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-xl font-medium'>Rp 0,00</p>
                <Badge variant="outline" ><TrendingUpIcon className="text-emerald-500 w-4 h-4" /> <p className="text-emerald-500">+2</p></Badge>
            </CardContent>
        </Card>
    )
}