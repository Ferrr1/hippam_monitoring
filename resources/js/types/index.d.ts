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

// Devices Types
export interface Perangkat {
    id: number;
    device_id: string;
    status: string;
    created_at: string;
    updated_at: string;
}

// Warga Types
export interface Warga {
    warga_id: number;
    device_id: string;
    no_telp: number;
    alamat: string;
    user: {
        name: string;
        email: string;
    };
    device: {
        id: number;
        device_id: number;
    };
    created_at: string;
    updated_at: string;
}

export interface Sensor {
    sensor_data_id: number;
    device: {
        device_id: string;
    };
    value: JSON;
    value_fuzzy: number;
    water_condition: string;
    created_at: string;
    updated_at: string;
}

export interface Tagihan {
    tagihan_id: number;
    meter_awal: number;
    meter_akhir: number;
    tanggal_mulai: string;
    tanggal_akhir: string;
    pemakaian: number;
    total_bayar: number;
    status: string;
    bukti_pembayaran: string;
    warga: {
        user: {
            name: string;
            email: string;
        }
        no_telp: number;
        alamat: string;
    };
    device: {
        device_id: string;
        mac_address: number | string;
        status: string;
    };
    tarif: {
        harga: number;
    };
    created_at: string;
    updated_at: string;
}

export interface SensorData {
    id: number;
    value: number;
    unit: string;
    location: string;
    status: MonitoringStatus;
    timestamp: string;
    icon: LucideIcon;
    description: string;
}


// Table Types

export interface Filters {
    search: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    perPage: string;
}
export interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
}
