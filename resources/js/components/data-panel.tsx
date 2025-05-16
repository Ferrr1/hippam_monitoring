import { motion } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { SensorData } from "@/types";


type DataStatus = 'ph' | 'tds' | 'turbidity';
interface DataPanelProps {
    data: SensorData;
}

const DataPanel: React.FC<DataPanelProps> = ({ data }) => {
    const { value, unit, status, icon: Icon, description } = data;

    const getStatusStyles = (status: DataStatus) => {
        switch (status) {
            case 'ph':
                return {
                    bg: 'bg-emerald-50 dark:bg-emerald-950',
                    text: 'text-emerald-700 dark:text-emerald-200',
                    border: 'border-emerald-100 dark:border-emerald-800',
                    icon: 'text-emerald-500 dark:text-emerald-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            case 'tds':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-950',
                    text: 'text-blue-700 dark:text-blue-200',
                    border: 'border-blue-100 dark:border-blue-800',
                    icon: 'text-blue-500 dark:text-blue-200',
                    textInformation: 'text-slate-500 dark:text-slate-100'
                };
            case 'turbidity':
                return {
                    bg: 'bg-amber-50 dark:bg-amber-950',
                    text: 'text-amber-700 dark:text-amber-200',
                    border: 'border-amber-100 dark:border-amber-800',
                    icon: 'text-amber-500 dark:text-amber-200',
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
            whileHover={{ scale: 1.02 }}
            className={`${styles.bg} rounded-lg border ${styles.border} p-4 transition-all duration-300 hover:shadow-md`}
        >
            <motion.div variants={childVariants} className="flex items-start justify-between mb-3">
                <div>
                    <p className={`text-sm ${styles.textInformation}`}>{description}</p>
                </div>
                <Icon className={`h-6 w-6 ${styles.icon}`} />
            </motion.div>

            <motion.div variants={childVariants} className="mt-2">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold ${styles.text}`}>
                        <NumberFlow value={Number(value)} />
                    </span>
                    <span className={`text-sm ${styles.text}`}>{unit}</span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default DataPanel;
