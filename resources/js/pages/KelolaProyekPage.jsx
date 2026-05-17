import Layout from '../layouts/Layout'
import ActiveProjects from '@/components/kelola-proyek/ActiveProjects'
import DelayedProjects from '@/components/kelola-proyek/DelayedProjects'
import FinishedProjects from '@/components/kelola-proyek/FinishedProjects'
import MainSection from '@/components/kelola-proyek/MainSection'

export default function KelolaProyekPage() {
    return (
        <div className="kelola-proyek-menu p-12 flex flex-col gap-3">
            <div className="flex gap-3">
                <ActiveProjects />
                <DelayedProjects />
                <FinishedProjects />
            </div>
            <MainSection />
        </div>
    )
}

KelolaProyekPage.layout = (page) => <Layout>{page}</Layout>
