
import React from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle2 } from 'lucide-react';

const OrderCard = ({ order }) => {
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'text-green-500';
            case 'processing': return 'text-gold-500 text-accent';
            case 'shipped': return 'text-purple-500';
            default: return 'text-white/60';
        }
    };

    return (
        <motion.div
            whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(147, 112, 219, 0.1)' }}
            className="group relative bg-white/[0.02] border border-white/5 p-8 rounded-2xl transition-all duration-500 hover:border-accent/30"
        >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                {/* Order ID & Meta */}
                <div className="space-y-2">
                    <p className="font-mono text-[10px] text-white/50 tracking-[0.3em] uppercase">Order Hash</p>
                    <h4 className="font-mono text-sm text-white/90 group-hover:text-white transition-colors">
                        {order.id}
                    </h4>
                    <p className="text-[10px] text-white/60 font-body uppercase tracking-[0.1em]">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="font-mono text-[9px] text-white/50 tracking-[0.3em] uppercase mb-1">Status</p>
                        <div className={`flex items-center gap-2 font-heading font-black text-[11px] tracking-[.2em] uppercase ${getStatusColor(order.status)}`}>
                            {order.status === 'processing' && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
                            {order.status}
                        </div>
                    </div>
                </div>

                {/* Items Preview */}
                <div className="flex -space-x-4">
                    {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-12 h-16 rounded-lg border border-white/10 overflow-hidden bg-black shadow-2xl relative group/img">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover grayscale brightness-50 group-hover/img:grayscale-0 group-hover/img:brightness-100 transition-all duration-700" />
                        </div>
                    ))}
                    {order.items.length > 3 && (
                        <div className="w-12 h-16 rounded-lg border border-white/10 bg-white/5 flex items-center justify-center text-[10px] font-mono text-white/40">
                            +{order.items.length - 3}
                        </div>
                    )}
                </div>

                {/* Tracking CTAs */}
                <div className="flex items-center gap-4">
                    <button className="px-6 py-2 border border-white/5 bg-white/5 rounded-full text-[10px] font-heading font-black tracking-[0.2em] text-white/60 hover:text-white hover:border-accent/50 transition-all duration-300">
                        TRACK_SIGNAL
                    </button>
                    <div className="w-10 h-10 rounded-full bg-accent/5 border border-accent/20 flex items-center justify-center text-accent">
                        <Package className="w-4 h-4" />
                    </div>
                </div>
            </div>

            {/* Premium Corner Accent */}
            <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <div className="absolute top-4 right-4 w-px h-4 bg-accent/40" />
                <div className="absolute top-4 right-4 w-4 h-px bg-accent/40" />
            </div>
        </motion.div>
    );
};

export default OrderCard;
