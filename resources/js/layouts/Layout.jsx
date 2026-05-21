import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
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