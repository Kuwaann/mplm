import Layout from '../layouts/Layout'
import CardsSection from '@/components/home/CardsSection'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function HomePage() {
    return (
        <div className="homepage-menu p-12">
            <div className="flex gap-3 items-center mb-10">
                <Avatar className="">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h1 className="text-2xl font-medium">Selamat datang, User!</h1>
                    <h2 className="text-muted-foreground text-sm">Berikut adalah ringkasan performa proyek migas hari ini.</h2>
                </div>
            </div>
            <CardsSection />
        </div>

    )
}

HomePage.layout = (page) => <Layout>{page}</Layout>
