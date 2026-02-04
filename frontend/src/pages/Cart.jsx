
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

const Cart = () => {
    const { cart, removeFromCart, updateCartQuantity, clearCart, placeOrder, currentUser } = useStore();
    const navigate = useNavigate();
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [step, setStep] = useState(1); // 1: Review, 2: Payment, 3: Success

    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const shipping = 0; // Free shipping for MVP
    const taxes = Math.floor(subtotal * 0.05); // 5% tax
    const total = subtotal + shipping + taxes;

    const availableCredits = currentUser?.credits || 0;
    const [useCredits, setUseCredits] = useState(false);
    const creditDiscount = useCredits ? Math.min(total, availableCredits) : 0;
    const finalTotal = total - creditDiscount;

    const handleCheckout = () => {
        if (!currentUser) {
            navigate('/auth');
            return;
        }
        setStep(2);
    };

    const confirmPayment = () => {
        setIsCheckingOut(true);
        // Simulate processing delay
        setTimeout(() => {
            placeOrder(useCredits ? creditDiscount : 0);
            setStep(3);
            setIsCheckingOut(false);
        }, 2000);
    };

    if (cart.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
                <svg className="w-16 h-16 text-gray-700 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                <h2 className="text-3xl font-oswald font-bold uppercase mb-4 text-gray-500">Cart Empty</h2>
                <Link to="/shop" className="px-8 py-3 bg-white/5 border border-white/10 hover:border-primary text-[10px] font-black uppercase tracking-widest transition-all">
                    Access Inventory
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-28 pb-20 px-6">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl md:text-6xl font-oswald font-bold uppercase mb-12 tracking-tighter">
                    Transaction <span className="text-primary italic">Protocol</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-8">
                        {step === 3 ? (
                            <div className="glass p-12 text-center border-green-500/30 bg-green-500/5">
                                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                                    <svg className="w-10 h-10 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-oswald font-bold uppercase mb-4 text-white">Transaction Verified</h2>
                                <p className="text-gray-400 text-sm mb-8">
                                    Your digital assets are being synchronized. Physical shipment data has been dispatched to logistics.
                                </p>
                                <div className="flex justify-center gap-4">
                                    <Link to="/shop" className="px-8 py-3 bg-white/5 text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition">
                                        Continue Browsing
                                    </Link>
                                    <Link to="/dashboard" className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest hover:bg-primary-light transition">
                                        View Dashboard
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            cart.map(item => (
                                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-6 p-6 border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all group">
                                    <div className="w-full sm:w-32 aspect-square bg-neutral-900 border border-white/5">
                                        <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={item.name} />
                                    </div>
                                    <div className="flex-grow text-center sm:text-left">
                                        <h3 className="text-xl font-oswald font-bold uppercase mb-1">{item.name}</h3>
                                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">{item.category}</p>
                                        <div className="flex items-center justify-center sm:justify-start gap-4">
                                            <button
                                                onClick={() => updateCartQuantity(item.id, -1)}
                                                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
                                            >-</button>
                                            <span className="font-mono text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateCartQuantity(item.id, 1)}
                                                className="w-8 h-8 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
                                            >+</button>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-accent mb-2">₹{item.price * item.quantity}</p>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-[10px] text-red-500 uppercase font-black tracking-widest hover:text-red-400"
                                        >
                                            Terminate
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Order Summary */}
                    {step !== 3 && (
                        <div className="lg:col-span-1">
                            <div className="glass p-8 border-white/10 sticky top-32">
                                <h3 className="text-xl font-oswald font-bold uppercase mb-8 border-b border-white/10 pb-4">
                                    {step === 1 ? 'Manifest Summary' : 'Secure Payment'}
                                </h3>

                                <div className="space-y-4 mb-8 text-sm text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Subtotal</span>
                                        <span className="text-white font-mono">₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Shipping</span>
                                        <span className="text-white font-mono">FREE</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Taxes (5%)</span>
                                        <span className="text-white font-mono">₹{taxes}</span>
                                    </div>
                                    {useCredits && (
                                        <div className="flex justify-between text-accent">
                                            <span>Credits Applied</span>
                                            <span className="font-mono">- ₹{creditDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between pt-4 border-t border-white/10 text-lg text-white font-bold">
                                        <span>Total</span>
                                        <span className="font-mono text-accent">₹{finalTotal}</span>
                                    </div>
                                </div>

                                {step === 1 ? (
                                    <>
                                        {currentUser && availableCredits > 0 && (
                                            <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded">
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="checkbox"
                                                        id="credits"
                                                        checked={useCredits}
                                                        onChange={(e) => setUseCredits(e.target.checked)}
                                                        className="accent-primary w-4 h-4"
                                                    />
                                                    <label htmlFor="credits" className="text-xs uppercase font-bold tracking-widest text-primary-light cursor-pointer select-none">
                                                        Use {availableCredits} Credits
                                                    </label>
                                                </div>
                                            </div>
                                        )}
                                        <button
                                            onClick={handleCheckout}
                                            className="w-full py-4 bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                                        >
                                            Proceed to Checkpoint
                                        </button>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-white/5 border border-white/10 rounded">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Payment Mockup</p>
                                            <div className="flex gap-2 mb-4">
                                                <div className="w-8 h-5 bg-white/10 rounded"></div>
                                                <div className="w-8 h-5 bg-white/10 rounded"></div>
                                                <div className="w-8 h-5 bg-white/10 rounded"></div>
                                            </div>
                                            <p className="text-xs text-gray-400">**** **** **** 4242</p>
                                        </div>

                                        <button
                                            onClick={confirmPayment}
                                            disabled={isCheckingOut}
                                            className="w-full py-4 bg-accent text-black font-black uppercase tracking-widest text-xs hover:bg-accent-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                        >
                                            {isCheckingOut ? (
                                                <>
                                                    <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </>
                                            ) : 'Confirm Transaction'}
                                        </button>
                                        <button
                                            onClick={() => setStep(1)}
                                            className="w-full text-[10px] text-gray-500 uppercase tracking-widest font-bold hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
