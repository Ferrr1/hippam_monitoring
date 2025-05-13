import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageModal: React.FC<{
    src: string;
    alt: string;
    onClose: () => void;
    isOpen: boolean;
}> = ({ src, alt, onClose, isOpen }) => {
    const [loaded, setLoaded] = useState(false);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex justify-center items-center">
                    {/* Background */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute min-w-screen min-h-screen inset-0 bg-black/70"
                        onClick={onClose}
                    />

                    {/* Gambar */}
                    <motion.div
                        initial={{ scale: 0.3, opacity: 0 }}
                        animate={{
                            scale: 1,
                            opacity: 1,
                            transition: { type: "spring", stiffness: 300, damping: 20 }
                        }}
                        exit={{
                            scale: 0.7,
                            opacity: 0,
                            transition: { duration: 0.5 }
                        }}
                        className="relative w-full max-w-screen-lg max-h-[90vh] p-4 lg:aspect-[16/9] flex justify-center items-center"
                        onClick={onClose}
                    >
                        {!loaded && (
                            <div className="absolute inset-0 flex justify-center items-center">
                                <div className="w-12 h-12 border-4 border-white border-dashed rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={src}
                            alt={alt}
                            onLoad={() => setLoaded(true)}
                            className={`w-fit h-full object-contain rounded-sm shadow-2xl transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"
                                }`}
                        />
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default ImageModal;
