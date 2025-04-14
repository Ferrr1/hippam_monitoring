import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
// import DataTable from '@/pages/admin/pengguna/create/data-table';
import FormHeader from '@/pages/admin/pengguna/create/form-header';
// import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { toast } from 'sonner';
import DataTable from './create/data-table';
// import ConfirmDialog from '@/components/confirm-dialog';
// import FormDialog from '@/pages/admin/pengguna/update/form-dialog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Pengguna',
        href: '/admin/pengguna',
    },
];

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
    updated_at: string;
}
interface Filters {
    search?: string;
    sortBy?: string;
    sortDir?: 'asc' | 'desc';
    perPage?: string;
}
interface Pagination {
    current_page: number;
    per_page: number;
    total: number;
}

type Props = {
    users: {
        data: User[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Pengguna({ users, filters, pagination }: Props) {
    // console.log(`{users}, Pagination From Index: ${JSON.stringify(pagination)}`);
    console.log(users)
    const { flash } = usePage().props as {
        flash?: {
            success?: string;
            error?: string;
        };
    };
    useEffect(() => {
        if (flash?.success) toast.success(flash.success);
        if (flash?.error) toast.error(flash.error);
    }, [flash]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Pengguna" />
            <div className="px-4 py-6">
                <Heading title="Daftar Pengguna" description="Halaman untuk menambahkan pengguna sistem" />

                <FormHeader
                    action={'register.store'}
                    fields={[
                        { name: 'name', label: 'Nama', type: 'text', placeholder: 'Nama' },
                        { name: 'email', label: 'Email', type: 'email', placeholder: 'Email' },
                        { name: 'password', label: 'Password', type: 'password', placeholder: 'Password' },
                        {
                            name: 'role',
                            label: 'Role',
                            type: 'select',
                            placeholder: 'Pilih Role',
                            options: [
                                { label: 'Admin', value: 'admin' },
                                { label: 'User', value: 'user' },
                            ],
                        },
                    ]}
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
