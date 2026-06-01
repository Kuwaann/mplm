import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { InfoIcon, LineChartIcon, Settings } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

export default function ProjectNavigationMenu() {
    const { url } = usePage()

    const navItemClass = (href) =>
        `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
            url === href
                ? "border-b-2 border-foreground rounded-none text-foreground"
                : "text-muted-foreground hover:text-foreground"
        }`

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-3">
                <NavigationMenuItem className="">
                    <NavigationMenuLink asChild>
                        <Link href="/detil-proyek" className={navItemClass("/detil-proyek")}>
                            <InfoIcon /> Ringkasan
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="">
                    <NavigationMenuLink asChild>
                        <Link href="/detil-proyek/data" className={navItemClass("/detil-proyek/data")}>
                            <LineChartIcon /> Data
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="">
                    <NavigationMenuLink className="flex items-center gap-2 px-4 py-2 rounded-md text-muted-foreground hover:text-foreground">
                        <Settings /> Pengaturan
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}