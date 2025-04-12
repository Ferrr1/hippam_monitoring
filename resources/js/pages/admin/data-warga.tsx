import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from '@/components/ui/data-table';
import FormHeader from '@/components/form-header';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Data Warga',
        href: '/dashboard',
    },
];



export default function DataWarga() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Data Warga" />
            <div className='px-4 py-6'>
                <Heading title="Data Warga" description="Halaman untuk menambahkan data warga" />
                <FormHeader
                    action={'register.store'}
                    fields={[
                        { name: "name", label: "Nama", type: "text", placeholder: "Nama", required: false },
                        { name: "email", label: "Email", type: "email", placeholder: "Email", required: false },
                        { name: "password", label: "Password", type: "password", placeholder: "Password", required: false },
                        {
                            name: "role",
                            label: "Role",
                            type: "select",
                            placeholder: "Pilih Role",
                            options: [
                                { label: "Admin", value: "admin" },
                                { label: "User", value: "user" },
                            ],
                        },
                    ]}
                />
                <Separator className='my-4' />
                <DataTable
                    columns={[
                        { key: "no", label: "No" },
                        { key: "name", label: "Nama" },
                        { key: "address", label: "Alamat" },
                    ]}
                    data={Array.from({ length: 1000 }, (_, i) => ({
                        no: (i + 1).toString(),
                        name: `John Doe ${i + 1}`,
                        address: `Jakarta ${i + 1}`
                    }))}
                    onEdit={(row) => console.log("Edit", row)}
                    onDelete={(row) => console.log("Delete", row)}
                />

            </div>
        </AppLayout>
    );
}
