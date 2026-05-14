import Layout from '../layouts/Layout'
import CardsSection from '@/components/home/CardsSection'

export default function HomePage() {
    return (
        <div className="homepage-menu p-12">
            <CardsSection />
        </div>

    )
}

HomePage.layout = (page) => <Layout>{page}</Layout>
