import Layout from "@/layouts/Layout"
import { Separator } from "@/components/ui/separator"
import ProjectNavigationMenu from "@/components/detil-proyek/ringkasan-proyek/ProjectNavigationMenu"
import DataProyekCalculator from "@/components/detil-proyek/data/DataProyekCalculator"

export default function DetilProyekDataPage() {
    return (
        <div className="detil-proyek-menu">
            <header className="px-4 lg:px-6">
                <ProjectNavigationMenu />
            </header>
            <Separator />
            <DataProyekCalculator />
        </div>
    )
}

DetilProyekDataPage.layout = (page) => <Layout>{page}</Layout>