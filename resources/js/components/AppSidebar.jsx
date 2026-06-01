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
import { Workflow, House, ChevronDown, ActivityIcon } from "lucide-react"
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
import React, { useState, useEffect } from 'react';

export function AppSidebar() {
    const { state } = useSidebar();
    const { url, props } = usePage();
    const [recentProjects, setRecentProjects] = useState([]);

    useEffect(() => {
        try {
            const stored = localStorage.getItem('recent_projects');
            if (stored) {
                setRecentProjects(JSON.parse(stored));
            }
        } catch (e) {
            console.error('Failed to load recent projects', e);
        }
    }, []);

    useEffect(() => {
        const activeProject = props.project;
        if (activeProject && activeProject.id && activeProject.name) {
            setRecentProjects((prev) => {
                const filtered = prev.filter(p => p.id !== activeProject.id);
                const updated = [{ id: activeProject.id, name: activeProject.name }, ...filtered].slice(0, 5);
                try {
                    localStorage.setItem('recent_projects', JSON.stringify(updated));
                } catch (e) {
                    console.error('Failed to save recent projects', e);
                }
                return updated;
            });
        }
    }, [props.project]);

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

    const projectCount = props.projects?.length ?? 10;

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
                            <SidebarMenuButton asChild isActive={url === '/home'}>
                                <Link href="/home" className="text-sm"><House />Beranda</Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel asChild><label className="font-medium">Alat</label></SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={url.startsWith('/kelola-proyek')}>
                                <Link href={menus[1].href} className="text-sm">
                                    <Workflow />
                                    {menus[1].name}
                                    <SidebarMenuBadge>{projectCount}</SidebarMenuBadge>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={url.startsWith('/log-aktivitas')}>
                                <Link href={menus[2].href} className="text-sm">
                                    <ActivityIcon />
                                    {menus[2].name}
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
                                    {recentProjects.length > 0 ? (
                                        recentProjects.map((p) => (
                                            <SidebarMenuItem key={p.id}>
                                                <SidebarMenuButton asChild isActive={url.startsWith(`/detil-proyek/${p.id}`)}>
                                                    <Link href={`/detil-proyek/${p.id}`} className="text-sm truncate">
                                                        {p.name}
                                                    </Link>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))
                                    ) : (
                                        <SidebarMenuItem>
                                            <span className="text-xs text-muted-foreground px-2 py-1.5 block italic">
                                                Belum ada proyek yang dibuka
                                            </span>
                                        </SidebarMenuItem>
                                    )}
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
                                <Link href="/" className="flex justify-between items-center w-full">
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