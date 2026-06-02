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

export default function TotalPaybackPeriod({ value = 0 }) {
    const formatNumber = (num) => {
        return new Intl.NumberFormat("id-ID", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(num)
    }

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Total Payback Period (PBP)</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <p className='text-xl font-medium'>{formatNumber(value)} <span className="text-muted-foreground">tahun</span></p>
            </CardContent>
        </Card>
    )
}