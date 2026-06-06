import Layout from "@/layouts/Layout"
import ProjectDetailLayout from "@/layouts/ProjectDetailLayout"
import DataProyekCalculator from "@/components/detil-proyek/data/DataProyekCalculator"

export default function DetilProyekDataPage({ project }) {
    return <DataProyekCalculator project={project} />
}

DetilProyekDataPage.layout = (page) => (
    <Layout>
        <ProjectDetailLayout>{page}</ProjectDetailLayout>
    </Layout>
)