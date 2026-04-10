
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { gsap } from 'gsap';
import { toast } from 'react-hot-toast';
import { MapPin, Package, ChevronRight, AlertTriangle, CheckCircle, Plus } from 'lucide-react';
import { handlePayment } from '../utils/payment';

// Components
import CollectionCard from '../components/collections/CollectionCard';
import CartSummary from '../components/collections/CartSummary';
import '../components/collections/collections.css';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, placeOrder, placeRazorpayOrder, verifyRazorpayPayment, currentUser } = useStore();
    const navigate = useNavigate();

    // Steps: 1=Review, 2=Address, 3=Confirm, 4=Success
    const [step, setStep] = useState(1);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [useCredits, setUseCredits] = useState(false);
    const [orderError, setOrderError] = useState('');
    const [placedOrder, setPlacedOrder] = useState(null);

    // Address state
    const [selectedAddressIdx, setSelectedAddressIdx] = useState(0);
    const [showNewAddress, setShowNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState({
        fullName: '', address: '', city: '', postalCode: '', country: 'India', phone: ''
    });

    // Grid Reference for morphing animations
    const gridRef = useRef(null);

    const isDigitalCartItem = (item) => {
        return item.category?.toLowerCase().includes('digital') ||
            item.name?.toLowerCase().includes('nft') ||
            item.isDigital;
    };

    const checkoutItems = cart;

    // Derived Logic
    const subtotal = checkoutItems.reduce((acc, item) => {
        const price = item.price || item.product?.price || 0;
        const qty = item.quantity || 0;
        return acc + (price * qty);
    }, 0);
    const shipping = 0;
    const total = subtotal + shipping;

    const availableCredits = currentUser?.credits || 0;
    const creditDiscount = useCredits ? Math.min(total, availableCredits) : 0;
    const finalTotal = total - creditDiscount;

    const userAddresses = currentUser?.addresses || [];

    // Pre-fill new address phone from user profile
    useEffect(() => {
        if (currentUser?.phone && !newAddress.phone) {
            setNewAddress(prev => ({ ...prev, phone: currentUser.phone }));
        }
        if (currentUser?.username && !newAddress.fullName) {
            setNewAddress(prev => ({ ...prev, fullName: currentUser.username }));
        }
    }, [currentUser]);

    const handleCheckout = () => {
        if (!currentUser) {
            navigate('/auth');
            return;
        }
        if (checkoutItems.length === 0) {
            setOrderError('Your cart is empty. Add at least one item before starting Razorpay checkout.');
            return;
        }
        setOrderError('');
        // Move to address step
        setStep(2);
    };

    const handleAddressSelect = () => {
        const addr = getSelectedAddress();
        
        console.log('[Cart] Validating address:', addr);

        // Comprehensive validation for both new and existing addresses
        const requiredFields = ['fullName', 'address', 'city', 'postalCode'];
        const missing = requiredFields.filter(f => !addr?.[f] || String(addr[f]).trim() === '');
        
        if (missing.length > 0) {
            setOrderError(`Please complete your address. Missing: ${missing.join(', ')}`);
            // If they are using an existing address that's incomplete, switch to "Add New" mode
            // or show an alert.
            if (!showNewAddress && userAddresses.length > 0) {
                toast.error('The selected address is incomplete. Please add a new one or edit it.');
            }
            return;
        }

        setOrderError('');
        setStep(3); // Go to confirmation
    };

    const getSelectedAddress = () => {
        if (showNewAddress || userAddresses.length === 0) {
            return newAddress;
        }
        const selected = userAddresses[selectedAddressIdx];
        // Ensure country is always present for selected address
        if (selected && !selected.country) {
            selected.country = 'India';
        }
        return selected;
    };

    const confirmOrder = async () => {
        setIsCheckingOut(true);
        setOrderError('');

        try {
            if (checkoutItems.length === 0) {
                throw new Error('Your cart is empty. Add at least one item before creating a Razorpay order.');
            }

            const shippingAddr = getSelectedAddress();
            const orderItems = checkoutItems.map(item => ({
                asset: item._id || item.id,
                name: item.name,
                image: item.image || '',
                quantity: item.quantity,
                price: item.price,
                selectedSize: item.selectedSize
            }));

            const shippingData = {
                fullName: shippingAddr.fullName,
                address: shippingAddr.address,
                city: shippingAddr.city,
                postalCode: shippingAddr.postalCode,
                country: shippingAddr.country || 'India',
                phone: shippingAddr.phone || currentUser?.phone || '',
            };

            console.log('[Cart] Starting payment flow with payload:', {
                orderItemsCount: orderItems.length,
                shippingData,
            });

            await handlePayment({
                createOrder: () => placeRazorpayOrder({
                    orderItems,
                    shippingAddress: shippingData,
                }),
                verifyPayment: (verifyPayload) => verifyRazorpayPayment(verifyPayload),
                customer: {
                    name: shippingData.fullName,
                    email: currentUser?.email,
                    contact: shippingData.phone,
                },
                onSuccess: ({ orderResponse }) => {
                    const brandedOrderId = orderResponse?.orderId;
                    const paidAmount = Number(orderResponse?.amount || 0) / 100;
                    toast.success('Payment successful!');
                    navigate('/order-success', {
                        state: {
                            orderId: brandedOrderId,
                            amount: paidAmount,
                        },
                    });
                    setIsCheckingOut(false);
                },
                onFailure: ({ stage, error }) => {
                    const message = error?.response?.data?.message ||
                        error?.description ||
                        error?.message ||
                        'Payment failed';

                    console.error(`[Cart] Payment failed at stage: ${stage}`, error);
                    setOrderError(message);
                    toast.error(message);
                    navigate('/order-failed', { state: { message } });
                    setIsCheckingOut(false);
                },
                onDismiss: () => {
                    setIsCheckingOut(false);
                },
            });

        } catch (err) {
            const message = err?.response?.data?.message || err?.message || 'Failed to initialize payment.';
            console.error('Razorpay Error:', err?.response?.data || err);
            setOrderError(message);
            toast.error(message);
            setIsCheckingOut(false);
        }
    };

    // Transition effect when switching components
    useEffect(() => {
        if (!gridRef.current) return;
        gsap.fromTo(gridRef.current,
            { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: "power2.out" }
        );
    }, []);

    // Empty cart view
    if (cart.length === 0 && step !== 4) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
                <div className="relative mb-12">
                    <div className="absolute inset-0 bg-primary blur-[100px] opacity-20 animate-pulse" />
                    <svg className="relative w-24 h-24 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="0.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                </div>
                <h2 className="text-4xl font-heading uppercase mb-4 text-white/40 tracking-tighter">Your Cart is Empty</h2>
                <p className="text-gray-600 font-mono text-[10px] tracking-widest uppercase mb-12">No identity signatures detected in your Cart.</p>
                <Link to="/collections" className="group relative px-12 py-4 glass border-white/10 hover:border-primary transition-all overflow-hidden">
                    <div className="absolute inset-0 bg-primary/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                    <span className="relative z-10 text-[10px] font-heading font-black uppercase tracking-[0.4em] text-white">Back to Collections</span>
                </Link>
            </div>
        );
    }

    // Success view (Step 4)
    if (step === 4) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center p-6">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="glass p-12 max-w-2xl w-full text-center border-green-500/30 bg-green-500/5 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500 to-transparent" />

                    <div className="w-24 h-24 bg-green-500/20 border border-green-500/50 rounded-full flex items-center justify-center mx-auto mb-10 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    <h2 className="text-4xl font-heading uppercase mb-6 text-white tracking-widest">Order Confirmed</h2>
                    <p className="text-gray-400 font-body text-sm mb-4 leading-relaxed">
                        Your order has been placed successfully and is now being processed. <br />
                        Payment Mode: <span className="text-accent font-bold">ONLINE (RAZORPAY)</span>
                    </p>
                    {placedOrder && (
                        <div className="mb-8 space-y-2">
                            <p className="text-gray-400 text-sm">
                                Order ID: <span className="text-green-500 font-mono">{placedOrder.orderId || placedOrder._id}</span>
                            </p>
                            <p className="text-gray-400 text-sm">
                                Total Amount: <span className="text-accent font-bold">₹{placedOrder.totalAmount}</span>
                            </p>
                            <p className="text-gray-400 text-sm">
                                Status: <span className="text-yellow-500 font-bold uppercase">{placedOrder.status}</span>
                            </p>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-center gap-6">
                        <Link to="/collections" className="px-10 py-4 glass border-white/10 text-[10px] font-heading uppercase tracking-widest hover:bg-white/5 transition">
                            Back to Collection
                        </Link>
                        <Link to="/dashboard" className="px-10 py-4 bg-white text-black text-[10px] font-heading font-black uppercase tracking-widest hover:bg-primary hover:text-white transition shadow-[0_10px_30px_rgba(255,255,255,0.1)]">
                            User Dashboard
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-white relative overflow-hidden">
            {/* Global Atmosphere Layers */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 via-transparent to-transparent opacity-30" />
                <div className="absolute inset-0 film-grain opacity-10" />
            </div>

            {/* Main Chamber */}
            <div className="relative z-20 container mx-auto max-w-7xl px-6 pt-32 pb-40">
                {/* Step Progress Indicator */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[
                        { num: 1, label: 'CART' },
                        { num: 2, label: 'ADDRESS' },
                        { num: 3, label: 'CONFIRM' },
                    ].map((s, i) => (
                        <React.Fragment key={s.num}>
                            <div
                                className={`flex items-center gap-2 cursor-pointer ${step >= s.num ? 'opacity-100' : 'opacity-30'}`}
                                onClick={() => { if (s.num < step) setStep(s.num); }}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold border ${step >= s.num ? 'border-primary bg-primary/20 text-primary' : 'border-white/20 text-gray-500'
                                    }`}>
                                    {step > s.num ? <CheckCircle className="w-4 h-4" /> : s.num}
                                </div>
                                <span className="text-[9px] font-mono uppercase tracking-widest hidden sm:inline">{s.label}</span>
                            </div>
                            {i < 2 && <div className={`w-12 h-[1px] ${step > s.num ? 'bg-primary' : 'bg-white/10'}`} />}
                        </React.Fragment>
                    ))}
                </div>

                {/* Error Display */}
                {orderError && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8 p-4 bg-red-500/10 border border-red-500/30 flex items-center gap-3 max-w-2xl mx-auto"
                    >
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                        <p className="text-red-400 text-sm">{orderError}</p>
                        <button onClick={() => setOrderError('')} className="ml-auto text-red-500 text-sm hover:text-white">✕</button>
                    </motion.div>
                )}

                {/* STEP 1: Cart Review */}
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            {/* Status Bar */}
                            <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-2 gap-6 relative z-10">
                                <div className="flex items-center gap-6">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-1">IDENTITY_PROTOCOL</span>
                                        <span className="text-xl font-heading text-white tracking-widest uppercase">
                                            checkout <span className="text-accent/60">LAYER</span>
                                        </span>
                                    </div>
                                    <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-1">ASSET_REGISTER</span>
                                        <span className="text-xl font-heading text-white tracking-widest uppercase">{checkoutItems.length} DETECTED</span>
                                    </div>
                                </div>

                                <button
                                    onClick={clearCart}
                                    className="group flex items-center gap-3 text-[9px] font-mono text-red-500/30 hover:text-red-500 uppercase tracking-[0.5em] transition-all"
                                >
                                    <div className="w-1.5 h-1.5 rounded-full border border-red-500/20 group-hover:bg-red-500 transition-all shadow-[0_0_10px_rgba(239,68,68,0.3)]" />
                                    Purge Chamber
                                </button>
                            </div>

                            {/* Two Column Layout */}
                            <div className="cart-container grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-8 lg:gap-16 items-start">
                                {/* Left Column - Cart Items */}
                                <div className="cart-items">
                                    <div
                                        ref={gridRef}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                                        style={{ perspective: "2000px" }}
                                    >
                                        <AnimatePresence mode='popLayout'>
                                            {checkoutItems.map(item => (
                                                <CollectionCard
                                                    key={`${item._id || item.id}-${item.selectedSize}`}
                                                    item={{ ...item, image: item.image || item.frontImage }}
                                                    type={isDigitalCartItem(item) ? 'digital' : 'physical'}
                                                    onRemove={removeFromCart}
                                                    onUpdateQuantity={(id, delta, size) => updateCartQuantity(id, delta, size)}
                                                />
                                            ))}
                                        </AnimatePresence>
                                    </div>
                                </div>

                                {/* Right Column - Summary */}
                                <div className="cart-summary lg:sticky lg:top-32 h-fit">
                                    <CartSummary
                                        subtotal={subtotal}
                                        total={finalTotal}
                                        credits={availableCredits}
                                        useCredits={useCredits}
                                        onToggleCredits={() => setUseCredits(!useCredits)}
                                        onCheckout={handleCheckout}
                                        isCheckingOut={isCheckingOut}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: Address Selection */}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="glass p-8 border border-white/10">
                                <h3 className="text-2xl font-heading uppercase tracking-widest mb-2 flex items-center gap-3">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    Shipping Address
                                </h3>
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-8">
                                    Select or add a delivery address
                                </p>

                                {/* Existing Addresses */}
                                {userAddresses.length > 0 && !showNewAddress && (
                                    <div className="space-y-4 mb-6">
                                        {userAddresses.map((addr, idx) => (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedAddressIdx(idx)}
                                                className={`p-5 border cursor-pointer transition-all ${selectedAddressIdx === idx ? 'border-primary bg-primary/5' : 'border-white/10 hover:border-white/20'}`}
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <p className="font-bold text-sm mb-1">{addr.fullName}</p>
                                                        <p className="text-gray-400 text-xs">{addr.address}</p>
                                                        <p className="text-gray-400 text-xs">{addr.city}, {addr.postalCode}</p>
                                                        <p className="text-gray-400 text-xs">{addr.country}</p>
                                                        {addr.phone && <p className="text-gray-500 text-xs mt-1">📞 {addr.phone}</p>}
                                                    </div>
                                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressIdx === idx ? 'border-primary' : 'border-gray-600'}`}>
                                                        {selectedAddressIdx === idx && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                                                    </div>
                                                </div>
                                                {addr.isDefault && (
                                                    <span className="text-[8px] font-mono text-primary uppercase tracking-widest mt-2 inline-block">DEFAULT</span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Add New Address Button */}
                                {userAddresses.length > 0 && !showNewAddress && (
                                    <button
                                        onClick={() => setShowNewAddress(true)}
                                        className="w-full p-4 border border-dashed border-white/20 hover:border-primary/50 text-[10px] font-heading uppercase tracking-widest text-gray-400 hover:text-primary flex items-center justify-center gap-2 transition-all mb-6"
                                    >
                                        <Plus className="w-4 h-4" /> Add New Address
                                    </button>
                                )}

                                {/* New Address Form */}
                                {(showNewAddress || userAddresses.length === 0) && (
                                    <div className="space-y-4 mb-6">
                                        {userAddresses.length > 0 && (
                                            <button
                                                onClick={() => setShowNewAddress(false)}
                                                className="text-[10px] font-mono text-gray-500 hover:text-primary uppercase tracking-widest mb-2"
                                            >
                                                ← Use existing address
                                            </button>
                                        )}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.fullName}
                                                    onChange={e => setNewAddress(p => ({ ...p, fullName: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                    placeholder="Your full name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Phone</label>
                                                <input
                                                    type="tel"
                                                    value={newAddress.phone}
                                                    onChange={e => setNewAddress(p => ({ ...p, phone: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                    placeholder="+91 XXXXXXXXXX"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Street Address *</label>
                                            <input
                                                type="text"
                                                value={newAddress.address}
                                                onChange={e => setNewAddress(p => ({ ...p, address: e.target.value }))}
                                                className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                placeholder="House no, street, area"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">City *</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.city}
                                                    onChange={e => setNewAddress(p => ({ ...p, city: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                    placeholder="City"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Postal Code *</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.postalCode}
                                                    onChange={e => setNewAddress(p => ({ ...p, postalCode: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                    placeholder="600001"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[8px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2">Country</label>
                                                <input
                                                    type="text"
                                                    value={newAddress.country}
                                                    onChange={e => setNewAddress(p => ({ ...p, country: e.target.value }))}
                                                    className="w-full bg-white/5 border border-white/10 px-4 py-3 focus:border-primary outline-none text-sm"
                                                    placeholder="India"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Navigation */}
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-4 border border-white/10 text-[10px] font-heading uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        ← Back to Cart
                                    </button>
                                    <button
                                        onClick={handleAddressSelect}
                                        className="flex-[1.5] py-4 bg-primary text-white font-heading font-black uppercase tracking-widest text-[10px] hover:bg-primary-light transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Order Confirmation */}
                    {step === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="max-w-2xl mx-auto"
                        >
                            <div className="glass p-8 border border-white/10">
                                <h3 className="text-2xl font-heading uppercase tracking-widest mb-2 flex items-center gap-3">
                                    <Package className="w-5 h-5 text-accent" />
                                    Order Confirmation
                                </h3>
                                <p className="text-[10px] font-mono text-gray-500 uppercase tracking-widest mb-8">
                                    Review and confirm your order details
                                </p>

                                {/* Order Items */}
                                <div className="mb-8">
                                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">Items ({checkoutItems.length})</p>
                                    <div className="space-y-3">
                                        {checkoutItems.map(item => (
                                            <div key={item._id || item.id} className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5">
                                                {item.image && (
                                                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover border border-white/10" />
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold truncate">{item.name}</p>
                                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest italic">
                                                        Qty: {item.quantity} {item.selectedSize ? `| Size: ${item.selectedSize}` : ''}
                                                    </p>
                                                </div>
                                                <p className="text-sm font-mono text-accent">₹{item.price * item.quantity}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="mb-8 p-5 bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-3">Shipping Address</p>
                                    {(() => {
                                        const addr = getSelectedAddress();
                                        return (
                                            <div className="text-sm">
                                                <p className="font-bold">{addr.fullName}</p>
                                                <p className="text-gray-400">{addr.address}</p>
                                                <p className="text-gray-400">{addr.city}, {addr.postalCode}</p>
                                                <p className="text-gray-400">{addr.country}</p>
                                                {addr.phone && <p className="text-gray-500 mt-1">📞 {addr.phone}</p>}
                                            </div>
                                        );
                                    })()}
                                    <button
                                        onClick={() => setStep(2)}
                                        className="text-[9px] font-mono text-primary uppercase tracking-widest mt-3 hover:text-accent"
                                    >
                                        [ CHANGE ]
                                    </button>
                                </div>

                                {/* Payment Method */}
                                <div className="mb-8 p-5 bg-white/[0.02] border border-white/5">
                                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-3">Payment Method</p>
                                    <div className="flex items-center gap-3">
                                        <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                                            <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                                        </div>
                                        <span className="text-sm font-bold text-white uppercase tracking-widest">Secure Online Payment (Razorpay)</span>
                                    </div>
                                    <p className="text-[10px] text-gray-500 mt-2 ml-8 italic">Pay securely via Cards, UPI, Netbanking, or Wallets.</p>
                                </div>

                                {/* Price Breakdown */}
                                <div className="mb-8 space-y-3">
                                    <p className="text-[9px] font-mono text-gray-500 uppercase tracking-widest mb-4">Price Breakdown</p>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Subtotal</span>
                                        <span className="text-white font-mono">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-400">Shipping</span>
                                        <span className="text-green-400 font-mono">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                    </div>

                                    {useCredits && creditDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-primary">Credits Applied</span>
                                            <span className="text-primary font-mono">-₹{creditDiscount}</span>
                                        </div>
                                    )}
                                    <div className="h-[1px] bg-white/10 my-2" />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span className="text-white">Total</span>
                                        <span className="text-accent font-heading">₹{finalTotal}</span>
                                    </div>
                                </div>

                                {/* Navigation */}
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setStep(2)}
                                        className="flex-1 py-4 border border-white/10 text-[10px] font-heading uppercase tracking-widest text-gray-400 hover:text-white hover:border-white/30 transition-all"
                                    >
                                        ← Back
                                    </button>
                                    <button
                                        onClick={confirmOrder}
                                        disabled={isCheckingOut}
                                        className="flex-[1.5] py-4 bg-primary text-white font-heading font-black uppercase tracking-widest text-xs hover:bg-primary-light transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isCheckingOut ? 'PROCESSING...' : `PAY ₹${finalTotal}`}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default Cart;
