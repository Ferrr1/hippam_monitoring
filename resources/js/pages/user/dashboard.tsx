import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard() {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <span className='text-xl font-bold'>Data Monitoring Air</span>
                <div className="grid auto-rows-min gap-4 md:grid-cols-2 2xl:grid-cols-4">
                    <div className="min-w-full border-sidebar-border/70 bg-[#DA3148] text-white flex flex-col items-center justify-between text-center dark:border-sidebar-border aspect-video overflow-hidden rounded-xl border">
                        <span className='xl:p-2 h-fit p-1 bg-[#CC2D43] my-4 rounded-md w-[90%]'>Kekeruhan Air</span>
                        <div className='flex items-end'>
                            <span className='text-6xl font-bold'>75</span>
                            <span className='text-sm'>NTU</span>
                        </div>
                        <span className='xl:p-2 h-fit text-sm p-1 bg-[#CC2D43] my-4 text-white rounded-md w-[90%]'>05-03-2025 18:10:01</span>
                    </div>
                    <div className="border-sidebar-border/70 bg-[#F57B39] text-white flex flex-col items-center justify-between text-center dark:border-sidebar-border aspect-video overflow-hidden rounded-xl border">
                        <span className='xl:p-2 h-fit p-1 bg-[#EA642B] my-4 text-white rounded-md w-[90%]'>Kekeruhan Air</span>
                        <div className='flex items-end'>
                            <span className='text-6xl font-bold'>75</span>
                            <span className='text-sm'>NTU</span>
                        </div>
                        <span className='xl:p-2 h-fit text-sm p-1 bg-[#EA642B] my-4 text-white rounded-md w-[90%]'>05-03-2025 18:10:01</span>
                    </div><div className="border-sidebar-border/70 flex flex-col items-center justify-between text-center dark:border-sidebar-border aspect-video overflow-hidden rounded-xl border">
                        <span className='xl:p-2 h-fit p-1 my-4 bg-accent rounded-md w-[90%]'>Kekeruhan Air</span>
                        <div className='flex items-end'>
                            <span className='text-6xl font-bold'>75</span>
                            <span className='text-sm'>NTU</span>
                        </div>
                        <span className='xl:p-2 h-fit text-sm p-1 my-4 bg-accent rounded-md w-[90%]'>05-03-2025 18:10:01</span>
                    </div><div className="border-sidebar-border/70 flex flex-col items-center justify-between text-center dark:border-sidebar-border aspect-video overflow-hidden rounded-xl border">
                        <span className='xl:p-2 h-fit p-1 my-4 bg-accent rounded-md w-[90%]'>Kekeruhan Air</span>
                        <div className='flex items-end'>
                            <span className='text-6xl font-bold'>75</span>
                            <span className='text-sm'>NTU</span>
                        </div>
                        <span className='xl:p-2 h-fit text-sm p-1 my-4 bg-accent rounded-md w-[90%]'>05-03-2025 18:10:01</span>
                    </div>
                </div>
                <span className='text-xl font-bold'>Status Kondisi Air</span>
                <div className="grid auto-rows-min gap-4 grid-cols-1 md:grid-cols-2">
                    <div className="border-sidebar-border/70 flex flex-col items-center justify-between text-center dark:border-sidebar-border aspect-video overflow-hidden rounded-xl border">
                        <span className='xl:p-2 h-fit p-1 my-4 bg-accent rounded-md w-[90%]'>Output</span>
                        <div className='flex items-end'>
                            <span className='text-4xl font-extrabold uppercase'>waspada</span>
                        </div>
                        <span className='xl:p-2 h-fit text-sm p-1 my-4 bg-accent rounded-md w-[90%]'>05-03-2025 18:10:01</span>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
