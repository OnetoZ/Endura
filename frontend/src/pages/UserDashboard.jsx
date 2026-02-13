
import React, { useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GoldParticles from '../components/Vault/UI/GoldParticles';
import CreditPointsCard from '../components/Dashboard/CreditPointsCard';
import OrderHistory from '../components/Dashboard/OrderHistory';
import ShippingDetails from '../components/Dashboard/ShippingDetails';
import gsap from 'gsap';

const UserDashboard = () => {
    const { currentUser, orders, logout } = useStore();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        // Entrance animations for the main container
        gsap.from(".dashboard-section", {
            opacity: 0,
            y: 40,
            duration: 1.5,
            stagger: 0.3,
            ease: "power4.out"
        });
    }, []);

    if (!currentUser) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center space-y-8">
                <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
                <p className="font-mono text-xs tracking-[0.5em] text-white/40 uppercase">Establishing Secure Connection...</p>
                <button
                    onClick={() => navigate('/auth')}
                    className="px-8 py-3 border border-white/10 text-[10px] font-heading font-black tracking-widest text-accent hover:bg-accent hover:text-black transition-all"
                >
                    RETURN_TO_BASE
                </button>
            </div>
        );
    }

    const userOrders = orders.filter(o => o.userId === currentUser.id);

    return (
        <div className="min-h-screen bg-black text-white selection:bg-accent/30 selection:text-black">

            <main className="relative z-10 pt-44 pb-32 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">

                    {/* Header Section */}
                    <section className="dashboard-section mb-20">
                        <div className="flex flex-col md:flex-row justify-between items-end gap-12 border-b border-white/5 pb-16">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                                    <span className="font-mono text-[10px] text-accent/60 tracking-[0.6em] uppercase">Security_Status: Active</span>
                                </div>
                                <h1 className="text-6xl md:text-8xl font-heading font-black tracking-tighter uppercase leading-none text-white">
                                    Welcome, <span className="text-white/70">{currentUser.name.split('@')[0]}</span>
                                </h1>
                                <p className="text-[11px] font-mono text-white/50 tracking-[0.5em] uppercase font-bold">Archive Rank: {currentUser.operatorRank || 'Initiate'} // NODE_{currentUser.id.slice(0, 8)}</p>
                            </div>

                            <button
                                onClick={() => { logout(); navigate('/'); }}
                                className="group relative px-10 py-4 border border-white/5 bg-white/5 rounded-2xl overflow-hidden transition-all hover:border-red-900/50"
                            >
                                <span className="relative z-10 font-heading font-black tracking-[0.4em] text-[10px] text-white/80 group-hover:text-red-500 transition-colors uppercase">
                                    De-Link_Terminal
                                </span>
                                <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/5 transition-colors" />
                            </button>
                        </div>
                    </section>

                    {/* Credit System Card */}
                    <div className="dashboard-section">
                        <CreditPointsCard credits={currentUser.credits} rank={currentUser.operatorRank} />
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-1 gap-20">
                        {/* Order History */}
                        <div className="dashboard-section">
                            <OrderHistory orders={userOrders} />
                        </div>

                        {/* Shipping Details */}
                        <div className="dashboard-section">
                            <ShippingDetails user={currentUser} />
                        </div>
                    </div>
                </div>
            </main>

            {/* Global Grainy Noise Filter */}
            <div className="fixed inset-0 pointer-events-none z-[300] opacity-[0.03] mix-blend-overlay">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
            </div>
        </div>
    );
};

export default UserDashboard;
