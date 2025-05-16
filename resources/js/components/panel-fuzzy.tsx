import { motion } from "framer-motion";
import { SensorData } from "@/types";


interface PanelFuzzyProps {
    data: SensorData;
}

const PanelFuzzy: React.FC<PanelFuzzyProps> = ({ data }) => {
    const { value, icon: Icon, description } = data;

    const styles =
    {
        bg: 'bg-blue-50 dark:bg-blue-950',
        text: 'text-blue-700 dark:text-blue-200',
        border: 'border-blue-100 dark:border-blue-800',
        icon: 'text-blue-500 dark:text-blue-200',
        textInformation: 'text-slate-500 dark:text-slate-100'
    };

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
                        {typeof value === "number" ? value.toFixed(4) : value}
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default PanelFuzzy;
