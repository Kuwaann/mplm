import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { InfoIcon, LineChartIcon, Settings } from "lucide-react"
import { Link, usePage } from "@inertiajs/react"

export default function ProjectNavigationMenu() {
    const { url, props } = usePage()
    const project = props.project
    const id = project?.id



    const navLinkClass = (pathSuffix) => {
        const expectedUrl = id ? `/kelola-proyek/detil-proyek/${id}${pathSuffix}` : `/kelola-proyek/detil-proyek${pathSuffix}`
        const isActive = url === expectedUrl
        return `flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${isActive
            ? "rounded-md text-foreground "
            : "text-muted-foreground hover:text-foreground"
            }`
    }

    const navMenuItemClass = (pathSuffix) => {
        const expectedUrl = id ? `/kelola-proyek/detil-proyek/${id}${pathSuffix}` : `/kelola-proyek/detil-proyek${pathSuffix}`
        const isActive = url === expectedUrl
        return `pb-1 box-border border-b-2 border-transparent ${isActive ? 'border-b-2 border-foreground box-border' : ''}`
    }

    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-3 pt-1">
                <NavigationMenuItem className={navMenuItemClass("")}>
                    <NavigationMenuLink asChild>
                        <Link href={id ? `/kelola-proyek/detil-proyek/${id}` : "/kelola-proyek/detil-proyek"} className={navLinkClass("")}>
                            <InfoIcon /> Ringkasan
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className={navMenuItemClass("/data")}>
                    <NavigationMenuLink asChild>
                        <Link href={id ? `/kelola-proyek/detil-proyek/${id}/data` : "/kelola-proyek/detil-proyek/data"} className={navLinkClass("/data")}>
                            <LineChartIcon /> Data
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className={navMenuItemClass("/pengaturan")}>
                    <NavigationMenuLink asChild>
                        <Link href={id ? `/kelola-proyek/detil-proyek/${id}/pengaturan` : "/kelola-proyek/detil-proyek/pengaturan"} className={navLinkClass("/pengaturan")}>
                            <Settings /> Pengaturan
                        </Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}