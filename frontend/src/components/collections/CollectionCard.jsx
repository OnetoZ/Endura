
import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CollectionCard = ({ item, type, onRemove, onUpdateQuantity }) => {
    const cardRef = useRef(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePos({ x: 0, y: 0 });
        setIsHovered(false);
    };

    // Card Entry/Exit Animations
    const variants = {
        initial: {
            opacity: 0,
            scale: 0.8,
            rotateX: 45,
            z: -500
        },
        animate: {
            opacity: 1,
            scale: 1,
            rotateX: 0,
            z: 0,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                duration: 0.8
            }
        },
        exit: {
            opacity: 0,
            scale: 0.5,
            rotateY: type === 'digital' ? 90 : -90,
            transition: { duration: 0.4 }
        }
    };

    if (type === 'digital') {
        return (
            <motion.div
                ref={cardRef}
                layout
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
                className="group relative h-[500px] w-full cursor-none"
                style={{ perspective: 1200 }}
            >
                {/* Holographic Digital Container */}
                <motion.div
                    animate={{
                        rotateY: mousePos.x * 25,
                        rotateX: -mousePos.y * 25,
                        z: isHovered ? 50 : 0
                    }}
                    className="relative w-full h-full glass-purple rounded-3xl overflow-hidden flex flex-col p-6 transition-all duration-300 group-hover:shadow-[0_0_80px_rgba(124,58,237,0.3)]"
                >
                    {/* Scanning Line */}
                    <div className="scanning-line" />

                    {/* Spectral Glitch Layer */}
                    <div className="spectral-glitch absolute inset-0 bg-primary/5 pointer-events-none" />

                    {/* Holographic Noise */}
                    <div className="holographic-noise" />

                    {/* Image Area - 3D Floating */}
                    <div className="relative w-full aspect-[4/5] mb-6 overflow-hidden rounded-2xl bg-black/60 shadow-inner group-hover:shadow-[0_0_30px_rgba(124,58,237,0.2)]">
                        <motion.img
                            src={item.image}
                            alt={item.name}
                            animate={{
                                x: mousePos.x * 25,
                                y: mousePos.y * 25,
                                scale: 1.15
                            }}
                            className="w-full h-full object-cover mix-blend-screen opacity-60 group-hover:opacity-100 transition-all filter brightness-110 contrast-125 saturate-150"
                        />

                        {/* Overlay Data Elements */}
                        <div className="absolute inset-0 p-4 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between items-start">
                                <div className="text-[8px] font-mono text-primary-light/60 bg-black/40 px-2 py-1 rounded backdrop-blur-md border border-primary-light/20">
                                    SIG_V.{Math.random().toString(36).substr(2, 4).toUpperCase()}
                                </div>
                                <div className="w-8 h-8 rounded-full border border-primary-light/30 flex items-center justify-center">
                                    <div className="w-1 h-1 bg-primary-light rounded-full animate-ping" />
                                </div>
                            </div>

                            <div className="h-12 w-full bg-gradient-to-t from-primary-light/20 to-transparent flex items-end p-2">
                                <span className="text-[7px] font-mono text-primary-light/80 tracking-[0.2em]">DECRYPTING IDENTITY...</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="relative z-20 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xl font-heading uppercase text-white group-hover:text-primary-light group-hover:tracking-wider transition-all duration-500">{item.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-1.5 h-1.5 bg-primary-light rounded-full shadow-[0_0_8px_var(--primary-light)]" />
                                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest">{item.category}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-2xl font-heading text-primary-light block">₹{item.price}</span>
                                <span className="text-[7px] font-mono text-gray-600">GAS_FEE: 0.00%</span>
                            </div>
                        </div>

                        {/* Animated Controls */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                            <div className="flex items-center gap-4 bg-white/5 rounded-full px-4 py-1.5 border border-white/5">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, -1)}
                                    className="text-primary-light hover:text-white transition-colors"
                                >-</button>
                                <span className="font-mono text-xs w-4 text-center text-white">{item.quantity}</span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, 1)}
                                    className="text-primary-light hover:text-white transition-colors"
                                >+</button>
                            </div>
                            <button
                                onClick={() => onRemove(item.id)}
                                className="group/btn relative px-4 py-2 overflow-hidden"
                            >
                                <span className="relative z-10 text-[9px] font-mono text-red-500/80 group-hover/btn:text-white transition-colors uppercase tracking-widest">Terminate</span>
                                <div className="absolute inset-0 bg-red-500 -translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Custom Cursor Tip */}
                <motion.div
                    animate={{
                        x: mousePos.x * 200 + 100,
                        y: mousePos.y * 200 + 200,
                        opacity: isHovered ? 1 : 0
                    }}
                    className="absolute pointer-events-none z-[100] text-[8px] font-mono text-primary-light bg-black/80 px-2 py-1 rounded border border-primary-light/40"
                >
                    CLICK_TO_VIEW_ASSET
                </motion.div>
            </motion.div>
        );
    }

    // Physical Card System
    return (
        <motion.div
            ref={cardRef}
            layout
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[500px] w-full"
        >
            {/* Luxury Expansion Frame */}
            <div className="luxury-border" />

            {/* Physical Luxury Card */}
            <motion.div
                animate={{
                    y: isHovered ? -10 : 0,
                    rotateY: mousePos.x * 10,
                    rotateX: -mousePos.y * 10,
                }}
                className="relative w-full h-full bg-[#080808] border border-white/10 rounded-sm overflow-hidden flex flex-col p-6 transition-all duration-500 group-hover:border-accent/40 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
            >
                {/* Floating Particles */}
                <div className="particle-container">
                    {[1, 2, 3, 4, 5].map(p => (
                        <div
                            key={p}
                            className="particle"
                            style={{
                                left: `${p * 20}%`,
                                animationDelay: `${p * 0.4}s`,
                                background: 'var(--accent)'
                            }}
                        />
                    ))}
                </div>

                {/* Fabric Texture Layer */}
                <div className="fabric-texture absolute inset-0 pointer-events-none" />

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none">
                    <div className="absolute top-4 right-4 w-4 h-[1px] bg-accent/40" />
                    <div className="absolute top-4 right-4 h-4 w-[1px] bg-accent/40" />
                </div>

                {/* Image Section - Deep Parallax */}
                <div className="relative w-full aspect-[4/5] mb-8 overflow-hidden bg-[#111] border border-white/5">
                    <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000 z-10" />
                    <motion.img
                        src={item.image}
                        alt={item.name}
                        animate={{
                            scale: 1,
                            y: mousePos.y * 15,
                            x: mousePos.x * 15,
                        }}
                        transition={{ type: "spring", stiffness: 50 }}
                        className="w-full h-full object-cover opacity-100 group-hover:scale-110 transition-all duration-1000"
                    />

                    {/* Shadow Mask */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                </div>

                {/* Info Section */}
                <div className="mt-auto space-y-4 relative z-20">
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-heading uppercase tracking-tighter text-white/90 group-hover:text-accent transition-all duration-700">
                                {item.name}
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.3em]">{item.category}</span>
                                <div className="h-[1px] w-8 bg-accent/20" />
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-2xl font-heading text-accent/80 price-glow">₹{item.price}</span>
                            <p className="text-[8px] font-mono text-gray-600 mt-1 uppercase">VAT INCL.</p>
                        </div>
                    </div>

                    {/* Refined Luxury Controls */}
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                        <div className="flex items-center gap-6">
                            <button
                                onClick={() => onUpdateQuantity(item.id, -1)}
                                className="text-gray-600 hover:text-accent transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 12H4" /></svg>
                            </button>
                            <span className="font-heading text-sm text-white/80">{item.quantity}</span>
                            <button
                                onClick={() => onUpdateQuantity(item.id, 1)}
                                className="text-gray-600 hover:text-accent transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 4v16m8-8H4" /></svg>
                            </button>
                        </div>

                        <button
                            onClick={() => onRemove(item.id)}
                            className="group/remove flex items-center gap-2"
                        >
                            <span className="text-[9px] font-heading text-gray-600 group-hover/remove:text-red-500/80 uppercase tracking-[0.4em] transition-all">De-Manifest</span>
                            <div className="w-1 h-1 bg-gray-800 rounded-full group-hover/remove:bg-red-500 transition-colors" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CollectionCard;
