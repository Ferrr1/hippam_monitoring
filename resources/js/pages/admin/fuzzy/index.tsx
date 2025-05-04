import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, Sensor, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Perhitungan Fuzzy Mamdani',
        href: '/admin/fuzzy',
    },
];


type Props = {
    sensorDatas: {
        data: Sensor[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Perangkat({ sensorDatas, filters, pagination }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Sensor" />
            <div className="px-4 py-6">
                <Heading title="Data Fuzzy" description="Halaman untuk melihat data dari sensor yang tersimpan didatabase" />

                <Separator className="my-4" />

                <DataTable
                    sensors={sensorDatas}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />

            </div>
        </AppLayout>
    );
}
