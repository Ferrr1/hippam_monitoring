import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import { Button } from '@/components/ui/button';
import AppLogo from '@/components/app-logo';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import DataTable from './data-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Tagihan',
        href: '/admin/warga',
    },
];

export interface Tagihan {
    tagihan_id: number;
    meter_awal: number;
    meter_akhir: number;
    tanggal_mulai: string;
    tanggal_akhir: string;
    pemakaian: number;
    total_bayar: number;
    status: string;
    tarif: {
        harga: number;
    };
    created_at: string;
    updated_at: string;
}

type TagihanProps = {
    tagihan: Tagihan;
}

export default function Tagihan({ tagihan }: TagihanProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tagihan" />
            <div className="px-4 py-6 flex flex-col gap-4">
                <div className='text-slate-600 dark:text-slate-200 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border shadow-sm rounded-md p-6'>
                    <div className='flex justify-between'>
                        <div className='flex-1'>
                            <Heading title="Tagihan" className='text-blue-500 dark:text-slate-200' />
                            <p className="font-medium tracking-tight text-sm -mt-6">Status :
                                {tagihan && tagihan.status === "belum_lunas" ? (
                                    <span className='px-2 py-1 rounded-md bg-red-100 text-red-700'>Belum Lunas</span>
                                ) : tagihan ? (
                                    <span className='px-2 py-1 rounded-md bg-green-100 text-green-700'>Lunas</span>
                                ) : (
                                    <span className='px-2 py-1 rounded-md bg-gray-700 text-gray-100 dark:bg-gray-100 dark:text-gray-700'>Belum ditetapkan</span>
                                )}
                            </p>
                        </div>
                        <div>
                            <AppLogo />
                        </div>
                    </div>
                    <div className='flex justify-between space-y-2 my-6'>
                        <div className='flex-1'>
                            <p className="font-semibold tracking-tight text-sm">Ditagihkan Kepada : </p>
                            <p className="tracking-tight text-sm">Nama : {user.name}</p>
                            <p className="tracking-tight text-sm"> Email : {user.email}</p>
                            <p className="tracking-tight text-sm">
                                No Telepon : {user?.warga?.no_telp || '-'}
                            </p>
                            <p className="tracking-tight text-sm break-all">
                                Alamat : {user?.warga?.alamat || '-'}
                            </p>
                        </div>
                        <div className='flex-2'>
                            <p className="font-semibold tracking-tight text-sm text-right">Periode</p>
                            <p className="font-medium tracking-tight text-sm text-right">
                                {tagihan ? (
                                    `${tagihan.tanggal_mulai} - ${tagihan.tanggal_akhir}`
                                ) : (
                                    <span className='px-2 py-1 rounded-md bg-gray-700 text-gray-100 dark:bg-gray-100 dark:text-gray-700'>Belum ditetapkan</span>
                                )}
                            </p>
                        </div>
                    </div>
                    <div className='-mt-6'>
                        <p className="font-semibold tracking-tight text-sm">Metode Pembayaran</p>
                        <p className="tracking-tight text-sm">Transfer Manual <span className='font-semibold'>Mandiri</span></p>
                        <p className="tracking-tight text-sm">No. Rekening : <span className='font-semibold'>123456789</span></p>
                        <p className="tracking-tight text-sm">Atas Nama : <span className='font-semibold'>Maulana Feri Setyawan</span></p>
                    </div>
                </div>
                <div className='text-slate-600 dark:text-slate-200 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border shadow-sm rounded-md p-6'>
                    <h3 className="text-xl font-semibold tracking-tight text-blue-500 dark:text-slate-200">Detail</h3>
                    <Separator className="my-2" />
                    <DataTable
                        tagihan={tagihan}
                    />
                    <div>
                        <p className="font-medium tracking-tight text-sm mt-6 text-right">Total Bayar</p>
                        <h2 className="text-xl font-semibold tracking-tight text-right">
                            {`${tagihan?.total_bayar ?? "Rp 0,00"}`}
                        </h2>
                    </div>
                    <div className='flex gap-4 flex-col w-1/2'>
                        <Label htmlFor="picture" className='font-semibold'>Upload Bukti Pembayaran</Label>
                        <Input id="picture" type="file" />
                        <Button className='mt-2'>Upload</Button>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
