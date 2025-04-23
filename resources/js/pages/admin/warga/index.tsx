import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';
import FormHeader from './create/form-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Warga',
        href: '/admin/warga',
    },
];

interface Warga {
    warga_id: number;
    device_id: string;
    no_telp: number;
    alamat: string;
    user: {
        name: string;
        email: string;
    };
    created_at: string;
    updated_at: string;
}
interface User {
    id: number;
    name: string;
    email: string;
}

export interface Device {
    id: number;
    device_id: string;
    status: string;
}
interface Filters {
    search: string;
    sortBy: string;
    sortDir: 'asc' | 'desc';
    perPage: string;
}
interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
}

type Props = {
    wargas: {
        data: Warga[];
    };
    users: User[];
    devices: Device[];
    filters: Filters;
    pagination: Pagination;
}

export default function Warga({ wargas, users, devices, filters, pagination }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Warga" />
            <div className="px-4 py-6">
                <Heading title="Daftar Warga" description="Halaman untuk menambahkan daftar warga sistem" />

                <FormHeader
                    action={'warga.store'}
                    users={users}
                    devices={devices}
                />

                <Separator className="my-4" />

                <DataTable
                    wargas={wargas}
                    devices={devices}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
