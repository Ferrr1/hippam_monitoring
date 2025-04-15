import { NavMain } from '@/components/nav-main';
// import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { LayoutGrid, UserCog, BookUser, CreditCard, ClipboardMinus, Droplets, Calculator } from 'lucide-react';
import AppLogo from './app-logo';

export function AppSidebar() {
    const { props } = usePage<{
        auth: {
            user: {
                role: string;
            };
        };
    }>();

    const role = props.auth.user.role;

    const mainNavItems: NavItem[] = role === 'admin'
        ? [
            {
                label: "Dashboard",
                items: [
                    {
                        title: 'Dashboard',
                        href: '/admin/dashboard',
                        icon: LayoutGrid,
                    },
                ],
            },
            {
                label: "Management Data",
                items: [
                    {
                        title: 'Pengguna',
                        href: '/admin/pengguna',
                        icon: UserCog,
                    },
                    {
                        title: 'Data Warga',
                        href: '/admin/warga',
                        icon: BookUser,
                    },
                    {
                        title: 'Tagihan',
                        href: '/admin/tagihan',
                        icon: CreditCard,
                    },
                    {
                        title: 'Tarif Air',
                        href: '/admin/tarif',
                        icon: Droplets,
                    },
                    {
                        title: 'Laporan',
                        href: '/admin/report',
                        icon: ClipboardMinus,
                    },
                ],
            },
            {
                label: "Fuzzy Logic",
                items: [
                    {
                        title: 'Fuzzy Mamdani',
                        href: '/admin/fuzzy',
                        icon: Calculator,
                    },
                ],
            },
        ]
        : [
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
                label: "Tagihan",
                items: [
                    {
                        title: 'Lihat Tagihan',
                        href: '/tagihan',
                        icon: CreditCard,
                    },
                    {
                        title: 'Riwayat Pembayaran',
                        href: '/riwayat',
                        icon: ClipboardMinus,
                    },
                ],
            },
        ];

    const dashboardPath = role === 'admin' ? '/admin/dashboard' : '/dashboard';
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboardPath} prefetch>
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
