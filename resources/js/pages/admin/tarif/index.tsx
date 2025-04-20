import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarif Air',
        href: '/admin/tarif',
    },
];

type TarifForm = {
    harga: number | null
};

export default function Tarif({ tarif }: { tarif: TarifForm }) {
    const { data, setData, post, errors, processing, recentlySuccessful } = useForm<Required<TarifForm>>({
        harga: null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('tarif.store'), {
            preserveScroll: true,
            onSuccess: () => {
                toast.success("Tarif Air Berhasil diubah/ditambahkan");
            },
            onError: () => {
                toast.error("Gagal Mengubah Tarif Air");
            }
        });
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tarif Air" />
            <div className='px-4 py-6 gap-2 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12'>
                <div>
                    <div className='flex-1'>
                        <Heading title="Tarif" description="Halaman untuk mengatur tarif air dan yang sedang digunakan pada Hippam Dusun Medangan" />
                        <HeadingSmall title="Tarif Air Input" description='Form untuk mengatur tarif air' />
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <div className='grid gap-2 mt-2 flex-1'>
                            <Label>Tarif Air</Label>
                            <Input
                                placeholder="Tarif Air"
                                type='number'
                                value={data.harga!}
                                disabled={processing}
                                onChange={(e) => setData('harga', Number(e.target.value))}
                            />
                            <InputError className="mt-2" message={errors.harga} />
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            <Button disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin mr-2" />}
                                Simpan
                            </Button>

                            <Transition
                                show={recentlySuccessful}
                                enter="transition ease-in-out"
                                enterFrom="opacity-0"
                                leave="transition ease-in-out"
                                leaveTo="opacity-0"
                            >
                                <p className="text-sm text-neutral-600">Tersimpan</p>
                            </Transition>
                        </div>
                    </form>
                </div>
                <div className='flex flex-col gap-8'>
                    <HeadingSmall title={tarif ? "Ubah Tarif Air" : "Tarif Air Input"} description="Form untuk mengatur tarif air" />
                    <Heading title={`${tarif?.harga ?? 0} / m³`} />
                </div>
            </div>
        </AppLayout>
    );
}
