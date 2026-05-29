import { Map } from "@/components/ui/map";
import { useTheme } from "next-themes";

export function ProjectLocationMap() {
    const { resolvedTheme } = useTheme();

    return (
        <div className="h-[150px] w-full dark">
            <Map center={[-74.006, 40.7128]} zoom={12} theme={resolvedTheme} />
        </div>
    );
}