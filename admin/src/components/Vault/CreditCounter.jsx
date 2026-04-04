import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coins, Zap } from 'lucide-react';

const CreditCounter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => {
            if (displayValue < value) {
                setDisplayValue(prev => Math.min(prev + 5, value));
            } else if (displayValue > value) {
                setDisplayValue(prev => Math.max(prev - 5, value));
            }
        }, 20);
        return () => clearTimeout(timeout);
    }, [value, displayValue]);

    return (
        <div className="flex items-center gap-3 px-6 py-2 rounded-full bg-black/40 border border-accent/30 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,0.15)] group transition-all duration-500 hover:border-accent">
            <div className="relative">
                <Coins className="w-5 h-5 text-accent group-hover:scale-110 transition-transform duration-300" />
                <motion.div
                    animate={displayValue !== value ? { scale: [1, 1.5, 1], opacity: [0, 0.5, 0] } : {}}
                    className="absolute inset-0 bg-accent rounded-full blur-md -z-1"
                />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-mono leading-none mb-1">Total Credits</span>
                <AnimatePresence mode='wait'>
                    <motion.span
                        key={displayValue}
                        initial={{ y: 5, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -5, opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="text-xl font-heading font-black text-white tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                    >
                        {displayValue.toLocaleString()}
                    </motion.span>
                </AnimatePresence>
            </div>
            <Zap className={`w-3 h-3 text-accent transition-all duration-500 ${displayValue !== value ? 'animate-pulse scale-125' : 'opacity-20'}`} />
        </div>
    );
};

export default CreditCounter;
