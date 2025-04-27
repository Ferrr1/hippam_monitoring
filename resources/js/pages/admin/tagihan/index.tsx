import AppLayout from '@/layouts/app-layout';
import { Filters, Pagination, Tagihan as Fine, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import DataTable from './create/data-table';
import { Button } from '@/components/ui/button';
import { DatePickerWithPresets } from '@/components/ui/date-picker';
import { useState } from 'react';
import { format } from 'date-fns';
import InputError from '@/components/input-error';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Tagihan',
        href: '/admin/warga',
    },
];


type Props = {
    tagihans: {
        data: Fine[];
    };
    filters: Filters;
    pagination: Pagination;
}

export default function Tagihan({ tagihans, filters, pagination }: Props) {
    const { flash } = usePage().props;
    const [selectedDate, setSelectedDate] = useState<Date>();
    const printReport = () => {
        const periode = selectedDate ? format(selectedDate, "yyyy-MM") : ""
        window.open(`/admin/tagihan/report?periode=${periode}`);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tagihan" />
            <div className="px-4 py-6">
                <Heading title="Daftar Tagihan" description="Halaman untuk menambahkan daftar warga sistem" />
                <div className='flex gap-2'>
                    <DatePickerWithPresets
                        value={selectedDate}
                        onChange={setSelectedDate}
                    />
                    <Button
                        onClick={printReport}
                    >Cetak Laporan</Button>
                </div>
                <InputError message={flash.error} className='mt-2' />
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
