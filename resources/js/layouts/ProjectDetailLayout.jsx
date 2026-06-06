import ProjectNavigationMenu from "@/components/detil-proyek/ringkasan-proyek/ProjectNavigationMenu"
import { Separator } from "@/components/ui/separator"

export default function ProjectDetailLayout({ children }) {
    return (
        <div className="detil-proyek-menu">
            <header className="px-4 lg:px-6">
                <ProjectNavigationMenu />
            </header>
            <Separator />
            {children}
        </div>
    )
}
