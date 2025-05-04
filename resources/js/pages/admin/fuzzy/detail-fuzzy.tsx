import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { SensorData, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTruncateNumber } from '@/hooks/use-truncate-number';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Fuzzy Data',
        href: '/admin/fuzzy',
    },
    {
        title: 'Detail Perhitungan',
        href: '/admin/fuzzy',
    },
];

type DetailFuzzyProps = {
    sensorData: SensorData
}

export default function DetailFuzzy({ sensorData }: DetailFuzzyProps) {
    const fuzzyMamdani = sensorData.value_fuzzy;
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Perhitungan" />
            <div className='px-4 py-6 gap-2 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12'>
                <div className='flex-2 bg-blue-50 dark:bg-accent border border-blue-100 dark:border-border p-6 rounded-xl'>
                    <div className='flex-1 mb-2'>
                        <Heading className='' title={`Detail Perhitungan Data ID ke ${sensorData.id}`} description="Halaman untuk melihat detail perhitungan fuzzy mamdani menggunakan metode center of gravity" />
                        <div className='space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                            <p>Nilai pH : {sensorData.value['ph']}</p>
                            <p>Nilai TDS : {sensorData.value['tds']}</p>
                            <p>Nilai Turbidity : {sensorData.value['turbidity']}</p>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Fuzzifikasi`} description="Menentukan Nilai Fuzzifikasi" />
                        <div className='flex flex-col xl:flex-row gap-4'>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>pH Basa : {fuzzyMamdani.phBasa}</p>
                                <p>pH Netral : {fuzzyMamdani.phNetral}</p>
                                <p>pH Asam : {fuzzyMamdani.phAsam}</p>
                            </div>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>TDS Rendah : {fuzzyMamdani.tdsRendah}</p>
                                <p>TDS Sedang : {fuzzyMamdani.tdsSedang}</p>
                                <p>TDS Tinggi : {fuzzyMamdani.tdsTinggi}</p>
                            </div>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>Turbidity Jernih : {fuzzyMamdani.turbidityJernih}</p>
                                <p>Turbidity Sedang : {fuzzyMamdani.turbiditySedang}</p>
                                <p>Turbidity Keruh : {fuzzyMamdani.turbidityKeruh}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Rules`} description="Menentukan Nilai Rules Yang Digunakan" />
                        <div className="overflow-auto rounded-md">
                            <div className="inline-block w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="text-center">
                                                <div className="flex items-center justify-center gap-1 text-center">
                                                    Rules
                                                </div>
                                            </TableHead>
                                            <TableHead
                                                className="text-center"
                                            >
                                                <div className="flex items-center justify-center gap-1 text-center">
                                                    Nilai Rules
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {fuzzyMamdani.rules.map((rule, index) => (
                                            <TableRow className="text-center">
                                                <TableCell>{`Rules ${index + 1}`}</TableCell>
                                                <TableCell>{useTruncateNumber(rule)}</TableCell>
                                            </TableRow>
                                        ))
                                        }
                                    </TableBody>
                                </Table>
                                <div />
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Agregasi Output`} description="Menentukan Nilai Agregasi Output" />
                        <div className='flex flex-col xl:flex-row gap-2'>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>Nilai MAX Output Bahaya : {fuzzyMamdani.membershipBahaya}</p>
                                <p>Nilai MAX Output Waspada : {fuzzyMamdani.membershipWaspada}</p>
                                <p>Nilai MAX Output Aman : {fuzzyMamdani.membershipAman}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Himpunan Baru`} description="Menentukan Himpunan Baru" />
                        <div className='flex flex-col xl:flex-row gap-2'>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>Himpunan Bahaya : {fuzzyMamdani.himpunanBahayaBaru}</p>
                                <p>Himpunan Waspada Naik : {fuzzyMamdani.himpunanWaspadaLinearNaikBaru}</p>
                                <p>Himpunan Waspada Turun : {fuzzyMamdani.himpunanWaspadaLinearTurunBaru}</p>
                                <p>Himpunan Aman : {fuzzyMamdani.himpunanAmanBaru}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Deffuzifikasi`} description="Menentukan Nilai Deffuzifikasi Menggunakan Metode COG" />
                        <div className='flex flex-col xl:flex-row gap-2'>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>Momen 1 : {useTruncateNumber(fuzzyMamdani.momen1)}</p>
                                <p>Momen 2 : {useTruncateNumber(fuzzyMamdani.momen2)}</p>
                                <p>Momen 3 : {useTruncateNumber(fuzzyMamdani.momen3)}</p>
                                <p>Area 1 : {useTruncateNumber(fuzzyMamdani.area1)}</p>
                                <p>Area 2 : {useTruncateNumber(fuzzyMamdani.area2)}</p>
                                <p>Area 3 : {useTruncateNumber(fuzzyMamdani.area3)}</p>
                            </div>
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Nilai Deffuzifikasi`} description="Menentukan Nilai Deffuzifikasi Menggunakan Metode COG" />
                        <div className='flex flex-col xl:flex-row gap-2'>
                            <div className='flex-1 space-y-2 bg-blue-200 dark:bg-blue-950 p-4 rounded-md border border-blue-300 dark:border-blue-800'>
                                <p>Nilai Deffuzifikasi : {useTruncateNumber(fuzzyMamdani.result)}</p>
                                <p>Kondisi Air : {sensorData.water_condition}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
