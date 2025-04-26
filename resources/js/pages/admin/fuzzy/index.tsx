import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
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
                <Heading title="Data Sensor" description="Halaman untuk melihat data dari sensor yang tersimpan didatabase" />

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
