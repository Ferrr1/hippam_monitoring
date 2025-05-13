import { AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";

interface StatusPanelProps {
    status: string;
    timestamp: string;
}

const StatusPanel: React.FC<StatusPanelProps> = ({ status, timestamp }) => {
    const getStatusStyles = (status: string) => {
        const lowercaseStatus = status.toLowerCase();

        if (lowercaseStatus.includes('bahaya') || lowercaseStatus.includes('alert') || lowercaseStatus.includes('danger')) {
            return {
                border: 'border-red-200 dark:border-red-800',
                bg: 'bg-red-50 dark:bg-red-950',
                textInformation: 'text-red-700 dark:text-red-200',
                icon: <AlertTriangle className="h-28 w-28 text-red-500 dark:text-red-200" />,
                message: "Tingkat air melebihi batas yang disarankan di beberapa titik pemantauan. Penyesuaian sistem filtrasi segera diperlukan untuk mencegah masalah lebih lanjut."
            };
        }

        if (lowercaseStatus.includes('waspada') || lowercaseStatus.includes('warning')) {
            return {
                border: 'border-amber-200 dark:border-amber-800',
                bg: 'bg-amber-50 dark:bg-amber-950',
                textInformation: 'text-amber-500 dark:text-amber-200',
                icon: <AlertTriangle className="h-28 w-28 text-amber-500 dark:text-amber-200" />,
                message: "Tingkat air mendekati batas yang disarankan di beberapa titik pemantauan. Pemantauan terus dilakukan, dan penyesuaian mungkin diperlukan."
            };
        }

        return {
            border: 'border-green-200 dark:border-green-800',
            bg: 'bg-green-50 dark:bg-green-950',
            textInformation: 'text-green-500 dark:text-green-200',
            icon: <Info className="h-28 w-28 text-green-500 dark:text-green-200" />,
            message: "Tingkat air berada dalam batas yang disarankan di semua titik pemantauan. Sistem beroperasi dengan normal."
        };
    };

    const styles = getStatusStyles(status);
    const containerVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                when: "beforeChildren",
                staggerChildren: 0.1,
            },
        },
    };

    const childVariants = {
        hidden: { opacity: 0, x: 20 },
        visible: { opacity: 1, x: 0 },
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            whileHover={{ scale: 1.01 }}
            className={`border ${styles.border} rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md ${styles.bg}`}
        >
            <motion.div variants={childVariants} className="p-6">
                <motion.div variants={childVariants} className="flex items-center gap-6">
                    {styles.icon}
                    <motion.div variants={childVariants}>
                        <h3 className={`text-2xl font-semibold ${styles.textInformation}`}>{status}</h3>
                        <p className="mt-2 text-slate-600 dark:text-slate-200">{styles.message}</p>
                    </motion.div>
                </motion.div>

                <motion.div
                    variants={childVariants}
                    className={`mt-6 text-right text-sm ${styles.textInformation}`}
                >
                    Updated: {timestamp}
                </motion.div>
            </motion.div>
        </motion.div>
    );
};

export default StatusPanel;
