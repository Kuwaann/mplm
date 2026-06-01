import Layout from "@/layouts/Layout"
import { Separator } from "@/components/ui/separator"
import ProjectNavigationMenu from "@/components/detil-proyek/ringkasan-proyek/ProjectNavigationMenu"
import RingkasanProyekMenu from "@/components/detil-proyek/ringkasan-proyek/RingkasanProyekMenu"

export default function DetilProyekPage({ project }) {
    return (
        <div className="detil-proyek-menu">
            <header className="px-4 lg:px-6">
                <ProjectNavigationMenu />
            </header>
            <Separator />
            <RingkasanProyekMenu project={project} />
        </div >
    )
}

DetilProyekPage.layout = (page) => <Layout>{page}</Layout>