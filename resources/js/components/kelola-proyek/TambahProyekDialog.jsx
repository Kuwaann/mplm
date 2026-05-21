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
import { PlusCircleIcon } from "lucide-react"
import { Input } from "../ui/input"
import { Label } from "../ui/label"

export default function TambahProyekDialog() {
    return (
        <Dialog>
            <DialogTrigger asChild><Button className="py-4"><PlusCircleIcon />Tambah proyek</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Tambah proyek baru</DialogTitle>
                    <DialogDescription>
                        Isi nama proyek untuk menambahkan proyek.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama-proyek">Nama proyek</Label>
                        <Input id="nama-proyek" name="nama-proyek" placeholder="Isi nama proyek disini..."></Input>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button " variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit">Tambah proyek</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}