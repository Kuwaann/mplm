import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Fragment } from "react";
import { usePage } from "@inertiajs/react";

export default function AppBreadcrumbs() {
    const { url } = usePage();
    const segments = url.split('/').filter((segment) => segment !== '');

    return (
        <Breadcrumb>
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    const pathUrl = `/${segments.slice(0, index + 1).join("/")}`;
                    const isLast = index === segments.length - 1;
                    const formattedTitle = segment.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    const title = isNaN(segment)
                        ? formattedTitle
                        : `#${segment}`

                    return (
                        <Fragment key={segment}>
                            {index > 0 && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage href="/components">{title}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href="/components">{title}</BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </Fragment>
                    )
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}