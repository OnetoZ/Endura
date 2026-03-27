import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const OrderSuccess = () => {
    const location = useLocation();
    const { orderId, amount } = location.state || {};

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass p-12 max-w-2xl w-full border-green-500/30 bg-green-500/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />
                <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h2 className="text-4xl font-heading uppercase mb-6 text-white tracking-widest">Order Confirmed</h2>
                <p className="text-gray-400 font-body text-sm mb-4 leading-relaxed">
                    Your payment was successful and your order is now being processed.
                </p>
                {orderId && (
                    <div className="mb-8 space-y-2">
                        <p className="text-gray-400 text-sm">
                            Order ID: <span className="text-green-500 font-mono">{orderId}</span>
                        </p>
                        {amount && (
                            <p className="text-gray-400 text-sm">
                                Amount Paid: <span className="text-accent font-bold">₹{amount}</span>
                            </p>
                        )}
                        <p className="text-gray-400 text-sm">
                            Status: <span className="text-green-500 font-bold uppercase">PAID</span>
                        </p>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <Link to="/collections" className="px-10 py-4 glass border-white/10 text-[10px] font-heading uppercase tracking-widest hover:bg-white/5 transition">
                        Continue Shopping
                    </Link>
                    <Link to="/dashboard" className="px-10 py-4 bg-white text-black text-[10px] font-heading font-black uppercase tracking-widest hover:bg-primary hover:text-white transition shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                        User Dashboard
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccess;
