import Layout from '../layouts/Layout'
import ActiveProjects from '@/components/kelola-proyek/ActiveProjects'
import DelayedProjects from '@/components/kelola-proyek/DelayedProjects'
import FinishedProjects from '@/components/kelola-proyek/FinishedProjects'
import MainSection from '@/components/kelola-proyek/MainSection'
import { usePage } from '@inertiajs/react'
import { CheckCircle2 } from 'lucide-react'

export default function KelolaProyekPage({ projects }) {
    const { props } = usePage()
    const flash = props.flash

    return (
        <main className="kelola-proyek-menu p-12 flex flex-col gap-3">
            {flash?.success && (
                <div className="mb-4 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                    <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                    <span className="text-sm font-medium">{flash.success}</span>
                </div>
            )}
            <div className="flex gap-3">
                <ActiveProjects projects={projects?.data || projects} />
                <DelayedProjects projects={projects?.data || projects} />
                <FinishedProjects projects={projects?.data || projects} />
            </div>
            <MainSection projects={projects?.data || projects} />
        </main>
    )
}

KelolaProyekPage.layout = (page) => <Layout>{page}</Layout>
