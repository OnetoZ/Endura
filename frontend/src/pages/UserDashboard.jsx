import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Package, MapPin, Phone, User, Mail, Save } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { authService } from '../services/api';

const UserDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, loginWithToken } = useStore();

    const [editMode, setEditMode] = useState(false);
    const [nameMode, setNameMode] = useState(false);
    const [avatarMode, setAvatarMode] = useState(false);
    const [phoneMode, setPhoneMode] = useState(false);
    const [newName, setNewName] = useState(currentUser?.username || '');
    const [newAvatar, setNewAvatar] = useState(currentUser?.avatar || '');
    const [newPhone, setNewPhone] = useState(currentUser?.phone || '');
    const [isSaving, setIsSaving] = useState(false);
    const [expandedOrders, setExpandedOrders] = useState(new Set());
    const [showAddressNotification, setShowAddressNotification] = useState(false);
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    // Fetch user orders
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await authService.getUserOrders();
                setOrders(response.data || []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                // Use mock data as fallback
                setOrders([
                    {
                        _id: "1024",
                        status: "Shipped",
                        trackingId: "TRK1024",
                        items: [
                            { name: "Obsidian Jacket", quantity: 1, price: 299 },
                            { name: "Phantom Hoodie", quantity: 1, price: 199 }
                        ],
                        totalAmount: 498,
                        createdAt: "2026-02-15T10:30:00Z",
                        estimatedDelivery: "Feb 22, 2026"
                    },
                    {
                        _id: "1023",
                        status: "Delivered",
                        items: [
                            { name: "Diamond Flux Coat", quantity: 1, price: 599 }
                        ],
                        totalAmount: 599,
                        createdAt: "2026-02-10T14:20:00Z",
                        deliveredAt: "Feb 14, 2026"
                    },
                    {
                        _id: "1022",
                        status: "Processing",
                        items: [
                            { name: "Noir Tactical Vest", quantity: 1, price: 449 },
                            { name: "Solar Edge Jacket", quantity: 1, price: 399 }
                        ],
                        totalAmount: 848,
                        createdAt: "2026-02-18T09:15:00Z",
                        estimatedDelivery: "Feb 20, 2026"
                    }
                ]);
            } finally {
                setLoadingOrders(false);
            }
        };

        if (currentUser) {
            fetchOrders();
        }
    }, [currentUser]);

    const shippingData = {
        address: currentUser?.addresses?.[0] ? 
            `${currentUser.addresses[0].fullName}\n${currentUser.addresses[0].address}\n${currentUser.addresses[0].city}, ${currentUser.addresses[0].postalCode}\n${currentUser.addresses[0].country}` : 
            "No address set",
        phone: currentUser?.phone || "Not set",
    };

    // Check if address or phone is missing for notification
    useEffect(() => {
        const isAddressMissing = !currentUser?.addresses || currentUser.addresses.length === 0;
        const isPhoneMissing = !currentUser?.phone || currentUser.phone.trim() === '';
        setShowAddressNotification(isAddressMissing || isPhoneMissing);
    }, [currentUser]);

    const toggleOrderDetails = (orderId) => {
        setExpandedOrders(prev => {
            const newSet = new Set(prev);
            if (newSet.has(orderId)) {
                newSet.delete(orderId);
            } else {
                newSet.add(orderId);
            }
            return newSet;
        });
    };

    // Initial load/redirect
    useEffect(() => {
        if (!currentUser) {
            navigate('/auth');
        } else if (currentUser.role === 'admin') {
            navigate('/admin');
        } else {
            setNewName(currentUser.username || '');
            setNewAvatar(currentUser.avatar || '');
            setNewPhone(currentUser.phone || '');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    // Derived data mapping
    const userData = {
        name: currentUser?.username || currentUser?.name || "Endura Operator",
        userId: currentUser?._id ? currentUser._id.slice(-8).toUpperCase() : "UNKNOWN",
        credits: currentUser?.credits || 0,
        tier: currentUser?.credits >= 1000 ? "Gold" : currentUser?.credits >= 500 ? "Silver" : "Bronze",
        level: currentUser?.credits >= 1000 ? 3 : currentUser?.credits >= 500 ? 2 : 1,
        email: currentUser?.email,
        phone: currentUser?.phone || "Not set",
        avatar: currentUser?.avatar,
        profileCompletion: currentUser?.profileCompletion || 0,
        totalOrders: currentUser?.totalOrders || 0,
        totalSpent: currentUser?.totalSpent || 0,
        referralCode: currentUser?.referralCode,
        status: currentUser?.status || 'active'
    };

    const handleSaveProfile = async () => {
        setIsSaving(true);
        try {
            const payload = {};
            if (nameMode) payload.username = newName;
            if (avatarMode) payload.avatar = newAvatar;
            if (phoneMode) payload.phone = newPhone;

            const updatedData = await authService.updateProfile(payload);

            // Sync completely with backend response
            await loginWithToken(updatedData);
            setEditMode(false);
            setNameMode(false);
            setAvatarMode(false);
            setPhoneMode(false);

        } catch (error) {
            console.error("Failed to update profile", error);
            // Revert on error
            setNewName(currentUser.username || '');
            setNewAvatar(currentUser.avatar || '');
            setNewPhone(currentUser.phone || '');
        } finally {
            setIsSaving(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case "Delivered": return "text-green-500";
            case "Shipped": return "text-blue-500";
            case "Processing": return "text-yellow-500";
            default: return "text-gray-500";
        }
    };

    const getTierColor = (tier) => {
        switch (tier) {
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
                    {userData.avatar ? (
                        <div className="mx-auto w-24 h-24 mb-6 rounded-sm border border-primary/40 p-1 opacity-80 hover:opacity-100 transition-opacity">
                            <img src={userData.avatar} alt="Profile" className="w-full h-full object-cover grayscale opacity-80 mix-blend-screen" />
                        </div>
                    ) : (
                        <div className="mx-auto w-16 h-16 mb-6 rounded-sm border border-primary/40 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                            <span className="text-2xl text-primary font-black">{userData.name.charAt(0)}</span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-tighter mb-4">
                        {userData.name}
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

                        {/* Profile Settings Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="glass p-8 border border-white/5 hover:border-primary/30 transition-all duration-300"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-6 text-gray-400">
                                IDENTIFICATION
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <User className="w-3 h-3" /> USERNAME
                                    </p>

                                    {nameMode ? (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={newName}
                                                onChange={(e) => setNewName(e.target.value)}
                                                placeholder="Operator Name"
                                                className="w-full bg-white/5 border border-white/10 px-3 py-2 focus:border-primary outline-none text-xs font-mono"
                                            />
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="p-2 bg-primary/20 border border-primary/50 text-white hover:bg-primary/40 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm font-mono text-white/80">{userData.name}</p>
                                            <button
                                                onClick={() => { setNameMode(true); setAvatarMode(false); setPhoneMode(false); }}
                                                className="text-[10px] font-mono text-primary uppercase tracking-widest hover:text-accent"
                                            >
                                                [ REDEFINE ]
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Mail className="w-3 h-3" /> EMAIL
                                    </p>
                                    <p className="text-sm font-mono text-white/80">{userData.email}</p>
                                </div>

                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <User className="w-3 h-3" /> AVATAR URL
                                    </p>

                                    {avatarMode ? (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={newAvatar}
                                                onChange={(e) => setNewAvatar(e.target.value)}
                                                placeholder="https://..."
                                                className="w-full bg-white/5 border border-white/10 px-3 py-2 focus:border-primary outline-none text-xs font-mono"
                                            />
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="p-2 bg-primary/20 border border-primary/50 text-white hover:bg-primary/40 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm font-mono text-white/80 truncate max-w-[220px]">{userData.avatar || 'Not set'}</p>
                                            <button
                                                onClick={() => { setAvatarMode(true); setNameMode(false); setPhoneMode(false); }}
                                                className="text-[10px] font-mono text-primary uppercase tracking-widest hover:text-accent"
                                            >
                                                [ REDEFINE ]
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
                                        <Phone className="w-3 h-3" /> SECURE COMMLINK
                                    </p>

                                    {phoneMode ? (
                                        <div className="flex items-center gap-2 mt-2">
                                            <input
                                                type="text"
                                                value={newPhone}
                                                onChange={(e) => setNewPhone(e.target.value)}
                                                placeholder="+XX XXXXX-XXXX"
                                                className="w-full bg-white/5 border border-white/10 px-3 py-2 focus:border-primary outline-none text-xs font-mono"
                                            />
                                            <button
                                                onClick={handleSaveProfile}
                                                disabled={isSaving}
                                                className="p-2 bg-primary/20 border border-primary/50 text-white hover:bg-primary/40 transition-colors"
                                            >
                                                <Save className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between mt-1">
                                            <p className="text-sm font-mono text-white/80">{userData.phone}</p>
                                            <button
                                                onClick={() => { setPhoneMode(true); setNameMode(false); setAvatarMode(false); }}
                                                className="text-[10px] font-mono text-primary uppercase tracking-widest hover:text-accent"
                                            >
                                                [ REDEFINE ]
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
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
                                {loadingOrders ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm">Loading orders...</p>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm">No orders found</p>
                                    </div>
                                ) : (
                                    orders.map((order, index) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                                            className="p-6 bg-white/[0.02] border border-white/5 hover:border-primary/30 transition-all duration-300"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                        ORDER #{order._id}
                                                    </p>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {order.items?.map((item, i) => (
                                                            <span key={i} className="text-xs text-gray-400">
                                                                {item.name}{item.quantity > 1 ? ` (${item.quantity})` : ''}{i < order.items.length - 1 && ','}
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
                                            <div className="flex items-center justify-between mt-4">
                                                <div className="text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                                                    {order.status === "Delivered" ? `DELIVERED: ${new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}` : `ETA: ${order.estimatedDelivery || 'TBD'}`}
                                                </div>
                                                <button 
                                                    onClick={() => toggleOrderDetails(order._id)}
                                                    className="px-4 py-2 border border-white/15 text-[9px] font-heading uppercase tracking-[0.25em] hover:border-primary hover:text-primary transition-all"
                                                >
                                                    {expandedOrders.has(order._id) ? 'Hide Details' : 'Order Details'}
                                                </button>
                                            </div>
                                            {expandedOrders.has(order._id) && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="mt-4 pt-4 border-t border-white/10"
                                                >
                                                    <div className="space-y-3">
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Order ID</p>
                                                            <p className="text-sm font-mono text-white">#{order._id}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Items</p>
                                                            <div className="space-y-1">
                                                                {order.items?.map((item, i) => (
                                                                    <div key={i} className="flex justify-between text-sm">
                                                                        <span className="text-gray-300">• {item.name}</span>
                                                                        <span className="text-gray-400">Qty: {item.quantity} × ${item.price}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                                            <p className="text-sm font-mono text-primary">${order.totalAmount}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Status</p>
                                                            <p className={`text-sm font-bold uppercase ${getStatusColor(order.status)}`}>
                                                                {order.status}
                                                            </p>
                                                        </div>
                                                        {order.trackingId && (
                                                            <div>
                                                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Tracking ID</p>
                                                                <p className="text-sm font-mono text-white">{order.trackingId}</p>
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">
                                                                {order.status === "Delivered" ? "Delivery Date" : "Estimated Delivery"}
                                                            </p>
                                                            <p className="text-sm text-gray-300">
                                                                {order.status === "Delivered" 
                                                                    ? new Date(order.deliveredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                                                                    : order.estimatedDelivery || 'TBD'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </motion.div>

                        {/* Address / Contact Panel */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.0 }}
                            className="glass p-8 border border-white/5"
                        >
                            <h2 className="text-xl font-heading uppercase tracking-widest mb-8 text-gray-400 flex items-center gap-3">
                                <MapPin className="w-5 h-5" />
                                ADDRESS BOOK
                            </h2>
                            
                            {/* Notification for missing address/phone */}
                            {showAddressNotification && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center mt-0.5">
                                            <span className="text-yellow-500 text-xs font-bold">!</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-mono text-yellow-500 uppercase tracking-widest mb-1">
                                                Action Required
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {!shippingData.address || shippingData.address.trim() === '' ? '• Add address ' : ''}
                                                {(!shippingData.address || shippingData.address.trim() === '') && 
                                                 (!shippingData.phone || shippingData.phone === 'Not set' || shippingData.phone.trim() === '') ? '& ' : ''}
                                                {!shippingData.phone || shippingData.phone === 'Not set' || shippingData.phone.trim() === '' ? '• Add phone number' : ''}
                                                to complete your profile
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                        PRIMARY ADDRESS
                                    </p>
                                    <p className="text-sm text-white whitespace-pre-line">
                                        {shippingData.address}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-2">
                                        MOBILE
                                    </p>
                                    <p className="text-sm text-white">
                                        {shippingData.phone}
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-4 pt-2">
                                    <button className="px-5 py-2 border border-white/15 text-[10px] font-heading uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                        Edit Address
                                    </button>
                                    <button className="px-5 py-2 border border-white/15 text-[10px] font-heading uppercase tracking-widest hover:border-primary hover:text-primary transition-all">
                                        Add Address
                                    </button>
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
