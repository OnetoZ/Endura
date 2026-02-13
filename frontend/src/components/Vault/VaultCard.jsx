import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Lock, Unlock, ShieldCheck } from 'lucide-react';

const VaultCard = ({ item, onUnlock }) => {
    const isLocked = item.status === 'locked';
    const cardRef = useRef(null);

    // 3D Tilt Logic
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`entrance-item relative group rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 border-t border-l border-white/5 ${isLocked
                ? 'bg-black/95 shadow-[inset_0_0_50px_rgba(0,0,0,1)]'
                : 'bg-black/20 neon-border-gold'
                }`}
            onClick={() => isLocked && onUnlock(item)}
        >
            {/* 3D Content Container */}
            <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="relative h-full">

                {/* Image Container */}
                <div className={`relative aspect-[3/4] overflow-hidden ${isLocked ? 'grayscale opacity-30' : ''}`}>
                    <img
                        src={item.image}
                        alt={item.name}
                        className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${!isLocked && 'group-hover:brightness-125'}`}
                    />

                    {/* Static Noise Overlay for Locked Items */}
                    {isLocked && <div className="absolute inset-0 noise-overlay opacity-20" />}

                    {/* Locked UI */}
                    {isLocked && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 z-10">
                            <motion.div
                                animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="p-5 rounded-full bg-black/80 border border-white/10"
                            >
                                <Lock className="w-8 h-8 text-white/40" />
                            </motion.div>
                            <span className="mt-4 text-[10px] font-mono text-white/40 tracking-[0.4em] opacity-80 group-hover:opacity-100 transition-opacity">ENCRYPTED DATA</span>
                        </div>
                    )}

                    {/* Unlocked UI Overlay */}
                    {!isLocked && (
                        <div className="absolute top-4 right-4 z-20">
                            <motion.div
                                initial={{ scale: 0, rotate: -45 }}
                                animate={{ scale: 1, rotate: 0 }}
                                className="bg-accent text-black p-2 rounded-lg shadow-[0_0_15px_rgba(212,175,55,0.6)]"
                            >
                                <Unlock className="w-4 h-4" />
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Content Area */}
                <div className={`p-6 relative z-20 ${isLocked ? 'bg-black/90' : 'bg-gradient-to-t from-black via-black/80 to-transparent pt-12 -mt-12'}`}>
                    <div className="flex justify-between items-start mb-2">
                        <div>
                            <h3 style={{ transform: "translateZ(30px)" }} className={`text-xl font-heading font-black tracking-widest uppercase ${isLocked ? 'text-white/30' : 'text-white text-gold'}`}>
                                {item.name}
                            </h3>
                            <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">{item.collection}</p>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-6">
                        {isLocked ? (
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-pulse" />
                                <span className="text-[9px] font-mono text-white/40 tracking-widest">LOCKED RECORD</span>
                            </div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 py-1 px-3 bg-accent/10 rounded-md border border-accent/30"
                            >
                                <ShieldCheck className="w-3 h-3 text-accent" />
                                <span className="text-[9px] font-bold text-accent tracking-widest uppercase">UNLOCKED</span>
                            </motion.div>
                        )}

                        {!isLocked && (
                            <span className="text-[9px] font-mono text-white/30">{item.code}</span>
                        )}
                    </div>
                </div>

                {/* Cyber HUD elements */}
                <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-white/5 opacity-40" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-white/5 opacity-40" />
                <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-accent/0 group-hover:border-accent/40 transition-all duration-500" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-accent/0 group-hover:border-accent/40 transition-all duration-500" />

                {/* Top Scanner Line (Hover only) */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-accent/40 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden">
                    <motion.div
                        animate={{ x: ['-100%', '100%'] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-20 h-full bg-accent shadow-[0_0_10px_#d4af37]"
                    />
                </div>
            </div>

            {/* Ambient Background Glow for Unlocked Items */}
            {!isLocked && (
                <div className="absolute inset-0 bg-accent/5 blur-[40px] -z-1" />
            )}
        </motion.div>
    );
};

export default VaultCard;
