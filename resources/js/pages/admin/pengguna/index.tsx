import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, User, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import FormHeader from '@/pages/admin/pengguna/create/form-header';
import DataTable from './create/data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Pengguna',
        href: '/admin/pengguna',
    },
];


type Props = {
    users: {
        data: User[];
    };
    filters: Filters;
    pagination: Pagination;
    success?: string;
}

export default function Pengguna({ users, filters, pagination, success }: Props) {

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <div className="px-4 py-6">
                <Heading title="Daftar Pengguna" description="Halaman untuk menambahkan pengguna sistem" />

                <FormHeader
                    action={'register.store'}
                    success={success}
                />

                <Separator className="my-4" />

                <DataTable
                    users={users}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
