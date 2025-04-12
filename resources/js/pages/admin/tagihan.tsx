import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tagihan',
        href: '/tagihan',
    },
];

export default function DataWarga() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tagihan" />
            <div className='px-4 py-6'>
                <Heading title="Tagihan" description="Halaman untuk menampilkan data tagihan" />
                <Separator className='my-4' />
                <Button className='mb-4'>Cetak Laporan</Button>
                <DataTable
                    columns={[
                        { key: "no", label: "No" },
                        { key: "name", label: "Nama" },
                        { key: "address", label: "Alamat" },
                    ]}
                    data={[
                        { no: "1", name: "John Doe", address: "Jakarta" },
                        { no: "2", name: "Jane Smith", address: "Bandung" },
                        { no: "3", name: "Alice", address: "Surabaya" },
                    ]}
                    onEdit={(row) => console.log("Edit", row)}
                    onDelete={(row) => console.log("Delete", row)}
                />

            </div>
        </AppLayout>
    );
}
