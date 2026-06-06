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
import { TriangleAlertIcon } from "lucide-react"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { useState } from "react"


export default function HapusProyekDialog({ projectId, open, onOpenChange }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hapus Proyek</DialogTitle>
                    <div className="w-full flex items-center justify-center">
                        <TriangleAlertIcon className="text-destructive" size={64} />
                    </div>
                    <DialogDescription className="text-justify">
                        Proyek ini akan dihapus secara permanen beserta seluruh data yang terkait.
                        Tindakan ini tidak dapat dibatalkan.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Batal</Button>
                    </DialogClose>
                    <Button type="submit" className="bg-destructive text-white">
                        Hapus Proyek
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}