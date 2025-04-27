import AppLayout from '@/layouts/app-layout';
import { Pagination, SharedData, Tagihan, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import AppLogo from '@/components/app-logo';
import DataTable from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Riwayat Tagihan',
        href: '/user/riwayat-tagihan',
    },
];


type TagihanProps = {
    tagihans: Tagihan[];
    total_tagihan: number;
    total_pemakaian: number;
    pagination: Pagination;
}

export default function RiwayatTagihan({ tagihans, total_tagihan, total_pemakaian, pagination }: TagihanProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Riwayat Tagihan" />
            <div className="px-4 py-6 flex flex-col gap-4">
                <div className='text-slate-600 dark:text-slate-200 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border shadow-sm rounded-md p-6'>
                    <div className='flex justify-between'>
                        <div className='flex-1'>
                            <Heading title="Tagihan" className='text-blue-500 dark:text-slate-200' />
                        </div>
                        <div>
                            <AppLogo />
                        </div>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex-1'>
                            <p className="font-semibold tracking-tight text-sm">Daftar Riwayat Tagihan : </p>
                            <p className="tracking-tight text-sm">Nama : {user.name}</p>
                            <p className="tracking-tight text-sm">Email : {user.email}</p>
                            <p className="tracking-tight text-sm">
                                No Telepon : {user?.warga?.no_telp || '-'}
                            </p>
                            <p className="tracking-tight text-sm break-all">
                                Alamat : {user?.warga?.alamat || '-'}
                            </p>
                        </div>
                    </div>
                </div>
                <div className='text-slate-600 dark:text-slate-200 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border shadow-sm rounded-md p-6'>
                    <h2 className="text-xl font-semibold tracking-tight text-blue-500 dark:text-slate-200">Details</h2>
                    <Separator className="my-2" />
                    <DataTable
                        tagihans={tagihans}
                        pagination={pagination}
                    />
                    <div className='flex justify-end gap-4'>
                        <div>
                            <p className="font-medium tracking-tight text-sm text-right">Total Pemakaian</p>
                            <h2 className="text-xl font-semibold tracking-tight text-right">
                                {tagihans ? `${total_pemakaian} m³` : '-'}
                            </h2>
                        </div>
                        <span className='border-r dark:border-white border-black'></span>
                        <div>
                            <p className="font-medium tracking-tight text-sm text-right">Total Tagihan</p>
                            <h2 className="text-xl font-semibold tracking-tight text-right">
                                {tagihans ? `${total_tagihan}` : '-'}
                            </h2>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
