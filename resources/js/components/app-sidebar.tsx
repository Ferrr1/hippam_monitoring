import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { LayoutGrid, BookUser, CreditCard, ClipboardMinus, Droplets, Calculator } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        label: "Dashboard",
        items: [
            {
                title: 'Dashboard',
                href: '/dashboard',
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: "Management Data",
        items: [
            {
                title: 'Data Warga',
                href: '/data-warga',
                icon: BookUser,
            },
            {
                title: 'Tagihan',
                href: '/tagihan',
                icon: CreditCard,
            },
            {
                title: 'Tarif Air',
                href: '/tarif',
                icon: Droplets,
            },
            {
                title: 'Laporan',
                href: '/report',
                icon: ClipboardMinus,
            },
        ],
    },
    {
        label: "Fuzzy Logic",
        items: [
            {
                title: 'Fuzzy Mamdani',
                href: '/fuzzy-mamdani',
                icon: Calculator,
            },
        ],
    },
];


export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
        </Sidebar>
    );
}
