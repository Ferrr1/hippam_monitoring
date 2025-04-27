import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, Perangkat, User, Warga as Wargas, type BreadcrumbItem } from '@/types';
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

type Props = {
    wargas: {
        data: Wargas[];
    };
    users: User[];
    devices: Perangkat[];
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
