
import React from 'react';
import { useStore } from '../context/StoreContext';
import { useNavigate, Link } from 'react-router-dom';

const UserDashboard = () => {
    const { currentUser, orders, logout } = useStore();
    const navigate = useNavigate();

    // If not logged in or is admin, redirect (admins have their own dashboard)
    if (!currentUser) {
        return (
            <div className="h-screen bg-black flex flex-col items-center justify-center">
                <p className="text-gray-500 mb-4">Establishing Secure Connection...</p>
                <button onClick={() => navigate('/auth')} className="text-primary hover:underline">Return to Signal</button>
            </div>
        );
    }

    const userOrders = orders.filter(o => o.userId === currentUser.id);

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-6">
            <div className="container mx-auto max-w-5xl">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 border-b border-white/10 pb-10">
                    <div>
                        <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase tracking-tighter mb-2">
                            Operator <span className="text-primary italic">Profile</span>
                        </h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">
                            Node: {currentUser.id} // Credits: {currentUser.credits}
                        </p>
                    </div>
                    <button
                        onClick={() => { logout(); navigate('/'); }}
                        className="mt-6 md:mt-0 px-8 py-3 bg-white/5 border border-white/10 hover:border-red-500 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                        De-Sync (Logout)
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Left Panel: Stats */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="glass p-8 border-primary/20 bg-primary/5">
                            <h3 className="text-xl font-oswald font-bold uppercase mb-6 text-white">Credit Balance</h3>
                            <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary-light mb-2">
                                {currentUser.credits}
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-6">Available for Redemption</p>
                            <div className="w-full bg-white/10 h-1 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-[70%]"></div>
                            </div>
                        </div>

                        <div className="p-8 border border-white/5 hover:border-white/10 transition-colors">
                            <h3 className="text-lg font-oswald font-bold uppercase mb-4 text-white">Rank Status</h3>
                            <div className="flex items-center gap-4 mb-4">
                                <div className="p-3 bg-white/5 rounded-full border border-white/10">
                                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white uppercase">{currentUser.operatorRank || 'Initiate'}</p>
                                    <p className="text-[8px] text-gray-600 uppercase tracking-widest">Level 1 Clearance</p>
                                </div>
                            </div>
                            <Link to="/vault" className="block text-center w-full py-3 mt-4 border border-white/10 text-[10px] font-black uppercase tracking-widest hover:bg-white/5 hover:text-accent transition-all">
                                Access Vault
                            </Link>
                        </div>
                    </div>

                    {/* Right Panel: History */}
                    <div className="lg:col-span-2">
                        <h3 className="text-2xl font-oswald font-bold uppercase mb-8 flex items-center gap-4">
                            Acquisition Logs
                            <span className="text-sm text-gray-600 font-mono bg-white/5 px-2 py-1 rounded">{userOrders.length}</span>
                        </h3>

                        <div className="space-y-4">
                            {userOrders.length === 0 ? (
                                <div className="p-12 text-center border border-dashed border-white/10">
                                    <p className="text-gray-500 text-xs uppercase tracking-widest mb-4">No acquisitions detected</p>
                                    <Link to="/collections" className="text-primary hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors">
                                        Browse Inventory
                                    </Link>
                                </div>
                            ) : (
                                userOrders.map(order => (
                                    <div key={order.id} className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all group">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Order Hash</p>
                                                <p className="font-mono text-sm text-white">{order.id}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                                <span className="text-green-500 text-xs font-bold uppercase">{order.status}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-6">
                                            {order.items.map(item => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="w-12 h-16 bg-neutral-900 border border-white/10 overflow-hidden">
                                                        <img src={item.image} className="w-full h-full object-cover grayscale" alt="" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold uppercase">{item.name}</p>
                                                        <p className="text-[10px] text-gray-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex justify-between items-end border-t border-white/5 pt-4">
                                            <div>
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Tracking Signal</p>
                                                <p className="text-xs text-primary animate-pulse">{order.trackingStatus}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Total</p>
                                                <p className="text-lg font-bold text-white">₹{order.total}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
