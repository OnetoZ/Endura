
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const CountUp = ({ value }) => {
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        let start = displayValue;
        const end = parseInt(value);
        if (start === end) return;

        let duration = 0.8;
        let startTime = null;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const easing = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            const current = Math.floor(easing * (end - start) + start);
            setDisplayValue(current);
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return <span>{displayValue.toLocaleString()}</span>;
};

const CartSummary = ({ subtotal, total, credits, useCredits, onToggleCredits, onCheckout, isCheckingOut }) => {
    return (
        <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full max-w-xl mx-auto"
        >
            {/* Main Summary Panel */}
            <div className="glass-purple p-8 rounded-[2rem] border border-primary-light/30 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative group overflow-hidden">

                {/* Background Glow Ring */}
                <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary-light/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-primary-light/20 transition-all duration-1000" />
                <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-accent/5 blur-[60px] rounded-full pointer-events-none group-hover:bg-accent/10 transition-all duration-1000" />

                <div className="relative z-10 grid grid-cols-2 gap-8 mb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <span className="w-1 h-1 bg-primary-light rounded-full animate-pulse" />
                            <span className="text-[9px] font-mono text-primary-light/60 uppercase tracking-[0.3em] leading-none">Subtotal_Protocol</span>
                        </div>
                        <div className="text-3xl font-heading text-white/90 tracking-tighter">
                            <span className="text-sm opacity-40 mr-1">₹</span>
                            <CountUp value={subtotal} />
                        </div>
                    </div>

                    <div className="text-right space-y-1">
                        <div className="flex items-center justify-end gap-2">
                            <span className="text-[9px] font-mono text-accent/60 uppercase tracking-[0.3em] leading-none">Net_Manifest</span>
                            <span className="w-1 h-1 bg-accent rounded-full animate-pulse" />
                        </div>
                        <div className="text-4xl font-heading text-accent price-glow tracking-tighter">
                            <span className="text-sm opacity-60 mr-1">₹</span>
                            <CountUp value={total} />
                        </div>
                    </div>
                </div>

                {/* Animated Interactive Belt */}
                <div className="flex flex-col sm:flex-row gap-4">
                    {credits > 0 && (
                        <button
                            onClick={onToggleCredits}
                            className={`flex-1 group/btn relative flex items-center justify-between p-4 rounded-2xl border transition-all duration-500 ${useCredits
                                ? 'bg-primary/20 border-primary-light/50 ring-1 ring-primary-light/20'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full flex items-center justify-center border ${useCredits ? 'border-primary-light' : 'border-gray-600'}`}>
                                    {useCredits && <div className="w-1.5 h-1.5 bg-primary-light rounded-full animate-ping" />}
                                </div>
                                <div className="text-left">
                                    <span className="block text-[8px] font-mono text-gray-500 uppercase tracking-widest">Apply Credits</span>
                                    <span className={`text-[10px] font-heading uppercase tracking-widest ${useCredits ? 'text-primary-light' : 'text-white/60'}`}>
                                        {credits} ENDURA_PTS
                                    </span>
                                </div>
                            </div>
                            <span className={`text-[8px] font-mono font-bold ${useCredits ? 'text-primary-light' : 'text-gray-700'}`}>
                                {useCredits ? 'SYNCED' : 'OFFLINE'}
                            </span>
                        </button>
                    )}

                    <button
                        onClick={onCheckout}
                        disabled={isCheckingOut}
                        className="flex-[1.5] group/checkout relative py-4 bg-white hover:bg-black transition-all duration-700 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-light/20 to-transparent translate-x-[-100%] group-hover/checkout:translate-x-[100%] transition-transform duration-1000" />

                        <div className="relative z-10 flex items-center justify-center gap-4">
                            <span className="text-[11px] font-heading font-black uppercase tracking-[0.4em] text-black group-hover/checkout:text-white transition-colors">
                                {isCheckingOut ? 'Processing...' : 'Transmit Order'}
                            </span>
                            {!isCheckingOut && (
                                <motion.div
                                    animate={{ x: [0, 5, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                >
                                    <svg className="w-5 h-5 text-black group-hover/checkout:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </motion.div>
                            )}
                        </div>
                    </button>
                </div>

                {/* Bottom Diagnostic Tape */}
                <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] font-mono tracking-[0.4em] text-gray-500 uppercase">SYS_LOG: READY</span>
                    <div className="flex gap-4">
                        <span className="text-[7px] font-mono tracking-[0.4em] text-gray-500 uppercase">ENCR: AES-256</span>
                        <span className="text-[7px] font-mono tracking-[0.4em] text-gray-500 uppercase">ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default CartSummary;
