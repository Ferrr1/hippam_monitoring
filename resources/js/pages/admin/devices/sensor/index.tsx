import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, Sensor, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Perangkat',
        href: '/admin/devices',
    },
    {
        title: 'Data Sensor',
        href: '/admin/devices/sensor',
    },
];


type Props = {
    sensors: {
        data: Sensor[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Perangkat({ sensors, filters, pagination }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sensor" />
            <div className="px-4 py-6">
                <Heading title="Data Sensor" description="Halaman untuk melihat data dari sensor yang tersimpan didatabase" />

                <Separator className="my-4" />

                <DataTable
                    sensors={sensors}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />

            </div>
        </AppLayout>
    );
}
