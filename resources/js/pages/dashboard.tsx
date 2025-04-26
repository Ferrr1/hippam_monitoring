import Header from '@/components/Header';
import InfoSection from '@/components/InfoSection';
import SensorDataCard from '@/components/SensorDataCard';
import StatusPanel from '@/components/StatusPanel';
import useRealtimeSensor from '@/hooks/use-realtime-subscribe';
import AppLayout from '@/layouts/app-layout';
import { formatFullDateTime } from '@/lib/utils';
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

export default function Dashboard({ devices }: { devices: string[] }) {
    const { auth } = usePage<SharedData>().props;
    const isAdmin = auth.user.role === 'admin';
    // console.log(devices)
    const [sensorValue, setSensorValue] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<string>('');
    useRealtimeSensor(devices,
        (deviceId, data) => {
            setSensorValue(prev => ({
                ...prev,
                [deviceId]: {
                    data,   // Berisi { ph, tds, turbidity }
                }
            }))
        },
        (status) => {
            setStatus(status)
        }
    )

    const monitoringData = [
        {
            id: 1,
            value: sensorValue[devices[0]]?.data.ph || 0, // Ambil pH dari data sensor
            unit: 'pH',
            location: 'Distribution Line',
            status: sensorValue[devices[0]]?.data.ph > 8.5 || sensorValue[devices[0]]?.data.ph < 6 ? 'alert' : 'good',
            timestamp: formatFullDateTime(Date.now()),
            icon: Flask,
            description: 'Acidity Level'
        },
        {
            id: 2,
            value: sensorValue[devices[0]]?.data.tds || 0, // Ambil TDS dari data sensor
            unit: 'ppm',
            location: 'Distribution Line',
            status: sensorValue[devices[0]]?.data.tds > 5 ? 'moderate' : 'good',
            timestamp: formatFullDateTime(Date.now()),
            icon: Droplets,
            description: 'Total Dissolved Solids'
        },
        {
            id: 3,
            value: sensorValue[devices[0]]?.data.turbidity || 0, // Ambil turbidity dari data sensor
            unit: 'NTU',
            location: 'Distribution Line',
            status: sensorValue[devices[0]]?.data.turbidity > 10 ? 'warning' : 'good',
            timestamp: formatFullDateTime(Date.now()),
            icon: Waves,
            description: 'Turbidity Level'
        },
        {
            id: 4,
            value: sensorValue[devices[1]]?.data.volume_m3 || 0,
            unit: 'm³/h',
            location: 'Home Line',
            status: 'moderate',
            timestamp: formatFullDateTime(Date.now()),
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
                    <StatusPanel status={status ?? 'AMAN'} timestamp={formatFullDateTime(Date.now())} />
                </section>
                <InfoSection />
            </div>
        </AppLayout>
    );
}
