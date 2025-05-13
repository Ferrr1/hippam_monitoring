import { Info, Server, } from "lucide-react";
import { motion } from "framer-motion";

export default function InfoSection() {
    const containerVariants = {
        hidden: { opacity: 0, x: 30 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.4,
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
        <div className="mt-8 grid grid-cols-1 gap-6">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.01 }}
                className="rounded-lg border bg-slate-50 dark:bg-accent p-6 transition-all duration-300 hover:shadow-md"
            >
                <motion.div variants={childVariants} className="mb-4 flex items-center gap-3">
                    <Info className="h-5 w-5 text-blue-300 dark:text-slate-50" />
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Application Information</h2>
                </motion.div>

                <motion.div variants={childVariants} className="space-y-4">
                    <motion.div variants={childVariants}>
                        <h3 className="font-medium text-slate-700 dark:text-slate-100">Hippam Monitoring</h3>
                        <p className="mt-1 text-slate-600 dark:text-slate-300">
                            Sistem pemantauan kualitas air canggih ini dirancang untuk menganalisis kualitas air secara real-time, mendeteksi
                            perubahan yang dapat mempengaruhi kesehatan dan lingkungan. Dilengkapi dengan teknologi sensor terkini, sistem ini
                            memantau parameter penting seperti pH, TDS, Turbidity, dan penggunaan air. Tujuannya adalah untuk memastikan
                            keberlanjutan ekosistem, pengelolaan sumber daya air yang lebih baik, dan keselamatan masyarakat.
                        </p>
                    </motion.div>

                    <motion.div variants={childVariants} className="space-y-3 pt-2">
                        <motion.div variants={childVariants} className="flex items-start gap-2">
                            <Server className="mt-0.5 h-4 w-4 text-blue-300 dark:text-slate-50" />
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-100">System Version</p>
                                <p className="font-medium text-sm text-slate-800 dark:text-slate-300">v1.0.0 (Released: Mei 15, 2025)</p>
                            </div>
                        </motion.div>

                        <motion.div variants={childVariants}>
                            <p className="mb-1 text-sm text-slate-600 dark:text-slate-100">Features</p>
                            <ul className="list-inside list-disc space-y-1 text-sm text-slate-800 dark:text-slate-300">
                                <li>Realtime Monitoring Kualitas Air</li>
                                <li>Menentukan Status Kondisi Air Menggunakan Fuzzy Mamdani</li>
                                <li>Terintegrasi Dengan Internet of Things</li>
                                <li>Mengelola Data Tagihan Dengan Mudah</li>
                            </ul>
                        </motion.div>

                        <motion.div
                            variants={childVariants}
                            className="mt-4 rounded-md border border-blue-100 dark:border-blue-800 bg-blue-50 dark:bg-blue-950 p-3"
                        >
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                                <span className="font-medium">Note:</span> Sistem ini dikembangkan oleh Maulana Feri Setyawan.
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </div>
    );
};
