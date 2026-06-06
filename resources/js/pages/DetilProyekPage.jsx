import Layout from "@/layouts/Layout"
import ProjectDetailLayout from "@/layouts/ProjectDetailLayout"
import RingkasanProyekMenu from "@/components/detil-proyek/ringkasan-proyek/RingkasanProyekMenu"

export default function DetilProyekPage({ project }) {
    return <RingkasanProyekMenu project={project} />
}

DetilProyekPage.layout = (page) => (
    <Layout>
        <ProjectDetailLayout>{page}</ProjectDetailLayout>
    </Layout>
)