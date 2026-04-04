import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const titles = [
    "RITUAL COMPLETE",
    "ARTIFACT AWAKENED",
    "FORBIDDEN ITEM UNLOCKED"
];

const RewardUnlockOverlay = ({ item, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    const title = useMemo(() => titles[Math.floor(Math.random() * titles.length)], []);

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

    // Pre-calculate ambient embers
    const ambientEmbers = useMemo(() => Array.from({ length: 40 }).map((_, i) => ({
        id: `ember-${i}`,
        x: Math.random() * 100 - 50 + 'vw',
        y: Math.random() * 100 - 50 + 'vh',
        size: Math.random() * 4 + 2,
        delay: Math.random() * 0.5,
        duration: 3 + Math.random() * 2
    })), []);

    // Pre-calculate ember ring for 1000ms burst
    const emberRing = useMemo(() => Array.from({ length: 24 }).map((_, i) => {
        const angle = (i / 24) * Math.PI * 2;
        const dist = 150 + Math.random() * 50;
        return {
            id: `ring-${i}`,
            x: Math.cos(angle) * dist,
            y: Math.sin(angle) * dist,
            size: 3 + Math.random() * 3,
            delay: 1.0 // burst at 1000ms
        };
    }), []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                    transition={{ duration: 0.2 }}
                    className="fixed inset-0 z-[9999] pointer-events-auto flex flex-col items-center justify-center overflow-hidden"
                    style={{
                        background: 'radial-gradient(circle at center, rgba(26,26,29,0.85) 0%, rgba(13,13,15,0.95) 70%)' // Dark charcoal gradient
                    }}
                >
                    {/* Layer 2: Ambient Ember Particles */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        {ambientEmbers.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, x: p.x, y: '50vh', scale: 0.5 }}
                                animate={{ opacity: [0, 0.6, 0], y: '-50vh', scale: [0.5, 1, 0.5] }}
                                transition={{ duration: p.duration, delay: p.delay, ease: "linear", repeat: Infinity }}
                                className="absolute rounded-full bg-[#ff4d4d] shadow-[0_0_8px_#8b0000]"
                                style={{ width: p.size, height: p.size }}
                            />
                        ))}
                    </div>

                    {/* Layer 3: Central Deep Red Mist Beam (300ms) */}
                    <motion.div
                        initial={{ opacity: 0, scaleX: 0 }}
                        animate={{ opacity: [0, 0.6, 0.3], scaleX: [0, 1, 1] }}
                        transition={{ delay: 0.3, duration: 2, ease: "easeOut" }}
                        className="absolute inset-y-0 w-64 md:w-96 bg-gradient-to-r from-transparent via-[#8b0000]/40 to-transparent mix-blend-screen pointer-events-none z-0"
                        style={{ filter: 'blur(40px)' }}
                    />

                    {/* Sparkle Ring Wave (1000ms) */}
                    <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none">
                        <motion.div
                            initial={{ scale: 0, opacity: 0, borderWidth: '2px' }}
                            animate={{ scale: [0, 2, 4], opacity: [0, 1, 0], borderWidth: ['2px', '8px', '2px'] }}
                            transition={{ delay: 1.0, duration: 1.5, ease: "easeOut" }}
                            className="absolute rounded-full border-[#8b0000] mix-blend-screen"
                            style={{ width: 100, height: 100 }}
                        />
                        {emberRing.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
                                animate={{ x: p.x, y: p.y, opacity: [0, 1, 0], scale: [0, 1.5, 0] }}
                                transition={{ delay: p.delay, duration: 1.2, ease: "easeOut" }}
                                className="absolute rounded-full bg-[#ff4d4d] shadow-[0_0_12px_#8b0000]"
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
                                    "0px 0px 0px rgba(139,0,0,0)",
                                    "0px 0px 80px rgba(139,0,0,0.6)",
                                    "0px 0px 40px rgba(139,0,0,0.4)"
                                ]
                            }}
                            transition={{
                                delay: 0.6,
                                duration: 1.4,
                                times: [0, 0.6, 1], // up to 2000ms total elapsed (since 600 + 1400)
                                ease: "easeOut"
                            }}
                            className="relative w-56 lg:w-72 aspect-[3/4] rounded-2xl overflow-hidden border-[1px] border-[#8b0000]/50 bg-black/90 backdrop-blur-md"
                        >
                            {/* Inner Dim Red Glow Pulse */}
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-t from-[#8b0000]/40 to-transparent z-20 pointer-events-none"
                                animate={{ opacity: [0.3, 0.8, 0.3] }}
                                transition={{ delay: 2, duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {item?.image && (
                                <img
                                    src={item.image}
                                    alt={item.name || 'Unlocked Item'}
                                    className="w-full h-full object-cover mix-blend-lighten opacity-90"
                                />
                            )}
                            <div className="absolute bottom-0 inset-x-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />
                            <div className="absolute bottom-6 inset-x-0 text-center z-10">
                                <p className="text-[#ff4d4d] font-heading font-black tracking-[0.2em] uppercase text-lg lg:text-xl drop-shadow-[0_0_15px_rgba(139,0,0,0.9)]">
                                    {item?.name || 'ARTIFACT'}
                                </p>
                            </div>
                        </motion.div>
                    </div>

                    {/* Layer 5: Text and CTA (1300ms) */}
                    <div className="relative z-20 mt-8 flex flex-col items-center justify-center space-y-2">
                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            transition={{ delay: 1.3, duration: 1.2, ease: "easeOut" }}
                            className="text-center relative w-full flex justify-center"
                        >
                            {/* Static soft radial halo behind text */}
                            <div
                                className="absolute inset-0 scale-[2] pointer-events-none"
                                style={{ background: 'radial-gradient(circle, rgba(31,111,94,0.3) 0%, rgba(0,0,0,0) 70%)' }}
                            />
                            <h2
                                className="relative z-10 text-3xl lg:text-5xl font-heading font-bold tracking-[0.2em] uppercase"
                                style={{
                                    color: 'transparent',
                                    backgroundImage: 'linear-gradient(180deg, #3ddc97 0%, #0f3d2e 100%)',
                                    WebkitBackgroundClip: 'text',
                                    filter: 'drop-shadow(0 0 8px rgba(31,111,94,0.8)) drop-shadow(0 0 20px rgba(61,220,151,0.5))'
                                }}
                            >
                                {title}
                            </h2>
                        </motion.div>

                        {/* Subtitle */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1.8, duration: 0.8, ease: "easeOut" }}
                            className="mt-1 relative z-10"
                        >
                            <h3
                                className="text-sm lg:text-base font-body text-[#9aaea4] opacity-85 font-normal tracking-[0.1em] uppercase"
                                style={{ textShadow: "0 0 5px rgba(31,111,94,0.4)" }}
                            >
                                You have collected this item.
                            </h3>
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 2.2, duration: 1 }}
                            className="mt-3 relative z-10"
                        >
                            <button
                                onClick={() => window.location.href = '/collected'}
                                className="relative group px-1 py-1 text-[#3ddc97] font-heading font-medium uppercase tracking-[0.15em] text-xs lg:text-sm transition-colors duration-700 hover:brightness-125"
                            >
                                <span
                                    className="relative z-10 transition-all duration-700"
                                    style={{ textShadow: "0 0 5px rgba(31,111,94,0.6)" }}
                                >
                                    View in User Dashboard
                                </span>
                                {/* Thin glowing underline */}
                                <motion.div
                                    className="absolute bottom-0 left-0 right-0 h-[1px] bg-[#1f6f5e] shadow-[0_0_5px_#1f6f5e] group-hover:bg-[#3ddc97] group-hover:shadow-[0_0_10px_#3ddc97] transition-colors duration-700"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{ delay: 2.5, duration: 1.5, ease: "circOut" }}
                                />
                            </button>
                        </motion.div>
                    </div>

                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default RewardUnlockOverlay;
