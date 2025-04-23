import Header from '@/components/Header';
import InfoSection from '@/components/InfoSection';
import SensorDataCard from '@/components/SensorDataCard';
import StatusPanel from '@/components/StatusPanel';
import useRealtimeSensor from '@/hooks/use-realtime-subscribe';
import AppLayout from '@/layouts/app-layout';
import { SharedData, type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { Droplets, Gauge, FlaskRound as Flask, Waves } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

export default function Dashboard({ devices }) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';
    const deviceIds = ['ESP_MTG', 'ESP_02_FLOW'];
    console.log(devices, auth.user.role)
    const [sensorValue, setSensorValue] = useState({});
    useRealtimeSensor(deviceIds, (deviceId, data) => {
        setSensorValue(prev => ({
            ...prev,
            [deviceId]: data
        }))
    })
    const timestamp = Date.now();
    const date = new Date(timestamp);

    // Menggunakan locale 'id-ID' untuk format waktu Indonesia
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false, // 24 jam
    };

    const formattedDate = date.toLocaleString('id-ID', options).replace(',', '').replace('/', '-').replace('/', '-');
    console.log(sensorValue)

    const monitoringData = [
        {
            id: 1,
            value: 0,
            unit: 'pH',
            location: 'Distribution Line',
            status: 'alert',
            timestamp: formattedDate,
            icon: Flask,
            description: 'Acidity Level'
        },
        {
            id: 2,
            value: 0,
            unit: 'ppm',
            location: 'Distribution Line',
            status: 'moderate',
            timestamp: '2025-03-05 18:10:01',
            icon: Droplets,
            description: 'Total Dissolved Solids'
        },
        {
            id: 3,
            value: 0,
            unit: 'NTU',
            location: 'Distribution Line',
            status: 'good',
            timestamp: '2025-03-05 18:10:01',
            icon: Waves,
            description: 'Turbidity Level'
        },
        {
            id: 4,
            value: 850,
            unit: 'm³/h',
            location: 'Home Line',
            status: 'warning',
            timestamp: '2025-03-05 18:10:01',
            icon: Gauge,
            description: 'Flow Rate'
        }
    ];

    const filteredData = isAdmin ? monitoringData.filter(sensor => sensor.id !== 4) : monitoringData;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="space-y-8 mb-8 p-4">
                <Header />
                <section>
                    <h2 className="text-xl font-semibold dark:text-gray-100 text-slate-700 mb-4">Water Monitoring</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {filteredData.map((data) => (
                            <SensorDataCard key={data.id} data={data} />
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-semibold dark:text-gray-100 text-slate-700 mb-4">Water Condition Status</h2>
                    <StatusPanel status="AMAN" timestamp="2025-03-05 18:10:01" />
                </section>
                <InfoSection />
            </div>
        </AppLayout>
    );
}
