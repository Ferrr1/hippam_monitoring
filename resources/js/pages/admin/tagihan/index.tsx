import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Tagihan',
        href: '/admin/warga',
    },
];

interface Tagihan {
    tagihan_id: number;
    tanggal_mulai: string;
    tanggal_akhir: string;
    pemakaian: number;
    total_bayar: number;
    warga: {
        user: {
            name: string;
            email: string;
        }
        no_telp: number;
        alamat: string;
    };
    device: {
        device_id: string;
        mac_address: number | string;
        status: string;
    };
    tarif: {
        harga: number;
    };
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
    tagihans: {
        data: Tagihan[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Tagihan({ tagihans, filters, pagination }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tagihan" />
            <div className="px-4 py-6">
                <Heading title="Daftar Tagihan" description="Halaman untuk menambahkan daftar warga sistem" />
                <Button className='mt-2'>Cetak Laporan</Button>
                <Separator className="my-4" />

                <DataTable
                    tagihans={tagihans}
                    pagination={pagination}
                    total={pagination.total}
                    filters={filters}
                />
            </div>
        </AppLayout>
    );
}
