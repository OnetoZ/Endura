
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Package, Truck, MapPin } from 'lucide-react';

const UserDashboard = () => {
    const navigate = useNavigate();
    
    // Dummy data
    const userData = {
        name: "Endura Operator",
        userId: "PGGF3165Q",
        credits: 500,
        tier: "Gold",
        level: 3
    };

    const orders = [
        {
            id: "#1024",
            status: "Shipped",
            eta: "Feb 22, 2026",
            items: ["Obsidian Jacket", "Phantom Hoodie"]
        },
        {
            id: "#1023", 
            status: "Delivered",
            date: "Feb 14, 2026",
            items: ["Diamond Flux Coat"]
        },
        {
            id: "#1022",
            status: "Processing", 
            eta: "Feb 20, 2026",
            items: ["Noir Tactical Vest", "Solar Edge Jacket"]
        }
    ];

    const shippingData = {
        address: "221B Cyber Street\nNeo City, 560001",
        courier: "BlueDart",
        eta: "Feb 22, 2026"
    };

    const getStatusColor = (status) => {
        switch(status) {
            case "Delivered": return "text-green-500";
            case "Shipped": return "text-blue-500";
            case "Processing": return "text-yellow-500";
            default: return "text-gray-500";
        }
    };

    const getTierColor = (tier) => {
        switch(tier) {
            case "Gold": return "text-yellow-500";
            case "Silver": return "text-gray-400";
            case "Bronze": return "text-orange-600";
            default: return "text-gray-500";
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white relative overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
                <div className="absolute inset-0 film-grain opacity-10" />
            </div>

            <div className="relative z-10 container mx-auto max-w-7xl px-6 pt-32 pb-40">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-16"
                >
                    <h1 className="text-6xl md:text-8xl font-heading uppercase tracking-tighter mb-4">
                        OPERATOR <span className="text-accent italic">PROFILE</span>
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">
                        NODE: {userData.userId} // CREDITS: {userData.credits}
                    </p>
                </motion.div>

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - 30-35% */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Credit Balance Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="glass p-8 border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-6 text-gray-400">
                                CREDIT BALANCE
                            </h2>
                            <div className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary mb-4">
                                {userData.credits}
                            </div>
                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-6">
                                Available for redemption
                            </p>
                            {/* Progress Bar */}
                            <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-gradient-to-r from-accent to-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: "70%" }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </motion.div>

                        {/* Rank Status Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="glass p-8 border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-6 text-gray-400">
                                RANK STATUS
                            </h2>
                            <div className="flex items-center gap-4 mb-6">
                                <div className="p-4 bg-white/5 border border-white/10">
                                    <Lock className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <p className={`text-lg font-bold uppercase ${getTierColor(userData.tier)}`}>
                                        {userData.tier} TIER
                                    </p>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">
                                        LEVEL {userData.level} CLEARANCE
                                    </p>
                                </div>
                            </div>
                            <Link 
                                to="/vault"
                                className="block w-full py-3 text-center border border-white/10 text-[10px] font-heading uppercase tracking-widest hover:bg-white/5 hover:text-accent transition-all duration-300"
                            >
                                ACCESS VAULT
                            </Link>
                        </motion.div>
                    </div>

                    {/* Right Column - 65-70% */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order History Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="glass p-8 border border-white/5"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-3">
                                <Package className="w-5 h-5" />
                                ACQUISITION LOGS
                            </h2>
                            <div className="space-y-6">
                                {orders.map((order, index) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                                        className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                    ORDER {order.id}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mt-2">
                                                    {order.items.map((item, i) => (
                                                        <span key={i} className="text-xs text-gray-400">
                                                            {item}{i < order.items.length - 1 && ','}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                    STATUS
                                                </p>
                                                <p className={`text-sm font-bold uppercase ${getStatusColor(order.status)}`}>
                                                    {order.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                                            {order.status === "Delivered" ? `DELIVERED: ${order.date}` : `ETA: ${order.eta}`}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        {/* Shipping Details Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                            className="glass p-8 border border-white/5"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-3">
                                <Truck className="w-5 h-5" />
                                SHIPPING DETAILS
                            </h2>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        ADDRESS
                                    </p>
                                    <p className="text-sm text-white whitespace-pre-line">
                                        {shippingData.address}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                            COURIER
                                        </p>
                                        <p className="text-sm text-white">{shippingData.courier}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                            ETA
                                        </p>
                                        <p className="text-sm text-white">{shippingData.eta}</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
