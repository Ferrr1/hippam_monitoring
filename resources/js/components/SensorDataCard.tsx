import { SensorData } from '@/types';
import React from 'react';

type MonitoringStatus = 'good' | 'moderate' | 'warning' | 'alert';


interface SensorDataCardProps {
    data: SensorData;
}

const SensorDataCard: React.FC<SensorDataCardProps> = ({ data }) => {
    const { value, unit, location, status, timestamp, icon: Icon, description } = data;

    const getStatusStyles = (status: MonitoringStatus) => {
        switch (status) {
            case 'good':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-950',
                    text: 'text-emerald-700 dark:text-emerald-200',
                    border: 'border-emerald-100 dark:border-emerald-800',
                    icon: 'text-emerald-500 dark:text-emerald-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            case 'moderate':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-950',
                    text: 'text-blue-700 dark:text-blue-200',
                    border: 'border-blue-100 dark:border-blue-800',
                    icon: 'text-blue-500 dark:text-blue-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            case 'warning':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-950',
                    text: 'text-amber-700 dark:text-amber-200',
                    border: 'border-amber-100 dark:border-amber-800',
                    icon: 'text-amber-500 dark:text-amber-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            case 'alert':
                return {
                    bg: 'bg-red-50 dark:bg-red-950',
                    text: 'text-red-700 dark:text-red-200',
                    border: 'border-red-100 dark:border-red-800',
                    icon: 'text-red-500 dark:text-red-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            default:
                return {
                    bg: 'bg-slate-50 dark:bg-accent',
                    text: 'text-slate-700 dark:text-slate-100',
                    border: 'border-slate-100 dark:border-slate-800',
                    icon: 'text-slate-500 dark:text-slate-100',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
        }
    };

    const styles = getStatusStyles(status);

    return (
        <div className={`${styles.bg} rounded-lg border ${styles.border} p-4 transition-all duration-300 hover:shadow-md`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className={`text-sm ${styles.textInformation}`}>{description}</p>
                    <p className={`text-xs ${styles.textInformation}`}>{location}</p>
                </div>
                <Icon className={`h-6 w-6 ${styles.icon}`} />
            </div>

            <div className="mt-2">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${styles.text}`}>{value}</span>
                    <span className={`text-sm ${styles.text}`}>{unit}</span>
                </div>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800">
                <p className={`text-xs ${styles.textInformation}`}>
                    Updated: {(timestamp)}
                </p>
            </div>
        </div>
    );
};

export default SensorDataCard;
