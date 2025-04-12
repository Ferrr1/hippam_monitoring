import { motion, AnimatePresence } from "framer-motion";
import { HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

type InputErrorProps = HTMLMotionProps<"p"> & {
    message?: string;
};

export default function InputError({
    message,
    className = "",
    ...props
}: InputErrorProps) {
    return (
        <AnimatePresence mode="wait">
            {message && (
                <motion.p
                    {...props}
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3 }}
                    className={cn("text-sm text-red-600 dark:text-red-400", className)}
                >
                    {message}
                </motion.p>
            )}
        </AnimatePresence>
    );
}
