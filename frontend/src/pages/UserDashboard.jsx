import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Package, MapPin, Phone, User, Mail, Save, Image as ImageIcon, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { authService, assetService, orderService, getImageUrl, vaultService } from '../services/api';
import { AnimatePresence } from 'framer-motion';

const tierAccent = (tier) => {
    switch (tier?.toLowerCase()) {
        case 'legendary': return '#ff00ff';
        case 'epic': return '#ff0055';
        case 'rare': return '#00d4ff';
        default: return '#d4af37';
    }
};

const DressItem = ({ item, vaultReady }) => {
    const [isHovered, setIsHovered] = useState(true);
    const accent = tierAccent(item.tier);
    return (
        <div className="relative w-full h-full bg-black overflow-hidden group/dress border border-white/10 rounded-xl"
            style={{
                boxShadow: `inset 0 0 60px 10px ${accent}18`,
                background: `radial-gradient(circle at center, transparent 40%, ${accent}08 100%)`
            }}>
            <div className="relative w-full h-full flex flex-col items-center justify-center p-8 overflow-visible">
                <motion.div className="relative z-10 w-full h-full flex items-center justify-center overflow-visible"
                    animate={vaultReady ? { y: [-8, 8, -8] } : {}}
                    transition={{ y: { duration: 4, repeat: Infinity, ease: "easeInOut" } }}>
                    <img src={getImageUrl(item.backImageUrl || item.backImage || item.image)}
                        alt={item.name} className="w-full h-full object-contain block transition-transform duration-700"
                        style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }} />
                </motion.div>
                <AnimatePresence>
                    {isHovered && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                            className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
                            <div className="absolute top-8 left-8 w-10 h-10 border-t border-l opacity-40" style={{ borderColor: accent }} />
                            <div className="absolute top-8 right-8 w-10 h-10 border-t border-r opacity-40" style={{ borderColor: accent }} />
                            <div className="absolute bottom-8 left-8 w-10 h-10 border-b border-l opacity-40" style={{ borderColor: accent }} />
                            <div className="absolute bottom-8 right-8 w-10 h-10 border-b border-r opacity-40" style={{ borderColor: accent }} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

const UserDashboard = () => {
    const navigate = useNavigate();
    const { currentUser, loginWithToken, products } = useStore();

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [isFlipped, setIsFlipped] = useState(false);

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

    // Fetch user orders from backend
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getMyOrders();
                setOrders(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
                setOrders([]);
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
        } else {
            setNewName(currentUser.username || '');
            setNewAvatar(currentUser.avatar || '');
            setNewPhone(currentUser.phone || '');
        }
    }, [currentUser, navigate]);

    if (!currentUser) return null;

    // Collected items from orders (Digital Twins + physical purchases) with edition numbers
    const collectedItems = React.useMemo(() => {
        const items = [];
        const addedIds = new Set();
        // Only include items from orders that are NOT pending
        const confirmedOrders = orders.filter(o => o.status !== 'Pending' && o.status !== 'PENDING');

        confirmedOrders.forEach(order => {
            order.items?.forEach(orderItem => {
                const product = products?.find(p => p._id === orderItem.product || p.id === orderItem.product || p.name === orderItem.name);
                const itemId = product?._id || product?.id || orderItem.product;
                if (product && !addedIds.has(itemId)) {
                    addedIds.add(itemId);
                    items.push({
                        ...product,
                        size: orderItem.size,
                        editionNumber: orderItem.editionNumber || null,
                        totalStock: (product.stock || 0) + (product.sold || 0),
                        hasDigitalTwin: !!(product.images?.[2] || product.digitalTwinImage),
                        orderedAt: order.createdAt,
                    });
                }
            });
        });
        return items;
    }, [orders, products]);

    // Vault Assets from API
    const [vaultAssets, setVaultAssets] = useState([]);
    useEffect(() => {
        const loadVaultAssets = async () => {
            try {
                // Fetch User-specific Owned Protocols from server
                const userAssets = await vaultService.getUserVault();
                if (userAssets && userAssets.protocols) {
                    const ownedProtocols = userAssets.protocols
                        .filter(p => p.vaultCard && p.vaultCard.name !== 'Protocol Sync')
                        .map(p => ({
                            id: p._id,
                            _id: p._id,
                            serialNumber: p.serialNumber,
                            name: p.vaultCard?.name || 'Protocol Sync',
                            description: p.vaultCard?.description || '',
                            image: p.vaultCard?.backImage || p.vaultCard?.frontImage,
                            frontImageUrl: p.vaultCard?.frontImage,
                            backImageUrl: p.vaultCard?.backImage,
                            tier: p.vaultCard?.tier || 'rare',
                            totalCodes: p.vaultCard?.codes?.length || 1,
                            isUnlocked: true
                        }));
                    setVaultAssets(ownedProtocols);
                }
            } catch (e) {
                console.error("Failed to load vault assets:", e);
            }
        };

        if (currentUser) {
            loadVaultAssets();
        }
    }, [currentUser]);

    // Derived data mapping
    const userData = {
        name: currentUser?.username || currentUser?.name || "Endura Operator",
        userId: currentUser?._id ? currentUser._id.slice(-8).toUpperCase() : "UNKNOWN",
        credits: currentUser?.credits || 0,
        tier: currentUser?.credits >= 2000 ? "Legendary" : currentUser?.credits >= 1000 ? "Epic" : currentUser?.credits >= 500 ? "Rare" : "Common",
        level: currentUser?.credits >= 2000 ? 4 : currentUser?.credits >= 1000 ? 3 : currentUser?.credits >= 500 ? 2 : 1,
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
            case "Confirmed": return "text-primary";
            case "paid": return "text-green-500";
            default: return "text-gray-500";
        }
    };

    const getTierColor = (tier) => {
        switch (tier) {
            case "Legendary": return "text-purple-500";
            case "Epic": return "text-pink-500";
            case "Rare": return "text-blue-400";
            case "Common": return "text-gray-400";
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
                        <div className="mx-auto w-24 h-24 mb-6 rounded-full border-2 border-primary/40 p-1 overflow-hidden hover:border-primary transition-colors">
                            <img
                                src={userData.avatar}
                                alt="Profile"
                                className="w-full h-full object-cover rounded-full"
                                referrerPolicy="no-referrer"
                                crossOrigin="anonymous"
                                onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.innerHTML = `<div class="w-full h-full rounded-full bg-gradient-to-br from-primary/30 to-accent/20 flex items-center justify-center"><span class="text-2xl text-primary font-black">${userData.name.charAt(0)}</span></div>`; }}
                            />
                        </div>
                    ) : (
                        <div className="mx-auto w-20 h-20 mb-6 rounded-full border-2 border-primary/40 bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center">
                            <span className="text-3xl text-primary font-black">{userData.name.charAt(0)}</span>
                        </div>
                    )}

                    <h1 className="text-4xl md:text-6xl font-heading uppercase tracking-tighter mb-4">
                        {userData.name}
                    </h1>
                    <p className="text-[10px] font-mono text-gray-500 uppercase tracking-[0.4em]">
                        NODE: {userData.userId}
                    </p>
                </motion.div>

                {/* Main Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Left Column - 30-35% */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Rank Status Card */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="glass p-8 border border-white/70 hover:border-accent transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
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
                            className="glass p-8 border border-white/70 hover:border-accent transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
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
                            className="glass p-8 border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
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
                                ) : orders.filter(o => o.status !== 'Pending' && o.status !== 'PENDING').length === 0 ? (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500 text-sm">No confirmed acquisitions found</p>
                                    </div>
                                ) : (
                                    orders.filter(o => o.status !== 'Pending' && o.status !== 'PENDING').map((order, index) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, delay: 0.8 + (index * 0.1) }}
                                            className="p-6 bg-white/[0.02] border border-white/40 hover:border-accent transition-all duration-300"
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
                                                                        <span className="text-gray-300">• {item.name} {item.size && <span className="text-[10px] text-accent/60 font-mono ml-2">[{item.size}]</span>}</span>
                                                                        <span className="text-gray-400">Qty: {item.quantity} × ₹{item.price}</span>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-1">Total Amount</p>
                                                            <p className="text-sm font-mono text-primary">₹{order.totalAmount}</p>
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
                            className="glass p-8 border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
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

                        {/* MY COLLECTION — All Collectables in One Place */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 1.2 }}
                        >
                            <div className="glass p-8 border border-white/70 shadow-[0_0_20px_rgba(255,255,255,0.05)] mt-12 bg-black/40">
                                <h2 className="text-xl font-heading uppercase tracking-widest mb-2 text-[#d4af37] flex items-center gap-3">
                                    <ImageIcon className="w-5 h-5" />
                                    MY COLLECTION
                                </h2>
                                <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-8">
                                    Private Vault • Synchronized Protocols
                                </p>

                                {vaultAssets.length === 0 ? (
                                    <div className="text-center py-12 border border-white/10 bg-white/[0.02]">
                                        <Lock className="w-8 h-8 text-gray-600 mx-auto mb-4" />
                                        <p className="text-gray-400 text-[11px] uppercase tracking-widest leading-loose">
                                            No private protocols found.
                                            <span className="text-gray-600 block mt-2">Visit the Vault to synchronize new archival protocols.</span>
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                        {vaultAssets.map((item, idx) => (
                                            <div
                                                key={`vault-${idx}`}
                                                onClick={() => { setSelectedAsset(item); setIsFlipped(false); }}
                                                className="relative group overflow-hidden border border-white/70 bg-black hover:border-accent transition-colors cursor-pointer rounded-lg shadow-xl"
                                            >
                                                <div className="absolute inset-0 bg-accent/10 blur-[30px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                                <div className="aspect-[3/4] relative p-3 flex items-center justify-center bg-white/[0.02]">
                                                    <img
                                                        src={getImageUrl(item.image || item.images?.[0])}
                                                        alt={`${item.name} Vault Asset`}
                                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10 p-1"
                                                    />
                                                </div>
                                                <div className="p-4 border-t border-white/10 bg-white/5">
                                                    <h3 className="text-xs font-black uppercase text-white truncate mb-1" title={item.name}>
                                                        {item.serialNumber} / {item.totalCodes} {item.name === '1/10' ? '' : item.name}
                                                    </h3>
                                                    <p className="text-accent text-[8px] uppercase tracking-widest font-bold">
                                                        {item.tier} PROTOCOL
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Detail Inspection Modal */}
            <AnimatePresence>
                {selectedAsset && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedAsset(null)}
                            className="absolute inset-0 bg-black/95 backdrop-blur-xl"
                        />

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                             className="relative w-full max-w-lg mx-4 bg-[#050505] border border-white/60 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            {/* Header */}
                             <div className="flex justify-between items-center p-5 md:p-6 border-b border-white/5">
                                 <div>
                                     <h2 className="text-lg md:text-xl font-heading uppercase tracking-widest text-primary">
                                         ARTEFACT INSPECTION
                                     </h2>
                                     <p className="text-[9px] md:text-[10px] font-mono text-white/40 uppercase tracking-widest mt-1">
                                        ARCHIVE_REF: {selectedAsset._id.slice(-8).toUpperCase()}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedAsset(null)}
                                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                             {/* Interactive Artifact View */}
                             <div className="p-4">
                                 <div className="relative aspect-[3/4] max-w-[380px] mx-auto rounded-xl border border-white/40 overflow-hidden bg-black shadow-[0_0_50px_rgba(168,85,247,0.15)] group">
                                     <DressItem item={selectedAsset} vaultReady={true} />
                                     
                                     {/* Subtle UI Corners */}
                                     <div className="absolute inset-0 pointer-events-none border border-white/20 m-1 rounded-lg" />
                                 </div>
                             </div>

                             {/* Telemetry Footer */}
                             <div className="p-6 md:p-8 pt-0 space-y-6">
                                 <div className="text-center space-y-4">
                                     <h3 className="text-xl md:text-2xl font-black uppercase tracking-[0.1em] text-white">
                                         {selectedAsset.serialNumber || '—'}
                                    </h3>
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center justify-center gap-4">
                                            <span className="text-[10px] font-mono tracking-[0.4em] font-bold uppercase" style={{ color: tierAccent(selectedAsset.tier) }}>
                                                TIER: {selectedAsset.tier || 'COMMON'}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-white/20" />
                                            <span className="text-[10px] font-mono tracking-[0.2em] text-white/40 uppercase">
                                                {selectedAsset.serialNumber || '1'} / {selectedAsset.totalCodes || 1}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                                    <p className="text-[11px] text-gray-400 leading-relaxed font-medium text-center italic">
                                        {selectedAsset.description || "Experimental digital fabric synthesized through archival protocol overrides. This asset serves as a high-fidelity collectible within the Endura network."}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UserDashboard;
