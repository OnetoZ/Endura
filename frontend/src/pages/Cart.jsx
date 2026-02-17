
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import { gsap } from 'gsap';

// New Components
import CollectionHero from '../components/collections/CollectionHero';
import CollectionCard from '../components/collections/CollectionCard';
import CartSummary from '../components/collections/CartSummary';
import '../components/collections/collections.css';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, placeOrder, currentUser } = useStore();
    const navigate = useNavigate();

    // States
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Success
    const [useCredits, setUseCredits] = useState(false);

    // Grid Reference for morphing animations
    const gridRef = useRef(null);

    // Derived Logic
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0;
    const taxes = Math.floor(subtotal * 0.05);
    const total = subtotal + shipping + taxes;

    const availableCredits = currentUser?.credits || 0;
    const creditDiscount = useCredits ? Math.min(total, availableCredits) : 0;
    const finalTotal = total - creditDiscount;

    // Filtered Items - Show only physical products
    const filteredItems = cart.filter(item => {
        const isDigital = item.category?.toLowerCase().includes('digital') ||
            item.name?.toLowerCase().includes('nft') ||
            item.isDigital;
        return !isDigital;
    });

    // Carousel Images (for Hero)
    const heroImages = [
        '/cart page/cartimg1.png',
        '/cart page/cartimg2.png',
        '/cart page/cartimg3.png',
        '/cart page/cartimg4.png',
        '/cart page/img1.png',
        '/cart page/img2.png'
    ];

    const handleCheckout = () => {
        if (!currentUser) {
            navigate('/auth');
            return;
        }
        setIsCheckingOut(true);
        // Simulate cinematic processing
        setTimeout(() => {
            setStep(2);
            setIsCheckingOut(false);
        }, 1500);
    };

    const confirmPayment = () => {
        setIsCheckingOut(true);
        setTimeout(() => {
            placeOrder(useCredits ? creditDiscount : 0);
            setStep(3);
            setIsCheckingOut(false);
        }, 2000);
    };

    // Transition effect when switching components
    useEffect(() => {
        if (!gridRef.current) return;
        gsap.fromTo(gridRef.current,
            { opacity: 0, scale: 0.98, filter: 'blur(10px)' },
            { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: "power2.out" }
        );
    }, []);

    if (cart.length === 0 && step !== 3) {
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

    if (step === 3) {
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

                    <h2 className="text-4xl font-heading uppercase mb-6 text-white tracking-widest">Protocol Verified</h2>
                    <p className="text-gray-400 font-body text-sm mb-10 leading-relaxed">
                        Your acquisitions have been synchronized to the neural vault. <br />
                        Physical manifestations are now entering the logistics queue.
                        Tracking signature: <span className="text-green-500 font-mono ml-1">#ENDU-{Math.floor(Math.random() * 90000) + 10000}</span>
                    </p>

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

            {/* Cinematic Intro */}
            <CollectionHero images={heroImages} />

            {/* Main Chamber - High Z-Index ensuring items are always clickable */}
            <div className="relative z-20 container mx-auto max-w-7xl px-6 pt-32 pb-40">

                {/* Status Bar */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-12 px-2 gap-6 relative z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-1">IDENTITY_PROTOCOL</span>
                            <span className="text-xl font-heading text-white tracking-widest uppercase">
                                physical <span className="text-accent/60">LAYER</span>
                            </span>
                        </div>
                        <div className="h-12 w-[1px] bg-white/10 hidden md:block" />
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono text-gray-600 uppercase tracking-[0.4em] mb-1">ASSET_REGISTER</span>
                            <span className="text-xl font-heading text-white tracking-widest uppercase">{filteredItems.length} DETECTED</span>
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

                {/* Scrolled Items List */}
                <div
                    ref={gridRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
                    style={{ perspective: "2000px" }}
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredItems.map(item => (
                            <CollectionCard
                                key={item.id}
                                item={item}
                                type="physical"
                                onRemove={removeFromCart}
                                onUpdateQuantity={(id, delta) => updateCartQuantity(id, delta)}
                            />
                        ))}
                    </AnimatePresence>
                </div>

                {/* Static Summary Section - Positioned at end of content */}
                <div className="mt-32 pt-20 border-t border-white/5 flex justify-center">
                    <AnimatePresence>
                        {step === 1 && (
                            <CartSummary
                                subtotal={subtotal}
                                total={finalTotal}
                                credits={availableCredits}
                                useCredits={useCredits}
                                onToggleCredits={() => setUseCredits(!useCredits)}
                                onCheckout={handleCheckout}
                                isCheckingOut={isCheckingOut}
                            />
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Payment Modal */}
            <AnimatePresence>
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="glass max-w-md w-full p-10 border-white/10"
                        >
                            <h3 className="text-2xl font-heading mb-8 border-b border-white/5 pb-4 uppercase">Secure Payment</h3>

                            <div className="space-y-6 mb-10">
                                <div className="p-5 bg-white/5 border border-white/10 rounded-xl">
                                    <p className="text-[10px] font-mono text-primary-light uppercase tracking-widest mb-4">Neural Payment Linked</p>
                                    <div className="flex justify-between items-center mb-6">
                                        <div className="flex gap-2">
                                            <div className="w-8 h-5 bg-white/20 rounded" />
                                            <div className="w-8 h-5 bg-white/20 rounded" />
                                        </div>
                                        <span className="text-xs font-mono">**** 4242</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 uppercase tracking-widest text-[9px]">Amount Due</span>
                                        <span className="text-accent font-heading">₹{finalTotal}</span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between text-[10px] font-mono text-gray-500 uppercase">
                                        <span>Encryption Status</span>
                                        <span className="text-green-500">ACTIVE</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                            className="w-1/2 h-full bg-primary-light"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                <button
                                    onClick={confirmPayment}
                                    disabled={isCheckingOut}
                                    className="w-full py-4 bg-accent text-black font-heading font-black uppercase tracking-[0.2em] hover:bg-white transition-all disabled:opacity-50"
                                >
                                    {isCheckingOut ? 'VERIFYING...' : 'CONFIRM TRANSACTION'}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="w-full py-3 text-[10px] font-heading text-gray-500 hover:text-white uppercase tracking-widest transition-colors"
                                >
                                    ABORT
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Cart;
