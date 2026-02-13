import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Shield, User, Clock, ChevronRight } from 'lucide-react';
import gsap from 'gsap';

const AnimatedCounter = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(value);
    const prevValueRef = useRef(value);

    useEffect(() => {
        const obj = { val: prevValueRef.current };
        gsap.to(obj, {
            val: value,
            duration: 1.5,
            ease: "power2.out",
            onUpdate: () => setDisplayValue(Math.floor(obj.val))
        });
        prevValueRef.current = value;
    }, [value]);

    return (
        <div className="relative">
            <span className="text-3xl font-heading font-black text-accent tracking-tighter">
                {displayValue.toLocaleString()}
            </span>
            {/* Brief Gold Pulse behind score */}
            {value !== prevValueRef.current && (
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: [0, 0.4, 0] }}
                    className="absolute inset-0 bg-accent/30 rounded-full blur-xl"
                />
            )}
        </div>
    );
};

const VaultHUD = ({ credits, itemsUnlocked }) => {
    return (
        <div className="fixed top-0 inset-x-0 pointer-events-none z-40 p-12">
            <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="max-w-7xl mx-auto flex justify-between items-start"
            >
                {/* Left Side: Status */}
                <div className="space-y-6">
                    <div className="bg-black/40 backdrop-blur-xl border border-white/5 p-5 rounded-2xl flex items-center gap-5">
                        <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center border border-accent/20">
                            <User className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em]">Vault_Operator</p>
                            <div className="flex items-center gap-2">
                                <p className="text-sm font-heading font-bold text-white tracking-widest uppercase">Agent_Endura</p>
                                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="bg-black/30 backdrop-blur-md border border-white/5 px-4 py-2 rounded-full flex items-center gap-3">
                            <Shield className="w-3 h-3 text-accent" />
                            <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest">Protocol: Ω-ACTIVE</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Credit & Items */}
                <div className="flex gap-6">
                    <div className="bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl flex items-center gap-8 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                        {/* Credit Section */}
                        <div className="text-right">
                            <p className="text-[10px] font-mono text-accent/40 uppercase tracking-[0.4em] mb-1">Credit_Excellence</p>
                            <div className="flex items-center gap-3 justify-end">
                                <Zap className="w-5 h-5 text-accent fill-accent" />
                                <AnimatedCounter value={credits} />
                            </div>
                        </div>

                        <div className="w-px h-12 bg-white/5" />

                        {/* Items Section */}
                        <div className="text-right">
                            <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.4em] mb-1">Archive_Sync</p>
                            <div className="flex items-end gap-1">
                                <span className="text-2xl font-heading font-black text-white">{itemsUnlocked}</span>
                                <span className="text-sm font-heading text-white/20 mb-1">/ 06</span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default VaultHUD;
