import {
    useSidebar,
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarTrigger,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarMenuBadge,
} from "@/components/ui/sidebar"
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Workflow, House, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Link, usePage } from '@inertiajs/react';

export function AppSidebar() {
    const { state } = useSidebar();
    const { url } = usePage();
    const menus = [
        {
            name: 'Beranda',
            href: '/home'
        },
        {
            name: 'Kelola Proyek',
            href: '/kelola-proyek'
        },
        {
            name: 'Log Aktivitas',
            href: '/log-aktivitas'
        }
    ]

    return (
        <Sidebar variant="inset" collapsible="icon">
            <SidebarHeader className="flex flex-row justify-between">
                {state !== 'collapsed' && <h1 className="text-md font-medium">Petrostream</h1>}
                <SidebarTrigger />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href="/home" className="text-sm"><House />Beranda</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel asChild><label className="font-medium">Alat</label></SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <Link href={menus[1].href} className="text-sm">
                                    <Workflow />
                                    {menus[1].name}
                                    <SidebarMenuBadge>24</SidebarMenuBadge>
                                </Link>
                            </SidebarMenuButton>
                            <SidebarMenuButton asChild>
                                <Link href={menus[2].href} className="text-sm">
                                    <Workflow />
                                    {menus[2].name}
                                    <SidebarMenuBadge>24</SidebarMenuBadge>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <Separator />
                {state !== 'collapsed' &&
                    <Collapsible defaultOpen className="group/collapsible">
                        <SidebarGroup>
                            <SidebarGroupLabel asChild>
                                <CollapsibleTrigger>
                                    <label className="font-medium">Baru dibuka</label>
                                    <ChevronDown className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180" />
                                </CollapsibleTrigger>
                            </SidebarGroupLabel>
                            <CollapsibleContent>
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton asChild>
                                            <Link href="" className="text-sm truncate">Proyek 1</Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link href="" className="text-sm truncate">Proyek 1</Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link href="" className="text-sm truncate">Proyek 1</Link>
                                        </SidebarMenuButton>
                                        <SidebarMenuButton asChild>
                                            <Link href="" className="text-sm truncate">Proyek 1</Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            </CollapsibleContent>
                        </SidebarGroup>
                    </Collapsible>
                }
            </SidebarContent>
            <Separator />
            <SidebarFooter className="p-0 pt-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="flex items-center justify-start gap-3 flex-1 px-2 py-4">
                            <Avatar>
                                <AvatarImage src="https://github.com/shadcn.png" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col justify-center items-start overflow-hidden flex-1">
                                <p className="font-semibold text-xs truncate">Your Name</p>
                                <p className="text-xs opacity-50 truncate">youremail@email.com</p>
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                            <DropdownMenuItem>
                                Profil
                                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                Pengaturan
                                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem>GitHub</DropdownMenuItem>
                            <DropdownMenuItem>Dukungan</DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuGroup>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                <Link href="/">
                                    Log out
                                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarFooter>
        </Sidebar>
    )
}