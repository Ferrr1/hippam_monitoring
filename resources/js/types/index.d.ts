import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    label: string;
    items: NavMenuItem[];
}

export interface NavMenuItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    [key: string]: unknown;
}
export interface PageProps<T = Record<string, unknown>> {
    auth: {
      user: User;
    };
    ziggy: {
      location: string;
      routes: Record<string, unknown>;
    };
    props?: T;
  }
export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    warga: {
        no_telp: string;
        alamat: string;
    }
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
