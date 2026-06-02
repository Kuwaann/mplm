import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"
import { usePage } from "@inertiajs/react"

export function calculateProjectProgress(project) {
    if (!project) {
        return {
            progress: 0,
            duration: 0,
            startYear: new Date().getFullYear(),
            endYear: new Date().getFullYear(),
            currentProjectYear: 0
        }
    }

    const params = project.economic_parameters?.[0]
    if (!params) {
        return {
            progress: 0,
            duration: 0,
            startYear: project.created_at ? new Date(project.created_at).getFullYear() : new Date().getFullYear(),
            endYear: project.created_at ? new Date(project.created_at).getFullYear() : new Date().getFullYear(),
            currentProjectYear: 0
        }
    }

    const duration = Number(params.duration)
    const startYear = project.created_at ? new Date(project.created_at).getFullYear() : new Date().getFullYear()
    const endYear = startYear + duration

    const currentYear = new Date().getFullYear()
    const elapsedYears = Math.max(1, currentYear - startYear + 1)
    const currentProjectYear = Math.min(elapsedYears, duration)
    const progress = duration > 0 ? Math.round((currentProjectYear / duration) * 100) : 0

    return {
        progress,
        duration,
        startYear,
        endYear,
        currentProjectYear
    }
}

export default function ProgresProyek({ project: propProject }) {
    const { props } = usePage()
    const project = propProject || props.project

    if (!project) {
        return null
    }

    const { progress, startYear, endYear, duration } = calculateProjectProgress(project)

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="text-xs opacity-50">Progres Proyek</CardTitle>
            </CardHeader>
            <CardContent className="mt-auto flex flex-row gap-3 items-center">
                <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                        <span className="text-xs text-muted-foreground">
                            {duration > 0 ? `Tahun ${startYear} - ${endYear}` : "Parameter belum diisi"}
                        </span>
                        <span className="ml-auto">{progress}%</span>
                    </FieldLabel>
                    <Progress value={progress} id="progress-upload" className="" />
                </Field>
            </CardContent>
        </Card>
    );
}