import Heading from '@/components/heading';
import AppLayout from '@/layouts/app-layout';
import { SensorData, type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTruncateNumber } from '@/hooks/use-truncate-number';
import { Droplets, FlaskRound as Flask, Waves, MoveUpRight, Grid2x2, MoveDownLeft, Aperture, AlertTriangle, Info } from 'lucide-react';
import DataPanel from '@/components/data-panel';
import PanelFuzzy from '@/components/panel-fuzzy';

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
    const ListData = [
        {
            id: 1,
            value: sensorData.value['ph'] || 0,
            unit: 'pH',
            status: 'ph',
            icon: Flask,
            description: 'Acidity Level'
        },
        {
            id: 2,
            value: sensorData.value['tds'] || 0,
            unit: 'ppm',
            status: 'tds',
            icon: Droplets,
            description: 'Total Dissolved Solids'
        },
        {
            id: 3,
            value: sensorData.value['turbidity'] || 0,
            unit: 'NTU',
            status: 'turbidity',
            icon: Waves,
            description: 'Turbidity Level'
        },
    ];

    const FuzzifikasiData = [
        {
            id: 1,
            value: fuzzyMamdani.ph.phBasa || 0,
            icon: Flask,
            description: 'pH Basa'
        },
        {
            id: 2,
            value: fuzzyMamdani.ph.phNetral || 0,
            icon: Flask,
            description: 'pH Netral'
        },
        {
            id: 3,
            value: fuzzyMamdani.ph.phAsam || 0,
            icon: Flask,
            description: 'pH Asam'
        },
        {
            id: 4,
            value: fuzzyMamdani.tds.tdsRendah || 0,
            icon: Droplets,
            description: 'TDS Rendah'
        },
        {
            id: 5,
            value: fuzzyMamdani.tds.tdsSedang || 0,
            icon: Droplets,
            description: 'TDS Sedang'
        },
        {
            id: 6,
            value: fuzzyMamdani.tds.tdsTinggi || 0,
            icon: Droplets,
            description: 'TDS Tinggi'
        },
        {
            id: 7,
            value: fuzzyMamdani.turbidity.turbidityJernih || 0,
            icon: Waves,
            description: 'Turbidity Jernih'
        },
        {
            id: 8,
            value: fuzzyMamdani.turbidity.turbiditySedang || 0,
            icon: Waves,
            description: 'Turbidity Sedang'
        },
        {
            id: 9,
            value: fuzzyMamdani.turbidity.turbidityKeruh || 0,
            icon: Waves,
            description: 'Turbidity Keruh'
        },
    ];

    const AgregasiData = [
        {
            id: 1,
            value: fuzzyMamdani.membership.membershipBahaya || 0,
            icon: AlertTriangle,
            description: 'Membership Bahaya'
        },
        {
            id: 2,
            value: fuzzyMamdani.membership.membershipWaspada || 0,
            icon: AlertTriangle,
            description: 'Membership Waspada'
        },
        {
            id: 3,
            value: fuzzyMamdani.membership.membershipAman || 0,
            icon: Info,
            description: 'Membership Aman'
        },
    ];

    const HimpunanData = [
        {
            id: 1,
            value: fuzzyMamdani.himpunan.himpunanBahayaBaru || 0,
            icon: AlertTriangle,
            description: 'Himpunan Bahaya'
        },
        {
            id: 2,
            value: fuzzyMamdani.himpunan.himpunanWaspadaLinearNaikBaru || 0,
            icon: MoveUpRight,
            description: 'Himpunan Waspada Naik'
        },
        {
            id: 3,
            value: fuzzyMamdani.himpunan.himpunanWaspadaLinearTurunBaru || 0,
            icon: MoveDownLeft,
            description: 'Himpunan Waspada Turun'
        },
        {
            id: 4,
            value: fuzzyMamdani.himpunan.himpunanAmanBaru || 0,
            icon: Info,
            description: 'Himpunan Aman'
        },
    ];

    const DeffuzifikasiData = [
        {
            id: 1,
            value: fuzzyMamdani.momen.momen1 || 0,
            icon: Aperture,
            description: 'Momen 1'
        },
        {
            id: 2,
            value: fuzzyMamdani.momen.momen2 || 0,
            icon: Aperture,
            description: 'Momen 2'
        },
        {
            id: 3,
            value: fuzzyMamdani.momen.momen3 || 0,
            icon: Aperture,
            description: 'Momen 3'
        },
        {
            id: 4,
            value: fuzzyMamdani.area.area1 || 0,
            icon: Grid2x2,
            description: 'Area 1'
        },
        {
            id: 5,
            value: fuzzyMamdani.area.area2 || 0,
            icon: Grid2x2,
            description: 'Area 2'
        },
        {
            id: 6,
            value: fuzzyMamdani.area.area3 || 0,
            icon: Grid2x2,
            description: 'Area 3'
        },
    ];

    const ValueFuzzyData = [
        {
            id: 1,
            value: fuzzyMamdani.result || 0,
            icon: Waves,
            description: 'Nilai Fuzzy'
        },
        {
            id: 2,
            value: sensorData.water_condition || 0,
            icon: Droplets,
            description: 'Kondisi Air'
        },
    ];
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Detail Perhitungan" />
            <div className='px-4 py-6 gap-2 flex flex-col lg:flex-row space-y-8 lg:space-y-0 lg:space-x-12'>
                <div className='flex-2 shadow-md p-6 rounded-xl'>
                    <div className='flex-1 mb-2'>
                        <Heading className='' title={`Detail Perhitungan Data ID ke ${sensorData.id}`} description="Halaman untuk melihat detail perhitungan fuzzy mamdani menggunakan metode center of gravity" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {ListData.map((data) => (
                                <DataPanel key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Fuzzifikasi`} description="Menentukan Nilai Fuzzifikasi" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {FuzzifikasiData.map((data) => (
                                <PanelFuzzy key={data.id} data={data} />
                            ))}
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
                                            <TableRow className="text-center" key={rule + index}>
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
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AgregasiData.map((data) => (
                                <PanelFuzzy key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Himpunan Baru`} description="Menentukan Himpunan Baru" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {HimpunanData.map((data) => (
                                <PanelFuzzy key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Deffuzifikasi`} description="Menentukan Nilai Deffuzifikasi Menggunakan Metode COG" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {DeffuzifikasiData.map((data) => (
                                <PanelFuzzy key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                    <div className='flex-1 mb-2'>
                        <Heading title={`Nilai Deffuzifikasi`} description="Menentukan Nilai Deffuzifikasi Menggunakan Metode COG" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {ValueFuzzyData.map((data) => (
                                <PanelFuzzy key={data.id} data={data} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
