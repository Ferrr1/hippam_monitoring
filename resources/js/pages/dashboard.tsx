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
    const [sensorValue, setSensorValue] = useState<Record<string, any>>({});
    const [status, setStatus] = useState<string>('');
    useRealtimeSensor(devices,
        (deviceId, data, flow) => {
            setSensorValue(prev => ({
                ...prev,
                [deviceId]: {
                    data,
                    flow   // Berisi { ph, tds, turbidity }
                }
            }))
        },
        (status) => {
            setStatus(status)
        }
    )
    // Function untuk menentukan style/status pH
    const getPhStatus = () => {
        const ph = sensorValue[devices[0]]?.data.ph;

        if (ph === undefined) return 'good';

        if (ph < 6 || ph > 8.5) {
            return 'alert';
        } else if (ph >= 6.5 && ph <= 7.5) {
            return 'good';
        } else {
            return 'warning';
        }
    };

    // Function untuk menentukan style/status TDS
    const getTdsStatus = () => {
        const tds = sensorValue[devices[0]]?.data.tds;

        if (tds === undefined) return 'good';

        if (tds > 800) {
            return 'alert';
        } else if (tds >= 300 && tds <= 800) {
            return 'warning';
        } else {
            return 'good';
        }
    };

    // Function untuk menentukan style/status Turbidity
    const getTurbidityStatus = () => {
        const turbidity = sensorValue[devices[0]]?.data.turbidity;

        if (turbidity === undefined) return 'good';

        if (turbidity > 30) {
            return 'alert';
        } else if (turbidity >= 20 && turbidity <= 30) {
            return 'warning';
        } else {
            return 'good';
        }
    };

    const monitoringData = [
        {
            id: 1,
            value: sensorValue[devices[0]]?.data.ph || 0, // Ambil pH dari data sensor
            unit: 'pH',
            location: 'Distribution Line',
            status: getPhStatus(),
            timestamp: formatFullDateTime(Date.now()),
            icon: Flask,
            description: 'Acidity Level'
        },
        {
            id: 2,
            value: sensorValue[devices[0]]?.data.tds || 0, // Ambil TDS dari data sensor
            unit: 'ppm',
            location: 'Distribution Line',
            status: getTdsStatus(),
            timestamp: formatFullDateTime(Date.now()),
            icon: Droplets,
            description: 'Total Dissolved Solids'
        },
        {
            id: 3,
            value: sensorValue[devices[0]]?.data.turbidity || 0, // Ambil turbidity dari data sensor
            unit: 'NTU',
            location: 'Distribution Line',
            status: getTurbidityStatus(),
            timestamp: formatFullDateTime(Date.now()),
            icon: Waves,
            description: 'Turbidity Level'
        },
        {
            id: 4,
            value: sensorValue[devices[1]]?.flow || 0,
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
                    <StatusPanel status={status || 'AMAN'} timestamp={formatFullDateTime(Date.now())} />
                </section>
                <InfoSection />
            </div>
        </AppLayout>
    );
}
