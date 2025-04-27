import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, Perangkat as Device, type BreadcrumbItem } from '@/types';
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

type Props = {
    devices: {
        data: Device[];
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
