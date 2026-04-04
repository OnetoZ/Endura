import React from 'react';
import VaultCard from './VaultCard';
import { motion, AnimatePresence } from 'framer-motion';

const VaultGrid = ({ items, onUnlockRequest }) => {
    return (
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 pb-24 min-h-[60vh]">
            <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10"
            >
                <AnimatePresence mode='popLayout'>
                    {items.map((item, index) => (
                        <motion.div
                            layout
                            key={item.id}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                            transition={{
                                delay: index * 0.05,
                                duration: 0.5,
                                ease: [0.23, 1, 0.32, 1],
                                layout: { duration: 0.4 }
                            }}
                        >
                            <VaultCard item={item} onUnlock={onUnlockRequest} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );
};

export default VaultGrid;
