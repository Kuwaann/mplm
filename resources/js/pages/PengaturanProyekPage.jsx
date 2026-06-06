import Layout from "@/layouts/Layout"
import ProjectDetailLayout from "@/layouts/ProjectDetailLayout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useForm, usePage } from "@inertiajs/react"
import { useState, useEffect } from "react"
import { Loader2, MapPinIcon, Save, CheckCircle2 } from "lucide-react"

const toTitleCase = (str) => {
    if (!str) return ""
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export default function PengaturanProyekPage({ project }) {
    const { flash } = usePage().props

    // Parse existing location data
    let initialCountry = "Indonesia"
    let initialProvince = ""
    let initialCity = ""
    let initialLat = -0.9122
    let initialLon = 117.2511

    try {
        if (project?.location && project.location.trim().startsWith('{')) {
            const locObj = JSON.parse(project.location)
            initialCountry = locObj.country || "Indonesia"
            initialProvince = locObj.province || ""
            initialCity = locObj.city || ""
            if (locObj.lat !== undefined) initialLat = Number(locObj.lat)
            if (locObj.lon !== undefined) initialLon = Number(locObj.lon)
        }
    } catch (e) { }

    const [country, setCountry] = useState(initialCountry)
    const [province, setProvince] = useState(initialProvince)
    const [provinceId, setProvinceId] = useState("")
    const [city, setCity] = useState(initialCity)
    const [lat, setLat] = useState(initialLat)
    const [lon, setLon] = useState(initialLon)
    const [resolving, setResolving] = useState(false)
    const [resolveError, setResolveError] = useState("")

    const [provincesList, setProvincesList] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const [loadingProvinces, setLoadingProvinces] = useState(false)
    const [loadingCities, setLoadingCities] = useState(false)

    const { data, setData, put, processing, errors } = useForm({
        name: project?.name || "",
        description: project?.description || "",
        duration: project?.economic_parameters?.[0]?.duration || 0,
    })

    // Load provinces
    useEffect(() => {
        if (country === "Indonesia") {
            const fetchProvinces = async () => {
                setLoadingProvinces(true)
                try {
                    const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
                    const list = await res.json()
                    list.sort((a, b) => a.name.localeCompare(b.name))
                    setProvincesList(list)

                    // Auto-select the province if it matches existing data
                    if (initialProvince) {
                        const match = list.find(p => toTitleCase(p.name) === initialProvince)
                        if (match) {
                            setProvinceId(match.id)
                            // Load cities for matched province
                            const citiesRes = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${match.id}.json`)
                            const citiesList = await citiesRes.json()
                            citiesList.sort((a, b) => a.name.localeCompare(b.name))
                            setCitiesList(citiesList)
                        }
                    }
                } catch (e) {
                    console.error("Gagal mengambil daftar provinsi", e)
                } finally {
                    setLoadingProvinces(false)
                }
            }
            fetchProvinces()
        } else {
            setProvincesList([])
            setCitiesList([])
        }
    }, [country])

    const handleProvinceChange = async (e) => {
        const selectedId = e.target.value
        setProvinceId(selectedId)

        const selectedProv = provincesList.find(p => p.id === selectedId)
        const provName = selectedProv ? toTitleCase(selectedProv.name) : ""
        setProvince(provName)

        setCity("")
        setCitiesList([])

        if (selectedId) {
            setLoadingCities(true)
            try {
                const res = await fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${selectedId}.json`)
                const list = await res.json()
                list.sort((a, b) => a.name.localeCompare(b.name))
                setCitiesList(list)
            } catch (e) {
                console.error("Gagal mengambil daftar kota", e)
            } finally {
                setLoadingCities(false)
            }
        }
    }

    const lookupCoordinates = async (cName, pName, cityName) => {
        if (!cityName.trim()) return
        setResolving(true)
        setResolveError("")
        try {
            const query = [cityName, pName, cName].filter(Boolean).join(", ")
            const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`, {
                headers: {
                    'Accept': 'application/json',
                    'User-Agent': 'Petrostream/1.0 (tamca@live.com)'
                }
            })
            const resultData = await res.json()
            if (resultData && resultData.length > 0) {
                setLat(parseFloat(resultData[0].lat))
                setLon(parseFloat(resultData[0].lon))
            } else {
                setResolveError("Lokasi tidak ditemukan di peta. Koordinat default akan digunakan.")
            }
        } catch (err) {
            setResolveError("Gagal menghubungi API geolokasi.")
        } finally {
            setResolving(false)
        }
    }

    const handleCityChange = (e) => {
        const selectedCityName = e.target.value
        setCity(selectedCityName)
        if (selectedCityName) {
            lookupCoordinates(country, province, selectedCityName)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const locationJson = JSON.stringify({
            country,
            province,
            city,
            lat,
            lon
        })

        put(`/detil-proyek/${project.id}/pengaturan`, {
            data: {
                name: data.name,
                description: data.description,
                duration: data.duration,
                location: locationJson,
            },
            preserveScroll: true,
        })
    }

    return (
        <main className="p-12">
            <form onSubmit={handleSubmit}>
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-xl font-semibold">Pengaturan Proyek</h2>
                        <p className="text-sm text-muted-foreground mt-1">Kelola informasi dasar dan konfigurasi proyek Anda.</p>
                    </div>
                    <Button
                        type="submit"
                        disabled={processing}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white gap-2 transition-colors duration-200"
                    >
                        {processing ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Save className="size-4" />
                        )}
                        {processing ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>

                {flash?.success && (
                    <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
                        <CheckCircle2 className="size-5 shrink-0 text-emerald-500" />
                        <span className="text-sm font-medium">{flash.success}</span>
                    </div>
                )}

                <div className="flex flex-col gap-6">
                    {/* Informasi Umum */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Informasi Umum</CardTitle>
                            <CardDescription>Nama dan deskripsi proyek yang akan ditampilkan di seluruh aplikasi.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-5">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="pengaturan-nama">Nama Proyek</Label>
                                <Input
                                    id="pengaturan-nama"
                                    value={data.name}
                                    onChange={(e) => setData("name", e.target.value)}
                                    placeholder="Masukkan nama proyek..."
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="pengaturan-deskripsi">Deskripsi Proyek</Label>
                                <Textarea
                                    id="pengaturan-deskripsi"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    placeholder="Jelaskan tujuan dan ruang lingkup proyek..."
                                    rows={4}
                                    className="resize-none"
                                />
                                {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Jangka Waktu Proyek */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Jangka Waktu Proyek</CardTitle>
                            <CardDescription>Tentukan durasi proyek dalam satuan tahun (0–25 tahun).</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="pengaturan-durasi">Durasi (Tahun)</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        id="pengaturan-durasi"
                                        type="number"
                                        min={0}
                                        max={25}
                                        value={data.duration}
                                        onChange={(e) => setData("duration", Math.min(25, Math.max(0, Number(e.target.value))))}
                                        className="max-w-[200px]"
                                    />
                                    <span className="text-sm text-muted-foreground">tahun</span>
                                </div>
                                {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
                                <p className="text-xs text-muted-foreground mt-1">Minimal 0 tahun, maksimal 25 tahun.</p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Lokasi Proyek */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Lokasi Proyek</CardTitle>
                            <CardDescription>Informasi lokasi geografis dan koordinat proyek.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="pengaturan-negara">Negara</Label>
                                    <select
                                        id="pengaturan-negara"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        className="w-full max-w-[300px] rounded-lg border border-input bg-background h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20"
                                    >
                                        <option value="Indonesia">Indonesia</option>
                                        <option value="Malaysia">Malaysia</option>
                                        <option value="Brunei">Brunei</option>
                                        <option value="Lainnya">Lainnya...</option>
                                    </select>
                                </div>

                                {country === "Indonesia" ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="pengaturan-provinsi">Provinsi</Label>
                                            <select
                                                id="pengaturan-provinsi"
                                                value={provinceId}
                                                onChange={handleProvinceChange}
                                                className="w-full rounded-lg border border-input bg-background h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20"
                                                disabled={loadingProvinces}
                                            >
                                                <option value="">Pilih Provinsi...</option>
                                                {provincesList.map((prov) => (
                                                    <option key={prov.id} value={prov.id}>
                                                        {toTitleCase(prov.name)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="pengaturan-kota">Kota / Kabupaten</Label>
                                            <select
                                                id="pengaturan-kota"
                                                value={city}
                                                onChange={handleCityChange}
                                                className="w-full rounded-lg border border-input bg-background h-9 px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20"
                                                disabled={loadingCities || !provinceId}
                                            >
                                                <option value="">Pilih Kota/Kab...</option>
                                                {citiesList.map((c) => {
                                                    const formattedCity = toTitleCase(c.name)
                                                    return (
                                                        <option key={c.id} value={formattedCity}>
                                                            {formattedCity}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="pengaturan-provinsi-manual">Provinsi</Label>
                                            <Input
                                                id="pengaturan-provinsi-manual"
                                                value={province}
                                                onChange={(e) => setProvince(e.target.value)}
                                                placeholder="Contoh: Sarawak"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Label htmlFor="pengaturan-kota-manual">Kota / Kabupaten</Label>
                                            <Input
                                                id="pengaturan-kota-manual"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Contoh: Miri"
                                            />
                                        </div>
                                        <div className="col-span-2 flex justify-end">
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                onClick={() => lookupCoordinates(country, province, city)}
                                                disabled={resolving || !city.trim()}
                                                className="text-sm bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20"
                                            >
                                                {resolving && <Loader2 className="h-4 w-4 animate-spin mr-1" />}
                                                Cari Koordinat
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                <Separator />

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="pengaturan-lat">Latitude (Lintang)</Label>
                                        <Input
                                            id="pengaturan-lat"
                                            type="number"
                                            step="any"
                                            value={lat}
                                            onChange={(e) => setLat(Number(e.target.value))}
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Label htmlFor="pengaturan-lon">Longitude (Bujur)</Label>
                                        <Input
                                            id="pengaturan-lon"
                                            type="number"
                                            step="any"
                                            value={lon}
                                            onChange={(e) => setLon(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                                {resolving && (
                                    <p className="text-emerald-500 text-xs animate-pulse flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Menghubungi satelit geolokasi...
                                    </p>
                                )}
                                {resolveError && !resolving && (
                                    <p className="text-amber-500 text-xs">{resolveError}</p>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </form>
        </main>
    )
}

PengaturanProyekPage.layout = (page) => (
    <Layout>
        <ProjectDetailLayout>{page}</ProjectDetailLayout>
    </Layout>
)
