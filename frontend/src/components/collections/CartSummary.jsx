
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

const CartSummary = ({ 
    baseTotal,
    regularDiscount,
    subtotal, 
    couponDiscount,
    total, 
    onCheckout, 
    isCheckingOut,
    couponCode,
    onCouponChange,
    onApplyCoupon,
    isApplyingCoupon,
    appliedCoupon,
    couponError
}) => {
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

                <div className="relative z-10 space-y-4 mb-10">


                    <div className="flex justify-between items-end px-1 pt-4">
                        <div className="space-y-1">
                            <span className="text-[9px] font-mono text-gray-500 uppercase tracking-[0.4em]">Final_Settlement</span>
                            <div className="text-[7px] text-gray-600 font-mono tracking-widest">TAX_INCLUDED // SHIPPING_FREE</div>
                        </div>
                        <div className="text-5xl font-heading text-white price-glow tracking-tighter">
                            <span className="text-xl opacity-40 mr-1 font-sans">₹</span>
                            <CountUp value={total} />
                        </div>
                    </div>
                </div>

                {/* Coupon Section */}
                <div className="relative z-10 mb-8 p-4 bg-black/40 border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-[0.3em]">COUPON_IDENTIFIER</span>
                        {couponDiscount > 0 && (
                            <span className="text-[8px] font-mono text-accent uppercase tracking-[0.3em] font-bold">SAVINGS: ₹{couponDiscount}</span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="text" 
                            value={couponCode}
                            onChange={(e) => onCouponChange(e.target.value)}
                            disabled={appliedCoupon}
                            placeholder={appliedCoupon ? `APPLIED: ${appliedCoupon.code}` : "ENTER CODE..."}
                            className="flex-1 bg-white/5 border border-white/10 px-4 py-2 text-[10px] font-mono text-white outline-none focus:border-primary-light/30 rounded-xl uppercase tracking-widest disabled:opacity-50"
                        />
                        <button 
                            onClick={onApplyCoupon}
                            disabled={isApplyingCoupon || appliedCoupon || !couponCode}
                            className="px-4 py-2 bg-primary-light/20 hover:bg-primary-light/40 text-primary-light text-[9px] font-black uppercase tracking-widest rounded-xl transition-all disabled:opacity-30"
                        >
                            {isApplyingCoupon ? '...' : (appliedCoupon ? 'OK' : 'APPLY')}
                        </button>
                    </div>
                    {couponError && (
                        <p className="text-[7px] text-red-500 font-mono mt-2 uppercase tracking-widest px-1">{couponError}</p>
                    )}
                </div>

                {/* Animated Interactive Belt */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onCheckout}
                        disabled={isCheckingOut}
                        className="flex-1 group/checkout relative py-4 bg-white hover:bg-black transition-all duration-700 rounded-2xl overflow-hidden shadow-[0_20px_40px_rgba(255,255,255,0.1)]"
                    >
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary-light/20 to-transparent translate-x-[-100%] group-hover/checkout:translate-x-[100%] transition-transform duration-1000" />

                        <div className="relative z-10 flex items-center justify-center gap-4">
                            <span className="text-xs font-heading font-black uppercase tracking-[0.4em] text-black group-hover/checkout:text-white transition-colors">
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
