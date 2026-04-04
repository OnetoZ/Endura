import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

const OrderFailed = () => {
    const location = useLocation();
    const { message } = location.state || {};

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white text-center">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="glass p-12 max-w-2xl w-full border-red-500/30 bg-red-500/5 relative overflow-hidden"
            >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent" />
                <div className="w-24 h-24 bg-red-500/20 border border-red-500/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(239,68,68,0.3)]">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                </div>

                <h2 className="text-4xl font-heading uppercase mb-6 text-white tracking-widest">Payment Failed</h2>
                <p className="text-gray-400 font-body text-sm mb-4 leading-relaxed">
                    Something went wrong while processing your payment. {message || 'Please try again or contact support if the issue persists.'}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 mt-10">
                    <Link to="/cart" className="px-10 py-4 glass border-white/10 text-[10px] font-heading uppercase tracking-widest hover:bg-white/5 transition">
                        Back to Cart
                    </Link>
                    <Link to="/collections" className="px-10 py-4 bg-white text-black text-[10px] font-heading font-black uppercase tracking-widest hover:bg-primary-dark hover:text-white transition">
                        Browse Products
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderFailed;
