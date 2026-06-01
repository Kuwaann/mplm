import { Button } from "@/components/ui/button"
import { Field, FieldLabel } from "@/components/ui/field"
import { Progress } from "@/components/ui/progress"

export function ProjectItem() {
    return (
        <Button variant="ghost" className="flex flex-1 items-center justify-between gap-10 px-4 py-2">
            <div className="flex flex-1 flex-col justfiy-center items-start gap-1">
                <div>
                    <p className="text-sm font-medium">Proyek Mahakam A</p>
                </div>
                <Field className="w-full">
                    <FieldLabel htmlFor="progress-upload">
                        <span className="text-xs text-muted-foreground">Progres proyek</span>
                        <span className="ml-auto">{Math.round((6 / 7) * 100)}%</span>
                    </FieldLabel>
                    <Progress value={66} id="progress-upload" className="" />
                </Field>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-emerald-500">Rp 14.250 M</p>
            </div>
        </Button>
    )
}