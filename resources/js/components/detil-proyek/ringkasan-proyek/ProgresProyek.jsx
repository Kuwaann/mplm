import {
    Card,
    CardContent,
    CardAction,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

export default function ProgresProyek() {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Progres Proyek</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                        <span className="text-xs text-muted-foreground">Tahun 25/25</span>
                        <span className="ml-auto">{Math.round((25 / 25) * 100)}%</span>
                    </FieldLabel>
                    <Progress value={100} id="progress-upload" className="" />
                </Field>
            </CardContent>
        </Card>
    );
}