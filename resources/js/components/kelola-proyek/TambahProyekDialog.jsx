import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "../ui/button"
import { PlusCircleIcon, Loader2, MapPinIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { useForm } from "@inertiajs/react"
import { useState, useEffect } from "react"

const toTitleCase = (str) => {
    if (!str) return ""
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase())
}

export default function TambahProyekDialog() {
    const [open, setOpen] = useState(false)
    const [country, setCountry] = useState("Indonesia")
    const [province, setProvince] = useState("")
    const [provinceId, setProvinceId] = useState("")
    const [city, setCity] = useState("")
    const [lat, setLat] = useState(-0.9122)
    const [lon, setLon] = useState(117.2511)
    const [resolving, setResolving] = useState(false)
    const [resolveError, setResolveError] = useState("")

    // Administrative lists
    const [provincesList, setProvincesList] = useState([])
    const [citiesList, setCitiesList] = useState([])
    const [loadingProvinces, setLoadingProvinces] = useState(false)
    const [loadingCities, setLoadingCities] = useState(false)

    // Load provinces when open and country is Indonesia
    useEffect(() => {
        if (!open) return
        
        if (country === "Indonesia") {
            const fetchProvinces = async () => {
                setLoadingProvinces(true)
                try {
                    const res = await fetch("https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json")
                    const list = await res.json()
                    list.sort((a, b) => a.name.localeCompare(b.name))
                    setProvincesList(list)
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
            setProvince("")
            setProvinceId("")
            setCity("")
        }
    }, [country, open])

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

    const { data, setData, post, processing, errors, reset, transform } = useForm({
        name: "",
        location: "",
        description: ""
    })

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
        if (!data.name.trim()) return

        transform((data) => ({
            ...data,
            location: JSON.stringify({
                country,
                province,
                city,
                lat,
                lon
            })
        }))

        post("/proyek", {
            onSuccess: () => {
                setOpen(false)
                reset()
                setCountry("Indonesia")
                setProvince("")
                setProvinceId("")
                setCity("")
                setLat(-0.9122)
                setLon(117.2511)
                setResolveError("")
            }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="py-4"><PlusCircleIcon />Tambah proyek</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <DialogHeader>
                        <DialogTitle>Tambah proyek baru</DialogTitle>
                        <DialogDescription>
                            Isi nama dan informasi proyek untuk menambahkan proyek baru ke database.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="nama-proyek">Nama proyek</Label>
                            <Input
                                id="nama-proyek"
                                name="name"
                                placeholder="Isi nama proyek disini..."
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                        </div>

                        <div className="border border-muted/50 rounded-xl p-3 bg-muted/10 space-y-3">
                            <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                                <MapPinIcon className="size-3.5 text-emerald-500" /> Detail Lokasi Geografis
                            </h4>

                            <div className="flex flex-col gap-1.5">
                                <Label htmlFor="negara-proyek" className="text-xs">Negara</Label>
                                <select
                                    id="negara-proyek"
                                    value={country}
                                    onChange={(e) => setCountry(e.target.value)}
                                    className="w-full rounded-lg border border-input bg-background/50 h-9 px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20 dark:text-foreground text-black bg-white dark:bg-slate-900"
                                    required
                                >
                                    <option value="Indonesia" className="bg-white text-black dark:bg-slate-950 dark:text-white">Indonesia</option>
                                    <option value="Malaysia" className="bg-white text-black dark:bg-slate-950 dark:text-white">Malaysia</option>
                                    <option value="Brunei" className="bg-white text-black dark:bg-slate-950 dark:text-white">Brunei</option>
                                    <option value="Lainnya" className="bg-white text-black dark:bg-slate-950 dark:text-white">Lainnya...</option>
                                </select>
                            </div>

                            {country === "Indonesia" ? (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="provinsi-proyek" className="text-xs">Provinsi</Label>
                                            <select
                                                id="provinsi-proyek"
                                                value={provinceId}
                                                onChange={handleProvinceChange}
                                                className="w-full rounded-lg border border-input bg-background/50 h-9 px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20 dark:text-foreground text-black bg-white dark:bg-slate-900"
                                                disabled={loadingProvinces}
                                                required
                                            >
                                                <option value="" className="bg-white text-black dark:bg-slate-950 dark:text-white">Pilih Provinsi...</option>
                                                {provincesList.map((prov) => (
                                                    <option key={prov.id} value={prov.id} className="bg-white text-black dark:bg-slate-950 dark:text-white">
                                                        {toTitleCase(prov.name)}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="kota-proyek" className="text-xs">Kota / Kabupaten</Label>
                                            <select
                                                id="kota-proyek"
                                                value={city}
                                                onChange={handleCityChange}
                                                className="w-full rounded-lg border border-input bg-background/50 h-9 px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring dark:bg-input/20 dark:text-foreground text-black bg-white dark:bg-slate-900"
                                                disabled={loadingCities || !provinceId}
                                                required
                                            >
                                                <option value="" className="bg-white text-black dark:bg-slate-950 dark:text-white">Pilih Kota/Kab...</option>
                                                {citiesList.map((c) => {
                                                    const formattedCity = toTitleCase(c.name);
                                                    return (
                                                        <option key={c.id} value={formattedCity} className="bg-white text-black dark:bg-slate-950 dark:text-white">
                                                            {formattedCity}
                                                        </option>
                                                    );
                                                })}
                                            </select>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="provinsi-proyek-manual" className="text-xs">Provinsi</Label>
                                            <Input
                                                id="provinsi-proyek-manual"
                                                value={province}
                                                onChange={(e) => setProvince(e.target.value)}
                                                placeholder="Contoh: Sarawak"
                                                className="h-9 text-xs"
                                                required
                                            />
                                        </div>
                                        <div className="flex flex-col gap-1.5">
                                            <Label htmlFor="kota-proyek-manual" className="text-xs">Kota / Kabupaten</Label>
                                            <Input
                                                id="kota-proyek-manual"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                placeholder="Contoh: Miri"
                                                className="h-9 text-xs"
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => lookupCoordinates(country, province, city)}
                                            disabled={resolving || !city.trim()}
                                            className="h-9 text-xs px-3 bg-emerald-600/10 text-emerald-600 hover:bg-emerald-600/20"
                                        >
                                            {resolving ? (
                                                <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                            ) : null}
                                            Cari Koordinat
                                        </Button>
                                    </div>
                                </>
                            )}

                            <div className="grid grid-cols-2 gap-3 p-2 bg-muted/40 rounded-lg text-xs">
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[10px]">Latitude (Lintang)</span>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={lat}
                                        onChange={(e) => setLat(Number(e.target.value))}
                                        className="h-7 text-xs px-2"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <span className="text-muted-foreground text-[10px]">Longitude (Bujur)</span>
                                    <Input
                                        type="number"
                                        step="any"
                                        value={lon}
                                        onChange={(e) => setLon(Number(e.target.value))}
                                        className="h-7 text-xs px-2"
                                        required
                                    />
                                </div>
                                {resolving && (
                                    <p className="col-span-2 text-emerald-500 text-[10px] mt-1 animate-pulse flex items-center gap-1">
                                        <Loader2 className="h-3 w-3 animate-spin" /> Menghubungi satelit geolokasi...
                                    </p>
                                )}
                                {resolveError && !resolving && (
                                    <p className="col-span-2 text-amber-500 text-[10px] mt-1">{resolveError}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="deskripsi-proyek">Deskripsi proyek</Label>
                            <Input
                                id="deskripsi-proyek"
                                name="description"
                                placeholder="Deskripsi opsional..."
                                value={data.description}
                                onChange={(e) => setData("description", e.target.value)}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">Batal</Button>
                        </DialogClose>
                        <Button type="submit" disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                            {processing ? "Menambahkan..." : "Tambah proyek"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}