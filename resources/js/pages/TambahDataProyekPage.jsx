import Layout from "@/layouts/Layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Link } from "@inertiajs/react"

export default function TambahDataProyekPage() {
    return (
        <main className="p-12">
            <header className="mb-6">
                <h1 className="text-2xl font-medium">Tambah data proyek</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Masukkan parameter proyek untuk membentuk tabel per tahun.
                </p>
            </header>

            <Separator />

            <Card className="mt-6 max-w-5xl">
                <CardHeader>
                    <CardTitle>Parameter input proyek</CardTitle>
                    <CardDescription>
                        Isi data dasar untuk menghitung tabel tahun ke-0 sampai tahun akhir.
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form className="grid gap-5 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="durasi-proyek">Jangka waktu proyek</Label>
                            <Input
                                id="durasi-proyek"
                                type="number"
                                min="1"
                                max="25"
                                placeholder="Maksimal 25 tahun"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="investasi-total">Besar investasi total</Label>
                            <Input
                                id="investasi-total"
                                type="number"
                                placeholder="Contoh: 21000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="capital">Capital Investment</Label>
                            <Input
                                id="capital"
                                type="number"
                                placeholder="Contoh: 13000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="non-capital">Non Capital Investment</Label>
                            <Input
                                id="non-capital"
                                type="number"
                                placeholder="Contoh: 8000"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="produksi-awal">Produksi tahun ke-1</Label>
                            <Input
                                id="produksi-awal"
                                type="number"
                                placeholder="Contoh: 175"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="decline-rate">Laju penurunan produksi (%)</Label>
                            <Input
                                id="decline-rate"
                                type="number"
                                placeholder="Contoh: 8"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="harga-minyak">Harga rata-rata minyak per tahun</Label>
                            <Input
                                id="harga-minyak"
                                type="number"
                                placeholder="Contoh: 32"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="metode-depresiasi">Metode depresiasi</Label>
                            <Select>
                                <SelectTrigger id="metode-depresiasi">
                                    <SelectValue placeholder="Pilih metode" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="straight-line">Straight Line</SelectItem>
                                        <SelectItem value="declining-balance">Declining Balance</SelectItem>
                                        <SelectItem value="sum-of-years">Sum of Years Digits</SelectItem>
                                        <SelectItem value="unit-of-production">Unit of Production</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="opex">Opex (biaya operasional)</Label>
                            <Input
                                id="opex"
                                type="number"
                                placeholder="Contoh: 180"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="pajak">Pajak (%)</Label>
                            <Input
                                id="pajak"
                                type="number"
                                placeholder="Contoh: 51"
                            />
                        </div>

                        <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
                            <Button asChild variant="outline">
                                <Link href="/detil-proyek/data">Batal</Link>
                            </Button>
                            <Button type="button">Simpan</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </main>
    )
}

TambahDataProyekPage.layout = (page) => <Layout>{page}</Layout>