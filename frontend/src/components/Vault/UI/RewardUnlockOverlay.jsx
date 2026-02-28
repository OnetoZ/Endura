import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const RewardUnlockOverlay = ({ item, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const fadeOutTimer = setTimeout(() => {
            setIsVisible(false);
        }, 4000);

        const unmountTimer = setTimeout(() => {
            if (onClose) onClose();
        }, 4500); // Allow exit animations to complete

        return () => {
            clearTimeout(fadeOutTimer);
            clearTimeout(unmountTimer);
        };
    }, [onClose]);

    // Pre-calculate ambient particles
    const ambientParticles = Array.from({ length: 40 }).map((_, i) => ({
        id: `ambient-${i}`,
        x: Math.random() * 100 - 50 + 'vw',
        y: Math.random() * 100 - 50 + 'vh',
        size: Math.random() * 4 + 2,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2
    }));

    // Pre-calculate sparkle ring particles for 1000ms burst
    const sparkleRing = Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 150 + Math.random() * 50;
        return {
            id: `sparkle-${i}`,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            size: 3 + Math.random() * 3,
            delay: 1.0 // burst at 1000ms
        };
    });

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(16px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] pointer-events-auto flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(30,20,60,0.4) 0%, rgba(10,5,20,0.9) 100%)' // Dark blue/purple gradient
                    }}
                >
                    {/* Layer 2: Ambient shimmer particles */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        {ambientParticles.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: p.x, y: '50vh', scale: 0.5 }}
                                animate={{ opacity: [0, 0.8, 0], y: '-50vh', scale: [0.5, 1, 0.5] }}
                                transition={{ duration: p.duration, delay: p.delay, ease: "linear", repeat: Infinity }}
                                className="absolute rounded-full bg-[#e2d5f8] shadow-[0_0_8px_#e2d5f8]"
                                style={{ width: p.size, height: p.size }}
                            />
                        ))}
                    </div>

                    {/* Layer 3: Central light beam effect (300ms) */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: [0, 0.8, 0.4], scaleX: [0, 1, 1] }}
                        transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
                        className="absolute inset-y-0 w-64 md:w-96 bg-gradient-to-r from-transparent via-[#ffd700]/20 to-transparent mix-blend-screen pointer-events-none z-0"
                        style={{ filter: 'blur(40px)' }}
                    />

                    {/* Sparkle Ring Wave (1000ms) */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, opacity: 0, borderWidth: '2px' }}
                            animate={{ scale: [0, 2, 4], opacity: [0, 1, 0], borderWidth: ['2px', '10px', '2px'] }}
                            transition={{ delay: 1.0, duration: 1.5, ease: "easeOut" }}
                            className="absolute rounded-full border-[#ffd700] mix-blend-screen"
                            style={{ width: 100, height: 100 }}
                        />
                        {sparkleRing.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                                transition={{ delay: p.delay, duration: 1.2, ease: "easeOut" }}
                                className="absolute rounded-full bg-[#fff9c4] shadow-[0_0_12px_#ffd700]"
                                style={{ width: p.size, height: p.size }}
                            />
                        ))}
                    </div>

                    {/* Layer 4: Revealed animated card (600ms) */}
                    <div className="relative z-10 flex flex-col items-center justify-center perspective-[1000px]">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 50, rotateX: 15 }}
                            animate={{
                                scale: [0.8, 1.05, 1],
                                opacity: [0, 1, 1],
                                y: [50, -5, 0],
                                rotateX: [15, 0, 0],
                                rotateZ: [0, 0, 0],
                                boxShadow: [
                                    "0px 0px 0px rgba(255,215,0,0)",
                                    "0px 0px 80px rgba(255,215,0,0.6)",
                                    "0px 0px 40px rgba(255,215,0,0.4)"
                                ]
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 1.4,
                                times: [0, 0.6, 1], // up to 2000ms total elapsed (since 600 + 1400)
                                ease: "easeOut"
                            }}
                            className="relative w-56 lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-[1px] border-[#ffd700]/50 bg-black/80 backdrop-blur-sm"
                        >
                            {/* Inner Glow Pulse */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-[#ffd700]/30 to-transparent z-20 pointer-events-none"
                                animate={{ opacity: [0.3, 0.7, 0.3] }}
                                transition={{ delay: 2, duration: 3, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {item?.image && (
                                <img
                                    src={item.image}
                                    alt={item.name || 'Unlocked Item'}
                                    className="w-full h-full object-cover mix-blend-lighten"
                                />
                            )}
                            <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />
                            <div className="absolute bottom-6 inset-x-0 text-center z-10">
                                <p className="text-[#ffd700] font-heading font-black tracking-[0.2em] uppercase text-lg lg:text-xl drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                                    {item?.name || 'ARTIFACT'}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Layer 5: Text and CTA (1300ms) */}
                    <div className="relative z-20 mt-12 flex flex-col items-center justify-center space-y-5">
                        <motion.div
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 1.3, duration: 0.8, ease: "easeOut" }}
                            className="text-center"
                        >
                            <h2
                                className="text-3xl lg:text-5xl font-heading font-light tracking-[0.3em] text-[#fff9c4] uppercase drop-shadow-[0_0_20px_rgba(255,215,0,0.5)] mb-3"
                            >
                                🎉 Congratulations 🎉
                            </h2>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
                        >
                            <h3 className="text-sm lg:text-base font-body text-white/80 font-normal tracking-[0.2em] uppercase drop-shadow-lg">
                                You have collected this item!
                            </h3>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2, duration: 1 }}
                            className="mt-6"
                        >
                            <button
                                onClick={() => window.location.href = '/collected'}
                                className="relative group overflow-hidden px-8 py-3 text-[#ffd700] font-heading font-normal uppercase tracking-widest text-xs lg:text-sm hover:text-white transition-colors duration-500"
                            >
                                <span className="relative z-10 drop-shadow-[0_0_5px_rgba(255,215,0,0.3)] group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">View in User Dashboard</span>
                                {/* Elegant underline glow */}
                                <motion.div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#ffd700] to-transparent"
                                    initial={{ width: '0%' }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 2.5, duration: 1, ease: "circOut" }}
                                />
                                <div className="absolute inset-0 bg-[#ffd700]/5 scale-x-0 group-hover:scale-x-100 origin-center transition-transform duration-500 ease-out rounded" />
                            </button>
                        </motion.div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RewardUnlockOverlay;
