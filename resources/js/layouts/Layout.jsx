import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/SiteHeader"
import SearchBox from "@/components/SearchBox"

export default function Layout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="">
                <SiteHeader />
                {children}
            </SidebarInset>
        </SidebarProvider>
    )
}