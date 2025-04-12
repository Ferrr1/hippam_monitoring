import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarMenu>
                {items.map((group) => (
                    <div key={group.label}>
                        <SidebarGroupLabel className='-my-1'>{group.label}</SidebarGroupLabel>
                        {group.items.map((subItem) => (
                            <SidebarMenuItem className='my-2' key={subItem.title}>
                                <SidebarMenuButton
                                    asChild isActive={subItem.href === page.url}
                                    tooltip={{ children: subItem.title }}
                                >
                                    <Link href={subItem.href} prefetch>
                                        {subItem.icon && <subItem.icon />}
                                        <span>{subItem.title}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </div>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
