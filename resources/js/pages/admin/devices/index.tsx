import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';
import FormHeader from './create/form-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Perangkat',
        href: '/admin/warga',
    },
];

interface Perangkat {
    id: number;
    device_id: string;
    mac_address: number | string;
    status: string;
    created_at: string;
    updated_at: string;
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
    devices: {
        data: Perangkat[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Perangkat({ devices, filters, pagination }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Perangkat" />
            <div className="px-4 py-6">
                <Heading title="Daftar Perangkat" description="Halaman untuk menambahkan daftar warga sistem" />

                <FormHeader
                    action={'devices.store'}
                />

                <Separator className="my-4" />

                <DataTable
                    devices={devices}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
