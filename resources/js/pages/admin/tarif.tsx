import Heading from '@/components/heading';
import HeadingSmall from '@/components/heading-small';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Transition } from '@headlessui/react';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Tarif Air',
        href: '/tarif',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Tarif Air" />
            <div className='px-4 py-6 gap-2 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12'>
                <div>
                    <div className='flex-1'>
                        <Heading title="Tarif" description="Halaman untuk mengatur tarif air dan yang sedang digunakan pada Hippam Dusun Medangan" />
                        <HeadingSmall title="Tarif Air Input" description='Form untuk mengatur tarif air' />
                    </div>
                    <div className='grid gap-2 mt-2 flex-1'>
                        <Label>Tarif Air</Label>
                        <Input placeholder="Tarif Air" />
                        <InputError className="mt-2" message='halodek' />
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                        <Button disabled={false}>Simpan</Button>

                        <Transition
                            show={false}
                            enter="transition ease-in-out"
                            enterFrom="opacity-0"
                            leave="transition ease-in-out"
                            leaveTo="opacity-0"
                        >
                            <p className="text-sm text-neutral-600">Tersimpan</p>
                        </Transition>
                    </div>
                </div>
                <div className='flex flex-col gap-8'>
                    <HeadingSmall title="Tarif Air Aktif" description='Keterangan mengenai nilai tarif yang sedang digunakan' />
                    <Heading title={`Rp. 5000 / m3`} />
                </div>
            </div>
        </AppLayout>
    );
}
