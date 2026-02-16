import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CollectionsIntro = ({ onComplete }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onComplete();
        }, 3500); // 1.5-2s brand reveal + transition time
        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                scale: 0.95,
                transition: { duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }
            }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#0a0a0a]"
        >
            {/* Subtle Grain Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

            <div className="relative flex flex-col items-center">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="text-center"
                >
                    <h1 className="text-7xl md:text-9xl font-oswald font-bold tracking-[0.3em] text-white uppercase mb-2">
                        ENDURA
                    </h1>

                    <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
                        className="h-[1px] w-full bg-accent mb-6 origin-center"
                    />

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="text-gray-400 text-sm md:text-lg uppercase tracking-[0.5em] font-medium"
                    >
                        Crafted. Worn. Earned.
                    </motion.p>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute -inset-20 border border-white/5 rounded-full pointer-events-none animate-pulse"></div>
            </div>
        </motion.div>
    );
};

export default CollectionsIntro;
