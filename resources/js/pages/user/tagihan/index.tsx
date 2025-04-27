import AppLayout from '@/layouts/app-layout';
import { SharedData, Tagihan, type BreadcrumbItem } from '@/types';
import { Head, useForm, usePage } from '@inertiajs/react';
import { Separator } from '@/components/ui/separator';
import Heading from '@/components/heading';
import AppLogo from '@/components/app-logo';
import DataTable from './data-table';
import { useRef, useState } from 'react';
import { ImageUp, LoaderCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Daftar Tagihan',
        href: '/admin/warga',
    },
];


type TagihanProps = {
    tagihan: Tagihan;
}

export default function TagihanUser({ tagihan }: TagihanProps) {
    const { auth } = usePage<SharedData>().props;
    const user = auth.user;

    const { setData, post, processing, reset, errors } = useForm({
        bukti_pembayaran: null as File | null, // Explicitly type the field
    });
    const fileInputRef = useRef<HTMLInputElement>(null);


    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setData('bukti_pembayaran', file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handlePreview = () => {
        fileInputRef.current?.click();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagihan?.tagihan_id) {
            return toast.error("Tagihan tidak ditemukan");
        }

        post(route('proof.payment', tagihan.tagihan_id), {
            forceFormData: true,
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                reset();
                setPreviewUrl(null);
                toast.success("Bukti Pembayaran Berhasil diupload");
            },
            onError: (error) => {
                toast.error("Gagal Mengupload Bukti Pembayaran");
                console.log(error);
            }
        });
    };
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
                    <div className='mb-4'>
                        <p className="font-medium tracking-tight text-sm mt-6 text-right">Total Bayar</p>
                        <h2 className="text-xl font-semibold tracking-tight text-right">
                            {`${tagihan?.total_bayar ?? "Rp 0,00"}`}
                        </h2>
                    </div>
                    <form onSubmit={handleSubmit} className="flex gap-4 flex-col">
                        <Label htmlFor="picture" className='font-semibold'>Upload Bukti Pembayaran</Label>

                        {/* Gambar Preview */}
                        <div
                            className="flex items-center justify-center w-40 h-40 object-cover rounded mt-2 bg-blue-100 dark:bg-blue-950 border border-blue-950 dark:border-blue-100 cursor-pointer overflow-hidden"
                            onClick={handlePreview}
                        >
                            {previewUrl ? (
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover rounded"
                                />
                            ) : tagihan?.bukti_pembayaran ? (
                                <img
                                    src={`/storage/${tagihan.bukti_pembayaran}`}
                                    alt="Bukti Pembayaran"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <ImageUp size={50} className="text-blue-900 dark:text-blue-100" />
                            )}
                        </div>

                        {/* File Input Hidden */}
                        <input
                            id="bukti_pembayaran"
                            type="file"
                            className="hidden"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/jpg, image/jpeg, image/png"
                        />
                        <Button type="submit" className="w-40">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                            Submit
                        </Button>

                        {errors.bukti_pembayaran && (
                            <div className="text-red-500 text-sm">{errors.bukti_pembayaran}</div>
                        )}

                    </form>
                </div>
            </div>
        </AppLayout>
    );
}
