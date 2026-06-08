import { Link } from '@inertiajs/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
    ArrowRight,
    BarChart3,
    DatabaseZap,
    LockKeyhole,
    ShieldCheck,
    Sparkles,
} from 'lucide-react'

const highlights = [
    {
        icon: BarChart3,
        title: 'Ringkasan proyek',
        description: 'Pantau performa, investasi, dan progres dalam satu tampilan.',
    },
    {
        icon: DatabaseZap,
        title: 'Data terpusat',
        description: 'Akses informasi operasional yang rapi dan mudah dibaca.',
    },
    {
        icon: ShieldCheck,
        title: 'Aman dan konsisten',
        description: 'Akses dan navigasi dibuat lebih nyaman untuk mendukung alur kerja.',
    },
]

export default function LoginPage() {
    return (
        <div className="min-h-screen overflow-hidden bg-background text-foreground">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_30%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.14),transparent_25%),radial-gradient(circle_at_bottom,rgba(59,130,246,0.10),transparent_32%)]" />

            <div className="mx-auto grid min-h-screen max-w-7xl items-stretch lg:grid-cols-[1.05fr_0.95fr]">
                <section className="flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex size-11 items-center justify-center rounded-2xl border border-border bg-card shadow-sm">
                                <Sparkles className="size-5 text-emerald-500" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Petrostream</p>
                                <h1 className="text-xl font-semibold tracking-tight">Masuk ke dashboard</h1>
                            </div>
                        </div>

                    </div>

                    <div className="my-10 grid gap-6 lg:my-0 lg:max-w-xl">
                        <div className="space-y-4">
                            <p className="text-sm font-medium uppercase tracking-[0.3em] text-muted-foreground">
                                Sistem pemantauan proyek migas
                            </p>
                            <h2 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
                                Masuk untuk melihat keseluruhan performa proyek
                            </h2>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                            {highlights.map((item) => {
                                const Icon = item.icon
                                return (
                                    <Card key={item.title} className="border-border/70 bg-card/80 backdrop-blur">
                                        <CardContent className="p-5">
                                            <div className="flex items-start gap-3">
                                                <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10">
                                                    <Icon className="size-5 text-emerald-500" />
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-medium">{item.title}</h3>
                                                    <p className="text-sm leading-6 text-muted-foreground">{item.description}</p>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-3">
                    </div>
                </section>

                <section className="flex items-center justify-center px-6 py-8 sm:px-10 lg:px-12 lg:py-12">
                    <Card className="w-full max-w-md border-border/70 bg-card/90 shadow-2xl shadow-black/10 backdrop-blur">
                        <CardHeader className="space-y-3">
                            <CardTitle className="text-2xl">Selamat Datang</CardTitle>
                            <CardDescription>
                                Masukkan kredensial untuk melanjutkan ke beranda dan menu pengelolaan proyek
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-6">
                            <form className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="nama@perusahaan.com"
                                        className="h-10"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label htmlFor="password">Kata sandi</Label>
                                        <button type="button" className="text-sm text-muted-foreground hover:text-foreground">
                                            Lupa kata sandi?
                                        </button>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-10"
                                    />
                                </div>

                                <div className="flex items-center gap-2">
                                    <Checkbox id="remember" />
                                    <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">
                                        Ingat saya di perangkat ini
                                    </Label>
                                </div>

                                <Button asChild className="h-11 w-full rounded-xl">
                                    <Link href="/home">
                                        Masuk ke dashboard
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </form>

                        </CardContent>
                    </Card>
                </section>
            </div>
        </div>
    )
}