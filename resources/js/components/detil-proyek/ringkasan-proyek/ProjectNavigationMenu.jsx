import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { InfoIcon, LineChartIcon, Settings } from "lucide-react"

export default function ProjectNavigationMenu() {
    return (
        <NavigationMenu>
            <NavigationMenuList className="gap-3">
                <NavigationMenuItem className="border-b-2 border-foreground pt-1">
                    <NavigationMenuLink className="px-4 mb-1"><InfoIcon /> Ringkasan</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="">
                    <NavigationMenuLink className="px-4 mb-1"><LineChartIcon /> Data</NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem className="">
                    <NavigationMenuLink className="px-4 mb-1"><Settings /> Pengaturan</NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>
    )
}