
import React from 'react';
import { motion } from 'framer-motion';

const TypeToggle = ({ activeType, setActiveType }) => {
    return (
        <div className="flex justify-center mb-16 px-4">
            <div className="relative flex p-1 glass border-white/5 rounded-full overflow-hidden w-full max-w-md">
                {/* Animated Background Slider */}
                <motion.div
                    className="absolute inset-y-1 bg-white/10 backdrop-blur-md rounded-full shadow-[0_0_20px_rgba(75,44,145,0.3)] border border-primary/20"
                    initial={false}
                    animate={{
                        left: activeType === 'physical' ? '4px' : '50%',
                        width: 'calc(50% - 4px)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />

                {/* PHYSICAL Button */}
                <button
                    onClick={() => setActiveType('physical')}
                    className={`relative z-10 flex-1 py-3 px-6 text-[11px] font-heading uppercase tracking-[0.2em] transition-colors duration-500 ${activeType === 'physical' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${activeType === 'physical' ? 'bg-accent' : 'bg-gray-700'} transition-all shadow-[0_0_10px_currentColor]`} />
                        Physical Clothing
                    </span>
                </button>

                {/* DIGITAL Button */}
                <button
                    onClick={() => setActiveType('digital')}
                    className={`relative z-10 flex-1 py-3 px-6 text-[11px] font-heading uppercase tracking-[0.2em] transition-colors duration-500 ${activeType === 'digital' ? 'text-white' : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <span className="flex items-center justify-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${activeType === 'digital' ? 'bg-primary-light' : 'bg-gray-700'} transition-all shadow-[0_0_10px_currentColor]`} />
                        Digital Clothing
                    </span>
                </button>
            </div>
        </div>
    );
};

export default TypeToggle;
